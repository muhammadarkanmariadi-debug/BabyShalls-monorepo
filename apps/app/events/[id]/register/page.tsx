'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  Calendar,
  MapPin,
  Users,
  Check,
  Plus,
  Trash2,
  Download,
  ShieldCheck,
  QrCode,
  ArrowRight,
  AlertCircle,
  X,
} from 'lucide-react';
import { TombolKembali } from '@/components/common/TombolKembali';
import { getEventById } from '@/data/eventsData';
import { useRegisterEvent, usePublicEvent } from '@/hooks/useEvents';
import { generateIdempotencyKey } from '@/lib/idempotency';
import { openMidtransSnap } from '@/lib/midtrans-snap';

interface ChildData {
  id: number;
  name: string;
  age: string;
}

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = typeof params?.id === 'string' ? params.id : 'nature-craft';

  // Dynamic Event Data with DB priority & static fallback
  const fallbackEvent = getEventById(rawId);
  const { data: dbEvent } = usePublicEvent(rawId);

  const eventData = dbEvent
    ? {
        ...fallbackEvent,
        id: dbEvent.id,
        title: dbEvent.title || fallbackEvent.title,
        price: dbEvent.price !== undefined ? dbEvent.price : fallbackEvent.price,
        isFree: dbEvent.price === 0,
        quotaTotal: fallbackEvent.quotaTotal || 20,
        seatsLeft: dbEvent.quota !== undefined ? dbEvent.quota : fallbackEvent.seatsLeft,
      }
    : fallbackEvent;

  const isFree = eventData.isFree || eventData.price === 0;

  // Form states (Figma Node #169:5461)
  const [parentName, setParentName] = useState('Rina Pratiwi');
  const [phone, setPhone] = useState('0812-3456-7890');
  const [email, setEmail] = useState('rina@email.com');
  const [notes, setNotes] = useState('');
  const [agreedPhotoConsent, setAgreedPhotoConsent] = useState(true);

  // Dynamic Children list
  const [childrenList, setChildrenList] = useState<ChildData[]>([
    { id: 1, name: 'Ara', age: '4 tahun' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [issuedTicketId, setIssuedTicketId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddChild = () => {
    if (childrenList.length >= 4) return;
    setChildrenList((prev) => [
      ...prev,
      { id: Date.now(), name: '', age: '4 tahun' },
    ]);
  };

  const handleRemoveChild = (id: number) => {
    if (childrenList.length <= 1) return;
    setChildrenList((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateChild = (id: number, field: 'name' | 'age', value: string) => {
    setChildrenList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const totalPrice = childrenList.length * eventData.price;

  const registerEventMutation = useRegisterEvent();
  const eventIdemKeyRef = useRef<{ fingerprint: string; key: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || registerEventMutation.isPending) return;
    setIsSubmitting(true);

    const payload = {
      eventId: eventData.id,
      participantName: parentName.trim(),
      childName: childrenList.map((c) => c.name.trim()).filter(Boolean).join(', ') || 'Peserta Anak',
      childAge: childrenList.map((c) => c.age).join(', '),
      whatsappNumber: phone.trim(),
      ticketQuantity: childrenList.length,
      unitPrice: eventData.price,
    };

    const fingerprint = JSON.stringify(payload);
    if (!eventIdemKeyRef.current || eventIdemKeyRef.current.fingerprint !== fingerprint) {
      eventIdemKeyRef.current = { fingerprint, key: generateIdempotencyKey('evt') };
    }

    let ticketId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    let snapToken: string | null = null;
    let redirectUrl: string | null = null;

    try {
      setErrorMessage('');
      const result = await registerEventMutation.mutateAsync({
        ...payload,
        idempotencyKey: eventIdemKeyRef.current.key,
      });
      ticketId = result.ticketCode || ticketId;
      snapToken = result.snapToken || null;
      redirectUrl = result.redirectUrl || null;
      eventIdemKeyRef.current = null;
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Gagal mendaftar workshop.';
      setErrorMessage(msg);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const completeRegistration = () => {
      setIssuedTicketId(ticketId);

      const newTicket = {
        ticketId,
        eventId: eventData.id,
        eventTitle: eventData.title,
        eventDate: eventData.date,
        eventTime: eventData.time,
        location: eventData.location,
        parentName,
        phone,
        email,
        children: childrenList,
        totalPaid: totalPrice,
        isFree,
        registeredAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        try {
          const existing = JSON.parse(
            localStorage.getItem('babyshalls_event_tickets') || '[]'
          );
          existing.unshift(newTicket);
          localStorage.setItem(
            'babyshalls_event_tickets',
            JSON.stringify(existing)
          );
        } catch {
          // pass
        }
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!isFree && snapToken) {
      const snapMode = openMidtransSnap(snapToken, redirectUrl, {
        onSuccess: () => completeRegistration(),
        onPending: () => completeRegistration(),
        onError: () => {
          alert('Pembayaran Midtrans tidak berhasil. Silakan coba lagi.');
          setIsSubmitting(false);
        },
        onClose: () => completeRegistration(),
      });
      if (snapMode === 'dev' || snapMode === 'redirect' || snapMode === 'unavailable') {
        completeRegistration();
      }
    } else {
      completeRegistration();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <TombolKembali fallbackUrl={`/events/${rawId}`} label="Back to Event Details" />

      {/* Breadcrumb Navigation */}
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-8 pt-4 pb-1">
        <nav className="flex items-center gap-2 text-xs text-[#7A5644] flex-wrap">
          <Link href="/" className="hover:text-[#B05A26] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/events" className="hover:text-[#B05A26] transition-colors">
            Events &amp; Workshops
          </Link>
          <span>/</span>
          <Link href={`/events/${rawId}`} className="hover:text-[#B05A26] transition-colors line-clamp-1 max-w-[200px] sm:max-w-none">
            {eventData.title}
          </Link>
          <span>/</span>
          <span className="text-[#4A2A1C] font-semibold">Registration Form</span>
        </nav>
      </div>

      {/* SUCCESS STATE - Figma Node #169:5717 */}
      {isSuccess ? (
        <main className="flex-1 py-12 sm:py-16">
          <div className="max-w-[800px] mx-auto px-4 sm:px-6">
            <div className="bg-white border border-[#E6D2C0] rounded-[2px] p-6 sm:p-10 shadow-sm text-center">
              
              {/* Mascot Ticket Illustration */}
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto mb-6">
                <Image
                  src="/images/mascot/maskot-tiket.png"
                  alt="Ticket Issued Successfully"
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              <span className="inline-block px-3 py-1 bg-[#DDF1E5] text-[#2A6E37] text-xs font-semibold rounded-[2px] uppercase tracking-wider mb-3">
                {isFree ? 'Complimentary Registration Confirmed' : 'Registration Confirmed'}
              </span>
              
              <h1 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] mb-2">
                Hooray! Your Ticket is Ready
              </h1>
              <p className="text-sm text-[#7A5644] max-w-lg mx-auto mb-8 leading-relaxed">
                Registration confirmation and your QR Code have been sent to email{' '}
                <strong className="text-[#4A2A1C]">{email}</strong> and WhatsApp{' '}
                <strong className="text-[#4A2A1C]">{phone}</strong>.
              </p>

              {/* Ticket Card Summary */}
              <div className="bg-[#FFFDF9] border border-[#E6D2C0] rounded-[2px] p-6 text-left max-w-lg mx-auto mb-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2E4D6]">
                  <div>
                    <span className="text-[11px] text-[#7A5644] block">Ticket Code</span>
                    <span className="text-lg font-bold text-[#B05A26]">{issuedTicketId}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-[#E6D2C0]">
                    <QrCode className="w-10 h-10 text-[#4A2A1C]" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#4A2A1C]">{eventData.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#7A5644] mt-1">
                    <Calendar className="w-3.5 h-3.5 text-[#B05A26]" />
                    <span>{eventData.date} · {eventData.time}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-xs text-[#7A5644] mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#7A5644] shrink-0 mt-0.5" />
                    <span>{eventData.location}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F2E4D6] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#7A5644]">Parent / Guardian:</span>
                    <span className="font-medium text-[#4A2A1C]">{parentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A5644]">Children Attending ({childrenList.length}):</span>
                    <span className="font-medium text-[#4A2A1C]">
                      {childrenList.map((c) => `${c.name || 'Child'} (${c.age})`).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-1 text-[#4A2A1C]">
                    <span>Total Fee:</span>
                    <span className={isFree ? 'text-[#2A6E37]' : 'text-[#B05A26]'}>
                      {isFree ? 'FREE (Rp0)' : `Rp${totalPrice.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <Link
                  href="/account"
                  className="w-full sm:w-auto flex-1 py-3 px-6 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  Go to Account → Event Tickets
                </Link>
                <Link
                  href="/events"
                  className="w-full sm:w-auto py-3 px-6 border border-[#E6D2C0] bg-white hover:bg-gray-50 text-[#4A2A1C] text-xs font-semibold rounded-[2px] transition-colors text-center"
                >
                  View Other Events
                </Link>
              </div>

            </div>
          </div>
        </main>
      ) : (
        /* REGISTRATION FORM - Figma Node #169:5461 */
        <main className="flex-1 py-6 sm:py-10">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            
            {/* Header Section (Figma Node #169:5464) */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7E4A84] block">
                  REGISTRATION FORM
                </span>
                {isFree ? (
                  <span className="bg-[#DDF1E5] text-[#2A6E37] text-[11px] font-bold px-2 py-0.5 rounded-[2px]">
                    FREE
                  </span>
                ) : (
                  <span className="bg-[#FFF6EA] text-[#B05A26] text-[11px] font-bold px-2 py-0.5 rounded-[2px] border border-[#E6D2C0]">
                    {eventData.priceLabel}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-medium text-[#4A2A1C] leading-tight mb-2">
                Register: {eventData.title}
              </h1>
              <p className="text-sm sm:text-base text-[#7A5644]">
                {eventData.date} · {eventData.time} · {eventData.location}
              </p>
            </div>

            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-[#FDF2F2] border border-[#F8B4B4] rounded-[2px] flex items-start justify-between gap-3 text-sm text-[#9B1C1C] animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 shrink-0 text-[#E02424] mt-0.5" />
                  <div>
                    <p className="font-semibold text-xs sm:text-sm">Registration could not be processed</p>
                    <p className="text-xs text-[#9B1C1C]/90 mt-0.5">{errorMessage}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage('')}
                  className="text-[#9B1C1C] hover:text-black p-0.5 cursor-pointer"
                  aria-label="Close error message"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Content: Form + Summary Grid (Figma Node #169:5467) */}
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
                
                {/* Left Form Column (Figma Node #169:5468) */}
                <div className="flex-1 w-full space-y-4">
                  
                  {/* Card 1: Data Orang Tua / Pendamping (Figma #169:5469) */}
                  <div className="bg-white border border-[#E6D2C0] rounded-[2px] p-5 sm:p-6 shadow-xs">
                    <h2 className="text-base sm:text-lg font-medium text-[#4A2A1C] mb-4">
                      Parent / guardian details
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1.5">
                          Full name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={parentName}
                          onChange={(e) => setParentName(e.target.value)}
                          placeholder="Parent / guardian full name"
                          className="w-full px-4 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-sm text-[#4A2A1C] focus:outline-hidden focus:border-[#B05A26]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#4A2A1C] mb-1.5">
                            WhatsApp Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0812-3456-7890"
                            className="w-full px-4 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-sm text-[#4A2A1C] focus:outline-hidden focus:border-[#B05A26]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#4A2A1C] mb-1.5">
                            Email address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@email.com"
                            className="w-full px-4 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-sm text-[#4A2A1C] focus:outline-hidden focus:border-[#B05A26]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Data Anak (Figma Node #169:5484) */}
                  <div className="bg-white border border-[#E6D2C0] rounded-[2px] p-5 sm:p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base sm:text-lg font-medium text-[#4A2A1C]">
                        Children information
                      </h2>
                      <span className="text-xs text-[#7A5644]">
                        Max. 4 children per form
                      </span>
                    </div>

                    <div className="space-y-4">
                      {childrenList.map((child, idx) => (
                        <div
                          key={child.id}
                          className="p-4 bg-[#FFFDF9] border border-[#E6D2C0] rounded-[2px] space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#4A2A1C]">
                              Child {idx + 1}
                            </span>
                            {childrenList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveChild(child.id)}
                                className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#4A2A1C] mb-1">
                                Nickname <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={child.name}
                                onChange={(e) =>
                                  handleUpdateChild(child.id, 'name', e.target.value)
                                }
                                placeholder="e.g. Ara"
                                className="w-full px-3.5 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-hidden focus:border-[#B05A26]"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-[#4A2A1C] mb-1">
                                Age <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={child.age}
                                onChange={(e) =>
                                  handleUpdateChild(child.id, 'age', e.target.value)
                                }
                                className="w-full px-3.5 py-2 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-hidden focus:border-[#B05A26]"
                              >
                                <option value="2 years old">2 years old</option>
                                <option value="3 years old">3 years old</option>
                                <option value="4 years old">4 years old</option>
                                <option value="5 years old">5 years old</option>
                                <option value="6 years old">6 years old</option>
                                <option value="7 years old">7 years old</option>
                                <option value="8 years old">8 years old</option>
                                <option value="9 years old">9 years old</option>
                                <option value="10 years old">10 years old</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}

                      {childrenList.length < 4 && (
                        <button
                          type="button"
                          onClick={handleAddChild}
                          className="w-full py-2.5 border border-dashed border-[#B05A26] text-[#B05A26] bg-[#FFF8F3] hover:bg-[#FCEEE3] text-xs font-semibold rounded-[2px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          + Register Additional Child (Extra Ticket)
                        </button>
                      )}

                      {/* Catatan Khusus (Figma Node #169:5517) */}
                      <div className="pt-1">
                        <label className="block text-xs font-semibold text-[#4A2A1C] mb-1.5">
                          Special notes (allergies, special requirements)
                        </label>
                        <textarea
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="e.g. sawdust allergy or needs extra assistance while painting"
                          className="w-full px-4 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs text-[#4A2A1C] focus:outline-hidden focus:border-[#B05A26]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Persetujuan Foto (Figma Node #169:5521) */}
                  <div className="bg-white border border-[#E6D2C0] rounded-[2px] p-5 shadow-xs">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedPhotoConsent}
                        onChange={(e) => setAgreedPhotoConsent(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-[#B05A26] border-gray-300 rounded focus:ring-[#B05A26]"
                      />
                      <span className="text-xs text-[#7A5644] leading-relaxed">
                        I agree that event photos and videos may be used for BabyShalls documentation and social media.
                      </span>
                    </label>
                  </div>

                </div>

                {/* Right Sticky Summary Column (Figma Node #169:5525) */}
                <div className="w-full lg:w-[384px] shrink-0 lg:sticky lg:top-24">
                  <div className="bg-white border border-[#E6D2C0] rounded-[2px] p-6 sm:p-7 shadow-xs space-y-5">
                    <h2 className="text-lg font-medium text-[#4A2A1C] pb-3 border-b border-[#F2E4D6]">
                      Registration Summary
                    </h2>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-[11px] text-[#7A5644] block">Selected event</span>
                        <span className="font-semibold text-[#4A2A1C] text-sm block mt-0.5">
                          {eventData.title}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[#7A5644] pt-2 border-t border-[#F2E4D6]">
                        <span>Children Attending:</span>
                        <span className="font-bold text-[#4A2A1C]">{childrenList.length} child(ren)</span>
                      </div>

                      <div className="flex items-center justify-between text-[#7A5644]">
                        <span>Fee per Ticket:</span>
                        <span className="font-medium text-[#4A2A1C]">
                          {isFree ? 'FREE' : eventData.priceLabel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#F2E4D6] text-sm font-semibold">
                        <span className="text-[#4A2A1C]">Total Due:</span>
                        <span className={`text-base font-bold ${isFree ? 'text-[#2A6E37]' : 'text-[#B05A26]'}`}>
                          {isFree ? 'FREE (Rp0)' : `Rp${totalPrice.toLocaleString('id-ID')}`}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#FFF8F3] border border-[#FCEEE3] p-3 rounded-[2px] text-[11px] text-[#7A5644] space-y-1">
                      <div className="flex items-center gap-1.5 text-[#B05A26] font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Guaranteed Reservation</span>
                      </div>
                      <p>
                        QR e-tickets are generated immediately upon reservation. No manual verification required.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || registerEventMutation.isPending}
                      className="w-full py-3.5 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isSubmitting || registerEventMutation.isPending ? (
                        <span>Processing Registration...</span>
                      ) : (
                        <>
                          <span>{isFree ? 'Confirm Complimentary Registration' : 'Confirm & Pay Registration'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-[#7A5644]">
                      QR tickets are delivered to email &amp; accessible under Account → Event Tickets.
                    </p>

                  </div>
                </div>

              </div>
            </form>

          </div>
        </main>
      )}

    </div>
  );
}
