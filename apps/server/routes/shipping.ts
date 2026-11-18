import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { getCache, setCache } from '../lib/redis';

const shippingRouter = new Hono();

const ORIGIN_CITY = 'Malang';
const ORIGIN_SUBDISTRICT_ID = Number(process.env.ORIGIN_SUBDISTRICT_ID) || 1234;
const KIRIMINAJA_BASE_URL = process.env.KIRIMINAJA_BASE_URL || 'https://api.kiriminaja.com';
const KIRIMINAJA_API_KEY = process.env.KIRIMINAJA_API_KEY?.trim() || '';

const calculateSchema = z.object({
  destinationId: z.string().trim().min(1).optional(),
  destinationSubdistrictId: z.coerce.number().int().positive().optional(),
  weightInGrams: z.coerce.number().int().min(1).max(50000),
  courier: z.string().trim().optional().default('ALL'),
});

shippingRouter.get('/regions', async (c) => {
  try {
    const q = (c.req.query('q') || '').trim();
    const regions = await prisma.shippingRegion.findMany({
      where: q
        ? {
            OR: [
              { searchLabel: { contains: q, mode: 'insensitive' } },
              { cityName: { contains: q, mode: 'insensitive' } },
              { districtName: { contains: q, mode: 'insensitive' } },
            ],
          }
        : undefined,
      take: 25,
      orderBy: { searchLabel: 'asc' },
    });

    return c.json(
      { success: true, data: regions },
      200,
      { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat daftar wilayah pengiriman.';
    return c.json({ success: false, error: message }, 500);
  }
});

shippingRouter.post('/calculate', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = calculateSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Data perhitungan ongkir tidak valid.',
          code: 'VALIDATION_ERROR',
        },
        400
      );
    }

    const destId =
      parsed.data.destinationId ||
      (parsed.data.destinationSubdistrictId ? String(parsed.data.destinationSubdistrictId) : '444');
    const weight = parsed.data.weightInGrams;
    const cacheKey = `shipping:rates:v3:${ORIGIN_SUBDISTRICT_ID}:${destId}:${weight}:${parsed.data.courier}`;

    const cached = await getCache<Record<string, unknown>>(cacheKey);
    if (cached) {
      return c.json({ success: true, cached: true, ...cached });
    }

    const ALLOWED_COURIERS: Record<string, string> = {
      lion: 'Lion Parcel',
      wahana: 'Wahana',
      jne: 'JNE',
    };

    let rates: Array<{
      courierCode: string;
      courierName: string;
      service: string;
      cost: number;
      etd: string;
    }>;

    if (!KIRIMINAJA_API_KEY) {
      const baseKg = Math.max(1, Math.ceil(weight / 1000));
      rates = [
        { courierCode: 'lion', courierName: 'Lion Parcel', service: 'REGPACK', cost: 16000 * baseKg, etd: '2-3 Hari' },
        { courierCode: 'wahana', courierName: 'Wahana', service: 'Ekonomis', cost: 13000 * baseKg, etd: '3-4 Hari' },
        { courierCode: 'jne', courierName: 'JNE', service: 'REG', cost: 18000 * baseKg, etd: '2-3 Hari' },
      ];
    } else {
      const res = await fetch(`${KIRIMINAJA_BASE_URL}/api/v3/shipping_rate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KIRIMINAJA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: ORIGIN_SUBDISTRICT_ID,
          destination: Number(destId) || destId,
          weight,
          couriers: ['lion', 'wahana', 'jne'],
        }),
      });
      if (!res.ok) {
        throw new Error(`KiriminAja HTTP ${res.status}`);
      }
      const data = (await res.json()) as {
        data?: Array<{
          courier?: string;
          courierCode?: string;
          courierName?: string;
          service: string;
          cost: number;
          etd: string;
        }>;
      };
      rates = (data?.data || [])
        .map((item) => {
          const rawCode = (item.courierCode || item.courier || '').toLowerCase();
          const matchedKey = Object.keys(ALLOWED_COURIERS).find(
            (k) => rawCode === k || rawCode.includes(k)
          );
          if (!matchedKey) return null;
          return {
            courierCode: matchedKey,
            courierName: item.courierName || ALLOWED_COURIERS[matchedKey],
            service: item.service,
            cost: Number(item.cost),
            etd: item.etd || '2-3 Hari',
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);
    }

    const resultPayload = {
      origin: `${ORIGIN_CITY} (Jl. Cempaka No. 12)`,
      destinationId: destId,
      weightInGrams: weight,
      rates,
    };

    await setCache(cacheKey, resultPayload, 3600);
    return c.json({ success: true, cached: false, ...resultPayload });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghitung ongkos kirim.';
    return c.json({ success: false, error: message }, 500);
  }
});

export default shippingRouter;

