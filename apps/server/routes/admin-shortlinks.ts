import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAdmin, requireAuth, type AuthVariables } from '../middleware/auth';

const adminShortlinksRouter = new Hono<{ Variables: AuthVariables }>();
adminShortlinksRouter.use('*', requireAuth, requireAdmin);

const shortlinkSchema = z.object({
  code: z.string().trim().min(2).max(60),
  targetUrl: z.string().trim().min(1),
  title: z.string().trim().max(150).optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

adminShortlinksRouter.get('/', async (c) => {
  const links = await prisma.shortLink.findMany({ orderBy: { createdAt: 'desc' } });
  return c.json({ success: true, data: links });
});

adminShortlinksRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = shortlinkSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: 'Data shortlink tidak valid.' }, 400);
    }

    const existing = await prisma.shortLink.findFirst({
      where: { code: { equals: parsed.data.code, mode: 'insensitive' } },
    });
    if (existing) {
      return c.json({ success: false, error: 'Kode shortlink sudah digunakan.' }, 409);
    }

    const created = await prisma.shortLink.create({ data: parsed.data });
    return c.json({ success: true, data: created }, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal membuat shortlink.';
    return c.json({ success: false, error: message }, 500);
  }
});

adminShortlinksRouter.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const parsed = shortlinkSchema.partial().safeParse(body);
    if (!parsed.success) {
      return c.json({ success: false, error: 'Data pembaruan shortlink tidak valid.' }, 400);
    }

    const updated = await prisma.shortLink.update({ where: { id }, data: parsed.data });
    return c.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui shortlink.';
    return c.json({ success: false, error: message }, 500);
  }
});

adminShortlinksRouter.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await prisma.shortLink.delete({ where: { id } });
  return c.json({ success: true, message: 'Shortlink berhasil dihapus.' });
});

export default adminShortlinksRouter;

