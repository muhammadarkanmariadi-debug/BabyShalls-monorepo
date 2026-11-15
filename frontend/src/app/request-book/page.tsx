'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RequestBookForm } from '../../components/request-book/RequestBookForm';

const HOW_IT_WORKS_STEPS = [
  'Tulis judul buku, penulis, atau sertakan foto cover buku yang dicari.',
  'Tim BabyShalls mengecek stok distributor dan menghitung estimasi harga (maks 1x24 jam).',
  'Kami mengirimkan penawaran lewat WhatsApp. Jika cocok, buku langsung dipesan untukmu.',
];

export default function RequestBookPage() {
  return (
    <div className="py-10 lg:py-14 bg-[#FFF8EF] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Short Description & How It Works */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#D9744A]">
                LAYANAN KURASI KHUSUS
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight font-serif">
                Cari buku impor tertentu? Kami bantu carikan.
              </h1>
              <p className="text-sm text-[#4A4A4A] leading-relaxed">
                Kirim judul atau foto buku yang kamu impikan untuk si kecil. Tim BabyShalls akan
                memeriksa distributor lokal maupun penerbit luar negeri dan mengabari harga lewat
                WhatsApp.
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#F3E5D0] bg-[#FAF0E1]">
              <img
                src="/images/prod-storybook.jpg"
                alt="Layanan Request Buku Anak BabyShalls"
                className="w-full h-44 object-cover"
              />
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3.5">
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-[#1A1A1A]">
                CARA KERJA REQUEST BUKU:
              </h2>
              <ol className="space-y-3">
                {HOW_IT_WORKS_STEPS.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-[#4A4A4A] leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-[#FAF0E1] text-[#D9744A] font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right Column: Request Book Form */}
          <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs">
            <RequestBookForm />
          </div>
        </div>
      </div>
    </div>
  );
}
