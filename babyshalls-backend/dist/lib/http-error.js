import { Prisma } from '@prisma/client';
import { z, ZodError } from 'zod';
/**
 * Shared strict Zod validators for Indonesian e-commerce & family profile inputs.
 */
export const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .email('Format email tidak valid (contoh: bunda@email.com).')
    .max(150, 'Email maksimal 150 karakter.');
export const indonesianPhoneSchema = z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s\-().]/g, ''))
    .refine((val) => /^(\+62|62|0)[2-9]\d{7,12}$/.test(val), 'Nomor telepon/WhatsApp tidak valid. Gunakan format Indonesia (contoh: 081234567890).');
export const optionalIndonesianPhoneSchema = z
    .union([indonesianPhoneSchema, z.literal(''), z.null(), z.undefined()])
    .transform((val) => (val === '' || val === undefined ? null : val));
export const postalCodeSchema = z
    .string()
    .trim()
    .regex(/^\d{5}$/, 'Kode pos harus terdiri dari 5 digit angka (contoh: 65112).');
export const optionalPostalCodeSchema = z
    .union([postalCodeSchema, z.literal(''), z.null(), z.undefined()])
    .transform((val) => (val === '' || val === undefined ? '' : val));
export const childAgeSchema = z
    .string()
    .trim()
    .max(50, 'Usia anak maksimal 50 karakter.')
    .refine((val) => !val || /^(\d{1,2}(\s*(tahun|thn|bulan|bln))?(\s*\d{1,2}\s*(bulan|bln))?)$/i.test(val), 'Format usia anak kurang tepat (contoh: "3 tahun", "18 bulan", atau "4").');
/**
 * Format ZodError into a primary message + per-field dictionary + detail array.
 */
export function formatZodError(err, fallback = 'Data yang dikirim tidak valid.') {
    const fieldErrors = {};
    const details = [];
    for (const issue of err.issues) {
        const field = issue.path.length > 0 ? issue.path.join('.') : 'form';
        if (!fieldErrors[field]) {
            fieldErrors[field] = issue.message;
        }
        details.push({ field, message: issue.message });
    }
    return {
        error: err.issues[0]?.message || fallback,
        fieldErrors,
        details,
    };
}
export function sendError(res, status, error, code = 'BAD_REQUEST', extra) {
    return res.status(status).json({
        success: false,
        error,
        code,
        ...(extra?.fieldErrors ? { fieldErrors: extra.fieldErrors } : {}),
        ...(extra?.details ? { details: extra.details } : {}),
    });
}
export function sendValidationError(res, err, fallback = 'Periksa kembali input Anda.') {
    const formatted = formatZodError(err, fallback);
    return sendError(res, 400, formatted.error, 'VALIDATION_ERROR', {
        fieldErrors: formatted.fieldErrors,
        details: formatted.details,
    });
}
/**
 * Safely map Zod, Prisma, and runtime errors into clean user-facing Indonesian HTTP responses.
 */
export function handleRouteError(res, err, fallback = 'Terjadi kesalahan pada server.') {
    if (err instanceof ZodError) {
        return sendValidationError(res, err);
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'data';
            return sendError(res, 409, `Data duplikat terdeteksi pada kolom ${target}.`, 'CONFLICT');
        }
        if (err.code === 'P2025') {
            return sendError(res, 404, 'Data yang diminta tidak ditemukan.', 'NOT_FOUND');
        }
        if (err.code === 'P2003') {
            return sendError(res, 400, 'Referensi data terkait tidak ditemukan atau tidak valid.', 'BAD_REQUEST');
        }
        if (err.code === 'P2020') {
            return sendError(res, 400, 'Nilai angka melebihi batas maksimal yang diizinkan.', 'VALIDATION_ERROR');
        }
    }
    if (err instanceof Error && err.message.includes('22003')) {
        return sendError(res, 400, 'Nilai angka melebihi batas maksimal kolom database (maksimal < 10.000.000.000).', 'VALIDATION_ERROR');
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
        return sendError(res, 400, 'Format data tidak sesuai dengan struktur database.', 'VALIDATION_ERROR');
    }
    console.error('[API Error]', err);
    const message = err instanceof Error && process.env.NODE_ENV !== 'production' && !err.message.includes('Prisma')
        ? err.message || fallback
        : fallback;
    return sendError(res, 500, message, 'INTERNAL_ERROR');
}
/**
 * Global Express error middleware (handles malformed JSON bodies and uncaught errors).
 */
export function expressErrorHandler(err, _req, res, _next) {
    if (err instanceof SyntaxError && 'body' in err) {
        return sendError(res, 400, 'Format JSON pada request tidak valid.', 'BAD_REQUEST');
    }
    return handleRouteError(res, err, 'Terjadi kesalahan internal pada server.');
}
