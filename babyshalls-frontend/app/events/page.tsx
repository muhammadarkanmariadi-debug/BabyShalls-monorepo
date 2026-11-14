'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Check, Users } from 'lucide-react';
import { Header } from '../../src/components/Header';
import { Footer } from '../../src/components/Footer';
import { OrderDrawer } from '../../src/components/OrderDrawer';
import { mockWorkshops } from '../../src/data/mockProducts';

export default function EventsRegistrationPage() {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>(mockWorkshops[0]?.id || '');
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [childrenCount, setChildrenCount] = useState('1');
  const [childrenAge, setChildrenAge] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedWorkshop = mockWorkshops.find((w) => w.id === selectedWorkshopId) || mockWorkshops[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const existing = JSON.parse(localStorage.getItem('babyshalls_event_registrations') || '[]');
      existing.unshift({
        id: `reg-${Date.now()}`,
        workshopId: selectedWorkshopId,
        workshopTitle: selectedWorkshop?.title,
        parentName,
        email,
        phone,
        childrenCount,
        childrenAge,
        notes,
        date: new Date().toISOString()
      });
      localStorage.setItem('babyshalls_event_registrations', JSON.stringify(existing));
    } catch {
      // fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2C2725] flex flex-col justify-between selection:bg-[#E07A5F]/20 selection:text-[#E07A5F] w-full">
      <Header />

      <main className="flex-grow py-12 md:py-20 border-b border-[#EDE8E1] w-full">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          
          {/* Breadcrumb Navigation */}
          <div className="max-w-4xl mx-auto mb-6 text-left">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#68625D] hover:text-[#E07A5F] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto space-y-10">
            
            {/* Header info */}
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#E07A5F]">
                Community &amp; Creativity
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#2C2725]">
                Workshops &amp; Story Sessions
              </h1>
              <p className="text-sm text-[#68625D] leading-relaxed">
                Sesi mendongeng dan kelas kreasi anak di butik buku BabyShalls Citraland Puncak Tidar, Malang. <strong>Seluruh sesi tidak dipungut biaya (Gratis).</strong>
              </p>
            </div>

            {/* Upcoming Workshops List Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockWorkshops.map((ws) => {
                const isSelected = selectedWorkshopId === ws.id;
                return (
                  <div
                    key={ws.id}
                    onClick={() => setSelectedWorkshopId(ws.id)}
                    className={`bg-white border rounded-lg p-5 transition-all cursor-pointer flex flex-col justify-between text-left ${
                      isSelected
                        ? 'border-[#E07A5F] ring-1 ring-[#E07A5F] shadow-xs'
                        : 'border-[#EDE8E1] hover:border-[#E07A5F]'
                    }`}
                  >
                    <div>
                      <div className="aspect-[16/9] w-full rounded-md bg-[#FDF6E2] overflow-hidden mb-4 border border-[#EDE8E1]/60">
                        <img src={ws.image} alt={ws.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-[#68625D]">{ws.date} • {ws.time}</span>
                        <span className="px-2 py-0.5 rounded bg-[#E2ECE0] text-[#3A5C37] text-[10px] font-bold uppercase tracking-wider">
                          Gratis
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#2C2725] leading-snug">
                        {ws.title}
                      </h3>

                      <p className="text-xs text-[#68625D] mt-1.5 line-clamp-2">
                        {ws.subtitle}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#EDE8E1] flex items-center justify-between text-xs">
                      <span className="text-[#68625D] flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#E07A5F]" />
                        <span>Citraland Puncak Tidar, Malang</span>
                      </span>

                      <span className={`font-semibold text-xs ${isSelected ? 'text-[#E07A5F]' : 'text-[#8C8782]'}`}>
                        {isSelected ? '✓ Terpilih' : 'Pilih Sesi'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Centered White Card Form */}
            <div className="bg-white border border-[#EDE8E1] rounded-lg shadow-xs p-8 sm:p-12 text-left">
              {isSubmitted ? (
                <div className="text-center py-6 space-y-6 animate-in fade-in duration-300">
                  <div className="w-14 h-14 bg-[#E2ECE0] text-[#3A5C37] rounded-full flex items-center justify-center mx-auto border border-[#C7DAC3]">
                    <Check size={28} strokeWidth={2.5} />
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-[#E07A5F] block mb-1">
                      Pendaftaran Terkonfirmasi
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-[#2C2725]">
                      E-Tiket Workshop BabyShalls
                    </h2>
                    <p className="text-xs text-[#68625D] mt-1">
                      Tunjukkan E-Tiket QR ini kepada tim kurator kami saat tiba di butik Citraland Malang.
                    </p>
                  </div>

                  {/* Official Visual E-Ticket Card */}
                  <div className="max-w-md mx-auto bg-[#FFFDF9] border-2 border-dashed border-[#EDE8E1] rounded-xl p-6 text-left relative overflow-hidden shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-[#EDE8E1]">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#E07A5F]">
                          Official Free Pass
                        </span>
                        <h4 className="text-sm font-bold text-[#2C2725]">{selectedWorkshop?.title}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#2C2725] bg-[#E2ECE0] px-2.5 py-1 rounded">
                        GRATIS
                      </span>
                    </div>

                    <div className="py-4 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[#68625D] block text-[11px]">Nama Peserta:</span>
                        <strong className="text-[#2C2725]">{parentName}</strong>
                      </div>
                      <div>
                        <span className="text-[#68625D] block text-[11px]">Jumlah Anak:</span>
                        <strong className="text-[#2C2725]">{childrenCount} Anak ({childrenAge})</strong>
                      </div>
                      <div>
                        <span className="text-[#68625D] block text-[11px]">Jadwal Acara:</span>
                        <strong className="text-[#2C2725]">{selectedWorkshop?.date}</strong>
                      </div>
                      <div>
                        <span className="text-[#68625D] block text-[11px]">Waktu:</span>
                        <strong className="text-[#2C2725]">{selectedWorkshop?.time}</strong>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-[#EDE8E1]">
                        <span className="text-[#68625D] block text-[11px]">Lokasi Butik:</span>
                        <strong className="text-[#2C2725]">Butik BabyShalls, Citraland Puncak Tidar Blok HH-26, Malang</strong>
                      </div>
                    </div>

                    {/* QR Code Graphic */}
                    <div className="pt-4 border-t border-[#EDE8E1] flex flex-col items-center justify-center space-y-2">
                      <div className="p-3 bg-white border border-[#EDE8E1] rounded-lg shadow-2xs">
                        {/* Clean SVG Mock QR Pattern */}
                        <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100" height="100" fill="white"/>
                          {/* Corner markers */}
                          <rect x="10" y="10" width="24" height="24" stroke="#2C2725" strokeWidth="4" fill="none"/>
                          <rect x="16" y="16" width="12" height="12" fill="#2C2725"/>
                          <rect x="66" y="10" width="24" height="24" stroke="#2C2725" strokeWidth="4" fill="none"/>
                          <rect x="72" y="16" width="12" height="12" fill="#2C2725"/>
                          <rect x="10" y="66" width="24" height="24" stroke="#2C2725" strokeWidth="4" fill="none"/>
                          <rect x="16" y="72" width="12" height="12" fill="#2C2725"/>
                          {/* Data dots */}
                          <rect x="42" y="14" width="6" height="6" fill="#2C2725"/>
                          <rect x="52" y="14" width="6" height="6" fill="#2C2725"/>
                          <rect x="42" y="24" width="6" height="6" fill="#2C2725"/>
                          <rect x="14" y="42" width="6" height="6" fill="#2C2725"/>
                          <rect x="24" y="42" width="6" height="6" fill="#2C2725"/>
                          <rect x="42" y="42" width="16" height="16" fill="#E07A5F"/>
                          <rect x="68" y="42" width="6" height="6" fill="#2C2725"/>
                          <rect x="78" y="42" width="6" height="6" fill="#2C2725"/>
                          <rect x="42" y="68" width="6" height="6" fill="#2C2725"/>
                          <rect x="52" y="68" width="6" height="6" fill="#2C2725"/>
                          <rect x="68" y="68" width="8" height="8" fill="#2C2725"/>
                          <rect x="80" y="76" width="8" height="8" fill="#2C2725"/>
                        </svg>
                      </div>
                      <span className="font-mono text-[11px] text-[#68625D]">
                        ID: TIKET-{Date.now().toString().slice(-6)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href="/account"
                      className="px-6 py-2.5 text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#cc654b] rounded-md transition-colors shadow-xs"
                    >
                      Buka Akun &amp; Tiket Saya
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-2.5 text-xs font-semibold text-[#2C2725] border border-[#EDE8E1] hover:border-[#E07A5F] rounded-md transition-colors"
                    >
                      Daftarkan Sesi Lain
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#E07A5F] font-semibold block">
                      Sesi Terpilih
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#2C2725] mt-1">
                      {selectedWorkshop?.title}
                    </h2>
                    <p className="text-xs text-[#68625D] mt-1">
                      {selectedWorkshop?.date} • {selectedWorkshop?.time} • <span className="font-semibold text-emerald-800">Gratis (Free Entry)</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2725] mb-1.5">
                        Nama Orang Tua / Wali *
                      </label>
                      <input
                        type="text"
                        required
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="e.g. Ibu Sarah"
                        className="w-full text-sm px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md text-[#2C2725] placeholder-[#8C8782] focus:outline-none focus:border-[#E07A5F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2725] mb-1.5">
                        Alamat Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah@example.com"
                        className="w-full text-sm px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md text-[#2C2725] placeholder-[#8C8782] focus:outline-none focus:border-[#E07A5F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2725] mb-1.5">
                        Nomor WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0812-3456-7890"
                        className="w-full text-sm px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md text-[#2C2725] placeholder-[#8C8782] focus:outline-none focus:border-[#E07A5F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2725] mb-1.5">
                        Usia Anak *
                      </label>
                      <input
                        type="text"
                        required
                        value={childrenAge}
                        onChange={(e) => setChildrenAge(e.target.value)}
                        placeholder="e.g. 3 tahun"
                        className="w-full text-sm px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md text-[#2C2725] placeholder-[#8C8782] focus:outline-none focus:border-[#E07A5F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2725] mb-1.5">
                      Catatan Tambahan (Opsional)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Sensitivitas sensori anak, alergi, atau pesan khusus..."
                      className="w-full text-sm px-3.5 py-2.5 bg-[#FFFDF9] border border-[#EDE8E1] rounded-md text-[#2C2725] placeholder-[#8C8782] focus:outline-none focus:border-[#E07A5F] resize-y"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#E07A5F] hover:bg-[#cc654b] text-white rounded-md text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {isSubmitting ? 'Memproses Reservasi...' : 'Daftar Sekarang (Gratis)'}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <OrderDrawer />
    </div>
  );
}
