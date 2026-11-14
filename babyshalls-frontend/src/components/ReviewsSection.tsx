'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-[#FFF8EF] border-b border-[#EEDBC9]" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white rounded-3xl border border-[#EEDBC9] p-7 sm:p-10 shadow-xs"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Rating Summary Box (cols 4) */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-4xl sm:text-5xl font-bold text-[#6B3F2A]">
                  5.0
                </span>
                <div className="flex items-center gap-1 text-[#F6C95E]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>

              <div className="text-xs sm:text-sm font-semibold text-[#CBA989]">
                359 happy reviews
              </div>
            </div>

            {/* Review 1 (cols 4) */}
            <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-[#EEDBC9] pt-6 md:pt-0 md:pl-8 space-y-2">
              <p className="text-base sm:text-lg italic text-[#6B3F2A] leading-snug">
                &ldquo;Beautiful books and toys. My daughter loves them!&rdquo;
              </p>
              <p className="text-xs font-bold text-[#DA7A5B]">
                — Sarah, Malang
              </p>
            </div>

            {/* Review 2 (cols 4) */}
            <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-[#EEDBC9] pt-6 md:pt-0 md:pl-8 space-y-2">
              <p className="text-base sm:text-lg italic text-[#6B3F2A] leading-snug">
                &ldquo;Great service and lovely selection. Highly recommended!&rdquo;
              </p>
              <p className="text-xs font-bold text-[#DA7A5B]">
                — Rani, Surabaya
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
