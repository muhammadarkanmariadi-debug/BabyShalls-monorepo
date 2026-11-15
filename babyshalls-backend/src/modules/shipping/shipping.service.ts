import { LogisticsProvider, OrderStatus, WaybillDeliveryStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { getCache, setCache } from '../../lib/redis.js';
import { sendOrderReceiptEmail } from '../../lib/mailer.js';
import { RajaOngkirV2Provider } from './providers/rajaongkir-v2.provider.js';
import { BinderByteProvider } from './providers/binderbyte.provider.js';
import { DEFAULT_MALANG_ORIGIN_ID, ensureDefaultShippingRegions } from './shipping.seed.js';
import {
  COURIER_DISPLAY_NAMES,
  normalizeCourierCode,
  ProviderRateLimitError,
  RateQueryInput,
  StandardizedRate,
  StandardizedTrackingResult,
  SUPPORTED_COURIERS,
  SupportedCourier,
  validateWaybillFormat,
} from './shipping.types.js';

const RATE_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 Hari (tarif kurir stabil)
const RATE_REDIS_TTL_SECONDS = 24 * 60 * 60; // 24 Jam di Redis untuk tarif provider asli
const STALE_REDIS_TTL_SECONDS = 30 * 60; // 30 Menit di Redis untuk cache DB kadaluarsa
const ESTIMATED_REDIS_TTL_SECONDS = 15 * 60; // 15 Menit di Redis untuk estimasi lokal (agar cepat pulih saat kuota reset)
const TRACKING_COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 Jam
const RO_DAILY_LIMIT = Number(process.env.RAJAONGKIR_DAILY_LIMIT_PER_KEY || 95);
const BINDERBYTE_QUOTA_TOTAL = Number(process.env.BINDERBYTE_QUOTA_TOTAL || 3333);

function getTodayWibDateKey(): string {
  const now = new Date();
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return wib.toISOString().slice(0, 10);
}

function getRajaOngkirKeyPool(): Array<{ alias: string; key: string }> {
  const rawPool = process.env.RAJAONGKIR_V2_API_KEYS || process.env.RAJAONGKIR_V2_API_KEY || '';
  return rawPool
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
    .map((key, idx) => ({ alias: `RO_KEY_${idx + 1}`, key }));
}

function getBinderByteKeyPool(): Array<{ alias: string; key: string }> {
  const rawPool = process.env.BINDERBYTE_API_KEYS || process.env.BINDERBYTE_API_KEY || '';
  return rawPool
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
    .map((key, idx) => ({ alias: idx === 0 ? 'BB_MAIN' : `BB_KEY_${idx + 1}`, key }));
}

function getAdaptiveTrackingCooldownMs(status: string, now: Date): number {
  const wibHour = new Date(now.getTime() + 7 * 60 * 60 * 1000).getUTCHours();
  if (status === 'OUT_FOR_DELIVERY') {
    return 90 * 60 * 1000; // 1.5 jam saat kurir sedang mengantar
  }
  if (wibHour >= 22 || wibHour < 6) {
    return 5 * 60 * 60 * 1000; // 5 jam pada malam/dini hari WIB
  }
  if (status === 'MANIFESTED') {
    return 4 * 60 * 60 * 1000; // 4 jam saat baru manifest
  }
  return TRACKING_COOLDOWN_MS; // 2 jam default
}

interface FallbackZone {
  multiplier: number;
  etdNear: string;
  etdRegular: string;
}

function resolveFallbackZone(destinationLabel: string, provinceName?: string | null): FallbackZone {
  const haystack = `${destinationLabel} ${provinceName || ''}`.toLowerCase();

  if (/malang|batu/.test(haystack)) {
    return { multiplier: 1.0, etdNear: '1-2 Hari', etdRegular: '1-2 Hari' };
  }
  if (/jawa timur|surabaya|sidoarjo|gresik|mojokerto|pasuruan|probolinggo|kediri|blitar|tulungagung|jember|banyuwangi|madiun|nganjuk|jombang|lamongan|tuban|bojonegoro|lumajang|bondowoso|situbondo|bangkalan|sampang|pamekasan|sumenep/.test(haystack)) {
    return { multiplier: 1.25, etdNear: '1-2 Hari', etdRegular: '2-3 Hari' };
  }
  if (/jawa tengah|yogyakarta|jogja|sleman|bantul|surakarta|solo|semarang|magelang|purwokerto|tegal|pekalongan|klaten|salatiga|kudus/.test(haystack)) {
    return { multiplier: 1.7, etdNear: '2-3 Hari', etdRegular: '2-4 Hari' };
  }
  if (/jakarta|bogor|depok|tangerang|bekasi|jawa barat|banten|bandung|cirebon|tasikmalaya|garut|sukabumi|karawang|serang|cilegon/.test(haystack)) {
    return { multiplier: 2.0, etdNear: '2-3 Hari', etdRegular: '3-4 Hari' };
  }
  if (/bali|denpasar|badung|gianyar|nusa tenggara|lombok|mataram|kupang/.test(haystack)) {
    return { multiplier: 2.3, etdNear: '2-4 Hari', etdRegular: '3-5 Hari' };
  }
  if (/papua|jayapura|sorong|merauke|timika|manokwari|maluku|ambon|ternate/.test(haystack)) {
    return { multiplier: 4.5, etdNear: '5-7 Hari', etdRegular: '6-9 Hari' };
  }
  if (/sumatera|aceh|medan|padang|pekanbaru|batam|riau|jambi|palembang|bengkulu|lampung|bangka|kalimantan|pontianak|banjarmasin|balikpapan|samarinda|palangkaraya|tarakan|sulawesi|makassar|manado|palu|kendari|gorontalo/.test(haystack)) {
    return { multiplier: 3.1, etdNear: '3-5 Hari', etdRegular: '4-6 Hari' };
  }
  return { multiplier: 2.2, etdNear: '2-4 Hari', etdRegular: '3-5 Hari' };
}

function roundTo500(value: number): number {
  return Math.max(5000, Math.round(value / 500) * 500);
}

function buildFallbackEstimatedRates(
  weightGram: number,
  destinationLabel: string,
  provinceName?: string | null
): StandardizedRate[] {
  const kg = Math.max(1, Math.ceil(weightGram / 1000));
  const zone = resolveFallbackZone(destinationLabel, provinceName);

  return [
    {
      courierCode: 'wahana',
      courierName: 'Wahana Express',
      service: 'Normal',
      description: 'Estimasi Reguler Ekonomis (Wahana)',
      cost: roundTo500(7000 * kg * zone.multiplier),
      etd: zone.etdRegular,
    },
    {
      courierCode: 'jnt',
      courierName: 'J&T Express',
      service: 'EZ',
      description: 'Estimasi Layanan Reguler',
      cost: roundTo500(11000 * kg * zone.multiplier),
      etd: zone.etdNear,
    },
    {
      courierCode: 'jne',
      courierName: 'JNE',
      service: 'REG',
      description: 'Estimasi Layanan Reguler',
      cost: roundTo500(12000 * kg * zone.multiplier),
      etd: zone.etdNear,
    },
    {
      courierCode: 'sicepat',
      courierName: 'SiCepat',
      service: 'REG',
      description: 'Estimasi Layanan Reguler',
      cost: roundTo500(11500 * kg * zone.multiplier),
      etd: zone.etdNear,
    },
    {
      courierCode: 'pos',
      courierName: 'POS Indonesia',
      service: 'Pos Reguler',
      description: 'Estimasi Paket Kilat Khusus',
      cost: roundTo500(10000 * kg * zone.multiplier),
      etd: zone.etdRegular,
    },
    {
      courierCode: 'anteraja',
      courierName: 'AnterAja',
      service: 'Reguler',
      description: 'Estimasi Layanan Reguler',
      cost: roundTo500(11500 * kg * zone.multiplier),
      etd: zone.etdRegular,
    },
  ];
}

interface BaseRateLookupResult {
  origin: string;
  destinationId: string;
  providerUsed: 'RAJAONGKIR_V2' | 'BINDERBYTE' | 'ESTIMATED_LOCAL';
  isFromCache: boolean;
  baseRates: StandardizedRate[];
}

export class ShippingService {
  private readonly rajaOngkir = new RajaOngkirV2Provider();
  private readonly binderByte = new BinderByteProvider();
  private readonly inFlightRateLookups = new Map<string, Promise<BaseRateLookupResult>>();
  private readonly inFlightWaybillLookups = new Map<string, Promise<StandardizedTrackingResult>>();

  async searchRegions(query: string) {
    await ensureDefaultShippingRegions();
    const q = query.trim();

    return prisma.shippingRegion.findMany({
      where: q
        ? {
            OR: [
              { searchLabel: { contains: q, mode: 'insensitive' } },
              { districtName: { contains: q, mode: 'insensitive' } },
              { cityName: { contains: q, mode: 'insensitive' } },
              { postalCode: { contains: q, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: [{ isOrigin: 'desc' }, { cityName: 'asc' }, { districtName: 'asc' }],
      take: 25,
      select: {
        id: true,
        rajaongkirId: true,
        binderbyteCode: true,
        provinceName: true,
        cityName: true,
        districtName: true,
        postalCode: true,
        searchLabel: true,
      },
    });
  }

  private async incrementUsage(
    provider: LogisticsProvider,
    dateKey: string,
    keyAlias: string,
    options?: { markExhausted?: boolean; lastError?: string }
  ) {
    await prisma.logisticsApiUsageLog.upsert({
      where: {
        usage_date_provider_key: { dateKey, provider, keyAlias },
      },
      create: {
        dateKey,
        provider,
        keyAlias,
        hitCount: options?.markExhausted ? 0 : 1,
        isExhausted: Boolean(options?.markExhausted),
        lastError: options?.lastError || null,
      },
      update: {
        ...(options?.markExhausted ? {} : { hitCount: { increment: 1 } }),
        ...(options?.markExhausted !== undefined ? { isExhausted: options.markExhausted } : {}),
        ...(options?.lastError !== undefined ? { lastError: options.lastError } : {}),
      },
    });
  }

  async calculateRates(params: {
    destinationId: string;
    weightInGrams: number;
    courier?: string;
  }): Promise<{
    origin: string;
    destinationId: string;
    weightInGrams: number;
    providerUsed: 'RAJAONGKIR_V2' | 'BINDERBYTE' | 'ESTIMATED_LOCAL';
    isFromCache: boolean;
    rates: StandardizedRate[];
  }> {
    await ensureDefaultShippingRegions();

    const originRegion = await prisma.shippingRegion.findFirst({ where: { isOrigin: true } });
    const originId = originRegion?.rajaongkirId || DEFAULT_MALANG_ORIGIN_ID;
    const originLabel = originRegion?.searchLabel || 'Kota Malang (Jl. Cempaka No. 12)';

    const destRegion = await prisma.shippingRegion.findFirst({
      where: {
        OR: [{ rajaongkirId: params.destinationId }, { id: params.destinationId }],
      },
    });
    const destinationId = destRegion?.rajaongkirId || params.destinationId;
    const destinationLabel = destRegion?.searchLabel || destinationId;
    const courierKey = (params.courier || 'ALL').toUpperCase();
    // Gunakan Base Rate 1.000g (1 kg) sebagai kunci cache & hit API, lalu kalikan berat kg secara lokal
    const weightKg = Math.max(1, Math.ceil(Math.max(1, params.weightInGrams) / 1000));
    const weightGram = weightKg * 1000;
    const baseWeightGram = 1000;
    const scaleRates = (baseRates: StandardizedRate[]): StandardizedRate[] =>
      weightKg === 1
        ? baseRates
        : baseRates.map((r) => ({ ...r, cost: Math.round(r.cost * weightKg) }));

    const districtCacheTag = destRegion
      ? `${destRegion.cityName.toLowerCase()}:${destRegion.districtName.toLowerCase()}`
      : destinationId;
    const redisKey = `shipping:rates:v3:${originId}:${districtCacheTag}:${baseWeightGram}:${courierKey}`;

    // 1. Cek Redis Cache terlebih dahulu (level Kecamatan + Base 1 kg)
    const redisCached = await getCache<{
      providerUsed: 'RAJAONGKIR_V2' | 'BINDERBYTE' | 'ESTIMATED_LOCAL';
      rates: StandardizedRate[];
    }>(redisKey);
    if (redisCached && Array.isArray(redisCached.rates) && redisCached.rates.length > 0) {
      return {
        origin: 'Kota Malang (Jl. Cempaka No. 12)',
        destinationId,
        weightInGrams: weightGram,
        providerUsed: redisCached.providerUsed,
        isFromCache: true,
        rates: scaleRates(redisCached.rates),
      };
    }

    // In-flight deduplication: request paralel ke kecamatan & kurir yang sama berbagi 1 lookup
    const inFlightKey = `${originId}:${districtCacheTag}:${baseWeightGram}:${courierKey}`;
    let lookupPromise = this.inFlightRateLookups.get(inFlightKey);
    if (!lookupPromise) {
      lookupPromise = this.executeRateLookup({
        originId,
        originLabel,
        originBinderbyteCode: originRegion?.binderbyteCode || null,
        destinationId,
        destinationLabel,
        destRegion: destRegion
          ? {
              cityName: destRegion.cityName,
              districtName: destRegion.districtName,
              provinceName: destRegion.provinceName,
              binderbyteCode: destRegion.binderbyteCode,
            }
          : null,
        baseWeightGram,
        courierKey,
        redisKey,
      }).finally(() => {
        this.inFlightRateLookups.delete(inFlightKey);
      });
      this.inFlightRateLookups.set(inFlightKey, lookupPromise);
    }

    const baseResult = await lookupPromise;
    return {
      origin: baseResult.origin,
      destinationId: baseResult.destinationId,
      weightInGrams: weightGram,
      providerUsed: baseResult.providerUsed,
      isFromCache: baseResult.isFromCache,
      rates: scaleRates(baseResult.baseRates),
    };
  }

  private async executeRateLookup(ctx: {
    originId: string;
    originLabel: string;
    originBinderbyteCode: string | null;
    destinationId: string;
    destinationLabel: string;
    destRegion: {
      cityName: string;
      districtName: string;
      provinceName: string;
      binderbyteCode: string | null;
    } | null;
    baseWeightGram: number;
    courierKey: string;
    redisKey: string;
  }): Promise<BaseRateLookupResult> {
    const {
      originId,
      originLabel,
      originBinderbyteCode,
      destinationId,
      destinationLabel,
      destRegion,
      baseWeightGram,
      courierKey,
      redisKey,
    } = ctx;

    // 2. Cek PostgreSQL Cache (TTL 30 hari, berbagi antar kelurahan dalam 1 Kecamatan & Kota yang sama)
    const now = new Date();
    let districtDestIds: string[] = [destinationId];
    if (destRegion?.cityName && destRegion?.districtName) {
      const siblings = await prisma.shippingRegion.findMany({
        where: {
          cityName: destRegion.cityName,
          districtName: destRegion.districtName,
        },
        select: { rajaongkirId: true },
        take: 30,
      });
      const siblingIds = siblings
        .map((s) => s.rajaongkirId)
        .filter((id): id is string => Boolean(id));
      if (siblingIds.length > 0) {
        districtDestIds = Array.from(new Set([destinationId, ...siblingIds]));
      }
    }

    const dbCached = await prisma.shippingRateCache.findFirst({
      where: {
        originId,
        destinationId: { in: districtDestIds },
        weightGram: baseWeightGram,
        courier: courierKey,
        expiresAt: { gt: now },
      },
      orderBy: { updatedAt: 'desc' },
    });
    if (dbCached && Array.isArray(dbCached.ratesJson)) {
      const baseRates = dbCached.ratesJson as unknown as StandardizedRate[];
      await setCache(redisKey, { providerUsed: dbCached.provider, rates: baseRates }, RATE_REDIS_TTL_SECONDS);
      return {
        origin: 'Kota Malang (Jl. Cempaka No. 12)',
        destinationId,
        providerUsed: dbCached.provider === LogisticsProvider.BINDERBYTE ? 'BINDERBYTE' : 'RAJAONGKIR_V2',
        isFromCache: true,
        baseRates,
      };
    }

    // 3. Cache Miss -> Multi-Key RajaOngkir V2 Pool (selalu query 1.000g / 1 kg)
    const requestedCouriers: SupportedCourier[] =
      courierKey === 'ALL'
        ? SUPPORTED_COURIERS
        : ([normalizeCourierCode(courierKey)].filter(Boolean) as SupportedCourier[]);
    const couriers = requestedCouriers.length > 0 ? requestedCouriers : SUPPORTED_COURIERS;

    const queryInput: RateQueryInput = {
      originId,
      destinationId,
      originLabel,
      destinationLabel,
      weightGram: baseWeightGram,
      couriers,
    };

    const dateKey = getTodayWibDateKey();
    const keyPool = getRajaOngkirKeyPool();
    let finalRates: StandardizedRate[] | null = null;
    let providerUsed: 'RAJAONGKIR_V2' | 'BINDERBYTE' | 'ESTIMATED_LOCAL' = 'RAJAONGKIR_V2';

    if (keyPool.length > 0) {
      const usageLogs = await prisma.logisticsApiUsageLog.findMany({
        where: { dateKey, provider: LogisticsProvider.RAJAONGKIR_V2 },
      });
      const usageMap = new Map(usageLogs.map((u) => [u.keyAlias, u]));

      for (const entry of keyPool) {
        const log = usageMap.get(entry.alias);
        if (log && (log.isExhausted || log.hitCount >= RO_DAILY_LIMIT)) {
          continue;
        }
        try {
          const rates = await this.rajaOngkir.calculateRates(queryInput, entry.key);
          if (rates.length > 0) {
            await this.incrementUsage(LogisticsProvider.RAJAONGKIR_V2, dateKey, entry.alias);
            finalRates = rates;
            providerUsed = 'RAJAONGKIR_V2';
            break;
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          const isRateLimit = err instanceof ProviderRateLimitError;
          await this.incrementUsage(LogisticsProvider.RAJAONGKIR_V2, dateKey, entry.alias, {
            markExhausted: isRateLimit,
            lastError: message,
          });
        }
      }
    }

    // 4. Last-Resort Fallback ke BinderByte Cost API (Multi-Key Pool) jika seluruh key RajaOngkir habis/gagal
    const bbKeyPool = getBinderByteKeyPool();
    if (!finalRates && bbKeyPool.length > 0) {
      const bbUsageLogs = await prisma.logisticsApiUsageLog.findMany({
        where: { dateKey: 'LIFETIME', provider: LogisticsProvider.BINDERBYTE },
      });
      const bbUsageMap = new Map(bbUsageLogs.map((u) => [u.keyAlias, u]));

      for (const entry of bbKeyPool) {
        const log = bbUsageMap.get(entry.alias);
        if (log && log.isExhausted) {
          continue;
        }
        try {
          const bbRates = await this.binderByte.calculateRates(
            {
              ...queryInput,
              originId: originBinderbyteCode || 'malang',
              destinationId: destRegion?.binderbyteCode || destinationLabel,
            },
            entry.key
          );
          if (bbRates.length > 0) {
            await this.incrementUsage(LogisticsProvider.BINDERBYTE, 'LIFETIME', entry.alias);
            finalRates = bbRates;
            providerUsed = 'BINDERBYTE';
            break;
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          await this.incrementUsage(LogisticsProvider.BINDERBYTE, 'LIFETIME', entry.alias, {
            markExhausted: err instanceof ProviderRateLimitError,
            lastError: message,
          });
        }
      }
    }

    // 5. Fallback bila seluruh API Key habis/gagal:
    // 5a. Stale Cache Fallback (pakai cache DB lama di kecamatan/kota yang sama sebelum estimasi)
    let isStaleFallback = false;
    if (!finalRates || finalRates.length === 0) {
      let staleDestIds = districtDestIds;
      let staleCached = await prisma.shippingRateCache.findFirst({
        where: {
          originId,
          destinationId: { in: staleDestIds },
          weightGram: baseWeightGram,
          courier: courierKey,
        },
        orderBy: { updatedAt: 'desc' },
      });

      if (!staleCached && destRegion?.cityName) {
        const citySiblings = await prisma.shippingRegion.findMany({
          where: { cityName: destRegion.cityName },
          select: { rajaongkirId: true },
          take: 30,
        });
        const cityIds = citySiblings
          .map((s) => s.rajaongkirId)
          .filter((id): id is string => Boolean(id));
        if (cityIds.length > 0) {
          staleDestIds = cityIds;
          staleCached = await prisma.shippingRateCache.findFirst({
            where: {
              originId,
              destinationId: { in: staleDestIds },
              weightGram: baseWeightGram,
              courier: courierKey,
            },
            orderBy: { updatedAt: 'desc' },
          });
        }
      }

      if (staleCached && Array.isArray(staleCached.ratesJson) && staleCached.ratesJson.length > 0) {
        finalRates = staleCached.ratesJson as unknown as StandardizedRate[];
        providerUsed = staleCached.provider === LogisticsProvider.BINDERBYTE ? 'BINDERBYTE' : 'RAJAONGKIR_V2';
        isStaleFallback = true;
      }
    }

    // 5b. Fallback Lokal berbasis Zona Provinsi bila belum pernah ada cache sama sekali
    if (!finalRates || finalRates.length === 0) {
      finalRates = buildFallbackEstimatedRates(baseWeightGram, destinationLabel, destRegion?.provinceName);
      providerUsed = 'ESTIMATED_LOCAL';
    }

    // Simpan ke PostgreSQL Cache (TTL 30 hari, base 1.000g) hanya jika berasal dari hit API live
    if (!isStaleFallback && (providerUsed === 'RAJAONGKIR_V2' || providerUsed === 'BINDERBYTE')) {
      const expiresAt = new Date(now.getTime() + RATE_CACHE_TTL_MS);
      await prisma.shippingRateCache.upsert({
        where: {
          rate_cache_key: { originId, destinationId, weightGram: baseWeightGram, courier: courierKey },
        },
        create: {
          originId,
          destinationId,
          weightGram: baseWeightGram,
          courier: courierKey,
          provider: providerUsed === 'RAJAONGKIR_V2' ? LogisticsProvider.RAJAONGKIR_V2 : LogisticsProvider.BINDERBYTE,
          ratesJson: finalRates as unknown as object,
          expiresAt,
        },
        update: {
          provider: providerUsed === 'RAJAONGKIR_V2' ? LogisticsProvider.RAJAONGKIR_V2 : LogisticsProvider.BINDERBYTE,
          ratesJson: finalRates as unknown as object,
          expiresAt,
        },
      });
    }

    const redisTtl =
      providerUsed === 'ESTIMATED_LOCAL'
        ? ESTIMATED_REDIS_TTL_SECONDS
        : isStaleFallback
          ? STALE_REDIS_TTL_SECONDS
          : RATE_REDIS_TTL_SECONDS;
    await setCache(redisKey, { providerUsed, rates: finalRates }, redisTtl);

    return {
      origin: 'Kota Malang (Jl. Cempaka No. 12)',
      destinationId,
      providerUsed,
      isFromCache: isStaleFallback,
      baseRates: finalRates,
    };
  }

  async trackWaybill(courierInput: string, waybillInput: string): Promise<StandardizedTrackingResult> {
    const courierCode = normalizeCourierCode(courierInput) || 'jne';
    const waybillNumber = waybillInput.trim().toUpperCase();
    const validation = validateWaybillFormat(courierCode, waybillNumber);
    if (!validation.valid) {
      throw new Error(validation.message || 'Format nomor resi tidak valid.');
    }

    const inFlightKey = `${courierCode}:${waybillNumber}`;
    let lookupPromise = this.inFlightWaybillLookups.get(inFlightKey);
    if (!lookupPromise) {
      lookupPromise = this.executeTrackWaybill(courierCode, waybillNumber).finally(() => {
        this.inFlightWaybillLookups.delete(inFlightKey);
      });
      this.inFlightWaybillLookups.set(inFlightKey, lookupPromise);
    }
    return lookupPromise;
  }

  private async executeTrackWaybill(
    courierCode: SupportedCourier,
    waybillNumber: string
  ): Promise<StandardizedTrackingResult> {
    const now = new Date();
    const cached = await prisma.waybillTrackingCache.findUnique({
      where: {
        waybill_courier_key: { courier: courierCode, waybillNumber },
      },
    });

    // Stop permanen jika sudah DELIVERED, atau masih dalam cooldown adaptif
    if (cached && (cached.isDelivered || cached.nextCheckAfter > now)) {
      const summary = (cached.summaryJson || {}) as StandardizedTrackingResult['summary'];
      const history = Array.isArray(cached.historyJson)
        ? (cached.historyJson as unknown as StandardizedTrackingResult['history'])
        : [];
      return {
        courier: courierCode,
        courierName: COURIER_DISPLAY_NAMES[courierCode] || courierCode.toUpperCase(),
        waybillNumber,
        status: cached.status,
        isDelivered: cached.isDelivered,
        fromCache: true,
        lastCheckedAt: cached.lastCheckedAt.toISOString(),
        nextCheckAfter: cached.nextCheckAfter.toISOString(),
        summary,
        history,
      };
    }

    const bbKeyPool = getBinderByteKeyPool();
    let liveResult: StandardizedTrackingResult | null = null;

    if (bbKeyPool.length > 0) {
      const bbUsageLogs = await prisma.logisticsApiUsageLog.findMany({
        where: { dateKey: 'LIFETIME', provider: LogisticsProvider.BINDERBYTE },
      });
      const bbUsageMap = new Map(bbUsageLogs.map((u) => [u.keyAlias, u]));

      for (const entry of bbKeyPool) {
        const log = bbUsageMap.get(entry.alias);
        if (log && log.isExhausted) {
          continue;
        }
        try {
          liveResult = await this.binderByte.trackWaybill(courierCode, waybillNumber, entry.key);
          await this.incrementUsage(LogisticsProvider.BINDERBYTE, 'LIFETIME', entry.alias);
          break;
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          await this.incrementUsage(LogisticsProvider.BINDERBYTE, 'LIFETIME', entry.alias, {
            markExhausted: err instanceof ProviderRateLimitError,
            lastError: message,
          });
        }
      }
    }

    // Graceful fallback: jika API key belum ada atau semua key habis/gagal, kembalikan cache terakhir tanpa error ke user
    if (!liveResult) {
      const fallbackNextCheck = new Date(now.getTime() + TRACKING_COOLDOWN_MS);
      if (cached) {
        await prisma.waybillTrackingCache.update({
          where: { waybill_courier_key: { courier: courierCode, waybillNumber } },
          data: { nextCheckAfter: fallbackNextCheck },
        });
        const summary = (cached.summaryJson || {}) as StandardizedTrackingResult['summary'];
        const history = Array.isArray(cached.historyJson)
          ? (cached.historyJson as unknown as StandardizedTrackingResult['history'])
          : [];
        return {
          courier: courierCode,
          courierName: COURIER_DISPLAY_NAMES[courierCode] || courierCode.toUpperCase(),
          waybillNumber,
          status: cached.status,
          isDelivered: cached.isDelivered,
          fromCache: true,
          lastCheckedAt: cached.lastCheckedAt.toISOString(),
          nextCheckAfter: fallbackNextCheck.toISOString(),
          summary,
          history,
        };
      }

      return {
        courier: courierCode,
        courierName: COURIER_DISPLAY_NAMES[courierCode] || courierCode.toUpperCase(),
        waybillNumber,
        status: 'IN_TRANSIT',
        isDelivered: false,
        fromCache: true,
        lastCheckedAt: now.toISOString(),
        nextCheckAfter: fallbackNextCheck.toISOString(),
        summary: { currentLocation: 'Hub Kota Malang' },
        history: [
          {
            date: now.toISOString(),
            description: 'Resi tercatat di sistem BabyShalls (menunggu pembaruan dari ekspedisi).',
            location: 'Kota Malang',
          },
        ],
      };
    }

    const cooldownMs = getAdaptiveTrackingCooldownMs(liveResult.status, now);
    const nextCheckAfter = new Date(now.getTime() + cooldownMs);
    await prisma.waybillTrackingCache.upsert({
      where: {
        waybill_courier_key: { courier: courierCode, waybillNumber },
      },
      create: {
        courier: courierCode,
        waybillNumber,
        status: liveResult.status as WaybillDeliveryStatus,
        isDelivered: liveResult.isDelivered,
        summaryJson: liveResult.summary as unknown as object,
        historyJson: liveResult.history as unknown as object,
        lastCheckedAt: now,
        nextCheckAfter,
      },
      update: {
        status: liveResult.status as WaybillDeliveryStatus,
        isDelivered: liveResult.isDelivered,
        summaryJson: liveResult.summary as unknown as object,
        historyJson: liveResult.history as unknown as object,
        lastCheckedAt: now,
        nextCheckAfter,
      },
    });

    return {
      ...liveResult,
      nextCheckAfter: nextCheckAfter.toISOString(),
    };
  }

  async setOrderWaybill(
    orderId: string,
    payload: { courierCode: string; courierService?: string | null; waybillNumber: string }
  ) {
    const courier = normalizeCourierCode(payload.courierCode) || payload.courierCode.trim().toLowerCase();
    const waybillNumber = payload.waybillNumber.trim().toUpperCase();
    const validation = validateWaybillFormat(courier, waybillNumber);
    if (!validation.valid) {
      throw new Error(validation.message || 'Format nomor resi tidak valid.');
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        courierCode: courier,
        courierService: payload.courierService?.trim() || 'Reguler',
        waybillNumber,
        status: OrderStatus.SHIPPED,
      },
      include: {
        user: { select: { email: true, name: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    });

    // Delay awal 2 jam saat resi baru diinput agar tidak membuang hit sebelum kurir scan pickup
    const now = new Date();
    const initialNextCheck = new Date(now.getTime() + TRACKING_COOLDOWN_MS);
    await prisma.waybillTrackingCache.upsert({
      where: {
        waybill_courier_key: { courier, waybillNumber },
      },
      create: {
        courier,
        waybillNumber,
        status: WaybillDeliveryStatus.IN_TRANSIT,
        isDelivered: false,
        summaryJson: { currentLocation: 'Butik BabyShalls Malang' },
        historyJson: [
          {
            date: now.toISOString(),
            description: `Resi ${COURIER_DISPLAY_NAMES[courier as SupportedCourier] || courier.toUpperCase()} diinput oleh Admin BabyShalls Malang.`,
            location: 'Kota Malang',
          },
        ],
        lastCheckedAt: now,
        nextCheckAfter: initialNextCheck,
      },
      update: {
        lastCheckedAt: now,
        nextCheckAfter: initialNextCheck,
      },
    });

    if (updated.user?.email) {
      const addr = (updated.shippingAddress || {}) as Record<string, string>;
      void sendOrderReceiptEmail({
        to: updated.user.email,
        customerName: addr.recipientName || updated.user.name,
        orderNumber: updated.orderNumber,
        eventType: 'SHIPPED',
        items: updated.items.map((i) => ({
          name: i.product?.name || 'Produk BabyShalls',
          quantity: i.quantity,
          price: Number(i.price),
        })),
        totalAmount: Number(updated.totalAmount),
        discountAmount: Number(updated.discountAmount),
        shippingCost: Number(updated.shippingCost),
        grandTotal: Number(updated.grandTotal),
        courierCode: updated.courierCode,
        courierService: updated.courierService,
        waybillNumber: updated.waybillNumber,
        shippingAddressText: [addr.address, addr.city, addr.postalCode].filter(Boolean).join(', '),
      }).catch((err) => {
        console.warn('⚠️ Gagal mengirim email resi:', err?.message || err);
      });
    }

    return updated;
  }

  async getLogisticsQuotaStats() {
    const dateKey = getTodayWibDateKey();
    const [roLogs, bbLog] = await Promise.all([
      prisma.logisticsApiUsageLog.findMany({
        where: { dateKey, provider: LogisticsProvider.RAJAONGKIR_V2 },
        orderBy: { keyAlias: 'asc' },
      }),
      prisma.logisticsApiUsageLog.findUnique({
        where: {
          usage_date_provider_key: {
            dateKey: 'LIFETIME',
            provider: LogisticsProvider.BINDERBYTE,
            keyAlias: 'BB_MAIN',
          },
        },
      }),
    ]);

    const bbUsed = bbLog?.hitCount || 0;
    return {
      dateKey,
      rajaOngkirDailyLimitPerKey: RO_DAILY_LIMIT,
      rajaOngkirKeys: roLogs.map((l) => ({
        keyAlias: l.keyAlias,
        hitCount: l.hitCount,
        isExhausted: l.isExhausted,
      })),
      binderByte: {
        totalQuota: BINDERBYTE_QUOTA_TOTAL,
        used: bbUsed,
        remaining: Math.max(0, BINDERBYTE_QUOTA_TOTAL - bbUsed),
      },
    };
  }
}

export const shippingService = new ShippingService();

