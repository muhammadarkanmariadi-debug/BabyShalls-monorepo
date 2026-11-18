'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, Sparkles, ArrowRight } from 'lucide-react';
import { TombolKembali } from '@/components/common/TombolKembali';
import { ALL_EVENTS, PAST_EVENTS, MockEvent } from '@/data/eventsData';

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('Semua');

  const filterTabs = [
    'Semua',
    'Gratis',
    'Berbayar',
    'Workshop',
    'Story Time',
    'Market Day',
    'Live Sale',
  ];

  const filteredEvents = ALL_EVENTS.filter((ev) => {
    if (activeFilter === 'Semua') return true;
    if (activeFilter === 'Gratis') return ev.isFree;
    if (activeFilter === 'Berbayar') return !ev.isFree;
    return ev.category === activeFilter;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">


      {/* Hero Event Banner (Figma Node #169:4499, #F3E6F2 background) */}
      <section className="bg-[#F3E6F2] py-12 sm:py-16 border-b border-[#E6D2C0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7E4A84] block mb-2">
                EVENT & WORKSHOP
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-medium text-[#4A2A1C] leading-tight tracking-tight mb-3">
                Belajar sambil bermain di BabyShalls
              </h1>
              <p className="text-base sm:text-lg text-[#7A5644] leading-relaxed">
                Tersedia kegiatan <strong>Gratis</strong> (Story Time, Market Day, Live Sale) dan <strong>Workshop Spesial</strong> bersertifikat dengan bahan lengkap. Daftar online mudah dan tiket QR langsung terbit.
              </p>
            </div>

            {/* Mascot Holding Star Ticket (Figma Node #169:5194) */}
            <div className="relative w-52 h-44 sm:w-64 sm:h-52 shrink-0">
              <Image
                src="/images/mascot/maskot-tiket.png"
                alt="Maskot BabyShalls Tiket Event"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Events Section (Figma Node #169:4506) */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">

          {/* Filter Chips Bar (Figma #169:4507) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-[#F2E4D6]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-4 py-2 text-xs font-medium rounded-[2px] transition-colors cursor-pointer whitespace-nowrap ${isActive
                        ? 'bg-[#B05A26] text-white shadow-xs'
                        : 'bg-white border border-[#E6D2C0] text-[#4A2A1C] hover:border-[#B05A26]'
                      }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-[#7A5644] font-medium bg-[#FFF6EA] px-3 py-1.5 rounded-[2px] border border-[#E6D2C0]">
              Jadwal: November – Desember 2026
            </div>
          </div>

          {/* Section: Akan Datang */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] tracking-tight">
                Akan Datang ({filteredEvents.length} Event)
              </h2>
              <span className="text-xs text-[#7A5644]">
                Klik kartu atau tombol untuk melihat detail &amp; agenda lengkap
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredEvents.map((ev) => {
                const isFull = ev.status === 'Penuh';
                return (
                  /* ENTIRE CARD IS A CLICKABLE LINK TO /events/[id] */
                  <Link
                    key={ev.id}
                    href={`/events/${ev.id}`}
                    className="group bg-white border border-[#F2E4D6] rounded-[2px] overflow-hidden flex flex-col hover:border-[#B05A26] transition-all hover:shadow-md cursor-pointer"
                  >
                    {/* Event Photo (16:9) */}
                    <div className="relative aspect-video w-full bg-[#F0F0F0] overflow-hidden">
                      <Image
                        src={ev.image}
                        alt={ev.title}
                        fill
                        className="object-cover group-hover:scale-103 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 384px"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                        <span className="bg-[#FFF6EA] text-[#B05A26] text-[11px] font-semibold px-2.5 py-0.5 rounded-[2px] border border-[#E6D2C0]">
                          {ev.category}
                        </span>
                        {/* Clear FREE vs PAID Badge */}
                        {ev.isFree ? (
                          <span className="bg-[#2A6E37] text-white text-[11px] font-bold px-2 py-0.5 rounded-[2px] shadow-xs">
                            GRATIS
                          </span>
                        ) : (
                          <span className="bg-[#B05A26] text-white text-[11px] font-bold px-2 py-0.5 rounded-[2px] shadow-xs">
                            {ev.priceLabel}
                          </span>
                        )}
                      </div>

                      {/* Status pill on right */}
                      <div className="absolute top-3 right-3 z-10">
                        {ev.status === 'Sisa Sedikit' && (
                          <span className="bg-[#C0392B] text-white text-[11px] font-medium px-2 py-0.5 rounded-[2px]">
                            Sisa {ev.seatsLeft} kursi
                          </span>
                        )}
                        {ev.status === 'Penuh' && (
                          <span className="bg-[#7A5644] text-white text-[11px] font-medium px-2 py-0.5 rounded-[2px]">
                            Kuota Penuh
                          </span>
                        )}
                        {ev.status === 'Tersedia' && (
                          <span className="bg-[#2A6E37] text-white text-[11px] font-medium px-2 py-0.5 rounded-[2px]">
                            Tersedia
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Event Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Date & Time */}
                        <div className="flex items-center gap-2 text-xs text-[#7A5644] mb-2 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#B05A26]" />
                          <span>{ev.date} · {ev.time}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-[#4A2A1C] group-hover:text-[#B05A26] transition-colors leading-snug mb-2">
                          {ev.title}
                        </h3>

                        {/* Location & Age */}
                        <div className="space-y-1 text-xs text-[#7A5644] mb-3">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#7A5644] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{ev.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#7A5644] shrink-0" />
                            <span>Rekomendasi: {ev.age}</span>
                          </div>
                        </div>

                        <p className="text-xs text-[#7A5644] line-clamp-2 leading-relaxed mb-4">
                          {ev.description}
                        </p>
                      </div>

                      {/* Single CTA Button per Figma Node #169:4533 */}
                      <div className="pt-3 border-t border-[#F2E4D6]">
                        {isFull ? (
                          <span className="w-full py-2.5 bg-gray-200 text-gray-500 text-xs font-semibold rounded-[2px] text-center block">
                            Kuota Penuh • Lihat Detail
                          </span>
                        ) : (
                          <span className="w-full py-2.5 bg-[#B05A26] group-hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors text-center shadow-xs block">
                            {ev.isFree ? 'Daftar Gratis' : `Daftar Sekarang (${ev.priceLabel})`}
                          </span>
                        )}
                      </div>

                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section: Event Sebelumnya (Figma Node #169:4530) */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] tracking-tight mb-8">
              Event Sebelumnya (Dokumentasi)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
              {PAST_EVENTS.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] overflow-hidden flex flex-col opacity-90 hover:opacity-100 transition-opacity"
                >
                  <div className="relative aspect-video w-full bg-[#F0F0F0]">
                    <Image
                      src={ev.image}
                      alt={ev.title}
                      fill
                      className="object-cover grayscale-25"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#7A5644] text-white text-[11px] font-medium px-2 py-0.5 rounded-[2px]">
                        Telah Terlaksana
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-[#7A5644] mb-1">
                        {ev.date}
                      </div>
                      <h3 className="text-sm font-semibold text-[#4A2A1C] leading-snug mb-2">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-[#7A5644] line-clamp-2 leading-relaxed mb-4">
                        {ev.description}
                      </p>
                    </div>

                    <a
                      href="https://instagram.com/babyshalls"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#B05A26] hover:text-[#8E431A] font-semibold flex items-center gap-1 mt-2"
                    >
                      Lihat Dokumentasi di Instagram
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
