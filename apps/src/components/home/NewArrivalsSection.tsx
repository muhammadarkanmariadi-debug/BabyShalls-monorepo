'use client';

import React from 'react';
import Link from 'next/link';
import { WireProductCard } from '@/components/common/WireProductCard';
import { useStorefrontProducts } from '@/hooks/useProducts';
import { ArrowRight } from 'lucide-react';

interface NewArrivalsSectionProps {
  initialCategory?: string;
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = () => {
  const { products } = useStorefrontProducts();
  const newArrivals = products.filter((p) => p.isNewArrival);
  const displayProducts = (newArrivals.length > 0 ? newArrivals : products).slice(0, 8);

  return (
    <section id="catalog" className="pt-11 pb-20 bg-white w-full">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <h2 className="text-[28px] sm:text-[32px] font-semibold uppercase text-[#4A2A1C] tracking-tight">
            New Arrivals
          </h2>
        </div>

        {/* 4x2 Responsive Product Grid (Figma: 4 cols desktop, 2 cols mobile, 24px gap) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product) => (
            <WireProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Tautan: Lihat Semua with Arrow */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[#B05A26] hover:text-[#8E431A] text-[16px] font-medium transition-colors group"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
};
