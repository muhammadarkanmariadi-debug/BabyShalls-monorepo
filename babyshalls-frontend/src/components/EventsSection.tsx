'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Check, X } from 'lucide-react';
import { mockWorkshops } from '@/data/mockProducts';
import { WorkshopEvent } from '@/types';

export const EventsSection: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<WorkshopEvent | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [parentName, setParentName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [email, setEmail] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistered(true);
    setTimeout(() => {
      setSelectedEvent(null);
      setIsRegistered(false);
      setParentName('');
      setChildAge('');
      setEmail('');
    }, 2000);
  };

  return (
    <section id="workshops" className="py-10 md:py-16 bg-[#FFFFFF] w-full">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Centered Uppercase Heading Only */}
        <div className="mb-8 md:mb-10 text-center">
          <h2 className="text-[22px] md:text-[28px] font-semibold uppercase text-[#2B2B2B] tracking-normal mb-2">
            EVENT &amp; WORKSHOP
          </h2>
          <p className="text-[14px] md:text-[16px] text-[#6B6B6B] max-w-[560px] mx-auto font-normal">
            Sesi dongeng dan kegiatan sensori anak di butik BabyShalls Citraland Malang. Semua sesi gratis.
          </p>
        </div>

        {/* 3 Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {mockWorkshops.slice(0, 3).map((evt) => (
            <div
              key={evt.id}
              className="group flex flex-col justify-between bg-white border border-[#E5E5E5] rounded-[6px] overflow-hidden text-left hover:border-[#D9744A] transition-colors"
            >
              <div>
                {/* Event Photo */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F0F0F0]">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#D9744A] text-white px-2.5 py-0.5 rounded-[4px] text-[11px] font-semibold uppercase tracking-wider">
                    GRATIS
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 text-[#2B2B2B] border border-[#E5E5E5] px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium">
                    Sisa {evt.capacity - 4} Kuota
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#D9744A] font-medium mb-2">
                    <Calendar size={13} strokeWidth={1.5} />
                    <span>{evt.date} • {evt.time}</span>
                  </div>

                  <h3 className="text-[16px] font-semibold text-[#2B2B2B] leading-snug group-hover:text-[#D9744A] transition-colors line-clamp-1">
                    {evt.title}
                  </h3>

                  <p className="text-[13px] text-[#6B6B6B] mt-2 line-clamp-2 font-normal leading-relaxed">
                    {evt.subtitle}
                  </p>

                  <div className="mt-3 text-[12px] text-[#6B6B6B] flex items-center gap-1.5 font-normal">
                    <MapPin size={13} strokeWidth={1.5} className="shrink-0" />
                    <span className="truncate">Citraland Puncak Tidar, Malang</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(evt)}
                  className="w-full py-2.5 border border-[#2B2B2B] text-[#2B2B2B] hover:bg-[#D9744A] hover:border-[#D9744A] hover:text-white rounded-[4px] text-[12px] font-semibold uppercase tracking-wider transition-colors cursor-pointer text-center"
                >
                  DAFTAR SEKARANG
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Centered Outline Button: LIHAT SEMUA EVENT */}
        <div className="mt-10 text-center">
          <Link
            href="/events"
            className="inline-flex items-center justify-center h-12 px-8 border border-[#2B2B2B] hover:border-[#D9744A] text-[#2B2B2B] hover:text-[#D9744A] text-[14px] font-semibold uppercase tracking-wider rounded-[4px] transition-colors"
          >
            LIHAT SEMUA EVENT
          </Link>
        </div>

      </div>

      {/* Centered White Card Modal for In-app Registration */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E5E5] rounded-[6px] p-6 sm:p-8 max-w-md w-full shadow-lg relative text-left">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-[#6B6B6B] hover:text-[#2B2B2B] p-1 cursor-pointer"
              aria-label="Tutup form pendaftaran"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            {isRegistered ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
                  <Check size={24} strokeWidth={2} />
                </div>
                <h4 className="text-[18px] font-semibold text-[#2B2B2B]">Pendaftaran Berhasil!</h4>
                <p className="text-[13px] text-[#6B6B6B] max-w-xs mx-auto">
                  Konfirmasi kehadiran dan e-tiket telah kami kirimkan ke email Anda. Sampai jumpa di BabyShalls!
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-[4px] bg-[#D9744A]/10 text-[#D9744A] text-[11px] font-semibold uppercase tracking-wider mb-1">
                    Free Registration
                  </span>
                  <h4 className="text-[17px] font-semibold text-[#2B2B2B] leading-snug">
                    {selectedEvent.title}
                  </h4>
                  <p className="text-[12px] text-[#6B6B6B] mt-1">
                    {selectedEvent.date} • {selectedEvent.time}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[12px] font-medium text-[#2B2B2B] mb-1">
                      Nama Orang Tua / Wali *
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Sarah Amelia"
                      className="w-full text-[13px] px-3 py-2 bg-white border border-[#E5E5E5] rounded-[4px] focus:outline-none focus:border-[#D9744A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#2B2B2B] mb-1">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah@example.com"
                      className="w-full text-[13px] px-3 py-2 bg-white border border-[#E5E5E5] rounded-[4px] focus:outline-none focus:border-[#D9744A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#2B2B2B] mb-1">
                      Usia Anak *
                    </label>
                    <input
                      type="text"
                      required
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value)}
                      placeholder="e.g. 3 tahun"
                      className="w-full text-[13px] px-3 py-2 bg-white border border-[#E5E5E5] rounded-[4px] focus:outline-none focus:border-[#D9744A]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#D9744A] hover:bg-[#c46237] text-white rounded-[4px] text-[13px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    KONFIRMASI PENDAFTARAN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
