'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  QrCode,
  Smartphone,
} from 'lucide-react';
import { EVENTS } from '../../../data/events';
import { formatIDR } from '../../../lib/utils';

function EventRegisterContent() {
  const searchParams = useSearchParams();
  const eventParam = searchParams.get('eventId');

  const [selectedEventId, setSelectedEventId] = useState<string>(
    eventParam || EVENTS[0]?.slug || ''
  );

  useEffect(() => {
    if (eventParam) {
      setSelectedEventId(eventParam);
    }
  }, [eventParam]);

  const activeEvent =
    EVENTS.find((e) => e.slug === selectedEventId || e.id === selectedEventId) ||
    EVENTS[0];

  // Form states
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [relationship, setRelationship] = useState('Bunda');

  const [childName, setChildName] = useState('');
  const [childNickname, setChildNickname] = useState('');
  const [childAge, setChildAge] = useState('');
  const [allergiesOrNotes, setAllergiesOrNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationCode, setRegistrationCode] = useState<string | null>(null);
  const [activeQRTab, setActiveQRTab] = useState<'ticket' | 'qris'>('ticket');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const code = `BS-EVT-${Math.floor(1000 + Math.random() * 9000)}`;
      setRegistrationCode(code);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const whatsappConfirmationText = registrationCode
    ? encodeURIComponent(
        `Halo Admin BabyShalls Malang! Saya ingin konfirmasi pendaftaran workshop anak.\n\n` +
          `• Kode Registrasi: *${registrationCode}*\n` +
          `• Kegiatan: *${activeEvent?.title}*\n` +
          `• Tanggal: ${activeEvent?.date} (${activeEvent?.time})\n` +
          `• Orang Tua: ${parentName} (${relationship})\n` +
          `• Anak: ${childName} (${childAge})\n` +
          (allergiesOrNotes ? `• Catatan: ${allergiesOrNotes}\n\n` : `\n`) +
          `Mohon panduan konfirmasi kursi dan pembayaran ya Bunda/Admin. Terima kasih!`
      )
    : '';

  return (
    <div className="bg-[#FFF8EF] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* 1. Back button & Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#8A6A55] mb-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-[#DA7A5B] hover:text-[#C46749] font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Jadwal Workshop</span>
          </Link>
          <span>/</span>
          <span className="text-[#3E2415]">Formulir Pendaftaran Peserta</span>
        </div>

        {/* 2. Success Confirmation View */}
        {registrationCode ? (
          <div className="bg-white rounded-3xl border border-[#EEDBC9] p-6 sm:p-10 shadow-subtle text-center space-y-6 animate-in fade-in-50 duration-300">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#EBF2E0] text-[#709154] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#709154] bg-[#EBF2E0] px-3 py-1 rounded-full">
                Pendaftaran Berhasil Diterima!
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2415]">
                Sampai Jumpa di Butik BabyShalls!
              </h1>
              <p className="text-xs sm:text-sm text-[#6B3F2A] leading-relaxed">
                Terima kasih <strong>{parentName}</strong>. Kursi untuk adik <strong>{childName}</strong> di sesi{' '}
                <strong>{activeEvent?.title}</strong> telah dipesan sementara.
              </p>
            </div>

            {/* QR Mode Switcher Tabs */}
            <div className="max-w-md mx-auto flex items-center justify-center p-1 bg-[#F4E8DC] rounded-xl text-xs font-bold text-[#502E1E]">
              <button
                type="button"
                onClick={() => setActiveQRTab('ticket')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeQRTab === 'ticket'
                    ? 'bg-white text-[#DA7A5B] shadow-xs'
                    : 'text-[#6B3F2A] hover:text-[#DA7A5B]'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>QR E-Tiket Masuk</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveQRTab('qris')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeQRTab === 'qris'
                    ? 'bg-white text-[#DA7A5B] shadow-xs'
                    : 'text-[#6B3F2A] hover:text-[#DA7A5B]'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>QRIS Bayar Instan</span>
              </button>
            </div>

            {/* Ticket Card with QR Code */}
            {activeQRTab === 'ticket' ? (
              <div className="max-w-lg mx-auto bg-[#FCF6EC] border-2 border-dashed border-[#EEDBC9] rounded-2xl p-5 sm:p-6 text-left text-xs text-[#502E1E] space-y-4 shadow-xs relative">
                
                {/* Header Ticket */}
                <div className="flex items-center justify-between pb-3 border-b border-[#EEDBC9]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#709154] bg-[#EBF2E0] px-2.5 py-0.5 rounded-full border border-[#D5E4CA]">
                      E-Ticket Masuk Workshop
                    </span>
                    <strong className="font-serif text-sm sm:text-base text-[#3E2415] block mt-1">
                      {activeEvent?.title}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#8A6A55] block">Kode Registrasi:</span>
                    <span className="font-mono font-extrabold text-sm sm:text-base text-[#DA7A5B] tracking-wider">
                      {registrationCode}
                    </span>
                  </div>
                </div>

                {/* Body: Details + Center/Right QR Code */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  
                  {/* Left Column: Info */}
                  <div className="sm:col-span-7 space-y-2.5 text-[11px] order-2 sm:order-1">
                    <div>
                      <span className="text-[#8A6A55] block">Peserta (Anak):</span>
                      <strong className="text-[#3E2415] text-xs font-bold">
                        {childName} {childAge ? `(${childAge})` : ''}
                      </strong>
                      <span className="text-[#8A6A55] block mt-0.5">
                        Pendamping: {parentName} ({relationship})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#EEDBC9]/60">
                      <div>
                        <span className="text-[#8A6A55] block">Jadwal:</span>
                        <span className="font-semibold text-[#3E2415]">{activeEvent?.date}</span>
                        <span className="block text-[#8A6A55]">{activeEvent?.time}</span>
                      </div>
                      <div>
                        <span className="text-[#8A6A55] block">Lokasi:</span>
                        <span className="font-semibold text-[#3E2415]">Butik BabyShalls</span>
                        <span className="block text-[#8A6A55] text-[10px]">Jl. Cempaka No. 12, Malang</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#EEDBC9]/60 flex items-center justify-between font-bold">
                      <span className="text-xs">Biaya Investasi:</span>
                      <span className="text-base text-[#DA7A5B]">
                        {formatIDR(activeEvent?.price || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Prominent QR Code Pass */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-white border-2 border-[#EEDBC9] shadow-xs text-center order-1 sm:order-2">
                    <span className="text-[10px] font-bold text-[#709154] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#709154]" />
                      <span>Tiket Siap Scan</span>
                    </span>
                    <div className="w-34 h-34 flex items-center justify-center bg-white p-1 rounded-xl border border-[#F0E4D7]">
                      <TicketQRCode code={registrationCode || 'BS-EVT'} size={135} />
                    </div>
                    <span className="text-[11px] font-bold text-[#3E2415] mt-2 flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5 text-[#DA7A5B]" />
                      <span>Scan di Meja Kasir</span>
                    </span>
                    <span className="text-[9px] text-[#8A6A55] mt-0.5">
                      Bisa di-screenshot di HP
                    </span>
                  </div>

                </div>

                {/* Perforated Footnote */}
                <div className="pt-2.5 border-t border-dashed border-[#EEDBC9] flex items-center justify-between text-[10px] text-[#8A6A55]">
                  <span>Tunjukkan QR Code ini ke kasir/resepsionis Butik BabyShalls Malang</span>
                  <span className="font-mono font-bold text-[#709154]">VALID PASS</span>
                </div>

              </div>
            ) : (
              /* QRIS Digital Payment Card */
              <div className="max-w-md mx-auto bg-[#FCF6EC] border border-[#EEDBC9] rounded-2xl p-5 text-center text-xs text-[#502E1E] space-y-4 shadow-xs">
                <div>
                  <span className="text-xs font-bold text-[#DA7A5B] block">
                    Scan QRIS untuk Pembayaran Instan
                  </span>
                  <span className="text-[11px] text-[#8A6A55]">
                    Total Transfer Sesuai Tiket: <strong>{formatIDR(activeEvent?.price || 0)}</strong>
                  </span>
                </div>

                <QRISCode nominal={activeEvent?.price || 85000} size={140} />

                <p className="text-[11px] text-[#6B3F2A] leading-relaxed">
                  Buka aplikasi m-Banking (BCA, Mandiri, BRI, BNI) atau e-Wallet (GoPay, OVO, ShopeePay, Dana). Scan QR di atas dan kirim bukti pembayaran via WhatsApp.
                </p>
              </div>
            )}

            {/* Next Step WhatsApp Action */}
            <div className="max-w-md mx-auto space-y-3 pt-2">
              <p className="text-xs text-[#6B3F2A]">
                Silakan ketuk tombol di bawah untuk mengirim konfirmasi langsung ke WhatsApp Admin BabyShalls Malang:
              </p>
              <a
                href={`https://wa.me/6281234567890?text=${whatsappConfirmationText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konfirmasi via WhatsApp Sekarang</span>
              </a>

              <div className="flex items-center justify-center gap-4 pt-2 text-xs">
                <Link href="/events" className="text-[#DA7A5B] hover:underline font-semibold">
                  Lihat Workshop Lainnya
                </Link>
                <span className="text-[#EEDBC9]">•</span>
                <Link href="/catalog" className="text-[#6B3F2A] hover:underline">
                  Jelajahi Toko Buku & Mainan
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* 3. Registration Form View */
          <div className="space-y-8">
            
            {/* Header */}
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2E0] text-[#709154] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Formulir Pendaftaran Resmi</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2415]">
                Daftar Workshop & Storytelling Toko Malang
              </h1>
              <p className="text-xs sm:text-sm text-[#6B3F2A]">
                Mohon lengkapi formulir singkat di bawah ini agar tim kami dapat mempersiapkan fasilitas dan bahan bermain si kecil dengan optimal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Section A: Workshop Selection Card */}
              <div className="bg-white rounded-2xl border border-[#EEDBC9] p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-base font-bold text-[#3E2415] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#DA7A5B]" />
                    <span>Pilihan Sesi Workshop</span>
                  </h2>
                  <span className="text-xs font-bold text-[#DA7A5B] bg-[#FFE4D0] px-3 py-0.5 rounded-full">
                    Sisa {activeEvent?.remainingQuota} Kursi
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#502E1E] mb-1.5">
                    Pilih Kegiatan yang Ingin Diikuti:
                  </label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FCF6EC] border border-[#EEDBC9] text-xs sm:text-sm text-[#3E2415] font-semibold focus:outline-none focus:border-[#DA7A5B]"
                  >
                    {EVENTS.map((evt) => (
                      <option key={evt.id} value={evt.slug}>
                        {evt.title} ({evt.date} • {formatIDR(evt.price)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Event Details Preview */}
                {activeEvent && (
                  <div className="bg-[#FFFDF9] border border-[#F4E8DC] rounded-xl p-4 text-xs space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#502E1E]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#DA7A5B]" />
                        <span>{activeEvent.date} ({activeEvent.time})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#709154]" />
                        <span>{activeEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#F7C85E]" />
                        <span>Rekomendasi: <strong>{activeEvent.ageRecommendation}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#DA7A5B]" />
                        <span>Fasilitator: {activeEvent.speaker}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F4E8DC] flex items-center justify-between text-xs">
                      <span className="text-[#8A6A55]">Total Biaya Investasi:</span>
                      <span className="font-serif font-extrabold text-base text-[#DA7A5B]">
                        {formatIDR(activeEvent.price)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Section B: Data Orang Tua */}
              <div className="bg-white rounded-2xl border border-[#EEDBC9] p-5 sm:p-6 shadow-2xs space-y-4">
                <h2 className="font-serif text-base font-bold text-[#3E2415] flex items-center gap-2 pb-2 border-b border-[#F4E8DC]">
                  <Users className="w-4 h-4 text-[#DA7A5B]" />
                  <span>Data Orang Tua / Pendamping</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-bold text-[#502E1E] mb-1">
                      Nama Lengkap Ayah / Bunda *
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="Contoh: Sarah Pratiwi"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FFFDF9] border border-[#EEDBC9] rounded-xl text-[#3E2415] focus:outline-none focus:border-[#DA7A5B]"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-[#502E1E] mb-1">
                      Panggilan / Hubungan
                    </label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-[#FFFDF9] border border-[#EEDBC9] rounded-xl text-[#3E2415] focus:outline-none focus:border-[#DA7A5B]"
                    >
                      <option value="Bunda">Bunda / Ibu</option>
                      <option value="Ayah">Ayah / Papa</option>
                      <option value="Wali">Kakak / Pengasuh</option>
                    </select>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-xs font-bold text-[#502E1E] mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="081234567890 (Untuk konfirmasi kursi)"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FFFDF9] border border-[#EEDBC9] rounded-xl text-[#3E2415] focus:outline-none focus:border-[#DA7A5B]"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-xs font-bold text-[#502E1E] mb-1">
                      Alamat Email (Opsional)
                    </label>
                    <input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="sarah@example.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FFFDF9] border border-[#EEDBC9] rounded-xl text-[#3E2415] focus:outline-none focus:border-[#DA7A5B]"
                    />
                  </div>
                </div>
              </div>

              {/* Section C: Data Anak Peserta */}
              <div className="bg-white rounded-2xl border border-[#EEDBC9] p-5 sm:p-6 shadow-2xs space-y-4">
                <h2 className="font-serif text-base font-bold text-[#3E2415] flex items-center gap-2 pb-2 border-b border-[#F4E8DC]">
                  <Sparkles className="w-4 h-4 text-[#709154]" />
                  <span>Data Anak Peserta</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-bold text-[#502E1E] mb-1">
                      Nama Lengkap Anak *
                    </label>
                    <input
                      type="text"
                      required
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="Contoh: Muhammad Arka"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FFFDF9] border border-[#EEDBC9] rounded-xl text-[#3E2415] focus:outline-none focus:border-[#DA7A5B]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-[#502E1E] mb-1">
                      Nama Panggilan *
                    </label>
                    <input
                      type="text"
                      required
                      value={childNickname}
                      onChange={(e) => setChildNickname(e.target.value)}
                      placeholder="Arka"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FFFDF9] border border-[#EEDBC9] rounded-xl text-[#3E2415] focus:outline-none focus:border-[#DA7A5B]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-[#502E1E] mb-1">
                      Usia Anak *
                    </label>
                    <input
                      type="text"
                      required
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value)}
                      placeholder="Contoh: 3.5 Tahun"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FFFDF9] border border-[#EEDBC9] rounded-xl text-[#3E2415] focus:outline-none focus:border-[#DA7A5B]"
                    />
                  </div>

                  <div className="sm:col-span-12">
                    <label className="block text-xs font-bold text-[#502E1E] mb-1">
                      Alergi Makanan / Kebutuhan Khusus Si Kecil:
                    </label>
                    <textarea
                      rows={2}
                      value={allergiesOrNotes}
                      onChange={(e) => setAllergiesOrNotes(e.target.value)}
                      placeholder="Contoh: Alergi kacang, mudah kaget suara keras, kidal, dll. (Boleh dikosongkan)"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FFFDF9] border border-[#EEDBC9] rounded-xl text-[#3E2415] focus:outline-none focus:border-[#DA7A5B]"
                    />
                  </div>
                </div>
              </div>

              {/* Info Konfirmasi Kursi & Pembayaran */}
              <div className="bg-[#FFFDF9] border border-[#EEDBC9] rounded-2xl p-4 sm:p-5 text-xs text-[#502E1E] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#709154] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block text-[#3E2415] font-bold text-xs sm:text-sm">
                    Konfirmasi Kursi Tanpa Beban
                  </strong>
                  <p className="text-[#6B3F2A] leading-relaxed text-[11px] sm:text-xs">
                    Biaya kepesertaan <strong>{formatIDR(activeEvent?.price || 0)}</strong> akan dikonfirmasi ketersediaan kursinya melalui WhatsApp oleh tim butik kami. Anda dapat menyelesaikan pembayaran melalui transfer QRIS/BCA atau langsung di kasir toko sebelum jadwal kegiatan.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-sm sm:text-base shadow-subtle hover:shadow-card transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sedang Memproses Pendaftaran...</span>
                  ) : (
                    <>
                      <span>Kirim Pendaftaran ({formatIDR(activeEvent?.price || 0)})</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-[#8A6A55] mt-2">
                  🔒 Data Ayah & Bunda aman dan hanya digunakan untuk keperluan koordinasi kegiatan BabyShalls.
                </p>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}

export default function EventRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-[#8A6A55] bg-[#FFF8EF]">
          Memuat formulir pendaftaran workshop...
        </div>
      }
    >
      <EventRegisterContent />
    </Suspense>
  );
}

// -------------------------------------------------------------
// Helper Component: E-Ticket QR Code (SVG)
// -------------------------------------------------------------
function TicketQRCode({ code, size = 120 }: { code: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-lg shadow-2xs"
      data-ticket-code={code}
    >
      {/* Background */}
      <rect width="120" height="120" fill="#FFFFFF" rx="8" />

      {/* Top-Left Finder */}
      <rect x="10" y="10" width="30" height="30" rx="3" fill="#3E2415" />
      <rect x="15" y="15" width="20" height="20" rx="2" fill="#FFFFFF" />
      <rect x="20" y="20" width="10" height="10" rx="1.5" fill="#DA7A5B" />

      {/* Top-Right Finder */}
      <rect x="80" y="10" width="30" height="30" rx="3" fill="#3E2415" />
      <rect x="85" y="15" width="20" height="20" rx="2" fill="#FFFFFF" />
      <rect x="90" y="20" width="10" height="10" rx="1.5" fill="#DA7A5B" />

      {/* Bottom-Left Finder */}
      <rect x="10" y="80" width="30" height="30" rx="3" fill="#3E2415" />
      <rect x="15" y="85" width="20" height="20" rx="2" fill="#FFFFFF" />
      <rect x="20" y="90" width="10" height="10" rx="1.5" fill="#DA7A5B" />

      {/* Timing Patterns & Data Modules */}
      <rect x="44" y="14" width="6" height="6" fill="#3E2415" />
      <rect x="54" y="14" width="6" height="6" fill="#DA7A5B" />
      <rect x="64" y="14" width="6" height="6" fill="#3E2415" />
      <rect x="70" y="14" width="4" height="6" fill="#3E2415" />

      <rect x="14" y="44" width="6" height="6" fill="#3E2415" />
      <rect x="14" y="54" width="6" height="6" fill="#DA7A5B" />
      <rect x="14" y="64" width="6" height="6" fill="#3E2415" />

      <rect x="24" y="44" width="6" height="6" fill="#3E2415" />
      <rect x="34" y="52" width="6" height="6" fill="#3E2415" />
      <rect x="44" y="44" width="6" height="6" fill="#DA7A5B" />
      <rect x="54" y="44" width="6" height="6" fill="#3E2415" />
      <rect x="64" y="44" width="6" height="6" fill="#3E2415" />
      <rect x="74" y="44" width="6" height="6" fill="#DA7A5B" />
      <rect x="84" y="44" width="6" height="6" fill="#3E2415" />
      <rect x="94" y="44" width="6" height="6" fill="#3E2415" />
      <rect x="100" y="44" width="6" height="6" fill="#DA7A5B" />

      <rect x="44" y="54" width="6" height="6" fill="#3E2415" />
      <rect x="64" y="54" width="6" height="6" fill="#DA7A5B" />
      <rect x="74" y="54" width="6" height="6" fill="#3E2415" />
      <rect x="84" y="54" width="6" height="6" fill="#3E2415" />
      <rect x="100" y="54" width="6" height="6" fill="#3E2415" />

      <rect x="24" y="64" width="6" height="6" fill="#3E2415" />
      <rect x="44" y="64" width="6" height="6" fill="#3E2415" />
      <rect x="54" y="64" width="6" height="6" fill="#DA7A5B" />
      <rect x="74" y="64" width="6" height="6" fill="#3E2415" />
      <rect x="94" y="64" width="6" height="6" fill="#3E2415" />

      <rect x="44" y="74" width="6" height="6" fill="#3E2415" />
      <rect x="54" y="74" width="6" height="6" fill="#3E2415" />
      <rect x="64" y="74" width="6" height="6" fill="#DA7A5B" />
      <rect x="84" y="74" width="6" height="6" fill="#3E2415" />
      <rect x="94" y="74" width="6" height="6" fill="#3E2415" />

      <rect x="44" y="84" width="6" height="6" fill="#DA7A5B" />
      <rect x="54" y="84" width="6" height="6" fill="#3E2415" />
      <rect x="64" y="84" width="6" height="6" fill="#3E2415" />
      <rect x="74" y="84" width="6" height="6" fill="#DA7A5B" />
      <rect x="84" y="84" width="6" height="6" fill="#3E2415" />
      <rect x="100" y="84" width="6" height="6" fill="#3E2415" />

      <rect x="44" y="94" width="6" height="6" fill="#3E2415" />
      <rect x="64" y="94" width="6" height="6" fill="#3E2415" />
      <rect x="74" y="94" width="6" height="6" fill="#3E2415" />
      <rect x="84" y="94" width="6" height="6" fill="#DA7A5B" />
      <rect x="94" y="94" width="6" height="6" fill="#3E2415" />

      <rect x="44" y="104" width="6" height="6" fill="#3E2415" />
      <rect x="54" y="104" width="6" height="6" fill="#DA7A5B" />
      <rect x="74" y="104" width="6" height="6" fill="#3E2415" />
      <rect x="94" y="104" width="6" height="6" fill="#3E2415" />

      {/* Center Small Badge */}
      <rect x="50" y="50" width="20" height="20" rx="4" fill="#DA7A5B" />
      <text
        x="60"
        y="63"
        fill="#FFFFFF"
        fontSize="8"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        BS
      </text>
    </svg>
  );
}

// -------------------------------------------------------------
// Helper Component: QRIS Payment Card (SVG)
// -------------------------------------------------------------
function QRISCode({ nominal, size = 140 }: { nominal: number; size?: number }) {
  return (
    <div
      className="inline-flex flex-col items-center bg-white border border-[#EEDBC9] rounded-2xl p-4 shadow-sm"
      data-nominal={nominal}
    >
      {/* QRIS Header */}
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#F0E4D7] text-left">
        <div>
          <span className="font-extrabold text-sm tracking-wider text-[#3E2415] block">
            QRIS
          </span>
          <span className="text-[9px] text-[#8A6A55] block">
            Pembayaran Nasional
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-[#DA7A5B] block">
            BABYSHALLS MALANG
          </span>
          <span className="text-[8px] text-[#8A6A55]">NMID: ID1029481902</span>
        </div>
      </div>

      {/* QR Visual */}
      <div className="p-2 bg-white rounded-lg border border-[#F0E4D7]">
        <svg
          width={size}
          height={size}
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-Left Finder */}
          <rect x="10" y="10" width="36" height="36" rx="4" fill="#1A1A1A" />
          <rect x="16" y="16" width="24" height="24" rx="2" fill="#FFFFFF" />
          <rect x="22" y="22" width="12" height="12" rx="1.5" fill="#1A1A1A" />

          {/* Top-Right Finder */}
          <rect x="94" y="10" width="36" height="36" rx="4" fill="#1A1A1A" />
          <rect x="100" y="16" width="24" height="24" rx="2" fill="#FFFFFF" />
          <rect x="106" y="22" width="12" height="12" rx="1.5" fill="#1A1A1A" />

          {/* Bottom-Left Finder */}
          <rect x="10" y="94" width="36" height="36" rx="4" fill="#1A1A1A" />
          <rect x="16" y="100" width="24" height="24" rx="2" fill="#FFFFFF" />
          <rect x="22" y="106" width="12" height="12" rx="1.5" fill="#1A1A1A" />

          {/* Alignment & Data Pattern */}
          <rect x="52" y="14" width="6" height="6" fill="#1A1A1A" />
          <rect x="62" y="14" width="6" height="6" fill="#1A1A1A" />
          <rect x="72" y="14" width="6" height="6" fill="#1A1A1A" />
          <rect x="82" y="14" width="6" height="6" fill="#1A1A1A" />

          <rect x="14" y="52" width="6" height="6" fill="#1A1A1A" />
          <rect x="14" y="62" width="6" height="6" fill="#1A1A1A" />
          <rect x="14" y="72" width="6" height="6" fill="#1A1A1A" />
          <rect x="14" y="82" width="6" height="6" fill="#1A1A1A" />

          <rect x="52" y="52" width="8" height="8" fill="#1A1A1A" />
          <rect x="64" y="52" width="8" height="8" fill="#1A1A1A" />
          <rect x="76" y="52" width="8" height="8" fill="#1A1A1A" />
          <rect x="88" y="52" width="8" height="8" fill="#1A1A1A" />
          <rect x="100" y="52" width="8" height="8" fill="#1A1A1A" />
          <rect x="112" y="52" width="8" height="8" fill="#1A1A1A" />

          <rect x="26" y="56" width="8" height="8" fill="#1A1A1A" />
          <rect x="36" y="68" width="8" height="8" fill="#1A1A1A" />
          <rect x="52" y="68" width="8" height="8" fill="#1A1A1A" />
          <rect x="76" y="68" width="8" height="8" fill="#1A1A1A" />
          <rect x="100" y="68" width="8" height="8" fill="#1A1A1A" />
          <rect x="120" y="68" width="8" height="8" fill="#1A1A1A" />

          <rect x="52" y="80" width="8" height="8" fill="#1A1A1A" />
          <rect x="64" y="80" width="8" height="8" fill="#1A1A1A" />
          <rect x="88" y="80" width="8" height="8" fill="#1A1A1A" />
          <rect x="112" y="80" width="8" height="8" fill="#1A1A1A" />

          <rect x="52" y="96" width="8" height="8" fill="#1A1A1A" />
          <rect x="64" y="96" width="8" height="8" fill="#1A1A1A" />
          <rect x="76" y="96" width="8" height="8" fill="#1A1A1A" />
          <rect x="88" y="96" width="8" height="8" fill="#1A1A1A" />
          <rect x="104" y="96" width="8" height="8" fill="#1A1A1A" />
          <rect x="120" y="96" width="8" height="8" fill="#1A1A1A" />

          <rect x="52" y="112" width="8" height="8" fill="#1A1A1A" />
          <rect x="76" y="112" width="8" height="8" fill="#1A1A1A" />
          <rect x="88" y="112" width="8" height="8" fill="#1A1A1A" />
          <rect x="104" y="112" width="8" height="8" fill="#1A1A1A" />
          <rect x="120" y="112" width="8" height="8" fill="#1A1A1A" />

          {/* Central Logo Box */}
          <rect x="56" y="56" width="28" height="28" rx="4" fill="#DA7A5B" />
          <text
            x="70"
            y="74"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            QRIS
          </text>
        </svg>
      </div>

      {/* QRIS Footer */}
      <span className="text-[10px] text-[#8A6A55] font-semibold mt-2">
        GPN &bull; Bersama &bull; Prima &bull; Alto
      </span>
    </div>
  );
}

