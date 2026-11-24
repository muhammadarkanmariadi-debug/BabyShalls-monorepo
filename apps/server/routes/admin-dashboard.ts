import { Hono } from 'hono';
import { AgeGroup, OrderStatus, ProductCondition } from '@/server/generated/prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { delCacheByPattern } from '../lib/redis';
import { sendEmail } from '../lib/mailer';
import { requireAdmin, requireAuth, type AuthVariables } from '../middleware/auth';

const adminDashboardRouter = new Hono<{ Variables: AuthVariables }>();
adminDashboardRouter.use('*', requireAuth, requireAdmin);

const productSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200).optional(),
  sku: z.string().trim().max(100).optional().nullable(),
  description: z.string().trim().min(2),
  price: z.coerce.number().min(0),
  originalPrice: z.coerce.number().min(0).optional().nullable(),
  authorOrBrand: z.string().trim().optional().nullable(),
  condition: z.nativeEnum(ProductCondition).optional().default(ProductCondition.NEW),
  prelovedGrade: z.string().trim().optional().nullable(),
  conditionNote: z.string().trim().optional().nullable(),
  stock: z.coerce.number().int().min(0).default(0),
  weight: z.coerce.number().int().min(1).default(300),
  publisher: z.string().trim().optional().nullable(),
  isbn: z.string().trim().optional().nullable(),
  pages: z.coerce.number().int().optional().nullable(),
  ageGroup: z.nativeEnum(AgeGroup).optional().default(AgeGroup.ALL_AGES),
  category: z.string().trim().min(1),
  subCategory: z.string().trim().optional().nullable(),
  images: z.array(z.string().trim()).optional().default([]),
  isNewArrival: z.boolean().optional().default(false),
  isBestSeller: z.boolean().optional().default(false),
});

adminDashboardRouter.get('/stats', async (c) => {
  const paidStatuses: OrderStatus[] = [
    OrderStatus.PAID,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.COMPLETED,
  ];
  const [totalOrders, paidAgg, totalProducts, pendingRequests, totalUsers] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: { in: paidStatuses } },
      _sum: { grandTotal: true },
    }),
    prisma.product.count(),
    prisma.bookRequest.count({ where: { status: 'PENDING' } }),
    prisma.user.count({ where: { role: 'USER' } }),
  ]);

  return c.json({
    success: true,
    data: {
      totalOrders,
      totalRevenue: Number(paidAgg._sum.grandTotal || 0),
      totalProducts,
      pendingRequests,
      totalUsers,
    },
  });
});

adminDashboardRouter.get('/orders', async (c) => {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: { include: { product: { select: { name: true, slug: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return c.json({
    success: true,
    data: orders.map((o) => ({
      ...o,
      totalAmount: Number(o.totalAmount),
      discountAmount: Number(o.discountAmount),
      shippingCost: Number(o.shippingCost),
      grandTotal: Number(o.grandTotal),
      items: o.items.map((it) => ({ ...it, price: Number(it.price) })),
    })),
  });
});

adminDashboardRouter.patch('/orders/:id/waybill', async (c) => {
  const id = c.req.param('id');
  const body = (await c.req.json()) as { waybillNumber?: string; courierCode?: string };
  if (!body.waybillNumber?.trim()) {
    return c.json({ success: false, error: 'Nomor resi wajib diisi.' }, 400);
  }

  const updated = await prisma.order.update({
    where: { id },
    data: {
      waybillNumber: body.waybillNumber.trim(),
      courierCode: body.courierCode?.trim() || undefined,
      status: OrderStatus.SHIPPED,
    },
  });

  return c.json({ success: true, data: updated });
});

adminDashboardRouter.patch('/orders/:id/status', async (c) => {
  const id = c.req.param('id');
  const body = (await c.req.json()) as { status?: OrderStatus };
  if (!body.status || !Object.values(OrderStatus).includes(body.status)) {
    return c.json({ success: false, error: 'Status pesanan tidak valid.' }, 400);
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status: body.status },
  });

  return c.json({ success: true, data: updated });
});

adminDashboardRouter.get('/products', async (c) => {
  const products = await prisma.product.findMany({
    include: { galleryImages: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });

  return c.json({
    success: true,
    data: products.map((p) => ({
      ...p,
      price: Number(p.price),
      originalPrice: p.originalPrice !== null ? Number(p.originalPrice) : null,
    })),
  });
});

adminDashboardRouter.get('/products/:id', async (c) => {
  const id = c.req.param('id');
  const product = await prisma.product.findUnique({
    where: { id },
    include: { galleryImages: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!product) return c.json({ success: false, error: 'Produk tidak ditemukan.' }, 404);
  return c.json({
    success: true,
    data: {
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice !== null ? Number(product.originalPrice) : null,
    },
  });
});

adminDashboardRouter.post('/products', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Data produk tidak valid.' },
        400
      );
    }

    const slug =
      parsed.data.slug ||
      parsed.data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
        '-' +
        Date.now().toString().slice(-4);

    const created = await prisma.product.create({
      data: { ...parsed.data, slug },
    });

    await delCacheByPattern('products:*');
    return c.json({ success: true, data: { ...created, price: Number(created.price) } }, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal membuat produk.';
    return c.json({ success: false, error: message }, 500);
  }
});

adminDashboardRouter.patch('/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const parsed = productSchema.partial().safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: 'Data pembaruan produk tidak valid.' }, 400);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    await delCacheByPattern('products:*');
    return c.json({ success: true, data: { ...updated, price: Number(updated.price) } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui produk.';
    return c.json({ success: false, error: message }, 500);
  }
});

adminDashboardRouter.delete('/products/:id', async (c) => {
  const id = c.req.param('id');
  await prisma.product.delete({ where: { id } });
  await delCacheByPattern('products:*');
  return c.json({ success: true, message: 'Produk berhasil dihapus.' });
});

adminDashboardRouter.get('/book-requests', async (c) => {
  const rows = await prisma.bookRequest.findMany({ orderBy: { createdAt: 'desc' } });
  return c.json({ success: true, data: rows });
});

adminDashboardRouter.patch('/book-requests/:id', async (c) => {
  const id = c.req.param('id');
  const body = (await c.req.json()) as { status?: string; adminNotes?: string };
  const updated = await prisma.bookRequest.update({
    where: { id },
    data: { status: body.status, adminNotes: body.adminNotes },
  });
  return c.json({ success: true, data: updated });
});

adminDashboardRouter.get('/cms', async (c) => {
  const rows = await prisma.siteContent.findMany();
  return c.json({ success: true, data: Object.fromEntries(rows.map((r) => [r.key, r.value])) });
});

adminDashboardRouter.put('/cms', async (c) => {
  const body = (await c.req.json()) as Record<string, string>;
  const entries = Object.entries(body || {});
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteContent.upsert({
        where: { key },
        create: { key, value: String(value ?? '') },
        update: { value: String(value ?? '') },
      })
    )
  );
  return c.json({ success: true, message: 'CMS content updated successfully.' });
});

adminDashboardRouter.get('/broadcasts', async (c) => {
  const logs = await prisma.broadcastLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  return c.json({ success: true, data: logs });
});

adminDashboardRouter.post('/broadcast', async (c) => {
  try {
    const body = (await c.req.json()) as { subject?: string; html?: string; bodyHtml?: string };
    const subject = String(body.subject || '').trim();
    const html = String(body.html || body.bodyHtml || '').trim();
    if (!subject || !html) {
      return c.json({ success: false, error: 'Subject dan isi broadcast wajib diisi.' }, 400);
    }

    const subscribers = await prisma.user.findMany({
      where: { emailOptIn: true, role: 'USER' },
      select: { email: true },
      take: 200,
    });

    let sentCount = 0;
    for (const sub of subscribers) {
      if (!sub.email.endsWith('@guest.babyshalls.local')) {
        const res = await sendEmail({ to: sub.email, subject, html });
        if (res.sent || res.previewLogged) sentCount += 1;
      }
    }

    const log = await prisma.broadcastLog.create({
      data: {
        type: 'CUSTOM',
        subject,
        recipientCount: subscribers.length,
        sentCount,
        status: 'SENT',
      },
    });

    return c.json({ success: true, data: log, message: `Broadcast terkirim ke ${sentCount} penerima.` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengirim broadcast.';
    return c.json({ success: false, error: message }, 500);
  }
});

export default adminDashboardRouter;
