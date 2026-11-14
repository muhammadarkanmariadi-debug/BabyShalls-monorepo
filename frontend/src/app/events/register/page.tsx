'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, MapPin, ArrowLeft, CheckCircle2, Ticket, ExternalLink } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import { RegisterEventResult, usePublicEvents, useRegisterEvent } from '../../../hooks/useEvents';
import { extractApiError } from '../../../lib/axios';
import { openMidtransSnap } from '../../../lib/midtrans-snap';
import { formatChildAge, formatIDR, formatPhoneInput, normalizePhoneDigits, parseChildAge } from '../../../lib/utils';
import { AutoFillProfileButton } from '../../../components/account/AutoFillProfileButton';

function EventRegisterContent() {
  const searchParams = useSearchParams();
  const eventParam = searchParams.get('eventId') || searchParams.get('event');
  const { data: events = [] } = usePublicEvents();

  const [selectedEventId, setSelectedEventId] = useState<string>(eventParam || '');

  useEffect(() => {
    if (eventParam) {
      setSelectedEventId(eventParam);
    } else if (!selectedEventId && events[0]?.slug) {
      setSelectedEventId(events[0].slug);
    }
  }, [eventParam, events, selectedEventId]);

  const activeEvent =
    events.find((e) => e.slug === selectedEventId || e.id === selectedEventId) || events[0];

  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [childAgeValue, setChildAgeValue] = useState('');
  const [childAgeUnit, setChildAgeUnit] = useState<'Tahun' | 'Bulan'>('Tahun');
  const [ticketQty, setTicketQty] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [registrationResult, setRegistrationResult] = useState<RegisterEventResult | null>(null);
  const registerEventMutation = useRegisterEvent();

  const childAge = formatChildAge(childAgeValue, childAgeUnit);
  const totalEstimated = (activeEvent?.price || 0) * ticketQty;

  const formattedDate =
    activeEvent && !Number.isNaN(Date.parse(activeEvent.eventDate))
      ? new Date(activeEvent.eventDate).toLocaleDateString('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : activeEvent?.eventDate || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await registerEventMutation.mutateAsync({
        eventId: activeEvent?.slug || selectedEventId,
        participantName: parentName,
        childName,
        childAge,
        whatsappNumber: normalizePhoneDigits(parentPhone) || parentPhone,
        ticketQuantity: ticketQty,
        couponCode: couponCode.trim() || undefined,
        unitPrice: activeEvent?.price || 0,
      });
      setRegistrationResult(result);
      toast.success(
        (result.finalAmount ?? 0) > 0
          ? 'Pendaftaran tercatat! Silakan selesaikan pembayaran tiket.'
          : 'Pendaftaran workshop berhasil!'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if ((result.finalAmount ?? 0) > 0 && (result.snapToken || result.redirectUrl)) {
        openMidtransSnap(result.snapToken, result.redirectUrl, {
          onSuccess: () => {
            setRegistrationResult((prev) =>
              prev ? { ...prev, paymentStatus: 'PAID', status: 'CONFIRMED' } : prev
            );
            toast.success('Pembayaran tiket workshop berhasil!');
          },
          onPending: () => toast('Menunggu pembayaran tiket workshop Anda.'),
          onError: () => toast.error('Pembayaran gagal, silakan coba lagi.'),
        });
      }
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal mendaftarkan peserta event.'));
    }
  };

  return (
    <div className="bg-white py-10 lg:py-14 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6B7280] hover:text-[#1A1A1A]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Event</span>
        </Link>

        {registrationResult ? (
          <div className="bg-[#E9F3E4] border border-[#D4E6CA] rounded-3xl p-8 sm:p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-white text-[#1E543B] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E543B]">
                E-Ticket Workshop Terbit
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] mt-1">
                Sampai Jumpa di BabyShalls Malang!
              </h1>
            </div>

            <div className="bg-white rounded-2xl p-6 max-w-md mx-auto border border-[#E5E7EB] space-y-4">
              <div className="inline-flex p-2 rounded-2xl bg-[#FCF6EC] border border-[#EBDCCB]">
                <QRCodeCanvas value={registrationResult.ticketCode} size={120} />
              </div>
              <div className="text-sm font-extrabold font-mono text-[#1A1A1A]">
                {registrationResult.ticketCode}
              </div>
              <div className="text-xs text-[#4A4A4A] space-y-1 text-left border-t border-[#F3F4F6] pt-3">
                <div><strong>Event:</strong> {activeEvent?.title}</div>
                <div><strong>Peserta:</strong> {childName} ({childAge}) • {ticketQty} Tiket</div>
                <div><strong>Jadwal:</strong> {formattedDate} ({activeEvent?.timeString})</div>
                <div>
                  <strong>Biaya:</strong>{' '}
                  <span className="font-bold text-[#1E543B]">
                    {(registrationResult.finalAmount ?? 0) > 0
                      ? `${formatIDR(registrationResult.finalAmount ?? 0)} (${registrationResult.paymentStatus})`
                      : 'Gratis'}
                  </span>
                </div>
              </div>

              {(registrationResult.finalAmount ?? 0) > 0 &&
                registrationResult.paymentStatus !== 'PAID' &&
                (registrationResult.snapToken || registrationResult.redirectUrl) && (
                <button
                  type="button"
                  onClick={() =>
                    openMidtransSnap(registrationResult.snapToken, registrationResult.redirectUrl, {
                      onSuccess: () => {
                        setRegistrationResult((prev) =>
                          prev ? { ...prev, paymentStatus: 'PAID', status: 'CONFIRMED' } : prev
                        );
                        toast.success('Pembayaran tiket workshop berhasil!');
                      },
                      onPending: () => toast('Menunggu pembayaran tiket workshop Anda.'),
                      onError: () => toast.error('Pembayaran gagal, silakan coba lagi.'),
                    })
                  }
                  className="w-full min-h-[42px] rounded-full bg-[#D9744A] text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 hover:bg-[#c5633b] transition-colors"
                >
                  <span>Bayar Tiket via Midtrans</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                  `Halo CS BabyShalls Malang, saya ${parentName} ingin konfirmasi E-Ticket ${registrationResult.ticketCode} untuk workshop "${activeEvent?.title}" (${childName}, ${ticketQty} tiket).`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] inline-flex items-center px-6 rounded-full bg-[#1E543B] text-white font-bold text-sm"
              >
                Konfirmasi via WhatsApp CS
              </a>
              <Link
                href="/account"
                className="min-h-[44px] inline-flex items-center px-6 rounded-full bg-[#1A1A1A] text-white font-bold text-sm"
              >
                Lihat di Tiket Saya
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] bg-white space-y-5">
              <h1 className="text-2xl font-extrabold text-[#1A1A1A]">
                {(activeEvent?.price || 0) > 0 ? 'Pendaftaran & Pembelian Tiket Workshop' : 'Pendaftaran Workshop Gratis'}
              </h1>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Pilih Workshop</label>
                <select
                  value={activeEvent?.slug || selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full h-[44px] px-4 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl font-semibold"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.slug}>
                      {ev.title} — {ev.price > 0 ? formatIDR(ev.price) : 'Gratis'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-xs font-bold text-[#6B7280]">Data Orang Tua &amp; Anak</span>
                <AutoFillProfileButton
                  autoFillOnLoad
                  onAutoFill={(user) => {
                    if (user.parentName || user.name) setParentName(user.parentName || user.name);
                    if (user.phone) setParentPhone(formatPhoneInput(user.phone));
                    if (user.childName) setChildName(user.childName);
                    if (user.childAge) {
                      const parsed = parseChildAge(user.childAge);
                      setChildAgeValue(parsed.value);
                      setChildAgeUnit(parsed.unit);
                    }
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Nama Orang Tua *</label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Contoh: Bunda Nadia"
                    className="w-full h-[44px] px-4 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(formatPhoneInput(e.target.value))}
                    placeholder="0812-3456-7890"
                    maxLength={18}
                    className="w-full h-[44px] px-4 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Nama Anak *</label>
                  <input
                    type="text"
                    required
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Contoh: Alesha"
                    className="w-full h-[44px] px-4 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Usia Anak *</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={0}
                      max={childAgeUnit === 'Tahun' ? 18 : 36}
                      step="1"
                      inputMode="numeric"
                      required
                      value={childAgeValue}
                      onChange={(e) => setChildAgeValue(e.target.value.replace(/[^\d]/g, ''))}
                      placeholder={childAgeUnit === 'Tahun' ? '3' : '18'}
                      className="w-full h-[44px] px-3 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                    />
                    <select
                      value={childAgeUnit}
                      onChange={(e) => setChildAgeUnit(e.target.value as 'Tahun' | 'Bulan')}
                      className="h-[44px] px-2.5 text-xs font-bold bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                    >
                      <option value="Tahun">Tahun</option>
                      <option value="Bulan">Bulan</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Jumlah Tiket (Maks 5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={ticketQty}
                    onChange={(e) => setTicketQty(Math.max(1, Math.min(5, Number(e.target.value))))}
                    className="w-full h-[44px] px-4 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                  />
                </div>
                {(activeEvent?.price || 0) > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Kode Kupon (Opsional)</label>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Contoh: BABYNEW"
                      className="w-full h-[44px] px-4 text-sm uppercase font-mono bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={registerEventMutation.isPending}
                className="w-full min-h-[48px] rounded-full bg-[#1E543B] hover:bg-[#163F2C] disabled:opacity-60 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>
                  {registerEventMutation.isPending
                    ? 'Memproses...'
                    : (activeEvent?.price || 0) > 0
                      ? `Daftar & Bayar ${formatIDR(totalEstimated)}`
                      : 'Daftar Workshop Gratis'}
                </span>
              </button>
            </form>

            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#FAF4E8] border border-[#E5E7EB] space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E543B]">
                <Ticket className="w-4 h-4" />
                <span>RINGKASAN TIKET</span>
              </div>
              <h2 className="text-lg font-extrabold text-[#1A1A1A]">{activeEvent?.title}</h2>
              <div className="space-y-2 text-xs text-[#4A4A4A]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1E543B]" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1E543B]" />
                  <span>{activeEvent?.timeString}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1E543B]" />
                  <span>{activeEvent?.location}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-black/10 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#4A4A4A]">{ticketQty}x Tiket Workshop</span>
                  <span className="font-bold text-[#1E543B]">
                    {totalEstimated > 0 ? formatIDR(totalEstimated) : 'Gratis'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold pt-2 border-t border-black/10">
                  <span>Total Biaya</span>
                  <span className="text-[#1E543B]">
                    {totalEstimated > 0 ? formatIDR(totalEstimated) : 'Gratis'}
                  </span>
                </div>
              </div>
            </div>
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
        <div className="py-24 text-center text-sm font-semibold text-[#6B7280]">
          Memuat formulir tiket...
        </div>
      }
    >
      <EventRegisterContent />
    </Suspense>
  );
}
