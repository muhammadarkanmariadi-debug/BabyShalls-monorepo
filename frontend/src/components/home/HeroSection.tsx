'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion, isMobileDevice } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaWrapperRef = useRef<HTMLDivElement>(null);
  const sunburstRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const heroImageContainerRef = useRef<HTMLDivElement>(null);
  const waveLayer1Ref = useRef<SVGPathElement>(null);
  const waveLayer2Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!sectionRef.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // 1. Clean, lightweight entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Sunburst icon entrance
      if (sunburstRef.current) {
        tl.fromTo(
          sunburstRef.current,
          { scale: 0.6, opacity: 0, rotation: -12 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.5, delay: 0.08, clearProps: 'transform' }
        );
      }

      // Line-by-line headline reveal
      const lines = [headlineLine1Ref.current, headlineLine2Ref.current].filter(Boolean);
      if (lines.length > 0) {
        tl.fromTo(
          lines,
          { yPercent: 105, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.75, stagger: 0.12, clearProps: 'transform' },
          '-=0.35'
        );
      }

      // Subtext fade in
      if (subtextRef.current) {
        tl.fromTo(
          subtextRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, clearProps: 'transform' },
          '-=0.45'
        );
      }

      // CTA Button & flowers entrance
      if (ctaWrapperRef.current) {
        tl.fromTo(
          ctaWrapperRef.current,
          { y: 16, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.55, clearProps: 'transform' },
          '-=0.35'
        );
      }

      // 2. Hero Image Mask Reveal
      if (heroImageContainerRef.current) {
        gsap.fromTo(
          heroImageContainerRef.current,
          {
            clipPath: 'inset(6% 0% 6% 0% round 20px)',
            opacity: 0.9,
          },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            opacity: 1,
            duration: 0.9,
            delay: 0.15,
            ease: 'power3.out',
            clearProps: 'clip-path',
          }
        );
      }

      // 3. Smooth, zero-jump parallax scrub (desktop only for performance)
      if (!isMobileDevice() && sectionRef.current) {
        if (heroImageRef.current) {
          gsap.fromTo(
            heroImageRef.current,
            { yPercent: 0 },
            {
              yPercent: 10,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }

        // Layered SVG wave parallax
        if (waveLayer1Ref.current) {
          gsap.fromTo(
            waveLayer1Ref.current,
            { xPercent: 0 },
            {
              xPercent: 2.2,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }

        if (waveLayer2Ref.current) {
          gsap.fromTo(
            waveLayer2Ref.current,
            { xPercent: 0 },
            {
              xPercent: -1.8,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[520px] lg:min-h-[580px] xl:min-h-[620px] overflow-hidden flex items-center"
      style={{
        background: 'linear-gradient(135deg, #FFF9F0 0%, #FFEBDC 45%, #FBDDC9 100%)',
      }}
      id="hero"
      aria-label="Hero"
    >
      {/* 1. Asymmetrical Top Wave */}
      <div className="absolute top-0 left-0 w-full h-[65px] lg:h-[75px] leading-none overflow-hidden z-[4] pointer-events-none">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,0 L360,0 C270,36 170,68 70,74 C30,76 10,79 0,82 Z" fill="#FFE4D2" />
          <path
            d="M0,0 L1440,0 L1440,32 C1320,56 1200,52 1090,34 C970,14 850,56 710,50 C550,44 350,16 190,36 C95,48 35,34 0,22 Z"
            fill="#FFF9F0"
          />
        </svg>
      </div>

      {/* 2. Botanical Sage Leaf Branch (Far Left Edge) - GPU-Accelerated */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-14 sm:w-20 lg:w-24 h-32 lg:h-40 z-[3] pointer-events-none hidden sm:block animate-float-1"
        aria-hidden="true"
      >
        <svg viewBox="0 0 95 150" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 145 C18 105 35 65 72 20" stroke="#7A9A60" strokeWidth="2.8" strokeLinecap="round" />
          <ellipse cx="26" cy="118" rx="15" ry="9" transform="rotate(-32 26 118)" fill="#91B077" />
          <ellipse cx="44" cy="90" rx="16" ry="9.5" transform="rotate(28 44 90)" fill="#91B077" />
          <ellipse cx="47" cy="54" rx="16" ry="9" transform="rotate(-34 47 54)" fill="#91B077" />
          <ellipse cx="70" cy="24" rx="14" ry="8" transform="rotate(22 70 24)" fill="#91B077" />
        </svg>
      </div>

      {/* 3. DENSE STORYBOOK DECORATIONS (Hardware-accelerated CSS animations) */}

      {/* 3a. Golden Twinkle Sparkle 1 */}
      <div
        className="absolute left-[38%] top-[12%] w-6 h-6 z-[3] pointer-events-none hidden md:block animate-twinkle-1"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path
            d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z"
            fill="#F6C95E"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* 3b. Floating Open Storybook Doodle */}
      <div
        className="absolute left-[41%] top-[18%] w-10 h-8 lg:w-12 lg:h-9 z-[3] pointer-events-none hidden lg:block animate-float-2"
        aria-hidden="true"
      >
        <svg viewBox="0 0 54 40" fill="none" className="w-full h-full">
          <path
            d="M27 10 C21 6 10 7 4 11 L4 35 C10 31 21 30 27 34 C33 30 44 31 50 35 L50 11 C44 7 33 6 27 10 Z"
            fill="#FFF5EB"
            stroke="#DA7A5B"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M27 10 L27 34" stroke="#DA7A5B" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M9 19 Q16 16 22 18" stroke="#DA7A5B" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M9 25 Q16 22 22 24" stroke="#DA7A5B" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M32 18 Q38 16 45 19" stroke="#DA7A5B" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M32 24 Q38 22 45 25" stroke="#DA7A5B" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      </div>

      {/* 3c. Floating Terracotta Heart 1 */}
      <div
        className="absolute left-[47%] top-[24%] w-8 h-7 lg:w-9 lg:h-8 z-[3] pointer-events-none hidden md:block animate-float-1"
        aria-hidden="true"
      >
        <svg viewBox="0 0 34 30" fill="none" className="w-full h-full">
          <path
            d="M17 26 C17 26 4 17.5 4 9.2 C4 4.8 7.4 1.8 11.4 1.8 C14.2 1.8 16 3.4 17 4.8 C18 3.4 19.8 1.8 22.6 1.8 C26.6 1.8 30 4.8 30 9.2 C30 17.5 17 26 17 26 Z"
            stroke="#DA7A5B"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* 3d. Floating Salmon Companion Heart */}
      <div
        className="absolute right-[28%] top-[26%] w-6 h-5.5 lg:w-7 lg:h-6 z-[3] pointer-events-none hidden xl:block animate-float-3"
        aria-hidden="true"
      >
        <svg viewBox="0 0 34 30" fill="none" className="w-full h-full">
          <path
            d="M17 26 C17 26 4 17.5 4 9.2 C4 4.8 7.4 1.8 11.4 1.8 C14.2 1.8 16 3.4 17 4.8 C18 3.4 19.8 1.8 22.6 1.8 C26.6 1.8 30 4.8 30 9.2 C30 17.5 17 26 17 26 Z"
            stroke="#F6B79B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#FFE8DD"
            fillOpacity="0.4"
          />
        </svg>
      </div>

      {/* 3e. Curvilinear Storybook Dashed Flight Trail & Little Bee */}
      <div
        className="absolute left-[36%] top-[34%] w-48 lg:w-64 h-24 z-[3] pointer-events-none hidden lg:block"
        aria-hidden="true"
      >
        <svg viewBox="0 0 220 90" fill="none" className="w-full h-full">
          <path
            d="M10 65 Q60 20 110 55 T200 30"
            stroke="#D9A688"
            strokeWidth="2"
            strokeDasharray="4 6"
            strokeLinecap="round"
            opacity="0.65"
          />
          <g transform="translate(196, 22) rotate(-15)">
            <ellipse cx="8" cy="8" rx="7" ry="4.5" fill="#F6C95E" />
            <path d="M5 4.5 L5 11.5" stroke="#502E1E" strokeWidth="1.2" />
            <path d="M8 3.5 L8 12.5" stroke="#502E1E" strokeWidth="1.2" />
            <ellipse cx="6" cy="3" rx="3.5" ry="2.2" fill="#FFFFFF" opacity="0.8" />
            <ellipse cx="10" cy="3" rx="3.5" ry="2.2" fill="#FFFFFF" opacity="0.8" />
          </g>
        </svg>
      </div>

      {/* 3f. Mini Wooden Rainbow Stacker Doodle */}
      <div
        className="absolute left-[44%] bottom-[24%] w-12 h-9 lg:w-14 lg:h-10 z-[3] pointer-events-none hidden lg:block animate-float-3"
        aria-hidden="true"
      >
        <svg viewBox="0 0 60 44" fill="none" className="w-full h-full">
          <path d="M6,40 A24,24 0 0,1 54,40" stroke="#DA7A5B" strokeWidth="5.5" fill="none" strokeLinecap="round" />
          <path d="M14,40 A16,16 0 0,1 46,40" stroke="#F6C95E" strokeWidth="5.5" fill="none" strokeLinecap="round" />
          <path d="M22,40 A8,8 0 0,1 38,40" stroke="#8FA87E" strokeWidth="5.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* 3g. Twinkle Sparkle 2 */}
      <div
        className="absolute left-[39%] bottom-[16%] w-5 h-5 z-[3] pointer-events-none hidden md:block animate-twinkle-2"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path
            d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z"
            fill="#EFB6B0"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* 3h. Little Sage Sprout Sprig */}
      <div
        className="absolute left-[35%] top-[56%] w-7 h-9 z-[3] pointer-events-none hidden xl:block animate-float-2"
        aria-hidden="true"
      >
        <svg viewBox="0 0 32 40" fill="none" className="w-full h-full">
          <path d="M16 38 C16 26 18 16 24 8" stroke="#7A9A60" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="12" cy="22" rx="7" ry="4" transform="rotate(-30 12 22)" fill="#91B077" />
          <ellipse cx="23" cy="14" rx="7" ry="4" transform="rotate(25 23 14)" fill="#A7C48A" />
        </svg>
      </div>

      {/* 3i. Floating Heart 3 */}
      <div
        className="absolute left-[48%] bottom-[12%] w-5 h-4.5 z-[3] pointer-events-none hidden lg:block animate-float-1"
        aria-hidden="true"
      >
        <svg viewBox="0 0 34 30" fill="none" className="w-full h-full">
          <path
            d="M17 26 C17 26 4 17.5 4 9.2 C4 4.8 7.4 1.8 11.4 1.8 C14.2 1.8 16 3.4 17 4.8 C18 3.4 19.8 1.8 22.6 1.8 C26.6 1.8 30 4.8 30 9.2 C30 17.5 17 26 17 26 Z"
            stroke="#DA7A5B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* 4. Main Stage Layout */}
      <div className="relative w-full min-h-[520px] lg:min-h-[580px] xl:min-h-[620px] grid grid-cols-1 lg:grid-cols-[48%_52%] items-center z-[2]">
        {/* Left Column: Storybook Text & Large CTA */}
        <div className="relative z-[3] pt-16 pb-12 lg:py-24 px-6 sm:px-12 lg:pl-16 xl:pl-28 flex flex-col items-start text-left">
          {/* Mustard Doodle Sunburst */}
          <div ref={sunburstRef} className="inline-flex items-end gap-1.5 mb-3.5 h-7" aria-hidden="true">
            <span className="block w-1 h-4 bg-[#F6C95E] rounded-full transform -rotate-[32deg] origin-bottom"></span>
            <span className="block w-1 h-5.5 bg-[#F6C95E] rounded-full"></span>
            <span className="block w-1 h-4 bg-[#F6C95E] rounded-full transform rotate-[32deg] origin-bottom"></span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[48px] xl:text-[54px] font-bold text-[#502E1E] leading-[1.16] tracking-tight mb-4 lg:mb-5">
            <span className="line-mask">
              <span ref={headlineLine1Ref} className="block">
                Find the right book
              </span>
            </span>
            <span className="line-mask">
              <span ref={headlineLine2Ref} className="block">
                for your little one
              </span>
            </span>
          </h1>

          {/* Subtext */}
          <p
            ref={subtextRef}
            className="font-sans text-base sm:text-lg lg:text-[19px] text-[#684B3D] leading-relaxed mb-8 lg:mb-10 font-medium max-w-lg"
          >
            Carefully selected imported books<br />and educational toys.
          </p>

          {/* Large CTA with Flower Cluster */}
          <div ref={ctaWrapperRef} className="relative flex items-center gap-4 lg:gap-5">
            <Link
              href="/catalog?age=all"
              className="inline-flex items-center gap-3 px-8 py-3.5 sm:px-9 sm:py-4 lg:px-11 lg:py-4.5 xl:px-12 xl:py-5 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white font-extrabold text-base sm:text-[17px] lg:text-lg xl:text-xl shadow-card hover:shadow-hover hover:scale-103 active:scale-98 transition-all group tracking-wide"
            >
              <span>Shop by Age</span>
              <span className="transform group-hover:translate-x-1.5 transition-transform text-lg lg:text-xl">→</span>
            </Link>

            {/* Flower Cluster */}
            <div className="w-16 h-14 sm:w-20 sm:h-16 lg:w-24 lg:h-18 flex-shrink-0" aria-hidden="true">
              <svg viewBox="0 0 90 70" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 46 C10 40 6 28 14 20 C24 24 28 36 22 44 Z" fill="#91B077" />
                <path d="M60 54 C70 50 80 38 74 28 C64 32 58 42 60 54 Z" fill="#A7C48A" />
                <path d="M42 62 C34 68 24 64 22 56 C30 52 38 56 42 62 Z" fill="#7A9A60" opacity="0.8" />
                <g>
                  <circle cx="32" cy="38" r="8.5" fill="#F6C95E" />
                  <circle cx="45" cy="30" r="8.5" fill="#F6C95E" />
                  <circle cx="49" cy="44" r="8.5" fill="#F6C95E" />
                  <circle cx="39" cy="54" r="8.5" fill="#F6C95E" />
                  <circle cx="28" cy="50" r="8.5" fill="#F6C95E" />
                  <circle cx="38" cy="43" r="5.5" fill="#502E1E" />
                </g>
                <g>
                  <circle cx="56" cy="24" r="6.5" fill="#F6B79B" />
                  <circle cx="66" cy="20" r="6.5" fill="#F6B79B" />
                  <circle cx="70" cy="30" r="6.5" fill="#F6B79B" />
                  <circle cx="62" cy="38" r="6.5" fill="#F6B79B" />
                  <circle cx="53" cy="33" r="6.5" fill="#F6B79B" />
                  <circle cx="61.5" cy="29" r="4.2" fill="#DA7A5B" />
                </g>
                <g>
                  <circle cx="20" cy="28" r="4" fill="#FFF9F0" />
                  <circle cx="26" cy="24" r="4" fill="#FFF9F0" />
                  <circle cx="28" cy="32" r="4" fill="#FFF9F0" />
                  <circle cx="22" cy="35" r="4" fill="#FFF9F0" />
                  <circle cx="24" cy="30" r="2.2" fill="#F6C95E" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Full-height Photograph */}
        <div
          ref={heroImageContainerRef}
          className="relative w-full h-[380px] sm:h-[480px] lg:h-full lg:min-h-[580px] xl:min-h-[620px] overflow-hidden"
        >
          <img
            ref={heroImageRef}
            src="/hero-child-reading.jpg"
            alt="Little child reading storybook surrounded by wooden educational toys"
            className="w-full h-[115%] -top-[5%] relative object-cover object-[center_30%]"
          />
          <div
            className="absolute inset-y-0 left-0 w-[32%] pointer-events-none z-[2]"
            style={{
              background:
                'linear-gradient(to right, #FFEBDC 0%, rgba(255, 235, 220, 0.75) 40%, transparent 100%)',
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* 5. 3-Layer Flowing Bottom Wave */}
      <div
        className="absolute bottom-0 left-0 w-full h-[75px] lg:h-[95px] leading-none overflow-hidden z-[4] pointer-events-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={waveLayer1Ref}
            d="M0,62 C180,22 360,18 540,66 C720,110 920,54 1100,84 C1240,106 1350,64 1440,52 L1440,120 L0,120 Z"
            fill="#FAD9C5"
            opacity="0.88"
          />
          <path
            ref={waveLayer2Ref}
            d="M0,78 C160,38 340,42 510,76 C680,110 880,68 1060,90 C1220,108 1360,74 1440,66 L1440,120 L0,120 Z"
            fill="#FFE8D9"
            opacity="0.8"
          />
          <path
            d="M0,88 C200,58 380,50 560,82 C740,112 940,74 1140,92 C1280,104 1380,78 1440,72 L1440,120 L0,120 Z"
            fill="#FFF8EF"
          />
        </svg>
      </div>
    </section>
  );
};
