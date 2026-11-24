'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCms } from '@/context/CmsContext';

const SWIPE_THRESHOLD_PX = 50;

export const HeroSection: React.FC = () => {
  const { cms } = useCms();
  const hero = cms.home;
  const slides =
    Array.isArray(hero.heroSlides) && hero.heroSlides.length > 0
      ? hero.heroSlides
      : [
          {
            id: 1,
            label: '01',
            title: hero.heroTitle || 'Buku & mainan\npilihan untuk si kecil',
            subtitle:
              hero.heroSubtitle ||
              'Dari newborn sampai 6+ tahun, dipilih tim kami di Malang. Kirim ke seluruh Indonesia atau ambil langsung di toko.',
            ctaLabel: hero.heroPrimaryCtaText || 'Belanja Sekarang',
            ctaHref: '/shop',
            image: hero.heroImage || '/images/hero/slide-1.jpg',
            imageAlt: 'Buku & mainan pilihan untuk si kecil',
          },
        ];

  const [activeDot, setActiveDot] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const dragStartXRef = useRef<number | null>(null);
  const dragStartYRef = useRef<number | null>(null);
  const isHorizontalDragRef = useRef<boolean | null>(null);

  const slideCount = slides.length;
  const safeIndex = ((activeDot % slideCount) + slideCount) % slideCount;

  const goToSlide = useCallback(
    (index: number) => {
      if (slideCount <= 1) return;
      setActiveDot(((index % slideCount) + slideCount) % slideCount);
    },
    [slideCount],
  );

  const goToPrev = useCallback(() => {
    goToSlide(safeIndex - 1);
  }, [goToSlide, safeIndex]);

  const goToNext = useCallback(() => {
    goToSlide(safeIndex + 1);
  }, [goToSlide, safeIndex]);

  useEffect(() => {
    if (slideCount <= 1 || isHovered || isDragging) return;
    const timer = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [slideCount, isHovered, isDragging, safeIndex]);

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (slideCount <= 1) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const target = e.target as HTMLElement | null;
    if (target?.closest('a, button')) return;

    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    isHorizontalDragRef.current = null;
    setIsDragging(true);
    setDragOffset(0);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDragging || dragStartXRef.current === null || dragStartYRef.current === null) return;

    const deltaX = e.clientX - dragStartXRef.current;
    const deltaY = e.clientY - dragStartYRef.current;

    if (isHorizontalDragRef.current === null && (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6)) {
      isHorizontalDragRef.current = Math.abs(deltaX) >= Math.abs(deltaY);
    }

    if (isHorizontalDragRef.current) {
      setDragOffset(deltaX);
    }
  };

  const finishDrag = (e?: React.PointerEvent<HTMLElement>) => {
    if (!isDragging) return;

    if (e && e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (isHorizontalDragRef.current && Math.abs(dragOffset) >= SWIPE_THRESHOLD_PX) {
      if (dragOffset < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    dragStartXRef.current = null;
    dragStartYRef.current = null;
    isHorizontalDragRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (slideCount <= 1) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Hero Banner"
      tabIndex={slideCount > 1 ? 0 : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onKeyDown={handleKeyDown}
      className={`group relative w-full overflow-hidden focus:outline-none ${
        slideCount > 1 ? 'touch-pan-y select-none cursor-grab active:cursor-grabbing' : ''
      }`}
      style={{ backgroundColor: hero.heroBgColor || '#FFF6EA' }}
    >
      {/* Sliding Track */}
      <div
        className={`flex w-full ${
          isDragging ? 'transition-none' : 'transition-transform duration-500 ease-out'
        }`}
        style={{
          transform: `translate3d(calc(-${safeIndex * 100}% + ${dragOffset}px), 0, 0)`,
        }}
      >
        {slides.map((slide, slideIdx) => {
          const hasBgBanner = Boolean(slide.image);
          return (
            <div
              key={slide.id ?? slideIdx}
              aria-hidden={slideIdx !== safeIndex}
              className="relative w-full shrink-0 min-h-[540px] lg:min-h-[640px] flex items-center py-14 sm:py-18 lg:py-[89px]"
            >
              {/* Full-Bleed Background Banner (jika bg banner di-upload) */}
              {hasBgBanner && (
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt || 'Buku & mainan pilihan untuk si kecil'}
                    fill
                    priority={slideIdx === 0}
                    draggable={false}
                    className="object-cover object-center"
                    sizes="100vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(90deg, ${hero.heroBgColor || '#FFF6EA'}F2 0%, ${hero.heroBgColor || '#FFF6EA'}CC 45%, ${hero.heroBgColor || '#FFF6EA'}33 100%)`,
                    }}
                  />
                </div>
              )}

              <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 sm:px-14 lg:px-16">
                <div
                  className={
                    hasBgBanner
                      ? 'max-w-[660px]'
                      : 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center'
                  }
                >
                  {/* Kolom Kiri: Teks Hero + CTAs + Dots */}
                  <div
                    className={`${
                      hasBgBanner ? '' : 'lg:col-span-7'
                    } flex flex-col justify-center space-y-6 lg:space-y-7`}
                  >
                    <h1 className="text-[34px] sm:text-[48px] lg:text-[58px] xl:text-[63px] font-medium text-[#4A2A1C] leading-[1.18] tracking-[-0.015em] whitespace-pre-line">
                      {slide.title || 'Buku & mainan\npilihan untuk si kecil'}
                    </h1>

                    <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-[#7A5644] font-normal leading-[1.5] max-w-[540px]">
                      {slide.subtitle ||
                        'Dari newborn sampai 6+ tahun, dipilih tim kami di Malang. Kirim ke seluruh Indonesia atau ambil langsung di toko.'}
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                      <Link
                        href={slide.ctaHref || '/shop'}
                        tabIndex={slideIdx === safeIndex ? 0 : -1}
                        className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#B05A26] hover:bg-[#8E431A] text-white text-[17px] lg:text-[18px] font-medium rounded-[2.26px] transition-colors shadow-xs"
                      >
                        <span>{slide.ctaLabel || 'Belanja Sekarang'}</span>
                        <ArrowRight className="w-5 h-5 shrink-0" />
                      </Link>

                      <Link
                        href="/shop?category=Preloved"
                        tabIndex={slideIdx === safeIndex ? 0 : -1}
                        className="inline-flex items-center justify-center px-8 py-4 bg-white/95 hover:bg-[#FFFBF5] text-[#4A2A1C] border border-[#C9B3A5] hover:border-[#B05A26] text-[17px] lg:text-[18px] font-medium rounded-[2.26px] transition-colors"
                      >
                        {hero.heroSecondaryCtaText || 'Lihat Preloved'}
                      </Link>
                    </div>

                    <div className="flex items-center gap-2.5 pt-4 lg:pt-6">
                      {slides.map((s, idx) => (
                        <button
                          key={s.id ?? idx}
                          type="button"
                          onClick={() => goToSlide(idx)}
                          tabIndex={slideIdx === safeIndex ? 0 : -1}
                          aria-label={`Slide ${idx + 1}`}
                          aria-current={safeIndex === idx ? 'true' : undefined}
                          className={`h-[11px] rounded-[2.26px] transition-all cursor-pointer ${
                            safeIndex === idx
                              ? 'w-[27px] bg-[#B05A26]'
                              : 'w-[11px] bg-[#C9B3A5] hover:bg-[#B05A26]/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Kolom Kanan: Asset Anak Kecil (otomatis di-hide jika ada bg banner) */}
                  {!hasBgBanner && (
                    <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-end">
                      <div className="relative w-full max-w-[340px] sm:max-w-[460px] lg:max-w-[530px] h-[340px] sm:h-[460px] lg:h-[560px]">
                        <Image
                          src="/images/products/hero-mascot.png"
                          alt="Buku & mainan pilihan untuk si kecil"
                          fill
                          priority={slideIdx === 0}
                          draggable={false}
                          className="object-contain object-bottom scale-105 lg:scale-115 origin-bottom"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 460px, 530px"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover Navigation Buttons (Prev / Next) */}
      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Slide sebelumnya"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/85 hover:bg-white text-[#4A2A1C] hover:text-[#B05A26] border border-[#C9B3A5]/80 shadow-sm backdrop-blur-xs flex items-center justify-center cursor-pointer transition-all duration-200 opacity-80 sm:opacity-0 sm:pointer-events-none sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B05A26]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Slide berikutnya"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/85 hover:bg-white text-[#4A2A1C] hover:text-[#B05A26] border border-[#C9B3A5]/80 shadow-sm backdrop-blur-xs flex items-center justify-center cursor-pointer transition-all duration-200 opacity-80 sm:opacity-0 sm:pointer-events-none sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B05A26]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </section>
  );
};
