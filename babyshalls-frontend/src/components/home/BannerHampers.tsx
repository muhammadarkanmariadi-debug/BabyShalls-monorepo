'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const BannerHampers: React.FC = () => {
  return (
    <section className="relative w-full h-[520px] bg-[#FFFBF5] overflow-hidden">
      {/* Background Hampers Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/products/banner-hampers.png"
          alt="Hampers BabyShalls"
          fill
          priority
          className="object-cover object-right lg:object-center"
          sizes="100vw"
        />
        {/* Soft gradient fade on left for readable text on mobile/tablets */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFFBF5]/95 via-[#FFFBF5]/80 to-transparent lg:from-transparent" />
      </div>

      {/* Teks Overlay on Left (Figma #131:38956 width: 761px, padding: 0 106px 0 76px) */}
      <div className="relative max-w-[1440px] mx-auto h-full px-6 sm:px-12 lg:px-20 flex flex-col justify-center items-start z-10">
        <div className="max-w-[620px] space-y-5">
          <h2 className="text-[28px] sm:text-[32px] font-medium text-[#4A2A1C] leading-[1.25] tracking-tight">
            HAMPERS UNTUK SETIAP MOMEN
          </h2>

          <p className="text-[16px] sm:text-[18px] text-[#7A5644] font-normal leading-[1.5]">
            Paket buku dan mainan siap kado, dipilih sesuai usia si kecil. Gratis bungkus dan kartu ucapan.
          </p>

          <div className="pt-2">
            <Link
              href="/hampers"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#B05A26] hover:bg-[#8E431A] text-white text-[16px] font-medium rounded-[2px] transition-colors shadow-xs"
            >
              <span>LIHAT HAMPERS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-1">
            <a
              href="https://wa.me/6281234567890?text=Halo%20BabyShalls,%20saya%20tertarik%20dengan%20custom%20hampers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#B05A26] hover:text-[#8E431A] text-[16px] font-normal transition-colors"
            >
              Mau hampers custom? Chat kami via WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
