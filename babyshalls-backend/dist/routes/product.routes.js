import { Router } from 'express';
import { AgeGroup } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { handleRouteError } from '../lib/http-error.js';
const router = Router();
/**
 * GET /api/products
 * Public catalog listing with filters (category, ageGroup, search, sort).
 */
router.get('/', async (req, res) => {
    try {
        const category = typeof req.query.category === 'string' ? req.query.category : undefined;
        const ageGroup = typeof req.query.ageGroup === 'string' ? req.query.ageGroup : undefined;
        const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
        const sort = typeof req.query.sort === 'string' ? req.query.sort : 'newest';
        const where = {};
        if (category && category !== 'ALL') {
            where.category = { equals: category, mode: 'insensitive' };
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
        const products = await prisma.product.findMany({ where, orderBy });
        return res.json({
            success: true,
            data: products.map((p) => ({
                ...p,
                price: Number(p.price),
                originalPrice: p.originalPrice !== null ? Number(p.originalPrice) : null,
                rating: Number(p.rating),
            })),
        });
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal memuat daftar produk.');
    }
});
/**
 * GET /api/products/:slug
 * Public product detail with verified reviews.
 */
router.get('/:slug', async (req, res) => {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
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
        return res.json({
            success: true,
            data: {
                ...product,
                price: Number(product.price),
                originalPrice: product.originalPrice !== null ? Number(product.originalPrice) : null,
                rating: Number(product.rating),
            },
        });
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal memuat daftar produk.');
    }
});
export default router;
