'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides: HeroSlide[] = [
    {
      id: 'slide-1',
      title: 'Boutique Buku Anak & Ruang Belajar',
      subtitle: 'Board books, picture books klasik impor, dan mainan kayu Montessori.',
      ctaText: 'LIHAT KOLEKSI',
      ctaLink: '/shop',
      image: '/images/hero/slide-1.jpg',
    },
    {
      id: 'slide-2',
      title: 'Kado Bermakna Untuk Setiap Milestone',
      subtitle: 'Paket hampers kurasi dengan kotak kayu pinus dan kartu ucapan kustom.',
      ctaText: 'JELAJAHI HAMPERS',
      ctaLink: '/hampers',
      image: '/images/hero/slide-2.jpg',
    },
    {
      id: 'slide-3',
      title: 'Sesi Dongeng & Workshop Akhir Pekan',
      subtitle: 'Kegiatan kreatif gratis untuk anak & orang tua di Citraland Malang.',
      ctaText: 'DAFTAR WORKSHOP',
      ctaLink: '/events',
      image: '/images/hero/slide-3.jpg',
    },
  ];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className="relative w-full h-[400px] sm:h-[480px] lg:h-[560px] bg-[#F0F0F0] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero carousel"
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background image */}
            <div className="absolute inset-0 bg-[#F0F0F0]">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-black/25" />
            </div>

            {/* Content overlay */}
            <div className="relative h-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col justify-center items-center text-center">
              <div className="max-w-[720px] text-white space-y-4">
                <h1 className="text-[26px] sm:text-[36px] lg:text-[44px] font-semibold tracking-tight leading-tight text-white drop-shadow-xs">
                  {slide.title}
                </h1>

                <p className="text-[14px] sm:text-[16px] text-white/95 max-w-lg mx-auto font-normal leading-relaxed drop-shadow-xs">
                  {slide.subtitle}
                </p>

                <div className="pt-2">
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-[#D9744A] hover:bg-[#C25F37] text-white text-[13px] sm:text-[14px] font-semibold uppercase tracking-wider rounded-[8px] transition-colors shadow-sm cursor-pointer"
                  >
                    {slide.ctaText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[#2B2B2B] items-center justify-center transition-all shadow-xs cursor-pointer"
        aria-label="Slide sebelumnya"
      >
        <ChevronLeft size={22} strokeWidth={2} />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[#2B2B2B] items-center justify-center transition-all shadow-xs cursor-pointer"
        aria-label="Slide berikutnya"
      >
        <ChevronRight size={22} strokeWidth={2} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              index === currentSlide
                ? 'w-6 h-2 bg-[#D9744A]'
                : 'w-2 h-2 bg-white/70 hover:bg-white'
            }`}
            aria-label={`Buka slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

