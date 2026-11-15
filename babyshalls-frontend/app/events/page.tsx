'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Check, Users, ArrowRight, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TombolKembali } from '@/components/common/TombolKembali';

interface EventItem {
  id: string;
  title: string;
  category: 'Workshop' | 'Story Time' | 'Market Day' | 'Live Sale';
  date: string;
  time: string;
  location: string;
  age: string;
  price: string;
  status: 'Tersedia' | 'Sisa Sedikit' | 'Penuh' | 'Sudah Lewat';
  seatsLeft?: number;
  image: string;
  description: string;
}

const mockEventsList: EventItem[] = [
  {
    id: 'nature-craft',
    title: 'Little Explorers: Nature Craft & Sensory Play',
    category: 'Workshop',
    date: 'Sabtu, 28 November 2026',
    time: '09.30 – 11.30 WIB',
    location: 'BabyShalls Citraland Puncak Tidar Blok HH-26, Malang',
    age: '3–7 tahun',
    price: 'GRATIS',
    status: 'Sisa Sedikit',
    seatsLeft: 3,
    image: '/images/events/event-workshop-alam.png',
    description: 'Aktivitas sensorik menggunakan dedaunan, ranting, dan tanah liat alami untuk mengasah motorik halus si kecil.',
  },
  {
    id: 'story-time-dongeng',
    title: 'Weekend Story Time: Petualangan Si Kancil & Hutan Ajaib',
    category: 'Story Time',
    date: 'Minggu, 29 November 2026',
    time: '15.30 – 17.00 WIB',
    location: 'Area Karpet Baca BabyShalls Malang',
    age: '2–6 tahun',
    price: 'GRATIS',
    status: 'Tersedia',
    seatsLeft: 8,
    image: '/images/events/event-story-time.png',
    description: 'Sesi mendongeng interaktif dengan boneka tangan bersama Kak Nisa, dilanjutkan membaca buku bersama orang tua.',
  },
  {
    id: 'market-day-cilik',
    title: 'Kids Market Day: Belajar Berniaga & Menghargai Buku',
    category: 'Market Day',
    date: 'Sabtu, 12 Desember 2026',
    time: '10.00 – 13.00 WIB',
    location: 'Halaman Butik BabyShalls Citraland Malang',
    age: '4–9 tahun',
    price: 'GRATIS',
    status: 'Tersedia',
    seatsLeft: 6,
    image: '/images/events/event-market-day.png',
    description: 'Anak-anak berlatih menjadi kasir cilik, bertukar buku cerita favorit, dan belajar konsep matematika dasar.',
  },
  {
    id: 'live-sale-akhirtahun',
    title: 'Live Sale Akhir Tahun: Bedah Buku Impor & Diskon Eksklusif',
    category: 'Live Sale',
    date: 'Jumat, 18 Desember 2026',
    time: '19.00 – 21.00 WIB',
    location: 'Online via Instagram Live @babyshalls',
    age: 'Semua Usia',
    price: 'GRATIS',
    status: 'Tersedia',
    seatsLeft: 50,
    image: '/images/events/event-workshop-alam.png',
    description: 'Ulasan langsung 30+ judul buku impor terbaru dengan promo bundling dan giveaway buku anak.',
  },
  {
    id: 'clay-art-modeling',
    title: 'Sensory Modeling Clay: Membuat Tokoh Buku Favorit',
    category: 'Workshop',
    date: 'Sabtu, 19 Desember 2026',
    time: '09.30 – 11.30 WIB',
    location: 'Area Workshop BabyShalls Malang',
    age: '3–8 tahun',
    price: 'GRATIS',
    status: 'Penuh',
    seatsLeft: 0,
    image: '/images/events/event-story-time.png',
    description: 'Membentuk karakter ulat sangat lapar dan hewan hutan dari clay berbahan dasar tepung gandum non-toksik.',
  },
  {
    id: 'holiday-story-camp',
    title: 'Holiday Book Camp: 2 Hari Membaca & Melukis Kanvas',
    category: 'Workshop',
    date: 'Rabu, 23 Desember 2026',
    time: '09.00 – 12.00 WIB',
    location: 'BabyShalls Citraland Puncak Tidar, Malang',
    age: '5–10 tahun',
    price: 'GRATIS',
    status: 'Tersedia',
    seatsLeft: 5,
    image: '/images/events/event-market-day.png',
    description: 'Program liburan sekolah menyenangkan dengan menggambar ilustrasi cerita impian di atas kanvas mini.',
  },
];

const pastEventsList: EventItem[] = [
  {
    id: 'past-1',
    title: 'Story Time: Menyanyi & Berhitung Bersama Dongeng Nusantara',
    category: 'Story Time',
    date: '10 Oktober 2026',
    time: 'Selesai',
    location: 'BabyShalls Citraland Malang',
    age: '2–5 tahun',
    price: 'GRATIS',
    status: 'Sudah Lewat',
    image: '/images/events/event-story-time.png',
    description: 'Sesi mendongeng diiringi instrumen musik akustik anak yang diikuti 18 keluarga di Malang.',
  },
  {
    id: 'past-2',
    title: 'Workshop Origami Kertas Daur Ulang & Membaca Nyaring',
    category: 'Workshop',
    date: '24 Oktober 2026',
    time: 'Selesai',
    location: 'BabyShalls Citraland Malang',
    age: '4–8 tahun',
    price: 'GRATIS',
    status: 'Sudah Lewat',
    image: '/images/events/event-workshop-alam.png',
    description: 'Mengolah kertas ramah lingkungan menjadi bentuk hewan lucu sembari mengenal ekosistem alam.',
  },
  {
    id: 'past-3',
    title: 'Piknik Literasi Cilik di Taman Butik BabyShalls',
    category: 'Market Day',
    date: '7 November 2026',
    time: 'Selesai',
    location: 'BabyShalls Citraland Malang',
    age: 'Semua Usia',
    price: 'GRATIS',
    status: 'Sudah Lewat',
    image: '/images/events/event-market-day.png',
    description: 'Membaca bersama beralaskan karpet piknik dan mencicipi camilan sehat buatan para ibu.',
  },
];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedEventForModal, setSelectedEventForModal] = useState<EventItem | null>(null);

  // Modal Form State
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('4');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = ['Semua', 'Workshop', 'Story Time', 'Market Day', 'Live Sale'];

  const filteredEvents = mockEventsList.filter((ev) => {
    if (activeCategory === 'Semua') return true;
    return ev.category === activeCategory;
  });

  const handleOpenRegister = (ev: EventItem) => {
    setSelectedEventForModal(ev);
    setIsSuccess(false);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ticketId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRegistration = {
      ticketId,
      eventId: selectedEventForModal?.id,
      eventTitle: selectedEventForModal?.title,
      eventDate: selectedEventForModal?.date,
      eventTime: selectedEventForModal?.time,
      location: selectedEventForModal?.location,
      parentName,
      childName,
      childAge,
      phone,
      email,
      registeredAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(localStorage.getItem('babyshalls_event_tickets') || '[]');
        existing.unshift(newRegistration);
        localStorage.setItem('babyshalls_event_tickets', JSON.stringify(existing));
      } catch {
        // pass
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <TombolKembali fallbackUrl="/" label="Kembali ke Beranda" />

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
                Workshop kreatif, story time, Market Day, dan Live Sale. Seluruh kegiatan tatap muka di toko tidak dipungut biaya (Gratis). Daftar online dan tiket QR langsung dikirim.
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
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-xs font-medium rounded-[2px] transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#B05A26] text-white'
                        : 'bg-white border border-[#E6D2C0] text-[#4A2A1C] hover:border-[#B05A26]'
                    }`}
                  >
                    {cat}
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
            <h2 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] tracking-tight mb-8">
              Akan Datang
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredEvents.map((ev) => {
                const isFull = ev.status === 'Penuh';
                return (
                  <div
                    key={ev.id}
                    className="bg-white border border-[#F2E4D6] rounded-[2px] overflow-hidden flex flex-col hover:border-[#B05A26] transition-all hover:shadow-sm"
                  >
                    {/* Event Photo (16:9) */}
                    <div className="relative aspect-video w-full bg-[#F0F0F0]">
                      <Image
                        src={ev.image}
                        alt={ev.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 384px"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                        <span className="bg-[#FFF6EA] text-[#B05A26] text-[11px] font-semibold px-2.5 py-0.5 rounded-[2px] border border-[#E6D2C0]">
                          {ev.category}
                        </span>
                        <span className="bg-[#2A6E37] text-white text-[11px] font-bold px-2 py-0.5 rounded-[2px]">
                          {ev.price}
                        </span>
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
                        <h3 className="text-base font-semibold text-[#4A2A1C] leading-snug mb-2">
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
                            <span>Rekomendasi usia: {ev.age}</span>
                          </div>
                        </div>

                        <p className="text-xs text-[#7A5644] line-clamp-2 leading-relaxed mb-4">
                          {ev.description}
                        </p>
                      </div>

                      {/* CTA Buttons */}
                      <div className="pt-3 border-t border-[#F2E4D6] flex items-center gap-2">
                        <Link
                          href={`/events/${ev.id}`}
                          className="flex-1 py-2 text-xs font-medium text-[#4A2A1C] border border-[#E6D2C0] rounded-[2px] text-center hover:bg-[#FFF6EA] transition-colors"
                        >
                          Detail Event
                        </Link>

                        <button
                          type="button"
                          disabled={isFull}
                          onClick={() => handleOpenRegister(ev)}
                          className={`flex-1 py-2 text-xs font-semibold rounded-[2px] transition-colors text-center cursor-pointer ${
                            isFull
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-[#B05A26] hover:bg-[#964B1F] text-white shadow-xs'
                          }`}
                        >
                          {isFull ? 'Penuh' : 'Daftar Sekarang'}
                        </button>
                      </div>

                    </div>
                  </div>
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
              {pastEventsList.map((ev) => (
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
                      className="w-full py-2 border border-[#C9B3A5] text-[#4A2A1C] text-xs font-medium text-center rounded-[2px] hover:bg-white transition-colors"
                    >
                      Lihat Dokumentasi di IG →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Registration Modal Popup */}
      {selectedEventForModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-[2px] p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedEventForModal(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccess ? (
              <form onSubmit={handleRegisterSubmit}>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B05A26] block mb-1">
                  Pendaftaran Event Gratis
                </span>
                <h3 className="text-xl font-medium text-[#4A2A1C] mb-2 leading-snug">
                  {selectedEventForModal.title}
                </h3>
                <p className="text-xs text-[#7A5644] mb-6">
                  {selectedEventForModal.date} · {selectedEventForModal.time} di {selectedEventForModal.location}
                </p>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#7A5644] font-medium mb-1">
                      Nama Lengkap Orang Tua / Pendamping *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Rina Wahyuni"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#7A5644] font-medium mb-1">
                        Nama Si Kecil *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Arka"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#7A5644] font-medium mb-1">
                        Usia Si Kecil *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        required
                        value={childAge}
                        onChange={(e) => setChildAge(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#7A5644] font-medium mb-1">
                      Nomor WhatsApp Aktif (untuk konfirmasi & reminder) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0812-xxxx-xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#7A5644] font-medium mb-1">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@anda.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F2E4D6]">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#B05A26] hover:bg-[#964B1F] text-white font-semibold text-xs rounded-[2px] transition-colors cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? 'Mendaftarkan Tiket...' : 'Konfirmasi Pendaftaran (Gratis)'}
                  </button>
                  <p className="text-[11px] text-[#7A5644] text-center mt-2">
                    Setiap pendaftaran berlaku untuk 1 anak + 1 pendamping orang tua.
                  </p>
                </div>
              </form>
            ) : (
              /* Success confirmation state */
              <div className="text-center py-4">
                <div className="relative w-32 h-32 mx-auto mb-3">
                  <Image
                    src="/images/mascot/maskot-tiket.png"
                    alt="Tiket Berhasil"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="inline-flex items-center gap-1.5 bg-[#DDF1E5] text-[#2A6E37] text-xs font-semibold px-3 py-1 rounded-[2px] mb-2">
                  <Check className="w-3.5 h-3.5" />
                  <span>Pendaftaran Berhasil Diterima</span>
                </div>
                <h3 className="text-xl font-medium text-[#4A2A1C] mb-2">
                  Sampai Jumpa di Butik BabyShalls!
                </h3>
                <p className="text-xs text-[#7A5644] mb-6 max-w-sm mx-auto leading-relaxed">
                  Tiket QR telah tersimpan di akunmu dan tim kami akan mengirimkan pengingat lokasi via WhatsApp H-1 acara.
                </p>

                <div className="flex gap-3">
                  <Link
                    href="/account"
                    className="flex-1 py-2.5 bg-[#FFF6EA] border border-[#E6D2C0] text-[#B05A26] text-xs font-semibold rounded-[2px] text-center hover:bg-[#FFEEDB]"
                  >
                    Lihat Tiket Saya
                  </Link>
                  <button
                    onClick={() => setSelectedEventForModal(null)}
                    className="flex-1 py-2.5 bg-[#B05A26] text-white text-xs font-semibold rounded-[2px] text-center hover:bg-[#964B1F]"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
