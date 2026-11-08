'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const ShopByAgeSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Staggered cards reveal
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.age-card');
        gsap.fromTo(
          cards,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: cardsRef.current,
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
    <section ref={containerRef} className="py-12 lg:py-16 bg-[#FFF8EF]" id="shop-by-age">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading with Sunburst Rays */}
        <div ref={headingRef} className="text-center mb-10 will-change-transform">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6B3F2A] flex items-center justify-center gap-3">
            {/* Left Sunburst Rays */}
            <span className="inline-flex items-center gap-1 opacity-80" aria-hidden="true">
              <span className="w-1 h-3 bg-[#F6C95E] rounded-full transform -rotate-30"></span>
              <span className="w-1 h-4 bg-[#F6C95E] rounded-full"></span>
              <span className="w-1 h-3 bg-[#F6C95E] rounded-full transform rotate-30"></span>
            </span>

            <span>Shop by Age</span>

            {/* Right Sunburst Rays */}
            <span className="inline-flex items-center gap-1 opacity-80" aria-hidden="true">
              <span className="w-1 h-3 bg-[#F6C95E] rounded-full transform -rotate-30"></span>
              <span className="w-1 h-4 bg-[#F6C95E] rounded-full"></span>
              <span className="w-1 h-3 bg-[#F6C95E] rounded-full transform rotate-30"></span>
            </span>
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Newborn+ */}
          <Link
            href="/catalog?age=Newborn%2B"
            className="age-card group rounded-[20px] p-5 sm:p-6 bg-[#FCF4EB] border border-[#EEDBC9]/60 transition-all duration-300 shadow-subtle hover:shadow-hover hover:-translate-y-1.5 hover:scale-[1.02] flex flex-col items-center text-center will-change-transform"
          >
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#6B3F2A] mb-2 group-hover:text-[#DA7A5B] transition-colors">
              Newborn+
            </h3>
            <div className="w-full h-36 sm:h-40 flex items-center justify-center transform group-hover:scale-106 group-hover:-translate-y-1 transition-transform duration-300 ease-out">
              <svg viewBox="0 0 200 160" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Cloud pillow */}
                <path
                  d="M30 115 C20 115 15 100 25 90 C20 75 35 65 50 70 C60 55 85 55 95 65 C110 50 135 55 145 70 C160 65 175 75 170 90 C180 100 175 115 165 115 Z"
                  fill="#FFFFFF"
                  opacity="0.85"
                />
                {/* Sleeping baby in yellow */}
                <ellipse cx="100" cy="98" rx="42" ry="24" fill="#F6C95E" />
                <path d="M75 92 Q100 88 125 92" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M80 102 Q100 98 120 102" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                {/* Baby head */}
                <circle cx="68" cy="84" r="18" fill="#FCE0D4" />
                <path d="M62 84 Q66 88 70 84" stroke="#6B3F2A" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="60" cy="88" r="3.5" fill="#F6B79B" opacity="0.8" />
                <path d="M62 67 C66 62 72 65 70 70" stroke="#6B3F2A" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="84" cy="90" r="5" fill="#FCE0D4" />
                <circle cx="138" cy="95" r="7" fill="#FCE0D4" />
                <path d="M42 56 Q44 50 48 54 Q44 58 42 56 Z" fill="#F6C95E" />
              </svg>
            </div>
          </Link>

          {/* Card 2: Ages 1-3 */}
          <Link
            href="/catalog?age=Ages%201-3"
            className="age-card group rounded-[20px] p-5 sm:p-6 bg-[#FCECE0] border border-[#EEDBC9]/60 transition-all duration-300 shadow-subtle hover:shadow-hover hover:-translate-y-1.5 hover:scale-[1.02] flex flex-col items-center text-center will-change-transform"
          >
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#6B3F2A] mb-2 group-hover:text-[#DA7A5B] transition-colors">
              Ages 1–3
            </h3>
            <div className="w-full h-36 sm:h-40 flex items-center justify-center transform group-hover:scale-106 group-hover:-translate-y-1 transition-transform duration-300 ease-out">
              <svg viewBox="0 0 200 160" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="78" cy="116" rx="26" ry="22" fill="#8FA87E" />
                <path d="M60 112 Q78 108 96 112" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                <path d="M64 122 Q78 118 92 122" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                <path d="M88 108 Q108 102 122 108" stroke="#FCE0D4" strokeWidth="9" strokeLinecap="round" />
                <circle cx="76" cy="74" r="19" fill="#FCE0D4" />
                <path
                  d="M57 74 C57 58 68 54 80 54 C92 54 96 64 96 74 C93 72 88 71 82 73 C75 70 65 72 57 74 Z"
                  fill="#6B3F2A"
                />
                <circle cx="84" cy="74" r="2.2" fill="#6B3F2A" />
                <circle cx="81" cy="79" r="3.5" fill="#F6B79B" opacity="0.8" />
                <path d="M82 82 Q86 85 89 82" stroke="#6B3F2A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                {/* Pyramid stacker */}
                <rect x="135" y="124" width="34" height="6" rx="3" fill="#CBA989" />
                <rect x="138" y="116" width="28" height="6" rx="3" fill="#DA7A5B" />
                <rect x="141" y="108" width="22" height="6" rx="3" fill="#F6C95E" />
                <rect x="144" y="100" width="16" height="6" rx="3" fill="#8FA87E" />
                <circle cx="152" cy="94" r="5" fill="#EFB6B0" />
              </svg>
            </div>
          </Link>

          {/* Card 3: Ages 3+ */}
          <Link
            href="/catalog?age=Ages%203%2B"
            className="age-card group rounded-[20px] p-5 sm:p-6 bg-[#EBF2E5] border border-[#EEDBC9]/60 transition-all duration-300 shadow-subtle hover:shadow-hover hover:-translate-y-1.5 hover:scale-[1.02] flex flex-col items-center text-center will-change-transform"
          >
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#6B3F2A] mb-2 group-hover:text-[#DA7A5B] transition-colors">
              Ages 3+
            </h3>
            <div className="w-full h-36 sm:h-40 flex items-center justify-center transform group-hover:scale-106 group-hover:-translate-y-1 transition-transform duration-300 ease-out">
              <svg viewBox="0 0 200 160" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="100" cy="120" rx="28" ry="18" fill="#EFB6B0" />
                <circle cx="100" cy="76" r="20" fill="#FCE0D4" />
                <path
                  d="M78 76 C78 56 90 52 100 52 C112 52 122 58 122 78 C120 74 114 72 106 74 C100 71 90 72 82 78 Z"
                  fill="#6B3F2A"
                />
                <circle cx="80" cy="82" r="5" fill="#6B3F2A" />
                <circle cx="120" cy="82" r="5" fill="#6B3F2A" />
                <path d="M92 78 Q95 81 98 78" stroke="#6B3F2A" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M103 78 Q106 81 109 78" stroke="#6B3F2A" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="90" cy="82" r="3.5" fill="#F6B79B" opacity="0.8" />
                <circle cx="110" cy="82" r="3.5" fill="#F6B79B" opacity="0.8" />
                {/* Storybook */}
                <path
                  d="M72 106 Q99 100 100 114 Q101 100 128 106 L124 126 Q101 118 100 128 Q99 118 76 126 Z"
                  fill="#6EA8CD"
                  stroke="#508AA8"
                  strokeWidth="1.5"
                />
                <path d="M78 110 Q99 104 100 116 Q101 104 122 110" stroke="#FFFFFF" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </Link>

          {/* Card 4: Ages 6+ */}
          <Link
            href="/catalog?age=Ages%206%2B"
            className="age-card group rounded-[20px] p-5 sm:p-6 bg-[#FDEFE5] border border-[#EEDBC9]/60 transition-all duration-300 shadow-subtle hover:shadow-hover hover:-translate-y-1.5 hover:scale-[1.02] flex flex-col items-center text-center will-change-transform"
          >
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#6B3F2A] mb-2 group-hover:text-[#DA7A5B] transition-colors">
              Ages 6+
            </h3>
            <div className="w-full h-36 sm:h-40 flex items-center justify-center transform group-hover:scale-106 group-hover:-translate-y-1 transition-transform duration-300 ease-out">
              <svg viewBox="0 0 200 160" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="132" cy="116" rx="25" ry="20" fill="#DA7A5B" />
                <circle cx="130" cy="74" r="19" fill="#FCE0D4" />
                <path
                  d="M112 70 C112 55 124 50 134 50 C146 50 149 60 148 70 C144 68 138 67 132 69 C126 66 118 68 112 70 Z"
                  fill="#6B3F2A"
                />
                <circle cx="124" cy="74" r="2.2" fill="#6B3F2A" />
                <circle cx="120" cy="78" r="3.5" fill="#F6B79B" opacity="0.8" />
                <path d="M118 104 Q98 94 88 98" stroke="#FCE0D4" strokeWidth="8" strokeLinecap="round" />
                {/* Blocks */}
                <rect x="52" y="112" width="18" height="18" rx="2" fill="#F6C95E" />
                <rect x="72" y="112" width="18" height="18" rx="2" fill="#8FA87E" />
                <rect x="58" y="92" width="26" height="18" rx="2" fill="#6EA8CD" />
                <polygon points="71,76 56,92 86,92" fill="#DA7A5B" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
