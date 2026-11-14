'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'Dari mana pesanan buku dan mainan BabyShalls dikirim?',
    a: 'Seluruh pesanan dikemas dan dikirim langsung dari butik kami di Jl. Cempaka No. 12, Kota Malang menggunakan kurir terintegrasi KiriminAja (JNE, J&T, SiCepat, Pos Indonesia).',
  },
  {
    q: 'Apakah layanan bungkus kado (Free Gift Wrapping) benar-benar gratis?',
    a: 'Ya, 100% gratis! Anda dapat mencentang opsi Free Gift Wrapping saat checkout dan menuliskan pesan untuk kartu ucapan tanpa biaya tambahan.',
  },
  {
    q: 'Apakah mainan kayu BabyShalls aman jika digigit balita?',
    a: 'Aman. Mainan kayu kami menggunakan kayu solid halus bebas serpihan dan cat water-based non-toxic bersertifikasi SNI dan EN71.',
  },
  {
    q: 'Bagaimana proses sanitasi buku dan mainan Preloved Kurasi?',
    a: 'Setiap barang preloved melalui kurasi fisik ketat, dibersihkan dengan cairan food-grade, dan disterilkan menggunakan sinar UV-C sebelum dikemas.',
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [query, setQuery] = useState('');

  const filtered = FAQS.filter(
    (item) =>
      item.q.toLowerCase().includes(query.toLowerCase()) ||
      item.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
            Tanya Jawab (FAQ)
          </h1>
          <p className="text-sm text-[#6B7280]">
            Informasi seputar pengiriman dari Malang, gift wrapping, dan keamanan mainan anak.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari pertanyaan..."
            className="w-full h-[46px] pl-11 pr-4 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.q}
                className="border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full min-h-[56px] px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#1A1A1A] hover:bg-[#F8FAFC]"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-[#4A4A4A] leading-relaxed border-t border-[#F3F4F6] pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-6 rounded-2xl bg-[#E9F3E4] border border-[#D4E6CA] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-extrabold text-[#1A1A1A]">Masih ada pertanyaan lain?</h2>
            <p className="text-xs text-[#4A4A4A]">Tim CS BabyShalls Malang siap membantu via WhatsApp.</p>
          </div>
          <Link
            href="https://wa.me/6281234567890"
            target="_blank"
            className="min-h-[44px] inline-flex items-center px-6 rounded-full bg-[#25D366] text-white text-xs font-bold"
          >
            Chat WhatsApp CS
          </Link>
        </div>
      </div>
    </div>
  );
}
