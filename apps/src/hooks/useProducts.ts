'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';
import { AgeGroup, Product, ProductCategory } from '../types';
import { PRODUCTS } from '../data/products';

export interface ProductImageDto {
  id: string;
  url: string;
  caption?: string | null;
  sortOrder: number;
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
  galleryImages?: ProductImageDto[];
  features?: string[] | Record<string, unknown> | unknown;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller?: boolean;
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

  const baseImages = Array.isArray(dto.images)
    ? dto.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    : [];
  const galleryUrls = Array.isArray(dto.galleryImages)
    ? dto.galleryImages.map((g) => g.url).filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
    : [];
  const mergedImages = Array.from(new Set([...baseImages, ...galleryUrls]));
  const images = mergedImages.length > 0 ? mergedImages : ['/images/prod-boardbook.jpg'];

  const featureMeta =
    dto.features && typeof dto.features === 'object' && !Array.isArray(dto.features)
      ? (dto.features as Record<string, unknown>)
      : null;

  const features = Array.isArray(dto.features)
    ? dto.features.filter((f): f is string => typeof f === 'string')
    : Array.isArray(featureMeta?.items)
      ? featureMeta.items.filter((f): f is string => typeof f === 'string')
      : undefined;

  const price = Number(dto.price);
  const originalPrice = dto.originalPrice !== null ? Number(dto.originalPrice) : undefined;
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

  const badge = dto.isBestSeller
    ? 'Bestseller'
    : dto.isNewArrival
      ? 'New'
      : dto.isFeatured
        ? 'Featured'
        : undefined;

  const readString = (key: string): string | undefined =>
    featureMeta && typeof featureMeta[key] === 'string' ? (featureMeta[key] as string) : undefined;

  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.name,
    author: dto.authorOrBrand || '',
    authorOrBrand: dto.authorOrBrand || undefined,
    price,
    originalPrice,
    discountPercent,
    weightInGrams: dto.weight || 300,
    ageGroup: mapAgeGroup(dto.ageGroup),
    category: dto.category as ProductCategory,
    subCategory: dto.subCategory || undefined,
    stock: dto.stock,
    inStock: dto.stock > 0,
    coverImage: images[0],
    images,
    description: dto.description,
    features,
    badge,
    condition: isPreloved ? 'preloved' : 'baru',
    featured: dto.isFeatured,
    isNewArrival: dto.isNewArrival,
    isBestSeller: dto.isBestSeller,
    isPreloved,
    publisher: readString('publisher'),
    publicationYear: readString('publicationYear'),
    format: readString('format'),
    pages: readString('pages'),
    language: readString('language'),
    isbn: readString('isbn'),
    dimensions: readString('dimensions'),
    staffNote: readString('staffNote'),
    excerpt: readString('excerpt'),
  };
}

export interface ProductsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useProducts(params?: {
  category?: string;
  subCategory?: string;
  ageGroup?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<ProductDto[]>({
    queryKey: ['products', params],
    queryFn: async () => {
      const res = await apiClient.get<{
        success: boolean;
        data: ProductDto[];
        meta?: ProductsMeta;
      }>('/products', {
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
        const res = await apiClient.get<{ success: boolean; data: ProductDto[] }>('/products', {
          params: { limit: 100 },
        });
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

export function useProductBySlug(slugOrId: string) {
  return useQuery<{ product: Product } | null>({
    queryKey: ['product-detail', slugOrId],
    enabled: Boolean(slugOrId),
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: ProductDto }>(
          `/products/${encodeURIComponent(slugOrId)}`
        );
        if (res.data.data) {
          return {
            product: mapProductDtoToProduct(res.data.data),
          };
        }
      } catch {
        const fallback = PRODUCTS.find(
          (p: Product) => p.slug === slugOrId || p.id === slugOrId
        );
        if (fallback) {
          return { product: fallback };
        }
      }
      return null;
    },
  });
}
