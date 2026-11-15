'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  Heart,
  Truck,
  Package,
  Gift,
  Store,
  Star,
  ChevronDown,
  ChevronUp,
  Check,
  Share2,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TombolKembali } from '@/components/common/TombolKembali';
import { WireProductCard } from '@/components/common/WireProductCard';
import { BannerHampers } from '@/components/home/BannerHampers';
import { mockProducts, formatIDR } from '@/data/mockProducts';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();

  const id = typeof params?.id === 'string' ? params.id : '';

  // Get active product (support both mock and localStorage)
  const product: Product | undefined = useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('babyshalls_catalog_data');
        if (saved) {
          const list: Product[] = JSON.parse(saved);
          const found = list.find((p) => p.id === id || p.slug === id || p.id.toLowerCase() === id.toLowerCase());
          if (found) return found;
        }
      } catch {
        // fallback
      }
    }
    return (
      mockProducts.find((p) => p.id === id || p.slug === id || p.id.toLowerCase() === id.toLowerCase()) ||
      mockProducts[0]
    );
  }, [id]);

  const [selectedImage, setSelectedImage] = useState<string>(product?.coverImage || product?.images?.[0] || '/images/prod-boardbook.jpg');
  const [selectedFormat, setSelectedFormat] = useState<string>('Board Book');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  // Accordions open/close state
  const [openSection, setOpenSection] = useState<'desc' | 'specs' | 'shipping'>('desc');

  useEffect(() => {
    if (product) {
      setSelectedImage(product.coverImage || product.images?.[0] || '/images/prod-boardbook.jpg');
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <p className="text-2xl font-medium text-[#4A2A1C]">Produk Tidak Ditemukan</p>
          <Link href="/shop" className="mt-4 inline-block text-sm text-[#B05A26] underline">
            Kembali ke Katalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Thumbnails gallery
  const galleryImages: string[] = [
    product.coverImage || product.images?.[0] || '/images/prod-boardbook.jpg',
    ...(product.images && product.images.length > 1
      ? product.images.slice(1)
      : [
          '/images/preloved/preloved-sampul.png',
          '/images/preloved/preloved-halaman-dalam.png',
          '/images/preloved/preloved-detail-cacat.png',
          '/images/store/toko-area-bermain.png',
        ]),
  ].filter(Boolean) as string[];

  // Age label mapping
  const getAgeBadge = (age?: string) => {
    if (!age || age === 'All' || age === 'All Ages') return { label: 'Semua usia', bg: 'bg-[#FFF0E0]', text: 'text-[#B05A26]' };
    if (age.includes('0–1') || age.includes('0–2') || age.toLowerCase().includes('newborn')) {
      return { label: 'Newborn (0–1 th)', bg: 'bg-[#FEECE8]', text: 'text-[#C0392B]' };
    }
    if (age.includes('1–3') || age.includes('1-3')) {
      return { label: '1–3 tahun', bg: 'bg-[#FFF3D6]', text: 'text-[#9A6500]' };
    }
    if (age.includes('3–5') || age.includes('3+')) {
      return { label: '3+ tahun', bg: 'bg-[#DDF1E5]', text: 'text-[#2A6E37]' };
    }
    if (age.includes('6+')) {
      return { label: '6+ tahun', bg: 'bg-[#E3EDF9]', text: 'text-[#2C5282]' };
    }
    return { label: age, bg: 'bg-[#DDF1E5]', text: 'text-[#2A6E37]' };
  };

  const ageBadge = getAgeBadge(product.ageGroup);
  const isPreloved = product.category === 'Preloved Item' || product.condition === 'preloved';
  const hasDiscount = Boolean(product.discountPercent && product.discountPercent > 0);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const relatedProducts = mockProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <TombolKembali fallbackUrl="/shop" label="Kembali ke Katalog" />

      {/* Breadcrumb Navigation (Figma #135:898) */}
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-8 py-5">
        <nav className="flex items-center gap-2 text-[13px] text-[#7A5644] overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:underline">Beranda</Link>
          <span>/</span>
          <Link href="/shop" className="hover:underline">Buku</Link>
          <span>/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:underline">
            {product.category}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#4A2A1C] truncate max-w-xs">{product.title}</span>
        </nav>
      </div>

      {/* Main Product Section (Figma #135:900) */}
      <section className="pb-16 max-w-[1200px] w-full mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-14 items-start">
          
          {/* Left Column: Image Gallery (Figma #135:901, 600px width) */}
          <div className="w-full lg:w-[580px] shrink-0">
            {/* Main Image */}
            <div className="relative aspect-square w-full rounded-[2px] overflow-hidden bg-[#F0F0F0] mb-4">
              <Image
                src={selectedImage || product.coverImage || product.images?.[0] || '/images/prod-boardbook.jpg'}
                alt={product.title}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 580px"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-[#C0392B] text-white text-xs font-semibold px-2.5 py-1 rounded-[2px]">
                    -{product.discountPercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-[2px] overflow-hidden bg-[#F0F0F0] shrink-0 border-2 transition-all cursor-pointer ${
                    selectedImage === img
                      ? 'border-[#B05A26] opacity-100'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>

            {/* Preloved notice if applicable */}
            {isPreloved && (
              <div className="mt-4 p-3 bg-[#FFFBF7] border border-[#E6D2C0] rounded-[2px] text-xs text-[#7A5644] flex items-center gap-2">
                <Store className="w-4 h-4 text-[#B05A26] shrink-0" />
                <span>
                  <strong>Foto Asli Buku Preloved:</strong> Buku ini adalah koleksi preloved yang telah lolos kurasi kebersihan dan kelayakan baca tim BabyShalls.
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Product Information (Figma #135:917, 552px width) */}
          <div className="flex-1 w-full flex flex-col">
            
            {/* Badges Row */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className={`${ageBadge.bg} ${ageBadge.text} text-xs font-semibold px-2.5 py-1 rounded-[2px]`}>
                {ageBadge.label}
              </span>
              <span className="bg-[#FFF6EA] text-[#7A5644] border border-[#E6D2C0] text-xs font-medium px-2.5 py-1 rounded-[2px]">
                {product.category}
              </span>
              {isPreloved ? (
                <span className="border border-[#2A6E37] text-[#2A6E37] text-xs font-medium px-2.5 py-1 rounded-[2px]">
                  Preloved · Sangat Baik
                </span>
              ) : (
                <span className="bg-[#EBF7EE] text-[#2A6E37] text-xs font-medium px-2.5 py-1 rounded-[2px]">
                  Buku Baru
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] leading-tight mb-2 tracking-tight">
              {product.title}
            </h1>

            {/* Author / Subtitle */}
            <p className="text-sm text-[#7A5644] mb-3">
              karya <span className="font-medium text-[#4A2A1C]">{product.author}</span> · {product.publisher || 'BabyShalls Curated'} ({product.publicationYear || '2024'})
            </p>

            {/* Star Rating & Sold Count */}
            <div className="flex items-center gap-2 text-xs text-[#7A5644] mb-5">
              <div className="flex items-center text-[#E0A020]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-semibold text-[#4A2A1C]">4.9</span>
              <span>(18 ulasan pembaca)</span>
              <span>•</span>
              <span>Terjual 64</span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-[#F2E4D6] mb-6">
              <span className="text-3xl font-bold text-[#4A2A1C]">
                {formatIDR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-[#C9B3A5] line-through font-normal">
                  {formatIDR(product.originalPrice)}
                </span>
              )}
              {hasDiscount && (
                <span className="bg-[#C0392B] text-white text-xs font-semibold px-2 py-0.5 rounded-[2px]">
                  Hemat {product.discountPercent}%
                </span>
              )}
            </div>

            {/* Format Selection */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-[#4A2A1C] mb-2 uppercase tracking-wider">
                Pilihan Format:
              </label>
              <div className="flex items-center gap-2">
                {['Board Book', 'Paperback', 'Hardcover'].map((fmt) => {
                  const isActive = selectedFormat === fmt;
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setSelectedFormat(fmt)}
                      className={`px-4 py-2 text-xs font-medium rounded-[2px] transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#B05A26] text-white border border-[#B05A26]'
                          : 'bg-white text-[#4A2A1C] border border-[#E6D2C0] hover:border-[#B05A26]'
                      }`}
                    >
                      {fmt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock Alert */}
            <div className="flex items-center gap-2 text-xs text-[#2A6E37] font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-[#2A6E37] animate-pulse"></span>
              <span>Stok tersedia di Toko Citraland Malang (sisa 4 buku)</span>
            </div>

            {/* Quantity Stepper & CTAs */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-[#E6D2C0] rounded-[2px] bg-white h-12 w-28 sm:w-36 shrink-0 justify-between px-2 sm:px-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-lg text-[#7A5644] hover:text-[#B05A26] font-medium px-1.5 cursor-pointer"
                    aria-label="Kurang satu"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold text-[#4A2A1C] min-w-[20px] text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-lg text-[#7A5644] hover:text-[#B05A26] font-medium px-1.5 cursor-pointer"
                    aria-label="Tambah satu"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-[#B05A26] hover:bg-[#964B1F] text-white font-medium text-xs sm:text-sm rounded-[2px] transition-colors flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm px-3 sm:px-4"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Ditambahkan!</span>
                    </>
                  ) : (
                    <span>+ Tambah Keranjang</span>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Wishlist"
                  className={`h-12 w-12 border rounded-[2px] flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    isWishlisted
                      ? 'border-[#C0392B] bg-[#FFF0F0] text-[#C0392B]'
                      : 'border-[#E6D2C0] text-[#7A5644] hover:text-[#B05A26] hover:border-[#B05A26]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Buy Now Full-Width */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-12 border border-[#4A2A1C] text-[#4A2A1C] hover:bg-[#FFF6EA] font-medium text-sm rounded-[2px] transition-colors cursor-pointer flex items-center justify-center"
              >
                Beli Sekarang
              </button>
            </div>

            {/* Benefit Highlights List (Figma Benefits) */}
            <div className="bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] p-4 flex flex-col gap-3 mb-8 text-xs text-[#4A2A1C]">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-[#B05A26] shrink-0" />
                <span>Dikirim langsung dari <strong>Citraland Puncak Tidar, Kota Malang</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-[#B05A26] shrink-0" />
                <span>Berat produk: <strong>± 350 gram</strong> (packing aman dengan bubble wrap ganda)</span>
              </div>
              <div className="flex items-center gap-3">
                <Gift className="w-4 h-4 text-[#B05A26] shrink-0" />
                <span>Bisa request <strong>bungkus kado & kartu ucapan gratis</strong> di checkout</span>
              </div>
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4 text-[#B05A26] shrink-0" />
                <span>Tersedia opsi <strong>Ambil di Toko (Self Pick-up)</strong> tanpa biaya ongkir</span>
              </div>
            </div>

            {/* Accordions (Deskripsi, Spesifikasi, Pengiriman) */}
            <div className="border-t border-[#F2E4D6]">
              {/* Accordion 1: Deskripsi */}
              <div className="border-b border-[#F2E4D6]">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'desc' ? ('' as any) : 'desc')}
                  className="w-full py-4 flex items-center justify-between text-left text-sm font-semibold text-[#4A2A1C] hover:text-[#B05A26] transition-colors cursor-pointer"
                >
                  <span>Deskripsi Buku & Manfaat Belajar</span>
                  {openSection === 'desc' ? (
                    <ChevronUp className="w-4 h-4 text-[#7A5644]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7A5644]" />
                  )}
                </button>
                {openSection === 'desc' && (
                  <div className="pb-5 text-sm text-[#7A5644] leading-relaxed space-y-3">
                    <p>{product.description}</p>
                    <p>
                      Buku ini sangat cocok untuk melatih fokus visual, memperkaya kosakata dasar anak, serta membangun kebiasaan membaca sejak dini bersama orang tua. Halaman tebal dirancang khusus agar tahan dibolak-balik tangan mungil si kecil.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Spesifikasi */}
              <div className="border-b border-[#F2E4D6]">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'specs' ? ('' as any) : 'specs')}
                  className="w-full py-4 flex items-center justify-between text-left text-sm font-semibold text-[#4A2A1C] hover:text-[#B05A26] transition-colors cursor-pointer"
                >
                  <span>Detail & Spesifikasi Lengkap</span>
                  {openSection === 'specs' ? (
                    <ChevronUp className="w-4 h-4 text-[#7A5644]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7A5644]" />
                  )}
                </button>
                {openSection === 'specs' && (
                  <div className="pb-5 text-xs text-[#4A2A1C]">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr className="border-b border-[#F9EAE1]">
                          <td className="py-2 text-[#7A5644] w-1/3">Judul Buku</td>
                          <td className="py-2 font-medium">{product.title}</td>
                        </tr>
                        <tr className="border-b border-[#F9EAE1]">
                          <td className="py-2 text-[#7A5644]">Penulis</td>
                          <td className="py-2 font-medium">{product.author}</td>
                        </tr>
                        <tr className="border-b border-[#F9EAE1]">
                          <td className="py-2 text-[#7A5644]">Penerbit</td>
                          <td className="py-2 font-medium">{product.publisher || 'BabyShalls Books'}</td>
                        </tr>
                        <tr className="border-b border-[#F9EAE1]">
                          <td className="py-2 text-[#7A5644]">Tahun Terbit</td>
                          <td className="py-2 font-medium">{product.publicationYear || '2024'}</td>
                        </tr>
                        <tr className="border-b border-[#F9EAE1]">
                          <td className="py-2 text-[#7A5644]">Kategori Usia</td>
                          <td className="py-2 font-medium">{ageBadge.label}</td>
                        </tr>
                        <tr className="border-b border-[#F9EAE1]">
                          <td className="py-2 text-[#7A5644]">Format / Halaman</td>
                          <td className="py-2 font-medium">{selectedFormat} · 24 halaman tebal</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-[#7A5644]">Bahasa</td>
                          <td className="py-2 font-medium">Bilingual / Bahasa Indonesia & Inggris</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Accordion 3: Pengiriman */}
              <div className="border-b border-[#F2E4D6]">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'shipping' ? ('' as any) : 'shipping')}
                  className="w-full py-4 flex items-center justify-between text-left text-sm font-semibold text-[#4A2A1C] hover:text-[#B05A26] transition-colors cursor-pointer"
                >
                  <span>Pengiriman & Kebijakan Toko</span>
                  {openSection === 'shipping' ? (
                    <ChevronUp className="w-4 h-4 text-[#7A5644]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7A5644]" />
                  )}
                </button>
                {openSection === 'shipping' && (
                  <div className="pb-5 text-sm text-[#7A5644] leading-relaxed space-y-2">
                    <p>
                      Pesanan yang masuk sebelum pukul 15.00 WIB akan dikirim pada hari yang sama. Kami melayani pengiriman ke seluruh Indonesia via JNE, J&T, SiCepat, serta instant kurir (GoSend) untuk area Malang Raya.
                    </p>
                    <p>
                      <strong>Garansi BabyShalls:</strong> Jika buku yang diterima mengalami cacat cetak atau rusak dalam perjalanan, kami siap mengganti dengan buku baru atau refund 100% dengan melampirkan video unboxing dalam waktu 2x24 jam.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Rekomendasi Section (Figma #135:1031) */}
      <section className="bg-[#FFFBF7] py-14 border-t border-[#F2E4D6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-medium text-[#4A2A1C] tracking-tight">
              Mungkin Kamu Juga Suka
            </h2>
            <Link
              href="/shop"
              className="text-sm font-medium text-[#B05A26] hover:underline"
            >
              Lihat Semua Buku →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
            {relatedProducts.map((rel) => (
              <WireProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner Hampers (Figma #150:1337) */}
      <BannerHampers />

      <Footer />
    </div>
  );
}
