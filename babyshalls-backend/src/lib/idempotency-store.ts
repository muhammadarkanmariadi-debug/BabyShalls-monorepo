import type { Redis } from '@upstash/redis';
import { isRedisReady, redis } from './redis.js';

export type IdempotencyStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface IdempotencyRecord {
  status: IdempotencyStatus;
  requestHash: string;
  statusCode?: number;
  body?: unknown;
  expiresAt: number;
}

export type AcquireResult =
  | { acquired: true }
  | { acquired: false; record: IdempotencyRecord };

export interface IdempotencyStore {
  acquire(key: string, requestHash: string, ttlSeconds: number): Promise<AcquireResult>;
  complete(key: string, statusCode: number, body: unknown, ttlSeconds: number): Promise<void>;
  release(key: string): Promise<void>;
}

export interface IdempotencyStoreOptions {
  useRedis?: () => boolean;
  redisClient?: Redis | null;
}

const MAX_MEMORY_ENTRIES = 5000;

/**
 * Create an idempotency store that uses Redis atomic SET NX EX when available,
 * and gracefully falls back to an in-memory Map with TTL pruning (RULE 06).
 */
export function createIdempotencyStore(options?: IdempotencyStoreOptions): IdempotencyStore {
  const useRedis = options?.useRedis ?? isRedisReady;
  const client = options?.redisClient ?? redis;
  const memoryStore = new Map<string, IdempotencyRecord>();

  function pruneExpired(now: number) {
    for (const [entryKey, record] of memoryStore.entries()) {
      if (record.expiresAt <= now) {
        memoryStore.delete(entryKey);
      }
    }
    // Bound memory growth if Redis stays unavailable under heavy load
    if (memoryStore.size > MAX_MEMORY_ENTRIES) {
      const excess = memoryStore.size - MAX_MEMORY_ENTRIES;
      let removed = 0;
      for (const entryKey of memoryStore.keys()) {
        memoryStore.delete(entryKey);
        removed += 1;
        if (removed >= excess) break;
      }
    }
  }

  function acquireInMemory(key: string, requestHash: string, ttlSeconds: number): AcquireResult {
    const now = Date.now();
    const existing = memoryStore.get(key);
    if (existing && existing.expiresAt > now) {
      return { acquired: false, record: existing };
    }
    if (existing) {
      memoryStore.delete(key);
    }
    pruneExpired(now);
    memoryStore.set(key, {
      status: 'IN_PROGRESS',
      requestHash,
      expiresAt: now + ttlSeconds * 1000,
    });
    return { acquired: true };
  }

  return {
    async acquire(key: string, requestHash: string, ttlSeconds: number): Promise<AcquireResult> {
      if (useRedis() && client) {
        try {
          const initialRecord: IdempotencyRecord = {
            status: 'IN_PROGRESS',
            requestHash,
            expiresAt: Date.now() + ttlSeconds * 1000,
          };
          const result = await client.set(key, initialRecord, { ex: ttlSeconds, nx: true });
          if (result === 'OK') {
            return { acquired: true };
          }
          const existing = await client.get<IdempotencyRecord | string>(key);
          if (existing) {
            const parsed = typeof existing === 'string' ? (JSON.parse(existing) as IdempotencyRecord) : existing;
            return { acquired: false, record: parsed };
          }
          // Key expired between SET NX and GET: retry once atomically
          const retryResult = await client.set(key, initialRecord, { ex: ttlSeconds, nx: true });
          if (retryResult === 'OK') {
            return { acquired: true };
          }
        } catch (err) {
          console.warn('⚠️ Redis idempotency acquire gagal, fallback ke memory store:', err);
        }
      }
      return acquireInMemory(key, requestHash, ttlSeconds);
    },

    async complete(key: string, statusCode: number, body: unknown, ttlSeconds: number): Promise<void> {
      const now = Date.now();
      const existingMem = memoryStore.get(key);
      const record: IdempotencyRecord = {
        status: 'COMPLETED',
        requestHash: existingMem?.requestHash ?? '',
        statusCode,
        body,
        expiresAt: now + ttlSeconds * 1000,
      };

      if (useRedis() && client) {
        try {
          const existing = await client.get<IdempotencyRecord | string>(key);
          if (existing) {
            const parsed = typeof existing === 'string' ? (JSON.parse(existing) as IdempotencyRecord) : existing;
            record.requestHash = parsed.requestHash;
          }
          await client.set(key, record, { ex: ttlSeconds });
          return;
        } catch (err) {
          console.warn('⚠️ Redis idempotency complete gagal, fallback ke memory store:', err);
        }
      }
      memoryStore.set(key, record);
    },

    async release(key: string): Promise<void> {
      memoryStore.delete(key);
      if (useRedis() && client) {
        try {
          await client.del(key);
        } catch (err) {
          console.warn('⚠️ Redis idempotency release gagal:', err);
        }
      }
    },
  };
}

export const defaultIdempotencyStore = createIdempotencyStore();

