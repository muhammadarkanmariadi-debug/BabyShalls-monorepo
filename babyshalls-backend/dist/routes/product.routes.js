import { Router } from 'express';
import { AgeGroup } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { handleRouteError } from '../lib/http-error.js';
import { getCache, setCache } from '../lib/redis.js';
const router = Router();
const PRODUCTS_CACHE_TTL_SECONDS = 15 * 60; // 15 minutes
function formatProduct(p) {
    const baseImages = Array.isArray(p.images)
        ? p.images.filter((img) => typeof img === 'string' && img.trim().length > 0)
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
/**
 * GET /api/products
 * Public catalog listing with filters (category, ageGroup, search, sort, page, limit) and 15m Redis cache.
 */
router.get('/', async (req, res) => {
    try {
        const category = typeof req.query.category === 'string' ? req.query.category.trim() : undefined;
        const subCategory = typeof req.query.subCategory === 'string' ? req.query.subCategory.trim() : undefined;
        const ageGroup = typeof req.query.ageGroup === 'string' ? req.query.ageGroup.trim() : undefined;
        const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
        const sort = typeof req.query.sort === 'string' ? req.query.sort : 'newest';
        const rawPage = Number(req.query.page);
        const rawLimit = Number(req.query.limit);
        const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
        const limit = Number.isFinite(rawLimit) && rawLimit >= 1 ? Math.min(Math.floor(rawLimit), 100) : 20;
        const cacheKey = `products:list:${category || 'all'}:${subCategory || 'all'}:${ageGroup || 'all'}:${search || ''}:${sort}:${page}:${limit}`;
        const cached = await getCache(cacheKey);
        if (cached) {
            return res.json({ success: true, ...cached });
        }
        const where = {};
        if (category && category !== 'ALL') {
            where.category = { equals: category, mode: 'insensitive' };
        }
        if (subCategory && subCategory !== 'ALL') {
            where.subCategory = { equals: subCategory, mode: 'insensitive' };
        }
        if (ageGroup && Object.values(AgeGroup).includes(ageGroup)) {
            where.ageGroup = ageGroup;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { authorOrBrand: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        let orderBy = { createdAt: 'desc' };
        if (sort === 'price_asc')
            orderBy = { price: 'asc' };
        else if (sort === 'price_desc')
            orderBy = { price: 'desc' };
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    galleryImages: {
                        orderBy: { sortOrder: 'asc' },
                    },
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
        return res.json({
            success: true,
            ...payload,
        });
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal memuat daftar produk.');
    }
});
/**
 * GET /api/products/categories
 * Distinct categories and subcategories from PostgreSQL (15m Redis cache).
 */
router.get('/categories', async (_req, res) => {
    try {
        const cacheKey = 'products:categories:v1';
        const cached = await getCache(cacheKey);
        if (cached) {
            return res.json({ success: true, data: cached });
        }
        const rows = await prisma.product.findMany({
            select: { category: true, subCategory: true },
        });
        const map = new Map();
        for (const row of rows) {
            const cat = row.category.trim();
            if (!cat)
                continue;
            if (!map.has(cat))
                map.set(cat, new Set());
            if (row.subCategory?.trim()) {
                map.get(cat).add(row.subCategory.trim());
            }
        }
        const data = Array.from(map.entries())
            .map(([category, subs]) => ({
            category,
            subCategories: Array.from(subs).sort((a, b) => a.localeCompare(b)),
        }))
            .sort((a, b) => a.category.localeCompare(b.category));
        await setCache(cacheKey, data, PRODUCTS_CACHE_TTL_SECONDS);
        return res.json({ success: true, data });
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal memuat daftar kategori produk.');
    }
});
/**
 * GET /api/products/:slug
 * Public product detail (by slug or id) with verified reviews and 15m Redis cache.
 */
router.get('/:slug', async (req, res) => {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    try {
        const cacheKey = `products:detail:${slug}`;
        const cached = await getCache(cacheKey);
        if (cached) {
            return res.json({ success: true, data: cached });
        }
        const product = await prisma.product.findFirst({
            where: {
                OR: [{ slug }, { id: slug }],
            },
            include: {
                galleryImages: {
                    orderBy: { sortOrder: 'asc' },
                },
                reviews: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Produk tidak ditemukan.',
                code: 'NOT_FOUND',
            });
        }
        const formatted = formatProduct(product);
        await setCache(cacheKey, formatted, PRODUCTS_CACHE_TTL_SECONDS);
        return res.json({
            success: true,
            data: formatted,
        });
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal memuat daftar produk.');
    }
});
export default router;
