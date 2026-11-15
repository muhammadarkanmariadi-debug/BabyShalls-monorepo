import { IShippingRateProvider } from './shipping-provider.interface.js';
import {
  COURIER_DISPLAY_NAMES,
  normalizeCourierCode,
  ProviderRateLimitError,
  RateQueryInput,
  StandardizedRate,
} from '../shipping.types.js';

const DEFAULT_RO_BASE_URL = 'https://rajaongkir.komerce.id/api/v1';

interface KomerceCostItem {
  name?: string;
  code?: string;
  service?: string;
  description?: string;
  cost?: number | string;
  etd?: string;
}

interface KomerceDestinationItem {
  id: number | string;
  label?: string;
  province_name?: string;
  city_name?: string;
  district_name?: string;
  subdistrict_name?: string;
  zip_code?: string;
}

export interface RajaOngkirDestination {
  rajaongkirId: string;
  provinceName: string;
  cityName: string;
  districtName: string;
  postalCode: string | null;
  searchLabel: string;
}

export class RajaOngkirV2Provider implements IShippingRateProvider {
  readonly providerName = 'RAJAONGKIR_V2' as const;
  private readonly baseUrl: string;

  constructor(baseUrl = process.env.RAJAONGKIR_V2_BASE_URL || DEFAULT_RO_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async searchDestinations(query: string, apiKey: string, limit = 20): Promise<RajaOngkirDestination[]> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    try {
      const params = new URLSearchParams({
        search: query.trim(),
        limit: String(limit),
      });
      const response = await fetch(`${this.baseUrl}/destination/domestic-destination?${params.toString()}`, {
        method: 'GET',
        headers: { key: apiKey },
        signal: controller.signal,
      });

      if (response.status === 429) {
        throw new ProviderRateLimitError('RajaOngkir V2 destination search rate limit (HTTP 429).');
      }

      const json = (await response.json()) as {
        meta?: { code?: number; message?: string };
        data?: KomerceDestinationItem[];
      };

      if (!response.ok || !Array.isArray(json.data)) {
        return [];
      }

      return json.data.map((d) => {
        const district = d.subdistrict_name && d.district_name && d.subdistrict_name !== d.district_name
          ? `${d.subdistrict_name}, ${d.district_name}`
          : d.district_name || d.subdistrict_name || '';
        const city = d.city_name || '';
        const province = d.province_name || '';
        const searchLabel = d.label || [district, city, province].filter(Boolean).join(', ');
        return {
          rajaongkirId: String(d.id),
          provinceName: province,
          cityName: city,
          districtName: district,
          postalCode: d.zip_code ? String(d.zip_code) : null,
          searchLabel,
        };
      });
    } finally {
      clearTimeout(timer);
    }
  }

  async calculateRates(input: RateQueryInput, apiKey: string): Promise<StandardizedRate[]> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    try {
      const form = new URLSearchParams({
        origin: input.originId,
        destination: input.destinationId,
        weight: String(Math.max(1, input.weightGram)),
        courier: input.couriers.join(':'),
        price: 'lowest',
      });

      const response = await fetch(`${this.baseUrl}/calculate/domestic-cost`, {
        method: 'POST',
        headers: {
          key: apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form.toString(),
        signal: controller.signal,
      });

      if (response.status === 429) {
        throw new ProviderRateLimitError('RajaOngkir V2 rate limit (HTTP 429).');
      }

      const json = (await response.json()) as {
        meta?: { code?: number; message?: string; status?: string };
        data?: KomerceCostItem[];
      };

      if (json.meta?.code === 429 || /limit|quota|exceeded/i.test(json.meta?.message || '')) {
        throw new ProviderRateLimitError(json.meta?.message || 'RajaOngkir V2 quota exceeded.');
      }

      if (!response.ok || !Array.isArray(json.data)) {
        throw new Error(json.meta?.message || `RajaOngkir V2 HTTP ${response.status}`);
      }

      const normalized: StandardizedRate[] = [];
      for (const item of json.data) {
        const code = normalizeCourierCode(item.code || item.name || '');
        if (!code) continue;
        const cost = Number(item.cost || 0);
        if (!Number.isFinite(cost) || cost <= 0) continue;

        const rawEtd = (item.etd || '').trim();
        const formattedEtd = rawEtd
          ? rawEtd.replace(/days?/gi, 'Hari').replace(/hari/gi, 'Hari')
          : '2-4 Hari';

        normalized.push({
          courierCode: code,
          courierName: COURIER_DISPLAY_NAMES[code] || item.name || code.toUpperCase(),
          service: item.service || 'REG',
          description: item.description || item.service || 'Layanan Reguler',
          cost,
          etd: formattedEtd.toLowerCase().includes('hari') ? formattedEtd : `${formattedEtd} Hari`,
        });
      }

      return normalized.sort((a, b) => a.cost - b.cost);
    } finally {
      clearTimeout(timer);
    }
  }
}

