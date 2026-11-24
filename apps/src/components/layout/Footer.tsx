'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, MessageCircle, ExternalLink, Navigation } from 'lucide-react';
import { useCms } from '@/context/CmsContext';

export const OPENING_HOURS = 'Daily 10:00 AM – 5:00 PM WIB';

export const Footer: React.FC = () => {
  const { cms } = useCms();
  const store = cms.store;

  const waNumber = store.whatsappNumber || process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890';
  const waGroupUrl = store.whatsappCommunityUrl || `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Hello BabyShalls, I would like to join the community group for new arrivals and events.'
  )}`;
  const mapsUrl = store.googleMapsUrl || 'https://maps.google.com/?q=Citraland+Puncak+Tidar+Malang';

  return (
    <footer id="about" className="bg-[#FFF6EA] text-[#4A2A1C] border-t border-[#E6D2C0] pt-12 sm:pt-14 pb-8 w-full font-sans">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">

        {/* =========================================================================
            SECTION 1 · 5-COLUMN NAVIGATION GRID
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-8 lg:gap-8 pb-10">

          {/* Kolom 1: Brand & Lokasi (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block relative py-0.5" aria-label="BabyShalls Home">
              <div className="relative w-32 h-11">
                <Image
                  src="/BabyShallsLogo 1.PNG"
                  alt="Baby Shall's"
                  fill
                  sizes="128px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="text-xs sm:text-[13px] text-[#7A5644] leading-relaxed max-w-sm">
              Curated import &amp; local children's books and educational toys in Citraland Malang. Nurturing a love for reading and imagination from your little one's earliest days.
            </p>

            <div className="bg-white/80 border border-[#E6D2C0] p-3.5 rounded-[4px] space-y-2 text-xs text-[#4A2A1C] max-w-sm shadow-2xs">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#B05A26] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {store.address}, {store.city}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[#7A5644]">
                <Clock size={15} className="text-[#B05A26] shrink-0" />
                <span>Hours: {store.operatingHours || OPENING_HOURS}</span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Shop (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-[#4A2A1C] uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2.5 text-xs text-[#7A5644]">
              <li>
                <Link href="/shop" className="hover:text-[#B05A26] transition-colors">
                  Children's Books
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Educational+Toys" className="hover:text-[#B05A26] transition-colors">
                  Educational Toys
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Hampers" className="hover:text-[#B05A26] transition-colors">
                  Gifts &amp; Baby Hampers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Preloved" className="hover:text-[#B05A26] transition-colors">
                  UV-Sterilized Preloved
                </Link>
              </li>
              <li>
                <Link href="/shop?tab=usia" className="hover:text-[#B05A26] transition-colors">
                  Shop by Age
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Help & Support (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-[#4A2A1C] uppercase tracking-wider">
              Help &amp; Support
            </h4>
            <ul className="space-y-2.5 text-xs text-[#7A5644]">
              <li>
                <Link href="/faq" className="hover:text-[#B05A26] transition-colors">
                  Shopping Guide
                </Link>
              </li>
              <li>
                <Link href="/faq#pengiriman" className="hover:text-[#B05A26] transition-colors">
                  Shipping &amp; Store Pickup
                </Link>
              </li>
              <li>
                <Link href="/faq#preloved" className="hover:text-[#B05A26] transition-colors">
                  UV Sterilization Standard
                </Link>
              </li>
              <li>
                <Link href="/request-a-book" className="hover:text-[#B05A26] transition-colors">
                  Book Request Service
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B05A26] transition-colors inline-flex items-center gap-1"
                >
                  <span>WhatsApp Customer Support</span>
                  <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: BabyShalls (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-[#4A2A1C] uppercase tracking-wider">
              BabyShalls
            </h4>
            <ul className="space-y-2.5 text-xs text-[#7A5644]">
              <li>
                <Link href="/about" className="hover:text-[#B05A26] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#B05A26] transition-colors">
                  Events &amp; Sensory Play
                </Link>
              </li>
              <li>
                <Link href="/about#gallery" className="hover:text-[#B05A26] transition-colors">
                  Store Play Area
                </Link>
              </li>
              <li>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B05A26] transition-colors"
                >
                  Get Directions on Maps
                </a>
              </li>
            </ul>
          </div>


        </div>

        {/* =========================================================================
            SECTION 2 · PETA LOKASI BUTIK CITRALAND (GOOGLE MAPS IFRAME - RAPI & ELEGAN)
            ========================================================================= */}
        <div id="lokasi" className="mb-10 bg-white border border-[#E6D2C0] rounded-[6px] overflow-hidden shadow-2xs">
          {/* Header Bar Peta */}
          <div className="bg-[#FFFDF9] px-4 sm:px-6 py-3 border-b border-[#F2E4D6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#4A2A1C] font-semibold">
              <MapPin size={15} className="text-[#B05A26] shrink-0" />
              <span>BabyShalls Boutique Map &bull; {store.address}, {store.city}</span>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#B05A26] hover:text-[#8E431A] font-medium hover:underline shrink-0"
            >
              <Navigation size={13} />
              <span>Open in Google Maps ↗</span>
            </a>
          </div>

          {/* Embedded Google Maps Frame */}
          <div className="w-full h-[200px] sm:h-[230px] bg-[#F0F0F0] relative">
            <iframe
              title="Peta Lokasi Butik BabyShalls Citraland Malang"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.378938166945!2d112.5971!3d-7.9602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNTcnMzYuNyJTIDExMsKwMzUnNDkuNiJF!5e0!3m2!1sid!2sid!4v1620000000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* =========================================================================
            SECTION 3 · BOTTOM BAR: MEDSOS, METODE BAYAR & COPYRIGHT
            ========================================================================= */}
        <div className="pt-6 border-t border-[#E6D2C0] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#7A5644]">

          {/* Sosial Media & Partner Pembayaran/Pengiriman */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            {/* Medsos: WhatsApp, Instagram, TikTok */}
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white border border-[#E6D2C0] rounded-[2px] flex items-center justify-center hover:border-[#25D366] transition-colors shadow-2xs"
                aria-label="WhatsApp BabyShalls"
                title="WhatsApp BabyShalls"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.12c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.43.75-2.13 1.01-2.42.27-.29.58-.36.77-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.15.12.32.02.51-.1.19-.15.32-.29.49-.15.17-.3.38-.43.51-.14.15-.29.31-.12.6.17.29.75 1.24 1.61 2 1.11.99 2.04 1.3 2.33 1.45.29.14.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.39-.24.66-.14.27.1 1.7.8 1.99.95.29.14.48.22.55.34.07.12.07.7-.17 1.38z" />
                </svg>
              </a>
              <a
                href={store.instagramUrl || 'https://instagram.com/babyshalls'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white border border-[#E6D2C0] rounded-[2px] flex items-center justify-center hover:border-[#E4405F] transition-colors shadow-2xs"
                aria-label="Instagram BabyShalls"
                title="Instagram BabyShalls"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                  <defs>
                    <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FD5949" />
                      <stop offset="50%" stopColor="#D6249F" />
                      <stop offset="100%" stopColor="#285AEB" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#ig-grad)"
                    d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
                  />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@babyshalls"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white border border-[#E6D2C0] rounded-[2px] flex items-center justify-center hover:border-[#111111] transition-colors shadow-2xs"
                aria-label="TikTok BabyShalls"
                title="TikTok BabyShalls"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#111111]" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                </svg>
              </a>
            </div>

            {/* Partner Logos: Midtrans, RajaOngkir, BinderByte */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Midtrans */}
              <div
                className="h-8 px-2.5 bg-white border border-[#E6D2C0] rounded-[2px] flex items-center gap-1.5 shadow-2xs"
                title="Pembayaran Midtrans"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                  <rect x="2" y="5" width="4" height="14" rx="2" fill="#002855" />
                  <rect x="10" y="2" width="4" height="20" rx="2" fill="#00A3E0" />
                  <rect x="18" y="5" width="4" height="14" rx="2" fill="#002855" />
                </svg>
                <span className="text-[11px] font-bold tracking-tight text-[#002855]">midtrans</span>
              </div>

              {/* RajaOngkir */}
              <div
                className="h-8 px-2.5 bg-white border border-[#E6D2C0] rounded-[2px] flex items-center gap-1.5 shadow-2xs"
                title="Cek Ongkir RajaOngkir"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                  <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#F97316" />
                  <path d="M12 12l9-5M12 12v10M12 12L3 7" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
                </svg>
                <span className="text-[11px] font-bold tracking-tight text-[#1E293B]">
                  Raja<span className="text-[#F97316]">Ongkir</span>
                </span>
              </div>

              {/* BinderByte */}
              <div
                className="h-8 px-2.5 bg-white border border-[#E6D2C0] rounded-[2px] flex items-center gap-1.5 shadow-2xs"
                title="Tracking & Kurir BinderByte"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="#0D9488" />
                  <path d="M8 12l3 3 5-6" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                <span className="text-[11px] font-bold tracking-tight text-[#0F172A]">
                  Binder<span className="text-[#0D9488]">Byte</span>
                </span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right text-[11px] text-[#7A5644]">
            <p>&copy; 2026 BabyShalls &bull; Citraland Malang. All rights reserved.</p>
          </div>

        </div>

      </div>
    </footer>
  );
};
