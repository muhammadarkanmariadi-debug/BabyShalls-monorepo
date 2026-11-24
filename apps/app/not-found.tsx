import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 sm:py-16 bg-[#FFFDF9]">
      <div className="max-w-lg w-full text-center flex flex-col items-center">
        {/* Mascot Holding Map (Figma Node #169:6497) */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-4">
          <Image
            src="/images/mascot/maskot-peta.png"
            alt="Page Not Found"
            fill
            priority
            className="object-contain"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-medium text-[#4A2A1C] mb-3 tracking-tight">
          Oops, page not found
        </h1>

        <p className="text-base text-[#7A5644] mb-8 leading-relaxed max-w-md">
          The page you are looking for might have been moved, removed, or the link was mistyped.
        </p>

        <div className="flex items-center gap-3 w-full justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#B05A26] hover:bg-[#964B1F] text-white font-medium text-xs sm:text-sm rounded-[2px] transition-colors shadow-xs flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/shop"
            className="px-6 py-3 border border-[#C9B3A5] text-[#4A2A1C] hover:bg-white hover:border-[#B05A26] font-medium text-xs sm:text-sm rounded-[2px] transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
