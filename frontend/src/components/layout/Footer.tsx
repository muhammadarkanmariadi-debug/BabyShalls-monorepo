'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FFF9F0] border-t border-[#EEDBC9] text-[#5B3A29] py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Main Footer Row matching Reference Design */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#EEDBC9]/80 text-center md:text-left">
          
          {/* 1. Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="BabyShalls Logo"
              className="w-10 h-10 object-contain rounded-full bg-white p-0.5 border border-[#EEDBC9] shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0"
            />
            <span className="font-serif text-2xl font-bold tracking-tight text-[#5B3A29]">
              BabyShalls
            </span>
          </Link>

          {/* 2. Address & Operational Hours */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs text-[#6B3F2A]/90">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#DA7A5B] flex-shrink-0" />
              <span>Jl. Cempaka No. 12, Malang</span>
            </div>
            <span className="hidden sm:inline text-[#EEDBC9]">|</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#DA7A5B] flex-shrink-0" />
              <span>Open daily 10.00 – 17.00</span>
            </div>
          </div>

          {/* 3. Socials & Payment Methods */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            
            {/* Social Icons */}
            <div className="flex items-center gap-2 text-[#6B3F2A]">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-[#FFF0E2] hover:bg-[#D9744A] text-[#6B3F2A] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-[#FFF0E2] hover:bg-[#D9744A] text-[#6B3F2A] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* Pinterest */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-[#FFF0E2] hover:bg-[#D9744A] text-[#6B3F2A] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Pinterest"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.98-.13-2.5.03-3.58l1-4.22s-.25-.5-.25-1.24c0-1.16.67-2.03 1.51-2.03.71 0 1.05.53 1.05 1.17 0 .72-.46 1.79-.7 2.78-.2.83.42 1.5 1.24 1.5 1.48 0 2.62-1.56 2.62-3.82 0-1.99-1.43-3.39-3.48-3.39-2.37 0-3.76 1.78-3.76 3.62 0 .72.28 1.48.62 1.9.07.08.08.15.06.24l-.23.95c-.04.15-.13.18-.3.1-1.12-.52-1.82-2.15-1.82-3.46 0-2.82 2.05-5.41 5.91-5.41 3.1 0 5.51 2.21 5.51 5.16 0 3.08-1.94 5.56-4.64 5.56-.91 0-1.76-.47-2.05-1.02l-.56 2.13c-.2.78-.75 1.76-1.12 2.36A12 12 0 1 0 12 0z"/>
                </svg>
              </a>
            </div>

            {/* Payment Method Badges */}
            <div className="flex items-center gap-1.5 text-[10px] font-black tracking-wider text-[#6B3F2A]">
              <span className="px-2 py-0.5 rounded bg-white border border-[#EEDBC9] text-[#1A1F71] font-bold">VISA</span>
              <span className="px-2 py-0.5 rounded bg-white border border-[#EEDBC9] text-[#EB001B] font-bold">MC</span>
              <span className="px-2 py-0.5 rounded bg-white border border-[#EEDBC9] text-[#0066AE] font-bold">BCA</span>
              <span className="px-2 py-0.5 rounded bg-white border border-[#EEDBC9] text-[#F15A24] font-bold">BNI</span>
            </div>

          </div>

        </div>

        {/* Quick Navigation Links */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#8A6A55] font-semibold">
          <Link href="/about" className="hover:text-[#DA7A5B] transition-colors">
            About BabyShalls
          </Link>
          <span className="text-[#EEDBC9]">•</span>
          <Link href="/events" className="hover:text-[#DA7A5B] transition-colors">
            Workshops & Events
          </Link>
          <span className="text-[#EEDBC9]">•</span>
          <Link href="/faq" className="hover:text-[#DA7A5B] transition-colors">
            FAQ
          </Link>
          <span className="text-[#EEDBC9]">•</span>
          <Link href="/request-book" className="hover:text-[#DA7A5B] transition-colors">
            Request a Book
          </Link>
          <span className="text-[#EEDBC9]">•</span>
          <Link href="/catalog" className="hover:text-[#DA7A5B] transition-colors">
            Katalog Toko
          </Link>
        </div>

        {/* Copyright */}
        <div className="pt-3 text-center text-[11px] text-[#A68A78]">
          <p>© 2026 BabyShalls Malang. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};
