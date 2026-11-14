'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export const OPENING_HOURS = 'Selasa – Minggu: 10.00 – 19.00 WIB';

export const Footer: React.FC = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (key: string) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890';
  const waGroupUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Halo BabyShalls, saya ingin bergabung ke grup komunitas katalog dan event.'
  )}`;

  return (
    <footer id="about" className="bg-[#F5F5F5] border-t border-[#EBEBEB] text-[#2B2B2B] pt-14 lg:pt-16 pb-10 w-full transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Desktop 5-Column Grid */}
        <div className="hidden md:grid grid-cols-12 gap-8 lg:gap-10 text-left pb-14 border-b border-[#EBEBEB]">
          
          {/* Col 1: Brand Info (col-span-3) */}
          <div className="col-span-12 lg:col-span-3 space-y-3.5">
            <Link href="/" className="inline-block">
              <img
                src="/BabyShallsLogo 1.PNG"
                alt="BabyShalls Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-[13px] text-[#6B6B6B] leading-relaxed">
              Toko buku anak kurasi dan mainan edukasi di Malang. Menemani setiap fase tumbuh kembang si kecil dengan produk terbaik.
            </p>
            <p className="text-[12px] text-[#6B6B6B] leading-relaxed">
              Citraland Puncak Tidar Blok HH-26, Malang
            </p>
          </div>

          {/* Col 2: Belanja (col-span-2) */}
          <div className="col-span-6 lg:col-span-2 space-y-3">
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#2B2B2B]">
              Belanja
            </h4>
            <ul className="space-y-2 text-[13px] text-[#6B6B6B]">
              <li>
                <Link href="/shop" className="hover:text-[#D9744A] transition-colors">
                  Buku Anak
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Educational+Toys" className="hover:text-[#D9744A] transition-colors">
                  Mainan Edukasi
                </Link>
              </li>
              <li>
                <Link href="/hampers" className="hover:text-[#D9744A] transition-colors">
                  Hampers Kado
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Preloved" className="hover:text-[#D9744A] transition-colors">
                  Buku Preloved
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#D9744A] transition-colors">
                  Koleksi Pilihan
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Bantuan (col-span-2) */}
          <div className="col-span-6 lg:col-span-2 space-y-3">
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#2B2B2B]">
              Bantuan
            </h4>
            <ul className="space-y-2 text-[13px] text-[#6B6B6B]">
              <li>
                <Link href="/faq" className="hover:text-[#D9744A] transition-colors">
                  Cara Pemesanan
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#D9744A] transition-colors">
                  Konfirmasi Pembayaran
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#D9744A] transition-colors">
                  Pengiriman &amp; Pickup
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#D9744A] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#D9744A] transition-colors">
                  Syarat &amp; Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: BabyShalls (col-span-2) */}
          <div className="col-span-6 lg:col-span-2 space-y-3">
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#2B2B2B]">
              BabyShalls
            </h4>
            <ul className="space-y-2 text-[13px] text-[#6B6B6B]">
              <li>
                <Link href="/about" className="hover:text-[#D9744A] transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#D9744A] transition-colors">
                  Event &amp; Workshop
                </Link>
              </li>
              <li>
                <Link href="/request-a-book" className="hover:text-[#D9744A] transition-colors">
                  Request Buku Impor
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#D9744A] transition-colors">
                  Lokasi Butik
                </Link>
              </li>
              <li>
                <span className="text-[12px] text-[#8C8C8C] block pt-1">{OPENING_HOURS}</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Komunitas (col-span-3) */}
          <div className="col-span-6 lg:col-span-3 space-y-3">
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#2B2B2B]">
              Komunitas
            </h4>
            <p className="text-[12px] text-[#6B6B6B] leading-relaxed">
              Dapatkan info promo spesial, rekomendasi bacaan, dan jadwal workshop gratis setiap minggu.
            </p>
            <div className="pt-1">
              <a
                href={waGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-[10px] text-[12px] font-semibold tracking-wide transition-colors shadow-xs"
              >
                <img
                  src="/images/icons/icon-whatsapp.svg"
                  alt=""
                  className="w-4 h-4 invert brightness-0"
                />
                <span>Gabung Grup WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Mobile Accordion View */}
        <div className="block md:hidden pb-8 border-b border-[#EBEBEB] text-left space-y-4">
          <div className="space-y-2 pb-2">
            <Link href="/" className="inline-block">
              <img
                src="/BabyShallsLogo 1.PNG"
                alt="BabyShalls Logo"
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-[13px] text-[#6B6B6B]">
              Toko buku anak kurasi dan mainan edukasi di Malang.
            </p>
          </div>

          {/* Accordion 1: Belanja */}
          <div className="border border-[#EBEBEB] rounded-lg bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('belanja')}
              className="w-full px-4 py-3 flex items-center justify-between text-[13px] font-semibold text-[#2B2B2B]"
            >
              <span>Belanja</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  openAccordion === 'belanja' ? 'rotate-180 text-[#D9744A]' : ''
                }`}
              />
            </button>
            {openAccordion === 'belanja' && (
              <ul className="px-4 pb-3 space-y-2 text-[13px] text-[#6B6B6B]">
                <li><Link href="/shop">Buku Anak</Link></li>
                <li><Link href="/shop?category=Educational+Toys">Mainan Edukasi</Link></li>
                <li><Link href="/hampers">Hampers Kado</Link></li>
                <li><Link href="/shop?category=Preloved">Buku Preloved</Link></li>
              </ul>
            )}
          </div>

          {/* Accordion 2: Bantuan */}
          <div className="border border-[#EBEBEB] rounded-lg bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('bantuan')}
              className="w-full px-4 py-3 flex items-center justify-between text-[13px] font-semibold text-[#2B2B2B]"
            >
              <span>Bantuan</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  openAccordion === 'bantuan' ? 'rotate-180 text-[#D9744A]' : ''
                }`}
              />
            </button>
            {openAccordion === 'bantuan' && (
              <ul className="px-4 pb-3 space-y-2 text-[13px] text-[#6B6B6B]">
                <li><Link href="/faq">Cara Pemesanan</Link></li>
                <li><Link href="/faq">Pengiriman &amp; Pickup</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/terms">Syarat &amp; Ketentuan</Link></li>
              </ul>
            )}
          </div>

          {/* Accordion 3: BabyShalls */}
          <div className="border border-[#EBEBEB] rounded-lg bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('about')}
              className="w-full px-4 py-3 flex items-center justify-between text-[13px] font-semibold text-[#2B2B2B]"
            >
              <span>BabyShalls</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  openAccordion === 'about' ? 'rotate-180 text-[#D9744A]' : ''
                }`}
              />
            </button>
            {openAccordion === 'about' && (
              <ul className="px-4 pb-3 space-y-2 text-[13px] text-[#6B6B6B]">
                <li><Link href="/about">Tentang Kami</Link></li>
                <li><Link href="/events">Event &amp; Workshop</Link></li>
                <li><Link href="/request-a-book">Request Buku</Link></li>
              </ul>
            )}
          </div>

          {/* WhatsApp Group Button on Mobile */}
          <div className="pt-2">
            <a
              href={waGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white rounded-[10px] text-[13px] font-semibold tracking-wide"
            >
              <img
                src="/images/icons/icon-whatsapp.svg"
                alt=""
                className="w-4 h-4 invert brightness-0"
              />
              <span>Gabung Grup WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar: Socials, Payment Badges, Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[12px] text-[#6B6B6B]">
          
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/babyshalls"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white border border-[#EBEBEB] flex items-center justify-center hover:border-[#D9744A] transition-colors"
              aria-label="Instagram BabyShalls"
            >
              <img
                src="/images/icons/icon-instagram.svg"
                alt="Instagram"
                className="w-4 h-4 object-contain"
              />
            </a>
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white border border-[#EBEBEB] flex items-center justify-center hover:border-[#D9744A] transition-colors"
              aria-label="WhatsApp BabyShalls"
            >
              <img
                src="/images/icons/icon-whatsapp.svg"
                alt="WhatsApp"
                className="w-4 h-4 object-contain"
              />
            </a>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="px-2.5 py-1 bg-white border border-[#EBEBEB] rounded-md text-[10px] font-semibold text-[#2B2B2B]">
              QRIS
            </span>
            <span className="px-2.5 py-1 bg-white border border-[#EBEBEB] rounded-md text-[10px] font-semibold text-[#2B2B2B]">
              BCA VA
            </span>
            <span className="px-2.5 py-1 bg-white border border-[#EBEBEB] rounded-md text-[10px] font-semibold text-[#2B2B2B]">
              Mandiri
            </span>
            <span className="px-2.5 py-1 bg-white border border-[#EBEBEB] rounded-md text-[10px] font-semibold text-[#2B2B2B]">
              GoPay / ShopeePay
            </span>
          </div>

          {/* Copyright */}
          <div>
            <p>© {new Date().getFullYear()} BabyShalls. All rights reserved.</p>
          </div>

        </div>

      </div>
    </footer>
  );
};

