'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { parseHeroSlides, usePublicCms } from '../../hooks/useCms';

interface PromoSlide {
  id: number;
  badge: string;
  label: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 1,
    badge: 'PROMO MINGGU INI • 01 / 03',
    label: '01 Promo Board Book',
    title: 'Diskon 15% Board Book & Mainan Kayu',
    subtitle: 'Gratis bungkus kado & kartu ucapan personal dari BabyShalls Malang. Gunakan kupon BABY15 saat checkout.',
    ctaLabel: 'Lihat Promo →',
    ctaHref: '/catalog',
    image: '/hero-child-reading.jpg',
    imageAlt: 'Anak membaca buku cerita kurasi BabyShalls Malang',
  },
  {
    id: 2,
    badge: 'HAMPERS KURASI • 02 / 03',
    label: '02 Gift Hampers Baru',
    title: 'Gift Hampers Lahiran & Ulang Tahun',
    subtitle: 'Kemasan kotak kain cantik, pita satin, dan kartu ucapan tulis tangan gratis. Siap kirim ke seluruh Indonesia.',
    ctaLabel: 'Pilih Hampers →',
    ctaHref: '/catalog?category=Gift+Hampers',
    image: '/images/hampers-gift.jpg',
    imageAlt: 'Koleksi Gift Hampers BabyShalls Malang',
  },
  {
    id: 3,
    badge: 'WORKSHOP MALANG • 03 / 03',
    label: '03 Workshop Akhir Pekan',
    title: 'Little Explorers: Nature Craft & Storytime',
    subtitle: 'Sesi bermain & bercerita akhir pekan di Jl. Cempaka No. 12, Malang. Kuota terbatas 12 anak per sesi.',
    ctaLabel: 'Beli Tiket Event →',
    ctaHref: '/events',
    image: '/images/event-craft.jpg',
    imageAlt: 'Workshop seni dan cerita anak di BabyShalls Malang',
  },
];

export const HeroSection: React.FC = () => {
  const { data: cms } = usePublicCms();
  const slides = useMemo(() => parseHeroSlides(cms?.hero_slides_json), [cms?.hero_slides_json]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= slides.length) setActiveIndex(0);
  }, [activeIndex, slides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[activeIndex] || slides[0];

  return (
    <section className="w-full bg-white py-10 sm:py-12 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Editorial Intro Copy (Paper Moon Style) */}


        {/* Hero Promo Carousel Viewport */}
        <div className="relative w-full h-[260px] sm:h-[360px] lg:h-[400px] rounded-lg overflow-hidden border border-[#E2E8F0] bg-[#F7F7F5]">
          <img
            src={currentSlide.image}
            alt={currentSlide.imageAlt}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Subtle gradient scrim on left for mobile legibility */}
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/25 via-transparent to-transparent pointer-events-none" />

          {/* Left Promo Card Overlay */}
          <div className="absolute inset-x-3 bottom-3 sm:inset-auto sm:left-16 sm:top-1/2 sm:-translate-y-1/2 sm:w-[410px] bg-white/92 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-[#E2E8F0] shadow-card">
            <span className="inline-block px-2.5 py-1 rounded bg-[#FDF0B8] text-[#1A1A1A] text-[10px] sm:text-[11px] font-bold tracking-wider mb-2">
              {currentSlide.badge}
            </span>
            <h1 className="text-base sm:text-xl font-bold text-[#1A1A1A] leading-snug mb-1.5">
              {currentSlide.title}
            </h1>
            <p className="hidden sm:block text-[13px] text-[#334155] leading-relaxed mb-4">
              {currentSlide.subtitle}
            </p>
            <Link
              href={currentSlide.ctaHref}
              className="inline-flex items-center justify-center h-[44px] px-4 rounded bg-[#FCE694] hover:bg-[#F9DA6B] text-[#1A1A1A] text-[13px] font-bold transition-colors"
            >
              {currentSlide.ctaLabel}
            </Link>
          </div>

          {/* Left / Right Arrow Controls (44x44px Touch Targets) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Promo sebelumnya"
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full bg-white/90 hover:bg-white border border-[#E2E8F0] text-[#1A1A1A] items-center justify-center shadow-subtle transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Promo berikutnya"
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full bg-white/90 hover:bg-white border border-[#E2E8F0] text-[#1A1A1A] items-center justify-center shadow-subtle transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Pagination Dots & Labels */}
        <div
          className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          role="tablist"
          aria-label="Pilih slide promo"
        >
          {slides.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIndex(idx)}
                className="inline-flex items-center gap-2 min-h-[44px] px-2 cursor-pointer group"
              >
                <span
                  className={`h-1.5 rounded-full transition-all ${isActive ? 'w-6 bg-[#1A1A1A]' : 'w-1.5 bg-[#CBD5E1] group-hover:bg-[#94A3B8]'
                    }`}
                />
                <span
                  className={`text-xs transition-colors ${isActive ? 'font-bold text-[#1A1A1A]' : 'font-medium text-[#64748B] group-hover:text-[#1A1A1A]'
                    }`}
                >
                  {slide.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
