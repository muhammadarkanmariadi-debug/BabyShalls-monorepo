'use client';

import React from 'react';
import { Heart, MapPin, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const StoreAtmosphere: React.FC = () => {
  const { setIsStoreInfoOpen } = useCart();

  const reviews = [
    {
      name: 'dr. Amanda & Keenan (3 th)',
      residence: 'Citraland Puncak Tidar, Malang',
      comment:
        'Ruang bacanya sangat tenang dan sejuk. Keenan betah sekali memilih buku cerita bergambar sendiri di sudut baca anak sambil ditemani sofa empuk.',
      rating: 5,
      date: 'Oktober 2026'
    },
    {
      name: 'Bunda Sarah & Arka',
      residence: 'Ijen Nirwana, Malang',
      comment:
        'Hampers ulang tahunnya rapi sekali! Kartu ucapan ditulis tangan dengan kaligrafi yang cantik dan box kayu pinusnya masih kami simpan untuk mainan.',
      rating: 5,
      date: 'November 2026'
    },
    {
      name: 'Kak Dimas & Rania',
      residence: 'Lembah Dieng, Malang',
      comment:
        'Pilihan mainan kayunya safe, non-toxic, dan berkonsep Montessori. Senang sekali akhirnya ada boutique children bookstore sehangat ini di Malang.',
      rating: 5,
      date: 'September 2026'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FAF6F0] border-t border-[#EDE4D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Atmosphere Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D96B43]/15 text-[#D96B43] text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Suasana Toko &amp; Komunitas</span>
          </div>

          <h2 className="text-3xl sm:text-4xl text-[#382E2B] font-semibold tracking-tight">
            Sudut Hangat Membaca di Citraland Malang
          </h2>

          <p className="text-xs sm:text-sm text-[#6B5E57] leading-relaxed">
            Lebih dari sekadar toko buku — Babyshalls hadir sebagai ruang singgah yang teduh dan ramah bagi anak-anak untuk menyentuh, membuka, dan jatuh cinta pada buku.
          </p>
        </div>

        {/* Visual Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          <div className="group relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xs border border-[#E5DDD0]">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
              alt="Rak buku kayu di toko Babyshalls Malang"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#382E2B]/70 via-transparent to-transparent flex items-end p-5">
              <span className="text-[#FFFDF9] text-xs font-medium">Rak Kayu Beechwood &amp; Display Buku Ramah Anak</span>
            </div>
          </div>

          <div className="group relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xs border border-[#E5DDD0]">
            <img
              src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80"
              alt="Sudut mendongeng anak"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#382E2B]/70 via-transparent to-transparent flex items-end p-5">
              <span className="text-[#FFFDF9] text-xs font-medium">Sofa Lembut untuk Membaca Bersama Si Kecil</span>
            </div>
          </div>

          <div className="group relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xs border border-[#E5DDD0]">
            <img
              src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80"
              alt="Meja kemasan kado hampers"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#382E2B]/70 via-transparent to-transparent flex items-end p-5">
              <span className="text-[#FFFDF9] text-xs font-medium">Meja Kemasan Kado &amp; Penulisan Kartu Ucapan</span>
            </div>
          </div>
        </div>

        {/* Parent Reviews Row */}
        <div className="border-t border-[#EDE4D8] pt-12">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7CA992]">
              Cerita Keluarga di Malang
            </span>
            <h3 className="text-2xl text-[#382E2B] font-semibold mt-1">
              Kata Orang Tua tentang Babyshalls
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EBE3D7] cozy-card-shadow flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#D96B43] mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs text-[#6B5E57] leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0E8DC] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-[#382E2B]">{rev.name}</div>
                    <div className="text-[11px] text-[#7CA992]">{rev.residence}</div>
                  </div>
                  <span className="text-[10px] text-[#9A8F85]">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Visit CTA Pill */}
          <div className="mt-10 text-center">
            <button
              onClick={() => setIsStoreInfoOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#382E2B] hover:bg-[#251E1C] text-[#FFFDF9] text-xs font-medium shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#D96B43]" />
              <span>Kunjungi Kami di Citraland Puncak Tidar HH-26, Malang</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
