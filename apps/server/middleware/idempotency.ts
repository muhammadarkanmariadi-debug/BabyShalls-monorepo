import type { Context } from 'hono';
import { defaultIdempotencyStore } from '../lib/idempotency-store';

async function hashPayload(raw: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function runWithIdempotency(
  c: Context,
  rawBody: string,
  handler: () => Promise<{ status: number; body: unknown }>,
  ttlSeconds = 86400
) {
  const idempotencyKey = c.req.header('idempotency-key')?.trim();
  if (!idempotencyKey) {
    const res = await handler();
    return c.json(res.body, res.status as 200);
  }

  const scopedKey = `idem:hono:${c.req.path}:${idempotencyKey}`;
  const requestHash = await hashPayload(rawBody);
  const acquired = await defaultIdempotencyStore.acquire(scopedKey, requestHash, ttlSeconds);

  if (!acquired.acquired) {
    const record = acquired.record;
    if (record.requestHash && record.requestHash !== requestHash) {
      return c.json(
        {
          success: false,
          error: 'Idempotency-Key sudah digunakan untuk payload berbeda.',
          code: 'IDEMPOTENCY_CONFLICT',
        },
        422
      );
    }
    if (record.status === 'IN_PROGRESS') {
      return c.json(
        {
          success: false,
          error: 'Permintaan sedang diproses. Silakan tunggu sebentar.',
          code: 'IDEMPOTENCY_IN_PROGRESS',
        },
        409
      );
    }
    c.header('Idempotency-Replayed', 'true');
    return c.json(record.body, (record.statusCode || 200) as 200);
  }

  try {
    const result = await handler();
    if (result.status < 500) {
      await defaultIdempotencyStore.complete(scopedKey, result.status, result.body, ttlSeconds);
    } else {
      await defaultIdempotencyStore.release(scopedKey);
    }
    return c.json(result.body, result.status as 200);
  } catch (err) {
    await defaultIdempotencyStore.release(scopedKey);
    throw err;
  }
}

