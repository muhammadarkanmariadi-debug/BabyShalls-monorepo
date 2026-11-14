'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark } from 'lucide-react';

export const FeaturedCollections: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#EAE6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[#EAE6DF] gap-4 text-left">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#5C5753] block mb-1">
              Curator’s Table
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#221F1F]">
              Featured Collections
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5C5753] max-w-sm">
            Thoughtfully grouped thematic libraries curated for bedtime rituals, sensory motor play, and milestone gifting.
          </p>
        </div>

        {/* Varied Editorial Composition (1 Large Anchor + 2 Side Features) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Anchor Feature (7 Columns) */}
          <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#EAE6DF] rounded-md overflow-hidden flex flex-col justify-between group hover:border-[#C86D51] transition-all">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#F4EFEA]">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80"
                alt="Open classic children book with soft watercolor illustration"
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute top-4 left-4 bg-white/95 border border-[#EAE6DF] px-3 py-1 rounded-sm text-xs font-bold text-[#221F1F]">
                Curator’s Recommendation
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4 text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C86D51]">
                Bedtime &amp; Lullaby Classics
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#221F1F] leading-snug">
                Quiet Stories for Peaceful Evenings
              </h3>
              <p className="text-sm text-[#5C5753] leading-relaxed">
                A soothing collection of warm watercolor classics that cultivate unconditional security and bedtime wonder — featuring titles by Eric Carle, Sam McBratney, and Margaret Wise Brown.
              </p>

              <div className="pt-2">
                <Link
                  href="/#catalog"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#221F1F] group-hover:text-[#C86D51] transition-colors"
                >
                  <span>Explore the Bedtime Treasury</span>
                  <ArrowRight size={15} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </div>

          {/* 2 Stacked Features (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            
            {/* Top Sub-feature */}
            <div className="bg-[#FAF8F5] border border-[#EAE6DF] rounded-md overflow-hidden p-6 sm:p-7 flex flex-col justify-between group hover:border-[#C86D51] transition-all text-left flex-1">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="relative w-full sm:w-36 aspect-[4/3] sm:aspect-square shrink-0 rounded-md overflow-hidden bg-[#F4EFEA] border border-[#EAE6DF]">
                  <img
                    src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80"
                    alt="Natural wooden Montessori toys"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8FA882]">
                    Montessori Natural Wood
                  </span>
                  <h4 className="text-lg font-bold text-[#221F1F] group-hover:text-[#C86D51] transition-colors leading-snug">
                    Open-Ended Beechwood Play
                  </h4>
                  <p className="text-xs text-[#5C5753] leading-relaxed line-clamp-2">
                    Tactile stacking rainbows and counting blocks crafted from certified sustainable hardwood with water-based non-toxic dyes.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#EAE6DF] flex items-center justify-between text-xs font-semibold text-[#221F1F] group-hover:text-[#C86D51]">
                <span>View Montessori Toys</span>
                <span>→</span>
              </div>
            </div>

            {/* Bottom Sub-feature */}
            <div className="bg-[#FAF8F5] border border-[#EAE6DF] rounded-md overflow-hidden p-6 sm:p-7 flex flex-col justify-between group hover:border-[#C86D51] transition-all text-left flex-1">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="relative w-full sm:w-36 aspect-[4/3] sm:aspect-square shrink-0 rounded-md overflow-hidden bg-[#F4EFEA] border border-[#EAE6DF]">
                  <img
                    src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80"
                    alt="Newborn baby gift hamper"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C86D51]">
                    Gifting &amp; Welcomes
                  </span>
                  <h4 className="text-lg font-bold text-[#221F1F] group-hover:text-[#C86D51] transition-colors leading-snug">
                    Hand-Tied Keepsake Hampers
                  </h4>
                  <p className="text-xs text-[#5C5753] leading-relaxed line-clamp-2">
                    Curated sets packed in natural pine boxes with cotton canvas ribbon and handwritten greeting calligraphy.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#EAE6DF] flex items-center justify-between text-xs font-semibold text-[#221F1F] group-hover:text-[#C86D51]">
                <span>Explore Gift Hampers</span>
                <span>→</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

