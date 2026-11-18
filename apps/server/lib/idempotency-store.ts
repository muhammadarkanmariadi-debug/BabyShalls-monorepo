import type Redis from 'ioredis';
import { isRedisReady, redis } from './redis';

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

const MAX_MEMORY_ENTRIES = 5000;

export function createIdempotencyStore(options?: {
  useRedis?: () => boolean;
  redisClient?: Redis | null;
}): IdempotencyStore {
  const useRedis = options?.useRedis ?? isRedisReady;
  const client = options?.redisClient ?? redis;
  const memoryStore = new Map<string, IdempotencyRecord>();

  function pruneExpired(now: number) {
    for (const [entryKey, record] of memoryStore.entries()) {
      if (record.expiresAt <= now) {
        memoryStore.delete(entryKey);
      }
    }
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
    if (existing) memoryStore.delete(key);
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
          const serialized = JSON.stringify(initialRecord);
          const result = await client.set(key, serialized, 'EX', ttlSeconds, 'NX');
          if (result === 'OK') return { acquired: true };
          const existing = await client.get(key);
          if (existing) {
            return { acquired: false, record: JSON.parse(existing) as IdempotencyRecord };
          }
          const retryResult = await client.set(key, serialized, 'EX', ttlSeconds, 'NX');
          if (retryResult === 'OK') return { acquired: true };
        } catch (err) {
          console.warn('⚠️ Redis idempotency acquire gagal, fallback ke memory store:', err);
        }
      }
      return acquireInMemory(key, requestHash, ttlSeconds);
    },

    async complete(key: string, statusCode: number, body: unknown, ttlSeconds: number): Promise<void> {
      const completedRecord: IdempotencyRecord = {
        status: 'COMPLETED',
        requestHash: '',
        statusCode,
        body,
        expiresAt: Date.now() + ttlSeconds * 1000,
      };

      if (useRedis() && client) {
        try {
          const existing = await client.get(key);
          const existingHash = existing ? (JSON.parse(existing) as IdempotencyRecord).requestHash : '';
          completedRecord.requestHash = existingHash;
          await client.set(key, JSON.stringify(completedRecord), 'EX', ttlSeconds);
          return;
        } catch (err) {
          console.warn('⚠️ Redis idempotency complete gagal, fallback ke memory store:', err);
        }
      }

      const memExisting = memoryStore.get(key);
      completedRecord.requestHash = memExisting?.requestHash || '';
      memoryStore.set(key, completedRecord);
    },

    async release(key: string): Promise<void> {
      if (useRedis() && client) {
        try {
          await client.del(key);
        } catch {
          // ignore
        }
      }
      memoryStore.delete(key);
    },
  };
}

export const defaultIdempotencyStore = createIdempotencyStore();
