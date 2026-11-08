'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const EventsSection: React.FC = () => {
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

      // Event Cards staggered entrance
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.event-card');
        gsap.fromTo(
          cards,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Image Mask Reveal
        const imageContainers = cardsRef.current.querySelectorAll('.event-img-mask');
        gsap.fromTo(
          imageContainers,
          { clipPath: 'inset(6% 0% 6% 0% round 14px)', opacity: 0.85 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            clearProps: 'clip-path',
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
    <section ref={containerRef} className="py-12 lg:py-16 bg-[#FFF8EF]" id="workshops-events">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading with Sunburst Rays */}
        <div ref={headingRef} className="text-center mb-10 will-change-transform">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6B3F2A] flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1 opacity-80" aria-hidden="true">
              <span className="w-1 h-3 bg-[#F6C95E] rounded-full transform -rotate-30"></span>
              <span className="w-1 h-4 bg-[#F6C95E] rounded-full"></span>
              <span className="w-1 h-3 bg-[#F6C95E] rounded-full transform rotate-30"></span>
            </span>

            <span>Workshops & Events</span>

            <span className="inline-flex items-center gap-1 opacity-80" aria-hidden="true">
              <span className="w-1 h-3 bg-[#F6C95E] rounded-full transform -rotate-30"></span>
              <span className="w-1 h-4 bg-[#F6C95E] rounded-full"></span>
              <span className="w-1 h-3 bg-[#F6C95E] rounded-full transform rotate-30"></span>
            </span>
          </h2>
        </div>

        {/* 2 Event Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event 1: Nature Craft Workshop */}
          <div className="event-card bg-white border border-[#EEDBC9] rounded-[20px] overflow-hidden shadow-subtle hover:shadow-hover transition-all flex flex-col sm:flex-row will-change-transform">
            <div className="event-img-mask sm:w-[200px] h-48 sm:h-auto relative overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80"
                alt="Little Explorers: Nature Craft Workshop"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-sans text-base sm:text-[16.5px] font-bold text-[#6B3F2A] leading-snug">
                  Little Explorers:<br />Nature Craft Workshop
                </h3>
                <div className="mt-3 space-y-1.5 text-xs text-[#8FA87E] font-semibold">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#DA7A5B]" />
                    <span>Sat, May 24, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#DA7A5B]" />
                    <span>BabyShalls, Malang</span>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#EEDBC9] hover:border-[#DA7A5B] bg-[#FFFDF9] hover:bg-[#FFE4D0] text-[#6B3F2A] text-xs font-bold transition-all group"
                >
                  <span>Learn More</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Event 2: Wooden Toys Session */}
          <div className="event-card bg-white border border-[#EEDBC9] rounded-[20px] overflow-hidden shadow-subtle hover:shadow-hover transition-all flex flex-col sm:flex-row will-change-transform">
            <div className="event-img-mask sm:w-[200px] h-48 sm:h-auto relative overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1596464716127-f2a829822321?auto=format&fit=crop&w=600&q=80"
                alt="Play & Learn: Wooden Toys Session"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-sans text-base sm:text-[16.5px] font-bold text-[#6B3F2A] leading-snug">
                  Play & Learn:<br />Wooden Toys Session
                </h3>
                <div className="mt-3 space-y-1.5 text-xs text-[#8FA87E] font-semibold">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#DA7A5B]" />
                    <span>Sat, Jun 7, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#DA7A5B]" />
                    <span>BabyShalls, Malang</span>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#EEDBC9] hover:border-[#DA7A5B] bg-[#FFFDF9] hover:bg-[#FFE4D0] text-[#6B3F2A] text-xs font-bold transition-all group"
                >
                  <span>Learn More</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
