'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Package } from 'lucide-react';

interface GiftHampersBannerProps {
  onExploreHampers: () => void;
}

export const GiftHampersBanner: React.FC<GiftHampersBannerProps> = ({ onExploreHampers }) => {
  return (
    <section className="py-16 md:py-20 bg-[#FFF8EF] border-b border-[#EEDBC9]" id="gift-hampers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-[#FAF4ED] rounded-3xl border border-[#EEDBC9] p-6 sm:p-10 lg:p-12 shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EEDBC9] text-xs font-bold text-[#DA7A5B]">
                <Package className="w-3.5 h-3.5" />
                <span>Custom Gift Hampers</span>
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#6B3F2A] tracking-tight">
                Gift Hampers
              </h2>

              <p className="text-base sm:text-lg text-[#6B3F2A]/85 font-normal leading-relaxed max-w-lg">
                Thoughtful gifts for curious kids. Packaged with care in wooden keepsake boxes with greeting cards and gift ribbon.
              </p>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onExploreHampers}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-sm sm:text-base shadow-xs transition-colors cursor-pointer"
                >
                  <span>Explore Hampers</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden shadow-xs border border-[#EEDBC9] bg-white group"
              >
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
                  alt="Hampers Kado BabyShalls dengan pita hijau estetik dan kartu ucapan"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
