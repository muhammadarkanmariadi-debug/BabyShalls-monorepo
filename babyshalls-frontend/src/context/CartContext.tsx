'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, GiftWrappingState } from '../types';
import { formatIDR } from '@/lib/utils';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  giftWrapping: GiftWrappingState;
  updateGiftWrapping: (updates: Partial<GiftWrappingState>) => void;
  giftWrappingCost: number;
  grandTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  toastMessage: string | null;
  dismissToast: () => void;
  showToast: (msg: string) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isStoreInfoOpen: boolean;
  setIsStoreInfoOpen: (open: boolean) => void;
  isWorkshopModalOpen: boolean;
  setIsWorkshopModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  generateWhatsAppOrderUrl: (details: {
    customerName: string;
    deliveryMethod: string;
    deliveryAddress?: string;
    customerPhone?: string;
  }) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialGiftWrapping: GiftWrappingState = {
  birthdayCard: false,
  cardMessage: '',
  customRibbon: false,
  signatureBox: false
};

const GIFT_PRICES = {
  birthdayCard: 15000,
  customRibbon: 10000,
  signatureBox: 35000
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [giftWrapping, setGiftWrapping] = useState<GiftWrappingState>(initialGiftWrapping);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const openCart = () => setIsCartOpen(true);
  const dismissToast = () => setToastMessage(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);
  const [isWorkshopModalOpen, setIsWorkshopModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Hydrate cart from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('babyshalls_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore fallback
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage only after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('babyshalls_cart', JSON.stringify(items));
    } catch {
      // Ignore fallback
    }
  }, [items, isHydrated]);

  const addToCart = (product: Product, quantity = 1) => {
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
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    setGiftWrapping(initialGiftWrapping);
  };

  const updateGiftWrapping = (updates: Partial<GiftWrappingState>) => {
    setGiftWrapping((prev) => ({ ...prev, ...updates }));
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let giftWrappingCost = 0;
  if (giftWrapping.birthdayCard) giftWrappingCost += GIFT_PRICES.birthdayCard;
  if (giftWrapping.customRibbon) giftWrappingCost += GIFT_PRICES.customRibbon;
  if (giftWrapping.signatureBox) giftWrappingCost += GIFT_PRICES.signatureBox;

  const grandTotal = subtotal + giftWrappingCost;

  const generateWhatsAppOrderUrl = ({
    customerName,
    deliveryMethod,
    deliveryAddress,
    customerPhone
  }: {
    customerName: string;
    deliveryMethod: string;
    deliveryAddress?: string;
    customerPhone?: string;
  }): string => {
    const waNumber = '6281234567890'; // Babyshalls WhatsApp store number

    let text = `Halo Babyshalls! 🌿✨\nSaya ingin melakukan pemesanan buku & mainan:\n\n`;

    if (items.length === 0) {
      text += `(Belum ada produk yang dipilih)\n\n`;
    } else {
      items.forEach((item, idx) => {
        text += `${idx + 1}. *${item.product.title}* (${item.quantity}x) — ${formatIDR(item.product.price * item.quantity)}\n`;
      });
      text += `\n*Subtotal Produk:* ${formatIDR(subtotal)}\n`;
    }

    const giftsChosen: string[] = [];
    if (giftWrapping.birthdayCard) giftsChosen.push(`Birthday Card (+${formatIDR(GIFT_PRICES.birthdayCard)})`);
    if (giftWrapping.customRibbon) giftsChosen.push(`Custom Gift Ribbon (+${formatIDR(GIFT_PRICES.customRibbon)})`);
    if (giftWrapping.signatureBox) giftsChosen.push(`Signature Hamper Box (+${formatIDR(GIFT_PRICES.signatureBox)})`);

    if (giftsChosen.length > 0) {
      text += `\n🎁 *Gift Wrapping Add-ons:* ${giftsChosen.join(', ')}\n`;
      text += `*Biaya Gift Wrapping:* ${formatIDR(giftWrappingCost)}\n`;
      if (giftWrapping.cardMessage) {
        text += `*Pesan Kartu Ucapan:*\n"${giftWrapping.cardMessage}"\n`;
      }
    }

    text += `\n💰 *Total Estimasi:* ${formatIDR(grandTotal)}\n\n`;
    text += `👤 *Nama Pemesan:* ${customerName || '-'}\n`;
    if (customerPhone) text += `📞 *No. WhatsApp:* ${customerPhone}\n`;
    text += `📍 *Metode Pengiriman:* ${deliveryMethod}\n`;
    if (deliveryAddress && deliveryMethod !== 'Ambil di Toko (Citraland Puncak Tidar)') {
      text += `🏠 *Alamat Pengiriman:* ${deliveryAddress}\n`;
    }

    text += `\nMohon konfirmasi ketersediaan stok & info rekening pembayaran ya Kak. Terima kasih! 🤍`;

    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        giftWrapping,
        updateGiftWrapping,
        giftWrappingCost,
        grandTotal,
        isCartOpen,
        setIsCartOpen,
        openCart,
        toastMessage,
        dismissToast,
        showToast,
        quickViewProduct,
        setQuickViewProduct,
        isStoreInfoOpen,
        setIsStoreInfoOpen,
        isWorkshopModalOpen,
        setIsWorkshopModalOpen,
        searchQuery,
        setSearchQuery,
        generateWhatsAppOrderUrl
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

