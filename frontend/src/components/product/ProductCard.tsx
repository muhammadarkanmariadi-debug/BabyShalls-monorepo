'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, BookOpen, Shapes, Sparkles, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { formatIDR, formatWeight } from '../../lib/utils';
import { AgeBadge } from './AgeBadge';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const isBook = product.category.includes('Book');
  const hasRealImage =
    product.images &&
    product.images.length > 0 &&
    !product.images[0].endsWith('.svg');

  return (
    <div className="group bg-[#FFF9F0] border border-[#EEDBC9] rounded-[22px] p-4 flex flex-col justify-between shadow-2xs hover:shadow-subtle hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
      
      {/* 1. Media / Thumbnail */}
      <Link
        href={`/product/${product.slug}`}
        className="relative w-full aspect-square rounded-[18px] bg-[#FFE4D0]/60 border border-[#F6B79B]/40 flex items-center justify-center overflow-hidden mb-3.5 group-hover:bg-[#FFE4D0] transition-colors block"
      >
        {hasRealImage ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
          />
        ) : (
          /* Decorative Graphic based on category */
          <div className="text-[#DA7A5B] flex flex-col items-center justify-center p-6 text-center transform group-hover:scale-105 transition-transform duration-300">
            {isBook ? (
              <BookOpen className="w-14 h-14 stroke-[1.5] text-[#DA7A5B] mb-2" />
            ) : (
              <Shapes className="w-14 h-14 stroke-[1.5] text-[#DA7A5B] mb-2" />
            )}
            <span className="text-xs font-semibold text-[#8FA87E] tracking-wider uppercase">
              {product.category}
            </span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <AgeBadge ageGroup={product.ageGroup} />
          {product.isPreloved ? (
            <span className="inline-flex items-center gap-1 bg-[#8FA87E] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-2.5 h-2.5" /> Preloved Kurasi
            </span>
          ) : product.isNewArrival ? (
            <span className="inline-flex items-center gap-1 bg-[#DA7A5B] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-2.5 h-2.5" /> New
            </span>
          ) : null}
        </div>

        {/* Weight indicator in corner */}
        <span className="absolute bottom-2.5 right-2.5 bg-white/85 backdrop-blur-xs text-[#6B3F2A] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#EEDBC9]">
          {formatWeight(product.weightInGrams)}
        </span>
      </Link>

      {/* 2. Content Info */}
      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#502E1E] group-hover:text-[#DA7A5B] transition-colors line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs text-[#8FA87E] font-medium mt-0.5 line-clamp-1">
            {product.authorOrBrand || product.category}
          </p>
          {product.condition && (
            <span className="inline-block mt-1 text-[10px] font-semibold text-[#5B7844] bg-[#EBF2E5] px-1.5 py-0.5 rounded border border-[#D5E4CA]">
              {product.condition}
            </span>
          )}
        </div>

        {/* 3. Price Display */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-[#EEDBC9]/60">
          <span className="font-extrabold text-base text-[#DA7A5B] leading-tight">
            {formatIDR(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-[#CBA989] line-through">
              {formatIDR(product.originalPrice)}
            </span>
          )}
        </div>

        {/* 4. REDESIGNED DISTINCT ACTION BUTTONS (Lihat Detail vs + Keranjang) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Button 1: Lihat Detail */}
          <Link
            href={`/product/${product.slug}`}
            className="py-2 px-2.5 rounded-xl border border-[#EEDBC9] hover:border-[#DA7A5B] bg-white hover:bg-[#FFE4D0]/50 text-[#502E1E] text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-center shadow-2xs group/btn"
            title="Lihat Rincian & Foto Produk"
          >
            <Eye className="w-3.5 h-3.5 text-[#DA7A5B] group-hover/btn:scale-110 transition-transform flex-shrink-0" />
            <span className="truncate">Detail</span>
          </Link>

          {/* Button 2: Tambah ke Keranjang */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
              isAdded
                ? 'bg-[#709154] text-white scale-102'
                : 'bg-[#DA7A5B] hover:bg-[#C46749] text-white active:scale-95'
            }`}
            title="Tambah Produk ke Keranjang Belanja"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="truncate">Masuk!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">+ Keranjang</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
