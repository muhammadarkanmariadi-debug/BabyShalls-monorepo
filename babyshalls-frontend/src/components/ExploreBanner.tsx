'use client';

import React from 'react';
import Link from 'next/link';

interface ExploreBannerProps {
  onShopAllClick?: () => void;
}

export const ExploreBanner: React.FC<ExploreBannerProps> = () => {
  return (
    <section className="w-full bg-[#D9744A] min-h-[360px] flex items-center justify-center py-12 md:py-16 text-center">
      <div className="max-w-[1200px] mx-auto px-6 space-y-4">
        {/* One white headline: 36px / 700 */}
        <h2 className="text-[26px] md:text-[36px] font-bold text-white tracking-normal leading-tight">
          PILIHAN TEPAT UNTUK SETIAP FASE USIA
        </h2>

        {/* One short sentence */}
        <p className="text-white/95 text-[15px] md:text-[16px] max-w-[620px] mx-auto font-normal leading-relaxed">
          Temukan buku cerita dan mainan edukasi yang dirancang khusus untuk menemani setiap tahap tumbuh kembang si kecil.
        </p>

        {/* One white button: BELANJA PER USIA */}
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-block bg-white text-[#D9744A] hover:bg-neutral-100 text-[14px] font-semibold uppercase tracking-wider px-8 py-3.5 rounded-[4px] transition-colors"
          >
            BELANJA PER USIA
          </Link>
        </div>
      </div>
    </section>
  );
};
