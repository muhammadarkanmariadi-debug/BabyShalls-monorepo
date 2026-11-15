import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { issueLoginOtp, verifyLoginOtp } from '../lib/otp.js';
import { sendEmailChangeOtpEmail } from '../lib/mailer.js';
import { authenticateJWT, AuthRequest } from '../middleware/auth.middleware.js';
import {
  childAgeSchema,
  emailSchema,
  handleRouteError,
  indonesianPhoneSchema,
  optionalIndonesianPhoneSchema,
  postalCodeSchema,
  sendError,
  sendValidationError,
} from '../lib/http-error.js';

const JWT_SECRET = process.env.JWT_SECRET || 'babyshalls-secret-jwt-key-2026-malang';
const router = Router();
router.use(authenticateJWT);

const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nama minimal 2 karakter.')
    .max(100, 'Nama maksimal 100 karakter.'),
  avatarUrl: z
    .union([z.string().trim().url('URL foto profil tidak valid.').max(500), z.literal(''), z.null(), z.undefined()])
    .transform((v) => (v === '' ? null : v)),
  phone: optionalIndonesianPhoneSchema,
  parentName: z.string().trim().max(100, 'Nama orang tua maksimal 100 karakter.').optional().nullable(),
  childName: z.string().trim().max(100, 'Nama anak maksimal 100 karakter.').optional().nullable(),
  childAge: childAgeSchema.optional().nullable().or(z.literal('')),
  emailOptIn: z.boolean().optional(),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Password saat ini minimal 6 karakter.'),
    newPassword: z
      .string()
      .min(8, 'Password baru minimal 8 karakter.')
      .max(100, 'Password baru maksimal 100 karakter.')
      .refine((val) => val.trim().length >= 8, 'Password baru tidak boleh hanya berisi spasi.'),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Password baru harus berbeda dari password saat ini.',
    path: ['newPassword'],
  });

const requestEmailChangeSchema = z.object({
  newEmail: emailSchema,
  currentPassword: z.string().min(6, 'Masukkan password saat ini untuk konfirmasi.'),
});

const verifyEmailChangeSchema = z.object({
  newEmail: emailSchema,
  otp: z.string().trim().regex(/^\d{6}$/, 'Kode OTP harus terdiri dari 6 digit angka.'),
});

const createAddressSchema = z.object({
  label: z.string().trim().min(2, 'Label alamat minimal 2 karakter.').max(40, 'Label maksimal 40 karakter.').default('Rumah'),
  receiverName: z.string().trim().min(2, 'Nama penerima minimal 2 karakter.').max(100, 'Nama penerima maksimal 100 karakter.'),
  receiverPhone: indonesianPhoneSchema,
  streetAddress: z.string().trim().min(5, 'Alamat lengkap minimal 5 karakter.').max(300, 'Alamat maksimal 300 karakter.'),
  city: z.string().trim().min(2, 'Kota wajib diisi.').max(100, 'Nama kota maksimal 100 karakter.'),
  subdistrict: z.string().trim().min(2, 'Kecamatan minimal 2 karakter.').max(100).default('-'),
  postalCode: postalCodeSchema,
  isDefault: z.boolean().optional().default(false),
});

const createReviewSchema = z.object({
  orderItemId: z.string().uuid('ID item pesanan tidak valid.'),
  rating: z.number().int('Rating harus berupa bilangan bulat.').min(1, 'Rating minimal 1 bintang.').max(5, 'Rating maksimal 5 bintang.'),
  comment: z.string().trim().min(3, 'Ulasan minimal 3 karakter.').max(1000, 'Ulasan maksimal 1000 karakter.'),
});

/**
 * GET /api/account/profile
 */
router.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        phone: true,
        parentName: true,
        childName: true,
        childAge: true,
        emailOptIn: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ success: false, error: 'Akun tidak ditemukan.', code: 'NOT_FOUND' });
    }
    return res.json({ success: true, data: user });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat profil akun.');
  }
});

/**
 * PATCH /api/account/profile
 */
router.patch('/profile', async (req: AuthRequest, res: Response) => {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Input profil tidak valid.');
  }

  try {
    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        name: parsed.data.name,
        ...(parsed.data.avatarUrl !== undefined ? { avatarUrl: parsed.data.avatarUrl } : {}),
        phone: parsed.data.phone ?? null,
        ...(parsed.data.parentName !== undefined ? { parentName: parsed.data.parentName?.trim() || null } : {}),
        ...(parsed.data.childName !== undefined ? { childName: parsed.data.childName?.trim() || null } : {}),
        ...(parsed.data.childAge !== undefined ? { childAge: parsed.data.childAge?.trim() || null } : {}),
        ...(parsed.data.emailOptIn !== undefined ? { emailOptIn: parsed.data.emailOptIn } : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        phone: true,
        parentName: true,
        childName: true,
        childAge: true,
        emailOptIn: true,
        role: true,
      },
    });
    return res.json({ success: true, data: updated, message: 'Profil berhasil diperbarui.' });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memperbarui profil.');
  }
});

/**
 * PATCH /api/account/password
 * Update password from user profile.
 */
router.patch('/password', async (req: AuthRequest, res: Response) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data ubah password tidak valid.');
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      return sendError(res, 404, 'Akun tidak ditemukan.', 'NOT_FOUND');
    }

    const isMatch = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 400, 'Password saat ini tidak sesuai.', 'VALIDATION_ERROR');
    }

    const newHash = await bcrypt.hash(parsed.data.newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return res.json({ success: true, message: 'Password berhasil diperbarui.' });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memperbarui password.');
  }
});

/**
 * POST /api/account/email/request-change
 * Verify current password and send 6-digit OTP to new email.
 */
router.post('/email/request-change', async (req: AuthRequest, res: Response) => {
  const parsed = requestEmailChangeSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data permintaan ganti email tidak valid.');
  }

  const newEmail = parsed.data.newEmail;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      return sendError(res, 404, 'Akun tidak ditemukan.', 'NOT_FOUND');
    }

    if (user.email.toLowerCase() === newEmail) {
      return sendError(res, 400, 'Email baru harus berbeda dari email Anda saat ini.', 'VALIDATION_ERROR');
    }

    const isMatch = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 400, 'Password saat ini tidak sesuai.', 'VALIDATION_ERROR');
    }

    const existing = await prisma.user.findUnique({ where: { email: newEmail } });
    if (existing) {
      return sendError(res, 409, 'Email tersebut sudah digunakan oleh akun lain.', 'CONFLICT');
    }

    const { code, expiresInSeconds } = await issueLoginOtp(user.id, newEmail);
    await sendEmailChangeOtpEmail({
      to: newEmail,
      name: user.parentName || user.name,
      otpCode: code,
      expiresInMinutes: Math.round(expiresInSeconds / 60),
    });

    return res.json({
      success: true,
      data: { newEmail, expiresInSeconds },
      message: `Kode verifikasi 6 digit telah dikirim ke ${newEmail}.`,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memproses permintaan ganti email.');
  }
});

/**
 * POST /api/account/email/verify-change
 * Confirm OTP sent to newEmail, update user email, and re-issue JWT.
 */
router.post('/email/verify-change', async (req: AuthRequest, res: Response) => {
  const parsed = verifyEmailChangeSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data verifikasi email baru tidak valid.');
  }

  try {
    const result = await verifyLoginOtp(parsed.data.newEmail, parsed.data.otp);
    if (!result.valid || result.userId !== req.user!.id) {
      return sendError(res, 401, result.reason || 'Kode OTP tidak valid atau sudah kedaluwarsa.', 'UNAUTHORIZED');
    }

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: { email: parsed.data.newEmail },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        phone: true,
        parentName: true,
        childName: true,
        childAge: true,
        emailOptIn: true,
        role: true,
      },
    });

    const token = jwt.sign(
      { id: updated.id, email: updated.email, role: updated.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      data: { token, user: updated },
      message: 'Alamat email berhasil diperbarui!',
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memperbarui alamat email.');
  }
});

/**
 * GET /api/account/addresses
 */
router.get('/addresses', async (req: AuthRequest, res: Response) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: [{ isDefault: 'desc' }, { label: 'asc' }],
    });
    return res.json({ success: true, data: addresses });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat daftar alamat.');
  }
});

/**
 * POST /api/account/addresses
 */
router.post('/addresses', async (req: AuthRequest, res: Response) => {
  const parsed = createAddressSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data alamat tidak valid.');
  }

  try {
    if (parsed.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false },
      });
    }
    const created = await prisma.address.create({
      data: {
        ...parsed.data,
        userId: req.user!.id,
      },
    });
    return res.status(201).json({ success: true, data: created, message: 'Alamat berhasil ditambahkan.' });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal menyimpan alamat.');
  }
});

/**
 * DELETE /api/account/addresses/:id
 */
router.delete('/addresses/:id', async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    const deleted = await prisma.address.deleteMany({
      where: { id, userId: req.user!.id },
    });
    if (deleted.count === 0) {
      return sendError(res, 404, 'Alamat tidak ditemukan atau sudah dihapus.', 'NOT_FOUND');
    }
    return res.json({ success: true, data: { id }, message: 'Alamat berhasil dihapus.' });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal menghapus alamat.');
  }
});

/**
 * GET /api/account/orders
 */
router.get('/orders', async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, images: true } },
            review: true,
          },
        },
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
        items: o.items.map((it) => ({ ...it, price: Number(it.price) })),
      })),
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat riwayat pesanan.');
  }
});

/**
 * GET /api/account/tickets
 */
router.get('/tickets', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { phone: true },
    });

    const tickets = await prisma.eventRegistration.findMany({
      where: user?.phone
        ? {
            OR: [
              { userId: req.user!.id },
              { userId: null, whatsappNumber: user.phone },
            ],
          }
        : { userId: req.user!.id },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: tickets });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat tiket workshop.');
  }
});

/**
 * POST /api/account/reviews
 * Verified review tied to OrderItem owned by user.
 */
router.post('/reviews', async (req: AuthRequest, res: Response) => {
  const parsed = createReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data ulasan tidak valid.');
  }

  try {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: parsed.data.orderItemId },
      include: { order: true, review: true },
    });

    if (!orderItem || orderItem.order.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: 'Item pesanan tidak ditemukan pada akun Anda.',
        code: 'UNAUTHORIZED',
      });
    }

    if (orderItem.review) {
      return res.status(409).json({
        success: false,
        error: 'Item pesanan ini sudah pernah diulas.',
        code: 'VALIDATION_ERROR',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { name: true },
    });

    const review = await prisma.review.create({
      data: {
        productId: orderItem.productId,
        orderItemId: orderItem.id,
        userId: req.user!.id,
        userName: user?.name || 'Pelanggan BabyShalls',
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        isVerifiedPurchase: true,
      },
    });

    return res.status(201).json({ success: true, data: review, message: 'Ulasan berhasil dikirim.' });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal mengirim ulasan.');
  }
});

const syncCartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .max(100),
});

const syncWishlistSchema = z.object({
  productIds: z.array(z.string().trim().min(1)).max(200),
});

/**
 * GET /api/account/cart
 */
router.get('/cart', async (req: AuthRequest, res: Response) => {
  try {
    const rows = await prisma.cartItem.findMany({
      where: { userId: req.user!.id },
      include: {
        product: {
          include: {
            galleryImages: { orderBy: { sortOrder: 'asc' } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const data = rows.map((row) => {
      const p = row.product;
      const jsonImages = Array.isArray(p.images)
        ? p.images.filter((u): u is string => typeof u === 'string')
        : [];
      const galleryUrls = p.galleryImages.map((img) => img.url);
      const images = jsonImages.length > 0 ? jsonImages : galleryUrls;

      return {
        quantity: row.quantity,
        product: {
          id: p.id,
          slug: p.slug,
          title: p.name,
          authorOrBrand: p.authorOrBrand || undefined,
          price: Number(p.price),
          originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
          weightInGrams: p.weight,
          ageGroup: p.ageGroup === 'ALL_AGES' ? 'Ages 1-3' : p.ageGroup,
          category: p.category,
          stock: p.stock,
          rating: Number(p.rating) || 4.9,
          reviewsCount: p.reviewsCount || 0,
          images,
          description: p.description,
          isNewArrival: p.isNewArrival,
          isBestSeller: p.isBestSeller,
        },
      };
    });

    return res.json({ success: true, data });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat keranjang dari akun.');
  }
});

/**
 * PUT /api/account/cart
 */
router.put('/cart', async (req: AuthRequest, res: Response) => {
  const parsed = syncCartSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Format keranjang tidak valid.');
  }

  try {
    const requestedIds = parsed.data.items.map((i) => i.productId);
    const dbProducts =
      requestedIds.length > 0
        ? await prisma.product.findMany({
            where: {
              OR: [{ id: { in: requestedIds } }, { slug: { in: requestedIds } }],
            },
            select: { id: true, slug: true },
          })
        : [];

    const deduped = new Map<string, number>();
    for (const item of parsed.data.items) {
      const match = dbProducts.find((p) => p.id === item.productId || p.slug === item.productId);
      if (match) {
        deduped.set(match.id, Math.min(99, Math.max(1, item.quantity)));
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { userId: req.user!.id } });
      if (deduped.size > 0) {
        await tx.cartItem.createMany({
          data: Array.from(deduped.entries()).map(([productId, quantity]) => ({
            userId: req.user!.id,
            productId,
            quantity,
          })),
        });
      }
    });

    return res.json({ success: true, data: { count: deduped.size } });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal menyinkronkan keranjang ke akun.');
  }
});

/**
 * GET /api/account/wishlist
 */
router.get('/wishlist', async (req: AuthRequest, res: Response) => {
  try {
    const rows = await prisma.wishlist.findMany({
      where: { userId: req.user!.id },
      select: { productId: true },
    });
    return res.json({
      success: true,
      data: rows.map((r) => r.productId),
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat wishlist dari akun.');
  }
});

/**
 * PUT /api/account/wishlist
 */
router.put('/wishlist', async (req: AuthRequest, res: Response) => {
  const parsed = syncWishlistSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Format wishlist tidak valid.');
  }

  try {
    const requestedIds = parsed.data.productIds;
    const dbProducts =
      requestedIds.length > 0
        ? await prisma.product.findMany({
            where: {
              OR: [{ id: { in: requestedIds } }, { slug: { in: requestedIds } }],
            },
            select: { id: true },
          })
        : [];

    const uniqueIds = Array.from(new Set(dbProducts.map((p) => p.id)));

    await prisma.$transaction(async (tx) => {
      await tx.wishlist.deleteMany({ where: { userId: req.user!.id } });
      if (uniqueIds.length > 0) {
        await tx.wishlist.createMany({
          data: uniqueIds.map((productId) => ({
            userId: req.user!.id,
            productId,
          })),
        });
      }
    });

    return res.json({ success: true, data: { count: uniqueIds.length } });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal menyinkronkan wishlist ke akun.');
  }
});

export default router;

