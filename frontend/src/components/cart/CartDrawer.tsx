'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, Gift, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatIDR, formatWeight } from '../../lib/utils';

export const CartDrawer: React.FC = () => {
  const {
    items,
    totalItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds(items.map((i) => i.product.id));
  }, [items]);

  if (!isCartOpen) return null;

  const allSelected = items.length > 0 && selectedIds.length === items.length;
  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : items.map((i) => i.product.id));
  };
  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedItems = items.filter((i) => selectedIds.includes(i.product.id));
  const selectedCount = selectedItems.reduce((acc, i) => acc + i.quantity, 0);
  const selectedSubtotal = selectedItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const selectedWeight = selectedItems.reduce(
    (acc, i) => acc + i.product.weightInGrams * i.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-drawer flex flex-col z-10 border-l border-[#E5E7EB]">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#1E543B]" />
            <h2 className="text-lg font-extrabold text-[#1A1A1A]">
              Keranjang Belanja
            </h2>
            <span className="bg-[#FDF0B8] text-[#1A1A1A] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {totalItems} item
            </span>
          </div>
          <button
            onClick={closeCart}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#1A1A1A] hover:bg-[#E5E7EB]/60 transition-colors"
            aria-label="Tutup keranjang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Select All Bar (Shopee / Tokopedia Style) */}
        {items.length > 0 && (
          <div className="px-5 py-2.5 border-b border-[#F3F4F6] flex items-center justify-between text-xs bg-white">
            <label className="flex items-center gap-2 font-bold text-[#1A1A1A] cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-[#1E543B]"
              />
              <span>Pilih Semua ({items.length} produk)</span>
            </label>
            <span className="text-[#6B7280] font-semibold">BabyShalls Malang</span>
          </div>
        )}

        {/* Drawer Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#FAF4E8] flex items-center justify-center text-[#1E543B]">
                <ShoppingBag className="w-9 h-9" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A]">
                Keranjang Anda masih kosong
              </h3>
              <p className="text-sm text-[#6B7280] max-w-xs mx-auto">
                Yuk jelajahi kurasi buku cerita anak dan mainan kayu edukasi kami!
              </p>
              <button
                onClick={closeCart}
                className="mt-2 inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-full bg-[#F5B7A1] hover:bg-[#ED9E84] text-[#1A1A1A] font-bold text-sm transition-colors"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => {
              const checked = selectedIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E5E7EB]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleItem(product.id)}
                    className="w-4 h-4 mt-2 accent-[#1E543B] shrink-0"
                    aria-label={`Pilih ${product.title}`}
                  />
                  <div className="w-18 h-18 rounded-xl bg-[#F8FAFC] overflow-hidden flex-shrink-0 border border-[#E5E7EB]">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#6B7280]">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#1A1A1A] truncate">
                        {product.title}
                      </h4>
                      <span className="text-xs text-[#6B7280] block mt-0.5">
                        {product.category} • {formatWeight(product.weightInGrams)}
                      </span>
                      <span className="text-sm font-extrabold text-[#1A1A1A] mt-1 block">
                        {formatIDR(product.price)}
                      </span>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F3F4F6]">
                      <div className="flex items-center border border-[#E5E7EB] rounded-full bg-[#F8FAFC] overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#1A1A1A] hover:bg-[#E5E7EB] transition-colors"
                          aria-label="Kurangi kuantitas"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#1A1A1A]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#1A1A1A] hover:bg-[#E5E7EB] transition-colors"
                          aria-label="Tambah kuantitas"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-[#6B7280] hover:text-red-600 p-2 rounded-full transition-colors"
                        aria-label="Hapus dari keranjang"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E5E7EB] bg-[#F8FAFC] space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#E9F3E4] text-[#1E543B] text-xs font-semibold">
              <Gift className="w-4 h-4 flex-shrink-0" />
              <span>Termasuk opsi <strong>Free Gift Wrapping</strong> &amp; kartu ucapan!</span>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-[#6B7280]">
                <span>Item Terpilih ({selectedCount}):</span>
                <span className="font-bold text-[#1A1A1A]">{formatWeight(selectedWeight)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="font-bold text-[#1A1A1A]">Subtotal:</span>
                <span className="font-extrabold text-[#1A1A1A] text-lg">
                  {formatIDR(selectedSubtotal)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className={`w-full flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-full font-bold text-sm transition-colors ${
                selectedCount > 0
                  ? 'bg-[#F5B7A1] hover:bg-[#ED9E84] text-[#1A1A1A]'
                  : 'bg-[#E5E7EB] text-[#6B7280] pointer-events-none'
              }`}
            >
              <span>Checkout ({selectedCount})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
