import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';
import { expressErrorHandler, handleRouteError } from './lib/http-error.js';
import authRoutes from './routes/auth.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import adminCouponRoutes from './routes/admin-coupon.routes.js';
import orderRoutes from './routes/order.routes.js';
import eventRoutes from './routes/event.routes.js';
import bookRequestRoutes from './routes/book-request.routes.js';
import adminDashboardRoutes from './routes/admin-dashboard.routes.js';
import adminEventsRoutes from './routes/admin-events.routes.js';
import adminAnalyticsRoutes from './routes/admin-analytics.routes.js';
import productRoutes from './routes/product.routes.js';
import accountRoutes from './routes/account.routes.js';
import shippingRoutes from './modules/shipping/shipping.routes.js';
import { adminShortlinkRouter, publicShortlinkRouter } from './routes/shortlink.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

type HelmetOptions = {
  crossOriginOpenerPolicy?: { policy: 'same-origin' | 'same-origin-allow-popups' | 'unsafe-none' } | boolean;
  crossOriginResourcePolicy?: { policy: 'same-origin' | 'same-site' | 'cross-origin' } | boolean;
};
type HelmetFactory = (options?: HelmetOptions) => express.RequestHandler;
const rawHelmet = helmet as unknown as HelmetFactory | { default: HelmetFactory };
const helmetFactory = typeof rawHelmet === 'function' ? rawHelmet : rawHelmet.default;
app.use(
  helmetFactory({
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const configuredOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/+$/, '');
      const isAllowed =
        configuredOrigins.includes(normalized) ||
        /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(normalized) ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalized);
      if (isAllowed) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
    exposedHeaders: ['Idempotency-Replayed', 'Retry-After'],
  })
);
app.use(express.json());

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    app: 'BabyShalls E-Commerce Engine',
    version: '1.0.0',
    location: 'Malang, Jawa Timur',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 0. Auth & Coupon Routes
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin/coupons', adminCouponRoutes);
app.use('/api/admin/events', adminEventsRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);
app.use('/api/admin/shortlinks', adminShortlinkRouter);
app.use('/api/admin', adminDashboardRoutes);
app.use('/api/shortlinks', publicShortlinkRouter);

// Public Semi-CMS content endpoint
app.get('/api/cms', async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.siteContent.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return res.json({ success: true, data: map });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat konten halaman utama.');
  }
});

// ==========================================
// 1. Logistik Hybrid (RajaOngkir V2 + BinderByte)
// ==========================================
app.use('/api/shipping', shippingRoutes);

// ==========================================
// 2. Pembayaran Midtrans Snap & Webhook
// ==========================================
app.use('/api/orders', orderRoutes);

// ==========================================
// 3. Event & Workshop Pendaftaran
// ==========================================
app.use('/api/events', eventRoutes);

// ==========================================
// 4. Book Request (Jastip Buku Impor)
// ==========================================
app.use('/api/book-requests', bookRequestRoutes);

app.use(expressErrorHandler);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(` BabyShalls Backend Server running on port ${PORT}`);
    console.log(`📍 Logistics Origin locked to: Kota Malang, Jawa Timur`);
  });
}

export default app;

