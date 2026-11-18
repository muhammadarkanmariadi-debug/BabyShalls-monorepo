'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { ProductReviewDto } from '@/hooks/useProducts';

interface ProductReviewsSectionProps {
  reviews?: ProductReviewDto[];
  rating?: number;
  reviewsCount?: number;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  reviews = [],
  rating = 5,
  reviewsCount,
}) => {
  const totalCount = reviews.length || reviewsCount || 0;

  return (
    <section className="bg-white py-12 border-t border-[#F2E4D6]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-medium text-[#4A2A1C] tracking-tight">
              Ulasan Pembeli ({totalCount})
            </h2>
            <p className="text-xs text-[#7A5644] mt-1">
              Ulasan terverifikasi dari pembeli BabyShalls
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#4A2A1C]">
            <Star className="w-4 h-4 text-[#E0A020] fill-current" />
            <span>{rating.toFixed(1)} / 5.0</span>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 sm:p-5 bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#4A2A1C]">{rev.userName}</p>
                    <p className="text-[11px] text-[#7A5644]">
                      {[rev.location, rev.variantInfo].filter(Boolean).join(' · ') || 'Pembeli Terverifikasi'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[#E0A020]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-current' : 'text-[#E6D2C0]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#4A2A1C] leading-relaxed">
                  {rev.comment}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#7A5644] pt-1">
                  {rev.isVerifiedPurchase !== false && (
                    <span className="text-[#2A6E37] font-medium">✓ Pembelian Terverifikasi</span>
                  )}
                  <span>
                    {new Date(rev.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] text-center text-xs sm:text-sm text-[#7A5644]">
            Belum ada ulasan untuk produk ini. Jadilah yang pertama memberikan ulasan setelah berbelanja!
          </div>
        )}
      </div>
    </section>
  );
};

