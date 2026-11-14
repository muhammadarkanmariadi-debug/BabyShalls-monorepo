'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion } from '@/lib/motion';
import { DEFAULT_CMS_VALUES, usePublicCms } from '../../hooks/useCms';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const HampersSection: React.FC = () => {
  const { data: cms } = usePublicCms();
  const title = cms?.hampers_title || DEFAULT_CMS_VALUES.hampers_title;
  const description = cms?.hampers_description || DEFAULT_CMS_VALUES.hampers_description;
  const image = cms?.hampers_image || DEFAULT_CMS_VALUES.hampers_image;
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-12 lg:py-16 bg-white" id="gift-hampers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={cardRef}
          className=" overflow-hidden grid grid-cols-1 md:grid-cols-[52%_48%] items-center min-h-[320px]"
        >
          {/* Left Content */}
          <div className="p-8 sm:p-12 lg:p-14 space-y-4 text-left">


            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
              {title}
            </h2>

            <p className="text-base text-[#4A4A4A] leading-relaxed max-w-md">
              {description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/catalog?category=Gift%20Hampers"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-7 rounded-full bg-[#1E543B] hover:bg-[#163F2C] text-white font-bold text-sm transition-all group"
              >
                <span>Explore Hampers</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/request-book"
                className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full bg-white hover:bg-[#FAF4E8] text-[#1A1A1A] border border-[#E5E7EB] font-semibold text-sm transition-colors"
              >
                Custom Hampers
              </Link>
            </div>
          </div>

          {/* Right Photograph */}
          <div className="h-64 md:h-full rounded-3xl min-h-[280px] relative overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
