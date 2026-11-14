'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  Star,
  RotateCcw,
} from 'lucide-react';
import { useStorefrontProducts } from '../../hooks/useProducts';
import { ProductCard } from '../../components/product/ProductCard';
import { CurrencyInput } from '../../components/ui/CurrencyInput';

type SortOption = 'featured' | 'bestseller' | 'newest' | 'price-asc' | 'price-desc';
type ConditionFilter = 'all' | 'new' | 'preloved';

const SUB_CATEGORY_MAP: Record<string, { label: string; value: string }[]> = {
  all: [
    { label: 'Semua Sub-Kategori', value: 'all' },
    { label: 'Board Books (Buku Tebal)', value: 'Board Books' },
    { label: 'Picture Books (Cerita)', value: 'Picture Books' },
    { label: 'Early Readers', value: 'Early Readers' },
    { label: 'Wooden Stacking & Rainbow', value: 'Stacker' },
    { label: 'Montessori Shape Sorter', value: 'Shape Sorter' },
    { label: 'Touch & Feel / Sensory', value: 'Sensory' },
    { label: 'Preloved Kurasi', value: 'Preloved' },
  ],
  Books: [
    { label: 'Semua Buku', value: 'all' },
    { label: 'Board Books (Buku Tebal)', value: 'Board Books' },
    { label: 'Picture Books (Cerita)', value: 'Picture Books' },
    { label: 'Early Readers', value: 'Early Readers' },
    { label: 'Buku Preloved Kurasi', value: 'Preloved' },
  ],
  'Wooden Toys': [
    { label: 'Semua Mainan Kayu', value: 'all' },
    { label: 'Wooden Stacking & Rainbow', value: 'Stacker' },
    { label: 'Montessori Shape Sorter', value: 'Shape Sorter' },
    { label: 'Mainan Kayu Preloved', value: 'Preloved' },
  ],
  'Sound & Sensory': [
    { label: 'Semua Sensory', value: 'all' },
    { label: 'Touch & Feel Animals', value: 'Touch & Feel' },
    { label: 'Sound & Rattle', value: 'Sound' },
    { label: 'Sensory Preloved', value: 'Preloved' },
  ],
  'Gift Hampers': [
    { label: 'Semua Hampers', value: 'all' },
    { label: 'Newborn Baby Gift Set', value: 'Newborn' },
    { label: 'Birthday Milestone Box', value: 'Birthday' },
    { label: 'Custom Wooden Gift Box', value: 'Custom' },
  ],
  Preloved: [
    { label: 'Semua Preloved Kurasi', value: 'all' },
    { label: 'Buku Anak Preloved', value: 'Book' },
    { label: 'Mainan Kayu Preloved', value: 'Wooden' },
    { label: 'Sensory & Suara Preloved', value: 'Sound' },
  ],
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products: allProducts } = useStorefrontProducts();

  const [selectedAge, setSelectedAge] = useState<string>(searchParams.get('age') || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [selectedSub, setSelectedSub] = useState<string>(searchParams.get('sub') || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Shopee-style Additional Filters
  const [minPriceInput, setMinPriceInput] = useState<string>('');
  const [maxPriceInput, setMaxPriceInput] = useState<string>('');
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  const [conditionFilter, setConditionFilter] = useState<ConditionFilter>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyDiscount, setOnlyDiscount] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  useEffect(() => {
    setSelectedAge(searchParams.get('age') || 'all');
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedSub(searchParams.get('sub') || 'all');
    setSearchQuery(searchParams.get('q') || searchParams.get('search') || '');
  }, [searchParams]);

  const updateUrlCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSub('all');
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'all') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    params.delete('sub');
    const qs = params.toString();
    router.replace(qs ? `/catalog?${qs}` : '/catalog', { scroll: false });
  };

  const ageGroups = [
    { label: 'Semua Usia', value: 'all' },
    { label: 'Newborn+ (0-1 th)', value: 'Newborn+' },
    { label: 'Ages 1-3 (1-3 th)', value: 'Ages 1-3' },
    { label: 'Ages 3+ (3-5 th)', value: 'Ages 3+' },
    { label: 'Ages 6+ (6+ th)', value: 'Ages 6+' },
  ];

  const categories = [
    { label: 'Semua Kategori', value: 'all' },
    { label: 'Buku Anak (Books)', value: 'Books' },
    { label: 'Mainan Kayu (Toys)', value: 'Wooden Toys' },
    { label: 'Sound & Sensory', value: 'Sound & Sensory' },
    { label: 'Gift Hampers', value: 'Gift Hampers' },
    { label: 'Preloved Kurasi', value: 'Preloved' },
  ];

  const currentSubCategories = SUB_CATEGORY_MAP[selectedCategory] || SUB_CATEGORY_MAP.all;

  const handleApplyPriceRange = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedMinPrice(minPriceInput ? Number(minPriceInput) : null);
    setAppliedMaxPrice(maxPriceInput ? Number(maxPriceInput) : null);
  };

  const applyPresetPrice = (min: number | null, max: number | null) => {
    setMinPriceInput(min !== null ? String(min) : '');
    setMaxPriceInput(max !== null ? String(max) : '');
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
  };

  const resetAllFilters = () => {
    setSelectedAge('all');
    setSelectedCategory('all');
    setSelectedSub('all');
    setSearchQuery('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
    setConditionFilter('all');
    setMinRating(0);
    setOnlyDiscount(false);
    setOnlyInStock(false);
    router.replace('/catalog', { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (selectedAge !== 'all' && product.ageGroup !== selectedAge) return false;

      if (selectedCategory !== 'all') {
        if (selectedCategory === 'Preloved') {
          if (!product.isPreloved && !product.category.toLowerCase().includes('preloved')) return false;
        } else if (selectedCategory === 'Books') {
          if (!product.category.includes('Book') && !product.category.includes('Readers')) return false;
        } else if (!product.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      if (selectedSub && selectedSub !== 'all') {
        if (selectedSub === 'Preloved') {
          if (!product.isPreloved && !product.category.toLowerCase().includes('preloved')) return false;
        } else {
          const subLow = selectedSub.toLowerCase();
          const match =
            product.category.toLowerCase().includes(subLow) ||
            product.title.toLowerCase().includes(subLow) ||
            product.description.toLowerCase().includes(subLow);
          if (!match) return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          product.title.toLowerCase().includes(q) ||
          product.authorOrBrand?.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (appliedMinPrice !== null && product.price < appliedMinPrice) return false;
      if (appliedMaxPrice !== null && product.price > appliedMaxPrice) return false;

      if (conditionFilter === 'new' && product.isPreloved) return false;
      if (conditionFilter === 'preloved' && !product.isPreloved) return false;

      if (minRating > 0 && product.rating < minRating) return false;
      if (onlyDiscount && !(product.originalPrice && product.originalPrice > product.price)) return false;
      if (onlyInStock && product.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'bestseller') return b.reviewsCount - a.reviewsCount;
      if (sortBy === 'newest') return Number(Boolean(b.isNewArrival)) - Number(Boolean(a.isNewArrival));
      return 0;
    });
  }, [
    selectedAge,
    selectedCategory,
    selectedSub,
    searchQuery,
    appliedMinPrice,
    appliedMaxPrice,
    conditionFilter,
    minRating,
    onlyDiscount,
    onlyInStock,
    sortBy,
    allProducts,
  ]);

  return (
    <div className="py-8 lg:py-12 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Page Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Koleksi Buku &amp; Mainan Edukasi
            </h1>
          </div>
        </div>

        {/* SHOPEE-STYLE 2-COLUMN CATALOG LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT FILTER SIDEBAR */}
          <aside className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-[#1A1A1A]">
                <SlidersHorizontal className="w-4 h-4 text-[#1E543B]" />
                <span>FILTER</span>
              </div>
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#6B7280] hover:text-[#1A1A1A]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* 1. Kategori Utama */}
            <div className="space-y-2.5">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A]">
                Kategori
              </h2>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => updateUrlCategory(cat.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      selectedCategory === cat.value
                        ? 'bg-[#FDF0B8] text-[#1A1A1A] font-bold'
                        : 'text-[#4A4A4A] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Sub-Kategori Dinamis */}
            <div className="space-y-2.5 pt-4 border-t border-[#F3F4F6]">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A]">
                Sub-Kategori
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {currentSubCategories.map((subItem) => (
                  <button
                    key={subItem.value}
                    type="button"
                    onClick={() => setSelectedSub(subItem.value)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${
                      selectedSub === subItem.value
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-[#F8FAFC] text-[#4A4A4A] border-[#E5E7EB] hover:border-[#1A1A1A]'
                    }`}
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Kelompok Usia */}
            <div className="space-y-2.5 pt-4 border-t border-[#F3F4F6]">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A]">
                Kelompok Usia
              </h2>
              <div className="space-y-1">
                {ageGroups.map((age) => (
                  <label
                    key={age.value}
                    className="flex items-center gap-2.5 py-1 text-xs font-semibold text-[#4A4A4A] cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="ageGroup"
                      checked={selectedAge === age.value}
                      onChange={() => setSelectedAge(age.value)}
                      className="accent-[#1E543B]"
                    />
                    <span>{age.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Batas Harga (Range Harga) */}
            <div className="space-y-2.5 pt-4 border-t border-[#F3F4F6]">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A]">
                Batas Harga (Rp)
              </h2>
              <form onSubmit={handleApplyPriceRange} className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <CurrencyInput
                    value={minPriceInput}
                    onChange={setMinPriceInput}
                    placeholder="MIN"
                    ariaLabel="Harga Minimal"
                    className="w-full rounded-lg"
                    inputClassName="h-[36px] px-2"
                  />
                  <span className="text-xs text-[#6B7280]">-</span>
                  <CurrencyInput
                    value={maxPriceInput}
                    onChange={setMaxPriceInput}
                    placeholder="MAX"
                    ariaLabel="Harga Maksimal"
                    className="w-full rounded-lg"
                    inputClassName="h-[36px] px-2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full min-h-[38px] rounded-lg bg-[#F5B7A1] hover:bg-[#ED9E84] text-[#1A1A1A] text-xs font-bold transition-colors"
                >
                  TERAPKAN
                </button>
              </form>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPresetPrice(0, 100000)}
                  className="px-2.5 py-1 rounded-full bg-[#FAF4E8] text-[11px] font-semibold text-[#1A1A1A]"
                >
                  &lt; 100rb
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetPrice(100000, 200000)}
                  className="px-2.5 py-1 rounded-full bg-[#FAF4E8] text-[11px] font-semibold text-[#1A1A1A]"
                >
                  100rb - 200rb
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetPrice(200000, null)}
                  className="px-2.5 py-1 rounded-full bg-[#FAF4E8] text-[11px] font-semibold text-[#1A1A1A]"
                >
                  &gt; 200rb
                </button>
              </div>
            </div>

            {/* 5. Kondisi Barang & Rating */}
            <div className="space-y-2.5 pt-4 border-t border-[#F3F4F6]">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A]">
                Kondisi &amp; Penilaian
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Semua', value: 'all' },
                  { label: 'Baru (New)', value: 'new' },
                  { label: 'Preloved', value: 'preloved' },
                ].map((cond) => (
                  <button
                    key={cond.value}
                    type="button"
                    onClick={() => setConditionFilter(cond.value as ConditionFilter)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                      conditionFilter === cond.value
                        ? 'bg-[#E9F3E4] border-[#1E543B] text-[#1E543B]'
                        : 'bg-white border-[#E5E7EB] text-[#4A4A4A]'
                    }`}
                  >
                    {cond.label}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 pt-2">
                <button
                  type="button"
                  onClick={() => setMinRating((r) => (r === 5 ? 0 : 5))}
                  className={`w-full flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    minRating === 5
                      ? 'bg-[#FDF0B8] border-[#FCE694] text-[#1A1A1A]'
                      : 'bg-white border-[#E5E7EB] text-[#4A4A4A]'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                  <span>Rating 5.0 Bintang</span>
                </button>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#4A4A4A] pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyDiscount}
                    onChange={(e) => setOnlyDiscount(e.target.checked)}
                    className="accent-[#1E543B]"
                  />
                  <span>Sedang Promo / Diskon</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#4A4A4A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="accent-[#1E543B]"
                  />
                  <span>Stok Tersedia</span>
                </label>
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN CATALOG AREA */}
          <div className="lg:col-span-9 space-y-5">
            {/* Shopee-style Sort & Search Bar */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#6B7280] mr-1">Urutkan:</span>
                  {[
                    { id: 'featured', label: 'Terkait' },
                    { id: 'newest', label: 'Terbaru' },
                    { id: 'bestseller', label: 'Terlaris' },
                    { id: 'price-asc', label: 'Harga: Termurah' },
                    { id: 'price-desc', label: 'Harga: Termahal' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSortBy(s.id as SortOption)}
                      className={`min-h-[36px] px-3.5 rounded-lg text-xs font-bold transition-colors ${
                        sortBy === s.id
                          ? 'bg-[#F5B7A1] text-[#1A1A1A]'
                          : 'bg-[#F8FAFC] text-[#4A4A4A] hover:bg-[#FAF4E8]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-[#6B7280] shrink-0">
                  {filteredProducts.length} produk ditemukan
                </span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul buku, mainan kayu, atau penerbit di katalog..."
                  className="w-full h-[42px] pl-10 pr-4 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
                <p className="text-lg font-bold text-[#1A1A1A]">Produk tidak ditemukan</p>
                <p className="text-sm text-[#6B7280]">
                  Coba ubah sub-kategori, batas harga, atau kata kunci pencarian Anda.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="min-h-[44px] px-6 rounded-full bg-[#F5B7A1] text-[#1A1A1A] font-bold text-sm"
                >
                  Hapus Semua Filter
                </button>
              </div>
            ) : (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-sm font-semibold text-[#6B7280]">
          Memuat katalog BabyShalls...
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
