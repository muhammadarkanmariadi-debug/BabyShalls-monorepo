'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { mockProducts as defaultMockProducts, formatIDR } from '../data/mockProducts';
import { useCart } from '../context/CartContext';

interface NewArrivalsProps {
  initialCategory?: string;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ initialCategory = 'All' }) => {
  const { searchQuery, addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync with localStorage if admin updated catalog
  const [catalogItems] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('babyshalls_catalog_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return defaultMockProducts;
  });

  const productsList = useMemo(() => {
    let list = catalogItems.filter((item) => {
      // Exclude preloved from new arrivals grid
      if (item.badge === 'Preloved' || item.category === 'Preloved Item') {
        return false;
      }

      if (initialCategory !== 'All' && (item.category as string) !== initialCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.title.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }

      return true;
    });

    // 4 columns across x 2 rows down = exactly 8 products when not expanded
    if (!isExpanded && !searchQuery.trim() && initialCategory === 'All') {
      return list.slice(0, 8);
    }
    return list;
  }, [catalogItems, initialCategory, searchQuery, isExpanded]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="catalog" className="py-14 sm:py-20 md:py-24 bg-[#FFFDF9] border-b border-[#EDE8E1] w-full">
      {/* Full-width container with comfortable edge padding */}
      <div className="w-full px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#EDE8E1] gap-4 text-left">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#E07A5F] block mb-1">
              Curated Selection
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2C2725]">
              New Arrivals
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#68625D] max-w-md">
            Original imported board books, illustrated picture stories, and sensory wooden toys fresh on our shelves.
          </p>
        </div>

        {/* Product Grid: 4 columns across, 2 rows down */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-10 sm:gap-y-12">
          {productsList.map((product) => {
            const isJustAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                className="group relative flex flex-col text-left"
              >
                {/* 3:4 Aspect Ratio Cover Card */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-white rounded-md border border-[#EDE8E1] shadow-xs">
                  <Link href={`/product/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.coverImage}
                      alt={product.title}
                      className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
                      loading="lazy"
                    />
                  </Link>

                  {/* Subtle Badge */}
                  {product.badge && (
                    <div className="absolute top-2.5 left-2.5 pointer-events-none">
                      <span className="bg-[#FFFDF9]/95 text-[#2C2725] border border-[#EDE8E1] text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-xs">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Quick Add to Cart Button (Terracotta / Pastel hover) */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, product)}
                      className={`w-9 h-9 rounded-md flex items-center justify-center shadow-xs cursor-pointer transition-colors ${
                        isJustAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#E07A5F] hover:bg-[#cc654b] text-white'
                      }`}
                      aria-label={`Add ${product.title} to bag`}
                      title="Add to Bag"
                    >
                      {isJustAdded ? (
                        <Check size={16} strokeWidth={2} />
                      ) : (
                        <ShoppingBag size={15} strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Metadata Below Image */}
                <div className="mt-3.5 space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-[#68625D] font-medium flex items-center justify-between">
                    <span>{product.category}</span>
                    <span>{product.ageGroup}</span>
                  </div>

                  <Link href={`/product/${product.id}`} className="block">
                    <h3 className="text-sm font-semibold text-[#2C2725] line-clamp-1 group-hover:text-[#E07A5F] transition-colors">
                      {product.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#68625D] line-clamp-1 font-normal">
                    {product.author}
                  </p>

                  <div className="pt-0.5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#2C2725]">
                      {formatIDR(product.price)}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-medium">
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Button: "Lihat Selengkapnya" */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-[#EDE8E1] hover:border-[#E07A5F] text-[#2C2725] hover:text-[#E07A5F] text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-md transition-all shadow-xs"
          >
            <span>Lihat Selengkapnya di Toko</span>
            <ArrowRight size={15} strokeWidth={1.5} />
          </Link>
        </div>

      </div>
    </section>
  );
};
