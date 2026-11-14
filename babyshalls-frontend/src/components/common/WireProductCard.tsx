'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Check } from 'lucide-react';

interface WireProductCardProps {
  product: Product;
  className?: string;
}

export const WireProductCard: React.FC<WireProductCardProps> = ({
  product,
  className = '',
}) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const hasDiscount = Boolean(product.discountPercent && product.discountPercent > 0);
  const isPreloved = product.category === 'Preloved Item';

  return (
    <div
      className={`group flex flex-col justify-between text-left transition-all ${className}`}
    >
      {/* Flat Square Tile */}
      <div className="relative aspect-square w-full bg-[#F0F0F0] rounded-[16px] overflow-hidden p-5 flex items-center justify-center">
        <Link
          href={`/product/${product.id}`}
          className="w-full h-full flex items-center justify-center cursor-pointer"
        >
          <img
            src={product.coverImage}
            alt={product.title}
            className="max-h-[88%] max-w-[88%] object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
          {hasDiscount && (
            <span className="bg-[#C0392B] text-white text-[11px] font-semibold px-2 py-0.5 rounded-[4px]">
              -{product.discountPercent}%
            </span>
          )}
          {isPreloved && (
            <span className="bg-[#2A6E37] text-white text-[11px] font-semibold px-2 py-0.5 rounded-[4px]">
              Preloved
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className="w-full py-2.5 bg-[#2B2B2B] hover:bg-[#D9744A] disabled:bg-neutral-300 text-white text-[12px] font-semibold uppercase tracking-wider rounded-[8px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            aria-label={`Tambah ${product.title} ke keranjang`}
          >
            {isAdded ? (
              <>
                <Check size={14} strokeWidth={2} />
                <span>BERHASIL</span>
              </>
            ) : (
              <span>+ KERANJANG</span>
            )}
          </button>
        </div>
      </div>

      {/* Info Below Tile */}
      <div className="mt-3 flex flex-col flex-grow">
        {/* Meta badges row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.ageGroup && (
            <span className="inline-block bg-[#E4ECFB] text-[#3F5FA0] text-[11px] font-medium px-2 py-0.5 rounded-[4px]">
              {product.ageGroup.replace('Years', 'tahun').replace('–', '-')}
            </span>
          )}
          {isPreloved && (
            <span className="inline-block bg-[#DDF1E5] text-[#2A6E37] text-[11px] font-medium px-2 py-0.5 rounded-[4px]">
              Sangat Baik
            </span>
          )}
        </div>

        {/* Title */}
        <Link
          href={`/product/${product.id}`}
          className="group-hover:text-[#D9744A] transition-colors"
        >
          <h3 className="text-[15px] font-medium text-[#2B2B2B] line-clamp-2 mt-1.5 leading-snug">
            {product.title} {product.author ? `– ${product.author}` : ''}
          </h3>
        </Link>

        {/* Price Row */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[16px] font-semibold text-[#2B2B2B]">
            {formatRupiah(product.price)}
          </span>
          {hasDiscount && product.originalPrice && (
            <span className="text-[13px] text-[#8C8C8C] line-through">
              {formatRupiah(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
