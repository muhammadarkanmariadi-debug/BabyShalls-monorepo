import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { DiscountType, OrderStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { snap } from '../lib/midtrans.js';
import { sendOrderReceiptEmail } from '../lib/mailer.js';
import { authenticateJWT, AuthRequest } from '../middleware/auth.middleware.js';
import { idempotencyMiddleware } from '../middleware/idempotency.middleware.js';
import {
  handleRouteError,
  indonesianPhoneSchema,
  optionalPostalCodeSchema,
  sendValidationError,
} from '../lib/http-error.js';

const router = Router();

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1, 'ID produk wajib diisi.'),
        title: z.string().trim().optional(),
        price: z.number().positive('Harga produk harus lebih dari 0.'),
        quantity: z.number().int('Jumlah harus berupa angka bulat.').min(1, 'Jumlah minimal 1.').max(99, 'Jumlah maksimal 99 per item.'),
      })
    )
    .min(1, 'Keranjang belanja tidak boleh kosong.'),
  shippingAddress: z.object({
    recipientName: z.string().trim().min(2, 'Nama penerima minimal 2 karakter.').max(100, 'Nama penerima maksimal 100 karakter.'),
    phone: indonesianPhoneSchema,
    address: z.string().trim().min(5, 'Alamat lengkap minimal 5 karakter.').max(300, 'Alamat lengkap maksimal 300 karakter.'),
    city: z.string().trim().min(2, 'Kota/Kabupaten wajib diisi.').max(100, 'Kota maksimal 100 karakter.'),
    postalCode: optionalPostalCodeSchema,
  }),
  courierCode: z.string().trim().min(1, 'Kurir pengiriman wajib dipilih.'),
  courierService: z.string().trim().min(1, 'Layanan kurir wajib dipilih.'),
  shippingCost: z.number().nonnegative('Ongkos kirim tidak boleh negatif.'),
  couponCode: z.string().trim().max(32).optional().nullable(),
});

/**
 * POST /api/orders
 * Create real Order + OrderItem in PostgreSQL and generate Midtrans Snap token.
 */
router.post('/', authenticateJWT, idempotencyMiddleware({ required: false }), async (req: AuthRequest, res: Response) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data pesanan tidak valid.');
  }

  const { items, shippingAddress, courierCode, courierService, shippingCost, couponCode } = parsed.data;
  const orderNumber = `BS-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  try {
    // Match products from DB by id or slug; skip items not yet in DB if any, or use server price
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
      return res.status(400).json({
        success: false,
        error: 'Produk dalam keranjang tidak ditemukan di database.',
        code: 'VALIDATION_ERROR',
      });
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
          const parameter = {
            transaction_details: { order_id: orderNumber, gross_amount: Math.round(grandTotal) },
            customer_details: {
              first_name: shippingAddress.recipientName,
              email: req.user?.email,
              phone: shippingAddress.phone,
            },
            expiry: {
              unit: 'hours',
              duration: 24,
            },
          } as Parameters<typeof snap.createTransaction>[0];
          const txSnap = await snap.createTransaction(parameter);
          snapToken = txSnap.token;
          redirectUrl = txSnap.redirect_url;
        } catch (snapErr: unknown) {
          console.warn(
            '⚠️ Midtrans Snap gagal saat buat pesanan (order tetap disimpan sebagai PENDING_PAYMENT):',
            snapErr instanceof Error ? snapErr.message : snapErr
          );
        }
      }
    }

    const createdOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user!.id,
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

    // Hanya kirim email ORDER_CREATED jika tidak menggunakan Snap (misal grandTotal === 0)
    // Jika via Midtrans Snap, email resi dikirim 1x saat webhook PAYMENT_PAID diterima.
    const customerEmail = req.user?.email;
    if (customerEmail && !snapToken) {
      void sendOrderReceiptEmail({
        to: customerEmail,
        customerName: shippingAddress.recipientName,
        orderNumber: createdOrder.orderNumber,
        eventType: 'ORDER_CREATED',
        items: resolvedItems.map((it) => ({
          name: it.name,
          quantity: it.quantity,
          price: it.price,
        })),
        totalAmount,
        discountAmount,
        shippingCost,
        grandTotal,
        courierCode,
        courierService,
        shippingAddressText: `${shippingAddress.address}, ${shippingAddress.city} ${shippingAddress.postalCode || ''}`.trim(),
      }).catch((mailErr) => {
        console.warn('⚠️ Gagal mengirim email konfirmasi pesanan:', mailErr?.message || mailErr);
      });
    }

    const paymentExpiresAt = new Date(createdOrder.createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString();

    return res.status(201).json({
      success: true,
      data: {
        orderId: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        grandTotal: Number(createdOrder.grandTotal),
        snapToken,
        redirectUrl,
        paymentExpiresAt,
      },
      message: `Pesanan ${createdOrder.orderNumber} berhasil dibuat.`,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal membuat pesanan.');
  }
});

const createSnapSchema = z.object({
  orderNumber: z.string().trim().min(3).optional(),
  grossAmount: z.number().positive('Total pembayaran harus lebih dari 0.'),
  customerDetails: z
    .object({
      first_name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  itemDetails: z
    .array(
      z.object({
        id: z.string(),
        price: z.number(),
        quantity: z.number().int().positive(),
        name: z.string(),
      })
    )
    .optional(),
});

/**
 * POST /api/orders/:orderNumber/snap-token
 * Retrieve existing or generate a fresh Midtrans Snap token for an unpaid order.
 */
router.post('/:orderNumber/snap-token', authenticateJWT, async (req: AuthRequest, res: Response) => {
  const orderNumber = Array.isArray(req.params.orderNumber)
    ? req.params.orderNumber[0]
    : req.params.orderNumber;

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { user: { select: { email: true, name: true } } },
    });

    if (!order || order.userId !== req.user!.id) {
      return res.status(404).json({
        success: false,
        error: 'Pesanan tidak ditemukan.',
        code: 'NOT_FOUND',
      });
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      return res.status(400).json({
        success: false,
        error: 'Pesanan ini tidak lagi menunggu pembayaran.',
        code: 'VALIDATION_ERROR',
      });
    }

    const isProd = process.env.MIDTRANS_IS_PRODUCTION === 'true';
    const baseVtweb = isProd
      ? 'https://app.midtrans.com/snap/v2/vtweb'
      : 'https://app.sandbox.midtrans.com/snap/v2/vtweb';

    if (order.snapToken && !order.snapToken.startsWith('snap-dev-')) {
      return res.json({
        success: true,
        data: {
          orderNumber: order.orderNumber,
          snapToken: order.snapToken,
          redirectUrl: `${baseVtweb}/${order.snapToken}`,
        },
      });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const isRealKey = Boolean(serverKey) && !serverKey.includes('xxxx') && !serverKey.includes('sample');
    if (!isRealKey) {
      const devToken = `snap-dev-${order.orderNumber}`;
      return res.json({
        success: true,
        data: {
          orderNumber: order.orderNumber,
          snapToken: devToken,
          redirectUrl: `${baseVtweb}/dev-${order.orderNumber}`,
        },
      });
    }

    const addr = (order.shippingAddress || {}) as Record<string, string>;
    const parameter = {
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: Math.round(Number(order.grandTotal)),
      },
      customer_details: {
        first_name: addr.recipientName || order.user?.name || 'Pelanggan BabyShalls',
        email: order.user?.email,
        phone: addr.phone,
      },
    } as Parameters<typeof snap.createTransaction>[0];

    const txSnap = await snap.createTransaction(parameter);
    await prisma.order.update({
      where: { id: order.id },
      data: { snapToken: txSnap.token },
    });

    return res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        snapToken: txSnap.token,
        redirectUrl: txSnap.redirect_url,
      },
    });
  } catch (error: unknown) {
    return handleRouteError(res, error, 'Gagal menyiapkan pembayaran Midtrans Snap.');
  }
});

/**
 * POST /api/orders/create-snap-token
 * Generate Midtrans Snap payment token.
 */
router.post('/create-snap-token', async (req: Request, res: Response) => {
  const parsed = createSnapSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Payload pembayaran tidak valid.');
  }

  const orderId = parsed.data.orderNumber || `BS-${Date.now()}`;
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  const isPlaceholderKey = !serverKey || serverKey.includes('xxxx') || serverKey.includes('sample');

  if (isPlaceholderKey) {
    return res.json({
      success: true,
      data: {
        orderNumber: orderId,
        token: `snap-dev-${orderId}`,
        redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/dev-${orderId}`,
        isSandboxFallback: true,
      },
    });
  }

  try {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(parsed.data.grossAmount),
      },
      customer_details: parsed.data.customerDetails,
      item_details: parsed.data.itemDetails,
    } as Parameters<typeof snap.createTransaction>[0];

    const snapTransaction = await snap.createTransaction(parameter);

    return res.json({
      success: true,
      data: {
        orderNumber: orderId,
        token: snapTransaction.token,
        redirect_url: snapTransaction.redirect_url,
        isSandboxFallback: false,
      },
    });
  } catch (error: unknown) {
    return handleRouteError(res, error, 'Gagal membuat token Midtrans Snap.');
  }
});

/**
 * POST /api/orders/midtrans-webhook
 * Idempotent Midtrans webhook with signature_key verification (RULE 08).
 */
router.post('/midtrans-webhook', async (req: Request, res: Response) => {
  try {
    const {
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
      payment_type: paymentType,
    } = req.body as Record<string, string | undefined>;

    if (!orderId || !transactionStatus) {
      return res.status(400).json({
        success: false,
        error: 'Payload webhook Midtrans tidak lengkap.',
        code: 'VALIDATION_ERROR',
      });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const isRealKey = Boolean(serverKey) && !serverKey.includes('xxxx') && !serverKey.includes('sample');

    if (isRealKey) {
      if (!signatureKey || !statusCode || !grossAmount) {
        return res.status(403).json({
          success: false,
          error: 'Signature key Midtrans tidak ditemukan.',
          code: 'UNAUTHORIZED',
        });
      }

      const expectedSignature = crypto
        .createHash('sha512')
        .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
        .digest('hex');

      if (signatureKey !== expectedSignature) {
        return res.status(403).json({
          success: false,
          error: 'Signature key Midtrans tidak valid.',
          code: 'UNAUTHORIZED',
        });
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
      // Handle paid Event Registration Midtrans webhook (idempotent)
      if (orderId.startsWith('BS-EVT-PAY-')) {
        const evtReg = await tx.eventRegistration.findFirst({
          where: { midtransOrderId: orderId },
        });
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

      // Idempotency guard with atomic conditional update (prevents duplicate stock/email on concurrent webhooks)
      if (isPaid && order.status !== OrderStatus.PAID && order.status !== OrderStatus.COMPLETED) {
        const updated = await tx.order.updateMany({
          where: {
            id: order.id,
            status: OrderStatus.PENDING_PAYMENT,
          },
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
      void prisma.order
        .findUnique({
          where: { orderNumber: paidOrderNumberForEmail },
          include: {
            user: { select: { email: true, name: true } },
            items: { include: { product: { select: { name: true } } } },
          },
        })
        .then((paidOrder) => {
          if (!paidOrder || !paidOrder.user?.email) return;
          const addr = (paidOrder.shippingAddress || {}) as Record<string, string>;
          return sendOrderReceiptEmail({
            to: paidOrder.user.email,
            customerName: addr.recipientName || paidOrder.user.name,
            orderNumber: paidOrder.orderNumber,
            eventType: 'PAYMENT_PAID',
            items: paidOrder.items.map((it) => ({
              name: it.product.name,
              quantity: it.quantity,
              price: Number(it.price),
            })),
            totalAmount: Number(paidOrder.totalAmount),
            discountAmount: Number(paidOrder.discountAmount),
            shippingCost: Number(paidOrder.shippingCost),
            grandTotal: Number(paidOrder.grandTotal),
            courierCode: paidOrder.courierCode,
            courierService: paidOrder.courierService,
            waybillNumber: paidOrder.waybillNumber,
            shippingAddressText: [addr.address, addr.city, addr.postalCode].filter(Boolean).join(', '),
          });
        })
        .catch((mailErr) => {
          console.warn('⚠️ Gagal mengirim email resi pembayaran:', mailErr?.message || mailErr);
        });
    }

    return res.status(200).json({ success: true, status: 'OK' });
  } catch (error: unknown) {
    return handleRouteError(res, error, 'Gagal memproses webhook Midtrans.');
  }
});

export default router;
