'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStorefrontProducts } from '../../hooks/useProducts';
import { ProductCard } from '../product/ProductCard';

type HomeProductTab = 'new' | 'bestseller' | 'preloved';

export const NewArrivalsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HomeProductTab>('new');
  const { products } = useStorefrontProducts();

  const displayProducts =
    activeTab === 'new'
      ? products.filter((p) => p.isNewArrival).slice(0, 4)
      : activeTab === 'bestseller'
      ? [...products].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 4)
      : products.filter((p) => p.isPreloved).slice(0, 4);

  return (
    <section className="w-full bg-white py-12 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'new', label: 'New In!' },
              { id: 'bestseller', label: 'Produk Terlaris' },
              { id: 'preloved', label: 'Preloved Kurasi' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as HomeProductTab)}
                className={`min-h-[42px] px-5 rounded-full text-sm font-bold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-[#F8FAFC] text-[#4A4A4A] hover:bg-[#FAF4E8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Link
            href="/catalog"
            className="text-sm font-semibold text-[#1A1A1A] underline underline-offset-4 hover:text-[#1E543B]"
          >
            Lihat Semua Katalog →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
