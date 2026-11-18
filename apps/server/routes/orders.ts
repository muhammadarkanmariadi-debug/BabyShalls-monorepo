import { Hono } from 'hono';
import { DiscountType, OrderStatus, Role } from '@/server/generated/prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { verifyJwt } from '../lib/jwt';
import { createMidtransSnapTransaction, verifyMidtransSignature } from '../lib/midtrans';
import { sendOrderReceiptEmail } from '../lib/mailer';
import { runWithIdempotency } from '../middleware/idempotency';
import { requireAuth, type AuthVariables } from '../middleware/auth';

const ordersRouter = new Hono<{ Variables: AuthVariables }>();

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        quantity: z.coerce.number().int().min(1).max(999),
      })
    )
    .min(1, 'Keranjang belanja tidak boleh kosong.'),
  shippingAddress: z.object({
    recipientName: z.string().trim().min(2).max(100),
    phone: z.string().trim().min(8).max(20),
    email: z.string().trim().email().optional().or(z.literal('')),
    address: z.string().trim().min(5).max(500),
    city: z.string().trim().min(2).max(100),
    postalCode: z.string().trim().max(10).optional().default(''),
  }),
  courierCode: z.string().trim().min(1).max(50),
  courierService: z.string().trim().min(1).max(100),
  shippingCost: z.coerce.number().min(0),
  couponCode: z.string().trim().max(50).optional().nullable(),
});

ordersRouter.post('/', async (c) => {
  const rawBody = await c.req.text();
  return runWithIdempotency(c, rawBody, async () => {
    let jsonBody: unknown;
    try {
      jsonBody = JSON.parse(rawBody);
    } catch {
      return { status: 400, body: { success: false, error: 'Payload JSON tidak valid.' } };
    }

    const parsed = createOrderSchema.safeParse(jsonBody);
    if (!parsed.success) {
      return {
        status: 400,
        body: {
          success: false,
          error: parsed.error.issues[0]?.message || 'Data pesanan tidak valid.',
          code: 'VALIDATION_ERROR',
        },
      };
    }

    const authHeader = c.req.header('authorization');
    const authUser =
      authHeader && authHeader.startsWith('Bearer ')
        ? await verifyJwt(authHeader.slice(7).trim())
        : null;

    const { items, shippingAddress, courierCode, courierService, shippingCost, couponCode } = parsed.data;
    const randomSuffix = (crypto.getRandomValues(new Uint32Array(1))[0] % 900) + 100;
    const orderNumber = `BS-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const dbProducts = await prisma.product.findMany({
      where: {
        OR: [
          { id: { in: items.map((i) => i.productId) } },
          { slug: { in: items.map((i) => i.productId) } },
        ],
      },
    });

    const resolvedItems = items
      .map((item) => {
        const dbProd = dbProducts.find((p) => p.id === item.productId || p.slug === item.productId);
        if (!dbProd) return null;
        return {
          productId: dbProd.id,
          name: dbProd.name,
          price: Number(dbProd.price),
          quantity: item.quantity,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (resolvedItems.length === 0) {
      return {
        status: 400,
        body: {
          success: false,
          error: 'Produk dalam keranjang tidak ditemukan di database.',
          code: 'VALIDATION_ERROR',
        },
      };
    }

    const totalAmount = resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discountAmount = 0;
    let appliedCode: string | null = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (coupon && coupon.isActive && totalAmount >= Number(coupon.minOrder)) {
        const val = Number(coupon.discountValue);
        if (coupon.discountType === DiscountType.PERCENTAGE) {
          const raw = Math.round((totalAmount * val) / 100);
          discountAmount = coupon.maxDiscount ? Math.min(raw, Number(coupon.maxDiscount)) : raw;
        } else if (coupon.discountType === DiscountType.SHIPPING_SUBSIDY) {
          discountAmount = Math.min(val, shippingCost);
        } else {
          discountAmount = Math.min(val, totalAmount);
        }
        appliedCode = coupon.code;
      }
    }

    const resolvedEmail =
      authUser?.email ||
      (shippingAddress.email ? shippingAddress.email.toLowerCase() : '') ||
      `guest-${shippingAddress.phone.replace(/\D/g, '')}@guest.babyshalls.local`;

    let orderUserId = authUser?.id;
    if (!orderUserId) {
      const existingGuest = await prisma.user.findUnique({ where: { email: resolvedEmail } });
      if (existingGuest) {
        orderUserId = existingGuest.id;
      } else {
        const createdGuest = await prisma.user.create({
          data: {
            email: resolvedEmail,
            passwordHash: '',
            name: shippingAddress.recipientName,
            phone: shippingAddress.phone,
            role: Role.USER,
          },
        });
        orderUserId = createdGuest.id;
      }
    }

    const grandTotal = Math.max(0, totalAmount + shippingCost - discountAmount);
    let snapToken: string | null = null;
    let redirectUrl: string | null = null;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const isRealKey = Boolean(serverKey) && !serverKey.includes('xxxx') && !serverKey.includes('sample');

    if (grandTotal > 0) {
      if (!isRealKey) {
        snapToken = `snap-dev-${orderNumber}`;
        redirectUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/dev-${orderNumber}`;
      } else {
        try {
          const txSnap = await createMidtransSnapTransaction({
            transaction_details: { order_id: orderNumber, gross_amount: Math.round(grandTotal) },
            customer_details: {
              first_name: shippingAddress.recipientName,
              email: resolvedEmail.endsWith('@guest.babyshalls.local') ? undefined : resolvedEmail,
              phone: shippingAddress.phone,
            },
            expiry: { unit: 'hours', duration: 24 },
          });
          snapToken = txSnap.token;
          redirectUrl = txSnap.redirect_url;
        } catch (snapErr: unknown) {
          console.warn('⚠️ Midtrans Snap gagal saat buat pesanan:', snapErr);
        }
      }
    }

    const createdOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: orderUserId,
        totalAmount,
        discountAmount,
        couponCode: appliedCode,
        shippingCost,
        grandTotal,
        status: OrderStatus.PENDING_PAYMENT,
        snapToken,
        courierCode,
        courierService,
        shippingAddress,
        items: {
          create: resolvedItems.map((it) => ({
            productId: it.productId,
            price: it.price,
            quantity: it.quantity,
          })),
        },
      },
      include: { items: true },
    });

    const customerEmail = resolvedEmail.endsWith('@guest.babyshalls.local') ? undefined : resolvedEmail;
    if (customerEmail && !snapToken) {
      await sendOrderReceiptEmail({
        to: customerEmail,
        customerName: shippingAddress.recipientName,
        orderNumber: createdOrder.orderNumber,
        statusLabel: 'Menunggu Pembayaran',
        items: resolvedItems.map((it) => ({ name: it.name, quantity: it.quantity, price: it.price })),
        subtotal: totalAmount,
        discountAmount,
        shippingCost,
        totalAmount: grandTotal,
        shippingCourier: courierCode,
        shippingService: courierService,
        shippingAddress: `${shippingAddress.address}, ${shippingAddress.city} ${shippingAddress.postalCode || ''}`.trim(),
      });
    }

    const paymentExpiresAt = new Date(createdOrder.createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString();

    return {
      status: 201,
      body: {
        success: true,
        data: {
          orderId: createdOrder.id,
          orderNumber: createdOrder.orderNumber,
          status: createdOrder.status,
          totalAmount: Number(createdOrder.totalAmount),
          discountAmount: Number(createdOrder.discountAmount),
          shippingCost: Number(createdOrder.shippingCost),
          grandTotal: Number(createdOrder.grandTotal),
          snapToken,
          redirectUrl,
          paymentExpiresAt,
        },
      },
    };
  });
});

ordersRouter.post('/:orderNumber/snap-token', requireAuth, async (c) => {
  try {
    const orderNumber = c.req.param('orderNumber');
    const user = c.get('user');

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { user: { select: { email: true, name: true } } },
    });

    if (!order || (order.userId !== user.id && user.role !== 'ADMIN')) {
      return c.json({ success: false, error: 'Pesanan tidak ditemukan.' }, 404);
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      return c.json({ success: false, error: 'Pesanan sudah dibayar atau dibatalkan.' }, 400);
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const isRealKey = Boolean(serverKey) && !serverKey.includes('xxxx') && !serverKey.includes('sample');

    if (!isRealKey) {
      return c.json({
        success: true,
        data: {
          snapToken: order.snapToken || `snap-dev-${order.orderNumber}`,
          redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/dev-${order.orderNumber}`,
        },
      });
    }

    if (order.snapToken) {
      return c.json({ success: true, data: { snapToken: order.snapToken } });
    }

    const addr = (order.shippingAddress || {}) as Record<string, string>;
    const txSnap = await createMidtransSnapTransaction({
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: Math.round(Number(order.grandTotal)),
      },
      customer_details: {
        first_name: addr.recipientName || order.user.name,
        email: order.user.email.endsWith('@guest.babyshalls.local') ? undefined : order.user.email,
        phone: addr.phone,
      },
      expiry: { unit: 'hours', duration: 24 },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { snapToken: txSnap.token },
    });

    return c.json({
      success: true,
      data: { snapToken: txSnap.token, redirectUrl: txSnap.redirect_url },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal membuat Snap token.';
    return c.json({ success: false, error: message }, 500);
  }
});

ordersRouter.post('/midtrans-webhook', async (c) => {
  try {
    const body = (await c.req.json()) as Record<string, string | undefined>;
    const {
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
      payment_type: paymentType,
    } = body;

    if (!orderId || !transactionStatus) {
      return c.json({ success: false, error: 'Payload webhook Midtrans tidak lengkap.' }, 400);
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const isRealKey = Boolean(serverKey) && !serverKey.includes('xxxx') && !serverKey.includes('sample');

    if (isRealKey) {
      if (!signatureKey || !statusCode || !grossAmount) {
        return c.json({ success: false, error: 'Signature key Midtrans tidak ditemukan.' }, 403);
      }
      const validSig = await verifyMidtransSignature({
        orderId,
        statusCode,
        grossAmount,
        signatureKey,
      });
      if (!validSig) {
        return c.json({ success: false, error: 'Signature key Midtrans tidak valid.' }, 403);
      }
    }

    const isPaid =
      (transactionStatus === 'capture' && (fraudStatus === 'accept' || !fraudStatus)) ||
      transactionStatus === 'settlement';
    const isCancelledOrExpired =
      transactionStatus === 'cancel' ||
      transactionStatus === 'expire' ||
      transactionStatus === 'deny';

    let paidOrderNumberForEmail: string | null = null;

    await prisma.$transaction(async (tx) => {
      if (orderId.startsWith('BS-EVT-PAY-')) {
        const evtReg = await tx.eventRegistration.findFirst({ where: { midtransOrderId: orderId } });
        if (evtReg && isPaid && evtReg.paymentStatus !== 'PAID') {
          await tx.eventRegistration.update({
            where: { id: evtReg.id },
            data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
          });
        }
        return;
      }

      const order = await tx.order.findUnique({
        where: { orderNumber: orderId },
        include: { items: true },
      });
      if (!order) return;

      if (isPaid && order.status !== OrderStatus.PAID && order.status !== OrderStatus.COMPLETED) {
        const updated = await tx.order.updateMany({
          where: { id: order.id, status: OrderStatus.PENDING_PAYMENT },
          data: {
            status: OrderStatus.PAID,
            paymentMethod: paymentType || order.paymentMethod,
            paidAt: order.paidAt ?? new Date(),
          },
        });

        if (updated.count === 1) {
          paidOrderNumberForEmail = order.orderNumber;
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          }
          if (order.couponCode) {
            await tx.coupon.updateMany({
              where: { code: order.couponCode },
              data: { usedCount: { increment: 1 } },
            });
          }
        }
      } else if (isCancelledOrExpired && order.status === OrderStatus.PENDING_PAYMENT) {
        await tx.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.CANCELLED },
        });
      }
    });

    if (paidOrderNumberForEmail) {
      const paidOrder = await prisma.order.findUnique({
        where: { orderNumber: paidOrderNumberForEmail },
        include: {
          user: { select: { email: true, name: true } },
          items: { include: { product: { select: { name: true } } } },
        },
      });
      if (paidOrder?.user?.email && !paidOrder.user.email.endsWith('@guest.babyshalls.local')) {
        const addr = (paidOrder.shippingAddress || {}) as Record<string, string>;
        await sendOrderReceiptEmail({
          to: paidOrder.user.email,
          customerName: addr.recipientName || paidOrder.user.name,
          orderNumber: paidOrder.orderNumber,
          statusLabel: 'Pembayaran Lunas',
          items: paidOrder.items.map((it) => ({
            name: it.product.name,
            quantity: it.quantity,
            price: Number(it.price),
          })),
          subtotal: Number(paidOrder.totalAmount),
          discountAmount: Number(paidOrder.discountAmount),
          shippingCost: Number(paidOrder.shippingCost),
          totalAmount: Number(paidOrder.grandTotal),
          shippingCourier: paidOrder.courierCode,
          shippingService: paidOrder.courierService,
          shippingAddress: [addr.address, addr.city, addr.postalCode].filter(Boolean).join(', '),
        });
      }
    }

    return c.json({ success: true, message: 'OK' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memproses webhook Midtrans.';
    return c.json({ success: false, error: message }, 500);
  }
});

/**
 * Cron helper endpoint: auto-cancel PENDING_PAYMENT orders older than 24 hours.
 */
ordersRouter.post('/cron-cleanup', async (c) => {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (cronSecret && c.req.header('x-cron-secret') !== cronSecret) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const res = await prisma.order.updateMany({
    where: {
      status: OrderStatus.PENDING_PAYMENT,
      createdAt: { lt: cutoff },
    },
    data: { status: OrderStatus.CANCELLED },
  });

  return c.json({ success: true, cancelledCount: res.count });
});

export default ordersRouter;

