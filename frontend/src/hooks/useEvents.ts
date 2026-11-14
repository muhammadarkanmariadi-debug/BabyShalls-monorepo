'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';
import { EVENTS } from '../data/events';

export interface PublicEventDto {
  id: string;
  slug: string;
  shortCode?: string | null;
  title: string;
  category: string;
  speaker?: string | null;
  ageRecommendation?: string | null;
  description: string;
  bannerImage: string;
  eventDate: string;
  timeString: string;
  location: string;
  price: number;
  quota: number;
}

export interface RegisterEventPayload {
  eventId: string;
  participantName: string;
  childName: string;
  childAge: string;
  whatsappNumber: string;
  ticketQuantity?: number;
  couponCode?: string;
  unitPrice?: number;
}

export interface RegisterEventResult {
  registrationId: string;
  ticketCode: string;
  eventId: string;
  participantName: string;
  childName: string;
  childAge: string;
  ticketQuantity: number;
  finalAmount?: number;
  paymentStatus?: string;
  midtransOrderId?: string | null;
  snapToken?: string | null;
  redirectUrl?: string | null;
  status: string;
}

function mapStaticFallback(): PublicEventDto[] {
  return EVENTS.map((ev) => ({
    id: ev.id,
    slug: ev.slug,
    shortCode: null,
    title: ev.title,
    category: ev.category || 'Storytelling & Art',
    speaker: ev.speaker,
    ageRecommendation: ev.ageRecommendation,
    description: ev.description,
    bannerImage: ev.image || '/images/event-craft.jpg',
    eventDate: ev.date,
    timeString: ev.time,
    location: ev.location,
    price: ev.price,
    quota: ev.remainingQuota,
  }));
}

export function usePublicEvents() {
  return useQuery<PublicEventDto[]>({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: PublicEventDto[] }>('/events');
        if (Array.isArray(res.data.data) && res.data.data.length > 0) {
          return res.data.data;
        }
      } catch {
        // fallback to static if API unreachable
      }
      return mapStaticFallback();
    },
  });
}

export function useRegisterEvent() {
  return useMutation<RegisterEventResult, unknown, RegisterEventPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<{ success: boolean; data: RegisterEventResult }>(
        '/events/register',
        payload
      );
      return response.data.data;
    },
  });
}
