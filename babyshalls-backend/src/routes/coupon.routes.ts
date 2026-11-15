import { Router, Request, Response } from 'express';
import { DiscountType } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { handleRouteError, sendValidationError } from '../lib/http-error.js';

const router = Router();

const validateCouponSchema = z.object({
  code: z.string().trim().min(1, 'Kode kupon wajib diisi.').max(32, 'Kode kupon maksimal 32 karakter.'),
  subtotal: z.number().nonnegative('Subtotal tidak boleh negatif.'),
  shippingCost: z.number().nonnegative('Ongkos kirim tidak boleh negatif.').optional().default(0),
});

function formatCouponDto(coupon: {
  id: string;
  code: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: unknown;
  maxDiscount: unknown;
  minOrder: unknown;
  maxUsage: number | null;
  usedCount: number;
  expiresAt: Date | null;
  isActive: boolean;
}) {
  return {
    id: coupon.id,
    code: coupon.code,
    description: coupon.description,
    discountType: coupon.discountType,
    discountValue: Number(coupon.discountValue),
    maxDiscount: coupon.maxDiscount !== null ? Number(coupon.maxDiscount) : null,
    minOrder: Number(coupon.minOrder),
    maxUsage: coupon.maxUsage,
    usedCount: coupon.usedCount,
    expiresAt: coupon.expiresAt ? coupon.expiresAt.toISOString() : null,
    isActive: coupon.isActive,
  };
}

/**
 * GET /api/coupons/active
 * List active, non-expired coupons with remaining quota for storefront checkout.
 */
router.get('/active', async (_req: Request, res: Response) => {
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
      .filter((c) => c.maxUsage === null || c.usedCount < c.maxUsage)
      .map(formatCouponDto);

    return res.json({
      success: true,
      data: available,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat daftar kupon aktif.');
  }
});

/**
 * POST /api/coupons/validate
 * Validate coupon eligibility and calculate exact discountAmount.
 */
router.post('/validate', async (req: Request, res: Response) => {
  const parsed = validateCouponSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Payload validasi kupon tidak valid.');
  }

  const normalizedCode = parsed.data.code.toUpperCase();
  const { subtotal, shippingCost } = parsed.data;

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Kode kupon tidak ditemukan atau sedang nonaktif.',
        code: 'NOT_FOUND',
      });
    }

    if (coupon.expiresAt && coupon.expiresAt <= new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Kode kupon sudah kedaluwarsa.',
        code: 'VALIDATION_ERROR',
      });
    }

    if (coupon.maxUsage !== null && coupon.usedCount >= coupon.maxUsage) {
      return res.status(400).json({
        success: false,
        error: 'Kuota penggunaan kupon ini sudah habis.',
        code: 'VALIDATION_ERROR',
      });
    }

    const minOrder = Number(coupon.minOrder);
    if (subtotal < minOrder) {
      return res.status(400).json({
        success: false,
        error: `Minimal belanja untuk kupon ini adalah Rp ${minOrder.toLocaleString('id-ID')}.`,
        code: 'VALIDATION_ERROR',
      });
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
      // FIXED_AMOUNT
      discountAmount = Math.min(discountValue, subtotal);
    }

    return res.json({
      success: true,
      data: {
        valid: true,
        coupon: formatCouponDto(coupon),
        discountAmount,
      },
      message: `Kupon ${coupon.code} berhasil diterapkan.`,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memvalidasi kupon.');
  }
});

export default router;

