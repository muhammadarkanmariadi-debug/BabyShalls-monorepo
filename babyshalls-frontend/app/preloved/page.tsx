'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OrderDrawer } from '@/components/OrderDrawer';
import { FloatingWhatsApp } from '@/components/common/FloatingWhatsApp';
import { TombolKembali } from '@/components/common/TombolKembali';
import { WireProductCard } from '@/components/common/WireProductCard';
import { mockProducts } from '@/data/mockProducts';
import { useCart } from '@/context/CartContext';
import { ShieldCheck, Sparkles, CheckCircle2, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function PrelovedPage() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedCondition, setSelectedCondition] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'terbaru' | 'harga-rendah' | 'harga-tinggi'>('terbaru');

  // Filter preloved items (either category is Preloved Item or condition is preloved or in mock)
  const prelovedProducts = useMemo(() => {
    return mockProducts.filter(
      (p) =>
        p.category === 'Preloved Item' ||
        p.category === 'Preloved' ||
        p.condition === 'preloved' ||
        p.badge?.toLowerCase().includes('preloved') ||
        Boolean(p.originalPrice && p.originalPrice > p.price)
    );
  }, []);

  const filteredProducts = useMemo(() => {
    let result = prelovedProducts.filter((p) => {
      if (selectedCategory !== 'Semua') {
        if (!p.category.toLowerCase().includes(selectedCategory.toLowerCase())) return false;
      }
      if (selectedCondition !== 'Semua') {
        // Condition matching
        if (selectedCondition === 'Seperti Baru' && p.badge !== 'Pilihan Editor') return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          p.title.toLowerCase().includes(q) ||
          (p.author || p.authorOrBrand || '').toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });

    if (sortBy === 'harga-rendah') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'harga-tinggi') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [prelovedProducts, selectedCategory, selectedCondition, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-white text-[#4A2A1C] flex flex-col justify-between font-sans">
      <Header />
      <TombolKembali fallbackUrl="/shop" label="Kembali ke Katalog" />

      <main className="w-full flex-grow">
        
        {/* =========================================================================
            01 · HERO PRELOVED (Figma Style: Peach Warm Background #FBE6D8)
            ========================================================================= */}
        <section className="bg-[#FFF6EA] border-b border-[#F2E4D6] py-12 sm:py-16">
          <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FBE6D8] rounded-[2px]">
                  <Sparkles size={14} className="text-[#B05A26]" />
                  <span className="text-xs font-semibold text-[#B05A26] uppercase tracking-wider">
                    KURASI PRELOVED TERBAIK
                  </span>
                </div>

                <h1 className="text-[32px] sm:text-[44px] font-medium text-[#4A2A1C] leading-[1.2]">
                  Buku Anak Pilihan Berkualitas, Bersih &amp; Steril UV
                </h1>

                <p className="text-[15px] sm:text-[17px] text-[#7A5644] leading-relaxed max-w-xl">
                  Setiap buku preloved melalui proses kurasi 5 tahap: pemeriksaan kelengkapan halaman, sanitasi ramah anak, sterilisasi lampu UV-C, dan penilaian kondisi jujur.
                </p>

                {/* 3 Guarantees */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  <div className="flex items-center gap-2.5 p-3 bg-white rounded-[2px] border border-[#E6D2C0]">
                    <ShieldCheck className="w-5 h-5 text-[#2A6E37] shrink-0" />
                    <span className="text-xs font-medium text-[#4A2A1C]">Sterilisasi UV-C</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-white rounded-[2px] border border-[#E6D2C0]">
                    <CheckCircle2 className="w-5 h-5 text-[#2A6E37] shrink-0" />
                    <span className="text-xs font-medium text-[#4A2A1C]">Halaman 100% Lengkap</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-white rounded-[2px] border border-[#E6D2C0]">
                    <Sparkles className="w-5 h-5 text-[#2A6E37] shrink-0" />
                    <span className="text-xs font-medium text-[#4A2A1C]">Hemat Hingga 60%</span>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[380px] aspect-[4/3] bg-white rounded-[4px] overflow-hidden border border-[#E6D2C0] shadow-sm">
                  <Image
                    src="/images/preloved/preloved-sampul.png"
                    alt="Kurasi Buku Preloved"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#2A6E37] text-white text-[11px] font-semibold px-2.5 py-1 rounded-[2px]">
                    Kondisi: 95% Sangat Baik
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            02 · FILTER & PRODUCT GRID
            ========================================================================= */}
        <section className="py-12 max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-[#F2E4D6]">
            
            {/* Category chips */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
              {['Semua', 'Board Books', 'Picture Books', 'Educational Toys'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-[2px] text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#B05A26] text-white shadow-xs'
                      : 'bg-[#FFF6EA] text-[#4A2A1C] hover:bg-[#FBE6D8]'
                  }`}
                >
                  {cat === 'Semua' ? 'Semua Preloved' : cat}
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={15} className="text-[#7A5644] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari buku preloved..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] placeholder-[#C9B3A5] focus:outline-none focus:border-[#B05A26]"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-none focus:border-[#B05A26] cursor-pointer"
              >
                <option value="terbaru">Terbaru</option>
                <option value="harga-rendah">Harga Rendah</option>
                <option value="harga-tinggi">Harga Tinggi</option>
              </select>
            </div>

          </div>

          {/* Product Grid */}
          <div className="pt-8">
            <div className="text-xs text-[#7A5644] mb-6">
              Menampilkan {filteredProducts.length} buku preloved siap kirim
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <WireProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#FFFBF7] rounded-[2px] border border-[#F2E4D6]">
                <p className="text-base font-medium text-[#4A2A1C]">Buku Preloved Belum Tersedia</p>
                <p className="text-xs text-[#7A5644] mt-1">Coba ubah kata kunci pencarian atau kategori Anda.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 bg-[#B05A26] text-white text-xs font-semibold rounded-[2px]"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>

        </section>

      </main>

      <Footer />
      <OrderDrawer />
      <FloatingWhatsApp />
    </div>
  );
}

