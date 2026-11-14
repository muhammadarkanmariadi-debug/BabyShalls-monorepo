'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, BookOpen, Heart, ArrowRight } from 'lucide-react';

export const AboutBabyShalls: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-[#FAF8F5] border-b border-[#EAE6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Story Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Storytelling Diptych */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-[#F4EFEA] border border-[#EAE6DF] shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80"
                alt="Sunlit wooden bookshelf reading corner in bookstore"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            
            {/* Overlapping small accent card */}
            <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-8 sm:-right-6 bg-white border border-[#EAE6DF] p-5 rounded-md shadow-xs max-w-xs text-left">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C86D51] block mb-1">
                Our Physical Space
              </span>
              <p className="text-sm font-bold text-[#221F1F] leading-snug">
                Citraland Puncak Tidar HH-26, Sukun, Malang
              </p>
              <p className="text-[11px] text-[#5C5753] mt-1">
                Open Tuesday – Sunday: 10:00 – 19:00 WIB
              </p>
            </div>
          </div>

          {/* Right Column: Narrative Story */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F6EAE6] border border-[#EAE6DF] rounded-full text-[11px] font-medium uppercase tracking-wider text-[#C86D51]">
              <Heart size={12} strokeWidth={1.5} className="fill-[#C86D51]" />
              <span>Our Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#221F1F] leading-[1.18]">
              Books. Toys. A Calmer, Brighter Tomorrow.
            </h2>

            <div className="space-y-4 text-sm text-[#5C5753] leading-relaxed font-normal">
              <p>
                BabyShalls was born from a simple belief: in an increasingly fast-paced digital world, children deserve quiet, screen-free tactile moments. The soothing smell of fresh ink on thick board pages, the satisfying weight of beechwood stacking blocks, and bedtime voices that linger long after lights out.
              </p>
              <p>
                Every single title in our boutique is individually read and evaluated for moral warmth, linguistic richness, and illustration quality. We work exclusively with certified international and domestic publishers to ensure original, non-toxic, and enduring materials for your family.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white border border-[#EAE6DF] rounded-md">
                <span className="font-bold text-base text-[#221F1F] block">1,200+</span>
                <span className="text-[#5C5753]">Titles Curated</span>
              </div>
              <div className="p-3 bg-white border border-[#EAE6DF] rounded-md">
                <span className="font-bold text-base text-[#221F1F] block">100%</span>
                <span className="text-[#5C5753]">Certified Original</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/request-a-book"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C86D51] hover:underline"
              >
                <span>Curator Book Inquiries &amp; Special Editions</span>
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

