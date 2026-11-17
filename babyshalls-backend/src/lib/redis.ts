import { Redis } from '@upstash/redis';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL?.trim();
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

const isConfigured = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

export const redis: Redis | null = isConfigured
  ? new Redis({
      url: UPSTASH_URL!,
      token: UPSTASH_TOKEN!,
    })
  : null;

if (isConfigured) {
  console.log('⚡ Upstash Redis REST client initialized.');
} else {
  console.log('ℹ️  UPSTASH_REDIS_REST_URL / TOKEN not set. Using memory/direct fallback mode.');
}

/**
 * Returns true if the Upstash Redis client is configured and available.
 */
export function isRedisReady(): boolean {
  return redis !== null;
}

/**
 * Safe Get Cache: Returns cached data if available, null if cache miss or Redis is unavailable.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const data = await redis.get<T>(key);
    return data ?? null;
  } catch {
    return null;
  }
}

/**
 * Safe Set Cache: Stores data in Upstash Redis with TTL in seconds. Fails silently if unavailable.
 */
export async function setCache(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch {
    // Fail silently to keep application robust
  }
}

/**
 * Safe Delete Cache: Invalidates cache key.
 */
export async function delCache(key: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch {
    // Fail silently
  }
}

/**
 * Safe Delete Cache By Pattern: Invalidates matching keys using SCAN without blocking Redis.
 */
export async function delCacheByPattern(pattern: string): Promise<void> {
  if (!redis) return;
  try {
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redis.scan(cursor, {
        match: pattern,
        count: 100,
      });
      cursor = String(nextCursor);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== '0');
  } catch {
    // Fail silently to preserve graceful degradation
  }
}
