'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '../types';
import { apiClient, ADMIN_TOKEN_STORAGE_KEY, USER_TOKEN_STORAGE_KEY } from '../lib/axios';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  totalWeightInGrams: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toastMessage: string | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'babyshalls_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasSyncedDbRef = useRef(false);

  const hasAuthToken = () =>
    typeof window !== 'undefined' &&
    Boolean(
      window.localStorage.getItem(USER_TOKEN_STORAGE_KEY) ||
        window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
    );

  // Load from localStorage on mount, then merge/sync with DB if logged in
  useEffect(() => {
    let localItems: CartItem[] = [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          localItems = parsed;
          setItems(parsed);
        }
      }
    } catch {
      // LocalStorage unavailable
    } finally {
      setIsHydrated(true);
    }

    if (!hasAuthToken()) {
      hasSyncedDbRef.current = true;
      return;
    }

    let cancelled = false;
    apiClient
      .get<{ success: boolean; data: CartItem[] }>('/account/cart')
      .then((res) => {
        if (cancelled) return;
        const dbItems = Array.isArray(res.data?.data) ? res.data.data : [];
        if (dbItems.length === 0 && localItems.length > 0) {
          hasSyncedDbRef.current = true;
          void apiClient.put('/account/cart', {
            items: localItems.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          });
          return;
        }
        if (dbItems.length > 0) {
          const merged = [...localItems];
          for (const dbItem of dbItems) {
            const exists = merged.some(
              (m) => m.product.id === dbItem.product.id || m.product.slug === dbItem.product.slug
            );
            if (!exists) merged.push(dbItem);
          }
          setItems(merged);
          if (localItems.length > 0 && merged.length !== dbItems.length) {
            void apiClient.put('/account/cart', {
              items: merged.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
            });
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

  // Save to localStorage & sync to DB on change (only after initial hydration + DB sync)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
    if (!hasSyncedDbRef.current || !hasAuthToken()) return;
    const timer = setTimeout(() => {
      void apiClient
        .put('/account/cart', {
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        })
        .catch(() => undefined);
    }, 250);
    return () => clearTimeout(timer);
  }, [items, isHydrated]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showNotification(`"${product.title}" berhasil dimasukkan ke keranjang`);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const dismissToast = () => setToastMessage(null);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalWeightInGrams = items.reduce(
    (sum, item) => sum + item.product.weightInGrams * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        totalWeightInGrams,
        isCartOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toastMessage,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

