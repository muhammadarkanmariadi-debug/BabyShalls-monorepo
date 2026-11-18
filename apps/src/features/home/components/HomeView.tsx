'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { CampaignBanner } from '@/components/home/CampaignBanner';
import { BannerHampers } from '@/components/home/BannerHampers';
import { UpcomingEventsSection } from '@/components/home/UpcomingEventsSection';
import { RequestAndVisitSection } from '@/components/home/RequestAndVisitSection';
import { OrderDrawer } from '@/components/OrderDrawer';
import { FloatingWhatsApp } from '@/components/common/FloatingWhatsApp';

export function HomeView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#4A2A1C] flex flex-col justify-between selection:bg-[#B05A26]/15 selection:text-[#B05A26] w-full font-sans">
      
      {/* 01 · HEADER (Strip Info + Navbar + Mega Menu) */}

      <main className="w-full flex-grow overflow-x-clip">
        {/* 02 · HERO (Figma Node #130:109) */}
        <HeroSection />

        {/* 03 · PRODUK TERBARU (Figma Node #130:115 - 4x2 grid) */}
        <NewArrivalsSection initialCategory={selectedCategory} />

        {/* 04 · BANNER KAMPANYE (Figma Node #150:1316 - Terracotta #B05A26) */}
        <CampaignBanner onShopAllClick={() => handleCategorySelect('All')} />

        {/* 05 · BANNER HAMPERS (Figma Node #131:38954) */}
        <BannerHampers />

        {/* 06 · EVENT MENDATANG (Figma Node #130:263 - 3 Workshops) */}
        <UpcomingEventsSection />

        {/* 07 · REQUEST & KUNJUNGI (Figma Node #143:1238) */}
        <RequestAndVisitSection />
      </main>

      {/* 08 · FOOTER (Figma Node #130:351) */}

      {/* Side-drawers & Floating Contacts */}
      <OrderDrawer />
      <FloatingWhatsApp />
    </div>
  );
}

