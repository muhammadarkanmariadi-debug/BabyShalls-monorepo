import { Hono } from 'hono';
import { prisma } from '../lib/prisma';

const shortlinksRouter = new Hono();

shortlinksRouter.get('/:code', async (c) => {
  const code = (c.req.param('code') || '').trim();
  if (!code) {
    return c.json({ success: false, error: 'Kode shortlink tidak valid.', code: 'VALIDATION_ERROR' }, 400);
  }

  try {
    const link = await prisma.shortLink.findFirst({
      where: {
        code: { equals: code, mode: 'insensitive' },
        isActive: true,
      },
    });

    if (!link) {
      return c.json(
        { success: false, error: 'Shortlink tidak ditemukan atau sudah tidak aktif.', code: 'NOT_FOUND' },
        404
      );
    }

    await prisma.shortLink.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    });

    return c.json({
      success: true,
      data: {
        code: link.code,
        targetUrl: link.targetUrl,
        title: link.title,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal membuka shortlink.';
    return c.json({ success: false, error: message }, 500);
  }
});

export default shortlinksRouter;

