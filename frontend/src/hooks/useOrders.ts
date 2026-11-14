'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';

export interface CreateSnapTokenPayload {
  orderNumber?: string;
  grossAmount: number;
  customerDetails?: {
    first_name?: string;
    email?: string;
    phone?: string;
  };
  itemDetails?: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export interface CreateSnapTokenResult {
  orderNumber: string;
  token: string;
  redirect_url: string;
  isSandboxFallback?: boolean;
}

export interface CreateOrderPayload {
  items: Array<{
    productId: string;
    title?: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: {
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
  };
  courierCode: string;
  courierService: string;
  shippingCost: number;
  couponCode?: string | null;
}

export interface CreateOrderResult {
  orderId: string;
  orderNumber: string;
  grandTotal: number;
  snapToken: string;
  redirectUrl: string;
  paymentExpiresAt?: string;
}

export function useCreateOrder() {
  return useMutation<CreateOrderResult, unknown, CreateOrderPayload & { idempotencyKey?: string }>({
    mutationFn: async ({ idempotencyKey, ...payload }) => {
      const response = await apiClient.post<{ success: boolean; data: CreateOrderResult }>(
        '/orders',
        payload,
        idempotencyKey ? { headers: { 'Idempotency-Key': idempotencyKey } } : undefined
      );
      return response.data.data;
    },
  });
}

export function useCreateSnapToken() {
  return useMutation<CreateSnapTokenResult, unknown, CreateSnapTokenPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<{ success: boolean; data: CreateSnapTokenResult }>(
        '/orders/create-snap-token',
        payload
      );
      return response.data.data;
    },
  });
}

