'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { ProductCard } from '../../components/product/ProductCard';

export default function WishlistPage() {
  const { wishlistProducts } = useWishlist();

  return (
    <div className="bg-white py-10 lg:py-14 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E7EB] pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Wishlist Saya ({wishlistProducts.length})
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Simpan buku cerita dan mainan kayu incaran si kecil untuk dibeli kapan saja.
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full bg-[#FAF4E8] border border-[#E5E7EB] text-xs font-bold text-[#1A1A1A]"
          >
            <span>Jelajahi Katalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="py-20 text-center bg-[#F8FAFC] border border-[#E5E7EB] rounded-3xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FDECE6] text-[#D9483B] flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-[#1A1A1A]">Wishlist Masih Kosong</h2>
            <p className="text-sm text-[#6B7280] max-w-md mx-auto">
              Klik ikon hati pada kartu produk di Beranda atau Katalog untuk menyimpannya di sini.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center min-h-[44px] px-7 rounded-full bg-[#F5B7A1] hover:bg-[#ED9E84] text-[#1A1A1A] font-bold text-sm transition-colors"
            >
              Mulai Cari Produk →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

