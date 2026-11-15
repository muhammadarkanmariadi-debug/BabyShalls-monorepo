import { Router, Response } from 'express';
import { AgeGroup, OrderStatus } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { sendOrderReceiptEmail } from '../lib/mailer.js';
import { shippingService } from '../modules/shipping/shipping.service.js';
import { runEmailBroadcast, triggerEventBroadcastAsync } from '../lib/broadcast.js';
import { authenticateJWT, requireAdmin, AuthRequest } from '../middleware/auth.middleware.js';
import { handleRouteError, sendValidationError } from '../lib/http-error.js';

const router = Router();
router.use(authenticateJWT, requireAdmin);

const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus, { message: 'Status pesanan tidak valid.' }),
  waybillNumber: z.string().trim().max(100, 'Nomor resi maksimal 100 karakter.').optional().nullable(),
});

const createProductSchema = z.object({
  name: z.string().trim().min(2, 'Nama produk minimal 2 karakter.').max(150, 'Nama produk maksimal 150 karakter.'),
  slug: z.string().trim().min(2).max(150).optional(),
  description: z.string().trim().min(2, 'Deskripsi minimal 2 karakter.').max(2000).default('Buku/mainan kurasi BabyShalls Malang.'),
  price: z.number().positive('Harga produk harus lebih dari 0.'),
  originalPrice: z.number().positive('Harga coret harus lebih dari 0.').optional().nullable(),
  authorOrBrand: z.string().trim().max(100).optional().nullable(),
  stock: z.number().int('Stok harus berupa bilangan bulat.').nonnegative('Stok tidak boleh negatif.').default(0),
  weight: z.number().int('Berat harus berupa bilangan bulat (gram).').positive('Berat harus lebih dari 0 gram.').default(300),
  ageGroup: z.nativeEnum(AgeGroup).default(AgeGroup.ALL_AGES),
  category: z.string().trim().min(2, 'Kategori minimal 2 karakter.').max(60).default('Books'),
  subCategory: z.string().trim().max(60).optional().nullable(),
  images: z.array(z.string().trim().min(1)).min(1, 'Minimal 1 gambar produk wajib diisi.').default(['/images/placeholder-book.jpg']),
  features: z.array(z.string().trim().min(1)).optional().default([]),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
});

const updateProductSchema = createProductSchema.partial();

const updateBookRequestSchema = z.object({
  status: z.enum(['PENDING', 'QUOTED', 'ORDERED', 'COMPLETED'], { message: 'Status Book Request tidak valid.' }),
  adminNotes: z.string().trim().max(1000).optional().nullable(),
});

const updateCmsSchema = z.record(z.string().trim().min(1), z.string().max(5000));

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * GET /api/admin/stats
 */
router.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const [paidOrdersAgg, totalOrders, totalEventRegistrations, totalBookRequests, totalProducts] =
      await Promise.all([
        prisma.order.aggregate({
          where: { status: { in: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.COMPLETED] } },
          _sum: { grandTotal: true },
        }),
        prisma.order.count(),
        prisma.eventRegistration.count(),
        prisma.bookRequest.count(),
        prisma.product.count(),
      ]);

    return res.json({
      success: true,
      data: {
        totalRevenue: Number(paidOrdersAgg._sum.grandTotal ?? 0),
        totalOrders,
        totalEventRegistrations,
        totalBookRequests,
        totalProducts,
      },
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat statistik admin.');
  }
});

/**
 * GET /api/admin/orders
 */
router.get('/orders', async (_req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: orders.map((o) => ({
        ...o,
        totalAmount: Number(o.totalAmount),
        discountAmount: Number(o.discountAmount),
        shippingCost: Number(o.shippingCost),
        grandTotal: Number(o.grandTotal),
      })),
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat statistik admin.');
  }
});

/**
 * PATCH /api/admin/orders/:id/waybill
 * Input resi manual oleh Admin (menggantikan auto-pickup agregator lama)
 */
const setWaybillSchema = z.object({
  courierCode: z.string().trim().min(2, 'Kurir wajib dipilih.'),
  courierService: z.string().trim().max(50).optional().nullable(),
  waybillNumber: z.string().trim().min(6, 'Nomor resi minimal 6 karakter.').max(100),
});

router.patch('/orders/:id/waybill', async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = setWaybillSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data resi pengiriman tidak valid.');
  }

  try {
    const updated = await shippingService.setOrderWaybill(id, parsed.data);
    return res.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menyimpan nomor resi.';
    if (message.includes('Wahana Express') || message.includes('Format nomor resi')) {
      return res.status(400).json({ success: false, message });
    }
    return handleRouteError(res, err, 'Gagal menyimpan nomor resi.');
  }
});

/**
 * PATCH /api/admin/orders/:id/status
 */
router.patch('/orders/:id/status', async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = updateOrderStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Status order tidak valid.');
  }

  try {
    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: parsed.data.status,
        ...(parsed.data.waybillNumber !== undefined ? { waybillNumber: parsed.data.waybillNumber } : {}),
      },
      include: {
        user: { select: { email: true, name: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    });

    if (
      (parsed.data.status === OrderStatus.SHIPPED || parsed.data.waybillNumber) &&
      updated.user?.email
    ) {
      const addr = (updated.shippingAddress || {}) as Record<string, string>;
      void sendOrderReceiptEmail({
        to: updated.user.email,
        customerName: addr.recipientName || updated.user.name,
        orderNumber: updated.orderNumber,
        eventType: 'SHIPPED',
        items: updated.items.map((it) => ({
          name: it.product.name,
          quantity: it.quantity,
          price: Number(it.price),
        })),
        totalAmount: Number(updated.totalAmount),
        discountAmount: Number(updated.discountAmount),
        shippingCost: Number(updated.shippingCost),
        grandTotal: Number(updated.grandTotal),
        courierCode: updated.courierCode,
        courierService: updated.courierService,
        waybillNumber: updated.waybillNumber,
        shippingAddressText: [addr.address, addr.city, addr.postalCode].filter(Boolean).join(', '),
      }).catch((err) => {
        console.warn('⚠️ Gagal mengirim email update resi:', err?.message || err);
      });
    }

    return res.json({ success: true, data: updated });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat statistik admin.');
  }
});

/**
 * GET /api/admin/products
 */
router.get('/products', async (_req: AuthRequest, res: Response) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({
      success: true,
      data: products.map((p) => ({
        ...p,
        price: Number(p.price),
        originalPrice: p.originalPrice !== null ? Number(p.originalPrice) : null,
        rating: Number(p.rating),
      })),
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat statistik admin.');
  }
});

/**
 * POST /api/admin/products
 */
router.post('/products', async (req: AuthRequest, res: Response) => {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data produk tidak valid.');
  }

  const slug = parsed.data.slug || `${toSlug(parsed.data.name)}-${Date.now().toString().slice(-4)}`;

  try {
    const created = await prisma.product.create({
      data: {
        ...parsed.data,
        slug,
      },
    });
    return res.status(201).json({
      success: true,
      data: { ...created, price: Number(created.price) },
      message: `Produk ${created.name} berhasil ditambahkan.`,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat statistik admin.');
  }
});

/**
 * PATCH /api/admin/products/:id
 */
router.patch('/products/:id', async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data pembaruan produk tidak valid.');
  }

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });
    return res.json({
      success: true,
      data: { ...updated, price: Number(updated.price) },
      message: `Produk ${updated.name} berhasil diperbarui.`,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat statistik admin.');
  }
});

/**
 * DELETE /api/admin/products/:id
 */
router.delete('/products/:id', async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    await prisma.product.delete({ where: { id } });
    return res.json({ success: true, data: { id }, message: 'Produk berhasil dihapus.' });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat statistik admin.');
  }
});

/**
 * GET /api/admin/book-requests
 */
router.get('/book-requests', async (_req: AuthRequest, res: Response) => {
  try {
    const list = await prisma.bookRequest.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, data: list });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat statistik admin.');
  }
});

/**
 * PATCH /api/admin/book-requests/:id
 */
router.patch('/book-requests/:id', async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = updateBookRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Status Book Request tidak valid.');
  }

  try {
    const updated = await prisma.bookRequest.update({
      where: { id },
      data: {
        status: parsed.data.status,
        ...(parsed.data.adminNotes !== undefined ? { adminNotes: parsed.data.adminNotes } : {}),
      },
    });
    return res.json({ success: true, data: updated });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat statistik admin.');
  }
});

/**
 * GET /api/admin/cms
 */
router.get('/cms', async (_req: AuthRequest, res: Response) => {
  try {
    const rows = await prisma.siteContent.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return res.json({ success: true, data: map });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat statistik admin.');
  }
});

/**
 * PUT /api/admin/cms
 */
router.put('/cms', async (req: AuthRequest, res: Response) => {
  const parsed = updateCmsSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Format konten CMS tidak valid.');
  }

  try {
    const entries = Object.entries(parsed.data);
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.siteContent.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );
    return res.json({ success: true, message: 'Konten halaman utama berhasil diperbarui.' });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat statistik admin.');
  }
});

const createEventSchema = z.object({
  title: z.string().trim().min(3, 'Judul event minimal 3 karakter.'),
  description: z.string().trim().min(5, 'Deskripsi event minimal 5 karakter.'),
  bannerImage: z.string().trim().default('/images/event-default.jpg'),
  eventDate: z.string().min(4, 'Tanggal event wajib diisi.'),
  timeString: z.string().trim().default('10:00 - 12:00 WIB'),
  location: z.string().trim().default('Toko BabyShalls Malang'),
  price: z.number().nonnegative().default(0),
  quota: z.number().int().positive().default(20),
  broadcastEmail: z.boolean().optional().default(true),
});

/**
 * POST /api/admin/events
 * Create a new workshop/event and optionally auto-broadcast to email subscribers.
 */
router.post('/events', async (req: AuthRequest, res: Response) => {
  const parsed = createEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data event tidak valid.');
  }

  try {
    const slug = `${toSlug(parsed.data.title)}-${Date.now().toString().slice(-4)}`;
    const created = await prisma.event.create({
      data: {
        title: parsed.data.title,
        slug,
        description: parsed.data.description,
        bannerImage: parsed.data.bannerImage,
        eventDate: new Date(parsed.data.eventDate),
        timeString: parsed.data.timeString,
        location: parsed.data.location,
        price: parsed.data.price,
        quota: parsed.data.quota,
      },
    });

    if (parsed.data.broadcastEmail) {
      triggerEventBroadcastAsync(created);
    }

    return res.status(201).json({
      success: true,
      data: { ...created, price: Number(created.price) },
      message: `Event "${created.title}" berhasil dibuat.`,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat statistik admin.');
  }
});

const manualBroadcastSchema = z.object({
  type: z.enum(['PROMO', 'EVENT', 'CUSTOM']).default('CUSTOM'),
  subject: z.string().trim().min(3, 'Subjek email minimal 3 karakter.'),
  badgeText: z.string().trim().default('KABAR BABYSHALLS'),
  headline: z.string().trim().min(3, 'Judul utama wajib diisi.'),
  messageBody: z.string().trim().min(5, 'Isi pesan minimal 5 karakter.'),
  highlightCode: z.string().trim().optional().nullable(),
  ctaLabel: z.string().trim().optional(),
  ctaUrl: z.string().trim().optional(),
});

/**
 * GET /api/admin/broadcasts
 */
router.get('/broadcasts', async (_req: AuthRequest, res: Response) => {
  try {
    const logs = await prisma.broadcastLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 25,
    });
    return res.json({ success: true, data: logs });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat statistik admin.');
  }
});

/**
 * POST /api/admin/broadcast
 */
router.post('/broadcast', async (req: AuthRequest, res: Response) => {
  const parsed = manualBroadcastSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Payload broadcast tidak valid.');
  }

  try {
    const cleanHtml = sanitizeHtml(parsed.data.messageBody, {
      allowedTags: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
        'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'a', 'hr',
      ],
      allowedAttributes: {
        a: ['href', 'target', 'rel'],
      },
      allowedSchemes: ['http', 'https', 'mailto'],
    });

    const result = await runEmailBroadcast({
      type: parsed.data.type,
      subject: parsed.data.subject,
      badgeText: parsed.data.badgeText,
      headline: parsed.data.headline,
      messageBody: cleanHtml || `<p>${parsed.data.messageBody.replace(/\n/g, '<br/>')}</p>`,
      highlightCode: parsed.data.highlightCode || undefined,
      ctaLabel: parsed.data.ctaLabel,
      ctaUrl: parsed.data.ctaUrl,
    });

    return res.json({
      success: true,
      data: result,
      message: `Broadcast diproses untuk ${result.recipientCount} pelanggan (${result.sentCount} terkirim).`,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat statistik admin.');
  }
});

export default router;

