'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Gift,
  Check,
  Sparkles,
  ArrowRight,
  Package,
  Heart,
  Store,
  Truck,
  MessageCircle,
  Search,
} from 'lucide-react';
import { TombolKembali } from '@/components/common/TombolKembali';
import { BannerHampers } from '@/components/home/BannerHampers';
import { useCart } from '@/context/CartContext';
import { useStorefrontProducts } from '@/hooks/useProducts';
import { resolveProductTaxonomy } from '@/lib/catalog-categories';
import { formatIDR } from '@/lib/utils';
import { Product } from '@/types';

export function HampersView() {
  const { addToCart, setIsCartOpen } = useCart();
  const { products: storefrontProducts } = useStorefrontProducts();

  // Hamper Builder State
  const [boxType, setBoxType] = useState('pinus');
  const [theme, setTheme] = useState('newborn');
  const [bookCount, setBookCount] = useState(3);
  const [includeToy, setIncludeToy] = useState(true);
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [customCardMessage, setCustomCardMessage] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);

  const boxOptions = [
    {
      id: 'pinus',
      title: 'Kotak Kayu Pinus Alami',
      desc: 'Kotak kayu pinus estetik dengan penutup akrilik geser, diikat pita katun linen alami.',
      price: 120000,
      image: '/images/category/kategori-hampers.png',
    },
    {
      id: 'hardbox',
      title: 'Hardbox Pastel Keepsake',
      desc: 'Kotak kokoh warna pastel sage/peach dengan cetak logo emas, ideal sebagai wadah kenangan bayi.',
      price: 85000,
      image: '/images/hampers-gift.jpg',
    },
    {
      id: 'rotan',
      title: 'Keranjang Anyaman Rotan',
      desc: 'Keranjang rotan handmade pengrajin lokal dengan kain pelapis linen lembut, multifungsi di kamar bayi.',
      price: 145000,
      image: '/images/products/shopee-pastel-pegdol-set.jpg',
    },
  ];

  // Filter, Search & Sort states for Ready-Made Hampers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAge, setSelectedAge] = useState('Semua');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'terbaru' | 'harga-rendah' | 'harga-tinggi' | 'nama'>('terbaru');

  const dbHampers: Product[] = useMemo(
    () =>
      storefrontProducts.filter(
        (p) => resolveProductTaxonomy(p).mainCategory === 'Hampers'
      ),
    [storefrontProducts]
  );

  const filteredHampers = useMemo(() => {
    const result = dbHampers.filter((p) => {
      const isOutOfStock = p.stock !== undefined ? p.stock <= 0 : p.inStock === false;
      if (onlyInStock && isOutOfStock) return false;

      if (selectedAge !== 'Semua') {
        const pAge = p.ageGroup || '';
        if (selectedAge === '0–1 th' && !pAge.includes('0–1') && !pAge.includes('0–2') && !pAge.toLowerCase().includes('newborn')) return false;
        if (selectedAge === '1–3 th' && !pAge.includes('1–3') && !pAge.includes('1-3')) return false;
        if (selectedAge === '3+ th' && !pAge.includes('3–5') && !pAge.includes('3+')) return false;
        if (selectedAge === '6+ th' && !pAge.includes('6+')) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.subCategory || '').toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    if (sortBy === 'harga-rendah') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'harga-tinggi') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'nama') result.sort((a, b) => a.title.localeCompare(b.title));

    return result;
  }, [dbHampers, onlyInStock, selectedAge, searchQuery, sortBy]);

  const selectedBox = boxOptions.find((b) => b.id === boxType) || boxOptions[0];
  const bookEstimate = bookCount * 145000;
  const toyEstimate = includeToy ? 125000 : 0;
  const estimatedTotal = selectedBox.price + bookEstimate + toyEstimate;

  const handleAddHamperToBag = () => {
    const hamperProduct: any = {
      id: `hamper-${Date.now()}`,
      title: `Custom Gift Hamper (${selectedBox.title})`,
      author: 'Kurasi Khusus Butik BabyShalls',
      price: estimatedTotal,
      coverImage: selectedBox.image,
      category: 'Hampers',
      ageGroup: theme === 'newborn' ? '0–1 Years' : '1–3 Years',
      inStock: true,
      description: `Paket hampers kustom: ${selectedBox.title}, ${bookCount} buku pilihan, ${includeToy ? 'termasuk mainan montessori' : 'hanya buku'}. Untuk ${recipientName || 'Buah Hati'} dari ${senderName || 'Keluarga'}.`,
    };

    addToCart(hamperProduct, 1);
    setIsOrdered(true);
    setTimeout(() => {
      setIsOrdered(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">

      {/* Hero Header */}
      <section className="bg-[#FFF6EA] py-12 sm:py-16 border-b border-[#F2E4D6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B05A26] block mb-2">
            HAMPERS &amp; GIFT SETS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#4A2A1C] tracking-tight mb-4">
            Kado Terbaik untuk Momen Tumbuh Kembang Si Kecil
          </h1>
          <p className="text-sm sm:text-base text-[#7A5644] max-w-2xl mx-auto leading-relaxed mb-6">
            Pilihan paket hampers buku anak dan mainan edukasi yang siap dihadiahkan untuk kado kelahiran (newborn), ulang tahun, atau perayaan keluarga.
          </p>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20BabyShalls,%20saya%20ingin%20konsultasi%20pembuatan%20hampers%20custom"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B05A26] text-white text-xs font-semibold rounded-[2px] hover:bg-[#964B1F] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konsultasi via WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Section 1: Ready-to-Gift Hampers */}
      <section className="py-12 sm:py-16 bg-[#FFFDF9]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] tracking-tight">
                Paket Hampers Siap Kirim
              </h2>
              <p className="text-xs text-[#7A5644] mt-1">
                Menampilkan {filteredHampers.length} paket hampers
              </p>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#7A5644] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari paket hampers..."
                  className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'terbaru' | 'harga-rendah' | 'harga-tinggi' | 'nama')}
                className="text-xs px-3 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26] cursor-pointer"
                aria-label="Urutkan hampers"
              >
                <option value="terbaru">Urutkan: Terbaru</option>
                <option value="harga-rendah">Harga: Terendah</option>
                <option value="harga-tinggi">Harga: Tertinggi</option>
                <option value="nama">Nama: A - Z</option>
              </select>
            </div>
          </div>

          {/* Age Filter & In-Stock Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-[#F2E4D6]">
            <div className="flex flex-wrap items-center gap-1.5">
              {['Semua', '0–1 th', '1–3 th', '3+ th', '6+ th'].map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setSelectedAge(age)}
                  className={`px-3 py-1.5 text-xs rounded-[2px] transition-colors cursor-pointer ${selectedAge === age
                      ? 'bg-[#B05A26] text-white font-medium'
                      : 'bg-white text-[#4A2A1C] border border-[#E6D2C0] hover:border-[#B05A26]'
                    }`}
                >
                  {age}
                </button>
              ))}
            </div>

            <label className="inline-flex items-center gap-2 text-xs text-[#4A2A1C] cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 accent-[#B05A26] rounded-[2px]"
              />
              <span>Hanya stok tersedia</span>
            </label>
          </div>

          {filteredHampers.length === 0 ? (
            <div className="p-10 bg-white border border-[#F2E4D6] rounded-[2px] text-center text-sm text-[#7A5644]">
              Tidak ada paket hampers yang sesuai dengan filter atau pencarian saat ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
              {filteredHampers.map((hamp) => {
                const isOutOfStock = hamp.stock !== undefined ? hamp.stock <= 0 : hamp.inStock === false;
                const hasDiscount = Boolean(hamp.discountPercent && hamp.discountPercent > 0);
                return (
                  <div
                    key={hamp.id}
                    className="bg-white border border-[#F2E4D6] rounded-[2px] overflow-hidden flex flex-col justify-between hover:border-[#B05A26] transition-colors shadow-xs group"
                  >
                    <div>
                      <Link href={`/product/${hamp.id}`} className="relative aspect-square w-full bg-[#F0F0F0] block overflow-hidden">
                        <Image
                          src={hamp.coverImage || '/images/category/kategori-hampers.png'}
                          alt={hamp.title}
                          fill
                          className="object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                          <span className="bg-[#DDF1E5] text-[#2A6E37] text-xs font-medium px-2.5 py-0.5 rounded-[2px]">
                            {hamp.ageGroup || 'Semua usia'}
                          </span>
                          {hasDiscount && (
                            <span className="bg-[#C0392B] text-white text-xs font-semibold px-2 py-0.5 rounded-[2px]">
                              -{hamp.discountPercent}%
                            </span>
                          )}
                        </div>
                        {isOutOfStock && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                            <span className="w-20 h-20 rounded-full bg-black/65 text-white text-sm font-medium flex items-center justify-center shadow-sm">
                              Habis
                            </span>
                          </div>
                        )}
                      </Link>

                      <div className="p-5">
                        <div className="flex items-center justify-between gap-2 text-[11px] text-[#7A5644] mb-1.5">
                          <span>{hamp.subCategory || hamp.category}</span>
                          {typeof hamp.stock === 'number' && (
                            <span>Stok {hamp.stock}</span>
                          )}
                        </div>
                        <Link href={`/product/${hamp.id}`} className="block group-hover:text-[#B05A26] transition-colors">
                          <h3 className="text-base font-semibold text-[#4A2A1C] mb-1 line-clamp-2">
                            {hamp.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-[#7A5644] leading-relaxed mb-4 line-clamp-2">
                          {hamp.description}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-[#B05A26]">
                            {formatIDR(hamp.price)}
                          </span>
                          {hamp.originalPrice && (
                            <span className="text-xs text-[#C9B3A5] line-through">
                              {formatIDR(hamp.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => {
                          if (isOutOfStock) return;
                          addToCart(hamp, 1);
                        }}
                        className="w-full py-2.5 bg-[#FFF6EA] border border-[#B05A26] text-[#B05A26] hover:bg-[#B05A26] hover:text-white disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
                      >
                        {isOutOfStock ? 'Stok Habis' : '+ Masukkan ke Keranjang'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Custom Hamper Builder */}
      <section className="py-14 sm:py-20 bg-white border-t border-[#F2E4D6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">

          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B05A26] block mb-2">
              KREASI SENDIRI
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] tracking-tight mb-2">
              Rancang Paket Hampers Kustom
            </h2>
            <p className="text-xs sm:text-sm text-[#7A5644]">
              Tentukan jenis kotak, tema usia, jumlah buku, dan tulis pesan kartu ucapan untuk orang tersayang.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-[#FFFDF9] border border-[#F2E4D6] rounded-[2px] p-7 sm:p-9">
            {/* Step 1: Pilihan Box */}
            <div className="mb-8">
              <label className="block text-xs font-semibold text-[#4A2A1C] uppercase tracking-wider mb-3">
                1. Pilih Jenis Kemasan / Kotak Kado:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {boxOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setBoxType(opt.id)}
                    className={`p-3.5 border rounded-[2px] text-left transition-all cursor-pointer ${boxType === opt.id
                        ? 'border-[#B05A26] bg-[#FFF6EA]'
                        : 'border-[#E6D2C0] bg-white hover:border-[#B05A26]'
                      }`}
                  >
                    <span className="font-semibold text-xs text-[#4A2A1C] block mb-1">
                      {opt.title}
                    </span>
                    <span className="text-[11px] text-[#B05A26] font-bold block mb-1">
                      {formatIDR(opt.price)}
                    </span>
                    <span className="text-[10px] text-[#7A5644] line-clamp-2">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Tema Usia & Jumlah Buku */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-xs">
              <div>
                <label className="block font-semibold text-[#4A2A1C] uppercase tracking-wider mb-2">
                  2. Tema Usia Anak:
                </label>
                <div className="flex gap-2">
                  {['newborn', 'toddler', 'kids'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className={`flex-1 py-2 rounded-[2px] font-medium capitalize border transition-colors ${theme === t
                          ? 'bg-[#B05A26] text-white border-[#B05A26]'
                          : 'bg-white border-[#E6D2C0] text-[#4A2A1C] hover:border-[#B05A26]'
                        }`}
                    >
                      {t === 'newborn' ? 'Newborn' : t === 'toddler' ? '1–3 th' : '3+ th'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4A2A1C] uppercase tracking-wider mb-2">
                  3. Jumlah Buku Cerita:
                </label>
                <div className="flex gap-2">
                  {[2, 3, 5].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setBookCount(cnt)}
                      className={`flex-1 py-2 rounded-[2px] font-medium border transition-colors ${bookCount === cnt
                          ? 'bg-[#B05A26] text-white border-[#B05A26]'
                          : 'bg-white border-[#E6D2C0] text-[#4A2A1C] hover:border-[#B05A26]'
                        }`}
                    >
                      {cnt} Buku
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Mainan Montessori Toggle */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#F2E4D6]">
              <div>
                <span className="font-semibold text-xs text-[#4A2A1C] block">
                  Tambahkan Mainan Kayu Edukasi (+ Rp 125.000)
                </span>
                <span className="text-[11px] text-[#7A5644]">
                  Rainbow stacker atau teether kayu pinus halus non-toksik
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeToy}
                  onChange={(e) => setIncludeToy(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#B05A26]"></div>
              </label>
            </div>

            {/* Step 4: Kartu Ucapan */}
            <div className="space-y-4 text-xs mb-8">
              <label className="block font-semibold text-[#4A2A1C] uppercase tracking-wider">
                4. Tulisan pada Kartu Ucapan (Gratis):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#7A5644] mb-1">Nama Penerima</label>
                  <input
                    type="text"
                    placeholder="Contoh: Baby Arka & Bunda"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>
                <div>
                  <label className="block text-[#7A5644] mb-1">Dari Pengirim</label>
                  <input
                    type="text"
                    placeholder="Contoh: Om Danu & Tante Rina"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#7A5644] mb-1">Pesan Kartu Ucapan</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Selamat atas kelahiran buah hati tercinta. Semoga tumbuh menjadi anak yang sholeh dan penuh berkah."
                  value={customCardMessage}
                  onChange={(e) => setCustomCardMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                />
              </div>
            </div>

            {/* Total & Action */}
            <div className="pt-6 border-t border-[#F2E4D6] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#7A5644] block">Estimasi Total Paket:</span>
                <span className="text-2xl font-bold text-[#B05A26]">
                  {formatIDR(estimatedTotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddHamperToBag}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#B05A26] hover:bg-[#964B1F] text-white font-semibold text-xs rounded-[2px] transition-colors cursor-pointer shadow-sm"
              >
                {isOrdered ? 'Memasukkan ke Keranjang...' : 'Pesan Hampers Kustom Ini'}
              </button>
            </div>

          </div>

        </div>
      </section>

      <BannerHampers />
    </div>
  );
}

