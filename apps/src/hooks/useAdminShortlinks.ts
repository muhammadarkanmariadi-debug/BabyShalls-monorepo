'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';

export interface AdminShortlink {
  id: string;
  code: string;
  targetUrl: string;
  title: string | null;
  clicks: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShortlinkPayload {
  targetUrl: string;
  code?: string | null;
  title?: string | null;
  isActive?: boolean;
}

export function useAdminShortlinks(enabled: boolean) {
  return useQuery<AdminShortlink[]>({
    queryKey: ['admin-shortlinks'],
    enabled,
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: AdminShortlink[] }>('/admin/shortlinks');
      return res.data.data;
    },
  });
}

export function useCreateShortlink() {
  const qc = useQueryClient();
  return useMutation<AdminShortlink, unknown, CreateShortlinkPayload>({
    mutationFn: async (payload) => {
      const res = await apiClient.post<{ success: boolean; data: AdminShortlink }>('/admin/shortlinks', payload);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-shortlinks'] });
    },
  });
}

export function useUpdateShortlink() {
  const qc = useQueryClient();
  return useMutation<
    AdminShortlink,
    unknown,
    { id: string } & Partial<CreateShortlinkPayload>
  >({
    mutationFn: async ({ id, ...data }) => {
      const res = await apiClient.patch<{ success: boolean; data: AdminShortlink }>(
        `/admin/shortlinks/${id}`,
        data
      );
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-shortlinks'] });
    },
  });
}

export function useDeleteShortlink() {
  const qc = useQueryClient();
  return useMutation<void, unknown, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/admin/shortlinks/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-shortlinks'] });
    },
  });
}

