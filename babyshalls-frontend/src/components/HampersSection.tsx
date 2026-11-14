'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Gift } from 'lucide-react';

export const HampersSection: React.FC = () => {
  return (
    <section id="hampers" className="py-16 sm:py-24 md:py-28 bg-[#FFFDF9] border-b border-[#EDE8E1] w-full">
      {/* Full-width container with comfortable edge padding */}
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Text & Hampers Story */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#E07A5F] block mb-1">
              Gift Hampers &amp; Kado Spesial
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2C2725] leading-[1.15]">
              Buat Hampers Kado Spesial di BabyShalls
            </h2>

            <p className="text-sm sm:text-base text-[#68625D] leading-relaxed">
              Rayakan kelahiran buah hati, ulang tahun pertama, dan momen bermakna keluarga dengan paket hampers pilihan. Kombinasikan buku dongeng klasik impor dan mainan kayu Montessori alami — dibungkus cantik dalam kotak kayu pinus ramah lingkungan dengan pita kain linen dan kartu ucapan kaligrafi tulisan tangan.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#2C2725]">
                <span className="w-2 h-2 rounded-full bg-[#E07A5F]" />
                <span>Bebas pilih kombinasi buku dan mainan sesuai usia si kecil</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#2C2725]">
                <span className="w-2 h-2 rounded-full bg-[#E07A5F]" />
                <span>Kotak kayu pinus estetik, pita linen katun, dan kartu ucapan kustom</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#2C2725]">
                <span className="w-2 h-2 rounded-full bg-[#E07A5F]" />
                <span>Gratis bungkus kado dan pengiriman langsung di area Malang Raya</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/hampers"
                className="inline-flex items-center justify-center gap-2 bg-[#E07A5F] hover:bg-[#cc654b] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider px-8 py-4 rounded-md transition-all shadow-xs cursor-pointer"
              >
                <span>Buat Hampers Sekarang</span>
                <ArrowRight size={15} strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          {/* Right Column: Lifestyle Hamper Imagery */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-md overflow-hidden border border-[#EDE8E1] bg-white shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1600&q=85"
                alt="Baby gift hamper with curated books and wooden toys packaged with natural ribbon"
                className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute bottom-4 right-4 bg-[#FFFDF9]/95 backdrop-blur-xs border border-[#EDE8E1] px-4 py-2 rounded-sm text-xs font-bold text-[#2C2725] shadow-xs">
                Hand-tied at Citraland Malang
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
