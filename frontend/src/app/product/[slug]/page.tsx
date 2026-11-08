'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Star,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  ShoppingCart,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  ThumbsUp,
} from 'lucide-react';
import { PRODUCTS } from '../../../data/products';
import { ProductGallery } from '../../../components/product/ProductGallery';
import { ProductCard } from '../../../components/product/ProductCard';
import { formatIDR, formatWeight } from '../../../lib/utils';
import { useCart } from '../../../context/CartContext';

function ProductDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const product = PRODUCTS.find((p) => p.slug === slug);
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeReviewFilter, setActiveReviewFilter] = useState<'all' | '5' | 'with-text'>('all');

  if (!product) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 rounded-full bg-[#FFE4D0] flex items-center justify-center text-[#DA7A5B] mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#502E1E]">Produk Tidak Ditemukan</h2>
        <p className="text-sm text-[#8FA87E] mt-2 mb-6">
          Buku atau mainan yang Anda cari tidak tersedia atau tautan sudah berpindah.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#DA7A5B] text-white font-bold text-sm shadow-subtle hover:bg-[#C46749] transition-all"
        >
          <span>Kembali ke Katalog</span>
        </Link>
      </div>
    );
  }

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : undefined;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    openCart();
  };

  const whatsappMessage = encodeURIComponent(
    `Halo BabyShalls Malang, saya ingin tanya mengenai "${product.title}" (${formatIDR(product.price)}). Apakah stok masih tersedia?`
  );

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.ageGroup === product.ageGroup || p.category === product.category)
  ).slice(0, 4);

  return (
    <div className="py-5 sm:py-8 bg-[#F8F5F0] min-h-screen text-[#4A2F20]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-6">
        
        {/* 1. Shopee-Style Breadcrumbs Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#8A6A55] overflow-x-auto whitespace-nowrap py-1">
          <Link href="/" className="hover:text-[#DA7A5B] transition-colors">
            Beranda
          </Link>
          <span>&gt;</span>
          <Link href="/catalog" className="hover:text-[#DA7A5B] transition-colors">
            Katalog
          </Link>
          <span>&gt;</span>
          <Link href={`/catalog?category=${encodeURIComponent(product.category)}`} className="hover:text-[#DA7A5B] transition-colors">
            {product.category}
          </Link>
          <span>&gt;</span>
          <span className="text-[#502E1E] font-medium truncate max-w-[220px] sm:max-w-none">
            {product.title}
          </span>
        </nav>

        {/* 2. Shopee-Style Main Product Card (Airy, Unboxed, Wide) */}
        <div className="bg-white rounded-xl border border-[#EEDBC9]/80 shadow-2xs p-5 sm:p-7 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Left Column: Gallery (5 cols, ~420px) */}
            <div className="lg:col-span-5">
              <ProductGallery
                initialImages={product.images}
                title={product.title}
                category={product.category}
                ageGroup={product.ageGroup}
                discountPercent={discountPercent}
              />
            </div>

            {/* Right Column: Shopee-Style Product Info & Actions (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Official Boutique Tag & Title */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#DA7A5B] text-white text-[11px] font-bold uppercase tracking-wider">
                    Official Store
                  </span>
                  <span className="text-xs font-semibold text-[#8A6A55]">
                    {product.category} • {product.authorOrBrand || 'Kurasi BabyShalls'}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-[#3E2415] leading-snug">
                  {product.title}
                </h1>
              </div>

              {/* Shopee-Style Rating & Sold Stats Row */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs pb-3 border-b border-[#F0E4D8]">
                {/* Rating score */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[#DA7A5B] font-extrabold text-sm border-b border-[#DA7A5B] pb-0.5">
                    {product.rating.toFixed(1)}
                  </span>
                  <div className="flex items-center text-[#F6C95E]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F6C95E]" />
                    ))}
                  </div>
                </div>

                <div className="w-px h-3.5 bg-[#D8C7B8]" />

                {/* Reviews count */}
                <div className="text-[#4A2F20]">
                  <span className="font-bold border-b border-[#4A2F20] pb-0.5">
                    {product.reviewsCount}
                  </span>{' '}
                  <span className="text-[#8A6A55]">Penilaian</span>
                </div>

                <div className="w-px h-3.5 bg-[#D8C7B8]" />

                {/* Sold count */}
                <div className="text-[#4A2F20]">
                  <span className="font-bold">140+</span>{' '}
                  <span className="text-[#8A6A55]">Terjual</span>
                </div>
              </div>

              {/* Shopee-Style Price Banner (Soft Peach Background) */}
              <div className="bg-[#FFF6F0] rounded-lg p-4 sm:p-5 flex flex-wrap items-baseline gap-3 border border-[#FADCC8]">
                {product.originalPrice && (
                  <span className="text-sm text-[#997A68] line-through font-medium">
                    {formatIDR(product.originalPrice)}
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-bold text-[#DA7A5B]">
                  {formatIDR(product.price)}
                </span>
                {discountPercent && (
                  <span className="px-2 py-0.5 rounded bg-[#DA7A5B] text-white text-[11px] font-extrabold uppercase">
                    {discountPercent}% OFF
                  </span>
                )}
                <span className="text-xs font-semibold text-[#709154] ml-auto">
                  ✓ Stok Tersedia ({product.stock} pcs)
                </span>
              </div>

              {/* Shopee-Style Tabular Attributes */}
              <div className="space-y-3.5 text-xs text-[#4A2F20] pt-1">
                
                {/* Row: Pengiriman */}
                <div className="grid grid-cols-12 gap-2 items-start">
                  <span className="col-span-3 sm:col-span-2.5 text-[#8A6A55] font-medium pt-0.5">
                    Pengiriman
                  </span>
                  <div className="col-span-9 sm:col-span-9.5 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#3E2415]">
                      <Truck className="w-4 h-4 text-[#DA7A5B] flex-shrink-0" />
                      <span>Dikirim dari Kota Malang, Jawa Timur</span>
                    </div>
                    <p className="text-[11px] text-[#8A6A55]">
                      Ongkos Kirim otomatis terhitung via KiriminAja (JNE, SiCepat, J&T). Garansi tiba aman.
                    </p>
                  </div>
                </div>

                {/* Row: Rekomendasi Usia */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-3 sm:col-span-2.5 text-[#8A6A55] font-medium">
                    Usia Anak
                  </span>
                  <div className="col-span-9 sm:col-span-9.5 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-md bg-[#FFF0E6] border border-[#F6B79B] text-[#DA7A5B] font-bold text-xs">
                      {product.ageGroup}
                    </span>
                    <span className="text-[11px] text-[#8A6A55]">
                      Kurasi stimulasi tumbuh kembang ideal
                    </span>
                  </div>
                </div>

                {/* Row: Keunggulan Bahan */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-3 sm:col-span-2.5 text-[#8A6A55] font-medium">
                    Kualitas
                  </span>
                  <div className="col-span-9 sm:col-span-9.5 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 rounded bg-[#EBF2E0] text-[#709154] font-semibold text-[11px]">
                      ✓ 100% Non-Toxic & SNI
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-[#FCF6EC] text-[#8A6A55] font-semibold text-[11px]">
                      ✓ Free Gift Wrapping
                    </span>
                  </div>
                </div>

                {/* Row: Kuantitas */}
                <div className="grid grid-cols-12 gap-2 items-center pt-2">
                  <span className="col-span-3 sm:col-span-2.5 text-[#8A6A55] font-medium">
                    Kuantitas
                  </span>
                  <div className="col-span-9 sm:col-span-9.5 flex items-center gap-4">
                    <div className="flex items-center border border-[#D8C7B8] rounded bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center text-[#4A2F20] hover:bg-[#F8F5F0] transition-colors border-r border-[#D8C7B8]"
                        aria-label="Kurang"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-11 text-center text-xs font-bold text-[#3E2415]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-8 h-8 flex items-center justify-center text-[#4A2F20] hover:bg-[#F8F5F0] transition-colors border-l border-[#D8C7B8]"
                        aria-label="Tambah"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[11px] text-[#8A6A55]">
                      Tersisa {product.stock} buah • Berat: <strong>{formatWeight(product.weightInGrams * quantity)}</strong>
                    </span>
                  </div>
                </div>

              </div>

              {/* Shopee-Style Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                {/* Button 1: Masukkan Keranjang */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 min-w-[200px] py-3 px-5 rounded-lg border-2 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs ${
                    isAdded
                      ? 'border-[#709154] bg-[#709154] text-white'
                      : 'border-[#DA7A5B] bg-[#FFF5EE] hover:bg-[#FFEBDC] text-[#DA7A5B]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Masuk Keranjang!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Masukkan Keranjang</span>
                    </>
                  )}
                </button>

                {/* Button 2: Beli Sekarang */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 min-w-[160px] py-3 px-6 rounded-lg bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
                >
                  Beli Sekarang
                </button>

                {/* Button 3: WhatsApp direct consultation */}
                <a
                  href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-lg bg-[#EBF7EE] border border-[#25D366]/40 hover:border-[#25D366] text-[#1E7E34] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  title="Tanya CS via WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Chat Penjual</span>
                </a>
              </div>

              {/* Shopee-Style Guarantee Bar */}
              <div className="pt-2 border-t border-[#F0E4D8] flex items-center gap-2 text-xs text-[#8A6A55]">
                <ShieldCheck className="w-4 h-4 text-[#DA7A5B] flex-shrink-0" />
                <span>
                  <strong>Garansi BabyShalls:</strong> Dapatkan barang sesuai pesanan atau uang kembali 100%.
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* 3. Shopee-Style Specifications & Description (Full Width White Card) */}
        <div className="bg-white rounded-xl border border-[#EEDBC9]/80 p-6 sm:p-8 shadow-2xs space-y-7">
          
          {/* Section A: Spesifikasi Produk */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#3E2415] bg-[#FCF6EC] px-4 py-2.5 rounded-lg mb-4">
              Spesifikasi Produk
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-y-3 gap-x-4 text-xs text-[#4A2F20] px-2">
              <div className="sm:col-span-3 text-[#8A6A55]">Kategori</div>
              <div className="sm:col-span-9 font-semibold text-[#DA7A5B]">Buku Anak &gt; {product.category}</div>

              <div className="sm:col-span-3 text-[#8A6A55]">Rekomendasi Usia</div>
              <div className="sm:col-span-9 font-semibold">{product.ageGroup}</div>

              <div className="sm:col-span-3 text-[#8A6A55]">Dikirim Dari</div>
              <div className="sm:col-span-9 font-semibold">Jl. Cempaka No. 12, Klojen, Kota Malang, Jawa Timur</div>

              <div className="sm:col-span-3 text-[#8A6A55]">Material / Bahan</div>
              <div className="sm:col-span-9 font-semibold">Kertas Papan Tebal Ramah Bayi (Anti Gigit & Sobek) / Kayu Alami</div>

              <div className="sm:col-span-3 text-[#8A6A55]">Sertifikasi Keamanan</div>
              <div className="sm:col-span-9 font-semibold text-[#709154]">SNI & EN71 Non-Toxic Certified</div>

              <div className="sm:col-span-3 text-[#8A6A55]">Berat Bersih</div>
              <div className="sm:col-span-9 font-semibold">{formatWeight(product.weightInGrams)}</div>

              <div className="sm:col-span-3 text-[#8A6A55]">Stok Siap Kirim</div>
              <div className="sm:col-span-9 font-semibold">{product.stock} buah</div>
            </div>
          </div>

          {/* Section B: Deskripsi Produk */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#3E2415] bg-[#FCF6EC] px-4 py-2.5 rounded-lg mb-4">
              Deskripsi Produk
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-[#4A2F20] leading-relaxed px-2">
              <p>{product.description}</p>

              {product.features && product.features.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-[#3E2415]">Keunggulan & Manfaat Produk:</h4>
                  <ul className="space-y-1.5 pl-1">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#709154] flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-3.5 rounded-lg bg-[#FFF9F0] border border-[#EEDBC9] text-xs text-[#6B3F2A] space-y-1 mt-4">
                <span className="font-bold text-[#DA7A5B] block">Catatan Butik BabyShalls:</span>
                <p>
                  Setiap pesanan buku anak dan mainan edukasi dicek secara manual (Quality Control kurasi) sebelum dikirim, dibungkus plastik pelindung, serta dilapisi kardus tebal dan bubble wrap tanpa biaya tambahan.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 5. Shopee-Style Customer Reviews (Penilaian Produk) */}
        <div className="bg-white rounded-xl border border-[#EEDBC9]/80 p-6 sm:p-8 shadow-2xs space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#3E2415] bg-[#FCF6EC] px-4 py-2.5 rounded-lg">
            Penilaian Produk
          </h2>

          {/* Rating Summary Box */}
          <div className="bg-[#FFF6F0] border border-[#FADCC8] rounded-xl p-5 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center sm:text-left sm:pr-6 sm:border-r border-[#EEDBC9]">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#DA7A5B]">
                {product.rating.toFixed(1)} <span className="text-base text-[#8A6A55]">dari 5</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start text-[#F6C95E] gap-1 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F6C95E]" />
                ))}
              </div>
              <span className="text-xs text-[#8A6A55] font-semibold">
                {product.reviewsCount} Ulasan Terverifikasi
              </span>
            </div>

            {/* Filter review chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveReviewFilter('all')}
                className={`px-3.5 py-1.5 rounded border transition-colors ${
                  activeReviewFilter === 'all'
                    ? 'border-[#DA7A5B] text-[#DA7A5B] bg-white font-bold shadow-2xs'
                    : 'border-[#D8C7B8] text-[#4A2F20] bg-white hover:bg-[#F8F5F0]'
                }`}
              >
                Semua ({product.reviewsCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveReviewFilter('5')}
                className={`px-3.5 py-1.5 rounded border transition-colors ${
                  activeReviewFilter === '5'
                    ? 'border-[#DA7A5B] text-[#DA7A5B] bg-white font-bold shadow-2xs'
                    : 'border-[#D8C7B8] text-[#4A2F20] bg-white hover:bg-[#F8F5F0]'
                }`}
              >
                5 Bintang ({product.reviewsCount - 2})
              </button>
              <button
                type="button"
                onClick={() => setActiveReviewFilter('with-text')}
                className={`px-3.5 py-1.5 rounded border transition-colors ${
                  activeReviewFilter === 'with-text'
                    ? 'border-[#DA7A5B] text-[#DA7A5B] bg-white font-bold shadow-2xs'
                    : 'border-[#D8C7B8] text-[#4A2F20] bg-white hover:bg-[#F8F5F0]'
                }`}
              >
                Dengan Komentar (38)
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4 pt-2">
            {/* Review 1 */}
            <div className="border-b border-[#F0E4D8] pb-4 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#EBF2E0] text-[#709154] font-bold flex items-center justify-center text-xs">
                  S
                </div>
                <span className="font-bold text-[#3E2415]">sarah_malang</span>
                <span className="text-[#8A6A55]">• 2 hari lalu</span>
              </div>
              <div className="flex items-center text-[#F6C95E] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#F6C95E]" />
                ))}
              </div>
              <div className="text-[#8A6A55]">Variasi: {product.title} (Newborn+)</div>
              <p className="text-[#4A2F20] pt-1">
                Bukunya sangat bagus dan tebal, anak saya suka sekali gambarnya kontras dan halamannya tidak gampang rusak walau digigit. Packing rapi langsung sampai sesama Malang. Terima kasih BabyShalls!
              </p>
              <div className="flex items-center gap-1 text-[11px] text-[#8A6A55] pt-1">
                <ThumbsUp className="w-3 h-3 text-[#DA7A5B]" />
                <span>Membantu (4)</span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="border-b border-[#F0E4D8] pb-4 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#FFE4D0] text-[#DA7A5B] font-bold flex items-center justify-center text-xs">
                  R
                </div>
                <span className="font-bold text-[#3E2415]">rani_surabaya</span>
                <span className="text-[#8A6A55]">• 1 minggu lalu</span>
              </div>
              <div className="flex items-center text-[#F6C95E] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#F6C95E]" />
                ))}
              </div>
              <div className="text-[#8A6A55]">Variasi: {product.title} (Ages 1-3)</div>
              <p className="text-[#4A2F20] pt-1">
                Puas banget belanja di sini, kurasi bukunya berkelas dan edukatif. Pelayanan CS ramah dan pengiriman sangat cepat. Sangat direkomendasikan untuk kado anak!
              </p>
              <div className="flex items-center gap-1 text-[11px] text-[#8A6A55] pt-1">
                <ThumbsUp className="w-3 h-3 text-[#DA7A5B]" />
                <span>Membantu (7)</span>
              </div>
            </div>
          </div>

        </div>

        {/* 6. Shopee-Style Related Products (Produk Serupa / Rekomendasi Toko) */}
        {relatedProducts.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#3E2415]">
                Produk Serupa dari Toko Ini
              </h3>
              <Link
                href="/catalog"
                className="text-xs font-bold text-[#DA7A5B] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm font-bold text-[#DA7A5B]">Memuat rincian produk...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
