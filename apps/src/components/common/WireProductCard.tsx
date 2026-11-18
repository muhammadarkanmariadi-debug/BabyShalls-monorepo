'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Plus, Star } from 'lucide-react';

interface WireProductCardProps {
  product: Product;
  className?: string;
}

export const WireProductCard: React.FC<WireProductCardProps> = ({
  product,
  className = '',
}) => {
  const { addToCart, showToast } = useCart();
  const hasDiscount = Boolean(product.discountPercent && product.discountPercent > 0);
  const isPreloved = product.category === 'Preloved Item' || product.condition === 'preloved';
  const isOutOfStock = product.stock !== undefined ? product.stock <= 0 : product.inStock === false;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    showToast(`"${product.title}" berhasil ditambahkan ke keranjang!`);
  };

  // Format currency
  const formatRupiah = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  // Age label mapping
  const getAgeBadge = (age?: string) => {
    if (!age || age === 'All' || age === 'All Ages') return { label: 'Semua usia', bg: 'bg-[#FFF0E0]', text: 'text-[#B05A26]' };
    if (age.includes('0–1') || age.includes('0–2') || age.toLowerCase().includes('newborn')) {
      return { label: 'Newborn', bg: 'bg-[#FEECE8]', text: 'text-[#C0392B]' };
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

  return (
    <div className={`flex flex-col text-left group ${className}`}>
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full rounded-[2px] overflow-hidden bg-[#F0F0F0] block mb-3 group/img">
        <Link
          href={`/product/${product.id}`}
          className="absolute inset-0 cursor-pointer"
        >
          <Image
            src={product.coverImage || '/images/products/shopee-britannica-150-words.jpg'}
            alt={product.title}
            fill
            className="object-cover object-center group-hover:scale-103 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 282px"
          />
        </Link>

        {/* Discount Badge on top-left of image */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span className="bg-[#C0392B] text-white text-[12px] font-medium px-2 py-0.5 rounded-[2px]">
              -{product.discountPercent}%
            </span>
          </div>
        )}

        {/* Out of Stock Overlay Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/65 text-white text-xs sm:text-sm font-medium flex items-center justify-center shadow-sm">
              Habis
            </span>
          </div>
        )}

        {/* Quick Add Button */}
        {!isOutOfStock && (
          <button
            onClick={handleQuickAdd}
            type="button"
            aria-label={`Tambah ${product.title} ke keranjang`}
            className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 z-10 bg-[#B05A26] hover:bg-[#8D441B] text-white p-1.5 sm:p-2.5 rounded-full shadow-md flex items-center justify-center transition-all duration-200 opacity-95 sm:opacity-0 group-hover:opacity-100 hover:scale-108 active:scale-95"
            title="Tambah ke Keranjang"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Tags row: Age Badge + Preloved Condition */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap mb-1.5 sm:mb-2">
        <span className={`${ageBadge.bg} ${ageBadge.text} text-[11px] sm:text-[13px] font-medium px-2 sm:px-2.5 py-0.5 rounded-[2px]`}>
          {ageBadge.label}
        </span>

        {isPreloved && (
          <span className="border border-[#2A6E37] text-[#2A6E37] text-[11px] sm:text-[13px] font-normal px-1.5 sm:px-2 py-0.5 rounded-[2px]">
            Sangat Baik
          </span>
        )}
      </div>

      {/* Product Title */}
      <Link href={`/product/${product.id}`} className="group-hover:text-[#B05A26] transition-colors">
        <h3 className="text-[14px] sm:text-[16px] font-medium text-[#4A2A1C] leading-[1.35] line-clamp-2 mb-1">
          {product.title}
        </h3>
      </Link>

      {/* Star Rating */}
      <div className="flex items-center gap-1 text-[11px] sm:text-[12px] text-[#7A5644] mb-1.5">
        <div className="flex items-center text-[#E0A020]">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.round(product.rating ?? 5) ? 'fill-current' : 'text-[#E6D2C0]'
              }`}
            />
          ))}
        </div>
        <span className="font-semibold text-[#4A2A1C]">{(product.rating ?? 5).toFixed(1)}</span>
        <span>({product.reviewsCount ?? 0})</span>
      </div>

      {/* Price row */}
      <div className="flex items-baseline gap-1.5 sm:gap-2 mt-auto">
        <span className="text-[15px] sm:text-[18px] font-semibold text-[#4A2A1C]">
          {formatRupiah(product.price)}
        </span>

        {product.originalPrice && (
          <span className="text-[11px] sm:text-[13px] font-normal text-[#C9B3A5] line-through">
            {formatRupiah(product.originalPrice)}
          </span>
        )}
      </div>
    </div>
  );
};
