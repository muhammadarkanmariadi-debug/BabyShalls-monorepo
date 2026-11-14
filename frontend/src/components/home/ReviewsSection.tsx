'use client';

import React from 'react';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Mama Rania',
    city: 'Kota Malang',
    rating: 5,
    quote:
      'Bukunya tebal, ilustrasi kontrasnya bikin Rania antusias banget belajar menunjuk gambar. Packing hampers-nya juga rapi sekali!',
    bg: 'bg-[#FAF4E8]',
  },
  {
    name: 'Bunda Nadira',
    city: 'Surabaya',
    rating: 5,
    quote:
      'Mainan kayu Montessori-nya halus tanpa sudut tajam. Pengiriman dari Malang lewat KiriminAja cepat dan aman sampai rumah.',
    bg: 'bg-[#FDECE6]',
  },
  {
    name: 'Papa Kevin',
    city: 'Jakarta Selatan',
    rating: 5,
    quote:
      'Preloved board book-nya bersih banget seperti baru dan sudah disteril. Layanan Request a Book juga sangat membantu!',
    bg: 'bg-[#E9F3E4]',
  },
];

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-12 lg:py-16 bg-white" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E543B] mb-1">
              <div className="flex items-center gap-0.5 text-[#D97706]">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                ))}
              </div>
              <span>5.0 / 5.0 dari 500+ Orang Tua</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Kata Mereka Tentang BabyShalls
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className={`${review.bg} rounded-2xl p-6 border border-[#E5E7EB]/70 flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                  ))}
                </div>
                <p className="text-sm text-[#1A1A1A] leading-relaxed font-medium">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                <span className="font-bold text-[#1A1A1A]">{review.name}</span>
                <span className="text-[#6B7280] font-medium">{review.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
