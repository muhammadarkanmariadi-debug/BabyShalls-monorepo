'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { useStorefrontProducts } from '../hooks/useProducts';
import { apiClient, ADMIN_TOKEN_STORAGE_KEY, USER_TOKEN_STORAGE_KEY } from '../lib/axios';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  totalWishlist: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'babyshalls_wishlist_v1';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasSyncedDbRef = useRef(false);

  const hasAuthToken = () =>
    typeof window !== 'undefined' &&
    Boolean(
      window.localStorage.getItem(USER_TOKEN_STORAGE_KEY) ||
        window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
    );

  useEffect(() => {
    let localIds: string[] = [];
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          localIds = parsed;
          setWishlistIds(parsed);
        }
      }
    } catch {
      // localStorage unavailable
    } finally {
      setIsHydrated(true);
    }

    if (!hasAuthToken()) {
      hasSyncedDbRef.current = true;
      return;
    }

    let cancelled = false;
    apiClient
      .get<{ success: boolean; data: string[] }>('/account/wishlist')
      .then((res) => {
        if (cancelled) return;
        const dbIds = Array.isArray(res.data?.data) ? res.data.data : [];
        if (dbIds.length === 0 && localIds.length > 0) {
          hasSyncedDbRef.current = true;
          void apiClient.put('/account/wishlist', { productIds: localIds });
          return;
        }
        if (dbIds.length > 0) {
          const merged = Array.from(new Set([...localIds, ...dbIds]));
          setWishlistIds(merged);
          if (localIds.length > 0 && merged.length !== dbIds.length) {
            void apiClient.put('/account/wishlist', { productIds: merged });
          }
        }
        hasSyncedDbRef.current = true;
      })
      .catch(() => {
        hasSyncedDbRef.current = true;
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // localStorage unavailable
    }
    if (!hasSyncedDbRef.current || !hasAuthToken()) return;
    const timer = setTimeout(() => {
      void apiClient
        .put('/account/wishlist', { productIds: wishlistIds })
        .catch(() => undefined);
    }, 250);
    return () => clearTimeout(timer);
  }, [wishlistIds, isHydrated]);

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const { products } = useStorefrontProducts();
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id) || wishlistIds.includes(p.slug));

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        totalWishlist: wishlistProducts.length,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return ctx;
};

