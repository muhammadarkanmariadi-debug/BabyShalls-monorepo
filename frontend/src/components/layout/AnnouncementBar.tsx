'use client';

import React from 'react';
import { Gift, MessageCircle } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#F6C95E] text-[#5B3A29] text-[13px] font-semibold py-2 px-4 relative z-30 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-6 text-center flex-wrap">
        <div className="inline-flex items-center gap-2">
          <Gift className="w-4 h-4 text-[#5B3A29]" />
          <span>Free gift wrapping for hampers</span>
        </div>
        <span className="opacity-40 hidden sm:inline">•</span>
        <div className="inline-flex items-center gap-2">
          <a
            href="https://wa.me/6281234567890?text=Halo%20BabyShalls,%20saya%20ingin%20tanya%20tentang%20produk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[#D9744A] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#5B3A29]" />
            <span>Chat us on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
