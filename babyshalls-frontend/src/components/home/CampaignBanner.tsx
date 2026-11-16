'use client';

import React from 'react';
import Link from 'next/link';
import { useCms } from '@/context/CmsContext';

interface CampaignBannerProps {
  onShopAllClick?: () => void;
}

export const CampaignBanner: React.FC<CampaignBannerProps> = ({ onShopAllClick }) => {
  const { cms } = useCms();
  const banner = cms.home;

  return (
    <section className="w-full bg-[#B05A26] min-h-[360px] sm:h-[390px] flex items-center justify-center text-white text-center relative overflow-hidden px-6">
      <div className="max-w-[620px] mx-auto flex flex-col items-center space-y-4">
        {/* Headline */}
        <h2 className="text-[28px] sm:text-[32px] font-medium leading-[1.25] tracking-tight text-white">
          {banner.ageBannerTitle || 'Cari buku sesuai usia si kecil'}
        </h2>

        {/* Subtext */}
        <p className="text-[16px] sm:text-[18px] text-white/95 leading-[1.5] max-w-[480px]">
          {banner.ageBannerSubtitle || 'Dari newborn sampai 6+ tahun, pilih buku dan mainan yang pas.'}
        </p>

        {/* CTA Button */}
        <div className="pt-2">
          <Link
            href="/shop?tab=usia"
            onClick={onShopAllClick}
            className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-[#B05A26] hover:bg-[#FFFBF5] text-[16px] font-medium tracking-wide uppercase rounded-[2px] transition-all shadow-xs"
          >
            {banner.ageBannerButtonText || 'BELANJA PER USIA'}
          </Link>
        </div>
      </div>
    </section>
  );
};
