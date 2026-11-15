'use client';

import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ShopByAgeSection } from '../components/home/ShopByAgeSection';
import { VoucherPromoSection } from '../components/home/VoucherPromoSection';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { HampersSection } from '../components/home/HampersSection';
import { EventsSection } from '../components/home/EventsSection';
import { ReviewsSection } from '../components/home/ReviewsSection';
import {
  DEFAULT_HOME_SECTION_ORDER,
  HomeSectionId,
  parseSectionOrder,
  usePublicCms,
} from '../hooks/useCms';

const HOME_SECTION_MAP: Record<HomeSectionId, React.ReactNode> = {
  hero: <HeroSection />,
  shop_by_age: <ShopByAgeSection />,
  voucher_promo: <VoucherPromoSection />,
  new_arrivals: <NewArrivalsSection />,
  hampers: <HampersSection />,
  events: <EventsSection />,
  reviews: <ReviewsSection />,
};

export default function HomePage() {
  const { data: cms } = usePublicCms();
  const order = parseSectionOrder(cms?.home_section_order, DEFAULT_HOME_SECTION_ORDER);

  return (
    <>
      {order.map((sectionId) => (
        <React.Fragment key={sectionId}>{HOME_SECTION_MAP[sectionId]}</React.Fragment>
      ))}
    </>
  );
}
