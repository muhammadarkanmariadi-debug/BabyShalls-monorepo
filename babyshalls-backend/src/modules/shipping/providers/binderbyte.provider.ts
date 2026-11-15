import { IShippingRateProvider, IWaybillProvider } from './shipping-provider.interface.js';
import {
  COURIER_DISPLAY_NAMES,
  normalizeCourierCode,
  NormalizedDeliveryStatus,
  RateQueryInput,
  StandardizedRate,
  StandardizedTrackingResult,
  TrackingEvent,
} from '../shipping.types.js';

const DEFAULT_BB_BASE_URL = 'https://api.binderbyte.com';

interface BinderByteTrackResponse {
  status?: number;
  message?: string;
  data?: {
    summary?: {
      awb?: string;
      courier?: string;
      service?: string;
      status?: string;
      date?: string;
      desc?: string;
      amount?: string;
      weight?: string;
    };
    detail?: {
      origin?: string;
      destination?: string;
      shipper?: string;
      receiver?: string;
    };
    history?: Array<{
      date?: string;
      desc?: string;
      location?: string;
    }>;
  };
}

interface BinderByteCostResponse {
  status?: number;
  message?: string;
  data?: Array<{
    code?: string;
    name?: string;
    service?: string;
    description?: string;
    cost?: number | string;
    etd?: string;
  }>;
}

function mapBinderByteStatus(rawStatus: string): NormalizedDeliveryStatus {
  const upper = rawStatus.toUpperCase();
  if (upper.includes('DELIVERED') || upper.includes('TERKIRIM') || upper.includes('SELESAI')) {
    return 'DELIVERED';
  }
  if (upper.includes('RETURN') || upper.includes('RETUR')) {
    return 'RETURNED';
  }
  if (upper.includes('WITH DELIVERY COURIER') || upper.includes('DIANTAR') || upper.includes('OUT FOR DELIVERY')) {
    return 'OUT_FOR_DELIVERY';
  }
  if (upper.includes('ON PROCESS') || upper.includes('TRANSIT') || upper.includes('MANIFEST') || upper.includes('PICKED')) {
    return 'IN_TRANSIT';
  }
  return 'UNKNOWN';
}

export class BinderByteProvider implements IShippingRateProvider, IWaybillProvider {
  readonly providerName = 'BINDERBYTE' as const;
  private readonly baseUrl: string;

  constructor(baseUrl = process.env.BINDERBYTE_BASE_URL || DEFAULT_BB_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async calculateRates(input: RateQueryInput, apiKey: string): Promise<StandardizedRate[]> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const params = new URLSearchParams({
        api_key: apiKey,
        courier: input.couriers.join(':'),
        origin: input.originId,
        destination: input.destinationId,
        weight: String(Math.max(1, input.weightGram)),
      });

      const response = await fetch(`${this.baseUrl}/v1/cost?${params.toString()}`, {
        method: 'GET',
        signal: controller.signal,
      });

      const json = (await response.json()) as BinderByteCostResponse;
      if (!response.ok || (json.status && json.status !== 200) || !Array.isArray(json.data)) {
        throw new Error(json.message || `BinderByte Cost HTTP ${response.status}`);
      }

      const normalized: StandardizedRate[] = [];
      for (const item of json.data) {
        const code = normalizeCourierCode(item.code || item.name || '');
        if (!code) continue;
        const cost = Number(item.cost || 0);
        if (!Number.isFinite(cost) || cost <= 0) continue;

        normalized.push({
          courierCode: code,
          courierName: COURIER_DISPLAY_NAMES[code] || item.name || code.toUpperCase(),
          service: item.service || 'REG',
          description: item.description || item.service || 'Layanan Reguler',
          cost,
          etd: item.etd ? (item.etd.toLowerCase().includes('hari') ? item.etd : `${item.etd} Hari`) : '2-4 Hari',
        });
      }

      return normalized.sort((a, b) => a.cost - b.cost);
    } finally {
      clearTimeout(timer);
    }
  }

  async trackWaybill(courier: string, waybillNumber: string, apiKey: string): Promise<StandardizedTrackingResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const code = normalizeCourierCode(courier) || 'jne';
      const params = new URLSearchParams({
        api_key: apiKey,
        courier: code,
        awb: waybillNumber.trim(),
      });

      const response = await fetch(`${this.baseUrl}/v1/track?${params.toString()}`, {
        method: 'GET',
        signal: controller.signal,
      });

      const json = (await response.json()) as BinderByteTrackResponse;
      if (!response.ok || (json.status && json.status !== 200) || !json.data) {
        throw new Error(json.message || `BinderByte Track HTTP ${response.status}`);
      }

      const rawStatus = json.data.summary?.status || 'IN_TRANSIT';
      const normalizedStatus = mapBinderByteStatus(rawStatus);
      const history: TrackingEvent[] = (json.data.history || []).map((h) => ({
        date: h.date || '-',
        description: h.desc || '-',
        location: h.location || '-',
      }));

      const now = new Date();
      const nextCheck = new Date(now.getTime() + 120 * 60 * 1000);

      return {
        courier: code,
        courierName: COURIER_DISPLAY_NAMES[code] || code.toUpperCase(),
        waybillNumber: waybillNumber.trim().toUpperCase(),
        status: normalizedStatus,
        isDelivered: normalizedStatus === 'DELIVERED',
        fromCache: false,
        lastCheckedAt: now.toISOString(),
        nextCheckAfter: nextCheck.toISOString(),
        summary: {
          receiver: json.data.detail?.receiver || undefined,
          shippedAt: json.data.summary?.date || undefined,
          currentLocation: history[0]?.location || json.data.detail?.destination || undefined,
        },
        history,
      };
    } finally {
      clearTimeout(timer);
    }
  }
}

