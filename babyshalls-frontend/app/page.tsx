'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { CampaignBanner } from '@/components/home/CampaignBanner';
import { HampersSection } from '@/components/home/HampersSection';
import { UpcomingEventsSection } from '@/components/home/UpcomingEventsSection';
import { Footer } from '@/components/layout/Footer';
import { OrderDrawer } from '@/components/OrderDrawer';
import { FloatingWhatsApp } from '@/components/common/FloatingWhatsApp';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#2B2B2B] flex flex-col justify-between selection:bg-[#D9744A]/15 selection:text-[#D9744A] w-full overflow-x-hidden font-sans">
      
      {/* 01 · HEADER (Strip Info + Navbar + Mega Menu) */}
      <Header onCategorySelect={handleCategorySelect} />

      <main className="w-full flex-grow">
        {/* 02 · HERO (1440x560 auto-sliding carousel) */}
        <HeroSection />

        {/* 03 · PRODUK TERBARU (New Arrivals 4x2 grid with WireProductCard) */}
        <NewArrivalsSection initialCategory={selectedCategory} />

        {/* 04 · BANNER KAMPANYE (Terracotta CMS Banner 320px) */}
        <CampaignBanner onShopAllClick={() => handleCategorySelect('All')} />

        {/* 05 · HAMPERS (Curated 4-column Hamper grid + Custom WA link) */}
        <HampersSection />

        {/* 06 · EVENT MENDATANG (3 Event Cards with WireEventCard + Registration modal) */}
        <UpcomingEventsSection />
      </main>

      {/* 07 · FOOTER (5-column desktop + mobile accordions + WA community) */}
      <Footer />

      {/* Side-drawers & Floating Contacts */}
      <OrderDrawer />
      <FloatingWhatsApp />
    </div>
  );
}
