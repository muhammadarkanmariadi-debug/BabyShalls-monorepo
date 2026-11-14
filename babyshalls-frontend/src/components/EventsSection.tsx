'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Check, X, ArrowRight } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  image: string;
  spotsLeft: number;
}

export const EventsSection: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [parentName, setParentName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [email, setEmail] = useState('');

  const events: EventItem[] = [
    {
      id: 'nature-craft',
      title: 'Little Explorers: Nature Craft Workshop',
      subtitle: 'Membuat pembatas buku daun kering dan eksplorasi cat air ramah anak.',
      date: 'Sabtu, 24 Mei 2025',
      time: '10:00 – 11:30 WIB',
      location: 'BabyShalls Studio, Citraland Puncak Tidar HH-26, Malang',
      image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
      spotsLeft: 4
    },
    {
      id: 'wooden-play',
      title: 'Play & Learn: Wooden Sensory Session',
      subtitle: 'Bermain balok kayu Montessori, melatih fokus spasial dan motorik halus balita.',
      date: 'Sabtu, 7 Juni 2025',
      time: '10:00 – 11:30 WIB',
      location: 'BabyShalls Studio, Citraland Puncak Tidar HH-26, Malang',
      image: 'https://images.unsplash.com/photo-1596464716127-f2a829822321?auto=format&fit=crop&w=800&q=80',
      spotsLeft: 6
    },
    {
      id: 'story-hour',
      title: 'Weekend Story Hour: The Magic Paintbrush',
      subtitle: 'Sesi mendongeng interaktif bilingual dan melukis jari bersama orang tua.',
      date: 'Sabtu, 21 Juni 2025',
      time: '15:30 – 17:00 WIB',
      location: 'BabyShalls Studio, Citraland Puncak Tidar HH-26, Malang',
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80',
      spotsLeft: 5
    }
  ];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistered(true);
    setTimeout(() => {
      setSelectedEvent(null);
      setIsRegistered(false);
      setParentName('');
      setChildAge('');
      setEmail('');
    }, 2500);
  };

  return (
    <section id="workshops" className="py-16 sm:py-24 md:py-28 bg-[#FFFDF9] border-b border-[#EDE8E1] w-full">
      {/* Full-width container with comfortable edge padding */}
      <div className="w-full px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#EDE8E1] gap-4 text-left">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#E07A5F] block mb-1">
              Community &amp; Creativity
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2C2725]">
              Upcoming Events &amp; Workshops
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#68625D]">
              Sesi dongeng hangat dan kelas kreasi akhir pekan untuk anak &amp; keluarga di ruang baca Citraland Malang. <strong>Semua sesi gratis untuk umum.</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#E2ECE0] text-[#3A5C37] rounded-full text-xs font-semibold">
              Gratis / Free Entry
            </span>
          </div>
        </div>

        {/* Grid of 3 Clean Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-white border border-[#EDE8E1] rounded-md overflow-hidden flex flex-col justify-between transition-all hover:border-[#E07A5F] group text-left shadow-xs"
            >
              <div>
                {/* Event Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FDF6E2]">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#E2ECE0] text-[#3A5C37] border border-[#C7DAC3] px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider">
                    Gratis
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 border border-[#EDE8E1] px-2.5 py-1 rounded-sm text-[11px] font-semibold text-[#2C2725]">
                    Sisa {evt.spotsLeft} Kuota
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#E07A5F] font-semibold">
                    <Calendar size={14} strokeWidth={1.5} />
                    <span>{evt.date} • {evt.time}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#2C2725] leading-snug group-hover:text-[#E07A5F] transition-colors">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-[#68625D] line-clamp-2 leading-relaxed">
                    {evt.subtitle}
                  </p>

                  <div className="pt-1 text-[11px] text-[#68625D] flex items-center gap-1">
                    <MapPin size={12} strokeWidth={1.5} />
                    <span className="truncate">Citraland Puncak Tidar, Malang</span>
                  </div>
                </div>
              </div>

              {/* Simple 'Daftar' Outline Button */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(evt)}
                  className="w-full py-2.5 border border-[#E07A5F] text-[#E07A5F] hover:bg-[#E07A5F] hover:text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Daftar Gratis
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Link to All Events */}
        <div className="mt-12 text-center">
          <Link
            href="/events"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-[#EDE8E1] hover:border-[#E07A5F] text-[#2C2725] hover:text-[#E07A5F] text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-md transition-all shadow-xs"
          >
            <span>Lihat Semua Jadwal &amp; E-Tiket Workshop</span>
            <ArrowRight size={15} strokeWidth={1.5} />
          </Link>
        </div>

      </div>

      {/* Centered White Card Modal for In-app Registration */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FFFDF9] border border-[#EDE8E1] rounded-lg p-6 sm:p-8 max-w-md w-full shadow-lg relative text-left">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-[#68625D] hover:text-[#2C2725] p-1 cursor-pointer"
              aria-label="Tutup form pendaftaran"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            {isRegistered ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E2ECE0] text-[#3A5C37] flex items-center justify-center mx-auto border border-[#C7DAC3]">
                  <Check size={24} strokeWidth={2} />
                </div>
                <h4 className="text-lg font-bold text-[#2C2725]">Pendaftaran Berhasil!</h4>
                <p className="text-xs text-[#68625D] max-w-xs mx-auto">
                  Terima kasih! Jadwal dan konfirmasi kehadiran telah kami kirimkan ke email Anda.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded bg-[#E2ECE0] text-[#3A5C37] text-[10px] font-bold uppercase tracking-wider mb-1">
                    Free Registration
                  </div>
                  <h4 className="text-lg font-bold text-[#2C2725] leading-snug">
                    {selectedEvent.title}
                  </h4>
                  <p className="text-xs text-[#68625D] mt-1">
                    {selectedEvent.date} • {selectedEvent.time}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-[#2C2725] mb-1">
                      Nama Orang Tua / Wali *
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Ibu Sarah"
                      className="w-full text-xs px-3 py-2 bg-white border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2C2725] mb-1">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah@example.com"
                      className="w-full text-xs px-3 py-2 bg-white border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2C2725] mb-1">
                      Usia Anak *
                    </label>
                    <input
                      type="text"
                      required
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value)}
                      placeholder="e.g. 3 tahun"
                      className="w-full text-xs px-3 py-2 bg-white border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#E07A5F] hover:bg-[#cc654b] text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Konfirmasi Reservasi (Gratis)
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
