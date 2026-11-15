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
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TombolKembali } from '@/components/common/TombolKembali';
import { CampaignBanner } from '@/components/home/CampaignBanner';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <TombolKembali fallbackUrl="/" label="Kembali ke Beranda" />

      {/* Hero Section */}
      <section className="bg-[#FFF6EA] py-12 sm:py-16 border-b border-[#F2E4D6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B05A26] block mb-2">
            TENTANG BABYSHALLS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#4A2A1C] tracking-tight mb-4">
            Menumbuhkan Cinta Membaca Sejak Halaman Pertama
          </h1>
          <p className="text-sm sm:text-base text-[#7A5644] max-w-2xl mx-auto leading-relaxed">
            BabyShalls adalah butik toko buku anak dan mainan edukatif di Malang. Didirikan dengan misi menghadirkan buku cerita bergambar berkualitas internasional dan mainan sensorik ramah anak yang dapat dinikmati bersama keluarga tercinta.
          </p>
        </div>
      </section>

      {/* Physical Store & Play Area Photo Gallery (From Figma Design System #48:205) */}
      <section className="py-12 sm:py-16 bg-[#FFFDF9]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] tracking-tight mb-2">
              Kunjungi Butik Fisik Kami di Citraland Malang
            </h2>
            <p className="text-xs sm:text-sm text-[#7A5644] max-w-lg mx-auto">
              Rasakan pengalaman membaca langsung bersama si kecil di ruang baca yang nyaman dan area bermain sensorik yang higienis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Tampak Depan */}
            <div className="bg-white border border-[#F2E4D6] rounded-[2px] overflow-hidden flex flex-col">
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
                <p className="text-xs text-[#7A5644]">
                  Fasad butik hangat di kawasan asri Citraland Blok HH-26, Kota Malang.
                </p>
              </div>
            </div>

            {/* Area Bermain */}
            <div className="bg-white border border-[#F2E4D6] rounded-[2px] overflow-hidden flex flex-col">
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
                  Area Bermain &amp; Karpet Baca
                </h3>
                <p className="text-xs text-[#7A5644]">
                  Sudut bermain anak yang dilengkapi mainan kayu montessori & karpet lembut.
                </p>
              </div>
            </div>

            {/* Rak Koleksi */}
            <div className="bg-white border border-[#F2E4D6] rounded-[2px] overflow-hidden flex flex-col">
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
                  Rak Koleksi Berdasarkan Usia
                </h3>
                <p className="text-xs text-[#7A5644]">
                  Ribuan judul buku dikelompokkan rapi dari usia newborn hingga 6+ tahun.
                </p>
              </div>
            </div>
          </div>

          {/* Nilai Utama BabyShalls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-[#F2E4D6] rounded-[2px] p-8 sm:p-10 mb-12">
            <div>
              <span className="w-10 h-10 rounded-full bg-[#FFF6EA] text-[#B05A26] flex items-center justify-center font-bold mb-3">
                1
              </span>
              <h3 className="font-semibold text-base text-[#4A2A1C] mb-1.5">
                Kurasi Ketat &amp; Berkelanjutan
              </h3>
              <p className="text-xs text-[#7A5644] leading-relaxed">
                Setiap buku dipilih langsung berdasarkan nilai literasi, ilustrasi yang mendidik, dan bahan cetak non-toksik yang aman bagi balita.
              </p>
            </div>

            <div>
              <span className="w-10 h-10 rounded-full bg-[#FFF6EA] text-[#B05A26] flex items-center justify-center font-bold mb-3">
                2
              </span>
              <h3 className="font-semibold text-base text-[#4A2A1C] mb-1.5">
                Komunitas &amp; Workshop Gratis
              </h3>
              <p className="text-xs text-[#7A5644] leading-relaxed">
                Kami rutin mengadakan sesi mendongeng dan kelas kreasi sensorik setiap akhir pekan tanpa memungut biaya dari keluarga di Malang.
              </p>
            </div>

            <div>
              <span className="w-10 h-10 rounded-full bg-[#FFF6EA] text-[#B05A26] flex items-center justify-center font-bold mb-3">
                3
              </span>
              <h3 className="font-semibold text-base text-[#4A2A1C] mb-1.5">
                Layanan Preloved &amp; Request Buku
              </h3>
              <p className="text-xs text-[#7A5644] leading-relaxed">
                Menyediakan buku preloved berkondisi istimewa yang higienis serta layanan pencarian buku impor langka langsung ke penerbit.
              </p>
            </div>
          </div>

          {/* Jam Operasional & Kontak */}
          <div className="bg-[#FFF6EA] border border-[#F2E4D6] rounded-[2px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <Store className="w-8 h-8 text-[#B05A26] shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-base text-[#4A2A1C] mb-1">
                  Butik BabyShalls Official
                </h4>
                <p className="text-xs text-[#7A5644] leading-relaxed">
                  Citraland Puncak Tidar Blok HH-26, Karangbesuki, Sukun, Kota Malang, Jawa Timur 65146
                </p>
                <p className="text-xs text-[#B05A26] font-medium mt-1">
                  Buka Setiap Hari: 09.00 – 19.00 WIB
                </p>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Citraland+Puncak+Tidar+Malang"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-[#B05A26] text-white text-xs font-semibold rounded-[2px] hover:bg-[#964B1F] transition-colors shrink-0"
            >
              Petunjuk Arah Google Maps →
            </a>
          </div>

        </div>
      </section>

      <CampaignBanner />
      <Footer />
    </div>
  );
}
