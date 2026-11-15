import { Router, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { triggerEventBroadcastAsync } from '../lib/broadcast.js';
import { authenticateJWT, requireAdmin, AuthRequest } from '../middleware/auth.middleware.js';
import { handleRouteError, sendValidationError } from '../lib/http-error.js';

const router = Router();
router.use(authenticateJWT, requireAdmin);

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateShortCode(): string {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

const eventSchema = z.object({
  title: z.string().trim().min(3, 'Judul workshop minimal 3 karakter.').max(150),
  category: z.string().trim().min(2).max(80).default('Storytelling & Art'),
  speaker: z.string().trim().max(120).optional().nullable(),
  ageRecommendation: z.string().trim().max(80).optional().nullable(),
  description: z.string().trim().min(5, 'Deskripsi workshop minimal 5 karakter.').max(3000),
  bannerImage: z.string().trim().min(1).default('/images/event-craft.jpg'),
  eventDate: z.string().min(4, 'Tanggal workshop wajib diisi.'),
  timeString: z.string().trim().min(2).default('10:00 - 12:00 WIB'),
  location: z.string().trim().min(2).default('Butik BabyShalls, Jl. Cempaka No. 12, Malang'),
  price: z.number().nonnegative('Harga tiket tidak boleh negatif.').default(0),
  quota: z.number().int().positive('Kuota minimal 1 peserta.').default(20),
  shortCode: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]{3,60}$/, 'Custom URL shortlink hanya boleh huruf, angka, - atau _ (3-60 karakter).')
    .optional()
    .nullable(),
  isActive: z.boolean().optional().default(true),
  broadcastEmail: z.boolean().optional().default(false),
});

const updateEventSchema = eventSchema.partial();

const updateRegistrationSchema = z.object({
  status: z.enum(['REGISTERED', 'CONFIRMED', 'CHECKED_IN']),
  paymentStatus: z.enum(['FREE', 'PENDING', 'PAID']).optional(),
});

const checkInTicketSchema = z.object({
  ticketCode: z.string().trim().min(3, 'Kode tiket wajib diisi.'),
});

/**
 * GET /api/admin/events
 */
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        _count: { select: { registrations: true } },
      },
      orderBy: { eventDate: 'desc' },
    });

    const enriched = await Promise.all(
      events.map(async (ev) => {
        let shortCode = ev.shortCode;
        if (!shortCode) {
          shortCode = generateShortCode();
          try {
            await prisma.event.update({
              where: { id: ev.id },
              data: { shortCode },
            });
          } catch {
            shortCode = `${generateShortCode()}${Date.now().toString().slice(-2)}`;
            await prisma.event.update({
              where: { id: ev.id },
              data: { shortCode },
            });
          }
        }
        return {
          ...ev,
          shortCode,
          price: Number(ev.price),
          registrationsCount: ev._count.registrations,
        };
      })
    );

    return res.json({
      success: true,
      data: enriched,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat daftar workshop.');
  }
});

/**
 * POST /api/admin/events
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data workshop tidak valid.');
  }

  try {
    const slug = `${toSlug(parsed.data.title)}-${Date.now().toString().slice(-4)}`;
    let shortCode = parsed.data.shortCode
      ? parsed.data.shortCode.trim().toLowerCase()
      : toSlug(parsed.data.title).slice(0, 32) || generateShortCode().toLowerCase();

    const existingShort = await prisma.event.findFirst({
      where: { shortCode: { equals: shortCode, mode: 'insensitive' } },
    });
    if (existingShort) {
      if (parsed.data.shortCode) {
        return res.status(409).json({
          success: false,
          error: `Custom shortlink "/w/${shortCode}" sudah digunakan workshop lain.`,
          code: 'VALIDATION_ERROR',
        });
      }
      shortCode = `${shortCode}-${Date.now().toString().slice(-3)}`;
    }

    const created = await prisma.event.create({
      data: {
        title: parsed.data.title,
        slug,
        shortCode,
        category: parsed.data.category,
        speaker: parsed.data.speaker ?? null,
        ageRecommendation: parsed.data.ageRecommendation ?? null,
        description: parsed.data.description,
        bannerImage: parsed.data.bannerImage,
        eventDate: new Date(parsed.data.eventDate),
        timeString: parsed.data.timeString,
        location: parsed.data.location,
        price: parsed.data.price,
        quota: parsed.data.quota,
        isActive: parsed.data.isActive ?? true,
      },
    });

    if (parsed.data.broadcastEmail) {
      triggerEventBroadcastAsync(created);
    }

    return res.status(201).json({
      success: true,
      data: { ...created, price: Number(created.price), registrationsCount: 0 },
      message: `Workshop "${created.title}" berhasil dibuat.`,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal membuat workshop baru.');
  }
});

/**
 * PATCH /api/admin/events/:id
 */
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = updateEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data pembaruan workshop tidak valid.');
  }

  try {
    const { broadcastEmail: _bc, eventDate, shortCode, ...rest } = parsed.data;
    let normalizedShortCode: string | undefined;
    if (shortCode) {
      normalizedShortCode = shortCode.trim().toLowerCase();
      const conflict = await prisma.event.findFirst({
        where: {
          shortCode: { equals: normalizedShortCode, mode: 'insensitive' },
          id: { not: id },
        },
      });
      if (conflict) {
        return res.status(409).json({
          success: false,
          error: `Custom shortlink "/w/${normalizedShortCode}" sudah digunakan workshop lain.`,
          code: 'VALIDATION_ERROR',
        });
      }
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...rest,
        ...(eventDate ? { eventDate: new Date(eventDate) } : {}),
        ...(normalizedShortCode ? { shortCode: normalizedShortCode } : {}),
      },
      include: { _count: { select: { registrations: true } } },
    });

    return res.json({
      success: true,
      data: {
        ...updated,
        price: Number(updated.price),
        registrationsCount: updated._count.registrations,
      },
      message: `Workshop "${updated.title}" berhasil diperbarui.`,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memperbarui workshop.');
  }
});

/**
 * DELETE /api/admin/events/:id
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    await prisma.event.delete({ where: { id } });
    return res.json({ success: true, data: { id }, message: 'Workshop berhasil dihapus.' });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal menghapus workshop.');
  }
});

/**
 * GET /api/admin/events/:id/registrations
 */
router.get('/:id/registrations', async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    const list = await prisma.eventRegistration.findMany({
      where: { eventId: id },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: list });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat daftar peserta.');
  }
});

/**
 * POST /api/admin/events/check-in
 * Scan QR ticketCode (BS-EVT-...) to check in workshop visitor.
 */
router.post('/check-in', async (req: AuthRequest, res: Response) => {
  const parsed = checkInTicketSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Kode tiket tidak valid.');
  }

  const code = parsed.data.ticketCode.trim().toUpperCase();

  try {
    const registration = await prisma.eventRegistration.findFirst({
      where: { ticketCode: { equals: code, mode: 'insensitive' } },
      include: {
        event: {
          select: { id: true, title: true, eventDate: true, timeString: true, location: true },
        },
      },
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: `Tiket dengan kode "${code}" tidak ditemukan.`,
        code: 'NOT_FOUND',
      });
    }

    if (registration.paymentStatus === 'PENDING') {
      return res.status(400).json({
        success: false,
        error: `Tiket ${code} (${registration.childName}) belum menyelesaikan pembayaran.`,
        code: 'PAYMENT_PENDING',
        data: registration,
      });
    }

    if (registration.status === 'CHECKED_IN') {
      return res.json({
        success: true,
        alreadyCheckedIn: true,
        data: registration,
        message: `Peserta ${registration.childName} sudah melakukan check-in sebelumnya.`,
      });
    }

    const updated = await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { status: 'CHECKED_IN' },
      include: {
        event: {
          select: { id: true, title: true, eventDate: true, timeString: true, location: true },
        },
      },
    });

    return res.json({
      success: true,
      alreadyCheckedIn: false,
      data: updated,
      message: `Check-in berhasil! Selamat datang ${updated.childName} (${updated.ticketQuantity} tiket).`,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memproses check-in QR tiket.');
  }
});

/**
 * PATCH /api/admin/events/registrations/:regId
 */
router.patch('/registrations/:regId', async (req: AuthRequest, res: Response) => {
  const regId = Array.isArray(req.params.regId) ? req.params.regId[0] : req.params.regId;
  const parsed = updateRegistrationSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Status peserta tidak valid.');
  }

  try {
    const updated = await prisma.eventRegistration.update({
      where: { id: regId },
      data: parsed.data,
    });
    return res.json({ success: true, data: updated, message: 'Status peserta diperbarui.' });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memperbarui status peserta.');
  }
});

export default router;

