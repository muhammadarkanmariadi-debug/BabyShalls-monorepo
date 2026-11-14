'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Sparkles,
  BookOpen,
  Heart,
  Store,
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react';
import { Header } from '../../src/components/Header';
import { Footer } from '../../src/components/Footer';
import { OrderDrawer } from '../../src/components/OrderDrawer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2C2725] flex flex-col justify-between selection:bg-[#E07A5F]/20 selection:text-[#E07A5F] w-full">
      <Header />

      <main className="flex-grow w-full py-8 sm:py-12 md:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          
          {/* Breadcrumb Navigation */}
          <nav className="text-xs text-[#68625D] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#E07A5F] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#2C2725] font-semibold">Tentang BabyShalls</span>
          </nav>

          {/* Hero Section of About */}
          <div className="max-w-4xl mx-auto text-center space-y-4 mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#E07A5F] block">
              Boutique Bookstore &amp; Sensory Space
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#2C2725] leading-tight">
              Menumbuhkan Cinta Membaca Sejak Halaman Pertama
            </h1>
            <p className="text-sm sm:text-base text-[#68625D] leading-relaxed max-w-2xl mx-auto">
              BabyShalls lahir di Citraland Puncak Tidar, Malang sebagai sanctuary hangat bagi keluarga kecil. Tempat di mana buku bantal, dongeng klasik dunia, dan mainan kayu alami bersatu menemani petualangan masa kecil yang penuh rasa ingin tahu.
            </p>
          </div>

          {/* Large Editorial Imagery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
            <div className="md:col-span-8 aspect-[16/10] rounded-lg overflow-hidden border border-[#EDE8E1] bg-neutral-100 shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=85"
                alt="Sudut baca hangat anak di butik BabyShalls Citraland Malang"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-4 aspect-[4/5] rounded-lg overflow-hidden border border-[#EDE8E1] bg-neutral-100 shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=85"
                alt="Koleksi buku bantal dan board books berkualitas"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 3 Core Philosophies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-[#EDE8E1] mb-16 text-left">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-[#FBE7E3] text-[#E07A5F] flex items-center justify-center">
                <BookOpen size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#2C2725]">1. Kurasi Cerita Bermakna</h3>
              <p className="text-xs sm:text-sm text-[#68625D] leading-relaxed">
                Setiap judul buku di BabyShalls dipilih melalui pertimbangan nilai moral, estetika ilustrasi, dan keamanan material (tepi tumpul, tinta non-toxic, kertas tebal tahan sobek).
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-[#E2ECE0] text-[#3A5C37] flex items-center justify-center">
                <Heart size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#2C2725]">2. Mainan Alami Montessori</h3>
              <p className="text-xs sm:text-sm text-[#68625D] leading-relaxed">
                Kami percaya pada mainan terbuka (open-ended toys) yang memicu imajinasi tanpa baterai atau layar gadget. Terbuat dari kayu alami bersertifikasi halus dan aman untuk tangan si kecil.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-[#FAF8F5] text-[#2C2725] border border-[#EDE8E1] flex items-center justify-center">
                <Store size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#2C2725]">3. Komunitas Hangat Keluarga</h3>
              <p className="text-xs sm:text-sm text-[#68625D] leading-relaxed">
                Bukan sekadar toko ritel, butik kami di Citraland Malang rutin mengadakan sesi dongeng gratis dan workshop sensory play akhir pekan untuk mempererat bonding orang tua dan anak.
              </p>
            </div>
          </div>

          {/* Physical Store Location Card */}
          <div className="bg-white border border-[#EDE8E1] rounded-lg p-6 sm:p-10 shadow-xs text-left max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE8E1]">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#E07A5F] block">
                  Kunjungi Butik Fisik Kami
                </span>
                <h2 className="text-2xl font-bold text-[#2C2725]">
                  BabyShalls Bookstore Citraland Malang
                </h2>
              </div>
              <span className="px-3 py-1 bg-[#E2ECE0] text-[#3A5C37] text-xs font-bold rounded-full self-start sm:self-auto">
                Buka Hari Ini
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#68625D]">
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#E07A5F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2C2725] block">Alamat Lengkap:</strong>
                    <span>Kompleks Ruko Citraland Puncak Tidar Blok HH-26, Kalisongo, Sukun, Kota Malang, Jawa Timur 65146</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock size={16} className="text-[#E07A5F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2C2725] block">Jam Operasional:</strong>
                    <span>Selasa – Minggu: 10.00 – 19.00 WIB</span>
                    <span className="block text-[#8C8782]">(Senin Tutup untuk Perawatan &amp; Disinfeksi Buku)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Phone size={16} className="text-[#E07A5F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2C2725] block">Kontak &amp; WhatsApp Butik:</strong>
                    <span>+62 812-3456-7890 (Customer Care)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail size={16} className="text-[#E07A5F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2C2725] block">Email Resmi:</strong>
                    <span>hello@babyshalls.id / babyshalls.malang@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3 border-t border-[#EDE8E1]">
              <Link
                href="/shop"
                className="px-6 py-3 bg-[#E07A5F] hover:bg-[#cc654b] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
              >
                Jelajahi Katalog Buku
              </Link>
              <Link
                href="/events"
                className="px-6 py-3 bg-[#FFFDF9] border border-[#EDE8E1] hover:border-[#E07A5F] text-[#2C2725] hover:text-[#E07A5F] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
              >
                Daftar Workshop Gratis
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <OrderDrawer />
    </div>
  );
}

