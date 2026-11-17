import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">

      {/* Main 404 Container (Figma Node #169:6314) */}
      <main className="flex-1 py-20 sm:py-28 flex items-center justify-center px-4 bg-[#FFFDF9]">
        <div className="max-w-md w-full text-center flex flex-col items-center">
          
          {/* Mascot Holding Map, Confused (Figma Node #169:6497) */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 mb-4">
            <Image
              src="/images/mascot/maskot-peta.png"
              alt="Halaman Tidak Ditemukan"
              fill
              priority
              className="object-contain"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-medium text-[#4A2A1C] mb-2 tracking-tight">
            Ups, halamannya hilang
          </h1>

          <p className="text-sm sm:text-base text-[#7A5644] mb-8 leading-relaxed">
            Mungkin halaman sudah dipindah atau tautan yang kamu buka salah ketik.
          </p>

          <div className="flex items-center gap-3 w-full justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-[#B05A26] hover:bg-[#964B1F] text-white font-medium text-xs rounded-[2px] transition-colors shadow-sm"
            >
              Ke Beranda
            </Link>

            <Link
              href="/shop"
              className="px-6 py-3 border border-[#C9B3A5] text-[#4A2A1C] hover:bg-white hover:border-[#B05A26] font-medium text-xs rounded-[2px] transition-colors"
            >
              Cari Produk
            </Link>
          </div>

        </div>
      </main>

    </div>
  );
}

