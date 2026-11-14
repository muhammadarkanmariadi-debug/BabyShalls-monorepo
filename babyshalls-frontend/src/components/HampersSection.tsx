'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { mockProducts } from '@/data/mockProducts';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

export const HampersSection: React.FC = () => {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  // Take the 3 curated hamper products
  const hampersList = mockProducts.filter((p) => p.category === 'Hampers').slice(0, 3);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  };

  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890';
  const customHamperWaUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Halo BabyShalls, saya ingin bertanya tentang custom hampers kado anak.'
  )}`;

  return (
    <section id="hampers" className="py-10 md:py-16 bg-[#FFFFFF] w-full">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Centered Uppercase Heading & Single Short Sentence */}
        <div className="mb-8 md:mb-10 text-center">
          <h2 className="text-[22px] md:text-[28px] font-semibold uppercase text-[#2B2B2B] tracking-normal mb-2">
            HAMPERS
          </h2>
          <p className="text-[14px] md:text-[16px] text-[#6B6B6B] max-w-[560px] mx-auto font-normal">
            Paket kado pilihan berisi buku cerita dan mainan edukasi untuk momen berharga si kecil.
          </p>
        </div>

        {/* 3 Ready-Made Hamper Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {hampersList.map((product) => {
            const isJustAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                className="group flex flex-col text-left"
              >
                {/* Flat Gray Square Tile */}
                <div className="relative aspect-square w-full bg-[#F0F0F0] rounded-[6px] overflow-hidden p-6 flex items-center justify-center">
                  <Link href={`/product/${product.id}`} className="block w-full h-full flex items-center justify-center">
                    <img
                      src={product.coverImage}
                      alt={product.title}
                      className="max-h-[88%] max-w-[88%] object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>

                  {/* + Keranjang on hover on desktop, always visible on mobile */}
                  <div className="absolute inset-x-4 bottom-4 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, product)}
                      disabled={!product.inStock}
                      className="w-full py-2.5 bg-[#2B2B2B] hover:bg-[#D9744A] disabled:bg-neutral-300 text-white text-[12px] font-semibold uppercase tracking-wider rounded-[4px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      aria-label={`Tambah ${product.title} ke keranjang`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check size={14} strokeWidth={2} />
                          <span>BERHASIL</span>
                        </>
                      ) : (
                        <span>+ KERANJANG</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Below Tile Metadata */}
                <div className="mt-3 flex flex-col">
                  {/* Items summary */}
                  <span className="text-[12px] text-[#6B6B6B] font-normal line-clamp-1">
                    {product.pages || 'Paket Buku & Mainan'}
                  </span>

                  {/* Title */}
                  <Link href={`/product/${product.id}`} className="group-hover:text-[#D9744A] transition-colors">
                    <h3 className="text-[15px] font-medium text-[#2B2B2B] mt-0.5 line-clamp-1">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Price */}
                  <p className="text-[15px] font-semibold text-[#2B2B2B] mt-1">
                    {formatRupiah(product.price)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Text link for Custom Hampers */}
        <div className="mt-10 text-center">
          <a
            href={customHamperWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#D9744A] hover:underline transition-colors"
          >
            <span>Mau hampers custom? Chat kami via WhatsApp</span>
            <ArrowRight size={14} />
          </a>
        </div>

      </div>
    </section>
  );
};
