'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';

export interface AdminEventDto {
  id: string;
  title: string;
  slug: string;
  shortCode: string | null;
  category: string;
  speaker: string | null;
  ageRecommendation: string | null;
  description: string;
  bannerImage: string;
  eventDate: string;
  timeString: string;
  location: string;
  price: number;
  quota: number;
  isActive: boolean;
  registrationsCount: number;
  createdAt: string;
}

export interface AdminEventPayload {
  title: string;
  category?: string;
  speaker?: string | null;
  ageRecommendation?: string | null;
  description: string;
  bannerImage?: string;
  eventDate: string;
  timeString?: string;
  location?: string;
  price?: number;
  quota?: number;
  shortCode?: string | null;
  isActive?: boolean;
  broadcastEmail?: boolean;
}

export interface EventRegistrationDto {
  id: string;
  eventId: string;
  participantName: string;
  childName: string;
  childAge: string;
  whatsappNumber: string;
  ticketQuantity: number;
  ticketCode: string | null;
  paymentStatus: 'FREE' | 'PENDING' | 'PAID';
  midtransOrderId: string | null;
  status: 'REGISTERED' | 'CONFIRMED' | 'CHECKED_IN';
  createdAt: string;
}

export function useAdminEvents(enabled: boolean) {
  return useQuery<AdminEventDto[]>({
    queryKey: ['admin-events'],
    enabled,
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: AdminEventDto[] }>('/admin/events');
      return res.data.data;
    },
  });
}

export function useCreateAdminEvent() {
  const qc = useQueryClient();
  return useMutation<AdminEventDto, unknown, AdminEventPayload>({
    mutationFn: async (payload) => {
      const res = await apiClient.post<{ success: boolean; data: AdminEventDto }>('/admin/events', payload);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-events'] });
      qc.invalidateQueries({ queryKey: ['admin-broadcasts'] });
      qc.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateAdminEvent() {
  const qc = useQueryClient();
  return useMutation<AdminEventDto, unknown, { id: string; data: Partial<AdminEventPayload> }>({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.patch<{ success: boolean; data: AdminEventDto }>(`/admin/events/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-events'] });
      qc.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useDeleteAdminEvent() {
  const qc = useQueryClient();
  return useMutation<void, unknown, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/admin/events/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-events'] });
      qc.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useAdminEventRegistrations(eventId: string | null) {
  return useQuery<EventRegistrationDto[]>({
    queryKey: ['admin-event-registrations', eventId],
    enabled: Boolean(eventId),
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: EventRegistrationDto[] }>(
        `/admin/events/${eventId}/registrations`
      );
      return res.data.data;
    },
  });
}

export interface EventCheckInResponse {
  success: boolean;
  alreadyCheckedIn?: boolean;
  message?: string;
  data: EventRegistrationDto & {
    event?: {
      id: string;
      title: string;
      eventDate: string;
      timeString: string;
      location: string;
    };
  };
}

export function useCheckInEventTicket() {
  const qc = useQueryClient();
  return useMutation<EventCheckInResponse, unknown, { ticketCode: string }>({
    mutationFn: async ({ ticketCode }) => {
      const res = await apiClient.post<EventCheckInResponse>('/admin/events/check-in', {
        ticketCode,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-event-registrations'] });
      qc.invalidateQueries({ queryKey: ['admin-events'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}

export function useUpdateEventRegistrationStatus() {
  const qc = useQueryClient();
  return useMutation<
    EventRegistrationDto,
    unknown,
    { regId: string; status: EventRegistrationDto['status']; paymentStatus?: EventRegistrationDto['paymentStatus'] }
  >({
    mutationFn: async ({ regId, status, paymentStatus }) => {
      const res = await apiClient.patch<{ success: boolean; data: EventRegistrationDto }>(
        `/admin/events/registrations/${regId}`,
        { status, paymentStatus }
      );
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-event-registrations'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}

