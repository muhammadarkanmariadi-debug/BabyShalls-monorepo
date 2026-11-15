'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, Check, Sparkles, Clock, Share2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TombolKembali } from '@/components/common/TombolKembali';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = typeof params?.id === 'string' ? params.id : '';

  // Form states
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('4');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock Event Data
  const eventData = {
    id: eventId || 'nature-craft',
    title: 'Little Explorers: Nature Craft & Sensory Play',
    category: 'Workshop',
    date: 'Sabtu, 28 November 2026',
    time: '09.30 – 11.30 WIB',
    location: 'BabyShalls Citraland Puncak Tidar Blok HH-26, Kota Malang',
    age: '3–7 tahun',
    price: 'GRATIS',
    status: 'Sisa Sedikit',
    seatsLeft: 3,
    totalSeats: 15,
    facilitator: 'Kak Nisa (Penggiat Montessori & Dongeng Anak)',
    image: '/images/events/event-workshop-alam.png',
    description:
      'Aktivitas luar ruang dan kreasi seni sensorik yang dirancang khusus untuk merangsang rasa ingin tahu si kecil. Anak-anak akan diajak mengeksplorasi dedaunan, ranting kering, bunga pinus, dan tanah liat organik menjadi karya seni kolase yang bisa dibawa pulang.',
    learnings: [
      'Melatih koordinasi motorik halus dan kekuatan jari jemari melalui cetakan clay alami',
      'Mengenalkan tekstur, aroma, dan warna dari dedaunan flora lokal Malang',
      'Membangun keberanian berkreasi dan percaya diri mengekspresikan ide',
      'Mempererat ikatan (bonding) interaktif antara orang tua dan anak',
    ],
    facilities: [
      'Seluruh bahan workshop (tanah liat alami, kanvas kayu, lem aman anak)',
      'Snack sehat & minuman jus buah segar untuk anak dan orang tua',
      'Sertifikat partisipasi Little Explorer BabyShalls',
      'Voucher belanja buku anak sebesar Rp 25.000',
    ],
    terms: [
      'Wajib didampingi oleh 1 orang tua atau wali dewasa selama sesi berlangsung',
      'Membawa pakaian ganti dan botol minum (tumbler) pribadi',
      'Hadir 15 menit sebelum acara dimulai untuk registrasi ulang tiket QR',
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ticketId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRegistration = {
      ticketId,
      eventId: eventData.id,
      eventTitle: eventData.title,
      eventDate: eventData.date,
      eventTime: eventData.time,
      location: eventData.location,
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
      <TombolKembali fallbackUrl="/events" label="Kembali ke Daftar Event" />

      {/* Hero Event Banner (Figma Node #169:5198) */}
      <section className="pt-6 pb-4 max-w-[1200px] w-full mx-auto px-4 sm:px-8">
        {/* Breadcrumb */}
        <div className="text-[13px] text-[#7A5644] mb-4">
          <Link href="/" className="hover:underline">Beranda</Link>
          <span className="mx-2">/</span>
          <Link href="/events" className="hover:underline">Event & Workshop</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-[#4A2A1C]">{eventData.title}</span>
        </div>

        {/* 16:9 Wide Photo */}
        <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full rounded-[2px] overflow-hidden bg-[#F0F0F0] mb-8">
          <Image
            src={eventData.image}
            alt={eventData.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      </section>

      {/* Main Content (Figma Node #169:5202, 2 Columns) */}
      <section className="pb-16 max-w-[1200px] w-full mx-auto px-4 sm:px-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Column: Event Information (Figma #169:5203) */}
          <div className="flex-1 w-full flex flex-col">
            
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="bg-[#FFF6EA] text-[#B05A26] border border-[#E6D2C0] text-xs font-semibold px-2.5 py-1 rounded-[2px]">
                {eventData.category}
              </span>
              <span className="bg-[#2A6E37] text-white text-xs font-bold px-2.5 py-1 rounded-[2px]">
                {eventData.price}
              </span>
              <span className="bg-[#DDF1E5] text-[#2A6E37] text-xs font-medium px-2.5 py-1 rounded-[2px]">
                Usia {eventData.age}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] leading-tight mb-4 tracking-tight">
              {eventData.title}
            </h1>

            {/* Schedule & Location Box */}
            <div className="bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] p-5 mb-8 flex flex-col gap-3.5 text-xs text-[#4A2A1C]">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#B05A26] shrink-0" />
                <span><strong>Waktu:</strong> {eventData.date} · {eventData.time}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#B05A26] shrink-0 mt-0.5" />
                <span><strong>Lokasi:</strong> {eventData.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[#B05A26] shrink-0" />
                <span><strong>Fasilitator:</strong> {eventData.facilitator}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 text-sm text-[#7A5644] leading-relaxed mb-8">
              <h2 className="text-lg font-semibold text-[#4A2A1C]">
                Tentang Kegiatan Ini
              </h2>
              <p>{eventData.description}</p>
            </div>

            {/* What they will learn */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-[#4A2A1C] mb-3">
                Manfaat & Kegiatan Belajar:
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#7A5644]">
                {eventData.learnings.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#2A6E37] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Facilities Included */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-[#4A2A1C] mb-3">
                Fasilitas Peserta (Termasuk):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#7A5644]">
                {eventData.facilities.map((fac, idx) => (
                  <div key={idx} className="bg-[#FFF6EA] p-3 rounded-[2px] border border-[#E6D2C0] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#B05A26] shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="border-t border-[#F2E4D6] pt-6">
              <h3 className="text-sm font-semibold text-[#4A2A1C] mb-2">
                Ketentuan Peserta:
              </h3>
              <ul className="list-disc list-inside text-xs text-[#7A5644] space-y-1">
                {eventData.terms.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Column: Sticky Registration Card (Figma #169:5247, 384px width) */}
          <aside className="w-full lg:w-[384px] shrink-0 sticky top-24">
            <div className="bg-white border border-[#F2E4D6] rounded-[2px] p-6 sm:p-7 shadow-sm">
              
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  
                  {/* Status & Quota */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#F2E4D6]">
                    <div>
                      <span className="text-xs text-[#7A5644] block">Biaya Registrasi</span>
                      <span className="text-2xl font-bold text-[#2A6E37]">GRATIS</span>
                    </div>
                    <span className="bg-[#FEECE8] text-[#C0392B] text-xs font-semibold px-2.5 py-1 rounded-[2px]">
                      Sisa {eventData.seatsLeft} kursi
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#4A2A1C]">
                    Daftar Sekarang untuk Anak & Orang Tua
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[#7A5644] font-medium mb-1">
                        Nama Lengkap Orang Tua *
                      </label>
                      <input
                        type="text"
                        required
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="Contoh: Rina Wahyuni"
                        className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[#7A5644] font-medium mb-1">
                          Nama Anak *
                        </label>
                        <input
                          type="text"
                          required
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          placeholder="Nama panggilan"
                          className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#7A5644] font-medium mb-1">
                          Usia Anak *
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
                        Nomor WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0812-xxxx-xxxx"
                        className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#7A5644] font-medium mb-1">
                        Email (opsional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@anda.com"
                        className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3.5 bg-[#B05A26] hover:bg-[#964B1F] text-white font-semibold text-xs rounded-[2px] transition-colors cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? 'Mendaftarkan...' : 'Kirim Pendaftaran (Gratis)'}
                  </button>

                  <p className="text-[11px] text-[#7A5644] text-center leading-relaxed">
                    Tiket QR akan langsung dibuat dan dapat dilihat di menu <strong>Tiket Event</strong> pada profil akunmu.
                  </p>
                </form>
              ) : (
                /* Registered State */
                <div className="text-center py-4 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#DDF1E5] text-[#2A6E37] flex items-center justify-center mb-3">
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#4A2A1C] mb-1">
                    Pendaftaran Berhasil!
                  </h3>
                  <p className="text-xs text-[#7A5644] mb-6">
                    Kursi untuk <strong>{childName} & {parentName}</strong> telah terkonfirmasi untuk acara {eventData.date}.
                  </p>
                  <Link
                    href="/account"
                    className="w-full py-2.5 bg-[#B05A26] text-white text-xs font-semibold rounded-[2px] hover:bg-[#964B1F] transition-colors"
                  >
                    Buka Tiket QR di Profil
                  </Link>
                </div>
              )}

            </div>
          </aside>

        </div>
      </section>

      <Footer />
    </div>
  );
}

