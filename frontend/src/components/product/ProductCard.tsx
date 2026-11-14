'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Heart, BookOpen, Shapes, Star } from 'lucide-react';
import { Product } from '../../types';
import { formatIDR } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

const AGE_TAG_STYLES: Record<string, string> = {
  'Newborn+': 'bg-[#FAF4E8] text-[#1A1A1A] border-[#E2E8F0]',
  'Ages 1-3': 'bg-[#FDECE6] text-[#1A1A1A] border-[#E2E8F0]',
  'Ages 3+': 'bg-[#E9F3E4] text-[#1A1A1A] border-[#E2E8F0]',
  'Ages 6+': 'bg-[#EBF1FA] text-[#1A1A1A] border-[#E2E8F0]',
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const isBook = product.category.includes('Book');
  const hasRealImage =
    product.images &&
    product.images.length > 0 &&
    !product.images[0].endsWith('.svg');

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const tagStyle =
    AGE_TAG_STYLES[product.ageGroup] || 'bg-[#FAF4E8] text-[#1A1A1A] border-[#E2E8F0]';

  const handleAddToCart = () => {
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  return (
    <article className="flex flex-col">
      {/* Clean Borderless Image Container */}
      <div className="relative aspect-[4/3.6] w-full rounded bg-[#F7F7F5] overflow-hidden mb-2.5 group">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          {hasRealImage ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-[#1E543B]">
              {isBook ? (
                <BookOpen className="w-10 h-10 stroke-[1.5] mb-1.5" />
              ) : (
                <Shapes className="w-10 h-10 stroke-[1.5] mb-1.5" />
              )}
              <span className="text-[11px] font-semibold text-[#555555] uppercase">
                {product.category}
              </span>
            </div>
          )}
        </Link>

        {/* Age Tag + Discount Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tagStyle}`}
          >
            {product.ageGroup}
          </span>
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded bg-[#F5B7A1] text-[#1A1A1A] text-[10px] font-extrabold">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Toggle */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={wishlisted ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
            wishlisted
              ? 'bg-[#FDECE6] border-[#F5B7A1] text-[#D9483B]'
              : 'bg-white/90 border-[#E2E8F0] text-[#1A1A1A] hover:bg-[#FDECE6]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-[#D9483B]' : ''}`} />
        </button>
      </div>

      {/* Product Title */}
      <Link
        href={`/product/${product.slug}`}
        className="text-sm sm:text-[15px] font-bold text-[#1A1A1A] hover:text-[#1E543B] transition-colors line-clamp-1"
      >
        {product.title}
      </Link>

      {/* Rating & Terjual */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#555555] mt-1">
        <Star className="w-3 h-3 fill-[#FBBF24] text-[#FBBF24] shrink-0" />
        <span className="font-bold text-[#1A1A1A]">{product.rating.toFixed(1)}</span>
        <span>•</span>
        <span>{product.reviewsCount}+ terjual</span>
      </div>

      {/* Weight & Stock Metadata */}
      <p className="text-[11px] text-[#6B7280] mt-0.5 mb-2.5">
        {product.weightInGrams}g • Stok: {product.stock}
        {product.isPreloved ? ' • Preloved' : ''}
      </p>

      {/* Bottom Row: Price + 44px CTA */}
      <div className="mt-auto flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="text-sm sm:text-[15px] font-extrabold text-[#1A1A1A] block leading-tight">
            {formatIDR(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[11px] text-[#9CA3AF] line-through block">
              {formatIDR(product.originalPrice)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`h-[44px] px-3.5 rounded text-xs font-bold transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1 ${
            isAdded
              ? 'bg-[#E9F3E4] text-[#1E543B]'
              : product.stock === 0
              ? 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
              : 'bg-[#F5B7A1] hover:bg-[#F0A48A] text-[#1A1A1A]'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Ditambah</span>
            </>
          ) : (
            <span>+ Keranjang</span>
          )}
        </button>
      </div>
    </article>
  );
};
