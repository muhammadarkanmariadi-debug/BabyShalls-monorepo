'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalEventRegistrations: number;
  totalBookRequests: number;
  totalProducts: number;
}

export interface AdminAnalytics {
  range: '7d' | '30d' | '12m';
  series: Array<{ label: string; revenue: number; orders: number }>;
  statusBreakdown: Array<{ status: string; count: number }>;
  lowStockProducts: Array<{ id: string; name: string; stock: number; category: string }>;
  summary?: {
    paidOrdersCount: number;
    totalRevenueInRange: number;
    averageOrderValue: number;
    repeatBuyerRate: number;
  };
  topProducts?: Array<{
    id: string;
    name: string;
    category: string;
    stock: number;
    soldQty: number;
    revenue: number;
    image: string;
  }>;
  categorySales?: Array<{
    category: string;
    soldQty: number;
    revenue: number;
  }>;
  ageGroupSales?: Array<{
    ageGroup: string;
    label: string;
    soldQty: number;
    revenue: number;
  }>;
  workshopOccupancy?: Array<{
    id: string;
    title: string;
    quota: number;
    registeredCount: number;
    checkedInCount: number;
    paidRevenue: number;
    eventDate: string;
  }>;
  topWishlisted?: Array<{
    id: string;
    name: string;
    category: string;
    stock: number;
    wishlistCount: number;
  }>;
}

export interface AdminBookRequest {
  id: string;
  customerName: string | null;
  email?: string | null;
  title: string;
  authorPublisher: string | null;
  notes: string | null;
  referenceImageUrl: string | null;
  whatsappNumber: string;
  status: 'PENDING' | 'QUOTED' | 'ORDERED' | 'COMPLETED';
  adminNotes: string | null;
  createdAt: string;
}

export interface AdminOrderItem {
  id: string;
  productId: string;
  price: number;
  quantity: number;
  product?: { name: string };
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  discountAmount: number;
  couponCode: string | null;
  shippingCost: number;
  grandTotal: number;
  status: 'PENDING_PAYMENT' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  courierCode: string | null;
  courierService: string | null;
  waybillNumber: string | null;
  user: { name: string; email: string; phone?: string | null } | null;
  shippingAddress: {
    recipientName?: string;
    receiverName?: string;
    receiverPhone?: string;
    phone?: string;
    address?: string;
    streetAddress?: string;
    subdistrict?: string;
    city?: string;
    postalCode?: string;
  };
  items?: AdminOrderItem[];
  createdAt: string;
}

export type PrismaAgeGroup = 'NEWBORN_PLUS' | 'AGES_1_3' | 'AGES_3_PLUS' | 'AGES_6_PLUS' | 'ALL_AGES';

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  authorOrBrand?: string | null;
  stock: number;
  weight: number;
  ageGroup: PrismaAgeGroup;
  category: string;
  subCategory?: string | null;
  images: string[];
  features?: string[] | null;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  createdAt?: string;
}

export type AdminProductPayload = {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number | null;
  authorOrBrand?: string | null;
  stock: number;
  weight?: number;
  ageGroup?: PrismaAgeGroup;
  category: string;
  subCategory?: string | null;
  images?: string[];
  features?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
};

export function useAdminStats(enabled: boolean) {
  return useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    enabled,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: AdminStats }>('/admin/stats');
      return response.data.data;
    },
  });
}

export function useAdminAnalytics(enabled: boolean, startDate: string, endDate: string) {
  return useQuery<AdminAnalytics>({
    queryKey: ['admin-analytics', startDate, endDate],
    enabled: enabled && Boolean(startDate) && Boolean(endDate),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: AdminAnalytics }>(
        `/admin/analytics?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
      );
      return response.data.data;
    },
  });
}

export function useAdminBookRequests(enabled: boolean) {
  return useQuery<AdminBookRequest[]>({
    queryKey: ['admin-book-requests'],
    enabled,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: AdminBookRequest[] }>('/admin/book-requests');
      return response.data.data;
    },
  });
}

export function useUpdateBookRequest() {
  const queryClient = useQueryClient();
  return useMutation<
    AdminBookRequest,
    unknown,
    { id: string; status: AdminBookRequest['status']; adminNotes?: string | null }
  >({
    mutationFn: async ({ id, status, adminNotes }) => {
      const response = await apiClient.patch<{ success: boolean; data: AdminBookRequest }>(
        `/admin/book-requests/${id}`,
        { status, adminNotes }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-book-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}

export function useAdminOrders(enabled: boolean) {
  return useQuery<AdminOrder[]>({
    queryKey: ['admin-orders'],
    enabled,
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: AdminOrder[] }>('/admin/orders');
      return res.data.data;
    },
  });
}

export function useUpdateAdminOrderStatus() {
  const qc = useQueryClient();
  return useMutation<
    AdminOrder,
    unknown,
    { id: string; status: AdminOrder['status']; waybillNumber?: string | null }
  >({
    mutationFn: async ({ id, status, waybillNumber }) => {
      const res = await apiClient.patch<{ success: boolean; data: AdminOrder }>(
        `/admin/orders/${id}/status`,
        { status, waybillNumber }
      );
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      qc.invalidateQueries({ queryKey: ['admin-analytics'] });
    },
  });
}

export function useAdminProducts(enabled: boolean) {
  return useQuery<AdminProduct[]>({
    queryKey: ['admin-products'],
    enabled,
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: AdminProduct[] }>('/admin/products');
      return res.data.data;
    },
  });
}

export function useCreateAdminProduct() {
  const qc = useQueryClient();
  return useMutation<AdminProduct, unknown, AdminProductPayload>({
    mutationFn: async (payload) => {
      const res = await apiClient.post<{ success: boolean; data: AdminProduct }>('/admin/products', payload);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateAdminProduct() {
  const qc = useQueryClient();
  return useMutation<AdminProduct, unknown, { id: string } & Partial<AdminProductPayload>>({
    mutationFn: async ({ id, ...data }) => {
      const res = await apiClient.patch<{ success: boolean; data: AdminProduct }>(`/admin/products/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteAdminProduct() {
  const qc = useQueryClient();
  return useMutation<void, unknown, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useAdminCms(enabled: boolean) {
  return useQuery<Record<string, string>>({
    queryKey: ['admin-cms'],
    enabled,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: Record<string, string> }>('/admin/cms');
      return response.data.data;
    },
  });
}

export function useUpdateAdminCms() {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, Record<string, string>>({
    mutationFn: async (payload) => {
      await apiClient.put('/admin/cms', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cms'] });
      queryClient.invalidateQueries({ queryKey: ['public-cms'] });
    },
  });
}
