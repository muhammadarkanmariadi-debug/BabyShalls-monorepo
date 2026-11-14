import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { idempotencyMiddleware } from '../middleware/idempotency.middleware.js';
import {
  emailSchema,
  handleRouteError,
  indonesianPhoneSchema,
  sendValidationError,
} from '../lib/http-error.js';

const router = Router();

const createBookRequestSchema = z.object({
  title: z.string().trim().min(2, 'Judul buku minimal 2 karakter.').max(200, 'Judul buku maksimal 200 karakter.'),
  authorPublisher: z.string().trim().max(150, 'Nama penulis/penerbit maksimal 150 karakter.').optional().nullable(),
  customerName: z.string().trim().min(2, 'Nama lengkap minimal 2 karakter.').max(100).optional().nullable(),
  email: z.union([emailSchema, z.literal(''), z.null(), z.undefined()]).transform((v) => (v ? v : null)),
  whatsappNumber: indonesianPhoneSchema,
  notes: z.string().trim().max(1000, 'Catatan maksimal 1000 karakter.').optional().nullable(),
  referenceImageUrl: z
    .union([z.string().trim().url('URL gambar referensi tidak valid.'), z.literal(''), z.null(), z.undefined()])
    .transform((v) => (v ? v : null)),
});

/**
 * POST /api/book-requests
 * Persist custom book / import jastip request to PostgreSQL.
 */
router.post('/', idempotencyMiddleware({ required: false }), async (req: Request, res: Response) => {
  const parsed = createBookRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data permintaan buku tidak valid.');
  }

  try {
    const created = await prisma.bookRequest.create({
      data: {
        title: parsed.data.title,
        authorPublisher: parsed.data.authorPublisher ?? null,
        customerName: parsed.data.customerName ?? null,
        email: parsed.data.email ?? null,
        whatsappNumber: parsed.data.whatsappNumber,
        notes: parsed.data.notes ?? null,
        referenceImageUrl: parsed.data.referenceImageUrl ?? null,
        status: 'PENDING',
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        requestId: created.id,
        title: created.title,
        status: created.status,
      },
      message: `Permintaan buku "${created.title}" telah diterima tim kurator BabyShalls Malang.`,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal menyimpan permintaan buku.');
  }
});

export default router;

