'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  MessageCircle,
  ArrowRight,
  Heart,
  MessageSquare,
} from 'lucide-react';
import { useProductBySlug, useStorefrontProducts } from '../../../hooks/useProducts';
import { ProductGallery } from '../../../components/product/ProductGallery';
import { ProductCard } from '../../../components/product/ProductCard';
import { formatIDR, formatWeight } from '../../../lib/utils';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';

interface ProductComment {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}

const DEFAULT_COMMENTS: ProductComment[] = [
  {
    id: 'c-1',
    author: 'Bunda Rania (Kota Malang)',
    rating: 5,
    date: '10 Mei 2025',
    text: 'Kualitasnya sangat bagus dan aman untuk anak. Packing dari BabyShalls Malang juga rapi banget pakai pelindung sudut!',
  },
  {
    id: 'c-2',
    author: 'Mama Nadira (Surabaya)',
    rating: 5,
    date: '4 Mei 2025',
    text: 'Si kecil langsung suka dan betah main/baca berlama-lama. Pengiriman via KiriminAja cepat sampai.',
  },
];

function ProductDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: detailData, isLoading: detailLoading } = useProductBySlug(slug);
  const { products: allProducts } = useStorefrontProducts();
  const product = detailData?.product;
  const { addItem, openCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Per-product Verified Buyer Comments State (read-only on public product page; submitted via Detail Pesanan)
  const [comments, setComments] = useState<ProductComment[]>(DEFAULT_COMMENTS);
  const [ratingFilter, setRatingFilter] = useState<'all' | '5'>('all');

  useEffect(() => {
    if (detailData?.reviews && detailData.reviews.length > 0) {
      setComments(
        detailData.reviews.map((r) => ({
          id: r.id,
          author: r.location ? `${r.userName} (${r.location})` : r.userName,
          rating: r.rating,
          date: new Date(r.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          text: r.comment,
        }))
      );
      return;
    }
    if (!product) return;
    try {
      const saved = localStorage.getItem(`babyshalls_comments_${product.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setComments(parsed);
        }
      }
    } catch {
      // localStorage unavailable
    }
  }, [product, detailData]);

  if (detailLoading && !product) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-6 bg-white">
        <p className="text-sm font-semibold text-[#6B7280]">Memuat detail produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-6 bg-white">
        <div className="w-16 h-16 rounded-full bg-[#FAF4E8] flex items-center justify-center text-[#1E543B] mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#1A1A1A]">Produk Tidak Ditemukan</h2>
        <p className="text-sm text-[#6B7280] mt-2 mb-6">
          Buku atau mainan yang Anda cari tidak tersedia atau tautan sudah berpindah.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-[#F5B7A1] text-[#1A1A1A] font-bold text-sm"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
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

  const visibleComments =
    ratingFilter === '5' ? comments.filter((c) => c.rating === 5) : comments;

  const whatsappMessage = encodeURIComponent(
    `Halo BabyShalls Malang, saya ingin tanya mengenai "${product.title}" (${formatIDR(product.price)}). Apakah stok masih tersedia?`
  );

  const relatedProducts = allProducts.filter(
    (p) => p.id !== product.id && (p.ageGroup === product.ageGroup || p.category === product.category)
  ).slice(0, 4);

  return (
    <div className="bg-white py-8 lg:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="text-xs font-semibold text-[#6B7280] flex items-center gap-2">
          <Link href="/" className="hover:text-[#1A1A1A]">Beranda</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-[#1A1A1A]">Katalog</Link>
          <span>/</span>
          <span className="text-[#1A1A1A] truncate">{product.title}</span>
        </nav>

        {/* Main 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Gallery */}
          <div className="lg:col-span-5">
            <ProductGallery
              initialImages={product.images}
              title={product.title}
              category={product.category}
              ageGroup={product.ageGroup}
              discountPercent={discountPercent}
            />
          </div>

          {/* Right: Info & Buy Box */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#FAF4E8] text-[#1A1A1A] text-xs font-bold mb-2">
                {product.category} • {product.ageGroup}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                {product.title}
              </h1>
              {product.authorOrBrand && (
                <p className="text-sm text-[#6B7280] font-medium mt-1">
                  Kurasi oleh {product.authorOrBrand}
                </p>
              )}

              {/* Rating & Stock */}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-semibold">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                  <span className="text-[#1A1A1A] font-bold">{product.rating}</span>
                  <span className="text-[#6B7280]">({comments.length} komentar)</span>
                </div>
                <span className="text-[#E5E7EB]">|</span>
                <span className="text-[#1E543B]">Stok Tersedia: {product.stock} unit</span>
                <span className="text-[#E5E7EB]">|</span>
                <span className="text-[#6B7280]">Berat: {formatWeight(product.weightInGrams)}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#1A1A1A]">
                  {formatIDR(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#9CA3AF] line-through">
                    {formatIDR(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Description & Features */}
            <div className="space-y-3">
              <p className="text-sm text-[#4A4A4A] leading-relaxed">{product.description}</p>
              {product.features && product.features.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
                      <Check className="w-4 h-4 text-[#1E543B] flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quantity, Wishlist & CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <div className="inline-flex items-center justify-between border border-[#E5E7EB] rounded-full h-[44px] px-2 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full hover:bg-[#F8FAFC] flex items-center justify-center text-[#1A1A1A]"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-[#1A1A1A]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 rounded-full hover:bg-[#F8FAFC] flex items-center justify-center text-[#1A1A1A]"
                  aria-label="Tambah jumlah"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 min-h-[44px] px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors ${isAdded
                  ? 'bg-[#E9F3E4] text-[#1E543B]'
                  : 'bg-[#F5B7A1] hover:bg-[#ED9E84] text-[#1A1A1A]'
                  }`}
              >
                {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{isAdded ? 'Berhasil Ditambahkan' : '+ Tambah ke Keranjang'}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="min-h-[44px] px-6 rounded-full bg-[#1A1A1A] hover:bg-[#333333] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Beli Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={wishlisted ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
                className={`min-w-[44px] min-h-[44px] px-3.5 rounded-full border flex items-center justify-center gap-1.5 text-xs font-bold transition-colors ${wishlisted
                  ? 'bg-[#FDECE6] border-[#F5B7A1] text-[#D9483B]'
                  : 'bg-white border-[#E5E7EB] text-[#1A1A1A] hover:bg-[#FDECE6]'
                  }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#D9483B]' : ''}`} />
              </button>
            </div>




          </div>
        </div>

        {/* Spesifikasi Produk */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
          <h2 className="text-sm font-extrabold text-[#1A1A1A] mb-3">Spesifikasi Produk</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#6B7280] block">Kategori</span>
              <span className="font-bold text-[#1A1A1A]">{product.category}</span>
            </div>
            <div>
              <span className="text-[#6B7280] block">Kelompok Usia</span>
              <span className="font-bold text-[#1A1A1A]">{product.ageGroup}</span>
            </div>
            <div>
              <span className="text-[#6B7280] block">Kondisi</span>
              <span className="font-bold text-[#1E543B]">
                {product.isPreloved ? product.condition || 'Preloved Kurasi' : 'Baru (Original)'}
              </span>
            </div>
            <div>
              <span className="text-[#6B7280] block">Berat &amp; Dikirim Dari</span>
              <span className="font-bold text-[#1A1A1A]">
                {formatWeight(product.weightInGrams)} • Malang
              </span>
            </div>
          </div>
        </section>

        {/* Ulasan Pembeli Terverifikasi (Komentar hanya dapat ditulis dari Detail Pesanan seperti Shopee) */}
        <section className="pt-10 border-t border-[#E5E7EB] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#1E543B]" />
              <div>
                <h2 className="text-lg font-extrabold text-[#1A1A1A]">
                  Penilaian &amp; Komentar Pembeli ({visibleComments.length})
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Ulasan ditulis langsung oleh pembeli terverifikasi melalui halaman Detail Pesanan.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRatingFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${ratingFilter === 'all'
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white text-[#4A4A4A] border-[#E5E7EB]'
                  }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setRatingFilter('5')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${ratingFilter === '5'
                  ? 'bg-[#FDF0B8] text-[#1A1A1A] border-[#FCE694]'
                  : 'bg-white text-[#4A4A4A] border-[#E5E7EB]'
                  }`}
              >
                5 Bintang
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleComments.map((comment) => (
              <div
                key={comment.id}
                className="p-5 rounded-2xl border border-[#E5E7EB] bg-white space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#1A1A1A]">{comment.author}</span>
                  <span className="text-[11px] text-[#6B7280]">{comment.date}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(comment.rating)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                  ))}
                </div>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{comment.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-[#E5E7EB] pb-20 lg:pb-0">
            <h2 className="text-2xl font-extrabold text-[#1A1A1A] mb-6">
              Rekomendasi Serupa
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Bottom Action Bar (Shopee/Tokopedia Mobile UX) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] px-4 py-2.5 flex items-center gap-2">
        <a
          href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-[44px] h-[44px] rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#25D366]"
          aria-label="Chat WhatsApp CS"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 h-[44px] rounded-full bg-[#F5B7A1] text-[#1A1A1A] font-bold text-xs"
        >
          {isAdded ? 'Ditambahkan ✓' : '+ Keranjang'}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 h-[44px] rounded-full bg-[#1A1A1A] text-white font-bold text-xs"
        >
          Beli Sekarang
        </button>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-sm font-semibold text-[#6B7280]">
          Memuat detail produk...
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
