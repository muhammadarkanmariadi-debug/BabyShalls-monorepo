'use client';

import React from 'react';
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
  const spotsLeft = event.capacity ? event.capacity - 4 : 3;

  return (
    <div
      className={`group flex flex-col justify-between bg-white border border-[#EBEBEB] rounded-[24px] overflow-hidden shadow-figma-card hover:shadow-figma-hover transition-all text-left ${className}`}
    >
      <div>
        {/* Media / Event Photo */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F0F0F0]">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-3.5">
          {/* Meta Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-block bg-[#E4ECFB] text-[#3F5FA0] text-[11px] font-medium px-2.5 py-0.5 rounded-[6px]">
              Workshop
            </span>
            {spotsLeft > 0 && spotsLeft <= 5 && (
              <span className="inline-block bg-[#FFF1C7] text-[#8A5A00] text-[11px] font-medium px-2.5 py-0.5 rounded-[6px]">
                Sisa {spotsLeft} kursi
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-[18px] font-semibold text-[#2B2B2B] leading-snug group-hover:text-[#D9744A] transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Info Rows with Figma Icons */}
          <div className="space-y-2 pt-1 text-[13px] text-[#6B6B6B]">
            {/* Tanggal & Waktu */}
            <div className="flex items-center gap-2">
              <img
                src="/images/icons/icon-date.svg"
                alt=""
                className="w-4 h-4 shrink-0 opacity-80"
              />
              <span className="truncate">{event.date} · {event.time}</span>
            </div>

            {/* Lokasi */}
            <div className="flex items-center gap-2">
              <img
                src="/images/icons/icon-location.svg"
                alt=""
                className="w-4 h-4 shrink-0 opacity-80"
              />
              <span className="truncate">BabyShalls, Citraland Puncak Tidar</span>
            </div>

            {/* Harga & Usia */}
            <div className="flex items-center gap-2">
              <img
                src="/images/icons/icon-price.svg"
                alt=""
                className="w-4 h-4 shrink-0 opacity-80"
              />
              <span>Gratis · 3–6 tahun</span>
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="p-6 pt-0">
        <button
          type="button"
          onClick={() => onRegisterClick && onRegisterClick(event)}
          className="w-full py-3 bg-[#D9744A] hover:bg-[#C25F37] text-white rounded-[12px] text-[13px] font-semibold tracking-wider transition-colors cursor-pointer text-center"
        >
          Daftar Sekarang
        </button>
      </div>
    </div>
  );
};

