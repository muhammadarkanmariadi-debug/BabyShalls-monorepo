'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer id="about" className="bg-[#FFFDF9] border-t border-[#EDE8E1] text-[#2C2725] pt-16 md:pt-20 pb-12 w-full">
      {/* Full-width container with comfortable edge padding */}
      <div className="w-full px-4 sm:px-6 lg:px-10">
        
        {/* 4-Column Editorial Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14 text-left">
          
          {/* Column 1: About Us with Brand Logo */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/BabyShallsLogo 1.PNG"
                alt="BabyShalls Logo"
                className="h-11 sm:h-13 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-[#68625D] leading-relaxed">
              Boutique children’s bookstore dan ruang belajar Montessori di Malang. Menghadirkan buku bantal, board books impor, dan mainan edukatif kayu bersertifikasi aman untuk menemani fase emas si kecil.
            </p>
            <p className="text-[11px] text-[#68625D] pt-1">
              Malang, Jawa Timur, Indonesia
            </p>
          </div>

          {/* Column 2: Customer Care */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2725]">
              Layanan Pelanggan
            </h4>
            <ul className="space-y-2 text-xs text-[#68625D]">
              <li>
                <Link href="/request-a-book" className="hover:text-[#E07A5F] transition-colors">
                  Request Buku Impor
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#E07A5F] transition-colors">
                  Katalog Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/hampers" className="hover:text-[#E07A5F] transition-colors">
                  Custom Paket Hampers
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#E07A5F] transition-colors">
                  Jadwal Event &amp; Workshop (Gratis)
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#E07A5F] transition-colors">
                  FAQ &amp; Pickup Toko Malang
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#E07A5F] transition-colors">
                  Akun &amp; Riwayat Pesanan
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Follow Us */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2725]">
              Ikuti Kami
            </h4>
            <ul className="space-y-2 text-xs text-[#68625D]">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E07A5F] transition-colors"
                >
                  Instagram (@babyshalls)
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E07A5F] transition-colors"
                >
                  TikTok Reading Recaps
                </a>
              </li>
              <li>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E07A5F] transition-colors"
                >
                  Pinterest Nursery Ideas
                </a>
              </li>
              <li>
                <a
                  href="https://substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E07A5F] transition-colors"
                >
                  Newsletter Orang Tua Bijak
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Find Us */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2725]">
              Lokasi Butik
            </h4>
            <p className="text-xs text-[#68625D] leading-relaxed">
              Citraland Puncak Tidar Blok HH-26<br />
              Sukun, Malang, Jawa Timur 65146<br />
              Indonesia
            </p>
            <div className="pt-1 text-xs text-[#68625D] space-y-1">
              <div>Buka: Selasa – Minggu: 10.00 – 19.00 WIB</div>
              <div>Senin: Tutup (Kurasi &amp; Restock)</div>
              <div className="pt-2">
                <Link href="/admin" className="text-[11px] text-[#68625D] hover:text-[#E07A5F] underline underline-offset-2">
                  Portal Login Admin
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#EDE8E1] flex flex-col sm:flex-row items-center justify-between text-xs text-[#68625D] gap-4">
          <p>© {new Date().getFullYear()} BabyShalls. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-xs text-[#68625D]">
            <span className="hover:text-[#E07A5F] cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-[#E07A5F] cursor-pointer">Syarat &amp; Ketentuan</span>
            <span className="hover:text-[#E07A5F] cursor-pointer">Garansi Keaslian Buku</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
