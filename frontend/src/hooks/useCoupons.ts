'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';

export const CLAIMED_VOUCHERS_STORAGE_KEY = 'babyshalls_claimed_vouchers_v1';
const VOUCHERS_CHANGED_EVENT = 'babyshalls-vouchers-changed';

export function useClaimedVouchers() {
  const [claimedCodes, setClaimedCodes] = useState<string[]>([]);
  const isHydratedRef = useRef(false);

  const readFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(CLAIMED_VOUCHERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setClaimedCodes(parsed.map((c) => String(c).toUpperCase()));
          return;
        }
      }
      setClaimedCodes([]);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    readFromStorage();
    isHydratedRef.current = true;
    const onSync = () => readFromStorage();
    window.addEventListener('storage', onSync);
    window.addEventListener(VOUCHERS_CHANGED_EVENT, onSync);
    return () => {
      window.removeEventListener('storage', onSync);
      window.removeEventListener(VOUCHERS_CHANGED_EVENT, onSync);
    };
  }, [readFromStorage]);

  const claimVoucher = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;
    setClaimedCodes((prev) => {
      if (prev.includes(normalized)) return prev;
      const next = [...prev, normalized];
      if (isHydratedRef.current) {
        try {
          localStorage.setItem(CLAIMED_VOUCHERS_STORAGE_KEY, JSON.stringify(next));
          window.dispatchEvent(new Event(VOUCHERS_CHANGED_EVENT));
        } catch {
          // ignore
        }
      }
      return next;
    });
  }, []);

  const isClaimed = useCallback(
    (code: string) => claimedCodes.includes(code.trim().toUpperCase()),
    [claimedCodes]
  );

  return { claimedCodes, claimVoucher, isClaimed };
}

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'SHIPPING_SUBSIDY';

export interface CouponDto {
  id: string;
  code: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount: number | null;
  minOrder: number;
  maxUsage: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
}

export interface ValidateCouponPayload {
  code: string;
  subtotal: number;
  shippingCost?: number;
}

export interface ValidateCouponResult {
  valid: boolean;
  coupon: CouponDto;
  discountAmount: number;
}

export function useActiveCoupons() {
  return useQuery<CouponDto[]>({
    queryKey: ['active-coupons'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: CouponDto[] }>('/coupons/active');
      return response.data.data;
    },
  });
}

export function useValidateCoupon() {
  return useMutation<ValidateCouponResult, unknown, ValidateCouponPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<{ success: boolean; data: ValidateCouponResult }>(
        '/coupons/validate',
        payload
      );
      return response.data.data;
    },
  });
}

