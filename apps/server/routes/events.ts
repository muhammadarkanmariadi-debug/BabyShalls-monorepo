import { Hono } from 'hono';
import { DiscountType } from '@/server/generated/prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { verifyJwt } from '../lib/jwt';
import { createMidtransSnapTransaction } from '../lib/midtrans';
import { runWithIdempotency } from '../middleware/idempotency';
import { ALL_EVENTS } from '@/src/data/eventsData';

const eventsRouter = new Hono();

const registerEventSchema = z.object({
  eventId: z.string().trim().min(1),
  participantName: z.string().trim().min(2).max(100),
  childName: z.string().trim().max(100).optional().nullable(),
  childAge: z.string().trim().max(50).optional().nullable(),
  whatsappNumber: z.string().trim().min(8).max(20),
  ticketQuantity: z.coerce.number().int().min(1).max(10).default(1),
  couponCode: z.string().trim().max(50).optional().nullable(),
  unitPrice: z.coerce.number().min(0).optional(),
});

function randomHex3Bytes(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(3)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

eventsRouter.get('/', async (c) => {
  try {
    const events = await prisma.event.findMany({
      where: { isActive: true },
      orderBy: { eventDate: 'asc' },
    });

    const enriched = await Promise.all(
      events.map(async (ev) => {
        let shortCode = ev.shortCode;
        if (!shortCode) {
          shortCode = randomHex3Bytes();
          await prisma.event.update({ where: { id: ev.id }, data: { shortCode } }).catch(() => null);
        }
        return { ...ev, shortCode, price: Number(ev.price) };
      })
    );

    return c.json(
      { success: true, data: enriched },
      200,
      { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat daftar event.';
    return c.json({ success: false, error: message }, 500);
  }
});

eventsRouter.get('/short/:code', async (c) => {
  const code = (c.req.param('code') || '').trim();
  try {
    const event = await prisma.event.findFirst({
      where: { shortCode: { equals: code, mode: 'insensitive' } },
    });
    if (!event) {
      return c.json({ success: false, error: 'Shortlink workshop tidak ditemukan.', code: 'NOT_FOUND' }, 404);
    }
    return c.json(
      { success: true, data: { ...event, price: Number(event.price) } },
      200,
      { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat shortlink workshop.';
    return c.json({ success: false, error: message }, 500);
  }
});

eventsRouter.get('/:idOrSlug', async (c) => {
  const idOrSlug = (c.req.param('idOrSlug') || '').trim();
  try {
    let event = await prisma.event.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: { equals: idOrSlug, mode: 'insensitive' } },
        ],
      },
    });

    if (!event) {
      const staticEvent = ALL_EVENTS.find((e) => e.id === idOrSlug || e.id === idOrSlug.toLowerCase());
      if (staticEvent) {
        event = await prisma.event.create({
          data: {
            title: staticEvent.title,
            slug: staticEvent.id,
            category: staticEvent.category || 'Workshop',
            description: staticEvent.description || 'Workshop edukatif anak BabyShalls Malang.',
            eventDate: new Date('2026-12-06T03:00:00.000Z'),
            timeString: staticEvent.time || '10.00 - 12.00 WIB',
            location: staticEvent.location || 'BabyShalls Malang',
            bannerImage: staticEvent.image || '/images/events/event-workshop-alam.png',
            price: staticEvent.price || 0,
            quota: staticEvent.quotaTotal || 20,
            isActive: true,
          },
        });
      }
    }

    if (!event) {
      return c.json(
        { success: false, error: 'Event workshop tidak ditemukan.', code: 'NOT_FOUND' },
        404
      );
    }

    let shortCode = event.shortCode;
    if (!shortCode) {
      shortCode = randomHex3Bytes();
      await prisma.event.update({ where: { id: event.id }, data: { shortCode } }).catch(() => null);
    }

    return c.json(
      { success: true, data: { ...event, shortCode, price: Number(event.price) } },
      200,
      { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat detail workshop.';
    return c.json({ success: false, error: message }, 500);
  }
});

eventsRouter.post('/register', async (c) => {
  const rawBody = await c.req.text();
  return runWithIdempotency(c, rawBody, async () => {
    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return { status: 400, body: { success: false, error: 'Payload JSON tidak valid.' } };
    }

    const parsed = registerEventSchema.safeParse(body);
    if (!parsed.success) {
      return {
        status: 400,
        body: {
          success: false,
          error: parsed.error.issues[0]?.message || 'Data pendaftaran event tidak valid.',
          code: 'VALIDATION_ERROR',
        },
      };
    }

    const authHeader = c.req.header('authorization');
    const authUser =
      authHeader && authHeader.startsWith('Bearer ')
        ? await verifyJwt(authHeader.slice(7).trim())
        : null;

    const { eventId, participantName, childName, childAge, whatsappNumber, ticketQuantity, couponCode } = parsed.data;
    const randomSuffix = (crypto.getRandomValues(new Uint32Array(1))[0] % 900) + 100;
    const ticketCode = `BS-EVT-${Date.now().toString().slice(-6)}-${randomSuffix}`;
    const midtransOrderId = `BS-EVT-PAY-${Date.now()}`;

    let event = await prisma.event.findFirst({
      where: { OR: [{ id: eventId }, { slug: eventId }] },
    });

    if (!event) {
      const staticEvent = ALL_EVENTS.find((e) => e.id === eventId || e.id === eventId.toLowerCase());
      if (staticEvent) {
        event = await prisma.event.create({
          data: {
            title: staticEvent.title,
            slug: staticEvent.id,
            category: staticEvent.category || 'Workshop',
            description: staticEvent.description || 'Workshop edukatif anak BabyShalls Malang.',
            eventDate: new Date('2026-12-06T03:00:00.000Z'),
            timeString: staticEvent.time || '10.00 - 12.00 WIB',
            location: staticEvent.location || 'BabyShalls Malang',
            bannerImage: staticEvent.image || '/images/events/event-workshop-alam.png',
            price: staticEvent.price || 0,
            quota: staticEvent.quotaTotal || 20,
            isActive: true,
          },
        });
      }
    }

    if (!event) {
      return { status: 404, body: { success: false, error: 'Event tidak ditemukan.', code: 'NOT_FOUND' } };
    }

    if (event.quota < ticketQuantity) {
      return {
        status: 400,
        body: { success: false, error: 'Kuota peserta untuk workshop ini sudah penuh.', code: 'QUOTA_FULL' },
      };
    }

    const subtotal = Number(event.price) * ticketQuantity;
    let discountAmount = 0;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (coupon && coupon.isActive && subtotal >= Number(coupon.minOrder)) {
        const val = Number(coupon.discountValue);
        if (coupon.discountType === DiscountType.PERCENTAGE) {
          const raw = Math.round((subtotal * val) / 100);
          discountAmount = coupon.maxDiscount ? Math.min(raw, Number(coupon.maxDiscount)) : raw;
        } else {
          discountAmount = Math.min(val, subtotal);
        }
      }
    }

    const grandTotal = Math.max(0, subtotal - discountAmount);
    const isPaidEvent = grandTotal > 0;

    let snapToken: string | null = null;
    if (isPaidEvent) {
      const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
      const isRealKey = Boolean(serverKey) && !serverKey.includes('xxxx') && !serverKey.includes('sample');
      if (!isRealKey) {
        snapToken = `snap-evt-dev-${ticketCode}`;
      } else {
        try {
          const txSnap = await createMidtransSnapTransaction({
            transaction_details: { order_id: midtransOrderId, gross_amount: Math.round(grandTotal) },
            customer_details: { first_name: participantName, phone: whatsappNumber },
          });
          snapToken = txSnap.token;
        } catch (err) {
          console.warn('⚠️ Midtrans Snap Event gagal:', err);
        }
      }
    }

    const registration = await prisma.$transaction(async (tx) => {
      await tx.event.update({
        where: { id: event.id },
        data: { quota: { decrement: ticketQuantity } },
      });

      return tx.eventRegistration.create({
        data: {
          eventId: event.id,
          userId: authUser?.id ?? null,
          participantName,
          childName: childName ?? '',
          childAge: childAge ?? '',
          whatsappNumber,
          ticketQuantity,
          ticketCode,
          paymentStatus: isPaidEvent ? 'PENDING' : 'FREE',
          status: isPaidEvent ? 'PENDING_PAYMENT' : 'CONFIRMED',
          midtransOrderId: isPaidEvent ? midtransOrderId : null,
        },
      });
    });

    return {
      status: 201,
      body: {
        success: true,
        data: {
          ...registration,
          totalPaid: grandTotal,
          snapToken,
        },
      },
    };
  });
});

export default eventsRouter;

