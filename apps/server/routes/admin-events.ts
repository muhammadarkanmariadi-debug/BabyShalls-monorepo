import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAdmin, requireAuth, type AuthVariables } from '../middleware/auth';

const adminEventsRouter = new Hono<{ Variables: AuthVariables }>();
adminEventsRouter.use('*', requireAuth, requireAdmin);

const eventSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(2).max(200).optional(),
  category: z.string().trim().optional().default('Storytelling & Art'),
  speaker: z.string().trim().optional().nullable(),
  ageRecommendation: z.string().trim().optional().nullable(),
  description: z.string().trim().min(5),
  bannerImage: z.string().trim().min(1),
  eventDate: z.string(),
  timeString: z.string().trim().min(2),
  location: z.string().trim().min(2),
  price: z.coerce.number().min(0).default(0),
  quota: z.coerce.number().int().min(1).default(20),
  isDraft: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

adminEventsRouter.get('/', async (c) => {
  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'desc' },
    include: { _count: { select: { registrations: true } } },
  });
  return c.json({
    success: true,
    data: events.map((ev) => ({ ...ev, price: Number(ev.price) })),
  });
});

adminEventsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: 'Data event tidak valid.' }, 400);
    }

    const slug =
      parsed.data.slug ||
      parsed.data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
        '-' +
        Date.now().toString().slice(-4);

    const shortCode = Array.from(crypto.getRandomValues(new Uint8Array(3)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

    const created = await prisma.event.create({
      data: {
        ...parsed.data,
        slug,
        shortCode,
        eventDate: new Date(parsed.data.eventDate),
      },
    });

    return c.json({ success: true, data: { ...created, price: Number(created.price) } }, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal membuat event.';
    return c.json({ success: false, error: message }, 500);
  }
});

adminEventsRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return c.json({ success: false, error: 'Event tidak ditemukan.' }, 404);
  return c.json({ success: true, data: { ...event, price: Number(event.price) } });
});

adminEventsRouter.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const parsed = eventSchema.partial().safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: 'Data pembaruan event tidak valid.' }, 400);
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...parsed.data,
        eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : undefined,
      },
    });

    return c.json({ success: true, data: { ...updated, price: Number(updated.price) } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui event.';
    return c.json({ success: false, error: message }, 500);
  }
});

adminEventsRouter.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await prisma.event.delete({ where: { id } });
  return c.json({ success: true, message: 'Event berhasil dihapus.' });
});

adminEventsRouter.get('/:id/registrations', async (c) => {
  const id = c.req.param('id');
  const regs = await prisma.eventRegistration.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'desc' },
  });
  return c.json({ success: true, data: regs });
});

adminEventsRouter.post('/check-in', async (c) => {
  try {
    const body = (await c.req.json()) as { ticketCode?: string };
    const ticketCode = String(body.ticketCode || '').trim().toUpperCase();
    if (!ticketCode) return c.json({ success: false, error: 'Kode tiket wajib diisi.' }, 400);

    const reg = await prisma.eventRegistration.findUnique({
      where: { ticketCode },
      include: { event: { select: { title: true } } },
    });

    if (!reg) return c.json({ success: false, error: 'Tiket tidak ditemukan.' }, 404);
    if (reg.status === 'CHECKED_IN') {
      return c.json({ success: false, error: 'Tiket sudah di-check-in sebelumnya.', data: reg }, 409);
    }

    const updated = await prisma.eventRegistration.update({
      where: { id: reg.id },
      data: { status: 'CHECKED_IN' },
      include: { event: { select: { title: true } } },
    });

    return c.json({ success: true, data: updated, message: 'Check-in peserta berhasil!' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal melakukan check-in.';
    return c.json({ success: false, error: message }, 500);
  }
});

adminEventsRouter.patch('/registrations/:regId', async (c) => {
  const regId = c.req.param('regId');
  const body = (await c.req.json()) as { status?: string; paymentStatus?: string };
  const updated = await prisma.eventRegistration.update({
    where: { id: regId },
    data: {
      status: body.status,
      paymentStatus: body.paymentStatus,
    },
  });
  return c.json({ success: true, data: updated });
});

export default adminEventsRouter;

