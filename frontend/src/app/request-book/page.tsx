'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, MessageSquare, BookOpen, Clock } from 'lucide-react';

export default function RequestBookPage() {
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="py-10 lg:py-16 bg-[#FFF8EF]">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4D0] text-[#DA7A5B] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Layanan Jastip & Titip Buku Impor</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#502E1E]">
            Request a Book (Permintaan Buku)
          </h1>
          <p className="text-sm text-[#6B3F2A]/80 mt-2">
            Mencari board book, buku cerita berbahasa Inggris, atau ensiklopedia anak yang belum ada di katalog kami? Beritahu tim BabyShalls!
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#FFF9F0] border-2 border-[#EEDBC9] rounded-[28px] p-6 sm:p-10 shadow-card">
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#502E1E] mb-1">
                    Judul Buku yang Dicari *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="Contoh: The Very Hungry Caterpillar"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#502E1E] mb-1">
                    Nama Penulis / Penerbit (Opsional)
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Contoh: Eric Carle / Usborne / DK"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#502E1E] mb-1">
                    Nama Anda *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Bunda Rina"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#502E1E] mb-1">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#502E1E] mb-1">
                  Catatan Tambahan / Format Khusus
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Lebih prefer versi board book tebal, atau cover edisi terbaru..."
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EEDBC9] rounded-xl text-[#6B3F2A] focus:outline-none focus:border-[#DA7A5B]"
                />
              </div>

              {/* Service Info Perks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#FCF6EC] rounded-2xl border border-[#EEDBC9] text-xs text-[#6B3F2A]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#DA7A5B] flex-shrink-0" />
                  <span>Respon info estimasi harga dalam 1x24 jam</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#709154] flex-shrink-0" />
                  <span>Buku 100% Original dari penerbit resmi</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#F6C95E] flex-shrink-0" />
                  <span>Konsultasi gratis tanpa kewajiban beli</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-sm shadow-subtle hover:shadow-card transition-all"
              >
                Kirim Permintaan Buku
              </button>
            </form>
          ) : (
            <div className="text-center py-10 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#EBF2E0] text-[#709154] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#502E1E]">
                Permintaan Berhasil Diterima!
              </h2>
              <p className="text-sm text-[#6B3F2A] max-w-md mx-auto leading-relaxed">
                Terima kasih Bunda/Kak <strong>{customerName}</strong>. Tim kurator BabyShalls sedang mencari ketersediaan buku &ldquo;<strong>{bookTitle}</strong>&rdquo;. Kami akan mengabari info harga dan estimasi kedatangan via WhatsApp ke <strong>{phone}</strong>.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2.5 rounded-full bg-[#DA7A5B] text-white font-bold text-xs"
              >
                Kirim Judul Lain
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

