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

  const formatAge = (age: string) => {
    if (age.includes('0–2') || age.includes('0-2')) return '0-2 th';
    if (age.includes('3–5') || age.includes('3-5')) return '3-5 th';
    if (age.includes('6+')) return '6+ th';
    return age.toLowerCase();
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="catalog" className="py-10 md:py-16 bg-[#FFFFFF] w-full">
      {/* 1200px Max width with 24px side padding */}
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Centered Uppercase Heading Only */}
        <div className="mb-8 md:mb-10 text-center">
          <h2 className="text-[22px] md:text-[28px] font-semibold uppercase text-[#2B2B2B] tracking-normal">
            NEW ARRIVALS
          </h2>
        </div>

        {/* Product Grid: 4 columns across on desktop, 2 on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
          {productsList.map((product) => {
            const isJustAdded = addedId === product.id;
            const hasDiscount = product.discountPercent && product.discountPercent > 0;

            return (
              <div
                key={product.id}
                className="group flex flex-col text-left"
              >
                {/* Flat Gray Square Tile */}
                <div className="relative aspect-square w-full bg-[#F0F0F0] rounded-[6px] overflow-hidden p-4 flex items-center justify-center">
                  <Link href={`/product/${product.id}`} className="block w-full h-full flex items-center justify-center">
                    <img
                      src={product.coverImage}
                      alt={product.title}
                      className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>

                  {/* ONLY ONE BADGE TYPE: Small terracotta discount label */}
                  {hasDiscount && (
                    <div className="absolute top-2.5 left-2.5 pointer-events-none z-10">
                      <span className="bg-[#D9744A] text-white text-[11px] font-semibold px-2 py-0.5 rounded-[4px]">
                        -{product.discountPercent}%
                      </span>
                    </div>
                  )}

                  {/* + Keranjang button on hover only (always visible on mobile) */}
                  <div className="absolute inset-x-3 bottom-3 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, product)}
                      disabled={!product.inStock}
                      className="w-full py-2.5 bg-[#2B2B2B] hover:bg-[#D9744A] disabled:bg-neutral-300 text-white text-[12px] font-semibold uppercase tracking-wider rounded-[4px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      aria-label={`Tambah ${product.title} ke keranjang`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check size={14} strokeWidth={2} />
                          <span>BERHASIL</span>
                        </>
                      ) : (
                        <span>+ KERANJANG</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Metadata Below Image */}
                <div className="mt-3 space-y-0.5">
                  {/* Small age label as plain gray text */}
                  <span className="text-[12px] text-[#6B6B6B] block">
                    {formatAge(product.ageGroup)}
                  </span>

                  {/* Product Title: 15px / weight 500 */}
                  <Link href={`/product/${product.id}`} className="block">
                    <h3 className="text-[15px] font-medium text-[#2B2B2B] line-clamp-1 hover:text-[#D9744A] transition-colors">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Author: small, gray */}
                  <p className="text-[13px] text-[#6B6B6B] line-clamp-1 font-normal">
                    {product.author}
                  </p>

                  {/* Price: 15px / weight 600, old price struck through */}
                  <div className="pt-0.5 flex items-baseline gap-2">
                    <span className="text-[15px] font-semibold text-[#2B2B2B]">
                      {formatIDR(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[13px] text-[#6B6B6B] line-through font-normal">
                        {formatIDR(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Show 'Stok habis' only when sold out */}
                  {!product.inStock && (
                    <span className="text-[12px] text-[#6B6B6B] italic block pt-0.5">
                      Stok habis
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Outline Button: "LIHAT SEMUA" */}
        <div className="mt-10 md:mt-12 text-center">
          <Link
            href="/shop"
            className="inline-block px-8 py-3.5 border border-[#2B2B2B] hover:border-[#D9744A] text-[#2B2B2B] hover:text-[#D9744A] text-[14px] font-semibold uppercase tracking-wider rounded-[4px] transition-colors"
          >
            LIHAT SEMUA
          </Link>
        </div>

      </div>
    </section>
  );
};
