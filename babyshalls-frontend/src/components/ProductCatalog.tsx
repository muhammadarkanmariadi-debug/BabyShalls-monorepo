'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { mockProducts as defaultMockProducts, formatIDR } from '../data/mockProducts';
import { useCart } from '../context/CartContext';

interface ProductCatalogProps {
  initialCategory?: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ initialCategory }) => {
  const { searchQuery, addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  // Load products (synced with admin if modified)
  const [catalogItems] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('babyshalls_catalog_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // fallback
      }
    }
    return defaultMockProducts;
  });

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'All');
  const [activeAge, setActiveAge] = useState<string>('All');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  const categories = ['All', 'Board Books', 'Picture Books', 'Educational Toys', 'Hampers'];
  const ageGroups = ['All', '0–2 Years', '3–5 Years', '6+ Years'];

  const filteredProducts = useMemo(() => {
    return catalogItems.filter((product) => {
      // In-stock
      if (onlyInStock && !product.inStock) return false;

      // Category
      if (activeCategory !== 'All' && product.category !== activeCategory) {
        return false;
      }

      // Age Group
      if (activeAge !== 'All' && product.ageGroup !== activeAge && product.ageGroup !== 'All Ages') {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          product.title.toLowerCase().includes(q) ||
          (product.author || product.authorOrBrand || '').toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [catalogItems, activeCategory, activeAge, onlyInStock, searchQuery]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section className="bg-white py-16 md:py-24 border-b border-[#EAE6DF]" id="catalog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#EAE6DF] pb-6 mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#221F1F]">
              Curated Catalog
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-1">
              Showing {filteredProducts.length} certified {filteredProducts.length === 1 ? 'item' : 'items'}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* In-stock toggle */}
          <label className="flex items-center gap-2 text-xs text-[#666666] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="w-4 h-4 accent-[#C86D51] rounded border-gray-300"
            />
            <span className="font-medium text-[#221F1F]">In-Stock Only</span>
          </label>
        </div>

        {/* Filter Navigation: Categories & Age Groups */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 text-sm">
          {/* Categories with Orange underline on active */}
          <div className="flex items-center gap-6 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap transition-colors pb-1 font-medium cursor-pointer ${
                    isActive
                      ? 'text-[#C86D51] border-b-2 border-[#C86D51]'
                      : 'text-[#666666] hover:text-[#221F1F]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Age Filters with Orange active badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider text-[#666666] mr-1">Age:</span>
            {ageGroups.map((age) => {
              const isActive = activeAge === age;
              return (
                <button
                  key={age}
                  onClick={() => setActiveAge(age)}
                  className={`text-xs px-3 py-1 border rounded-md transition-colors cursor-pointer font-medium ${
                    isActive
                      ? 'border-[#C86D51] bg-[#C86D51] text-white'
                      : 'border-[#EAE6DF] text-[#666666] hover:border-[#C86D51] hover:text-[#C86D51]'
                  }`}
                >
                  {age}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Column Product Grid (desktop), 2-Column (mobile) */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-base text-[#221F1F] font-medium">No products match your criteria.</p>
            <p className="text-xs text-[#666666] mt-1">Try resetting the category or search filters.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setActiveAge('All');
                setOnlyInStock(false);
              }}
              className="mt-6 text-xs uppercase tracking-wider text-[#C86D51] hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white border border-[#EAE6DF] rounded-md p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-md transition-all relative"
              >
                <div>
                  {/* 3:4 Aspect Ratio Image Container */}
                  <Link
                    href={`/product/${product.id}`}
                    className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#F5F5F5] block"
                  >
                    <img
                      src={product.coverImage || product.images?.[0] || '/images/prod-boardbook.jpg'}
                      alt={product.title}
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-white/95 text-[#221F1F] border border-[#EAE6DF] text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-xs">
                          {product.badge}
                        </span>
                      </div>
                    )}

                    {!product.inStock && (
                      <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                        <span className="text-xs uppercase tracking-wider font-semibold text-[#221F1F] border border-[#221F1F] px-2.5 py-1 bg-white">
                          Sold Out
                        </span>
                      </div>
                    )}

                    {/* Quick Add Orange Button on Hover */}
                    {product.inStock && (
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="absolute bottom-2.5 right-2.5 p-2 rounded-md bg-[#C86D51] text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-[#b2583d] cursor-pointer"
                        title="Add to Cart"
                        aria-label="Add to Cart"
                      >
                        {addedId === product.id ? (
                          <Check size={16} strokeWidth={2} />
                        ) : (
                          <ShoppingBag size={16} strokeWidth={1.5} />
                        )}
                      </button>
                    )}
                  </Link>

                  {/* Metadata Below Image */}
                  <div className="mt-3 space-y-1 text-left">
                    <div className="text-[11px] uppercase tracking-wider text-[#666666]">
                      {product.category}
                    </div>

                    <Link href={`/product/${product.id}`} className="block">
                      <h3 className="text-sm font-semibold text-[#221F1F] line-clamp-1 group-hover:text-[#C86D51] transition-colors">
                        {product.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#666666] line-clamp-1">
                      {product.author || product.authorOrBrand}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="pt-2 mt-2 border-t border-[#F5F5F5] flex items-center justify-between text-left">
                  <p className="text-sm font-bold text-[#C86D51]">
                    {formatIDR(product.price)}
                  </p>
                  <span className="text-[11px] text-[#666666]">
                    {product.ageGroup}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
