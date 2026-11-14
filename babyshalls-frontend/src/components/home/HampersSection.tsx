'use client';

import React from 'react';
import Link from 'next/link';
import { mockProducts } from '@/data/mockProducts';
import { WireProductCard } from '@/components/common/WireProductCard';

export const HampersSection: React.FC = () => {
  // Take curated hamper products
  const hampersList = mockProducts.filter((p) => p.category === 'Hampers').slice(0, 4);

  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890';
  const customHamperWaUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Halo BabyShalls, saya ingin bertanya tentang custom hampers kado anak.'
  )}`;

  return (
    <section id="hampers" className="py-12 md:py-16 bg-white w-full">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Section Header */}
        <div className="mb-8 md:mb-10 text-center">
          <h2 className="text-[22px] md:text-[28px] font-semibold uppercase text-[#2B2B2B] tracking-normal mb-2">
            Hampers
          </h2>
          <p className="text-[14px] md:text-[15px] text-[#6B6B6B] max-w-[560px] mx-auto font-normal">
            Pilihan kado buku dan mainan edukasi dalam kotak estetik untuk kelahiran atau ulang tahun si kecil.
          </p>
        </div>

        {/* 4 Hamper Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
          {hampersList.map((product) => (
            <WireProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Action Buttons & Text Link */}
        <div className="mt-10 md:mt-12 flex flex-col items-center gap-4 text-center">
          <Link
            href="/hampers"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#2B2B2B] hover:border-[#D9744A] text-[#2B2B2B] hover:text-[#D9744A] text-[13px] md:text-[14px] font-semibold uppercase tracking-wider rounded-[8px] transition-colors"
          >
            <span>Lihat Semua Hampers</span>
            <img
              src="/images/icons/icon-arrow.svg"
              alt=""
              className="w-4 h-4 object-contain"
            />
          </Link>

          <a
            href={customHamperWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#D9744A] hover:text-[#C25F37] hover:underline transition-colors pt-1"
          >
            <span>Mau hampers custom? Chat kami via WhatsApp →</span>
          </a>
        </div>

      </div>
    </section>
  );
};

