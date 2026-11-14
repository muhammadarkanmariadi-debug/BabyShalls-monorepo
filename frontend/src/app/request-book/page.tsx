'use client';

import React from 'react';
import { RequestBookForm } from '../../components/request-book/RequestBookForm';

export default function RequestBookPage() {
  return (
    <div className="py-12 lg:py-16 bg-white min-h-screen">
      <div className="max-w-xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
            Request a Book
          </h1>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            Mencari buku anak tertentu yang belum tersedia di katalog? Kirim judul atau ISBN di bawah ini dan tim kami akan menghubungi Anda maksimal 1x24 jam.
          </p>
        </div>

        <RequestBookForm />
      </div>
    </div>
  );
}
