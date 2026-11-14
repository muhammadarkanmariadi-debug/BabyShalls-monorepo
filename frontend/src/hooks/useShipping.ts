'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';

export interface RegionOption {
  id: string;
  rajaongkirId: string;
  binderbyteCode: string | null;
  provinceName: string;
  cityName: string;
  districtName: string;
  postalCode: string | null;
  searchLabel: string;
}

export interface ShippingRate {
  courierCode: string;
  courierName: string;
  service: string;
  description?: string;
  cost: number;
  etd: string;
}

export interface CalculateShippingPayload {
  destinationId?: string;
  destinationSubdistrictId?: number;
  weightInGrams: number;
  courier?: string;
}

export interface CalculateShippingResponse {
  origin: string;
  destinationId: string;
  weightInGrams: number;
  providerUsed: 'RAJAONGKIR_V2' | 'BINDERBYTE' | 'ESTIMATED_LOCAL';
  isFromCache: boolean;
  rates: ShippingRate[];
}

export interface TrackingEvent {
  date: string;
  description: string;
  location: string;
}

export interface TrackingResult {
  courier: string;
  courierName: string;
  waybillNumber: string;
  status: 'UNKNOWN' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'RETURNED';
  isDelivered: boolean;
  fromCache: boolean;
  lastCheckedAt: string;
  nextCheckAfter: string;
  summary?: {
    receiver?: string;
    shippedAt?: string;
    currentLocation?: string;
  };
  history: TrackingEvent[];
}

export interface LogisticsQuotaStats {
  dateKey: string;
  rajaOngkirDailyLimitPerKey: number;
  rajaOngkirKeys: Array<{ keyAlias: string; hitCount: number; isExhausted: boolean }>;
  binderByte: { totalQuota: number; used: number; remaining: number };
}

export function useSearchRegions(query: string) {
  return useQuery<RegionOption[]>({
    queryKey: ['shipping-regions', query.trim().toLowerCase()],
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: RegionOption[] }>(
        `/shipping/regions?q=${encodeURIComponent(query.trim())}`
      );
      return response.data.data;
    },
  });
}

export function useShippingRates(destinationId: string, weightInGrams: number, enabled: boolean) {
  const roundedKg = Math.max(1, Math.ceil(Math.max(1, weightInGrams) / 1000));
  return useQuery<CalculateShippingResponse>({
    queryKey: ['shipping-rates', destinationId, roundedKg],
    enabled: Boolean(enabled && destinationId),
    staleTime: 1000 * 60 * 30, // 30 menit cache di browser agar ganti-ganti wilayah tidak hit berulang
    gcTime: 1000 * 60 * 60,
    queryFn: async () => {
      const response = await apiClient.post<CalculateShippingResponse>('/shipping/calculate', {
        destinationId,
        weightInGrams: roundedKg * 1000,
      });
      return response.data;
    },
  });
}

export function useCalculateShipping() {
  return useMutation<CalculateShippingResponse, unknown, CalculateShippingPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<CalculateShippingResponse>('/shipping/calculate', payload);
      return response.data;
    },
  });
}

export function useTrackWaybill(courier: string | null, waybillNumber: string | null) {
  return useQuery<TrackingResult>({
    queryKey: ['track-waybill', courier, waybillNumber],
    enabled: Boolean(courier && waybillNumber),
    staleTime: (query) => (query.state.data?.isDelivered ? Infinity : 1000 * 60 * 30),
    gcTime: 1000 * 60 * 60,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: TrackingResult }>(
        `/shipping/track/${encodeURIComponent(courier || 'jne')}/${encodeURIComponent(waybillNumber || '')}`
      );
      return response.data.data;
    },
  });
}

export function useSetOrderWaybill() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    unknown,
    { orderId: string; courierCode: string; courierService?: string; waybillNumber: string }
  >({
    mutationFn: async ({ orderId, ...body }) => {
      const response = await apiClient.patch<{ success: boolean; data: unknown }>(
        `/admin/orders/${encodeURIComponent(orderId)}/waybill`,
        body
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
}

export function useLogisticsQuota(enabled: boolean) {
  return useQuery<LogisticsQuotaStats>({
    queryKey: ['logistics-quota'],
    enabled,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: LogisticsQuotaStats }>('/shipping/quota');
      return response.data.data;
    },
  });
}
