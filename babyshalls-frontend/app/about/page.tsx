'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  Sparkles,
  BookOpen,
  Heart,
  Store,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Smile,
  Compass,
} from 'lucide-react';
import { TombolKembali } from '@/components/common/TombolKembali';
import { CampaignBanner } from '@/components/home/CampaignBanner';
import { useCms } from '@/context/CmsContext';

export default function AboutPage() {
  const { cms } = useCms();
  const about = cms.about;
  const store = cms.store;

  const waNumber = store.whatsappNumber || process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890';
  const waGroupUrl = store.whatsappCommunityUrl || `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Halo BabyShalls, saya ingin bertanya tentang kunjungan butik dan katalog buku.'
  )}`;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <TombolKembali fallbackUrl="/" label="Kembali ke Beranda" />

      {/* Hero Section with Mascot & Story (Figma Pastel Terracotta & Cream) */}
      <section
        className="py-12 sm:py-16 border-b border-[#F2E4D6] relative overflow-hidden"
        style={{ backgroundColor: about.heroBgColor || '#FFF6EA' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">
            
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FBE6D8] border border-[#EFA27A]/40 text-xs font-bold uppercase tracking-wider text-[#B05A26] rounded-full mb-3">
                <Heart size={13} className="text-[#B05A26]" />
                <span>{about.badge || 'Cerita Di Balik BabyShalls'}</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#4A2A1C] tracking-tight mb-4 leading-tight">
                {about.title || 'Membuka Jendela Dunia untuk Si Kecil di Malang'}
              </h1>

              <p className="text-sm sm:text-base text-[#7A5644] leading-relaxed mb-6">
                {about.description ||
                  'BabyShalls bermula di tahun 2020 dari cinta seorang ibu di Malang yang ingin memberikan buku bergambar dan mainan edukasi terbaik. Berawal dari kurasi koleksi pribadi, kini berkembang menjadi butik ramah anak dengan karpet baca dan area bermain sensori di Citraland Puncak Tidar.'}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Link
                  href="/shop"
                  className="px-6 py-3 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs"
                >
                  Jelajahi Katalog Buku
                </Link>
                <a
                  href="#store-visit"
                  className="px-6 py-3 bg-white border border-[#E6D2C0] hover:border-[#B05A26] text-[#4A2A1C] text-xs font-semibold rounded-[2px] transition-colors"
                >
                  Kunjungi Butik Fisik &rarr;
                </a>
              </div>
            </div>

            {/* Mascot Illustration Hero */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 shrink-0">
              <Image
                src={about.heroImage || '/images/mascot/maskot-peluk-hati.png'}
                alt="Maskot BabyShalls Penuh Kasih"
                fill
                priority
                className="object-contain"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Nilai Utama BabyShalls (Figma Design System Pastel Cards) */}
      <section className="py-14 sm:py-18 bg-[#FFFDF9] border-b border-[#F2E4D6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-bold text-[#B05A26] uppercase tracking-wider block mb-1">
              KOMITMEN KAMI UNTUK KELUARGA
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] tracking-tight">
              Tiga Nilai yang Selalu Kami Rawat
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pilar 1: Kurasi Usia (Sunny Butter #FFF1C7) */}
            <div className="bg-[#FFFDF9] border border-[#F7C94B]/50 rounded-[4px] p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#FFF1C7] text-[#8A5A00] flex items-center justify-center mb-4">
                  <BookOpen size={22} />
                </div>
                <h3 className="font-semibold text-lg text-[#4A2A1C] mb-2">
                  {about.pillars?.[0]?.title || 'Kurasi Berdasarkan Usia & Tahapan'}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A5644] leading-relaxed">
                  {about.pillars?.[0]?.desc ||
                    'Setiap board book, picture book, dan mainan disortir cermat agar pas dengan stimulus sensorik serta minat perkembangan motorik anak dari 0 bulan hingga 6+ tahun.'}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#F2E4D6] text-[11px] font-semibold text-[#8A5A00]">
                Board book tebal &bull; Tidak mudah sobek &bull; Ujung tumpul aman
              </div>
            </div>

            {/* Pilar 2: Steril & Aman (Mint Sage #DDF1E5) */}
            <div className="bg-[#FFFDF9] border border-[#82BC85]/50 rounded-[4px] p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#DDF1E5] text-[#2A6E37] flex items-center justify-center mb-4">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-semibold text-lg text-[#4A2A1C] mb-2">
                  {about.pillars?.[1]?.title || 'Buku Bersih & Preloved Steril UV'}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A5644] leading-relaxed">
                  {about.pillars?.[1]?.desc ||
                    'Koleksi buku preloved melewati pembersihan mendalam dan sinar UV-C di butik kami, memastikan anak dapat membaca dan bermain dengan higienis tanpa rasa cemas.'}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#F2E4D6] text-[11px] font-semibold text-[#2A6E37]">
                Sterilisasi sinar UV-C &bull; Bebas kuman &amp; debu
              </div>
            </div>

            {/* Pilar 3: Komunitas & Workshop (Lilac Lavender #F3E6F2) */}
            <div className="bg-[#FFFDF9] border border-[#BA7EB8]/50 rounded-[4px] p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#F3E6F2] text-[#7E4A84] flex items-center justify-center mb-4">
                  <Sparkles size={22} />
                </div>
                <h3 className="font-semibold text-lg text-[#4A2A1C] mb-2">
                  {about.pillars?.[2]?.title || 'Ruang Bermain & Komunitas Hangat'}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A5644] leading-relaxed">
                  {about.pillars?.[2]?.desc ||
                    'Bukan sekadar toko, butik kami adalah tempat anak dan orang tua singgah: bermain sensory play gratis, membaca bersama di karpet dongeng, dan mengikuti workshop kreatif akhir pekan.'}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#F2E4D6] text-[11px] font-semibold text-[#7E4A84]">
                Area baca gratis &bull; Workshop anak di akhir pekan
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Physical Store & Play Area Photo Gallery */}
      <section id="gallery" className="py-14 sm:py-18 bg-white border-b border-[#F2E4D6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          
          <div className="text-center mb-10 max-w-xl mx-auto">
            <span className="text-[11px] font-bold text-[#3F5FA0] bg-[#E4ECFB] px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
              RUANG FISIK KAMI DI MALANG
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] tracking-tight mb-2">
              {about.galleryTitle || 'Suasana Butik & Sudut Karpet Baca'}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A5644]">
              {about.gallerySubtitle || 'Datang dan rasakan langsung kehangatan memilih buku bersama si kecil di Citraland Puncak Tidar.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Tampak Depan */}
            <div className="bg-white border border-[#E6D2C0] rounded-[4px] overflow-hidden flex flex-col shadow-2xs hover:border-[#B05A26] transition-colors">
              <div className="relative aspect-[4/3] w-full bg-[#F0F0F0]">
                <Image
                  src="/images/store/toko-tampak-depan.png"
                  alt="Tampak Depan Butik BabyShalls Citraland Malang"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-[#4A2A1C] mb-1">
                  Butik Citraland Puncak Tidar
                </h3>
                <p className="text-xs text-[#7A5644] leading-relaxed">
                  Fasad butik hangat di kawasan asri Citraland Blok HH-26, Kota Malang. Parkir luas dan nyaman untuk keluarga.
                </p>
              </div>
            </div>

            {/* Area Bermain */}
            <div className="bg-white border border-[#E6D2C0] rounded-[4px] overflow-hidden flex flex-col shadow-2xs hover:border-[#B05A26] transition-colors">
              <div className="relative aspect-[4/3] w-full bg-[#F0F0F0]">
                <Image
                  src="/images/store/toko-area-bermain.png"
                  alt="Area Bermain & Story Time"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-[#4A2A1C] mb-1">
                  Karpet Baca &amp; Sensory Corner
                </h3>
                <p className="text-xs text-[#7A5644] leading-relaxed">
                  Sudut bermain anak yang dilengkapi mainan kayu montessori, karpet higienis, dan sofa membaca ramah balita.
                </p>
              </div>
            </div>

            {/* Rak Koleksi */}
            <div className="bg-white border border-[#E6D2C0] rounded-[4px] overflow-hidden flex flex-col shadow-2xs hover:border-[#B05A26] transition-colors">
              <div className="relative aspect-[4/3] w-full bg-[#F0F0F0]">
                <Image
                  src="/images/store/toko-interior-rak.png"
                  alt="Rak Buku Impor & Lokal"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-[#4A2A1C] mb-1">
                  Rak Buku Berdasarkan Usia
                </h3>
                <p className="text-xs text-[#7A5644] leading-relaxed">
                  Ribuan judul buku dikelompokkan dengan rapi dari usia newborn, 1–3 tahun, hingga buku ensiklopedia anak sekolah.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Story Card with Mascot */}
          <div className="bg-gradient-to-r from-[#FFF6EA] via-[#FBE6D8]/50 to-[#E4ECFB]/40 border border-[#E6D2C0] rounded-[6px] p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-lg">
              <span className="text-[11px] font-bold text-[#B05A26] uppercase tracking-wider">
                PESAN DARI PENDIRI
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#4A2A1C] leading-snug">
                &ldquo;Membacakan buku 15 menit setiap hari adalah hadiah terbaik yang tak pernah usang untuk masa depan anak.&rdquo;
              </h3>
              <p className="text-xs text-[#7A5644] leading-relaxed">
                Kami siap membantu orang tua menemukan buku yang tepat untuk setiap momen tumbuh kembang: saat anak mulai berbicara, belajar empati, atau sedang antusias menjelajah alam semesta.
              </p>
              <div className="pt-2">
                <Link
                  href="/request-a-book"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B05A26] hover:underline"
                >
                  <span>Punya judul buku impian? Request buku kepada kurator kami &rarr;</span>
                </Link>
              </div>
            </div>

            <div className="relative w-40 h-40 sm:w-48 sm:h-48 shrink-0">
              <Image
                src="/images/mascot/maskot-balik-halaman.png"
                alt="Maskot Membaca Buku"
                fill
                className="object-contain"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Store Visit & Directions Card (Citraland Malang) */}
      <section id="store-visit" className="py-14 sm:py-16 bg-[#FFFDF9]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 sm:p-10 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2A6E37]"></span>
                <span className="text-xs font-bold text-[#2A6E37] uppercase tracking-wider">
                  TOKO FISIK BUKA SETIAP HARI
                </span>
              </div>

              <h3 className="text-2xl font-medium text-[#4A2A1C]">
                {store.storeName || "Butik BabyShalls Citraland Malang"}
              </h3>

              <div className="space-y-1.5 text-xs text-[#7A5644] leading-relaxed">
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="text-[#B05A26] shrink-0 mt-0.5" />
                  <span>{store.address}, {store.city}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-[#B05A26] shrink-0" />
                  <span>Jam Buka: {store.operatingHours || "Setiap hari 10.00 – 17.00 WIB"}</span>
                </p>
              </div>

              <p className="text-xs text-[#7A5644] pt-1">
                Tersedia opsi <strong>Ambil di Toko (Free Pickup)</strong> untuk pesanan online yang ingin langsung diambil di kasir.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <a
                href={store.googleMapsUrl || 'https://maps.google.com/?q=Citraland+Puncak+Tidar+Malang'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs text-center flex items-center justify-center gap-2"
              >
                <MapPin size={15} />
                <span>Petunjuk Arah Google Maps</span>
              </a>

              <a
                href={waGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-white border border-[#E6D2C0] hover:border-[#B05A26] text-[#4A2A1C] text-xs font-semibold rounded-[2px] transition-colors text-center flex items-center justify-center gap-2"
              >
                <Phone size={14} className="text-[#2A6E37]" />
                <span>Tanya Admin Butik</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      <CampaignBanner />
    </div>
  );
}
