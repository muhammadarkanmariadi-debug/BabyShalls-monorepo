'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, SlidersHorizontal, Search } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../../components/product/ProductCard';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialAge = searchParams.get('age') || 'all';
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialSub = searchParams.get('sub') || '';

  const [selectedAge, setSelectedAge] = useState<string>(initialAge);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSub, setSelectedSub] = useState<string>(initialSub);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Automatically synchronize filters when searchParams change (from navigation or dropdowns)
  useEffect(() => {
    setSelectedAge(searchParams.get('age') || 'all');
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedSub(searchParams.get('sub') || '');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const ageGroups: { label: string; value: string }[] = [
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
    { label: 'Gift Hampers', value: 'Gift Hampers' },
    { label: 'Sound & Sensory', value: 'Sound & Sensory' },
    { label: ' Preloved Kurasi', value: 'Preloved' },
  ];

  const subCategoryMap: Record<string, { label: string; value: string }[]> = {
    all: [
      { label: 'Semua Sub-Kategori', value: 'all' },
      { label: ' Preloved Kurasi', value: 'Preloved' },
      { label: 'Board Books (Buku Tebal)', value: 'Board Books' },
      { label: 'Picture Books (Cerita)', value: 'Picture Books' },
      { label: 'Sound & Sensory', value: 'Sensory' },
      { label: 'Early Readers', value: 'Early Readers' },
      { label: 'Wooden Stacking & Rainbow', value: 'Stacker' },
      { label: 'Montessori Shape Sorter', value: 'Shape Sorter' },
    ],
    Preloved: [
      { label: 'Semua Preloved Kurasi', value: 'all' },
      { label: 'Buku Anak Preloved', value: 'Books' },
      { label: 'Mainan Kayu Preloved', value: 'Wooden' },
      { label: 'Sensory & Suara Preloved', value: 'Sensory' },
    ],
    Books: [
      { label: 'Semua Buku', value: 'all' },
      { label: 'Buku Preloved Kurasi', value: 'Preloved' },
      { label: 'Board Books (Buku Papan Tebal)', value: 'Board Books' },
      { label: 'Picture Books (Buku Dongeng)', value: 'Picture Books' },
      { label: 'Touch & Feel / Sensory', value: 'Sensory' },
      { label: 'Early Readers (Belajar Membaca)', value: 'Early Readers' },
    ],
    'Wooden Toys': [
      { label: 'Semua Mainan Kayu', value: 'all' },
      { label: 'Mainan Kayu Preloved', value: 'Preloved' },
      { label: 'Wooden Stacking & Rainbow', value: 'Stacker' },
      { label: 'Montessori Shape Sorters', value: 'Shape Sorter' },
      { label: 'Sensory & Motoric Toys', value: 'Sensory' },
    ],
    'Gift Hampers': [
      { label: 'Semua Hampers', value: 'all' },
      { label: 'Newborn Baby Gift Set', value: 'Newborn' },
      { label: 'Birthday Milestone Box', value: 'Birthday' },
      { label: 'Custom Wooden Gift Box', value: 'Custom' },
    ],
    'Sound & Sensory': [
      { label: 'Semua Sensory', value: 'all' },
      { label: ' Sensory Preloved Kurasi', value: 'Preloved' },
      { label: 'Touch & Feel Animals', value: 'Touch & Feel' },
      { label: 'Sound & Rattle', value: 'Sound' },
      { label: 'Taktil & Visual', value: 'Sensory' },
    ],
  };

  const currentSubCategories = subCategoryMap[selectedCategory] || subCategoryMap.all;

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Age filter
      if (selectedAge !== 'all' && product.ageGroup !== selectedAge) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'Preloved') {
          if (!product.isPreloved && !product.category.toLowerCase().includes('preloved')) return false;
        } else if (selectedCategory === 'Books') {
          if (!product.category.includes('Book') && !product.category.includes('Readers')) return false;
        } else if (!product.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }
      // Sub-category filter (e.g. Board Books, Wooden Stacking, Shape Sorter, etc.)
      if (selectedSub && selectedSub !== 'all') {
        if (selectedSub === 'Preloved') {
          if (!product.isPreloved && !product.category.toLowerCase().includes('preloved')) return false;
        } else if (selectedCategory === 'Preloved') {
          const subLow = selectedSub.toLowerCase();
          const matchesCategory = product.category.toLowerCase().includes(subLow);
          const matchesTitle = product.title.toLowerCase().includes(subLow);
          const matchesDesc = product.description.toLowerCase().includes(subLow);
          if (!matchesCategory && !matchesTitle && !matchesDesc) return false;
        } else {
          const subLow = selectedSub.toLowerCase();
          const matchesCategory = product.category.toLowerCase().includes(subLow);
          const matchesTitle = product.title.toLowerCase().includes(subLow);
          const matchesDesc = product.description.toLowerCase().includes(subLow);
          const matchesFeatures = product.features?.some((f) => f.toLowerCase().includes(subLow));
          if (!matchesCategory && !matchesTitle && !matchesDesc && !matchesFeatures) return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesAuthor = product.authorOrBrand?.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor && !matchesCategory) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0; // default featured
    });
  }, [selectedAge, selectedCategory, selectedSub, searchQuery, sortBy]);

  return (
    <div className="py-10 lg:py-16 bg-[#FFF8EF]">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8FA87E] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#DA7A5B]" />
            <span>Katalog Kurasi BabyShalls Malang</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#502E1E]">
            Koleksi Buku & Mainan Edukasi
          </h1>
          <p className="text-sm text-[#6B3F2A]/80 mt-1 max-w-xl">
            Saring pilihan berdasarkan usia buah hati Anda atau kategori produk untuk stimulasi yang tepat dan menyenangkan.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#FCF6EC] border border-[#EEDBC9] rounded-[24px] p-5 mb-8 shadow-xs space-y-4">

          {/* Top Row: Search & Sort */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:max-w-md relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul buku, mainan, atau kata kunci..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FFF8EF] border border-[#EEDBC9] rounded-full text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
              />
              <Search className="w-4 h-4 text-[#CBA989] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 text-xs">
              <span className="font-bold text-[#8FA87E] flex items-center gap-1.5 whitespace-nowrap">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Urutkan:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FFF8EF] border border-[#EEDBC9] text-[#6B3F2A] text-xs font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-[#DA7A5B]"
              >
                <option value="featured">Paling Populer</option>
                <option value="price-asc">Harga: Terendah ke Tertinggi</option>
                <option value="price-desc">Harga: Tertinggi ke Terendah</option>
              </select>
            </div>
          </div>

          {/* 1. Age Filters */}
          <div className="pt-2 border-t border-[#EEDBC9]/60">
            <span className="text-xs font-black uppercase text-[#DA7A5B] block mb-2 tracking-wider">
              Filter Kelompok Usia (Shop by Age):
            </span>
            <div className="flex flex-wrap gap-2">
              {ageGroups.map((group) => (
                <button
                  key={group.value}
                  onClick={() => {
                    setSelectedAge(group.value);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${selectedAge === group.value
                      ? 'bg-[#DA7A5B] text-white shadow-subtle'
                      : 'bg-[#FFF8EF] border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#FFE4D0]'
                    }`}
                >
                  {group.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Category Filters */}
          <div className="pt-2 border-t border-[#EEDBC9]/60">
            <span className="text-xs font-black uppercase text-[#8FA87E] block mb-2 tracking-wider">
              Filter Kategori:
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setSelectedSub('');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === cat.value
                      ? 'bg-[#8FA87E] text-white shadow-subtle'
                      : 'bg-[#FFF8EF] border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#EBF2E0]'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Sub-Category Filters */}
          <div className="pt-2 border-t border-[#EEDBC9]/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-[#C46749] tracking-wider">
                Filter Sub-Kategori:
              </span>
              {selectedSub && (
                <button
                  onClick={() => setSelectedSub('')}
                  className="text-[11px] font-bold text-[#DA7A5B] hover:underline"
                >
                  Lihat Semua Sub-Kategori
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {currentSubCategories.map((sub) => {
                const isActive = (selectedSub === '' && sub.value === 'all') || selectedSub === sub.value;
                return (
                  <button
                    key={sub.value}
                    onClick={() => {
                      setSelectedSub(sub.value === 'all' ? '' : sub.value);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${isActive
                        ? 'bg-[#C46749] text-white shadow-subtle'
                        : 'bg-[#FFF8EF] border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#FFE4D0]'
                      }`}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#8FA87E] font-bold">
          <span>Menampilkan {filteredProducts.length} produk kurasi</span>
          {(selectedAge !== 'all' || selectedCategory !== 'all' || selectedSub || searchQuery) && (
            <button
              onClick={() => {
                setSelectedAge('all');
                setSelectedCategory('all');
                setSelectedSub('');
                setSearchQuery('');
              }}
              className="text-[#DA7A5B] hover:underline"
            >
              Reset Semua Filter
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#FCF6EC] rounded-[24px] border border-[#EEDBC9] p-8 space-y-3">
            <h3 className="font-serif text-xl font-bold text-[#502E1E]">
              Tidak ada produk yang cocok
            </h3>
            <p className="text-xs sm:text-sm text-[#8FA87E] max-w-md mx-auto">
              Coba sesuaikan filter usia, kategori, atau sub-kategori Anda, atau ajukan permintaan buku khusus via layanan Book Request.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-[#DA7A5B]">Memuat katalog kurasi...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
