import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { isRedisReady, redis } from '@/server/lib/redis';
import productsRouter from '@/server/routes/products';
import cmsRouter from '@/server/routes/cms';
import bookRequestsRouter from '@/server/routes/book-requests';
import authRouter from '@/server/routes/auth';
import ordersRouter from '@/server/routes/orders';
import shippingRouter from '@/server/routes/shipping';
import couponsRouter from '@/server/routes/coupons';
import shortlinksRouter from '@/server/routes/shortlinks';
import eventsRouter from '@/server/routes/events';
import accountRouter from '@/server/routes/account';
import adminCouponsRouter from '@/server/routes/admin-coupons';
import adminShortlinksRouter from '@/server/routes/admin-shortlinks';
import adminEventsRouter from '@/server/routes/admin-events';
import adminAnalyticsRouter from '@/server/routes/admin-analytics';
import adminDashboardRouter from '@/server/routes/admin-dashboard';

const app = new Hono().basePath('/api');

const memoryRateMap = new Map<string, { count: number; resetAt: number }>();

async function checkRateLimit(key: string, maxRequests = 30, windowSeconds = 60): Promise<{ allowed: boolean; retryAfter: number }> {
  if (isRedisReady() && redis) {
    try {
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, windowSeconds);
      }
      if (count > maxRequests) {
        const ttl = await redis.ttl(key);
        return { allowed: false, retryAfter: ttl > 0 ? ttl : windowSeconds };
      }
      return { allowed: true, retryAfter: 0 };
    } catch {
      // Fallback to memory below
    }
  }

  const now = Date.now();
  const entry = memoryRateMap.get(key);
  if (!entry || entry.resetAt <= now) {
    memoryRateMap.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, retryAfter: 0 };
  }
  entry.count += 1;
  if (entry.count > maxRequests) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }
  return { allowed: true, retryAfter: 0 };
}

app.use('/auth/*', async (c, next) => {
  const ip =
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
    c.req.header('x-real-ip') ||
    'unknown';

  const { allowed, retryAfter } = await checkRateLimit(`babyshalls:rl:auth:${ip}`, 30, 60);
  if (!allowed) {
    c.header('Retry-After', String(retryAfter));
    return c.json(
      {
        success: false,
        error: 'Terlalu banyak percobaan. Silakan coba lagi beberapa saat.',
        code: 'RATE_LIMITED',
      },
      429
    );
  }
  await next();
});

app.get('/health', (c) => {
  return c.json({
    status: 'OK',
    app: 'BabyShalls E-Commerce Engine (VPS Monolith)',
    version: '2.0.0',
    location: 'Malang, Jawa Timur',
    redisConnected: isRedisReady(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Local VPS Image Upload Endpoint (saves pre-compressed WebP to public/uploads/).
 */
app.post('/admin/upload', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file');
    const folder = String(formData.get('folder') || 'products').replace(/[^a-zA-Z0-9_-]/g, '') || 'products';

    if (!(file instanceof File)) {
      return c.json({ success: false, error: 'File gambar tidak ditemukan.' }, 400);
    }

    const ext = (file.name.split('.').pop() || 'webp').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    return c.json({
      success: true,
      data: {
        key: `${folder}/${filename}`,
        url: `/uploads/${folder}/${filename}`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menyimpan file gambar di server.';
    return c.json({ success: false, error: message }, 500);
  }
});

function normalizeExternalImageUrl(rawUrl: string): string {
  const clean = rawUrl.trim();
  const gdriveFile = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gdriveFile?.[1]) {
    return `https://drive.google.com/uc?export=download&id=${gdriveFile[1]}`;
  }
  const gdriveOpen = clean.match(/drive\.google\.com\/(?:open|uc)\?(?:[^#]*&)?id=([a-zA-Z0-9_-]+)/);
  if (gdriveOpen?.[1]) {
    return `https://drive.google.com/uc?export=download&id=${gdriveOpen[1]}`;
  }
  if (clean.includes('dropbox.com/')) {
    const u = new URL(clean);
    u.searchParams.delete('dl');
    u.searchParams.set('raw', '1');
    return u.toString();
  }
  return clean;
}

function isSafePublicHttpsUrl(urlStr: string): boolean {
  try {
    const u = new URL(urlStr);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    const host = u.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('169.254.') ||
      host.endsWith('.local')
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Import image from external URL / Google Drive / Dropbox and save locally to public/uploads/.
 */
app.post('/admin/upload-from-url', async (c) => {
  try {
    const body = (await c.req.json()) as {
      url?: string;
      folder?: string;
      bearerToken?: string;
    };
    const rawUrl = String(body.url || '').trim();
    const folder =
      String(body.folder || 'products').replace(/[^a-zA-Z0-9_-]/g, '') || 'products';

    if (!rawUrl) {
      return c.json({ success: false, error: 'URL gambar wajib diisi.' }, 400);
    }

    const targetUrl = normalizeExternalImageUrl(rawUrl);
    if (!isSafePublicHttpsUrl(targetUrl)) {
      return c.json({ success: false, error: 'URL tidak valid atau tidak diizinkan.' }, 400);
    }

    const headers: Record<string, string> = {};
    if (body.bearerToken) {
      headers.Authorization = `Bearer ${body.bearerToken}`;
    }

    const res = await fetch(targetUrl, { headers, redirect: 'follow' });
    if (!res.ok) {
      return c.json(
        { success: false, error: `Gagal mengunduh gambar dari URL (HTTP ${res.status}).` },
        400
      );
    }

    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    if (!contentType.startsWith('image/')) {
      return c.json(
        {
          success: false,
          error: 'Link tersebut tidak mengarah ke file gambar langsung (pastikan akses link bersifat publik).',
        },
        400
      );
    }

    const arrayBuf = await res.arrayBuffer();
    if (arrayBuf.byteLength > 10 * 1024 * 1024) {
      return c.json({ success: false, error: 'Ukuran gambar maksimal 10 MB.' }, 400);
    }

    let ext = 'webp';
    if (contentType.includes('png')) ext = 'png';
    else if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = 'jpg';
    else if (contentType.includes('avif')) ext = 'avif';

    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), Buffer.from(arrayBuf));

    return c.json({
      success: true,
      data: {
        key: `${folder}/${filename}`,
        url: `/uploads/${folder}/${filename}`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengimpor gambar dari URL.';
    return c.json({ success: false, error: message }, 500);
  }
});

app.route('/auth', authRouter);
app.route('/account', accountRouter);
app.route('/products', productsRouter);
app.route('/orders', ordersRouter);
app.route('/shipping', shippingRouter);
app.route('/coupons', couponsRouter);
app.route('/events', eventsRouter);
app.route('/shortlinks', shortlinksRouter);
app.route('/admin/coupons', adminCouponsRouter);
app.route('/admin/shortlinks', adminShortlinksRouter);
app.route('/admin/events', adminEventsRouter);
app.route('/admin/analytics', adminAnalyticsRouter);
app.route('/admin', adminDashboardRouter);
app.route('/cms', cmsRouter);
app.route('/book-requests', bookRequestsRouter);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);
