'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useCms } from '@/context/CmsContext';

export const HeroSection: React.FC = () => {
  const { cms } = useCms();
  const hero = cms.home;
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full bg-[#FFF6EA] py-14 sm:py-18 lg:py-[89px] overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Kolom Kiri: Teks Hero + CTAs + Dots (Figma #131:36708 width: 678px) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:space-y-7 z-10">
            
            {/* Tag: KOLEKSI TERBARU */}
            <div className="inline-flex items-center px-3.5 py-1 bg-[#FBE6D8] rounded-[2.26px] w-fit">
              <span className="text-[13.5px] font-semibold text-[#B05A26] uppercase tracking-[0.08em]">
                {hero.heroTag || 'KOLEKSI TERBARU'}
              </span>
            </div>

            {/* Title H1 */}
            <h1 className="text-[34px] sm:text-[48px] lg:text-[58px] xl:text-[63px] font-medium text-[#4A2A1C] leading-[1.18] tracking-[-0.015em] whitespace-pre-line">
              {hero.heroTitle || 'Buku & mainan\npilihan untuk si kecil'}
            </h1>

            {/* Subtitle / Paragraph */}
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-[#7A5644] font-normal leading-[1.5] max-w-[540px]">
              {hero.heroSubtitle || 'Dari newborn sampai 6+ tahun, dipilih tim kami di Malang. Kirim ke seluruh Indonesia atau ambil langsung di toko.'}
            </p>

            {/* CTA Buttons (Desktop only - untouched Figma #131:36708) */}
            <div className="hidden lg:flex items-center gap-3.5 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#B05A26] hover:bg-[#8E431A] text-white text-[17px] lg:text-[18px] font-medium rounded-[2.26px] transition-colors shadow-xs"
              >
                <span>{hero.heroPrimaryCtaText || 'Belanja Sekarang'}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/shop?category=Preloved"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-[#FFFBF5] text-[#4A2A1C] border border-[#C9B3A5] hover:border-[#B05A26] text-[17px] lg:text-[18px] font-medium rounded-[2.26px] transition-colors"
              >
                {hero.heroSecondaryCtaText || 'Lihat Preloved'}
              </Link>
            </div>

            {/* Slider Dots (Desktop only) */}
            <div className="hidden lg:flex items-center gap-2.5 pt-6 lg:pt-8">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDot(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-[11px] rounded-[2.26px] transition-all cursor-pointer ${
                    activeDot === idx
                      ? 'w-[27px] bg-[#B05A26]'
                      : 'w-[11px] bg-[#C9B3A5] hover:bg-[#B05A26]/50'
                  }`}
                />
              ))}
            </div>

          </div>

          {/* Kolom Kanan: Foto Hero Maskot + Mobile CTAs directly below banner */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-end">
            <div className="relative w-full max-w-[340px] xs:max-w-[400px] sm:max-w-[480px] lg:max-w-[530px] xl:max-w-[560px] h-[340px] xs:h-[400px] sm:h-[480px] lg:h-[580px] xl:h-[620px]">
              <Image
                src="/images/products/hero-mascot.png"
                alt="Buku & mainan pilihan untuk si kecil"
                fill
                priority
                className="object-contain object-bottom scale-105 sm:scale-110 lg:scale-115 xl:scale-120 origin-bottom transition-transform"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 500px, 560px"
              />
            </div>

            {/* CTA Buttons (Mobile & Tablet only - placed below the hero banner mascot) */}
            <div className="flex lg:hidden flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 w-full max-w-[420px] sm:max-w-none">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#B05A26] hover:bg-[#8E431A] text-white text-[16px] sm:text-[17px] font-medium rounded-[2.26px] transition-colors shadow-xs text-center"
              >
                <span>{hero.heroPrimaryCtaText || 'Belanja Sekarang'}</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </Link>

              <Link
                href="/shop?category=Preloved"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-[#FFFBF5] text-[#4A2A1C] border border-[#C9B3A5] hover:border-[#B05A26] text-[16px] sm:text-[17px] font-medium rounded-[2.26px] transition-colors text-center"
              >
                {hero.heroSecondaryCtaText || 'Lihat Preloved'}
              </Link>
            </div>

            {/* Slider Dots (Mobile & Tablet only) */}
            <div className="flex lg:hidden items-center justify-center gap-2.5 pt-4">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDot(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-[11px] rounded-[2.26px] transition-all cursor-pointer ${
                    activeDot === idx
                      ? 'w-[27px] bg-[#B05A26]'
                      : 'w-[11px] bg-[#C9B3A5] hover:bg-[#B05A26]/50'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
