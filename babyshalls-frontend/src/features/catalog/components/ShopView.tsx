'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CampaignBanner } from '@/components/home/CampaignBanner';
import { WireProductCard } from '@/components/common/WireProductCard';
import { ShopFilterSidebar } from '@/features/catalog/components/ShopFilterSidebar';
import { useStorefrontProducts } from '@/hooks/useProducts';
import { MAIN_CATEGORIES, resolveProductTaxonomy } from '@/lib/catalog-categories';
import { ChevronDown, X, SlidersHorizontal, RotateCcw } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category');
  const initialAgeParam = searchParams.get('age');
  const initialSearchParam = searchParams.get('q');

  // Load catalog items from PostgreSQL API via React Query
  const { products: catalogItems } = useStorefrontProducts();

  // State Filters
  const [activeSubcategory, setActiveSubcategory] = useState<string>('Semua');
  const [activeCategory, setActiveCategory] = useState<string>(initialCategoryParam || 'Semua Kategori');
  const [selectedAge, setSelectedAge] = useState<string>(initialAgeParam || 'Semua');
  const [selectedCondition, setSelectedCondition] = useState<string>('Semua');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyDiscount, setOnlyDiscount] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<'terbaru' | 'harga-rendah' | 'harga-tinggi' | 'nama'>('terbaru');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchParam || '');
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [showAllSubcategories, setShowAllSubcategories] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // Sync URL query params when navigating from Header/MegaMenu
  useEffect(() => {
    const cat = searchParams.get('category');
    const subCat = searchParams.get('subCategory');
    const cond = searchParams.get('condition');
    const age = searchParams.get('age');
    const q = searchParams.get('q');
    setActiveCategory(cat || 'Semua Kategori');
    setActiveSubcategory(subCat || 'Semua');
    setSelectedCondition(cond || 'Semua');
    if (age) {
      const normalizedAge =
        age === '0-12m' ? '0–1 th' : age === '1-3y' ? '1–3 th' : age === '3-5y' ? '3+ th' : age === '6y' ? '6+ th' : age;
      setSelectedAge(normalizedAge);
    } else {
      setSelectedAge('Semua');
    }
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  // Top-level categories: strictly 4 product types (Buku, Mainan, Hampers, Preloved)
  const categoryOptions = useMemo(() => ['Semua Kategori', ...MAIN_CATEGORIES], []);

  // Subcategories scoped strictly to the selected main category
  const subCategories = useMemo(() => {
    if (activeCategory === 'Semua Kategori') {
      return ['Semua'];
    }
    const set = new Set<string>();
    catalogItems.forEach((p) => {
      const { mainCategory, subCategory } = resolveProductTaxonomy(p);
      if (mainCategory.toLowerCase() === activeCategory.toLowerCase() && subCategory) {
        set.add(subCategory);
      }
    });
    return ['Semua', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [catalogItems, activeCategory]);

  // Age options matching DB AgeGroup
  const ageOptions = ['Semua', '0–1 th', '1–3 th', '3+ th', '6+ th'];

  // Condition options
  const conditionOptions = ['Semua', 'Baru', 'Preloved'];

  // Reset all filters
  const resetFilters = () => {
    setActiveSubcategory('Semua');
    setActiveCategory('Semua Kategori');
    setSelectedAge('Semua');
    setSelectedCondition('Semua');
    setOnlyInStock(false);
    setOnlyDiscount(false);
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
    onlyDiscount ||
    minPrice !== '' ||
    maxPrice !== '' ||
    searchQuery !== '';

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    const result = catalogItems.filter((product) => {
      // Stock filter
      if (onlyInStock && !product.inStock) return false;

      // Discount filter
      if (onlyDiscount && !(product.discountPercent && product.discountPercent > 0)) return false;

      const { mainCategory, subCategory } = resolveProductTaxonomy(product);

      // Category filter (4 main types: Buku, Mainan, Hampers, Preloved)
      if (
        activeCategory !== 'Semua Kategori' &&
        mainCategory.toLowerCase() !== activeCategory.toLowerCase()
      ) {
        return false;
      }

      // Subcategory filter (scoped under main category)
      if (
        activeSubcategory !== 'Semua' &&
        (subCategory || '').toLowerCase() !== activeSubcategory.toLowerCase()
      ) {
        return false;
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
        const isPre = Boolean(
          product.isPreloved ||
            product.condition === 'preloved' ||
            product.category.toLowerCase().includes('preloved') ||
            product.title.toLowerCase().includes('[preloved]')
        );
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
          product.category.toLowerCase().includes(q) ||
          (product.subCategory || '').toLowerCase().includes(q);
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
    onlyDiscount,
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

          {/* Sub-category Chips (dinamis dari subCategory DB) */}
          {subCategories.length > 1 && (
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
          )}
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

            {/* Left Filter Sidebar */}
            <ShopFilterSidebar
              isFilterDrawerOpen={isFilterDrawerOpen}
              onCloseDrawer={() => setIsFilterDrawerOpen(false)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              ageOptions={ageOptions}
              selectedAge={selectedAge}
              onSelectAge={setSelectedAge}
              categoryOptions={categoryOptions}
              activeCategory={activeCategory}
              onSelectCategory={(cat) => {
                setActiveCategory(cat);
                setActiveSubcategory('Semua');
                setShowAllSubcategories(false);
              }}
              subCategories={subCategories}
              activeSubcategory={activeSubcategory}
              onSelectSubcategory={setActiveSubcategory}
              showAllSubcategories={showAllSubcategories}
              onToggleShowAllSubcategories={() => setShowAllSubcategories((prev) => !prev)}
              conditionOptions={conditionOptions}
              selectedCondition={selectedCondition}
              onSelectCondition={setSelectedCondition}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onlyInStock={onlyInStock}
              onOnlyInStockChange={setOnlyInStock}
              onlyDiscount={onlyDiscount}
              onOnlyDiscountChange={setOnlyDiscount}
              onResetFilters={resetFilters}
            />

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

    </div>
  );
}

export function ShopView() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ShopContent />
    </Suspense>
  );
}

