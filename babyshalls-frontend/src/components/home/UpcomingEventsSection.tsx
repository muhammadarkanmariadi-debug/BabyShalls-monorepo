'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { mockWorkshops } from '@/data/mockProducts';
import { WireEventCard } from '@/components/common/WireEventCard';
import { WorkshopEvent } from '@/types';
import { Check, X } from 'lucide-react';

export const UpcomingEventsSection: React.FC = () => {
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
    <section id="workshops" className="py-12 md:py-16 bg-white w-full">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Section Header */}
        <div className="mb-8 md:mb-10 text-center">
          <h2 className="text-[22px] md:text-[28px] font-semibold uppercase text-[#2B2B2B] tracking-normal mb-2">
            Event &amp; Workshop
          </h2>
          <p className="text-[14px] md:text-[15px] text-[#6B6B6B] max-w-[560px] mx-auto font-normal">
            Sesi dongeng dan kegiatan sensori anak di butik BabyShalls Citraland Malang. Semua sesi gratis.
          </p>
        </div>

        {/* 3 Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {mockWorkshops.slice(0, 3).map((evt) => (
            <WireEventCard
              key={evt.id}
              event={evt}
              onRegisterClick={(e) => setSelectedEvent(e)}
            />
          ))}
        </div>

        {/* Button: Lihat Semua Event with Figma Arrow */}
        <div className="mt-10 md:mt-12 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#2B2B2B] hover:border-[#D9744A] text-[#2B2B2B] hover:text-[#D9744A] text-[13px] md:text-[14px] font-semibold uppercase tracking-wider rounded-[8px] transition-colors"
          >
            <span>Lihat Semua Event</span>
            <img
              src="/images/icons/icon-arrow.svg"
              alt=""
              className="w-4 h-4 object-contain"
            />
          </Link>
        </div>

      </div>

      {/* Registration Modal Card */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#EBEBEB] rounded-[24px] p-6 sm:p-8 max-w-md w-full shadow-figma-modal relative text-left">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-[#8C8C8C] hover:text-[#2B2B2B] p-1 cursor-pointer"
              aria-label="Tutup form pendaftaran"
            >
              <X size={20} />
            </button>

            {isRegistered ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#DDF1E5] text-[#2A6E37] flex items-center justify-center mx-auto">
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
                  <span className="inline-block px-2.5 py-0.5 rounded-[6px] bg-[#FBE8DF] text-[#D9744A] text-[11px] font-semibold uppercase tracking-wider mb-1.5">
                    Free Registration
                  </span>
                  <h4 className="text-[17px] font-semibold text-[#2B2B2B] leading-snug">
                    {selectedEvent.title}
                  </h4>
                  <p className="text-[12px] text-[#6B6B6B] mt-1">
                    {selectedEvent.date} · {selectedEvent.time}
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
                      className="w-full text-[13px] px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded-[8px] focus:outline-none focus:border-[#D9744A]"
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
                      className="w-full text-[13px] px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded-[8px] focus:outline-none focus:border-[#D9744A]"
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
                      className="w-full text-[13px] px-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded-[8px] focus:outline-none focus:border-[#D9744A]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#D9744A] hover:bg-[#C25F37] text-white rounded-[10px] text-[13px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
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

