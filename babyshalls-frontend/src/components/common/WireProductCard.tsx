'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface WireProductCardProps {
  product: Product;
  className?: string;
}

export const WireProductCard: React.FC<WireProductCardProps> = ({
  product,
  className = '',
}) => {
  const hasDiscount = Boolean(product.discountPercent && product.discountPercent > 0);
  const isPreloved = product.category === 'Preloved Item' || product.condition === 'preloved';

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
      <Link
        href={`/product/${product.id}`}
        className="relative aspect-square w-full rounded-[2px] overflow-hidden bg-[#F0F0F0] block cursor-pointer mb-3"
      >
        <Image
          src={product.coverImage || '/images/products/p-1-little-bear.png'}
          alt={product.title}
          fill
          className="object-cover object-center group-hover:scale-103 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 282px"
        />

        {/* Discount Badge on top-left of image */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-[#C0392B] text-white text-[12px] font-medium px-2 py-0.5 rounded-[2px]">
              -{product.discountPercent}%
            </span>
          </div>
        )}
      </Link>

      {/* Tags row: Age Badge + Preloved Condition */}
      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        <span className={`${ageBadge.bg} ${ageBadge.text} text-[13px] font-medium px-2.5 py-0.5 rounded-[2px]`}>
          {ageBadge.label}
        </span>

        {isPreloved && (
          <span className="border border-[#2A6E37] text-[#2A6E37] text-[13px] font-normal px-2 py-0.5 rounded-[2px]">
            Sangat Baik
          </span>
        )}
      </div>

      {/* Product Title */}
      <Link href={`/product/${product.id}`} className="group-hover:text-[#B05A26] transition-colors">
        <h3 className="text-[16px] font-medium text-[#4A2A1C] leading-[1.35] line-clamp-2 mb-1.5">
          {product.title}
        </h3>
      </Link>

      {/* Price row */}
      <div className="flex items-baseline gap-2 mt-auto">
        <span className="text-[18px] font-semibold text-[#4A2A1C]">
          {formatRupiah(product.price)}
        </span>

        {product.originalPrice && (
          <span className="text-[13px] font-normal text-[#C9B3A5] line-through">
            {formatRupiah(product.originalPrice)}
          </span>
        )}
      </div>
    </div>
  );
};
