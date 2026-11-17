import { Router } from 'express';
import { AgeGroup, ProductCondition } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { delCacheByPattern } from '../lib/redis.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.js';
import { handleRouteError, sendValidationError } from '../lib/http-error.js';
const router = Router();
router.use(authenticateJWT, requireAdmin);
const importRowSchema = z.object({
    name: z.string().trim().min(2),
    sku: z.string().trim().optional().nullable(),
    category: z.string().trim().min(2).default('Board Books'),
    subCategory: z.string().trim().optional().nullable(),
    ageGroup: z.nativeEnum(AgeGroup).optional().default(AgeGroup.ALL_AGES),
    condition: z.nativeEnum(ProductCondition).optional().default(ProductCondition.NEW),
    price: z.number().positive(),
    originalPrice: z.number().positive().optional().nullable(),
    stock: z.number().int().nonnegative().default(10),
    weight: z.number().int().positive().default(300),
    authorOrBrand: z.string().trim().optional().nullable(),
    description: z.string().trim().optional(),
});
const importPayloadSchema = z.object({
    rows: z.array(importRowSchema).min(1).max(500),
});
function toSlug(input) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
function escapeCsv(val) {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}
function sendCsvResponse(res, filename, headers, rows) {
    const lines = [
        headers.join(','),
        ...rows.map((cols) => cols.map(escapeCsv).join(',')),
    ];
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(lines.join('\n'));
}
/**
 * GET /api/admin/import-export/products/export
 */
router.get('/products/export', async (_req, res) => {
    try {
        const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
        return sendCsvResponse(res, 'babyshalls-products.csv', ['name', 'sku', 'category', 'subCategory', 'ageGroup', 'condition', 'price', 'originalPrice', 'stock', 'weight', 'authorOrBrand', 'description'], products.map((p) => [
            p.name,
            p.sku,
            p.category,
            p.subCategory,
            p.ageGroup,
            p.condition,
            Number(p.price),
            p.originalPrice !== null ? Number(p.originalPrice) : '',
            p.stock,
            p.weight,
            p.authorOrBrand,
            p.description,
        ]));
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal mengekspor data produk.');
    }
});
/**
 * GET /api/admin/import-export/orders/export
 */
router.get('/orders/export', async (_req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
        return sendCsvResponse(res, 'babyshalls-orders.csv', ['orderNumber', 'status', 'customerName', 'customerEmail', 'courierCode', 'waybillNumber', 'totalAmount', 'discountAmount', 'shippingCost', 'grandTotal', 'createdAt'], orders.map((o) => {
            const addr = (o.shippingAddress || {});
            return [
                o.orderNumber,
                o.status,
                addr.recipientName || addr.receiverName || o.user?.name || '-',
                o.user?.email || '-',
                o.courierCode || '-',
                o.waybillNumber || '-',
                Number(o.totalAmount),
                Number(o.discountAmount),
                Number(o.shippingCost),
                Number(o.grandTotal),
                o.createdAt.toISOString(),
            ];
        }));
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal mengekspor data pesanan.');
    }
});
/**
 * GET /api/admin/import-export/events/:id/attendees/export
 */
router.get('/events/:id/attendees/export', async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    try {
        const regs = await prisma.eventRegistration.findMany({
            where: { eventId: id },
            orderBy: { createdAt: 'desc' },
        });
        return sendCsvResponse(res, `babyshalls-event-attendees-${id.slice(0, 8)}.csv`, ['ticketCode', 'childName', 'childAge', 'participantName', 'whatsappNumber', 'ticketQuantity', 'paymentStatus', 'status', 'createdAt'], regs.map((r) => [
            r.ticketCode || '-',
            r.childName,
            r.childAge,
            r.participantName,
            r.whatsappNumber,
            r.ticketQuantity,
            r.paymentStatus,
            r.status,
            r.createdAt.toISOString(),
        ]));
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal mengekspor daftar peserta.');
    }
});
/**
 * GET /api/admin/import-export/users/export
 */
router.get('/users/export', async (_req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { _count: { select: { orders: true } } },
            orderBy: { createdAt: 'desc' },
        });
        return sendCsvResponse(res, 'babyshalls-users.csv', ['name', 'email', 'phone', 'role', 'ordersCount', 'createdAt'], users.map((u) => [
            u.name,
            u.email,
            u.phone || '-',
            u.role,
            u._count.orders,
            u.createdAt.toISOString(),
        ]));
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal mengekspor data pengguna.');
    }
});
/**
 * GET /api/admin/import-export/book-requests/export
 */
router.get('/book-requests/export', async (_req, res) => {
    try {
        const requests = await prisma.bookRequest.findMany({ orderBy: { createdAt: 'desc' } });
        return sendCsvResponse(res, 'babyshalls-book-requests.csv', ['title', 'authorPublisher', 'customerName', 'whatsappNumber', 'status', 'adminNotes', 'createdAt'], requests.map((r) => [
            r.title,
            r.authorPublisher || '-',
            r.customerName || '-',
            r.whatsappNumber,
            r.status,
            r.adminNotes || '-',
            r.createdAt.toISOString(),
        ]));
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal mengekspor data book request.');
    }
});
/**
 * POST /api/admin/import-export/products
 */
router.post('/products', async (req, res) => {
    const parsed = importPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
        return sendValidationError(res, parsed.error, 'Format data import produk tidak valid.');
    }
    try {
        let createdCount = 0;
        let updatedCount = 0;
        for (const row of parsed.data.rows) {
            const cleanSku = row.sku?.trim() || null;
            const existing = cleanSku
                ? await prisma.product.findUnique({ where: { sku: cleanSku } })
                : null;
            if (existing) {
                await prisma.product.update({
                    where: { id: existing.id },
                    data: {
                        name: row.name,
                        category: row.category,
                        subCategory: row.subCategory ?? null,
                        ageGroup: row.ageGroup,
                        condition: row.condition,
                        price: row.price,
                        originalPrice: row.originalPrice ?? null,
                        stock: row.stock,
                        weight: row.weight,
                        authorOrBrand: row.authorOrBrand ?? null,
                        description: row.description || existing.description,
                    },
                });
                updatedCount += 1;
            }
            else {
                const slug = `${toSlug(row.name)}-${Date.now().toString().slice(-4)}-${createdCount}`;
                await prisma.product.create({
                    data: {
                        name: row.name,
                        slug,
                        sku: cleanSku,
                        category: row.category,
                        subCategory: row.subCategory ?? null,
                        ageGroup: row.ageGroup,
                        condition: row.condition,
                        price: row.price,
                        originalPrice: row.originalPrice ?? null,
                        stock: row.stock,
                        weight: row.weight,
                        authorOrBrand: row.authorOrBrand ?? null,
                        description: row.description || `${row.name} — kurasi BabyShalls Malang.`,
                        images: ['/images/placeholder-book.jpg'],
                    },
                });
                createdCount += 1;
            }
        }
        await delCacheByPattern('products:*');
        return res.status(201).json({
            success: true,
            data: { createdCount, updatedCount },
            message: `Import selesai: ${createdCount} produk baru, ${updatedCount} produk diperbarui.`,
        });
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal mengimpor produk.');
    }
});
export default router;
