'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, Gift, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatIDR, formatWeight } from '../../lib/utils';

export const CartDrawer: React.FC = () => {
  const {
    items,
    totalItems,
    subtotal,
    totalWeightInGrams,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-[#502E1E]/40 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FFF8EF] shadow-drawer flex flex-col z-10 border-l border-[#EEDBC9]">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#EEDBC9] flex items-center justify-between bg-[#FCF6EC]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#DA7A5B]" />
            <h2 className="font-serif text-lg font-bold text-[#502E1E]">
              Keranjang Belanja
            </h2>
            <span className="bg-[#FFE4D0] text-[#DA7A5B] text-xs font-black px-2 py-0.5 rounded-full">
              {totalItems} item
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-full text-[#6B3F2A] hover:bg-[#FFE4D0] transition-colors"
            aria-label="Tutup keranjang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#FFE4D0] flex items-center justify-center text-[#DA7A5B]">
                <ShoppingBag className="w-10 h-10 opacity-70" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#502E1E]">
                Keranjang Anda masih kosong
              </h3>
              <p className="text-sm text-[#8FA87E] max-w-xs mx-auto">
                Yuk jelajahi kurasi buku cerita anak dan mainan kayu edukasi kami!
              </p>
              <button
                onClick={closeCart}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DA7A5B] text-white font-bold text-sm shadow-subtle hover:bg-[#C46749] transition-all"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-3.5 p-3.5 rounded-2xl bg-[#FCF6EC] border border-[#EEDBC9] shadow-xs"
              >
                {/* Product Thumbnail Placeholder with Icon */}
                <div className="w-18 h-18 rounded-xl bg-[#FFE4D0] flex-shrink-0 flex items-center justify-center text-[#DA7A5B] border border-[#F6B79B]/50">
                  <ShoppingBag className="w-7 h-7 opacity-75" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#502E1E] truncate">
                      {product.title}
                    </h4>
                    <span className="text-xs text-[#8FA87E] block mt-0.5">
                      {product.category} • {formatWeight(product.weightInGrams)}
                    </span>
                    <span className="text-sm font-bold text-[#DA7A5B] mt-1 block">
                      {formatIDR(product.price)}
                    </span>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EEDBC9]/60">
                    <div className="flex items-center border border-[#EEDBC9] rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-2 py-1 text-[#6B3F2A] hover:bg-[#FFE4D0] transition-colors"
                        aria-label="Kurangi kuantitas"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#502E1E]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-2 py-1 text-[#6B3F2A] hover:bg-[#FFE4D0] transition-colors"
                        aria-label="Tambah kuantitas"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-[#C46749] hover:text-red-600 p-1 rounded-md transition-colors"
                      aria-label="Hapus dari keranjang"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#EEDBC9] bg-[#FCF6EC] space-y-3">
            {/* Free wrapping perk */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EBF2E0] text-[#709154] text-xs font-semibold">
              <Gift className="w-4 h-4 flex-shrink-0" />
              <span>Termasuk opsi <strong>Free Gift Wrapping</strong> & kartu ucapan!</span>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-[#8FA87E]">
                <span>Total Berat ({totalItems} item):</span>
                <span className="font-bold text-[#6B3F2A]">{formatWeight(totalWeightInGrams)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="font-serif font-bold text-[#502E1E]">Subtotal:</span>
                <span className="font-extrabold text-[#DA7A5B] text-lg">
                  {formatIDR(subtotal)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-sm shadow-subtle hover:shadow-card transition-all"
            >
              <span>Lanjut ke Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

