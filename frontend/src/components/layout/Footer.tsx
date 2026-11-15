'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import { DEFAULT_CMS_VALUES, extractGmapsEmbedUrl, usePublicCms } from '../../hooks/useCms';

export const Footer: React.FC = () => {
  const { data: cms } = usePublicCms();
  const gmapsSrc = extractGmapsEmbedUrl(cms?.footer_gmaps_embed_url);
  const waUrl = cms?.social_whatsapp_url ?? DEFAULT_CMS_VALUES.social_whatsapp_url;
  const igUrl = cms?.social_instagram_url ?? DEFAULT_CMS_VALUES.social_instagram_url;
  const tiktokUrl = cms?.social_tiktok_url ?? DEFAULT_CMS_VALUES.social_tiktok_url;

  return (
    <footer className="bg-[#F8FAFC] border-t border-[#CBD5E1] text-[#1A1A1A] py-9 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 h-64 sm:h-72 rounded-3xl border border-[#E5E7EB] relative overflow-hidden bg-[#F1F5F9]">
          <iframe
            title="Peta Lokasi Butik BabyShalls Kota Malang"
            src={gmapsSrc}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

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
          {(igUrl || tiktokUrl || waUrl) && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#475569]">
              {igUrl && (
                <a href={igUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#1E543B] hover:underline underline-offset-4">
                  Instagram
                </a>
              )}
              {tiktokUrl && (
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#1E543B] hover:underline underline-offset-4">
                  TikTok
                </a>
              )}
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#1E543B] hover:underline underline-offset-4">
                  WhatsApp CS
                </a>
              )}
            </div>
          )}
          <p className="text-xs text-[#475569]">
            © 2026 BabyShalls Malang. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
