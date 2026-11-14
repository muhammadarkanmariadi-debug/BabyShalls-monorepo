'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F8FAFC] border-t border-[#CBD5E1] text-[#1A1A1A] py-9 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row 1: Brand + Store Info + Official Partner SVG Logos */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-[#E2E8F0] text-center lg:text-left">
          {/* 1. Brand Logo Horizontal */}
          <Link href="/" className="flex items-center group min-h-[44px]" aria-label="Baby Shall's Beranda">
            <img
              src="/images/babyshalls-logo.png"
              alt="Baby Shall's Logo"
              className="h-11 sm:h-13 w-auto object-contain shrink-0"
            />
          </Link>

          {/* 2. Address & Operational Hours */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-[13px] font-medium text-[#1E293B]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#1E543B] shrink-0" />
              <span>Jl. Cempaka No. 12, Malang</span>
            </div>
            <span className="hidden sm:inline text-[#CBD5E1]">|</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#1E543B] shrink-0" />
              <span>Open daily 10.00 – 17.00</span>
            </div>
          </div>

          {/* 3. Official Payment & Logistics Partner Logos */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <img
              src="/images/logos/midtrans.svg"
              alt="Midtrans Payment Gateway"
              className="h-5 w-auto object-contain"
            />
            <img
              src="/images/logos/kiriminaja.svg"
              alt="KiriminAja Malang"
              className="h-6 w-auto object-contain"
            />
          </div>
        </div>

        {/* Row 2: Centered Navigation Links & Copyright */}
        <div className="pt-5 flex flex-col items-center gap-2 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] font-medium text-[#1E293B]">
            <Link href="/about" className="hover:text-[#1E543B] hover:underline underline-offset-4">
              About BabyShalls
            </Link>
            <span className="text-[#CBD5E1]" aria-hidden="true">•</span>
            <Link href="/events" className="hover:text-[#1E543B] hover:underline underline-offset-4">
              Workshops &amp; Events
            </Link>
            <span className="text-[#CBD5E1]" aria-hidden="true">•</span>
            <Link href="/faq" className="hover:text-[#1E543B] hover:underline underline-offset-4">
              FAQ
            </Link>
            <span className="text-[#CBD5E1]" aria-hidden="true">•</span>
            <Link href="/request-book" className="hover:text-[#1E543B] hover:underline underline-offset-4">
              Request a Book
            </Link>
            <span className="text-[#CBD5E1]" aria-hidden="true">•</span>
            <Link href="/catalog" className="hover:text-[#1E543B] hover:underline underline-offset-4">
              Katalog Toko
            </Link>
          </div>
          <p className="text-xs text-[#475569]">
            © 2026 BabyShalls Malang. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
