import { Hono } from 'hono';
import { prisma } from '../lib/prisma';

const cmsRouter = new Hono();

cmsRouter.get('/', async (c) => {
  try {
    const rows = await prisma.siteContent.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return c.json(
      { success: true, data: map },
      200,
      { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat konten halaman utama.';
    return c.json({ success: false, error: message }, 500);
  }
});

export default cmsRouter;

