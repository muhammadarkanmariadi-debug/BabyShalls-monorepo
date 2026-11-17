import { Router } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.js';
import { handleRouteError, sendValidationError } from '../lib/http-error.js';
const targetUrlSchema = z
    .string()
    .trim()
    .min(1, 'URL tujuan wajib diisi.')
    .max(2048, 'URL tujuan terlalu panjang.')
    .refine((val) => {
    if (val.startsWith('/'))
        return true;
    try {
        const parsed = new URL(val);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    }
    catch {
        return false;
    }
}, 'URL tujuan harus diawali http://, https://, atau path internal (/).');
const customCodeSchema = z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]{2,60}$/, 'Kode shortlink hanya boleh huruf, angka, tanda hubung (-), atau garis bawah (_) (2-60 karakter).');
const createShortLinkSchema = z.object({
    targetUrl: targetUrlSchema,
    code: customCodeSchema.optional().nullable(),
    title: z.string().trim().max(150, 'Judul maksimal 150 karakter.').optional().nullable(),
    isActive: z.boolean().optional().default(true),
});
const updateShortLinkSchema = z.object({
    targetUrl: targetUrlSchema.optional(),
    code: customCodeSchema.optional(),
    title: z.string().trim().max(150).optional().nullable(),
    isActive: z.boolean().optional(),
});
function generateRandomCode() {
    return crypto.randomBytes(3).toString('hex').toLowerCase();
}
export const publicShortlinkRouter = Router();
/**
 * GET /api/shortlinks/:code
 * Resolve shortlink by code, increment click counter, and return targetUrl.
 */
publicShortlinkRouter.get('/:code', async (req, res) => {
    const rawCode = Array.isArray(req.params.code) ? req.params.code[0] : req.params.code;
    const code = (rawCode || '').trim();
    if (!code) {
        return res.status(400).json({ success: false, error: 'Kode shortlink tidak valid.', code: 'VALIDATION_ERROR' });
    }
    try {
        const link = await prisma.shortLink.findFirst({
            where: {
                code: { equals: code, mode: 'insensitive' },
                isActive: true,
            },
        });
        if (!link) {
            return res.status(404).json({
                success: false,
                error: 'Shortlink tidak ditemukan atau sudah tidak aktif.',
                code: 'NOT_FOUND',
            });
        }
        await prisma.shortLink.update({
            where: { id: link.id },
            data: { clicks: { increment: 1 } },
        });
        return res.json({
            success: true,
            data: {
                code: link.code,
                targetUrl: link.targetUrl,
                title: link.title,
            },
        });
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal membuka shortlink.');
    }
});
export const adminShortlinkRouter = Router();
adminShortlinkRouter.use(authenticateJWT, requireAdmin);
/**
 * GET /api/admin/shortlinks
 */
adminShortlinkRouter.get('/', async (_req, res) => {
    try {
        const list = await prisma.shortLink.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return res.json({ success: true, data: list });
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal memuat daftar shortlink.');
    }
});
/**
 * POST /api/admin/shortlinks
 */
adminShortlinkRouter.post('/', async (req, res) => {
    const parsed = createShortLinkSchema.safeParse(req.body);
    if (!parsed.success) {
        return sendValidationError(res, parsed.error, 'Data shortlink tidak valid.');
    }
    try {
        let code = parsed.data.code ? parsed.data.code.trim().toLowerCase() : generateRandomCode();
        const existing = await prisma.shortLink.findFirst({
            where: { code: { equals: code, mode: 'insensitive' } },
        });
        if (existing) {
            if (parsed.data.code) {
                return res.status(409).json({
                    success: false,
                    error: `Kode shortlink "/s/${code}" sudah digunakan.`,
                    code: 'VALIDATION_ERROR',
                });
            }
            code = `${code}${Date.now().toString().slice(-3)}`;
        }
        const created = await prisma.shortLink.create({
            data: {
                code,
                targetUrl: parsed.data.targetUrl,
                title: parsed.data.title ?? null,
                isActive: parsed.data.isActive ?? true,
            },
        });
        return res.status(201).json({
            success: true,
            data: created,
            message: `Shortlink /s/${created.code} berhasil dibuat.`,
        });
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal membuat shortlink.');
    }
});
/**
 * PATCH /api/admin/shortlinks/:id
 */
adminShortlinkRouter.patch('/:id', async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const parsed = updateShortLinkSchema.safeParse(req.body);
    if (!parsed.success) {
        return sendValidationError(res, parsed.error, 'Data pembaruan shortlink tidak valid.');
    }
    try {
        let normalizedCode;
        if (parsed.data.code) {
            normalizedCode = parsed.data.code.trim().toLowerCase();
            const conflict = await prisma.shortLink.findFirst({
                where: {
                    code: { equals: normalizedCode, mode: 'insensitive' },
                    id: { not: id },
                },
            });
            if (conflict) {
                return res.status(409).json({
                    success: false,
                    error: `Kode shortlink "/s/${normalizedCode}" sudah digunakan.`,
                    code: 'VALIDATION_ERROR',
                });
            }
        }
        const updated = await prisma.shortLink.update({
            where: { id },
            data: {
                ...(parsed.data.targetUrl !== undefined ? { targetUrl: parsed.data.targetUrl } : {}),
                ...(normalizedCode !== undefined ? { code: normalizedCode } : {}),
                ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
                ...(parsed.data.isActive !== undefined ? { isActive: parsed.data.isActive } : {}),
            },
        });
        return res.json({
            success: true,
            data: updated,
            message: `Shortlink /s/${updated.code} berhasil diperbarui.`,
        });
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal memperbarui shortlink.');
    }
});
/**
 * DELETE /api/admin/shortlinks/:id
 */
adminShortlinkRouter.delete('/:id', async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    try {
        await prisma.shortLink.delete({ where: { id } });
        return res.json({ success: true, data: { id }, message: 'Shortlink berhasil dihapus.' });
    }
    catch (err) {
        return handleRouteError(res, err, 'Gagal menghapus shortlink.');
    }
});
