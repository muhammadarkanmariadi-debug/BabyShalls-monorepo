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
}

export interface CreateBookRequestResult {
  requestId: string;
  title: string;
  status: string;
}

export function useCreateBookRequest() {
  return useMutation<CreateBookRequestResult, unknown, CreateBookRequestPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<{ success: boolean; data: CreateBookRequestResult }>(
        '/book-requests',
        payload
      );
      return response.data.data;
    },
  });
}

