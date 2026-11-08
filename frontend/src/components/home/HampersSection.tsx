'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion, isMobileDevice } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const HampersSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Gentle card reveal
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
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

      // Parallax on Hamper photograph (desktop only)
      if (!isMobileDevice() && imageRef.current && containerRef.current) {
        gsap.fromTo(
          imageRef.current,
          { yPercent: 0 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-10 lg:py-14 bg-[#FFF8EF]" id="gift-hampers">
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={cardRef}
          className="rounded-[24px] bg-[#FCECE0] border border-[#EEDBC9] overflow-hidden shadow-subtle relative grid grid-cols-1 md:grid-cols-[48%_52%] items-center min-h-[290px]"
        >
          {/* Left Content */}
          <div className="p-8 sm:p-12 lg:p-14 space-y-4 text-left relative z-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6B3F2A] leading-tight">
              Gift Hampers
            </h2>

            <p className="font-sans text-base sm:text-[17px] text-[#6d5548] font-medium leading-relaxed">
              Thoughtful gifts for curious kids.
            </p>

            <div className="pt-2">
              <Link
                href="/catalog?category=Gift%20Hampers"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-sm shadow-subtle hover:shadow-card hover:scale-102 active:scale-98 transition-all group"
              >
                <span>Explore Hampers</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Floating Outline Heart in Center (GPU-accelerated CSS float) */}
          <div
            className="absolute left-[47%] top-[28%] w-7 h-6 z-20 pointer-events-none hidden md:block animate-float-1"
            aria-hidden="true"
          >
            <svg viewBox="0 0 34 30" fill="none" className="w-full h-full">
              <path
                d="M17 26 C17 26 4 17.5 4 9.2 C4 4.8 7.4 1.8 11.4 1.8 C14.2 1.8 16 3.4 17 4.8 C18 3.4 19.8 1.8 22.6 1.8 C26.6 1.8 30 4.8 30 9.2 C30 17.5 17 26 17 26 Z"
                stroke="#DA7A5B"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Right Hamper Photo */}
          <div className="w-full h-64 sm:h-72 md:h-full min-h-[280px] relative overflow-hidden">
            <img
              ref={imageRef}
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
              alt="BabyShalls Gift Hamper with ribbon and festive confetti"
              className="w-full h-[115%] -top-[5%] relative object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
