'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroSlide {
  id: string;
  url: string;
  alt: string;
}

const defaultSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    url: '/images/hero/slide-1.jpg',
    alt: 'Buku cerita anak dan ruang baca hangat BabyShalls Malang'
  },
  {
    id: 'slide-2',
    url: '/images/hero/slide-2.jpg',
    alt: 'Buku bergambar dan board books edukasi pilihan'
  },
  {
    id: 'slide-3',
    url: '/images/hero/slide-3.jpg',
    alt: 'Mainan kayu edukasi Montessori untuk balita'
  }
];

export const Hero: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Sync with localStorage so admin can upload/manage slides
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('babyshalls_hero_slides');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSlides(parsed);
          }
        }
      } catch {
        // fallback to defaults
      }
    }
  }, []);

  const nextSlide = useCallback(() => {
    setSlides((current) => {
      if (!current.length) return current;
      setCurrentIndex((prev) => (prev + 1) % current.length);
      return current;
    });
  }, []);

  const prevSlide = () => {
    if (!slides.length) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, slides.length, nextSlide]);

  if (!slides.length) return null;

  return (
    <section
      className="relative w-full h-[55vh] sm:h-[65vh] md:h-[75vh] lg:h-[80vh] min-h-[420px] max-h-[800px] overflow-hidden bg-[#F0F0F0] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="BabyShalls Main Campaign Hero Slider"
    >
      {/* 100% Full-Bleed Edge-to-Edge Image Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id || index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.url}
            alt={slide.alt || 'BabyShalls Campaign'}
            className="w-full h-full object-cover object-center"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Subtle Prev / Next Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#2B2B2B] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-[#E5E5E5] cursor-pointer shadow-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#2B2B2B] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-[#E5E5E5] cursor-pointer shadow-sm"
        aria-label="Next slide"
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>

      {/* Minimal Pagination Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 bg-black/25 backdrop-blur-xs px-2.5 py-1.5 rounded-full">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
              i === currentIndex
                ? 'w-6 bg-white'
                : 'w-2 bg-white/60 hover:bg-white'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
