'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, MessageCircle, ExternalLink, Navigation } from 'lucide-react';
import { useCms } from '@/context/CmsContext';

export const OPENING_HOURS = 'Setiap hari 10.00 – 17.00 WIB';

export const Footer: React.FC = () => {
  const { cms } = useCms();
  const store = cms.store;

  const waNumber = store.whatsappNumber || process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890';
  const waGroupUrl = store.whatsappCommunityUrl || `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Halo BabyShalls, saya ingin bergabung ke grup komunitas katalog dan event.'
  )}`;
  const mapsUrl = store.googleMapsUrl || 'https://maps.google.com/?q=Citraland+Puncak+Tidar+Malang';

  return (
    <footer id="about" className="bg-[#FFF6EA] text-[#4A2A1C] border-t border-[#E6D2C0] pt-12 sm:pt-14 pb-8 w-full font-sans">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        
        {/* =========================================================================
            SECTION 1 · 5-COLUMN NAVIGATION GRID
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-10">
          
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
              Toko buku anak impor &amp; lokal terkurasi serta mainan edukasi di Citraland Malang. Menumbuhkan cinta membaca dan imajinasi sejak hari pertama si kecil.
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
                <span>Buka: {store.operatingHours || OPENING_HOURS}</span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Belanja (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-[#4A2A1C] uppercase tracking-wider">
              Belanja
            </h4>
            <ul className="space-y-2.5 text-xs text-[#7A5644]">
              <li>
                <Link href="/shop" className="hover:text-[#B05A26] transition-colors">
                  Katalog Buku Anak
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Educational+Toys" className="hover:text-[#B05A26] transition-colors">
                  Mainan Edukasi
                </Link>
              </li>
              <li>
                <Link href="/hampers" className="hover:text-[#B05A26] transition-colors">
                  Kado &amp; Parsel Bayi
                </Link>
              </li>
              <li>
                <Link href="/preloved" className="hover:text-[#B05A26] transition-colors">
                  Preloved Steril UV
                </Link>
              </li>
              <li>
                <Link href="/shop?tab=usia" className="hover:text-[#B05A26] transition-colors">
                  Belanja Berdasar Usia
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Bantuan (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-[#4A2A1C] uppercase tracking-wider">
              Bantuan
            </h4>
            <ul className="space-y-2.5 text-xs text-[#7A5644]">
              <li>
                <Link href="/faq" className="hover:text-[#B05A26] transition-colors">
                  Panduan Belanja
                </Link>
              </li>
              <li>
                <Link href="/faq#pengiriman" className="hover:text-[#B05A26] transition-colors">
                  Pengiriman &amp; Ambil Toko
                </Link>
              </li>
              <li>
                <Link href="/faq#preloved" className="hover:text-[#B05A26] transition-colors">
                  Standar Sterilisasi UV
                </Link>
              </li>
              <li>
                <Link href="/request-a-book" className="hover:text-[#B05A26] transition-colors">
                  Layanan Request Buku
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B05A26] transition-colors inline-flex items-center gap-1"
                >
                  <span>Chat WhatsApp Admin</span>
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
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#B05A26] transition-colors">
                  Event &amp; Sensory Play
                </Link>
              </li>
              <li>
                <Link href="/about#gallery" className="hover:text-[#B05A26] transition-colors">
                  Area Bermain Toko Fisik
                </Link>
              </li>
              <li>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B05A26] transition-colors"
                >
                  Petunjuk Arah Maps
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 5: WhatsApp Community Box (Span 2) */}
          <div className="lg:col-span-2">
            <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-[#E6D2C0] shadow-2xs space-y-2.5">
              <span className="text-[10px] font-bold text-[#2A6E37] bg-[#DDF1E5] px-2 py-0.5 rounded-[2px] uppercase tracking-wider">
                KOMUNITAS ORANG TUA
              </span>
              <h5 className="text-xs font-semibold text-[#4A2A1C] leading-snug">
                Grup Komunitas WhatsApp
              </h5>
              <p className="text-[11px] text-[#7A5644] leading-relaxed">
                Update buku impor restock, live sale, &amp; kuota workshop sebelum umum.
              </p>
              <a
                href={waGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle size={13} />
                <span>Gabung Grup</span>
              </a>
            </div>
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
              <span>Peta Lokasi Butik BabyShalls &bull; {store.address}, {store.city}</span>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#B05A26] hover:text-[#8E431A] font-medium hover:underline shrink-0"
            >
              <Navigation size={13} />
              <span>Buka di Google Maps ↗</span>
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
          
          {/* Sosial Media & Metode Pembayaran */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            {/* Medsos */}
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white border border-[#E6D2C0] rounded-[2px] flex items-center justify-center hover:border-[#B05A26] transition-colors shadow-2xs"
                aria-label="WhatsApp BabyShalls"
              >
                <Image
                  src="/images/icons/icon-whatsapp.svg"
                  alt="WhatsApp"
                  width={16}
                  height={16}
                />
              </a>
              <a
                href={store.instagramUrl || 'https://instagram.com/babyshalls'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white border border-[#E6D2C0] rounded-[2px] flex items-center justify-center hover:border-[#B05A26] transition-colors shadow-2xs"
                aria-label="Instagram BabyShalls"
              >
                <Image
                  src="/images/icons/icon-instagram.svg"
                  alt="Instagram"
                  width={16}
                  height={16}
                />
              </a>
            </div>

            {/* Metode Bayar Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['QRIS', 'Visa', 'Mastercard', 'Virtual Account'].map((method) => (
                <span
                  key={method}
                  className="px-2.5 py-0.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[10px] font-semibold text-[#7A5644] shadow-2xs"
                >
                  {method}
                </span>
              ))}
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
