'use client';

import React, { useState } from 'react';
import { Header } from '../src/components/Header';
import { Hero } from '../src/components/Hero';
import { NewArrivals } from '../src/components/NewArrivals';
import { ExploreBanner } from '../src/components/ExploreBanner';
import { HampersSection } from '../src/components/HampersSection';
import { EventsSection } from '../src/components/EventsSection';
import { Footer } from '../src/components/Footer';
import { OrderDrawer } from '../src/components/OrderDrawer';

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
    <div className="min-h-screen bg-[#FFFDF9] text-[#2C2725] flex flex-col justify-between selection:bg-[#E07A5F]/20 selection:text-[#E07A5F] w-full overflow-x-hidden">
      
      {/* NAVBAR (With uploaded BabyShallsLogo 1.PNG, exact required links order) */}
      <Header onCategorySelect={handleCategorySelect} />

      <main className="w-full flex-grow">
        {/* 1. HERO (Full 1 section, auto-slide, uploadable/manageable via admin) */}
        <Hero />

        {/* 2. NEW ARRIVALS (Grid 4 across x 2 rows down = 8 products + "Lihat Selengkapnya" button) */}
        <NewArrivals initialCategory={selectedCategory} />

        {/* 3. BANNER CTA (Full 1 page / section inviting to explore all BabyShalls products) */}
        <ExploreBanner onShopAllClick={() => handleCategorySelect('All')} />

        {/* 4. HAMPERS (Dedicated section inviting parents & families to create bespoke hampers) */}
        <HampersSection />

        {/* 5. EVENT AND WORKSHOP (Story sessions, nature craft, sensory play) */}
        <EventsSection />
      </main>

      {/* FOOTER (Clean 4-column layout with uploaded logo) */}
      <Footer />

      {/* Slide-over Shopping Bag & Checkout */}
      <OrderDrawer />
    </div>
  );
}
