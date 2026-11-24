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
    <section
      className="w-full min-h-[360px] sm:h-[390px] flex items-center justify-center text-white text-center relative overflow-hidden px-6"
      style={{ backgroundColor: banner.ageBannerBgColor || '#B05A26' }}
    >
      {banner.ageBannerImage && (
        <img
          src={banner.ageBannerImage}
          alt={banner.ageBannerTitle}
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />
      )}
      <div className="relative z-10 max-w-[620px] mx-auto flex flex-col items-center space-y-4">
        {/* Headline */}
        <h2 className="text-[28px] sm:text-[32px] font-medium leading-[1.25] tracking-tight text-white">
          {banner.ageBannerTitle || 'Find books suited for your child’s age'}
        </h2>

        {/* Subtext */}
        <p className="text-[16px] sm:text-[18px] text-white/95 leading-[1.5] max-w-[480px]">
          {banner.ageBannerSubtitle || 'From newborns to 6+ years, discover the right books and educational toys.'}
        </p>

        {/* CTA Button */}
        <div className="pt-2">
          <Link
            href="/shop?tab=usia"
            onClick={onShopAllClick}
            className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-[#B05A26] hover:bg-[#FFFBF5] text-[16px] font-medium tracking-wide uppercase rounded-[2px] transition-all shadow-xs"
          >
            {banner.ageBannerButtonText || 'SHOP BY AGE'}
          </Link>
        </div>
      </div>
    </section>
  );
};
