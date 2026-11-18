'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useCms } from '@/context/CmsContext';

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
  const safeIndex = activeDot % slides.length;
  const activeSlide = slides[safeIndex] || slides[0];
  const hasBgBanner = Boolean(activeSlide.image);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      className="relative w-full min-h-[540px] lg:min-h-[640px] flex items-center py-14 sm:py-18 lg:py-[89px] overflow-hidden"
      style={{ backgroundColor: hero.heroBgColor || '#FFF6EA' }}
    >
      {/* Full-Bleed Background Banner (jika bg banner di-upload) */}
      {hasBgBanner && (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src={activeSlide.image}
            alt={activeSlide.imageAlt || 'Buku & mainan pilihan untuk si kecil'}
            fill
            priority
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

      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className={hasBgBanner ? 'max-w-[660px]' : 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center'}>
          {/* Kolom Kiri: Teks Hero + CTAs + Dots */}
          <div className={`${hasBgBanner ? '' : 'lg:col-span-7'} flex flex-col justify-center space-y-6 lg:space-y-7`}>
            <h1 className="text-[34px] sm:text-[48px] lg:text-[58px] xl:text-[63px] font-medium text-[#4A2A1C] leading-[1.18] tracking-[-0.015em] whitespace-pre-line">
              {activeSlide.title || 'Buku & mainan\npilihan untuk si kecil'}
            </h1>

            <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-[#7A5644] font-normal leading-[1.5] max-w-[540px]">
              {activeSlide.subtitle || 'Dari newborn sampai 6+ tahun, dipilih tim kami di Malang. Kirim ke seluruh Indonesia atau ambil langsung di toko.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href={activeSlide.ctaHref || '/shop'}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#B05A26] hover:bg-[#8E431A] text-white text-[17px] lg:text-[18px] font-medium rounded-[2.26px] transition-colors shadow-xs"
              >
                <span>{activeSlide.ctaLabel || 'Belanja Sekarang'}</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </Link>

              <Link
                href="/shop?category=Preloved"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/95 hover:bg-[#FFFBF5] text-[#4A2A1C] border border-[#C9B3A5] hover:border-[#B05A26] text-[17px] lg:text-[18px] font-medium rounded-[2.26px] transition-colors"
              >
                {hero.heroSecondaryCtaText || 'Lihat Preloved'}
              </Link>
            </div>

            <div className="flex items-center gap-2.5 pt-4 lg:pt-6">
              {slides.map((s, idx) => (
                <button
                  key={s.id ?? idx}
                  onClick={() => setActiveDot(idx)}
                  aria-label={`Slide ${idx + 1}`}
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
                  priority
                  className="object-contain object-bottom scale-105 lg:scale-115 origin-bottom"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 460px, 530px"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
