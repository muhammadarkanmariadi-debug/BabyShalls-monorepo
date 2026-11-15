import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import type { NextFunction, Request, Response } from 'express';
import { redis } from '../redis.js';
import { createIdempotencyStore } from '../idempotency-store.js';
import { idempotencyMiddleware } from '../../middleware/idempotency.middleware.js';

after(() => {
  redis.disconnect();
});

function createMockReq(overrides: Partial<Request> & { user?: { id: string } } = {}): Request {
  const headers: Record<string, string> = {};
  if (overrides.headers) {
    for (const [k, v] of Object.entries(overrides.headers)) {
      if (typeof v === 'string') headers[k.toLowerCase()] = v;
    }
  }
  return {
    method: 'POST',
    baseUrl: '/api/orders',
    path: '/',
    ip: '127.0.0.1',
    body: { items: [{ productId: 'p1', quantity: 1 }] },
    ...overrides,
    get(name: string) {
      return headers[name.toLowerCase()];
    },
  } as unknown as Request;
}

function createMockRes() {
  const headers: Record<string, string> = {};
  const listeners = new Map<string, Array<() => void>>();
  let statusCode = 200;
  let jsonBody: unknown;
  let writableEnded = false;

  const res = {
    get statusCode() {
      return statusCode;
    },
    set statusCode(code: number) {
      statusCode = code;
    },
    get writableEnded() {
      return writableEnded;
    },
    headers,
    get body() {
      return jsonBody;
    },
    setHeader(name: string, value: string) {
      headers[name.toLowerCase()] = value;
      return this;
    },
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(payload: unknown) {
      jsonBody = payload;
      writableEnded = true;
      return this;
    },
    on(event: string, cb: () => void) {
      const list = listeners.get(event) ?? [];
      list.push(cb);
      listeners.set(event, list);
      return this;
    },
    emitClose() {
      for (const cb of listeners.get('close') ?? []) cb();
    },
  };

  return res as unknown as Response & {
    headers: Record<string, string>;
    body: unknown;
    emitClose: () => void;
  };
}

test('IdempotencyStore: acquires lock once, returns existing IN_PROGRESS on concurrent acquire, and replays COMPLETED after complete()', async () => {
  const store = createIdempotencyStore({ useRedis: () => false });
  const key = 'idem:user-1:POST:/api/orders:abc-123';

  const first = await store.acquire(key, 'hash-1', 60);
  assert.equal(first.acquired, true);

  const concurrent = await store.acquire(key, 'hash-1', 60);
  assert.equal(concurrent.acquired, false);
  if (!concurrent.acquired) {
    assert.equal(concurrent.record.status, 'IN_PROGRESS');
    assert.equal(concurrent.record.requestHash, 'hash-1');
  }

  await store.complete(key, 201, { success: true, data: { orderNumber: 'BS-123' } }, 60);

  const replay = await store.acquire(key, 'hash-1', 60);
  assert.equal(replay.acquired, false);
  if (!replay.acquired) {
    assert.equal(replay.record.status, 'COMPLETED');
    assert.equal(replay.record.statusCode, 201);
    assert.deepEqual(replay.record.body, { success: true, data: { orderNumber: 'BS-123' } });
  }
});

test('IdempotencyStore: release() clears lock so subsequent acquire() succeeds', async () => {
  const store = createIdempotencyStore({ useRedis: () => false });
  const key = 'idem:user-1:POST:/api/orders:retry-key';

  await store.acquire(key, 'hash-1', 60);
  await store.release(key);

  const afterRelease = await store.acquire(key, 'hash-1', 60);
  assert.equal(afterRelease.acquired, true);
});

test('idempotencyMiddleware: skips when header missing and required=false', async () => {
  const store = createIdempotencyStore({ useRedis: () => false });
  const mw = idempotencyMiddleware({ required: false, store });
  let called = false;
  const req = createMockReq();
  const res = createMockRes();

  await mw(req, res, (() => {
    called = true;
  }) as NextFunction);

  assert.equal(called, true);
});

test('idempotencyMiddleware: rejects invalid Idempotency-Key with 400 VALIDATION_ERROR', async () => {
  const store = createIdempotencyStore({ useRedis: () => false });
  const mw = idempotencyMiddleware({ required: false, store });
  const req = createMockReq({ headers: { 'idempotency-key': 'bad key with spaces!' } });
  const res = createMockRes();
  let called = false;

  await mw(req, res, (() => {
    called = true;
  }) as NextFunction);

  assert.equal(called, false);
  assert.equal(res.statusCode, 400);
  assert.equal((res.body as { code: string }).code, 'VALIDATION_ERROR');
});

test('idempotencyMiddleware: replays cached response on duplicate request with same key and body', async () => {
  const store = createIdempotencyStore({ useRedis: () => false });
  const mw = idempotencyMiddleware({ required: true, store });
  let handlerCalls = 0;

  const req1 = createMockReq({
    user: { id: 'user-1' },
    headers: { 'idempotency-key': 'uuid-001' },
  });
  const res1 = createMockRes();

  await mw(req1, res1, (() => {
    handlerCalls += 1;
    res1.status(201).json({ success: true, data: { orderNumber: 'BS-999' } });
  }) as NextFunction);

  // Allow async complete() microtask to settle
  await new Promise((r) => setTimeout(r, 10));

  const req2 = createMockReq({
    user: { id: 'user-1' },
    headers: { 'idempotency-key': 'uuid-001' },
  });
  const res2 = createMockRes();

  await mw(req2, res2, (() => {
    handlerCalls += 1;
  }) as NextFunction);

  assert.equal(handlerCalls, 1);
  assert.equal(res2.statusCode, 201);
  assert.equal(res2.headers['idempotency-replayed'], 'true');
  assert.deepEqual(res2.body, { success: true, data: { orderNumber: 'BS-999' } });
});

test('idempotencyMiddleware: returns 409 IDEMPOTENCY_KEY_REUSED when body differs for same key', async () => {
  const store = createIdempotencyStore({ useRedis: () => false });
  const mw = idempotencyMiddleware({ required: true, store });

  const req1 = createMockReq({
    user: { id: 'user-1' },
    headers: { 'idempotency-key': 'uuid-002' },
    body: { items: [{ productId: 'p1', quantity: 1 }] },
  });
  const res1 = createMockRes();
  await mw(req1, res1, (() => {
    res1.status(201).json({ success: true });
  }) as NextFunction);
  await new Promise((r) => setTimeout(r, 10));

  const req2 = createMockReq({
    user: { id: 'user-1' },
    headers: { 'idempotency-key': 'uuid-002' },
    body: { items: [{ productId: 'p1', quantity: 2 }] },
  });
  const res2 = createMockRes();
  let secondCalled = false;
  await mw(req2, res2, (() => {
    secondCalled = true;
  }) as NextFunction);

  assert.equal(secondCalled, false);
  assert.equal(res2.statusCode, 409);
  assert.equal((res2.body as { code: string }).code, 'IDEMPOTENCY_KEY_REUSED');
});

test('idempotencyMiddleware: returns 409 REQUEST_IN_PROGRESS with Retry-After on concurrent request', async () => {
  const store = createIdempotencyStore({ useRedis: () => false });
  const mw = idempotencyMiddleware({ required: true, store });

  const req1 = createMockReq({
    user: { id: 'user-1' },
    headers: { 'idempotency-key': 'uuid-003' },
  });
  const res1 = createMockRes();
  // Handler does NOT finish yet
  await mw(req1, res1, (() => {}) as NextFunction);

  const req2 = createMockReq({
    user: { id: 'user-1' },
    headers: { 'idempotency-key': 'uuid-003' },
  });
  const res2 = createMockRes();
  let secondCalled = false;
  await mw(req2, res2, (() => {
    secondCalled = true;
  }) as NextFunction);

  assert.equal(secondCalled, false);
  assert.equal(res2.statusCode, 409);
  assert.equal(res2.headers['retry-after'], '2');
  assert.equal((res2.body as { code: string }).code, 'REQUEST_IN_PROGRESS');
});

test('idempotencyMiddleware: releases lock on 5xx response so client can retry safely', async () => {
  const store = createIdempotencyStore({ useRedis: () => false });
  const mw = idempotencyMiddleware({ required: true, store });
  let calls = 0;

  const req1 = createMockReq({
    user: { id: 'user-1' },
    headers: { 'idempotency-key': 'uuid-004' },
  });
  const res1 = createMockRes();
  await mw(req1, res1, (() => {
    calls += 1;
    res1.status(500).json({ success: false, code: 'INTERNAL_ERROR' });
  }) as NextFunction);
  await new Promise((r) => setTimeout(r, 10));

  const req2 = createMockReq({
    user: { id: 'user-1' },
    headers: { 'idempotency-key': 'uuid-004' },
  });
  const res2 = createMockRes();
  await mw(req2, res2, (() => {
    calls += 1;
    res2.status(201).json({ success: true });
  }) as NextFunction);

  assert.equal(calls, 2);
  assert.equal(res2.statusCode, 201);
});

test('idempotencyMiddleware: isolates identical keys across different users', async () => {
  const store = createIdempotencyStore({ useRedis: () => false });
  const mw = idempotencyMiddleware({ required: true, store });
  let calls = 0;

  const reqA = createMockReq({
    user: { id: 'user-A' },
    headers: { 'idempotency-key': 'shared-key' },
  });
  const resA = createMockRes();
  await mw(reqA, resA, (() => {
    calls += 1;
    resA.status(201).json({ user: 'A' });
  }) as NextFunction);

  const reqB = createMockReq({
    user: { id: 'user-B' },
    headers: { 'idempotency-key': 'shared-key' },
  });
  const resB = createMockRes();
  await mw(reqB, resB, (() => {
    calls += 1;
    resB.status(201).json({ user: 'B' });
  }) as NextFunction);

  assert.equal(calls, 2);
  assert.deepEqual(resA.body, { user: 'A' });
  assert.deepEqual(resB.body, { user: 'B' });
});
