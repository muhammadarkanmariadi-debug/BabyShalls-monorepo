'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatIDR } from '../data/mockProducts';

export const ProductQuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  if (!quickViewProduct) return null;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden bg-[#FFFDF9] text-left transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-[#EDE8E1] rounded-lg p-6 md:p-8 shadow-xl">
          
          {/* Close Button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute right-4 top-4 text-[#68625D] hover:text-[#2C2725] transition-colors p-1 cursor-pointer"
            aria-label="Tutup jendela cepat"
          >
            <X size={18} strokeWidth={1.5} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Cover Image */}
            <div className="md:col-span-5 aspect-[3/4] bg-[#FAF8F5] rounded-md overflow-hidden border border-[#EDE8E1]">
              <img
                src={quickViewProduct.coverImage}
                alt={quickViewProduct.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Right Book Details */}
            <div className="md:col-span-7 space-y-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#E07A5F]">
                {quickViewProduct.category} • {quickViewProduct.ageGroup}
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight text-[#2C2725] leading-snug">
                  {quickViewProduct.title}
                </h3>
                <p className="text-xs text-[#68625D] mt-0.5">
                  Oleh {quickViewProduct.author}
                </p>
              </div>

              <div className="text-lg font-bold text-[#2C2725]">
                {formatIDR(quickViewProduct.price)}
              </div>

              <p className="text-xs text-[#68625D] leading-relaxed line-clamp-4">
                {quickViewProduct.description}
              </p>

              <div className="pt-2 border-t border-[#EDE8E1] flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-[#E07A5F] hover:bg-[#cc654b] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  {isAdded ? (
                    <>
                      <Check size={14} />
                      <span>Berhasil Ditambahkan</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={14} strokeWidth={1.5} />
                      <span>Tambah ke Keranjang</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href={`/product/${quickViewProduct.id}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="py-2.5 border border-[#EDE8E1] hover:border-[#E07A5F] text-[#2C2725] hover:text-[#E07A5F] text-center transition-colors rounded-md font-semibold flex items-center justify-center gap-1"
                  >
                    <span>Detail Lengkap</span>
                    <ArrowRight size={13} />
                  </Link>

                  <Link
                    href={`/request-a-book?title=${encodeURIComponent(quickViewProduct.title)}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="py-2.5 bg-[#E2ECE0] text-[#3A5C37] hover:bg-[#d6e3d4] text-center transition-colors rounded-md font-semibold flex items-center justify-center"
                  >
                    <span>Tanya Stok Toko</span>
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
