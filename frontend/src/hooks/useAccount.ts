'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, USER_TOKEN_STORAGE_KEY } from '../lib/axios';

export interface AccountProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  phone: string | null;
  parentName?: string | null;
  childName?: string | null;
  childAge?: string | null;
  emailOptIn?: boolean;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

export interface AccountAddress {
  id: string;
  label: string;
  receiverName: string;
  receiverPhone: string;
  streetAddress: string;
  city: string;
  subdistrict: string;
  postalCode: string;
  isDefault: boolean;
}

export interface AccountOrderItem {
  id: string;
  productId: string;
  price: number;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[] | unknown;
  };
  review: {
    id: string;
    rating: number;
    comment: string;
  } | null;
}

export interface AccountOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  discountAmount: number;
  couponCode: string | null;
  shippingCost: number;
  grandTotal: number;
  status: 'PENDING_PAYMENT' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  snapToken?: string | null;
  courierCode: string | null;
  courierService: string | null;
  waybillNumber: string | null;
  shippingAddress: {
    recipientName?: string;
    phone?: string;
    address?: string;
    city?: string;
  };
  items: AccountOrderItem[];
  createdAt: string;
}

export interface AccountTicket {
  id: string;
  ticketCode: string | null;
  childName: string;
  childAge: string;
  ticketQuantity: number;
  paymentStatus: string;
  status: string;
  event: {
    title: string;
    eventDate?: string;
    timeString: string;
    location: string;
  };
}

export function useAccountProfile(enabled: boolean) {
  return useQuery<AccountProfile>({
    queryKey: ['account-profile'],
    enabled,
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: AccountProfile }>('/account/profile');
      return res.data.data;
    },
  });
}

export function useUpdateAccountProfile() {
  const qc = useQueryClient();
  return useMutation<
    AccountProfile,
    unknown,
    {
      name: string;
      avatarUrl?: string | null;
      phone?: string | null;
      parentName?: string | null;
      childName?: string | null;
      childAge?: string | null;
      emailOptIn?: boolean;
    }
  >({
    mutationFn: async (payload) => {
      const res = await apiClient.patch<{ success: boolean; data: AccountProfile }>('/account/profile', payload);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['account-profile'] });
      qc.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
}

export function useChangeAccountPassword() {
  return useMutation<void, unknown, { currentPassword: string; newPassword: string }>({
    mutationFn: async (payload) => {
      await apiClient.patch('/account/password', payload);
    },
  });
}

export function useRequestEmailChange() {
  return useMutation<{ newEmail: string; expiresInSeconds: number }, unknown, { newEmail: string; currentPassword: string }>({
    mutationFn: async (payload) => {
      const res = await apiClient.post<{
        success: boolean;
        data: { newEmail: string; expiresInSeconds: number };
      }>('/account/email/request-change', payload);
      return res.data.data;
    },
  });
}

export function useVerifyEmailChange() {
  const qc = useQueryClient();
  return useMutation<{ token: string; user: AccountProfile }, unknown, { newEmail: string; otp: string }>({
    mutationFn: async (payload) => {
      const res = await apiClient.post<{
        success: boolean;
        data: { token: string; user: AccountProfile };
      }>('/account/email/verify-change', payload);
      if (typeof window !== 'undefined' && res.data.data.token) {
        window.localStorage.setItem(USER_TOKEN_STORAGE_KEY, res.data.data.token);
      }
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['account-profile'] });
      qc.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
}

export function useAccountAddresses(enabled: boolean) {
  return useQuery<AccountAddress[]>({
    queryKey: ['account-addresses'],
    enabled,
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: AccountAddress[] }>('/account/addresses');
      return res.data.data;
    },
  });
}

export function useCreateAccountAddress() {
  const qc = useQueryClient();
  return useMutation<AccountAddress, unknown, Omit<AccountAddress, 'id'>>({
    mutationFn: async (payload) => {
      const res = await apiClient.post<{ success: boolean; data: AccountAddress }>('/account/addresses', payload);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['account-addresses'] });
    },
  });
}

export function useDeleteAccountAddress() {
  const qc = useQueryClient();
  return useMutation<void, unknown, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/account/addresses/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['account-addresses'] });
    },
  });
}

export function useAccountOrders(enabled: boolean) {
  return useQuery<AccountOrder[]>({
    queryKey: ['account-orders'],
    enabled,
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: AccountOrder[] }>('/account/orders');
      return res.data.data;
    },
  });
}

export function useAccountTickets(enabled: boolean) {
  return useQuery<AccountTicket[]>({
    queryKey: ['account-tickets'],
    enabled,
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: AccountTicket[] }>('/account/tickets');
      return res.data.data;
    },
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation<unknown, unknown, { orderItemId: string; rating: number; comment: string }>({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/account/reviews', payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['account-orders'] });
    },
  });
}

export function useOrderSnapToken() {
  return useMutation<
    { orderNumber: string; snapToken: string; redirectUrl: string },
    unknown,
    string
  >({
    mutationFn: async (orderNumber) => {
      const res = await apiClient.post<{
        success: boolean;
        data: { orderNumber: string; snapToken: string; redirectUrl: string };
      }>(`/orders/${encodeURIComponent(orderNumber)}/snap-token`);
      return res.data.data;
    },
  });
}

export function usePayEventTicket() {
  return useMutation<
    { registrationId: string; finalAmount: number; snapToken: string; redirectUrl: string },
    unknown,
    string
  >({
    mutationFn: async (registrationId) => {
      const res = await apiClient.post<{
        success: boolean;
        data: { registrationId: string; finalAmount: number; snapToken: string; redirectUrl: string };
      }>(`/events/registrations/${encodeURIComponent(registrationId)}/pay`);
      return res.data.data;
    },
  });
}

