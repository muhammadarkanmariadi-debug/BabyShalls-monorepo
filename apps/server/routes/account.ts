import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { hashPassword, verifyPassword } from '../lib/password';
import { signJwt } from '../lib/jwt';
import { issueEmailChangeOtp, verifyEmailChangeOtp } from '../lib/otp';
import { sendOtpEmail } from '../lib/mailer';
import { requireAuth, type AuthVariables } from '../middleware/auth';

const accountRouter = new Hono<{ Variables: AuthVariables }>();
accountRouter.use('*', requireAuth);

const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().max(20).optional().nullable(),
  parentName: z.string().trim().max(100).optional().nullable(),
  childName: z.string().trim().max(100).optional().nullable(),
  childAge: z.string().trim().max(50).optional().nullable(),
  emailOptIn: z.boolean().optional(),
});

const requestEmailChangeSchema = z.object({
  newEmail: z.string().trim().email('Format email baru tidak valid.'),
  currentPassword: z.string().min(1, 'Password saat ini wajib diisi.'),
});

const verifyEmailChangeSchema = z.object({
  newEmail: z.string().trim().email('Format email tidak valid.'),
  otp: z.string().trim().min(4, 'Kode OTP minimal 4 digit.').max(10),
});

const addressSchema = z.object({
  label: z.string().trim().min(2).max(60).default('Rumah'),
  receiverName: z.string().trim().min(2).max(100),
  receiverPhone: z.string().trim().min(8).max(20),
  streetAddress: z.string().trim().min(5).max(500),
  city: z.string().trim().min(2).max(100),
  subdistrict: z.string().trim().min(2).max(100).default('Malang'),
  postalCode: z.string().trim().min(4).max(10),
  isDefault: z.boolean().optional().default(false),
});

const updateAddressSchema = addressSchema.partial();

accountRouter.get('/profile', async (c) => {
  try {
    const currentUser = c.get('user');
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
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
    if (!user) return c.json({ success: false, error: 'Akun tidak ditemukan.' }, 404);
    return c.json({ success: true, data: user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat profil.';
    return c.json({ success: false, error: message }, 500);
  }
});

accountRouter.patch('/profile', async (c) => {
  try {
    const currentUser = c.get('user');
    const body = await c.req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: 'Data profil tidak valid.' }, 400);
    }

    const updated = await prisma.user.update({
      where: { id: currentUser.id },
      data: parsed.data,
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

    return c.json({ success: true, data: updated, message: 'Profil berhasil diperbarui.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui profil.';
    return c.json({ success: false, error: message }, 500);
  }
});

accountRouter.patch('/password', async (c) => {
  try {
    const currentUser = c.get('user');
    const body = (await c.req.json()) as { currentPassword?: string; newPassword?: string };
    if (!body.currentPassword || !body.newPassword || body.newPassword.length < 6) {
      return c.json({ success: false, error: 'Password saat ini dan password baru (min 6 karakter) wajib diisi.' }, 400);
    }

    const user = await prisma.user.findUnique({ where: { id: currentUser.id } });
    if (!user) return c.json({ success: false, error: 'Akun tidak ditemukan.' }, 404);

    const isMatch = await verifyPassword(body.currentPassword, user.passwordHash);
    if (!isMatch) return c.json({ success: false, error: 'Password saat ini tidak sesuai.' }, 400);

    const newHash = await hashPassword(body.newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });

    return c.json({ success: true, message: 'Password berhasil diperbarui.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui password.';
    return c.json({ success: false, error: message }, 500);
  }
});

accountRouter.post('/email/request-change', async (c) => {
  try {
    const currentUser = c.get('user');
    const body = await c.req.json();
    const parsed = requestEmailChangeSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.issues[0]?.message || 'Data tidak valid.' }, 400);
    }

    const { newEmail, currentPassword } = parsed.data;
    const normalizedNewEmail = newEmail.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { id: currentUser.id } });
    if (!user) return c.json({ success: false, error: 'Akun tidak ditemukan.' }, 404);

    const isMatch = await verifyPassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return c.json({ success: false, error: 'Password saat ini tidak sesuai.' }, 400);
    }

    if (user.email.toLowerCase() === normalizedNewEmail) {
      return c.json({ success: false, error: 'Email baru tidak boleh sama dengan email saat ini.' }, 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedNewEmail } });
    if (existingUser) {
      return c.json({ success: false, error: 'Email baru tersebut sudah terdaftar pada akun lain.' }, 400);
    }

    const { code, expiresInSeconds } = await issueEmailChangeOtp(user.id, normalizedNewEmail);

    await sendOtpEmail({
      to: normalizedNewEmail,
      name: user.name || 'Pelanggan BabyShalls',
      otpCode: code,
      expiresInMinutes: Math.round(expiresInSeconds / 60),
    });

    return c.json({
      success: true,
      data: {
        newEmail: normalizedNewEmail,
        expiresInSeconds,
        previewOtp: process.env.NODE_ENV !== 'production' ? code : undefined,
      },
      message: `Kode OTP verifikasi telah dikirim ke ${normalizedNewEmail}.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memproses permintaan ganti email.';
    return c.json({ success: false, error: message }, 500);
  }
});

accountRouter.post('/email/verify-change', async (c) => {
  try {
    const currentUser = c.get('user');
    const body = await c.req.json();
    const parsed = verifyEmailChangeSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: parsed.error.issues[0]?.message || 'Data tidak valid.' }, 400);
    }

    const { newEmail, otp } = parsed.data;
    const normalizedNewEmail = newEmail.toLowerCase().trim();

    const otpResult = await verifyEmailChangeOtp(currentUser.id, normalizedNewEmail, otp);
    if (!otpResult.valid) {
      return c.json({ success: false, error: otpResult.reason || 'Kode OTP tidak valid atau kedaluwarsa.' }, 400);
    }

    const existing = await prisma.user.findUnique({ where: { email: normalizedNewEmail } });
    if (existing && existing.id !== currentUser.id) {
      return c.json({ success: false, error: 'Email sudah digunakan oleh akun lain.' }, 400);
    }

    const updated = await prisma.user.update({
      where: { id: currentUser.id },
      data: { email: normalizedNewEmail },
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

    const token = await signJwt({
      id: updated.id,
      email: updated.email,
      role: updated.role,
    });

    return c.json({
      success: true,
      data: { token, user: updated },
      message: 'Email akun berhasil diperbarui.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memverifikasi pergantian email.';
    return c.json({ success: false, error: message }, 500);
  }
});

accountRouter.get('/addresses', async (c) => {
  const currentUser = c.get('user');
  const addresses = await prisma.address.findMany({
    where: { userId: currentUser.id },
    orderBy: [{ isDefault: 'desc' }, { id: 'asc' }],
  });
  return c.json({ success: true, data: addresses });
});

accountRouter.post('/addresses', async (c) => {
  try {
    const currentUser = c.get('user');
    const body = await c.req.json();
    const parsed = addressSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: 'Data alamat tidak valid.' }, 400);
    }

    const count = await prisma.address.count({ where: { userId: currentUser.id } });
    const isFirst = count === 0;
    const shouldBeDefault = parsed.data.isDefault || isFirst;

    const created = await prisma.$transaction(async (tx) => {
      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: { userId: currentUser.id },
          data: { isDefault: false },
        });
      }
      return tx.address.create({
        data: {
          ...parsed.data,
          isDefault: shouldBeDefault,
          userId: currentUser.id,
        },
      });
    });

    return c.json({ success: true, data: created }, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menyimpan alamat.';
    return c.json({ success: false, error: message }, 500);
  }
});

accountRouter.patch('/addresses/:id', async (c) => {
  try {
    const currentUser = c.get('user');
    const id = c.req.param('id');
    const body = await c.req.json();
    const parsed = updateAddressSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: 'Data alamat tidak valid.' }, 400);
    }

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ success: false, error: 'Alamat tidak ditemukan.' }, 404);
    }
    if (existing.userId !== currentUser.id) {
      return c.json({ success: false, error: 'Anda tidak memiliki akses ke alamat ini.' }, 403);
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (parsed.data.isDefault) {
        await tx.address.updateMany({
          where: { userId: currentUser.id },
          data: { isDefault: false },
        });
      }
      return tx.address.update({
        where: { id },
        data: parsed.data,
      });
    });

    return c.json({ success: true, data: updated, message: 'Alamat berhasil diperbarui.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui alamat.';
    return c.json({ success: false, error: message }, 500);
  }
});

accountRouter.delete('/addresses/:id', async (c) => {
  try {
    const currentUser = c.get('user');
    const id = c.req.param('id');

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ success: false, error: 'Alamat tidak ditemukan.' }, 404);
    }
    if (existing.userId !== currentUser.id) {
      return c.json({ success: false, error: 'Anda tidak memiliki akses ke alamat ini.' }, 403);
    }

    await prisma.$transaction(async (tx) => {
      await tx.address.delete({ where: { id } });
      if (existing.isDefault) {
        const nextAddr = await tx.address.findFirst({
          where: { userId: currentUser.id },
          orderBy: { id: 'asc' },
        });
        if (nextAddr) {
          await tx.address.update({
            where: { id: nextAddr.id },
            data: { isDefault: true },
          });
        }
      }
    });

    return c.json({ success: true, message: 'Alamat berhasil dihapus.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus alamat.';
    return c.json({ success: false, error: message }, 500);
  }
});

accountRouter.get('/orders', async (c) => {
  const currentUser = c.get('user');
  const orders = await prisma.order.findMany({
    where: { userId: currentUser.id },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, slug: true, images: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const formatted = orders.map((o) => ({
    ...o,
    totalAmount: Number(o.totalAmount),
    discountAmount: Number(o.discountAmount),
    shippingCost: Number(o.shippingCost),
    grandTotal: Number(o.grandTotal),
    items: o.items.map((it) => ({
      ...it,
      price: Number(it.price),
    })),
  }));

  return c.json({ success: true, data: formatted });
});

accountRouter.get('/orders/:orderNumber/tracking', async (c) => {
  try {
    const currentUser = c.get('user');
    const orderNumber = c.req.param('orderNumber');

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });
    if (!order) {
      return c.json({ success: false, error: 'Pesanan tidak ditemukan.' }, 404);
    }
    if (order.userId !== currentUser.id && currentUser.role !== 'ADMIN') {
      return c.json({ success: false, error: 'Anda tidak memiliki akses ke pelacakan pesanan ini.' }, 403);
    }

    const courier = (order.courierCode || 'jne').toLowerCase();

    let trackingRecord = order.waybillNumber
      ? await prisma.waybillTrackingCache.findUnique({
          where: {
            waybill_courier_key: {
              courier,
              waybillNumber: order.waybillNumber,
            },
          },
        })
      : null;

    if (!trackingRecord && order.waybillNumber) {
      const isDelivered = order.status === 'COMPLETED';
      const history = (order.trackingHistory as any[]) || [
        {
          timestamp: order.createdAt.toISOString(),
          status: 'PICKUP_REQUESTED',
          message: 'Paket siap diambil oleh kurir di Toko BabyShalls Malang.',
          location: 'Kota Malang',
        },
      ];
      if (order.status === 'SHIPPED' || order.status === 'COMPLETED') {
        history.push({
          timestamp: new Date().toISOString(),
          status: order.status === 'COMPLETED' ? 'DELIVERED' : 'IN_TRANSIT',
          message:
            order.status === 'COMPLETED'
              ? 'Paket telah berhasil diterima oleh pemesan.'
              : 'Paket sedang dalam perjalanan menuju kota tujuan.',
          location: 'Kota Malang / Gateway',
        });
      }

      trackingRecord = await prisma.waybillTrackingCache.upsert({
        where: {
          waybill_courier_key: {
            courier,
            waybillNumber: order.waybillNumber,
          },
        },
        create: {
          courier,
          waybillNumber: order.waybillNumber,
          status: isDelivered ? 'DELIVERED' : 'IN_TRANSIT',
          isDelivered,
          summaryJson: {
            courier,
            waybillNumber: order.waybillNumber,
            service: order.courierService || 'REG',
          },
          historyJson: history,
          nextCheckAfter: new Date(Date.now() + 3600 * 1000),
        },
        update: {},
      });
    }

    return c.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        courier: order.courierCode || 'Kurir KiriminAja Malang',
        courierService: order.courierService || 'Reguler',
        waybillNumber: order.waybillNumber || null,
        orderStatus: order.status,
        isDelivered: trackingRecord?.isDelivered ?? (order.status === 'COMPLETED'),
        history: trackingRecord ? trackingRecord.historyJson : (order.trackingHistory || []),
        lastCheckedAt: trackingRecord?.lastCheckedAt || new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal melacak resi pengiriman.';
    return c.json({ success: false, error: message }, 500);
  }
});

accountRouter.get('/tickets', async (c) => {
  const currentUser = c.get('user');
  const tickets = await prisma.eventRegistration.findMany({
    where: { userId: currentUser.id },
    include: { event: true },
    orderBy: { createdAt: 'desc' },
  });

  return c.json({
    success: true,
    data: tickets.map((t) => ({
      ...t,
      event: t.event ? { ...t.event, price: Number(t.event.price) } : null,
    })),
  });
});

accountRouter.get('/cart', async (c) => {
  try {
    const currentUser = c.get('user');
    const rows = await prisma.cartItem.findMany({
      where: { userId: currentUser.id },
      include: {
        product: { include: { galleryImages: { orderBy: { sortOrder: 'asc' } } } },
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
          images,
          description: p.description,
          isNewArrival: p.isNewArrival,
          isBestSeller: p.isBestSeller,
        },
      };
    });

    return c.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat keranjang dari akun.';
    return c.json({ success: false, error: message }, 500);
  }
});

accountRouter.put('/cart', async (c) => {
  try {
    const currentUser = c.get('user');
    const body = (await c.req.json()) as { items?: Array<{ productId: string; quantity: number }> };
    const items = Array.isArray(body.items) ? body.items : [];
    const requestedIds = items.map((i) => i.productId);

    const dbProducts =
      requestedIds.length > 0
        ? await prisma.product.findMany({
          where: { OR: [{ id: { in: requestedIds } }, { slug: { in: requestedIds } }] },
          select: { id: true, slug: true },
        })
        : [];

    const deduped = new Map<string, number>();
    for (const item of items) {
      const match = dbProducts.find((p) => p.id === item.productId || p.slug === item.productId);
      if (match) deduped.set(match.id, Math.min(99, Math.max(1, item.quantity)));
    }

    await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { userId: currentUser.id } });
      if (deduped.size > 0) {
        await tx.cartItem.createMany({
          data: Array.from(deduped.entries()).map(([productId, quantity]) => ({
            userId: currentUser.id,
            productId,
            quantity,
          })),
        });
      }
    });

    return c.json({ success: true, data: { count: deduped.size } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menyinkronkan keranjang.';
    return c.json({ success: false, error: message }, 500);
  }
});

accountRouter.get('/wishlist', async (c) => {
  const currentUser = c.get('user');
  const rows = await prisma.wishlist.findMany({
    where: { userId: currentUser.id },
    select: { productId: true },
  });
  return c.json({ success: true, data: rows.map((r) => r.productId) });
});

accountRouter.put('/wishlist', async (c) => {
  try {
    const currentUser = c.get('user');
    const body = (await c.req.json()) as { productIds?: string[] };
    const requestedIds = Array.isArray(body.productIds) ? body.productIds : [];

    const dbProducts =
      requestedIds.length > 0
        ? await prisma.product.findMany({
          where: { OR: [{ id: { in: requestedIds } }, { slug: { in: requestedIds } }] },
          select: { id: true },
        })
        : [];

    const uniqueIds = Array.from(new Set(dbProducts.map((p) => p.id)));

    await prisma.$transaction(async (tx) => {
      await tx.wishlist.deleteMany({ where: { userId: currentUser.id } });
      if (uniqueIds.length > 0) {
        await tx.wishlist.createMany({
          data: uniqueIds.map((productId) => ({ userId: currentUser.id, productId })),
        });
      }
    });

    return c.json({ success: true, data: { count: uniqueIds.length } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menyinkronkan wishlist.';
    return c.json({ success: false, error: message }, 500);
  }
});

export default accountRouter;
