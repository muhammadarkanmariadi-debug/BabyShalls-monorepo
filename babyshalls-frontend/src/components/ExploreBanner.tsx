'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ExploreBannerProps {
  onShopAllClick?: () => void;
}

export const ExploreBanner: React.FC<ExploreBannerProps> = ({ onShopAllClick }) => {
  const handleClick = () => {
    if (onShopAllClick) {
      onShopAllClick();
    } else {
      const el = document.getElementById('catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-[#E2ECE0] border-y border-[#C7DAC3] py-20 sm:py-28 md:py-32 overflow-hidden text-center">
      {/* Full-bleed content container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#2C2725] leading-[1.18] max-w-3xl mx-auto">
          Jelajahi Koleksi Lengkap Buku &amp; Mainan BabyShalls
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-[#554F49] max-w-2xl mx-auto leading-relaxed font-normal">
          Buku bantal bertekstur untuk bayi baru lahir, buku dongeng sebelum tidur, dan mainan kayu Montessori alami yang aman untuk si kecil.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#E07A5F] hover:bg-[#cc654b] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider px-9 py-4 rounded-md transition-all shadow-xs"
          >
            <span>Lihat Semua Produk</span>
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>

          <Link
            href="/request-a-book"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FFFDF9] border border-[#C7DAC3] text-[#2C2725] hover:text-[#E07A5F] text-xs sm:text-sm font-semibold uppercase tracking-wider px-8 py-4 rounded-md transition-all shadow-xs"
          >
            <span>Request Buku</span>
          </Link>
        </div>

      </div>
    </section>
  );
};
