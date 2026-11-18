import test from 'node:test';
import assert from 'node:assert/strict';
import { Hono } from 'hono';
import type Redis from 'ioredis';
import { createIdempotencyStore } from '../idempotency-store';
import { runWithIdempotency } from '../../middleware/idempotency';

test('IdempotencyStore (in-memory): acquire, in-flight conflict, complete, and release', async () => {
  const store = createIdempotencyStore({ useRedis: () => false, redisClient: null });
  const key = 'idem:test:order:1';

  const first = await store.acquire(key, 'hash-abc', 60);
  assert.equal(first.acquired, true);

  // Second acquire while IN_PROGRESS returns acquired: false with IN_PROGRESS record
  const second = await store.acquire(key, 'hash-abc', 60);
  assert.equal(second.acquired, false);
  if (!second.acquired) {
    assert.equal(second.record.status, 'IN_PROGRESS');
    assert.equal(second.record.requestHash, 'hash-abc');
  }

  await store.complete(key, 201, { success: true, orderId: 'ORD-1' }, 60);

  // Third acquire after complete returns COMPLETED record with saved response
  const third = await store.acquire(key, 'hash-abc', 60);
  assert.equal(third.acquired, false);
  if (!third.acquired) {
    assert.equal(third.record.status, 'COMPLETED');
    assert.equal(third.record.statusCode, 201);
    assert.deepEqual(third.record.body, { success: true, orderId: 'ORD-1' });
  }

  await store.release(key);
  const afterRelease = await store.acquire(key, 'hash-abc', 60);
  assert.equal(afterRelease.acquired, true);
});

test('IdempotencyStore (Redis): uses Redis SET NX EX and falls back to memory when Redis throws', async () => {
  const kv = new Map<string, string>();
  let shouldThrow = false;

  const mockRedis = {
    async set(key: string, value: string, ...args: unknown[]) {
      if (shouldThrow) throw new Error('ECONNREFUSED');
      const isNx = args.includes('NX');
      if (isNx && kv.has(key)) return null;
      kv.set(key, value);
      return 'OK';
    },
    async get(key: string) {
      if (shouldThrow) throw new Error('ECONNREFUSED');
      return kv.get(key) ?? null;
    },
    async del(key: string) {
      if (shouldThrow) throw new Error('ECONNREFUSED');
      return kv.delete(key) ? 1 : 0;
    },
  } as unknown as Redis;

  const store = createIdempotencyStore({
    useRedis: () => true,
    redisClient: mockRedis,
  });

  // Redis ON path
  const acq1 = await store.acquire('idem:redis:1', 'h1', 60);
  assert.equal(acq1.acquired, true);
  assert.equal(kv.has('idem:redis:1'), true);

  await store.complete('idem:redis:1', 200, { ok: true }, 60);
  const acq2 = await store.acquire('idem:redis:1', 'h1', 60);
  assert.equal(acq2.acquired, false);
  if (!acq2.acquired) {
    assert.equal(acq2.record.status, 'COMPLETED');
    assert.deepEqual(acq2.record.body, { ok: true });
  }

  // Redis OFF / throwing error -> graceful fallback to in-memory without crash
  shouldThrow = true;
  const fallbackAcq = await store.acquire('idem:redis:2', 'h2', 60);
  assert.equal(fallbackAcq.acquired, true);
  await store.complete('idem:redis:2', 201, { fallback: true }, 60);

  const fallbackReplay = await store.acquire('idem:redis:2', 'h2', 60);
  assert.equal(fallbackReplay.acquired, false);
  if (!fallbackReplay.acquired) {
    assert.equal(fallbackReplay.record.status, 'COMPLETED');
    assert.deepEqual(fallbackReplay.record.body, { fallback: true });
  }
});

test('runWithIdempotency middleware: replay (201 + header), payload conflict (422), and in-flight (409)', async () => {
  const app = new Hono();
  let executionCount = 0;

  app.post('/api/test-mutation', async (c) => {
    const rawBody = await c.req.text();
    return runWithIdempotency(c, rawBody, async () => {
      executionCount += 1;
      return {
        status: 201,
        body: { success: true, count: executionCount, payload: JSON.parse(rawBody) },
      };
    });
  });

  const payload = JSON.stringify({ item: 'book-1', qty: 1 });
  const key = `test-key-${Date.now()}`;

  // 1. First request executes handler
  const res1 = await app.request('/api/test-mutation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
    body: payload,
  });
  assert.equal(res1.status, 201);
  assert.equal(res1.headers.get('Idempotency-Replayed'), null);
  const json1 = (await res1.json()) as { success: boolean; count: number };
  assert.equal(json1.count, 1);

  // 2. Replay with same key & same payload returns cached 201 + Idempotency-Replayed: true
  const res2 = await app.request('/api/test-mutation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
    body: payload,
  });
  assert.equal(res2.status, 201);
  assert.equal(res2.headers.get('Idempotency-Replayed'), 'true');
  const json2 = (await res2.json()) as { success: boolean; count: number };
  assert.equal(json2.count, 1);
  assert.equal(executionCount, 1);

  // 3. Same key with DIFFERENT payload returns 422 IDEMPOTENCY_CONFLICT
  const resConflict = await app.request('/api/test-mutation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
    body: JSON.stringify({ item: 'book-2', qty: 2 }),
  });
  assert.equal(resConflict.status, 422);
  const jsonConflict = (await resConflict.json()) as { code: string };
  assert.equal(jsonConflict.code, 'IDEMPOTENCY_CONFLICT');
});

test('runWithIdempotency middleware: concurrent in-flight request returns 409 IDEMPOTENCY_IN_PROGRESS', async () => {
  const app = new Hono();
  let releaseHandler!: () => void;
  const gate = new Promise<void>((resolve) => {
    releaseHandler = resolve;
  });

  app.post('/api/slow-mutation', async (c) => {
    const rawBody = await c.req.text();
    return runWithIdempotency(c, rawBody, async () => {
      await gate;
      return { status: 201, body: { success: true } };
    });
  });

  const key = `inflight-key-${Date.now()}`;
  const req1Promise = app.request('/api/slow-mutation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
    body: JSON.stringify({ a: 1 }),
  });

  // Give req1 a microtask tick to acquire the lock
  await new Promise((r) => setTimeout(r, 15));

  const res2 = await app.request('/api/slow-mutation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
    body: JSON.stringify({ a: 1 }),
  });
  assert.equal(res2.status, 409);
  const json2 = (await res2.json()) as { code: string };
  assert.equal(json2.code, 'IDEMPOTENCY_IN_PROGRESS');

  releaseHandler();
  const res1 = await req1Promise;
  assert.equal(res1.status, 201);
});

