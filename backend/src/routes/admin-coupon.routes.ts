import { Router, Response } from 'express';
import { DiscountType } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { triggerCouponBroadcastAsync } from '../lib/broadcast.js';
import { authenticateJWT, requireAdmin, AuthRequest } from '../middleware/auth.middleware.js';
import { handleRouteError, sendValidationError } from '../lib/http-error.js';

const router = Router();

router.use(authenticateJWT, requireAdmin);

const baseCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, 'Kode kupon minimal 2 karakter.')
    .max(32, 'Kode kupon maksimal 32 karakter.')
    .regex(/^[A-Za-z0-9_-]+$/, 'Kode kupon hanya boleh berisi huruf, angka, tanda hubung (-), atau garis bawah (_).'),
  description: z.string().trim().max(300, 'Deskripsi maksimal 300 karakter.').optional().nullable(),
  discountType: z.nativeEnum(DiscountType).default(DiscountType.FIXED_AMOUNT),
  discountValue: z.number().positive('Nilai diskon harus lebih dari 0.'),
  maxDiscount: z.number().positive('Maksimal diskon harus lebih dari 0.').optional().nullable(),
  minOrder: z.number().nonnegative('Minimal belanja tidak boleh negatif.').optional().default(0),
  maxUsage: z.number().int('Kuota penggunaan harus bilangan bulat.').positive('Kuota penggunaan harus lebih dari 0.').optional().nullable(),
  expiresAt: z.string().datetime('Format tanggal kedaluwarsa tidak valid.').optional().nullable(),
  isActive: z.boolean().optional().default(true),
  broadcastEmail: z.boolean().optional().default(true),
});

const createCouponSchema = baseCouponSchema.superRefine((data, ctx) => {
  if (data.discountType === DiscountType.PERCENTAGE && data.discountValue > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['discountValue'],
      message: 'Diskon persentase tidak boleh lebih dari 100%.',
    });
  }
});

const updateCouponSchema = baseCouponSchema.partial().superRefine((data, ctx) => {
  if (data.discountType === DiscountType.PERCENTAGE && data.discountValue !== undefined && data.discountValue > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['discountValue'],
      message: 'Diskon persentase tidak boleh lebih dari 100%.',
    });
  }
});

function serializeCoupon(c: {
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
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: c.id,
    code: c.code,
    description: c.description,
    discountType: c.discountType,
    discountValue: Number(c.discountValue),
    maxDiscount: c.maxDiscount !== null ? Number(c.maxDiscount) : null,
    minOrder: Number(c.minOrder),
    maxUsage: c.maxUsage,
    usedCount: c.usedCount,
    expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
    isActive: c.isActive,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

/**
 * GET /api/admin/coupons
 * List all coupons for Admin dashboard.
 */
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json({
      success: true,
      data: coupons.map(serializeCoupon),
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal mengambil data kupon.');
  }
});

/**
 * POST /api/admin/coupons
 * Create a new coupon.
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  const parsed = createCouponSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data kupon tidak valid.');
  }

  const normalizedCode = parsed.data.code.toUpperCase();

  try {
    const existing = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `Kode kupon ${normalizedCode} sudah terdaftar.`,
        code: 'VALIDATION_ERROR',
      });
    }

    const created = await prisma.coupon.create({
      data: {
        code: normalizedCode,
        description: parsed.data.description ?? null,
        discountType: parsed.data.discountType,
        discountValue: parsed.data.discountValue,
        maxDiscount: parsed.data.maxDiscount ?? null,
        minOrder: parsed.data.minOrder ?? 0,
        maxUsage: parsed.data.maxUsage ?? null,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
        isActive: parsed.data.isActive ?? true,
      },
    });

    if (created.isActive && parsed.data.broadcastEmail) {
      triggerCouponBroadcastAsync(created);
    }

    return res.status(201).json({
      success: true,
      data: serializeCoupon(created),
      message: `Kupon ${created.code} berhasil dibuat.`,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal membuat kupon baru.');
  }
});

/**
 * PATCH /api/admin/coupons/:id
 * Update coupon details or toggle isActive status.
 */
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = updateCouponSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data pembaruan kupon tidak valid.');
  }

  try {
    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Kupon tidak ditemukan.',
        code: 'NOT_FOUND',
      });
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        ...(parsed.data.code ? { code: parsed.data.code.toUpperCase() } : {}),
        ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
        ...(parsed.data.discountType ? { discountType: parsed.data.discountType } : {}),
        ...(parsed.data.discountValue !== undefined ? { discountValue: parsed.data.discountValue } : {}),
        ...(parsed.data.maxDiscount !== undefined ? { maxDiscount: parsed.data.maxDiscount } : {}),
        ...(parsed.data.minOrder !== undefined ? { minOrder: parsed.data.minOrder } : {}),
        ...(parsed.data.maxUsage !== undefined ? { maxUsage: parsed.data.maxUsage } : {}),
        ...(parsed.data.expiresAt !== undefined
          ? { expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null }
          : {}),
        ...(parsed.data.isActive !== undefined ? { isActive: parsed.data.isActive } : {}),
      },
    });

    return res.json({
      success: true,
      data: serializeCoupon(updated),
      message: `Kupon ${updated.code} berhasil diperbarui.`,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memperbarui kupon.');
  }
});

/**
 * DELETE /api/admin/coupons/:id
 * Delete a coupon (or deactivate if already used in orders).
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  try {
    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Kupon tidak ditemukan.',
        code: 'NOT_FOUND',
      });
    }

    if (existing.usedCount > 0) {
      const deactivated = await prisma.coupon.update({
        where: { id },
        data: { isActive: false },
      });
      return res.json({
        success: true,
        data: serializeCoupon(deactivated),
        message: `Kupon ${existing.code} sudah pernah digunakan sehingga dinonaktifkan.`,
      });
    }

    await prisma.coupon.delete({ where: { id } });
    return res.json({
      success: true,
      data: { id },
      message: `Kupon ${existing.code} berhasil dihapus.`,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal menghapus kupon.');
  }
});

export default router;
