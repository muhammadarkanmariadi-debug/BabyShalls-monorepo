import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { DiscountType } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { snap } from '../lib/midtrans.js';
import { authenticateJWT, optionalAuthenticateJWT, AuthRequest } from '../middleware/auth.middleware.js';
import { idempotencyMiddleware } from '../middleware/idempotency.middleware.js';
import {
  childAgeSchema,
  handleRouteError,
  indonesianPhoneSchema,
  sendValidationError,
} from '../lib/http-error.js';

const router = Router();

const registerEventSchema = z.object({
  eventId: z.string().trim().min(1, 'Event wajib dipilih.'),
  participantName: z.string().trim().min(2, 'Nama orang tua minimal 2 karakter.').max(100),
  childName: z.string().trim().min(1, 'Nama anak wajib diisi.').max(100),
  childAge: childAgeSchema.refine((v) => v.length >= 1, 'Usia anak wajib diisi.'),
  whatsappNumber: indonesianPhoneSchema,
  ticketQuantity: z.number().int('Jumlah tiket harus berupa bilangan bulat.').min(1, 'Minimal 1 tiket.').max(10, 'Maksimal 10 tiket per pendaftaran.').optional().default(1),
  couponCode: z.string().trim().max(32).optional().nullable(),
  unitPrice: z.number().nonnegative('Harga tiket tidak boleh negatif.').optional().default(0),
});

/**
 * GET /api/events
 * List all upcoming active events.
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: { isActive: true },
      orderBy: { eventDate: 'asc' },
    });
    const enriched = await Promise.all(
      events.map(async (ev) => {
        let shortCode = ev.shortCode;
        if (!shortCode) {
          shortCode = crypto.randomBytes(3).toString('hex').toUpperCase();
          await prisma.event
            .update({ where: { id: ev.id }, data: { shortCode } })
            .catch(() => null);
        }
        return {
          ...ev,
          shortCode,
          price: Number(ev.price),
        };
      })
    );
    return res.json({
      success: true,
      data: enriched,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat daftar event.');
  }
});

/**
 * GET /api/events/short/:code
 * Resolve workshop shortCode to event slug/details.
 */
router.get('/short/:code', async (req: Request, res: Response) => {
  const code = Array.isArray(req.params.code) ? req.params.code[0] : req.params.code;
  try {
    const event = await prisma.event.findFirst({
      where: {
        shortCode: { equals: code.trim(), mode: 'insensitive' },
      },
    });
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Shortlink workshop tidak ditemukan.',
        code: 'NOT_FOUND',
      });
    }
    return res.json({
      success: true,
      data: { ...event, price: Number(event.price) },
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat shortlink workshop.');
  }
});

/**
 * POST /api/events/register
 * Register participant, generate BS-EVT ticketCode, and decrement event quota atomically.
 */
router.post('/register', optionalAuthenticateJWT, idempotencyMiddleware({ required: false }), async (req: AuthRequest, res: Response) => {
  const parsed = registerEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data pendaftaran event tidak valid.');
  }

  const { eventId, participantName, childName, childAge, whatsappNumber, ticketQuantity, couponCode, unitPrice } =
    parsed.data;
  const ticketCode = `BS-EVT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
  const midtransOrderId = `BS-EVT-PAY-${Date.now()}`;

  try {
    const event = await prisma.event.findFirst({
      where: {
        OR: [{ id: eventId }, { slug: eventId }],
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event atau workshop tidak ditemukan di database.',
        code: 'NOT_FOUND',
      });
    }

    const basePrice = Number(event.price) || unitPrice;
    const subtotal = basePrice * ticketQuantity;
    let discountAmount = 0;

    if (couponCode && subtotal > 0) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });
      if (coupon && coupon.isActive) {
        const val = Number(coupon.discountValue);
        if (coupon.discountType === DiscountType.PERCENTAGE) {
          const raw = Math.round((subtotal * val) / 100);
          discountAmount = coupon.maxDiscount ? Math.min(raw, Number(coupon.maxDiscount)) : raw;
        } else if (coupon.discountType === DiscountType.FIXED_AMOUNT) {
          discountAmount = Math.min(val, subtotal);
        }
      }
    }

    const finalAmount = Math.max(0, subtotal - discountAmount);
    let snapToken: string | null = null;
    let redirectUrl: string | null = null;

    if (finalAmount > 0) {
      const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
      const isPlaceholder = !serverKey || serverKey.includes('xxxx') || serverKey.includes('sample');
      if (isPlaceholder) {
        snapToken = `snap-evt-dev-${midtransOrderId}`;
        redirectUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/dev-${midtransOrderId}`;
      } else {
        try {
          const parameter = {
            transaction_details: { order_id: midtransOrderId, gross_amount: Math.round(finalAmount) },
            customer_details: {
              first_name: participantName,
              email: req.user?.email,
              phone: whatsappNumber,
            },
          } as Parameters<typeof snap.createTransaction>[0];
          const txSnap = await snap.createTransaction(parameter);
          snapToken = txSnap.token;
          redirectUrl = txSnap.redirect_url;
        } catch (snapErr: unknown) {
          console.warn(
            '⚠️ Midtrans Snap gagal saat daftar event (pendaftaran tetap disimpan):',
            snapErr instanceof Error ? snapErr.message : snapErr
          );
        }
      }
    }

    if (event.quota < ticketQuantity) {
      return res.status(400).json({
        success: false,
        error: `Kuota event tersisa ${event.quota} tiket.`,
        code: 'VALIDATION_ERROR',
      });
    }

    const registration = await prisma.$transaction(async (tx) => {
      await tx.event.update({
        where: { id: event.id },
        data: { quota: { decrement: ticketQuantity } },
      });

      return tx.eventRegistration.create({
        data: {
          eventId: event.id,
          userId: req.user?.id ?? null,
          participantName,
          childName,
          childAge,
          whatsappNumber,
          ticketQuantity,
          ticketCode,
          paymentStatus: finalAmount > 0 ? 'PENDING' : 'FREE',
          midtransOrderId: finalAmount > 0 ? midtransOrderId : null,
          status: finalAmount > 0 ? 'REGISTERED' : 'CONFIRMED',
        },
      });
    });

    return res.status(201).json({
      success: true,
      data: {
        registrationId: registration.id,
        ticketCode: registration.ticketCode,
        eventId: event.id,
        participantName: registration.participantName,
        childName: registration.childName,
        childAge: registration.childAge,
        ticketQuantity: registration.ticketQuantity,
        finalAmount,
        paymentStatus: registration.paymentStatus,
        midtransOrderId: registration.midtransOrderId,
        snapToken,
        redirectUrl,
        status: registration.status,
      },
      message: `Pendaftaran adik ${childName} berhasil disimpan.`,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal mendaftarkan peserta event.');
  }
});

/**
 * POST /api/events/registrations/:id/pay
 * Generate a fresh Midtrans Snap token for a user's PENDING workshop ticket.
 */
router.post('/registrations/:id/pay', authenticateJWT, async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    const reg = await prisma.eventRegistration.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!reg || reg.userId !== req.user!.id) {
      return res.status(404).json({
        success: false,
        error: 'Tiket workshop tidak ditemukan pada akun Anda.',
        code: 'NOT_FOUND',
      });
    }

    if (reg.paymentStatus !== 'PENDING') {
      return res.status(400).json({
        success: false,
        error: 'Tiket ini tidak lagi menunggu pembayaran.',
        code: 'VALIDATION_ERROR',
      });
    }

    const finalAmount = Math.max(0, Math.round(Number(reg.event.price) * reg.ticketQuantity));
    const midtransOrderId = `BS-EVT-PAY-${Date.now()}`;
    await prisma.eventRegistration.update({
      where: { id: reg.id },
      data: { midtransOrderId },
    });

    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const isPlaceholder = !serverKey || serverKey.includes('xxxx') || serverKey.includes('sample');
    if (isPlaceholder) {
      return res.json({
        success: true,
        data: {
          registrationId: reg.id,
          finalAmount,
          snapToken: `snap-evt-dev-${midtransOrderId}`,
          redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/dev-${midtransOrderId}`,
        },
      });
    }

    const parameter = {
      transaction_details: { order_id: midtransOrderId, gross_amount: finalAmount },
      customer_details: {
        first_name: reg.participantName,
        email: req.user?.email,
        phone: reg.whatsappNumber,
      },
    } as Parameters<typeof snap.createTransaction>[0];

    const txSnap = await snap.createTransaction(parameter);
    return res.json({
      success: true,
      data: {
        registrationId: reg.id,
        finalAmount,
        snapToken: txSnap.token,
        redirectUrl: txSnap.redirect_url,
      },
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal membuat token pembayaran tiket workshop.');
  }
});

export default router;

