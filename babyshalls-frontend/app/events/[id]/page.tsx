'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Check,
  ChevronDown,
  Sparkles,
  Gift,
  CheckCircle2,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TombolKembali } from '@/components/common/TombolKembali';
import { getEventById } from '@/data/eventsData';

export default function EventDetailPage() {
  const params = useParams();
  const rawId = typeof params?.id === 'string' ? params.id : 'nature-craft';

  const [childrenCount, setChildrenCount] = useState(1);
  const [copiedShare, setCopiedShare] = useState(false);

  // Dynamic Event Data from single source of truth
  const eventData = getEventById(rawId);

  const isFree = eventData.isFree || eventData.price === 0;
  const totalPrice = childrenCount * eventData.price;
  const quotaPercent = Math.min(
    100,
    Math.round((eventData.quotaFilled / eventData.quotaTotal) * 100)
  );

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <TombolKembali fallbackUrl="/events" label="Kembali ke Daftar Event" />

      <main className="flex-1">
        {/* Hero Section (Figma Frame #169:5198) */}
        <section className="pt-2 pb-6">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            {/* Breadcrumb (Figma #169:5199) */}
            <div className="text-[13px] text-[#7A5644] mb-4">
              <Link href="/events" className="hover:text-[#B05A26] transition-colors">
                Event
              </Link>
              <span className="mx-2">/</span>
              <span className="text-[#4A2A1C] font-medium">{eventData.title}</span>
            </div>

            {/* Banner Image 16:9 (Figma #169:5460) */}
            <div className="relative w-full h-[260px] sm:h-[340px] md:h-[400px] bg-[#F2E4D6] rounded-[2px] overflow-hidden">
              <Image
                src={eventData.image}
                alt={eventData.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          </div>
        </section>

        {/* Content Section (Figma Frame #169:5202) */}
        <section className="pb-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <div className="flex flex-col lg:flex-row items-start gap-12">
              
              {/* Kolom Info Kiri (Figma Frame #169:5203) */}
              <div className="flex-1 w-full space-y-7">
                
                {/* Badges (Figma Frame #169:5204) */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#F3E6F2] text-[#7E4A84] text-[13px] font-medium px-2.5 py-1 rounded-[2px]">
                    {eventData.category}
                  </span>
                  <span className="bg-[#DDF1E5] text-[#2A6E37] text-[13px] font-medium px-2.5 py-1 rounded-[2px]">
                    {eventData.age}
                  </span>
                  {isFree ? (
                    <span className="bg-[#2A6E37] text-white text-[13px] font-semibold px-2.5 py-1 rounded-[2px] shadow-xs">
                      GRATIS (Tanpa Biaya)
                    </span>
                  ) : (
                    <span className="bg-[#B05A26] text-white text-[13px] font-semibold px-2.5 py-1 rounded-[2px] shadow-xs">
                      Workshop Berbayar ({eventData.priceLabel})
                    </span>
                  )}
                </div>

                {/* H1 Title (Figma #169:5209) */}
                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-medium text-[#4A2A1C] leading-[1.25] tracking-tight">
                  {eventData.title}
                </h1>

                {/* Info Card (Figma Frame #169:5210) */}
                <div className="bg-[#FFFDF9] border border-[#E6D2C0] rounded-[2px] p-6 space-y-3.5">
                  <div className="flex items-center gap-2.5 text-base text-[#7A5644]">
                    <Calendar className="w-5 h-5 text-[#B05A26] shrink-0" />
                    <span>{eventData.date}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-base text-[#7A5644]">
                    <Clock className="w-5 h-5 text-[#B05A26] shrink-0" />
                    <span>{eventData.time}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-base text-[#7A5644]">
                    <MapPin className="w-5 h-5 text-[#B05A26] shrink-0 mt-0.5" />
                    <span>{eventData.location}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-base text-[#7A5644]">
                    <Users className="w-5 h-5 text-[#B05A26] shrink-0" />
                    <span>{eventData.companion}</span>
                  </div>
                </div>

                {/* Tentang Kegiatan (Figma Frame #169:5223) */}
                <div className="space-y-3">
                  <h2 className="text-2xl font-medium text-[#4A2A1C]">
                    Tentang kegiatan
                  </h2>
                  <p className="text-base text-[#7A5644] leading-relaxed">
                    {eventData.description}
                  </p>
                </div>

                {/* Agenda Kegiatan (Figma Frame #169:5226) */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-medium text-[#4A2A1C]">
                    Agenda
                  </h2>
                  <div className="space-y-3">
                    {eventData.agenda.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-base">
                        <span className="font-medium text-[#B05A26] min-w-[55px]">
                          {item.time}
                        </span>
                        <span className="text-[#7A5644]">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fasilitas & Manfaat Belajar */}
                {eventData.facilities && eventData.facilities.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-2xl font-medium text-[#4A2A1C]">
                      Fasilitas Peserta
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {eventData.facilities.map((fac, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-3 bg-[#FFFDF9] border border-[#E6D2C0] rounded-[2px] text-xs text-[#7A5644]"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#2A6E37] shrink-0 mt-0.5" />
                          <span>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Yang perlu dibawa (Figma Frame #169:5240) */}
                <div className="bg-[#FFF1C7] rounded-[2px] p-5 space-y-2 border border-[#FBE6A2]">
                  <h3 className="text-base font-medium text-[#4A2A1C]">
                    Yang perlu dibawa
                  </h3>
                  <p className="text-sm text-[#7A5644]">
                    {eventData.itemsToBring.map((item) => `• ${item}`).join('   ')}
                  </p>
                </div>

                {/* Lokasi Peta Embed (Figma Frame #169:5243) */}
                <div className="space-y-3">
                  <h2 className="text-2xl font-medium text-[#4A2A1C]">
                    Lokasi Butik
                  </h2>
                  <div className="w-full h-[220px] rounded-[2px] overflow-hidden border border-[#E6D2C0]">
                    <iframe
                      title="Lokasi BabyShalls Malang"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.272714207119!2d112.58335017476834!3d-7.970747492054238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e788265005b76db%3A0x67980590807661ee!2sCitraland%20Puncak%20Tidar%20Malang!5e0!3m2!1sid!2sid!4v1714400000000!5m2!1sid!2sid"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>

              </div>

              {/* Kartu Daftar Sticky Kanan (Figma Frame #169:5247) */}
              <div className="w-full lg:w-[384px] shrink-0 lg:sticky lg:top-24">
                <div className="bg-white border border-[#E6D2C0] rounded-[2px] p-7 shadow-[0px_2px_8px_rgba(74,42,28,0.06),0px_8px_24px_rgba(74,42,28,0.06)] space-y-4">
                  
                  {/* Harga (Figma Frame #169:5248) - Free vs Paid Support */}
                  <div className="flex items-baseline gap-2 pb-2">
                    {isFree ? (
                      <>
                        <span className="text-[32px] font-bold text-[#2A6E37] leading-none">
                          GRATIS
                        </span>
                        <span className="text-sm text-[#7A5644]">
                          (Tanpa Biaya / anak)
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[32px] font-medium text-[#4A2A1C] leading-none">
                          {eventData.priceLabel}
                        </span>
                        <span className="text-base text-[#7A5644]">
                          / anak
                        </span>
                      </>
                    )}
                  </div>

                  {/* Kuota (Figma Frame #169:5251) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-medium text-[#4A2A1C]">Kuota Peserta</span>
                      <span className="text-[#7A5644]">
                        {eventData.quotaFilled} / {eventData.quotaTotal} terisi
                      </span>
                    </div>
                    {/* Progress Bar (Figma #169:5255 & #169:5256) */}
                    <div className="w-full h-2 bg-[#F2E4D6] rounded-[2px] overflow-hidden">
                      <div
                        className={`h-full rounded-[2px] transition-all duration-300 ${
                          eventData.status === 'Penuh'
                            ? 'bg-gray-400'
                            : isFree
                            ? 'bg-[#2A6E37]'
                            : 'bg-[#8A5A00]'
                        }`}
                        style={{ width: `${quotaPercent}%` }}
                      />
                    </div>
                    {eventData.seatsLeft > 0 && eventData.seatsLeft <= 5 && (
                      <span className="text-[11px] font-medium text-red-600 block">
                        Tersisa hanya {eventData.seatsLeft} kursi lagi!
                      </span>
                    )}
                  </div>

                  {/* Input / Jumlah anak (Figma Frame #169:5257) */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[13px] font-medium text-[#4A2A1C]">
                      Jumlah anak yang didaftarkan
                    </label>
                    <div className="relative">
                      <select
                        value={childrenCount}
                        onChange={(e) => setChildrenCount(Number(e.target.value))}
                        disabled={eventData.status === 'Penuh'}
                        className="w-full appearance-none px-4 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-base text-[#4A2A1C] focus:outline-hidden focus:border-[#B05A26] cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value={1}>1 anak</option>
                        <option value={2}>2 anak</option>
                        <option value={3}>3 anak</option>
                        <option value={4}>4 anak</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#7A5644] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Total (Figma Frame #169:5262) */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#F2E4D6]">
                    <span className="text-base text-[#7A5644]">Total Biaya</span>
                    <span className="text-lg font-bold text-[#4A2A1C]">
                      {isFree ? (
                        <span className="text-[#2A6E37]">GRATIS (Rp0)</span>
                      ) : (
                        `Rp${totalPrice.toLocaleString('id-ID')}`
                      )}
                    </span>
                  </div>

                  {/* Tombol / Daftar Sekarang (Figma Frame #169:5265) */}
                  {eventData.status === 'Penuh' ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3.5 bg-gray-200 text-gray-500 font-medium text-base rounded-[2px] text-center cursor-not-allowed"
                    >
                      Kuota Penuh
                    </button>
                  ) : (
                    <Link
                      href={`/events/${eventData.id}/register`}
                      className="w-full py-3.5 bg-[#B05A26] hover:bg-[#8E431A] text-white font-medium text-base rounded-[2px] text-center transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      {isFree ? 'Daftar Workshop Gratis' : 'Daftar Sekarang'}
                    </Link>
                  )}

                  {/* Caption (Figma #169:5267) */}
                  <p className="text-[13px] text-[#7A5644] leading-relaxed">
                    Tiket QR dikirim ke email &amp; bisa dibuka di menu Akun → Tiket Event.
                  </p>

                  {/* Tombol / Bagikan Event (Figma Frame #169:5268) */}
                  <div className="pt-2 border-t border-[#F2E4D6]">
                    <button
                      type="button"
                      onClick={handleShare}
                      className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-[#B05A26] hover:text-[#8E431A] transition-colors cursor-pointer"
                    >
                      {copiedShare ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Link Berhasil Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span>Bagikan Event</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
