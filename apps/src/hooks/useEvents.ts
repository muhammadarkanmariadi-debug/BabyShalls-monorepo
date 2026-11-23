'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';
import { ALL_EVENTS, getEventById } from '../data/eventsData';

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
  return ALL_EVENTS.map((ev) => ({
    id: ev.id,
    slug: ev.id,
    shortCode: null,
    title: ev.title,
    category: ev.category || 'Workshop',
    speaker: ev.companion || null,
    ageRecommendation: ev.age,
    description: ev.description || '',
    bannerImage: ev.image || '/images/events/event-workshop-alam.png',
    eventDate: ev.date,
    timeString: ev.time,
    location: ev.location,
    price: ev.price,
    quota: ev.seatsLeft ?? 20,
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

export function usePublicEvent(idOrSlug: string) {
  return useQuery<PublicEventDto>({
    queryKey: ['event', idOrSlug],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: PublicEventDto }>(
          `/events/${encodeURIComponent(idOrSlug)}`
        );
        if (res.data?.data) {
          return res.data.data;
        }
      } catch {
        // fallback to static
      }
      const staticEvent =
        ALL_EVENTS.find((e) => e.id === idOrSlug || e.id === idOrSlug.toLowerCase()) ||
        getEventById(idOrSlug);
      return {
        id: staticEvent.id,
        slug: staticEvent.id,
        shortCode: null,
        title: staticEvent.title,
        category: staticEvent.category || 'Workshop',
        speaker: staticEvent.companion || null,
        ageRecommendation: staticEvent.age,
        description: staticEvent.description || '',
        bannerImage: staticEvent.image || '/images/events/event-workshop-alam.png',
        eventDate: staticEvent.date,
        timeString: staticEvent.time,
        location: staticEvent.location,
        price: staticEvent.price,
        quota: staticEvent.seatsLeft ?? 20,
      };
    },
    enabled: Boolean(idOrSlug),
  });
}

export function useRegisterEvent() {
  return useMutation<RegisterEventResult, unknown, RegisterEventPayload & { idempotencyKey?: string }>({
    mutationFn: async ({ idempotencyKey, ...payload }) => {
      const response = await apiClient.post<{ success: boolean; data: RegisterEventResult }>(
        '/events/register',
        payload,
        idempotencyKey ? { headers: { 'Idempotency-Key': idempotencyKey } } : undefined
      );
      return response.data.data;
    },
  });
}
