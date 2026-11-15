'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CampaignBanner } from '@/components/home/CampaignBanner';
import { TombolKembali } from '@/components/common/TombolKembali';
import { WireProductCard } from '@/components/common/WireProductCard';
import { mockProducts as defaultMockProducts } from '@/data/mockProducts';
import { Product } from '@/types';
import { ChevronDown, X, SlidersHorizontal, RotateCcw } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category');
  const initialAgeParam = searchParams.get('age');
  const initialSearchParam = searchParams.get('q');

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

  // State Filters
  const [activeSubcategory, setActiveSubcategory] = useState<string>('Semua');
  const [activeCategory, setActiveCategory] = useState<string>(initialCategoryParam || 'Semua Kategori');
  const [selectedAge, setSelectedAge] = useState<string>(initialAgeParam || 'Semua');
  const [selectedCondition, setSelectedCondition] = useState<string>('Semua');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<'terbaru' | 'harga-rendah' | 'harga-tinggi' | 'nama'>('terbaru');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchParam || '');
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // Sub-categories list matching Figma
  const subCategories = [
    'Semua',
    'Board Book',
    'Picture Book',
    'Buku Aktivitas',
    'Chapter Book',
    'Buku Impor',
    'Buku Lokal'
  ];

  // Age options matching Figma
  const ageOptions = ['Semua', '0–1 th', '1–3 th', '3+ th', '6+ th'];

  // Categories for checkboxes
  const categoryOptions = [
    'Semua Kategori',
    'Board Books',
    'Picture Books',
    'Educational Toys',
    'Hampers',
    'Preloved Item'
  ];

  // Condition options
  const conditionOptions = ['Semua', 'Baru', 'Preloved'];

  // Reset all filters
  const resetFilters = () => {
    setActiveSubcategory('Semua');
    setActiveCategory('Semua Kategori');
    setSelectedAge('Semua');
    setSelectedCondition('Semua');
    setOnlyInStock(false);
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    setSortBy('terbaru');
  };

  // Check if any filter is active
  const hasActiveFilters =
    activeSubcategory !== 'Semua' ||
    activeCategory !== 'Semua Kategori' ||
    selectedAge !== 'Semua' ||
    selectedCondition !== 'Semua' ||
    onlyInStock ||
    minPrice !== '' ||
    maxPrice !== '' ||
    searchQuery !== '';

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = catalogItems.filter((product) => {
      // Stock filter
      if (onlyInStock && !product.inStock) return false;

      // Category filter
      if (activeCategory !== 'Semua Kategori' && product.category !== activeCategory) {
        return false;
      }

      // Subcategory / Tag filter
      if (activeSubcategory !== 'Semua') {
        const titleLower = product.title.toLowerCase();
        const catLower = (product.category || '').toLowerCase();
        const subLower = activeSubcategory.toLowerCase();

        if (subLower === 'board book' && !catLower.includes('board') && !titleLower.includes('board')) return false;
        if (subLower === 'picture book' && !catLower.includes('picture') && !titleLower.includes('picture')) return false;
        if (subLower === 'buku aktivitas' && !catLower.includes('aktivitas') && !titleLower.includes('activity') && !titleLower.includes('aktivitas')) return false;
        if (subLower === 'buku impor' && !product.tags?.includes('impor') && !product.author?.match(/[a-z]/i)) return false;
        if (subLower === 'buku lokal' && !product.tags?.includes('lokal')) return false;
      }

      // Age filter
      if (selectedAge !== 'Semua') {
        const pAge = product.ageGroup || '';
        if (selectedAge === '0–1 th' && !pAge.includes('0–1') && !pAge.includes('0–2') && !pAge.toLowerCase().includes('newborn')) return false;
        if (selectedAge === '1–3 th' && !pAge.includes('1–3') && !pAge.includes('1-3')) return false;
        if (selectedAge === '3+ th' && !pAge.includes('3–5') && !pAge.includes('3+')) return false;
        if (selectedAge === '6+ th' && !pAge.includes('6+')) return false;
      }

      // Condition filter
      if (selectedCondition !== 'Semua') {
        const isPre = product.category === 'Preloved Item' || product.condition === 'preloved';
        if (selectedCondition === 'Baru' && isPre) return false;
        if (selectedCondition === 'Preloved' && !isPre) return false;
      }

      // Price range
      if (minPrice && product.price < Number(minPrice)) return false;
      if (maxPrice && product.price > Number(maxPrice)) return false;

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          product.title.toLowerCase().includes(q) ||
          (product.author || product.authorOrBrand || '').toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });

    // Sort
    switch (sortBy) {
      case 'harga-rendah':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'harga-tinggi':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'nama':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'terbaru':
      default:
        // maintain list
        break;
    }

    return result;
  }, [
    catalogItems,
    onlyInStock,
    activeCategory,
    activeSubcategory,
    selectedAge,
    selectedCondition,
    minPrice,
    maxPrice,
    searchQuery,
    sortBy,
  ]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col font-sans">
      <Header />
      <TombolKembali fallbackUrl="/" label="Kembali ke Beranda" />

      {/* Header Kategori Banner (Figma Node #133:332) */}
      <section className="bg-[#FFF6EA] py-8 sm:py-10 border-b border-[#F2E4D6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          {/* Breadcrumbs */}
          <div className="text-[13px] text-[#7A5644] mb-3">
            <Link href="/" className="hover:underline">Beranda</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:underline">Belanja</Link>
            <span className="mx-2">/</span>
            <span className="font-semibold text-[#4A2A1C]">
              {activeCategory === 'Semua Kategori' ? 'Buku & Koleksi' : activeCategory}
            </span>
          </div>

          {/* Title & Count */}
          <div className="flex flex-wrap items-baseline gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-medium text-[#4A2A1C] tracking-tight">
              {activeCategory === 'Semua Kategori' ? 'Buku & Koleksi' : activeCategory}
            </h1>
            <span className="text-[16px] text-[#7A5644]">
              {filteredProducts.length} produk
            </span>
          </div>

          {/* Description */}
          <p className="text-[15px] sm:text-[16px] text-[#7A5644] max-w-3xl mb-6 leading-relaxed">
            Board book, picture book, sampai chapter book. Impor dan lokal pilihan yang ramah anak untuk tiap tahap tumbuh kembang si kecil.
          </p>

          {/* Sub-category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {subCategories.map((sub) => {
              const isActive = activeSubcategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setActiveSubcategory(sub)}
                  type="button"
                  className={`px-4 py-2 rounded-[2px] text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#B05A26] text-white border border-[#B05A26]'
                      : 'bg-white text-[#4A2A1C] border border-[#E6D2C0] hover:border-[#B05A26]'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog Content (Figma Node #133:353) */}
      <section className="py-10 sm:py-14 flex-1">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            
            {/* Mobile Filter Toggle Button */}
            <div className="w-full lg:hidden flex items-center justify-between gap-3 border-b border-[#F2E4D6] pb-4">
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF6EA] text-[#B05A26] border border-[#E6D2C0] text-sm font-medium rounded-[2px]"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter & Kategori</span>
              </button>

              <span className="text-xs text-[#7A5644]">
                Menampilkan {displayedProducts.length} dari {filteredProducts.length} produk
              </span>
            </div>

            {/* Left Filter Sidebar (Figma Desktop #133:354) */}
            <aside className={`w-full lg:w-[264px] shrink-0 ${isFilterDrawerOpen ? 'fixed inset-0 z-50 bg-black/40 flex justify-end lg:static lg:bg-transparent' : 'hidden lg:block'}`}>
              <div className={`w-full max-w-xs lg:max-w-none bg-white p-6 lg:p-0 h-full lg:h-auto overflow-y-auto lg:overflow-visible flex flex-col gap-7 ${isFilterDrawerOpen ? 'shadow-2xl' : ''}`}>
                
                {/* Mobile Drawer Header */}
                <div className="flex lg:hidden items-center justify-between pb-4 border-b border-[#F2E4D6]">
                  <h3 className="font-semibold text-lg text-[#4A2A1C]">Filter Produk</h3>
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="p-1 text-gray-500 hover:text-black"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Filter: Usia (Figma #133:355) */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[15px] font-semibold text-[#4A2A1C]">Usia</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {ageOptions.map((age) => {
                      const isActive = selectedAge === age;
                      return (
                        <button
                          key={age}
                          type="button"
                          onClick={() => setSelectedAge(age)}
                          className={`px-3 py-1.5 text-xs rounded-[2px] transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-[#B05A26] text-white font-medium'
                              : 'bg-[#FFF6EA] text-[#4A2A1C] border border-[#E6D2C0] hover:border-[#B05A26]'
                          }`}
                        >
                          {age}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filter: Kategori (Figma #133:372) */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[15px] font-semibold text-[#4A2A1C]">Kategori</h4>
                  <div className="flex flex-col gap-2">
                    {categoryOptions.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-2.5 text-sm text-[#4A2A1C] cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="category_filter"
                          checked={activeCategory === cat}
                          onChange={() => setActiveCategory(cat)}
                          className="w-4 h-4 text-[#B05A26] border-[#C9B3A5] focus:ring-[#B05A26]"
                        />
                        <span className="group-hover:text-[#B05A26] transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter: Kondisi (Figma #133:406) */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[15px] font-semibold text-[#4A2A1C]">Kondisi</h4>
                  <div className="flex flex-col gap-2">
                    {conditionOptions.map((cond) => (
                      <label
                        key={cond}
                        className="flex items-center gap-2.5 text-sm text-[#4A2A1C] cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="condition_filter"
                          checked={selectedCondition === cond}
                          onChange={() => setSelectedCondition(cond)}
                          className="w-4 h-4 text-[#B05A26] border-[#C9B3A5] focus:ring-[#B05A26]"
                        />
                        <span className="group-hover:text-[#B05A26] transition-colors">{cond}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter: Harga (Figma #133:432) */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[15px] font-semibold text-[#4A2A1C]">Rentang Harga</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                    />
                    <span className="text-gray-400 text-xs">-</span>
                    <input
                      type="number"
                      placeholder="Maks"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                    />
                  </div>
                </div>

                {/* Filter: Ketersediaan (Figma #133:443) */}
                <div className="flex items-center justify-between border-t border-[#F2E4D6] pt-4">
                  <span className="text-sm text-[#4A2A1C] font-medium">Hanya stok tersedia</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#B05A26]"></div>
                  </label>
                </div>

                {/* Atur Ulang Filter Button (Figma #133:453) */}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full py-2.5 border border-[#C9B3A5] text-[#4A2A1C] text-sm font-medium rounded-[2px] hover:bg-[#FFF6EA] hover:border-[#B05A26] transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Atur Ulang Filter</span>
                </button>
              </div>
            </aside>

            {/* Right Products Content (Figma #133:455) */}
            <main className="flex-1 min-w-0">
              
              {/* Toolbar: Active Filters & Sorting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#F2E4D6]">
                
                {/* Active filter pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  {hasActiveFilters && (
                    <span className="text-xs text-[#7A5644] font-medium">Filter aktif:</span>
                  )}

                  {activeCategory !== 'Semua Kategori' && (
                    <span className="inline-flex items-center gap-1 bg-[#FFF6EA] border border-[#E6D2C0] text-[#B05A26] text-xs px-2.5 py-1 rounded-[2px]">
                      {activeCategory}
                      <button onClick={() => setActiveCategory('Semua Kategori')} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedAge !== 'Semua' && (
                    <span className="inline-flex items-center gap-1 bg-[#FFF6EA] border border-[#E6D2C0] text-[#B05A26] text-xs px-2.5 py-1 rounded-[2px]">
                      {selectedAge}
                      <button onClick={() => setSelectedAge('Semua')} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {activeSubcategory !== 'Semua' && (
                    <span className="inline-flex items-center gap-1 bg-[#FFF6EA] border border-[#E6D2C0] text-[#B05A26] text-xs px-2.5 py-1 rounded-[2px]">
                      {activeSubcategory}
                      <button onClick={() => setActiveSubcategory('Semua')} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedCondition !== 'Semua' && (
                    <span className="inline-flex items-center gap-1 bg-[#FFF6EA] border border-[#E6D2C0] text-[#B05A26] text-xs px-2.5 py-1 rounded-[2px]">
                      {selectedCondition}
                      <button onClick={() => setSelectedCondition('Semua')} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-xs text-[#C0392B] hover:underline ml-1"
                    >
                      Hapus Semua
                    </button>
                  )}
                </div>

                {/* Sort Dropdown & Count */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="appearance-none bg-white border border-[#E6D2C0] text-[#4A2A1C] text-xs font-medium pl-3 pr-8 py-2 rounded-[2px] focus:outline-none focus:border-[#B05A26] cursor-pointer"
                    >
                      <option value="terbaru">Urutkan: Terbaru</option>
                      <option value="harga-rendah">Harga: Rendah ke Tinggi</option>
                      <option value="harga-tinggi">Harga: Tinggi ke Rendah</option>
                      <option value="nama">Nama: A - Z</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#7A5644] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Counter Text */}
              <div className="text-xs text-[#7A5644] mb-6">
                Menampilkan {displayedProducts.length} dari {filteredProducts.length} produk
              </div>

              {/* Products 3-Column Grid (Figma #133:485) */}
              {displayedProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 sm:gap-x-7 sm:gap-y-12">
                  {displayedProducts.map((product) => (
                    <WireProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                /* Empty State (Figma #134:4856) */
                <div className="text-center py-16 px-4 bg-[#FFFBF7] rounded-[2px] border border-[#F2E4D6] flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src="/images/mascot/maskot-kaca-pembesar.png"
                      alt="Tidak ditemukan"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-[#4A2A1C] mb-1">
                    Produk Tidak Ditemukan
                  </h3>
                  <p className="text-sm text-[#7A5644] max-w-sm mb-6 leading-relaxed">
                    Kami tidak menemukan produk yang cocok dengan kombinasi filter atau kata kunci pencarianmu.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2.5 bg-[#B05A26] text-white text-sm font-medium rounded-[2px] hover:bg-[#964B1F] transition-colors"
                  >
                    Atur Ulang Filter
                  </button>
                </div>
              )}

              {/* Muat Lebih Banyak (Figma #133:581) */}
              {displayedProducts.length < filteredProducts.length && (
                <div className="flex flex-col items-center gap-3 mt-12 pt-8 border-t border-[#F2E4D6]">
                  <span className="text-xs text-[#7A5644]">
                    Menampilkan {displayedProducts.length} dari {filteredProducts.length} produk
                  </span>
                  <div className="w-48 h-1 bg-[#F2E4D6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#B05A26] transition-all duration-300"
                      style={{
                        width: `${(displayedProducts.length / filteredProducts.length) * 100}%`,
                      }}
                    />
                  </div>
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 9)}
                    className="px-8 py-2.5 border border-[#C9B3A5] text-[#4A2A1C] text-sm font-medium rounded-[2px] hover:border-[#B05A26] hover:text-[#B05A26] transition-colors cursor-pointer mt-1"
                  >
                    Muat Lebih Banyak
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Campaign Banner (Figma Node #150:1332) */}
      <CampaignBanner />

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ShopContent />
    </Suspense>
  );
}
