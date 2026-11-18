import { Hono } from 'hono';
import { AgeGroup, Prisma } from '@/server/generated/prisma/client';
import { prisma } from '../lib/prisma';
import { getCache, setCache } from '../lib/redis';

const productsRouter = new Hono();
const PRODUCTS_CACHE_TTL_SECONDS = 15 * 60;
const EDGE_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
};

function formatProduct(p: {
  price: Prisma.Decimal;
  originalPrice: Prisma.Decimal | null;
  rating: Prisma.Decimal;
  images: Prisma.JsonValue;
  galleryImages?: Array<{ id: string; url: string; caption: string | null; sortOrder: number }>;
  [key: string]: unknown;
}) {
  const baseImages = Array.isArray(p.images)
    ? p.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    : [];
  const galleryUrls = Array.isArray(p.galleryImages)
    ? p.galleryImages.map((g) => g.url).filter((url) => typeof url === 'string' && url.trim().length > 0)
    : [];
  const mergedImages = Array.from(new Set([...baseImages, ...galleryUrls]));

  return {
    ...p,
    images: mergedImages,
    price: Number(p.price),
    originalPrice: p.originalPrice !== null ? Number(p.originalPrice) : null,
    rating: Number(p.rating),
  };
}

productsRouter.get('/', async (c) => {
  try {
    const category = c.req.query('category')?.trim();
    const subCategory = c.req.query('subCategory')?.trim();
    const ageGroup = c.req.query('ageGroup')?.trim();
    const search = c.req.query('search')?.trim();
    const sort = c.req.query('sort') || 'newest';
    const rawPage = Number(c.req.query('page'));
    const rawLimit = Number(c.req.query('limit'));
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
    const limit = Number.isFinite(rawLimit) && rawLimit >= 1 ? Math.min(Math.floor(rawLimit), 100) : 20;

    const cacheKey = `products:list:${category || 'all'}:${subCategory || 'all'}:${ageGroup || 'all'}:${search || ''}:${sort}:${page}:${limit}`;
    const cached = await getCache<{
      data: ReturnType<typeof formatProduct>[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }>(cacheKey);

    if (cached) {
      return c.json({ success: true, ...cached }, 200, EDGE_CACHE_HEADERS);
    }

    const where: Prisma.ProductWhereInput = {};
    if (category && category !== 'ALL') {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (subCategory && subCategory !== 'ALL') {
      where.subCategory = { equals: subCategory, mode: 'insensitive' };
    }
    if (ageGroup && Object.values(AgeGroup).includes(ageGroup as AgeGroup)) {
      where.ageGroup = ageGroup as AgeGroup;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { authorOrBrand: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          galleryImages: { orderBy: { sortOrder: 'asc' } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const payload = {
      data: products.map(formatProduct),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };

    await setCache(cacheKey, payload, PRODUCTS_CACHE_TTL_SECONDS);
    return c.json({ success: true, ...payload }, 200, EDGE_CACHE_HEADERS);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat daftar produk.';
    return c.json({ success: false, error: message }, 500);
  }
});

productsRouter.get('/categories', async (c) => {
  try {
    const cacheKey = 'products:categories:v1';
    const cached = await getCache<Array<{ category: string; subCategories: string[] }>>(cacheKey);
    if (cached) {
      return c.json({ success: true, data: cached }, 200, EDGE_CACHE_HEADERS);
    }

    const rows = await prisma.product.findMany({
      select: { category: true, subCategory: true },
    });

    const map = new Map<string, Set<string>>();
    for (const row of rows) {
      const cat = row.category.trim();
      if (!cat) continue;
      if (!map.has(cat)) map.set(cat, new Set());
      if (row.subCategory?.trim()) {
        map.get(cat)!.add(row.subCategory.trim());
      }
    }

    const data = Array.from(map.entries())
      .map(([category, subs]) => ({
        category,
        subCategories: Array.from(subs).sort((a, b) => a.localeCompare(b)),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));

    await setCache(cacheKey, data, PRODUCTS_CACHE_TTL_SECONDS);
    return c.json({ success: true, data }, 200, EDGE_CACHE_HEADERS);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat daftar kategori produk.';
    return c.json({ success: false, error: message }, 500);
  }
});

productsRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug');

  try {
    const cacheKey = `products:detail:${slug}`;
    const cached = await getCache<ReturnType<typeof formatProduct>>(cacheKey);
    if (cached) {
      return c.json({ success: true, data: cached }, 200, EDGE_CACHE_HEADERS);
    }

    const product = await prisma.product.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: {
        galleryImages: { orderBy: { sortOrder: 'asc' } },
        reviews: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!product) {
      return c.json({ success: false, error: 'Produk tidak ditemukan.', code: 'NOT_FOUND' }, 404);
    }

    const formatted = formatProduct(product);
    await setCache(cacheKey, formatted, PRODUCTS_CACHE_TTL_SECONDS);

    return c.json({ success: true, data: formatted }, 200, EDGE_CACHE_HEADERS);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat detail produk.';
    return c.json({ success: false, error: message }, 500);
  }
});

export default productsRouter;

