'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, ShoppingBag, Eye, Check, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Header } from '../../src/components/Header';
import { Footer } from '../../src/components/Footer';
import { OrderDrawer } from '../../src/components/OrderDrawer';
import { ProductQuickViewModal } from '../../src/components/ProductQuickViewModal';
import { mockProducts as defaultMockProducts, formatIDR } from '../../src/data/mockProducts';
import { useCart } from '../../src/context/CartContext';
import { Product } from '../../src/types';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category');
  const initialSearchParam = searchParams.get('q');

  const { searchQuery, setSearchQuery, addToCart, setQuickViewProduct } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  // Load catalog items (synced with admin if modified in localStorage)
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

  const [activeCategory, setActiveCategory] = useState<string>(initialCategoryParam || 'All');
  const [activeAge, setActiveAge] = useState<string>('All');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [localSearch, setLocalSearch] = useState<string>(initialSearchParam || searchQuery || '');

  const categories = [
    'All',
    'Board Books',
    'Picture Books',
    'Educational Toys',
    'Hampers',
    'Preloved Item'
  ];

  const ageGroups = ['All', '0–2 Years', '3–5 Years', '6+ Years'];

  const filteredAndSortedProducts = useMemo(() => {
    let result = catalogItems.filter((product) => {
      // Stock filter
      if (onlyInStock && !product.inStock) return false;

      // Category filter
      if (activeCategory !== 'All' && product.category !== activeCategory) {
        return false;
      }

      // Age group filter
      if (activeAge !== 'All' && product.ageGroup !== activeAge && product.ageGroup !== 'All Ages') {
        return false;
      }

      // Search filter
      const q = localSearch.toLowerCase().trim();
      if (q) {
        const matches =
          product.title.toLowerCase().includes(q) ||
          product.author.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'featured':
      default:
        // maintain default sequence
        break;
    }

    return result;
  }, [catalogItems, activeCategory, activeAge, onlyInStock, localSearch, sortBy]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="w-full">
      {/* Page Title & Breadcrumb */}
      <div className="bg-[#FAF8F5] border-b border-[#EDE8E1] py-8 sm:py-12">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <nav className="text-xs text-[#68625D] mb-3 flex items-center gap-2">
            <Link href="/" className="hover:text-[#E07A5F] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#2C2725] font-medium">Toko</span>
            {activeCategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-[#E07A5F] font-semibold">{activeCategory}</span>
              </>
            )}
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2C2725]">
                {activeCategory === 'All' ? 'Katalog Buku & Mainan' : activeCategory}
              </h1>
              <p className="text-xs sm:text-sm text-[#68625D] mt-1 max-w-xl">
                Buku bantal bertekstur, board books impor klasik, dan mainan kayu Montessori terkurasi dengan standar keamanan tinggi.
              </p>
            </div>
            <div className="text-xs text-[#68625D]">
              Menampilkan <span className="font-semibold text-[#2C2725]">{filteredAndSortedProducts.length}</span> produk
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        {/* Filter Controls Bar */}
        <div className="space-y-5 pb-8 mb-8 border-b border-[#EDE8E1]">
          {/* Top Filter Row: Search & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#68625D]" />
              <input
                type="text"
                placeholder="Cari judul buku, penulis, atau kata kunci..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setSearchQuery(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#EDE8E1] rounded-md text-[#2C2725] placeholder-[#8C8782] focus:outline-none focus:border-[#E07A5F] shadow-2xs"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    setSearchQuery('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#68625D] hover:text-[#2C2725]"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Sort & In-Stock Options */}
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <label className="flex items-center gap-2 text-xs text-[#68625D] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-[#EDE8E1] text-[#E07A5F] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#E07A5F]"
                />
                <span>Hanya Tersedia</span>
              </label>

              <div className="flex items-center gap-1.5 bg-white border border-[#EDE8E1] rounded-md px-3 py-2 text-xs text-[#2C2725]">
                <ArrowUpDown size={13} className="text-[#68625D]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent focus:outline-none cursor-pointer font-medium"
                >
                  <option value="featured">Paling Populer</option>
                  <option value="price-asc">Harga: Rendah ke Tinggi</option>
                  <option value="price-desc">Harga: Tinggi ke Rendah</option>
                  <option value="name-asc">Nama: A ke Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories Filter Pills */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#68625D] mb-2.5">
              Kategori Produk:
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#E07A5F] text-white shadow-2xs'
                      : 'bg-white border border-[#EDE8E1] text-[#68625D] hover:border-[#E07A5F] hover:text-[#E07A5F]'
                  }`}
                >
                  {cat === 'All' ? 'Semua Kategori' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group Filter Pills */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#68625D] mb-2.5">
              Kelompok Usia:
            </div>
            <div className="flex flex-wrap gap-2">
              {ageGroups.map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setActiveAge(age)}
                  className={`text-xs px-3.5 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    activeAge === age
                      ? 'bg-[#E2ECE0] text-[#3A5C37] border border-[#C7DAC3] shadow-2xs'
                      : 'bg-white border border-[#EDE8E1] text-[#68625D] hover:border-[#3A5C37]'
                  }`}
                >
                  {age === 'All' ? 'Semua Usia' : age}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#EDE8E1] flex items-center justify-center mx-auto text-[#68625D]">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#2C2725]">Tidak Ada Produk Ditemukan</h3>
            <p className="text-xs sm:text-sm text-[#68625D] max-w-sm mx-auto">
              Tidak ada buku atau mainan yang cocok dengan filter atau kata kunci Anda. Coba reset filter atau ajukan request buku.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('All');
                  setActiveAge('All');
                  setOnlyInStock(false);
                  setLocalSearch('');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-white border border-[#EDE8E1] rounded-md text-xs font-semibold text-[#2C2725] hover:border-[#E07A5F]"
              >
                Reset Semua Filter
              </button>
              <Link
                href="/request-a-book"
                className="px-5 py-2.5 bg-[#E07A5F] text-white rounded-md text-xs font-semibold hover:bg-[#cc654b]"
              >
                Request Buku Khusus
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-10 sm:gap-y-12">
            {filteredAndSortedProducts.map((product) => {
              const isJustAdded = addedId === product.id;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between text-left transition-all"
                >
                  <div>
                    {/* Book Cover Container with 3:4 aspect ratio */}
                    <div className="relative aspect-[3/4] w-full bg-[#FAF8F5] rounded-md overflow-hidden border border-[#EDE8E1] group-hover:border-[#E07A5F] transition-colors mb-4 shadow-2xs">
                      <Link href={`/product/${product.id}`} className="block w-full h-full">
                        <img
                          src={product.coverImage}
                          alt={product.title}
                          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                          loading="lazy"
                        />
                      </Link>

                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        {product.badge && (
                          <span className="bg-[#FFFDF9]/95 border border-[#EDE8E1] text-[#E07A5F] text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider shadow-2xs">
                            {product.badge}
                          </span>
                        )}
                        {product.category === 'Preloved Item' && (
                          <span className="bg-[#E2ECE0] text-[#3A5C37] text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider shadow-2xs">
                            Preloved
                          </span>
                        )}
                      </div>

                      {/* Floating Quick Action Buttons */}
                      <div className="absolute bottom-2.5 inset-x-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <button
                          type="button"
                          onClick={() => setQuickViewProduct(product)}
                          className="flex-1 py-2 bg-white/95 hover:bg-white text-[#2C2725] hover:text-[#E07A5F] text-[11px] font-semibold rounded-sm border border-[#EDE8E1] shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          aria-label="Lihat cepat"
                        >
                          <Eye size={13} strokeWidth={1.5} />
                          <span>Quick View</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(e, product)}
                          className={`p-2 rounded-sm shadow-xs transition-colors cursor-pointer ${
                            isJustAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#E07A5F] hover:bg-[#cc654b] text-white'
                          }`}
                          aria-label="Tambah ke keranjang"
                          title="Tambah ke Keranjang"
                        >
                          {isJustAdded ? (
                            <Check size={14} strokeWidth={2} />
                          ) : (
                            <ShoppingBag size={14} strokeWidth={1.5} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Metadata & Typography */}
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-wider text-[#68625D]">
                        {product.category} • {product.ageGroup}
                      </div>

                      <Link href={`/product/${product.id}`} className="block">
                        <h3 className="text-sm font-semibold text-[#2C2725] line-clamp-1 group-hover:text-[#E07A5F] transition-colors">
                          {product.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-[#68625D] line-clamp-1 font-normal">
                        {product.author}
                      </p>

                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-sm font-bold text-[#2C2725]">
                          {formatIDR(product.price)}
                        </span>
                        <span className="text-[10px] text-emerald-800 font-medium">
                          {product.inStock ? 'Tersedia' : 'Habis'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2C2725] flex flex-col justify-between selection:bg-[#E07A5F]/20 selection:text-[#E07A5F] w-full">
      <Header />
      <main className="flex-grow w-full">
        <Suspense fallback={<div className="p-12 text-center text-sm text-[#68625D]">Memuat katalog...</div>}>
          <ShopContent />
        </Suspense>
      </main>
      <Footer />
      <OrderDrawer />
      <ProductQuickViewModal />
    </div>
  );
}

