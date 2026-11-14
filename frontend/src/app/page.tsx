import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ShopByAgeSection } from '../components/home/ShopByAgeSection';
import { VoucherPromoSection } from '../components/home/VoucherPromoSection';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { HampersSection } from '../components/home/HampersSection';
import { EventsSection } from '../components/home/EventsSection';
import { ReviewsSection } from '../components/home/ReviewsSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ShopByAgeSection />
      <VoucherPromoSection />
      <NewArrivalsSection />
      <HampersSection />
      <EventsSection />
      <ReviewsSection />
    </>
  );
}
