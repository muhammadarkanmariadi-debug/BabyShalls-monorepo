'use client';

import React from 'react';
import Image from 'next/image';
import { WorkshopEvent } from '@/types';

interface WireEventCardProps {
  event: WorkshopEvent;
  onRegisterClick?: (event: WorkshopEvent) => void;
  className?: string;
}

export const WireEventCard: React.FC<WireEventCardProps> = ({
  event,
  onRegisterClick,
  className = '',
}) => {
  return (
    <div
      className={`group flex flex-col justify-between bg-white border border-[#E6D2C0] rounded-[2px] overflow-hidden shadow-[0px_2px_8px_0px_rgba(74,42,28,0.06)] hover:shadow-[0px_8px_24px_0px_rgba(74,42,28,0.08)] transition-all text-left ${className}`}
    >
      <div>
        {/* Media / Event Photo (384x216 in Figma) */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#FFFBF5]">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover object-center group-hover:scale-103 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 384px"
          />

          {/* Top-Left Badge: Workshop */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block bg-[#E4ECFB] text-[#3F5FA0] text-[13px] font-medium px-3 py-1 rounded-[2px]">
              Workshop
            </span>
          </div>

          {/* Top-Right Badge: Sisa 3 kursi (if applicable) */}
          {event.id === 'event-2' && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-block bg-[#FFF1C7] text-[#8A5A00] text-[13px] font-medium px-3 py-1 rounded-[2px] shadow-xs">
                Sisa 3 kursi
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-3">
          {/* Title (18px Medium #4A2A1C) */}
          <h3 className="text-[18px] font-medium text-[#4A2A1C] leading-[1.3] group-hover:text-[#B05A26] transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Info Rows with Figma Icons */}
          <div className="space-y-1.5 pt-0.5 text-[14px] text-[#7A5644]">
            {/* Tanggal & Waktu */}
            <div className="flex items-center gap-2">
              <img
                src="/images/icons/icon-calendar.svg"
                alt=""
                className="w-4 h-4 shrink-0"
              />
              <span className="truncate">{event.date} · {event.time}</span>
            </div>

            {/* Lokasi */}
            <div className="flex items-center gap-2">
              <img
                src="/images/icons/icon-map-pin.svg"
                alt=""
                className="w-4 h-4 shrink-0"
              />
              <span className="truncate">BabyShalls, Citraland Puncak Tidar</span>
            </div>
          </div>

          {/* Harga & Usia (#B05A26 font-medium 16px) */}
          <div className="pt-1 text-[16px] font-medium text-[#B05A26]">
            {event.price === 0 ? (
              <span>Gratis · 3–6 tahun</span>
            ) : (
              <span>Rp{event.price.toLocaleString('id-ID')} / anak · 3–6 tahun</span>
            )}
          </div>
        </div>
      </div>

      {/* Button: Daftar Sekarang */}
      <div className="p-5 sm:p-6 pt-0">
        <button
          type="button"
          onClick={() => onRegisterClick && onRegisterClick(event)}
          className="w-full py-3 bg-[#B05A26] hover:bg-[#8E431A] text-white rounded-[2px] text-[16px] font-medium tracking-wide transition-colors cursor-pointer text-center shadow-xs"
        >
          Daftar Sekarang
        </button>
      </div>
    </div>
  );
};
