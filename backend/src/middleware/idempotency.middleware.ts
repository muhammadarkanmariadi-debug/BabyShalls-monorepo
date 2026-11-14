import crypto from 'crypto';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AuthRequest } from './auth.middleware.js';
import { defaultIdempotencyStore, IdempotencyStore } from '../lib/idempotency-store.js';

const DEFAULT_TTL_SECONDS = 86400; // 24 hours (docs/ARCHITECTURE.md Section 2.3)
const IDEMPOTENCY_KEY_REGEX = /^[A-Za-z0-9._:-]{1,128}$/;

export interface IdempotencyMiddlewareOptions {
  required?: boolean;
  ttlSeconds?: number;
  store?: IdempotencyStore;
}

/**
 * Recursively sort object keys to ensure deterministic JSON serialization
 * for request payload fingerprinting.
 */
function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (value !== null && typeof value === 'object') {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      const val = (value as Record<string, unknown>)[key];
      if (val !== undefined) {
        sorted[key] = canonicalize(val);
      }
    }
    return sorted;
  }
  return value;
}

/**
 * Compute a SHA-256 fingerprint of the HTTP method, route path, and JSON body.
 */
export function computeRequestFingerprint(req: Request): string {
  const payload = canonicalize({
    method: req.method,
    path: `${req.baseUrl}${req.path}`,
    body: req.body ?? null,
  });
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

/**
 * Express middleware enforcing request-level idempotency via the `Idempotency-Key` header.
 * Supports Redis atomic locking with graceful in-memory fallback.
 */
export function idempotencyMiddleware(options: IdempotencyMiddlewareOptions = {}): RequestHandler {
  const {
    required = false,
    ttlSeconds = DEFAULT_TTL_SECONDS,
    store = defaultIdempotencyStore,
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    const rawKey = req.get('Idempotency-Key');

    if (rawKey === undefined) {
      if (required) {
        return res.status(400).json({
          success: false,
          error: 'Header Idempotency-Key wajib disertakan untuk transaksi ini.',
          code: 'VALIDATION_ERROR',
        });
      }
      return next();
    }

    const trimmedKey = rawKey.trim();
    if (!trimmedKey || !IDEMPOTENCY_KEY_REGEX.test(trimmedKey)) {
      return res.status(400).json({
        success: false,
        error: 'Format Idempotency-Key tidak valid (gunakan 1-128 karakter alfanumerik, "-", "_", ".", ":").',
        code: 'VALIDATION_ERROR',
      });
    }

    const authReq = req as AuthRequest;
    const actorScope = authReq.user?.id ? `user:${authReq.user.id}` : `ip:${req.ip || 'unknown'}`;
    const storageKey = `idem:${actorScope}:${req.method}:${req.baseUrl}${req.path}:${trimmedKey}`;
    const requestHash = computeRequestFingerprint(req);

    const acquired = await store.acquire(storageKey, requestHash, ttlSeconds);

    if (!acquired.acquired) {
      const existing = acquired.record;

      if (existing.requestHash !== requestHash) {
        return res.status(409).json({
          success: false,
          error: 'Idempotency-Key sudah digunakan untuk data transaksi yang berbeda.',
          code: 'IDEMPOTENCY_KEY_REUSED',
        });
      }

      if (existing.status === 'IN_PROGRESS') {
        res.setHeader('Retry-After', '2');
        return res.status(409).json({
          success: false,
          error: 'Permintaan sebelumnya dengan Idempotency-Key ini masih diproses. Silakan tunggu sebentar.',
          code: 'REQUEST_IN_PROGRESS',
        });
      }

      res.setHeader('Idempotency-Replayed', 'true');
      return res.status(existing.statusCode ?? 200).json(existing.body);
    }

    let settled = false;
    const originalJson = res.json.bind(res);

    res.json = ((body: unknown) => {
      settled = true;
      const statusCode = res.statusCode || 200;
      if (statusCode >= 500) {
        void store.release(storageKey);
      } else {
        void store.complete(storageKey, statusCode, body, ttlSeconds);
      }
      return originalJson(body);
    }) as Response['json'];

    res.on('close', () => {
      if (!settled && !res.writableEnded) {
        void store.release(storageKey);
      }
    });

    return next();
  };
}

