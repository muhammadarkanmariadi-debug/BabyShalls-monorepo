# Idempotency Key Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mencegah duplikasi transaksi (double order, double Midtrans Snap token, double pengurangan kuota event, dan double book request) akibat *double-click* atau *network retry* dengan mekanisme `Idempotency-Key` di backend Express dan frontend Next.js.

**Architecture:**
Backend menyediakan middleware `requireIdempotency` (dan opsional `optionalIdempotency`) yang membaca header `Idempotency-Key`, memvalidasi formatnya, menghitung SHA-256 fingerprint dari `(userId/ip, method, path, body)`, lalu mengunci eksekusi secara atomik di Redis (`SET ... NX EX 86400`) dengan *graceful fallback* ke in-memory `Map` saat Redis tidak aktif (sesuai `RULE 06`). Frontend menghasilkan UUID v4 per percobaan checkout/registrasi dan mempertahankannya selama retry hingga transaksi sukses atau payload berubah.

**Tech Stack:** Express.js 4, TypeScript (ES2022 / NodeNext), `ioredis` 6, Node `crypto` + `node:test`, Next.js 16, React 19, Axios, TanStack React Query.

**Spec:** `docs/ARCHITECTURE.md` (Section 2.3 item 3: Idempotency Key Transaksi Midtrans TTL 24 Jam), `docs/RULES.md` (RULE 06: Redis Graceful Degradation & RULE 08).

## Global Constraints

- **Graceful Redis Fallback (RULE 06 & AGENTS.md #4):** Sistem tidak boleh crash jika Redis mati/tidak terdeteksi; `idempotency.store.ts` wajib otomatis beralih ke in-memory store dengan TTL yang sama (24 jam / 86400 detik).
- **No New External Dependencies (RULE 04 / Section 4):** Gunakan modul bawaan Node.js (`crypto`, `node:test`, `node:assert`) dan library yang sudah ada (`ioredis`, `express`, `zod`, `axios`).
- **Build Verification:** `npm run build` di `backend/` dan `frontend/` wajib lulus dengan 0 TypeScript/Turbopack error.
- **No Multi-Tenancy:** Scope key cukup menggunakan `userId` (atau `ip` untuk endpoint publik/opsional auth), tanpa konsep `tenantId`.

## Review Focus

- **Payload mismatch dengan key yang sama:** Client mengirim ulang `Idempotency-Key` yang sama tetapi isi `body` berbeda (misal jumlah item atau alamat diubah) -> kembalikan `409 Conflict` (`code: 'IDEMPOTENCY_KEY_REUSED'`), jangan kembalikan respons lama.
- **Concurrent in-flight requests (double-click cepat):** Request kedua tiba saat request pertama masih memanggil Midtrans/PostgreSQL -> request kedua tidak boleh mengeksekusi handler; kembalikan `409 Conflict` (`code: 'REQUEST_IN_PROGRESS'`) dengan header `Retry-After: 2`.
- **5xx / kegagalan tak terduga pada eksekusi pertama:** Jika handler melempar error atau merespons status `>= 500`, lock `IN_PROGRESS` wajib dihapus agar client bisa retry aman menggunakan `Idempotency-Key` yang sama.
- **Isolasi antar pengguna:** Dua user berbeda mengirim key yang kebetulan sama (misal `"key-123"`) -> key penyimpanan wajib di-namespace dengan `user:{userId}` atau `anon:{ip}` agar respons tidak bocor lintas akun.
- **Header tidak valid / terlalu panjang:** `Idempotency-Key` kosong, mengandung spasi/karakter kontrol, atau > 128 karakter -> tolak dengan `400 Bad Request` (`code: 'VALIDATION_ERROR'`).

---

## File Structure

- **Create:** `backend/src/lib/idempotency-store.ts` — Abstraksi penyimpanan idempotensi (Redis atomic `SET NX EX` + fallback in-memory `Map` dengan TTL & cleanup).
- **Create:** `backend/src/middleware/idempotency.middleware.ts` — Express middleware `idempotencyMiddleware({ required, ttlSeconds })` untuk validasi header, SHA-256 payload hashing, replay respons (`X-Idempotency-Replayed: true`), dan cleanup lock saat error 5xx.
- **Create:** `backend/src/lib/__tests__/idempotency.test.ts` — Unit & middleware test menggunakan `node:test` dan `node:assert/strict`.
- **Modify:** `backend/src/lib/redis.ts` — Ekspor helper `isRedisReady()` agar `idempotency-store.ts` dapat memeriksa status koneksi Redis secara bersih tanpa duplikasi koneksi.
- **Modify:** `backend/src/routes/order.routes.ts` — Pasang `idempotencyMiddleware({ required: false })` (bertahap kompatibel, lalu bisa diwajibkan) pada `POST /api/orders`.
- **Modify:** `backend/src/routes/event.routes.ts` — Pasang `idempotencyMiddleware({ required: false })` pada `POST /api/events/register`.
- **Modify:** `backend/src/routes/book-request.routes.ts` — Pasang `idempotencyMiddleware({ required: false })` pada `POST /api/book-requests`.
- **Modify:** `backend/src/index.ts` — Pastikan konfigurasi `cors()` mengizinkan header `Idempotency-Key` dan mengekspos `Idempotency-Replayed`.
- **Modify:** `frontend/src/hooks/useOrders.ts` — Tambahkan parameter opsional `idempotencyKey` pada `useCreateOrder` dan kirim via header `Idempotency-Key`.
- **Modify:** `frontend/src/app/checkout/page.tsx` — Kelola state `idempotencyKey` (`crypto.randomUUID()`), pertahankan saat retry, dan reset setelah order berhasil atau keranjang/alamat berubah.

---

### Task 1: Expose Redis Availability Helper & Build Idempotency Store

**Files:**
- Modify: `backend/src/lib/redis.ts:1-75`
- Create: `backend/src/lib/idempotency-store.ts`
- Test: `backend/src/lib/__tests__/idempotency.test.ts`

**Interfaces:**
- Consumes: `redis` dan `isRedisReady(): boolean` dari `backend/src/lib/redis.ts`
- Produces:
  - `IdempotencyRecord`: `{ status: 'IN_PROGRESS' | 'COMPLETED'; requestHash: string; statusCode?: number; body?: unknown; expiresAt: number }`
  - `AcquireResult`: `{ acquired: true } | { acquired: false; record: IdempotencyRecord }`
  - `IdempotencyStore` interface & `createIdempotencyStore(options?: { useRedis?: () => boolean; redisClient?: Redis }): IdempotencyStore`
  - Methods: `acquire(key: string, requestHash: string, ttlSeconds: number): Promise<AcquireResult>`, `complete(key: string, statusCode: number, body: unknown, ttlSeconds: number): Promise<void>`, `release(key: string): Promise<void>`

- [ ] **Step 1: Write the failing test for `IdempotencyStore` (memory fallback & state transitions)**

Create `backend/src/lib/__tests__/idempotency.test.ts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { createIdempotencyStore } from '../idempotency-store.js';

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx --prefix backend tsx --test backend/src/lib/__tests__/idempotency.test.ts`
Expected: FAIL with module not found `../idempotency-store.js`.

- [ ] **Step 3: Export `isRedisReady()` in `backend/src/lib/redis.ts`**

Add to `backend/src/lib/redis.ts`:
```ts
export function isRedisReady(): boolean {
  return isRedisAvailable;
}
```

- [ ] **Step 4: Implement `backend/src/lib/idempotency-store.ts`**

Implement `createIdempotencyStore` with:
- Redis path (when `useRedis()` returns `true`):
  - `acquire`: `await client.set(key, JSON.stringify(inProgressRecord), 'EX', ttlSeconds, 'NX')`. If `'OK'`, return `{ acquired: true }`. Otherwise `await client.get(key)`, parse JSON, and return `{ acquired: false, record }`. If Redis throws, log warning and fall back to memory store.
  - `complete`: `await client.setex(key, ttlSeconds, JSON.stringify(completedRecord))`.
  - `release`: `await client.del(key)`.
- In-memory `Map<string, IdempotencyRecord>` fallback:
  - Prune expired entry on read (`record.expiresAt <= Date.now()`).
  - Synchronous check-and-set inside `acquire` so concurrent calls in the same event loop cannot both acquire.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx --prefix backend tsx --test backend/src/lib/__tests__/idempotency.test.ts`
Expected: PASS (2/2 tests).

- [ ] **Step 6: Commit**

```bash
git add backend/src/lib/redis.ts backend/src/lib/idempotency-store.ts backend/src/lib/__tests__/idempotency.test.ts
git commit -m "feat(backend): add idempotency store with redis and memory fallback"
```

---

### Task 2: Build Idempotency Express Middleware

**Files:**
- Create: `backend/src/middleware/idempotency.middleware.ts`
- Modify: `backend/src/lib/__tests__/idempotency.test.ts`

**Interfaces:**
- Consumes: `createIdempotencyStore`, `defaultIdempotencyStore` dari `backend/src/lib/idempotency-store.ts`
- Produces:
  - `idempotencyMiddleware(options?: { required?: boolean; ttlSeconds?: number; store?: IdempotencyStore }): RequestHandler`
  - `computeRequestFingerprint(req: Request): string` (SHA-256 hex dari canonical JSON `{ method, path: req.baseUrl + req.path, body: req.body }`)

- [ ] **Step 1: Write failing tests for `idempotencyMiddleware`**

Append to `backend/src/lib/__tests__/idempotency.test.ts` tests covering:
1. Missing `Idempotency-Key` when `required: false` -> calls `next()` without locking.
2. Invalid `Idempotency-Key` (empty whitespace or > 128 chars) -> returns `400` with `code: 'VALIDATION_ERROR'`.
3. First valid request -> calls `next()`, intercepts `res.status(201).json(payload)`, stores `COMPLETED`, and sends response normally.
4. Second identical request -> does NOT call `next()`, sets `Idempotency-Replayed: true`, returns cached `201` + `payload`.
5. Same key with different body -> returns `409` with `code: 'IDEMPOTENCY_KEY_REUSED'`.
6. Concurrent request while `IN_PROGRESS` -> returns `409` with `code: 'REQUEST_IN_PROGRESS'` and `Retry-After: 2`.
7. First request returns `500` -> releases lock so subsequent retry executes `next()` again.
8. Different `req.user.id` with same `Idempotency-Key` -> isolated, both execute `next()`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx --prefix backend tsx --test backend/src/lib/__tests__/idempotency.test.ts`
Expected: FAIL because `idempotency.middleware.ts` does not exist.

- [ ] **Step 3: Implement `backend/src/middleware/idempotency.middleware.ts`**

Key implementation details:
- Read header `req.get('Idempotency-Key')` (Express `req.get` is case-insensitive).
- Validate format: `^[A-Za-z0-9._:-]{1,128}$`.
- Build namespaced key: `idem:${actorScope}:${req.method}:${req.baseUrl}${req.path}:${rawKey}` where `actorScope = (req as AuthRequest).user?.id ? \`user:${(req as AuthRequest).user!.id}\` : \`ip:${req.ip || 'unknown'}\``.
- Wrap `res.json` to capture `res.statusCode` and `body`:
  - If `res.statusCode >= 500`, call `void store.release(storageKey)`.
  - Else (`< 500`), call `void store.complete(storageKey, res.statusCode, body, ttlSeconds)`.
- Attach `res.on('close', ...)` listener: if `!res.writableEnded`, release the lock so aborted/crashed connections don't leave a 24h lock!

- [ ] **Step 4: Run test to verify it passes**

Run: `npx --prefix backend tsx --test backend/src/lib/__tests__/idempotency.test.ts`
Expected: PASS (all 10 tests).

- [ ] **Step 5: Commit**

```bash
git add backend/src/middleware/idempotency.middleware.ts backend/src/lib/__tests__/idempotency.test.ts
git commit -m "feat(backend): add idempotency express middleware with payload hash & replay"
```

---

### Task 3: Wire Middleware to Mutating Routes & CORS

**Files:**
- Modify: `backend/src/index.ts:26-32`
- Modify: `backend/src/routes/order.routes.ts:46`
- Modify: `backend/src/routes/event.routes.ts:95`
- Modify: `backend/src/routes/book-request.routes.ts:29`

**Interfaces:**
- Consumes: `idempotencyMiddleware` dari `backend/src/middleware/idempotency.middleware.js`

- [ ] **Step 1: Update CORS config in `backend/src/index.ts`**

Update `cors({...})` to explicitly allow and expose idempotency headers:
```ts
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
    exposedHeaders: ['Idempotency-Replayed', 'Retry-After'],
  })
);
```

- [ ] **Step 2: Attach `idempotencyMiddleware({ required: false })` to `POST /api/orders`, `POST /api/events/register`, and `POST /api/book-requests`**

- In `backend/src/routes/order.routes.ts`:
  `router.post('/', authenticateJWT, idempotencyMiddleware({ required: false }), async (req: AuthRequest, res: Response) => {`
- In `backend/src/routes/event.routes.ts`:
  `router.post('/register', optionalAuthenticateJWT, idempotencyMiddleware({ required: false }), async (req: AuthRequest, res: Response) => {`
- In `backend/src/routes/book-request.routes.ts`:
  `router.post('/', idempotencyMiddleware({ required: false }), async (req: Request, res: Response) => {`

*(Catatan: `required: false` menjaga backward-compatibility jika ada client lama/curl tanpa header, sementara client web baru selalu mengirim `Idempotency-Key`. Setelah stabil, dapat diubah menjadi `required: true` untuk `POST /api/orders`.)*

- [ ] **Step 3: Verify backend TypeScript build**

Run: `npm run build:backend`
Expected: Exit code 0 (0 TypeScript compilation errors).

- [ ] **Step 4: Commit**

```bash
git add backend/src/index.ts backend/src/routes/order.routes.ts backend/src/routes/event.routes.ts backend/src/routes/book-request.routes.ts
git commit -m "feat(backend): enable idempotency middleware on order, event, and book-request routes"
```

---

### Task 4: Frontend Checkout & Order Hook Integration

**Files:**
- Modify: `frontend/src/hooks/useOrders.ts:29-65`
- Modify: `frontend/src/app/checkout/page.tsx:160,274-305`

**Interfaces:**
- Consumes: Header `Idempotency-Key` pada `POST /api/orders`
- Produces: `CreateOrderPayload` dengan opsional `idempotencyKey?: string` yang diteruskan sebagai header HTTP `Idempotency-Key` (tidak dikirim di JSON body atau diabaikan dari body).

- [ ] **Step 1: Update `useCreateOrder` in `frontend/src/hooks/useOrders.ts`**

Extend `CreateOrderPayload` or mutation variables with `idempotencyKey?: string` and pass it via Axios config headers:
```ts
export function useCreateOrder() {
  return useMutation<CreateOrderResult, unknown, CreateOrderPayload & { idempotencyKey?: string }>({
    mutationFn: async ({ idempotencyKey, ...payload }) => {
      const response = await apiClient.post<{ success: boolean; data: CreateOrderResult }>(
        '/orders',
        payload,
        idempotencyKey ? { headers: { 'Idempotency-Key': idempotencyKey } } : undefined
      );
      return response.data.data;
    },
  });
}
```

- [ ] **Step 2: Manage `idempotencyKey` lifecycle in `frontend/src/app/checkout/page.tsx`**

- Generate key using `useRef` or `useState(() => crypto.randomUUID())`.
- Reset key (`setCheckoutIdempotencyKey(crypto.randomUUID())`) whenever cart items, selected courier, applied coupon, or shipping address changes so a modified checkout payload never collides with a previous key (`409 IDEMPOTENCY_KEY_REUSED`).
- Pass `idempotencyKey: checkoutIdempotencyKey` into `createOrderMutation.mutateAsync(...)`.
- On `orderCompleted`, rotate the key.

- [ ] **Step 3: Verify frontend & monorepo build**

Run: `npm run build`
Expected: Exit code 0 (`backend` + `frontend` build clean).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/hooks/useOrders.ts frontend/src/app/checkout/page.tsx
git commit -m "feat(frontend): send Idempotency-Key on checkout order creation"
```

