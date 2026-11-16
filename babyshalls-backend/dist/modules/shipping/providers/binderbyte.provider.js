import { COURIER_DISPLAY_NAMES, normalizeCourierCode, } from '../shipping.types.js';
const DEFAULT_BB_BASE_URL = 'https://api.binderbyte.com';
function mapBinderByteStatus(rawStatus) {
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
export class BinderByteProvider {
    providerName = 'BINDERBYTE';
    baseUrl;
    constructor(baseUrl = process.env.BINDERBYTE_BASE_URL || DEFAULT_BB_BASE_URL) {
        this.baseUrl = baseUrl.replace(/\/+$/, '');
    }
    async calculateRates(input, apiKey) {
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
            const json = (await response.json());
            if (!response.ok || (json.status && json.status !== 200) || !Array.isArray(json.data)) {
                throw new Error(json.message || `BinderByte Cost HTTP ${response.status}`);
            }
            const normalized = [];
            for (const item of json.data) {
                const code = normalizeCourierCode(item.code || item.name || '');
                if (!code)
                    continue;
                const cost = Number(item.cost || 0);
                if (!Number.isFinite(cost) || cost <= 0)
                    continue;
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
        }
        finally {
            clearTimeout(timer);
        }
    }
    async trackWaybill(courier, waybillNumber, apiKey) {
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
            const json = (await response.json());
            if (!response.ok || (json.status && json.status !== 200) || !json.data) {
                throw new Error(json.message || `BinderByte Track HTTP ${response.status}`);
            }
            const rawStatus = json.data.summary?.status || 'IN_TRANSIT';
            const normalizedStatus = mapBinderByteStatus(rawStatus);
            const history = (json.data.history || []).map((h) => ({
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
        }
        finally {
            clearTimeout(timer);
        }
    }
}
