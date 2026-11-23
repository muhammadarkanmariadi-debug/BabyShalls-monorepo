'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';

export interface CreateBookRequestPayload {
  title: string;
  authorPublisher?: string;
  customerName?: string;
  email?: string;
  whatsappNumber: string;
  notes?: string;
  referenceImageUrl?: string;
  turnstileToken?: string;
}

export interface CreateBookRequestResult {
  requestId: string;
  title: string;
  status: string;
}

export function useCreateBookRequest() {
  return useMutation<CreateBookRequestResult, unknown, CreateBookRequestPayload & { idempotencyKey?: string }>({
    mutationFn: async ({ idempotencyKey, ...payload }) => {
      const response = await apiClient.post<{ success: boolean; data: CreateBookRequestResult }>(
        '/book-requests',
        payload,
        idempotencyKey ? { headers: { 'Idempotency-Key': idempotencyKey } } : undefined
      );
      return response.data.data;
    },
  });
}

