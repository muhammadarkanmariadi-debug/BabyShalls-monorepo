'use client';

import React, { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const ReviewsSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const review1Ref = useRef<HTMLDivElement>(null);
  const review2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // 1. Rating count-up animation from 0.0 to 5.0
      if (scoreRef.current && cardRef.current) {
        const scoreObj = { val: 0 };
        gsap.to(scoreObj, {
          val: 5.0,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (scoreRef.current) {
              scoreRef.current.innerText = scoreObj.val.toFixed(1);
            }
          },
        });
      }

      // 2. Stars pop
      if (starsRef.current && cardRef.current) {
        const stars = starsRef.current.children;
        gsap.fromTo(
          stars,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 3. Testimonials sequential reveal
      const reviews = [review1Ref.current, review2Ref.current].filter(Boolean);
      if (reviews.length && cardRef.current) {
        gsap.fromTo(
          reviews,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
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
    <section ref={containerRef} className="py-8 lg:py-12 bg-[#FFF8EF]" id="reviews">
      <div className="max-w-6xl mx-auto px-6">
        {/* Sage Light Card */}
        <div
          ref={cardRef}
          className="rounded-[24px] p-6 sm:p-8 lg:p-9 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden will-change-transform"
          style={{
            backgroundColor: '#EBF2E5',
            border: '1px solid rgba(167, 196, 138, 0.4)',
          }}
        >
          {/* Left: Score Box */}
          <div className="flex flex-col items-center text-center flex-shrink-0 md:w-56 md:pr-6 md:border-r border-[#6B3F2A]/15">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-7 h-7 text-[#F6C95E] fill-[#F6C95E]" />
              <span ref={scoreRef} className="font-sans text-3xl font-extrabold text-[#6B3F2A] leading-none">
                5.0
              </span>
            </div>

            {/* 5 Stars */}
            <div ref={starsRef} className="flex items-center gap-1 my-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-[#F6C95E] fill-[#F6C95E]" />
              ))}
            </div>

            <span className="text-[13.5px] font-bold text-[#6B3F2A]">
              359 happy reviews
            </span>
          </div>

          {/* Review 1 */}
          <div ref={review1Ref} className="flex-1 text-center md:text-left md:px-6 md:border-r border-[#6B3F2A]/15 will-change-transform">
            <p className="text-[14.5px] font-semibold text-[#6B3F2A] leading-relaxed">
              &ldquo;Beautiful books and toys. My daughter loves them!&rdquo;
            </p>
            <span className="text-[13px] text-[#6f594d] font-medium block mt-2">
              — Sarah, Malang
            </span>
          </div>

          {/* Review 2 */}
          <div ref={review2Ref} className="flex-1 text-center md:text-left md:pl-6 relative z-10 will-change-transform">
            <p className="text-[14.5px] font-semibold text-[#6B3F2A] leading-relaxed">
              &ldquo;Great service and lovely selection. Highly recommended!&rdquo;
            </p>
            <span className="text-[13px] text-[#6f594d] font-medium block mt-2">
              — Rani, Surabaya
            </span>
          </div>

          {/* Botanical Sprig in Bottom Right */}
          <div
            className="absolute right-4 bottom-2 w-14 h-20 text-[#709154] opacity-50 pointer-events-none hidden lg:block animate-float-2"
            aria-hidden="true"
          >
            <svg viewBox="0 0 60 90" fill="currentColor" className="w-full h-full">
              <path d="M10 85 Q30 50 48 10 Q32 35 24 55 Q16 70 10 85 Z" />
              <path d="M48 10 C54 6 56 16 48 20 C42 18 44 12 48 10 Z" />
              <path d="M38 28 C48 24 50 34 42 38 C36 36 36 30 38 28 Z" />
              <path d="M26 36 C16 32 14 42 22 46 C28 44 28 38 26 36 Z" />
              <path d="M32 50 C42 46 44 56 36 60 C30 58 30 52 32 50 Z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
