import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { verifyTurnstileToken } from '@/src/lib/turnstile';
import { runWithIdempotency } from '../middleware/idempotency';

const bookRequestsRouter = new Hono();

const createBookRequestSchema = z.object({
  title: z.string().trim().min(2, 'Judul buku minimal 2 karakter.').max(200),
  authorPublisher: z.string().trim().max(150).optional().nullable(),
  customerName: z.string().trim().min(2, 'Nama lengkap minimal 2 karakter.').max(100).optional().nullable(),
  email: z
    .union([z.string().trim().email('Format email tidak valid.'), z.literal(''), z.null(), z.undefined()])
    .transform((v) => (v ? v : null)),
  whatsappNumber: z.string().trim().min(8, 'Nomor WhatsApp tidak valid.').max(20),
  notes: z.string().trim().max(1000).optional().nullable(),
  referenceImageUrl: z
    .union([z.string().trim().url('URL gambar referensi tidak valid.'), z.literal(''), z.null(), z.undefined()])
    .transform((v) => (v ? v : null)),
  turnstileToken: z.string().optional(),
});

bookRequestsRouter.post('/', async (c) => {
  const rawBody = await c.req.text();
  return runWithIdempotency(c, rawBody, async () => {
    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return { status: 400, body: { success: false, error: 'Payload JSON tidak valid.' } };
    }

    const parsed = createBookRequestSchema.safeParse(body);
    if (!parsed.success) {
      return {
        status: 400,
        body: {
          success: false,
          error: parsed.error.issues[0]?.message || 'Data permintaan buku tidak valid.',
          code: 'VALIDATION_ERROR',
        },
      };
    }

    const remoteIp = c.req.header('cf-connecting-ip') || undefined;
    const turnstile = await verifyTurnstileToken(parsed.data.turnstileToken, remoteIp);
    if (!turnstile.success) {
      return { status: 403, body: { success: false, error: turnstile.error, code: 'TURNSTILE_FAILED' } };
    }

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

    return {
      status: 201,
      body: {
        success: true,
        data: {
          requestId: created.id,
          title: created.title,
          status: created.status,
        },
        message: `Permintaan buku "${created.title}" telah diterima tim kurator BabyShalls Malang.`,
      },
    };
  });
});

export default bookRequestsRouter;

