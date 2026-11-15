'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const OPENING_HOURS = 'Setiap hari 10.00 – 17.00 WIB';

export const Footer: React.FC = () => {
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890';
  const waGroupUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Halo BabyShalls, saya ingin bergabung ke grup komunitas katalog dan event.'
  )}`;

  return (
    <footer id="about" className="bg-[#F9E0C8] text-[#4A2A1C] pt-14 pb-8 w-full">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Top Kolom Area (Figma #130:351) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10">
          
          {/* Kolom 1: Brand (340px) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block relative">
              <div className="relative w-20 h-18">
                <Image
                  src="/BabyShallsLogo 1.PNG"
                  alt="Baby Shall's"
                  fill
                  sizes="80px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-[14px] text-[#7A5644] leading-relaxed max-w-sm">
              Toko buku anak dan mainan edukasi di Malang sejak 2020. Ada area bermain gratis di toko.
            </p>
            <p className="text-[14px] text-[#4A2A1C] leading-relaxed">
              Citraland Puncak Tidar HH-26, Malang<br />
              <span className="text-[#7A5644]">Setiap hari 10.00–17.00 (dummy)</span>
            </p>
          </div>

          {/* Kolom 2: Belanja */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[18px] font-medium text-[#4A2A1C]">
              Belanja
            </h4>
            <ul className="space-y-2 text-[14px] text-[#7A5644]">
              <li>
                <Link href="/shop?tab=usia" className="hover:text-[#B05A26] transition-colors">
                  Belanja per Usia
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#B05A26] transition-colors">
                  Buku
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Educational+Toys" className="hover:text-[#B05A26] transition-colors">
                  Mainan Edukasi
                </Link>
              </li>
              <li>
                <Link href="/hampers" className="hover:text-[#B05A26] transition-colors">
                  Hampers
                </Link>
              </li>
              <li>
                <Link href="/preloved" className="hover:text-[#B05A26] transition-colors">
                  Preloved
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Bantuan */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[18px] font-medium text-[#4A2A1C]">
              Bantuan
            </h4>
            <ul className="space-y-2 text-[14px] text-[#7A5644]">
              <li>
                <Link href="/faq" className="hover:text-[#B05A26] transition-colors">
                  Cara Belanja
                </Link>
              </li>
              <li>
                <Link href="/faq#pengiriman" className="hover:text-[#B05A26] transition-colors">
                  Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/faq#pengembalian" className="hover:text-[#B05A26] transition-colors">
                  Pengembalian
                </Link>
              </li>
              <li>
                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#B05A26] transition-colors">
                  Hubungi Kami
                </a>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#B05A26] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: BabyShalls */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[18px] font-medium text-[#4A2A1C]">
              BabyShalls
            </h4>
            <ul className="space-y-2 text-[14px] text-[#7A5644]">
              <li>
                <Link href="/about" className="hover:text-[#B05A26] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#B05A26] transition-colors">
                  Event &amp; Workshop
                </Link>
              </li>
              <li>
                <Link href="/request" className="hover:text-[#B05A26] transition-colors">
                  Request Buku
                </Link>
              </li>
              <li>
                <a href="#lokasi" className="hover:text-[#B05A26] transition-colors">
                  Kunjungi Toko
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 5: Ajakan WhatsApp Card (300px white card) */}
          <div className="lg:col-span-2">
            <div className="bg-white p-5 rounded-[2px] space-y-3 w-full max-w-[300px]">
              <div className="space-y-1">
                <h4 className="text-[18px] font-medium text-[#4A2A1C]">
                  Gabung Grup WhatsApp
                </h4>
                <p className="text-[14px] text-[#7A5644] leading-relaxed">
                  Katalog terbaru &amp; info Live Sale lebih dulu.
                </p>
              </div>
              <a
                href={waGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center py-3 px-5 bg-[#B05A26] hover:bg-[#8E431A] text-white text-[16px] font-medium rounded-[2px] transition-colors"
              >
                Gabung Sekarang
              </a>
            </div>
          </div>

        </div>

        {/* Peta Lokasi (iframe Google Maps: full-width x 220px) */}
        <div id="lokasi" className="my-6 w-full h-[220px] rounded-[2px] overflow-hidden border border-[#CCCCCC] bg-[#F0F0F0]">
          <iframe
            title="Lokasi BabyShalls Malang"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15805.214088915474!2d112.58550186175535!3d-7.96752763666245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7882650df9ae93%3A0xe54e58b1eb9b4646!2sCitraland%20Puncak%20Tidar%20Malang!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Bottom Bar: Medsos, Metode Bayar, Copyright */}
        <div className="pt-6 border-t-[1.5px] border-[#E6D2C0] flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[#7A5644]">
          
          {/* Sosial Media & Metode Bayar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Medsos */}
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-[2px] flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="WhatsApp"
              >
                <img
                  src="/images/icons/icon-whatsapp.svg"
                  alt="WhatsApp"
                  className="w-5 h-5 object-contain"
                />
              </a>
              <a
                href="https://instagram.com/babyshalls"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-[2px] flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="Instagram"
              >
                <img
                  src="/images/icons/icon-instagram.svg"
                  alt="Instagram"
                  className="w-5 h-5 object-contain"
                />
              </a>
            </div>

            {/* Metode Bayar */}
            <div className="flex items-center gap-2 pl-2">
              {['QRIS', 'Visa', 'Mastercard', 'VA'].map((method) => (
                <span
                  key={method}
                  className="px-3 py-1.5 bg-white border border-[#F2E4D6] rounded-[2px] text-[13px] font-medium text-[#7A5644]"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div>
            <p>© 2026 BabyShalls · Malang</p>
          </div>

        </div>

      </div>
    </footer>
  );
};
