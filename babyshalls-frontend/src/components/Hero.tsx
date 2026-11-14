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
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=2400&q=90',
    alt: 'Child happily reading a picture book in warm natural light'
  },
  {
    id: 'slide-2',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=2400&q=90',
    alt: 'Curated stack of hardcover children picture books on wooden shelf'
  },
  {
    id: 'slide-3',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=2400&q=90',
    alt: 'Open illustrated board book for early learning'
  },
  {
    id: 'slide-4',
    url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=2400&q=90',
    alt: 'Toddler playing with natural wooden Montessori toys beside books'
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
      className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] min-h-[460px] max-h-[900px] overflow-hidden bg-[#FAF6EE]"
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
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[#2C2725] flex items-center justify-center transition-all opacity-0 hover:opacity-100 group-hover:opacity-100 focus:opacity-100 border border-[#EDE8E1] cursor-pointer shadow-xs"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[#2C2725] flex items-center justify-center transition-all opacity-0 hover:opacity-100 group-hover:opacity-100 focus:opacity-100 border border-[#EDE8E1] cursor-pointer shadow-xs"
        aria-label="Next slide"
      >
        <ChevronRight size={22} strokeWidth={1.5} />
      </button>

      {/* Minimal Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-full">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
              i === currentIndex
                ? 'w-7 bg-white'
                : 'w-2 bg-white/60 hover:bg-white'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
