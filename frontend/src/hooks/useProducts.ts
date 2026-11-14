'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';
import { AgeGroup, Product, ProductCategory } from '../types';
import { PRODUCTS } from '../data/products';

export interface ProductReviewDto {
  id: string;
  userName: string;
  location?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  authorOrBrand: string | null;
  stock: number;
  weight: number;
  ageGroup: string;
  category: string;
  subCategory: string | null;
  images: string[];
  features?: string[] | unknown;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller?: boolean;
  reviews?: ProductReviewDto[];
}

function mapAgeGroup(age: string): AgeGroup {
  switch (age) {
    case 'NEWBORN_PLUS':
    case 'Newborn+':
      return 'Newborn+';
    case 'AGES_1_3':
    case 'Ages 1-3':
      return 'Ages 1-3';
    case 'AGES_3_PLUS':
    case 'Ages 3+':
      return 'Ages 3+';
    case 'AGES_6_PLUS':
    case 'Ages 6+':
      return 'Ages 6+';
    default:
      return 'Ages 1-3';
  }
}

export function mapProductDtoToProduct(dto: ProductDto): Product {
  const isPreloved =
    dto.subCategory?.toLowerCase() === 'preloved' ||
    dto.category.toLowerCase().includes('preloved') ||
    dto.name.toLowerCase().includes('[preloved]');

  const images =
    Array.isArray(dto.images) && dto.images.length > 0
      ? dto.images
      : ['/images/prod-boardbook.jpg'];

  const features = Array.isArray(dto.features)
    ? dto.features.filter((f): f is string => typeof f === 'string')
    : undefined;

  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.name,
    authorOrBrand: dto.authorOrBrand || undefined,
    price: Number(dto.price),
    originalPrice: dto.originalPrice !== null ? Number(dto.originalPrice) : undefined,
    weightInGrams: dto.weight || 300,
    ageGroup: mapAgeGroup(dto.ageGroup),
    category: dto.category as ProductCategory,
    stock: dto.stock,
    rating: Number(dto.rating) || 5,
    reviewsCount: dto.reviewsCount || 0,
    images,
    description: dto.description,
    features,
    isNewArrival: dto.isNewArrival,
    isBestSeller: dto.isBestSeller,
    isPreloved,
  };
}

export function useProducts(params?: {
  category?: string;
  ageGroup?: string;
  search?: string;
  sort?: string;
}) {
  return useQuery<ProductDto[]>({
    queryKey: ['products', params],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: ProductDto[] }>('/products', {
        params,
      });
      return res.data.data;
    },
  });
}

export function useStorefrontProducts() {
  const query = useQuery<Product[]>({
    queryKey: ['storefront-products'],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: ProductDto[] }>('/products');
        if (Array.isArray(res.data.data) && res.data.data.length > 0) {
          return res.data.data.map(mapProductDtoToProduct);
        }
      } catch {
        // Fallback to static catalog only if backend is unreachable
      }
      return PRODUCTS;
    },
    staleTime: 60_000,
  });

  return {
    ...query,
    products: query.data && query.data.length > 0 ? query.data : PRODUCTS,
  };
}

export function useProductBySlug(slug: string) {
  return useQuery<{ product: Product; reviews: ProductReviewDto[] } | null>({
    queryKey: ['product-detail', slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: ProductDto }>(
          `/products/${encodeURIComponent(slug)}`
        );
        if (res.data.data) {
          return {
            product: mapProductDtoToProduct(res.data.data),
            reviews: res.data.data.reviews || [],
          };
        }
      } catch {
        const fallback = PRODUCTS.find((p) => p.slug === slug);
        if (fallback) {
          return { product: fallback, reviews: [] };
        }
      }
      return null;
    },
  });
}
