import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL?.trim();

let redisAvailable = false;

export const redis: Redis | null = REDIS_URL
  ? new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: true,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 1000)),
    })
  : null;

if (redis) {
  redis.on('ready', () => {
    redisAvailable = true;
  });
  redis.on('error', () => {
    redisAvailable = false;
  });
  redis.on('close', () => {
    redisAvailable = false;
  });
  // Attempt non-blocking initial connection
  redis.connect().catch(() => {
    redisAvailable = false;
  });
}

export function isRedisReady(): boolean {
  return Boolean(redis && redisAvailable && redis.status === 'ready');
}

export async function getCache<T>(key: string): Promise<T | null> {
  if (!isRedisReady() || !redis) return null;
  try {
    const raw = await redis.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function setCache(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
  if (!isRedisReady() || !redis) return;
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
    // Graceful fallback
  }
}

export async function delCache(key: string): Promise<void> {
  if (!isRedisReady() || !redis) return;
  try {
    await redis.del(key);
  } catch {
    // Graceful fallback
  }
}

export async function delCacheByPattern(pattern: string): Promise<void> {
  if (!isRedisReady() || !redis) return;
  try {
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== '0');
  } catch {
    // Graceful fallback
  }
}
