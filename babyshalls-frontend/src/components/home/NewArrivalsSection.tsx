'use client';

import React from 'react';
import Link from 'next/link';
import { mockProducts } from '@/data/mockProducts';
import { WireProductCard } from '@/components/common/WireProductCard';
import { useCart } from '@/context/CartContext';

interface NewArrivalsSectionProps {
  initialCategory?: string;
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({
  initialCategory = 'All',
}) => {
  const { searchQuery } = useCart();

  // Filter 8 products for New Arrivals
  let productsList = mockProducts.filter((p) => p.category !== 'Hampers');

  if (initialCategory && initialCategory !== 'All') {
    productsList = productsList.filter((p) => p.category === initialCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    productsList = productsList.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.author && p.author.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
    );
  }

  // Display 8 products (4 across x 2 rows down on desktop)
  const displayProducts = productsList.slice(0, 8);

  return (
    <section id="catalog" className="py-12 md:py-16 bg-white w-full">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Section Header */}
        <div className="mb-8 md:mb-10 text-center">
          <h2 className="text-[22px] md:text-[28px] font-semibold uppercase text-[#2B2B2B] tracking-normal">
            New Arrivals
          </h2>
        </div>

        {/* 4x2 Responsive Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
          {displayProducts.map((product) => (
            <WireProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Button: Lihat Semua with Figma Arrow */}
        <div className="mt-10 md:mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#2B2B2B] hover:border-[#D9744A] text-[#2B2B2B] hover:text-[#D9744A] text-[13px] md:text-[14px] font-semibold uppercase tracking-wider rounded-[8px] transition-colors"
          >
            <span>Lihat Semua</span>
            <img
              src="/images/icons/icon-arrow.svg"
              alt=""
              className="w-4 h-4 object-contain"
            />
          </Link>
        </div>

      </div>
    </section>
  );
};

