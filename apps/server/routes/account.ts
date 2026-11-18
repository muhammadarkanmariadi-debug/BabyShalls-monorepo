import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { hashPassword, verifyPassword } from '../lib/password';
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

accountRouter.get('/addresses', async (c) => {
  const currentUser = c.get('user');
  const addresses = await prisma.address.findMany({
    where: { userId: currentUser.id },
    orderBy: [{ isDefault: 'desc' }],
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

    const created = await prisma.$transaction(async (tx) => {
      if (parsed.data.isDefault) {
        await tx.address.updateMany({
          where: { userId: currentUser.id },
          data: { isDefault: false },
        });
      }
      return tx.address.create({
        data: { ...parsed.data, userId: currentUser.id },
      });
    });

    return c.json({ success: true, data: created }, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menyimpan alamat.';
    return c.json({ success: false, error: message }, 500);
  }
});

accountRouter.delete('/addresses/:id', async (c) => {
  const currentUser = c.get('user');
  const id = c.req.param('id');
  await prisma.address.deleteMany({ where: { id, userId: currentUser.id } });
  return c.json({ success: true, message: 'Alamat berhasil dihapus.' });
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
    items: o.items.map((it) => ({ ...it, price: Number(it.price) })),
  }));

  return c.json({ success: true, data: formatted });
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
          rating: Number(p.rating) || 4.9,
          reviewsCount: p.reviewsCount || 0,
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
