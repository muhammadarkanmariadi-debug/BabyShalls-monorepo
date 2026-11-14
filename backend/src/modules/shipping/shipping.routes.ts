import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { handleRouteError, sendValidationError } from '../../lib/http-error.js';
import { authenticateJWT, requireAdmin, AuthRequest } from '../../middleware/auth.middleware.js';
import { shippingService } from './shipping.service.js';

const router = Router();

const calculateShippingSchema = z.object({
  destinationId: z.string().trim().min(1).optional(),
  destinationSubdistrictId: z.coerce.number().int().positive().optional(),
  weightInGrams: z.coerce
    .number({ message: 'Berat total harus berupa angka (gram).' })
    .int('Berat total harus berupa bilangan bulat (gram).')
    .min(1, 'Berat total minimal 1 gram.')
    .max(50000, 'Berat total maksimal 50 kg.'),
  courier: z.string().trim().optional().default('ALL'),
});

/**
 * GET /api/shipping/regions?q=...
 */
router.get('/regions', async (req: Request, res: Response) => {
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  try {
    const regions = await shippingService.searchRegions(q);
    return res.json({ success: true, data: regions });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat daftar wilayah pengiriman.');
  }
});

/**
 * POST /api/shipping/calculate
 */
router.post('/calculate', async (req: Request, res: Response) => {
  const parsed = calculateShippingSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data perhitungan ongkir tidak valid.');
  }

  try {
    const destId =
      parsed.data.destinationId ||
      (parsed.data.destinationSubdistrictId ? String(parsed.data.destinationSubdistrictId) : '444');

    const result = await shippingService.calculateRates({
      destinationId: destId,
      weightInGrams: parsed.data.weightInGrams,
      courier: parsed.data.courier,
    });

    return res.json({
      success: true,
      ...result,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal menghitung ongkos kirim.');
  }
});

/**
 * GET /api/shipping/track/:courier/:waybillNumber
 */
router.get('/track/:courier/:waybillNumber', async (req: Request, res: Response) => {
  const courier = Array.isArray(req.params.courier) ? req.params.courier[0] : req.params.courier;
  const waybillNumber = Array.isArray(req.params.waybillNumber)
    ? req.params.waybillNumber[0]
    : req.params.waybillNumber;

  try {
    const data = await shippingService.trackWaybill(courier, waybillNumber);
    return res.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal melacak nomor resi.';
    if (message.includes('Format nomor resi') || message.includes('Wahana Express')) {
      return res.status(400).json({ success: false, message });
    }
    return handleRouteError(res, err, 'Gagal melacak nomor resi.');
  }
});

/**
 * GET /api/shipping/track/:waybillNumber (auto-resolve courier from Order)
 */
router.get('/track/:waybillNumber', async (req: Request, res: Response) => {
  const waybillNumber = Array.isArray(req.params.waybillNumber)
    ? req.params.waybillNumber[0]
    : req.params.waybillNumber;

  try {
    const order = await prisma.order.findFirst({
      where: { waybillNumber: waybillNumber.trim().toUpperCase() },
      select: { courierCode: true },
    });
    const data = await shippingService.trackWaybill(order?.courierCode || 'jne', waybillNumber);
    return res.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal melacak nomor resi.';
    if (message.includes('Format nomor resi') || message.includes('Wahana Express')) {
      return res.status(400).json({ success: false, message });
    }
    return handleRouteError(res, err, 'Gagal melacak nomor resi.');
  }
});

/**
 * GET /api/shipping/quota (Admin only)
 */
router.get('/quota', authenticateJWT, requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const stats = await shippingService.getLogisticsQuotaStats();
    return res.json({ success: true, data: stats });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat statistik kuota logistik.');
  }
});

export default router;

