'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ADMIN_TOKEN_STORAGE_KEY } from '../lib/axios';
import { CouponDto, DiscountType } from './useCoupons';

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResult {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
  };
}

export interface AdminOtpChallenge {
  requiresOtp: boolean;
  email: string;
  expiresInSeconds: number;
}

export interface CreateCouponPayload {
  code: string;
  description?: string | null;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number | null;
  minOrder?: number;
  maxUsage?: number | null;
  isActive?: boolean;
  broadcastEmail?: boolean;
}

export interface UpdateCouponPayload {
  id: string;
  data: Partial<CreateCouponPayload>;
}

export function useAdminLogin() {
  return useMutation<AdminLoginResult, unknown, AdminLoginPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<{ success: boolean; data: AdminLoginResult }>(
        '/auth/login',
        payload
      );
      const result = response.data.data;
      if (typeof window !== 'undefined' && result.user.role === 'ADMIN') {
        window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, result.token);
      }
      return result;
    },
  });
}

export function useAdminVerifyOtp() {
  return useMutation<AdminLoginResult, unknown, { email: string; otp: string }>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<{ success: boolean; data: AdminLoginResult }>(
        '/auth/verify-otp',
        payload
      );
      const result = response.data.data;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, result.token);
      }
      return result;
    },
  });
}

export function useAdminCoupons(enabled: boolean) {
  return useQuery<CouponDto[]>({
    queryKey: ['admin-coupons'],
    enabled,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: CouponDto[] }>('/admin/coupons');
      return response.data.data;
    },
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation<CouponDto, unknown, CreateCouponPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<{ success: boolean; data: CouponDto }>(
        '/admin/coupons',
        payload
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['active-coupons'] });
    },
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation<CouponDto, unknown, UpdateCouponPayload>({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.patch<{ success: boolean; data: CouponDto }>(
        `/admin/coupons/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['active-coupons'] });
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation<{ id: string }, unknown, string>({
    mutationFn: async (id) => {
      const response = await apiClient.delete<{ success: boolean; data: { id: string } }>(
        `/admin/coupons/${id}`
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['active-coupons'] });
    },
  });
}

