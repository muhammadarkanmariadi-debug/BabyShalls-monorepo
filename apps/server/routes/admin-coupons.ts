import { Hono } from 'hono';
import { DiscountType } from '@/server/generated/prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAdmin, requireAuth, type AuthVariables } from '../middleware/auth';

const adminCouponsRouter = new Hono<{ Variables: AuthVariables }>();
adminCouponsRouter.use('*', requireAuth, requireAdmin);

const createCouponSchema = z.object({
  code: z.string().trim().min(2).max(50),
  description: z.string().trim().max(300).optional().nullable(),
  discountType: z.nativeEnum(DiscountType).default(DiscountType.FIXED_AMOUNT),
  discountValue: z.coerce.number().min(0),
  maxDiscount: z.coerce.number().min(0).optional().nullable(),
  minOrder: z.coerce.number().min(0).optional().default(0),
  maxUsage: z.coerce.number().int().min(1).optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

adminCouponsRouter.get('/', async (c) => {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  return c.json({
    success: true,
    data: coupons.map((cp) => ({
      ...cp,
      discountValue: Number(cp.discountValue),
      maxDiscount: cp.maxDiscount !== null ? Number(cp.maxDiscount) : null,
      minOrder: Number(cp.minOrder),
    })),
  });
});

adminCouponsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = createCouponSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: 'Data kupon tidak valid.' }, 400);
    }

    const code = parsed.data.code.toUpperCase();
    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      return c.json({ success: false, error: 'Kode kupon sudah ada.' }, 409);
    }

    const created = await prisma.coupon.create({
      data: {
        ...parsed.data,
        code,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      },
    });

    return c.json(
      {
        success: true,
        data: {
          ...created,
          discountValue: Number(created.discountValue),
          maxDiscount: created.maxDiscount !== null ? Number(created.maxDiscount) : null,
          minOrder: Number(created.minOrder),
        },
      },
      201
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal membuat kupon.';
    return c.json({ success: false, error: message }, 500);
  }
});

adminCouponsRouter.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const parsed = createCouponSchema.partial().safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: 'Data pembaruan kupon tidak valid.' }, 400);
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        ...parsed.data,
        code: parsed.data.code ? parsed.data.code.toUpperCase() : undefined,
        expiresAt:
          parsed.data.expiresAt === undefined
            ? undefined
            : parsed.data.expiresAt
            ? new Date(parsed.data.expiresAt)
            : null,
      },
    });

    return c.json({
      success: true,
      data: {
        ...updated,
        discountValue: Number(updated.discountValue),
        maxDiscount: updated.maxDiscount !== null ? Number(updated.maxDiscount) : null,
        minOrder: Number(updated.minOrder),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui kupon.';
    return c.json({ success: false, error: message }, 500);
  }
});

adminCouponsRouter.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await prisma.coupon.delete({ where: { id } });
  return c.json({ success: true, message: 'Kupon berhasil dihapus.' });
});

export default adminCouponsRouter;

