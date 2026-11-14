'use client';

import React from 'react';
import Link from 'next/link';

interface CampaignBannerProps {
  onShopAllClick?: () => void;
}

export const CampaignBanner: React.FC<CampaignBannerProps> = ({ onShopAllClick }) => {
  return (
    <section className="w-full bg-[#D9744A] py-14 sm:py-16 md:py-20 transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-[560px] mx-auto text-center text-white space-y-4">
          
          {/* Main Headline */}
          <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold leading-tight tracking-tight text-white">
            Cari buku sesuai usia si kecil
          </h2>

          {/* Subtitle */}
          <p className="text-[15px] sm:text-[17px] md:text-[18px] text-white/95 leading-relaxed font-normal">
            Dari newborn sampai 6+ tahun, pilih buku dan mainan yang pas.
          </p>

          {/* Action Button */}
          <div className="pt-3">
            <Link
              href="/shop"
              onClick={onShopAllClick}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white hover:bg-[#FBE8DF] text-[#D9744A] text-[13px] md:text-[14px] font-semibold uppercase tracking-wider rounded-full transition-all shadow-sm cursor-pointer hover:scale-102"
            >
              <span>BELANJA PER USIA</span>
              <img
                src="/images/icons/icon-arrow.svg"
                alt=""
                className="w-4 h-4 object-contain"
              />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

