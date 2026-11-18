'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { mockWorkshops } from '@/data/mockProducts';
import { WireEventCard } from '@/components/common/WireEventCard';
import { WorkshopEvent } from '@/types';
import { Check, X, ArrowRight } from 'lucide-react';

export const UpcomingEventsSection: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<WorkshopEvent | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [parentName, setParentName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [email, setEmail] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvent) {
      try {
        const existing = JSON.parse(localStorage.getItem('babyshalls_event_tickets') || '[]');
        const newTicket = {
          ticketId: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
          eventTitle: selectedEvent.title,
          eventDate: selectedEvent.date,
          eventTime: selectedEvent.time,
          location: selectedEvent.location || 'BabyShalls Citraland Puncak Tidar, Malang',
          parentName: parentName || 'Bunda Sarah',
          childName: childAge ? `Anak (${childAge})` : 'Kenzo (3 th)',
          status: 'Tiket Aktif',
        };
        localStorage.setItem('babyshalls_event_tickets', JSON.stringify([newTicket, ...existing]));
      } catch {
        // Fallback
      }
    }
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
    <section id="workshops" className="py-16 sm:py-20 bg-white w-full">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Header: Headline only matching Figma #130:264 */}
        <div className="mb-8 sm:mb-10 text-center">
          <h2 className="text-[28px] sm:text-[32px] font-semibold uppercase text-[#4A2A1C] tracking-tight">
            Event &amp; Workshop
          </h2>
        </div>

        {/* 3 Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {mockWorkshops.slice(0, 3).map((evt) => (
            <WireEventCard
              key={evt.id}
              event={evt}
              onRegisterClick={(e) => setSelectedEvent(e)}
            />
          ))}
        </div>

        {/* Tautan: Lihat Semua Event with Arrow */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-[#B05A26] hover:text-[#8E431A] text-[16px] font-medium transition-colors group"
          >
            <span>Lihat Semua Event</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>

      {/* Registration Modal Card */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#E6D2C0] rounded-[2px] p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-[#7A5644] hover:text-[#4A2A1C] p-1 cursor-pointer"
              aria-label="Tutup form pendaftaran"
            >
              <X size={20} />
            </button>

            {isRegistered ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#DDF1E5] text-[#2A6E37] flex items-center justify-center mx-auto">
                  <Check size={24} strokeWidth={2} />
                </div>
                <h4 className="text-[18px] font-semibold text-[#4A2A1C]">Pendaftaran Berhasil!</h4>
                <p className="text-[13px] text-[#7A5644] max-w-xs mx-auto">
                  Konfirmasi kehadiran dan e-tiket telah kami kirimkan ke email Anda. Sampai jumpa di BabyShalls!
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-[2px] bg-[#E4ECFB] text-[#3F5FA0] text-[11px] font-semibold uppercase tracking-wider mb-1.5">
                    Workshop Registration
                  </span>
                  <h4 className="text-[17px] font-semibold text-[#4A2A1C] leading-snug">
                    {selectedEvent.title}
                  </h4>
                  <p className="text-[12px] text-[#7A5644] mt-1">
                    {selectedEvent.date} · {selectedEvent.time}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[12px] font-medium text-[#4A2A1C] mb-1">
                      Nama Orang Tua
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Bunda Sarah"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full px-3 py-2 text-[14px] border border-[#E6D2C0] rounded-[2px] focus:outline-none focus:border-[#B05A26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#4A2A1C] mb-1">
                      Usia Anak
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 4 tahun"
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value)}
                      className="w-full px-3 py-2 text-[14px] border border-[#E6D2C0] rounded-[2px] focus:outline-none focus:border-[#B05A26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#4A2A1C] mb-1">
                      WhatsApp / Email
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="0812... / email@anda.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-[14px] border border-[#E6D2C0] rounded-[2px] focus:outline-none focus:border-[#B05A26]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#B05A26] hover:bg-[#8E431A] text-white rounded-[2px] text-[14px] font-semibold tracking-wider transition-colors cursor-pointer"
                  >
                    Konfirmasi Kehadiran
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
