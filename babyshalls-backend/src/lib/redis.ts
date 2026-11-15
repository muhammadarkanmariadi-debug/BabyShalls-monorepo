import { Redis } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
let isRedisAvailable = false;

// Initialize Redis client with retryStrategy and error suppression in dev
export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 1,
  connectTimeout: 2000,
  lazyConnect: true,
  retryStrategy(times: number) {
    if (times > 2) {
      return null; // Stop retrying if Redis is not running locally
    }
    return 1000;
  },
});

// Attempt connection non-blockingly
redis
  .connect()
  .then(() => {
    isRedisAvailable = true;
    console.log('⚡ Redis Cache connected successfully.');
  })
  .catch(() => {
    isRedisAvailable = false;
    console.log('ℹ️  Redis not detected on localhost:6379. Using memory/direct fallback mode.');
  });

redis.on('error', () => {
  isRedisAvailable = false;
});

redis.on('connect', () => {
  isRedisAvailable = true;
});

/**
 * Returns true if the Redis client is currently connected and ready.
 */
export function isRedisReady(): boolean {
  return isRedisAvailable;
}

/**
 * Safe Get Cache: Returns cached data if available, null if cache miss or Redis is down.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!isRedisAvailable) return null;
  try {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

/**
 * Safe Set Cache: Stores data in Redis with TTL in seconds. Fails silently if Redis is down.
 */
export async function setCache(key: string, value: any, ttlSeconds = 3600): Promise<void> {
  if (!isRedisAvailable) return;
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch {
    // Fail silently to keep application robust
  }
}

/**
 * Safe Delete Cache: Invalidates cache key.
 */
export async function delCache(key: string): Promise<void> {
  if (!isRedisAvailable) return;
  try {
    await redis.del(key);
  } catch {
    // Fail silently
  }
}
