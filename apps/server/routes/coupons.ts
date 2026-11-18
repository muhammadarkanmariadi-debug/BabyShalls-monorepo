import { Hono } from 'hono';
import { DiscountType } from '@/server/generated/prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const couponsRouter = new Hono();

const validateCouponSchema = z.object({
  code: z.string().trim().min(1, 'Kode kupon wajib diisi.'),
  subtotal: z.coerce.number().min(0),
  shippingCost: z.coerce.number().min(0).optional().default(0),
});

function formatCouponDto(c: {
  id: string;
  code: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: unknown;
  minOrder: unknown;
  maxDiscount: unknown | null;
  maxUsage: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date | null;
}) {
  return {
    id: c.id,
    code: c.code,
    description: c.description,
    discountType: c.discountType,
    discountValue: Number(c.discountValue),
    minOrder: Number(c.minOrder),
    maxDiscount: c.maxDiscount !== null ? Number(c.maxDiscount) : null,
    maxUsage: c.maxUsage,
    usedCount: c.usedCount,
    isActive: c.isActive,
    expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
  };
}

couponsRouter.get('/active', async (c) => {
  try {
    const now = new Date();
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: { createdAt: 'asc' },
    });

    const available = coupons
      .filter((cp) => cp.maxUsage === null || cp.usedCount < cp.maxUsage)
      .map(formatCouponDto);

    return c.json(
      { success: true, data: available },
      200,
      { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat daftar kupon aktif.';
    return c.json({ success: false, error: message }, 500);
  }
});

couponsRouter.post('/validate', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = validateCouponSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Payload validasi kupon tidak valid.',
          code: 'VALIDATION_ERROR',
        },
        400
      );
    }

    const normalizedCode = parsed.data.code.toUpperCase();
    const { subtotal, shippingCost } = parsed.data;

    const coupon = await prisma.coupon.findUnique({ where: { code: normalizedCode } });
    if (!coupon || !coupon.isActive) {
      return c.json(
        { success: false, error: 'Kode kupon tidak ditemukan atau sedang nonaktif.', code: 'NOT_FOUND' },
        404
      );
    }

    if (coupon.expiresAt && coupon.expiresAt <= new Date()) {
      return c.json({ success: false, error: 'Kode kupon sudah kedaluwarsa.', code: 'VALIDATION_ERROR' }, 400);
    }

    if (coupon.maxUsage !== null && coupon.usedCount >= coupon.maxUsage) {
      return c.json(
        { success: false, error: 'Kuota penggunaan kupon ini sudah habis.', code: 'VALIDATION_ERROR' },
        400
      );
    }

    const minOrder = Number(coupon.minOrder);
    if (subtotal < minOrder) {
      return c.json(
        {
          success: false,
          error: `Minimal belanja untuk kupon ini adalah Rp ${minOrder.toLocaleString('id-ID')}.`,
          code: 'VALIDATION_ERROR',
        },
        400
      );
    }

    const discountValue = Number(coupon.discountValue);
    const maxDiscount = coupon.maxDiscount !== null ? Number(coupon.maxDiscount) : null;

    let discountAmount = 0;
    if (coupon.discountType === DiscountType.PERCENTAGE) {
      const rawDiscount = Math.round((subtotal * discountValue) / 100);
      const capped = maxDiscount !== null ? Math.min(rawDiscount, maxDiscount) : rawDiscount;
      discountAmount = Math.min(capped, subtotal);
    } else if (coupon.discountType === DiscountType.SHIPPING_SUBSIDY) {
      discountAmount = Math.min(discountValue, shippingCost);
    } else {
      discountAmount = Math.min(discountValue, subtotal);
    }

    return c.json({
      success: true,
      data: {
        valid: true,
        coupon: formatCouponDto(coupon),
        discountAmount,
      },
      message: `Kupon ${coupon.code} berhasil diterapkan.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memvalidasi kupon.';
    return c.json({ success: false, error: message }, 500);
  }
});

export default couponsRouter;

