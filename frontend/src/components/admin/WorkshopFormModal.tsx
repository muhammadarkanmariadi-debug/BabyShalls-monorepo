'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Globe, Sparkles, Ticket, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { CurrencyInput } from '../ui/CurrencyInput';
import { MultiImageUploader } from './MultiImageUploader';
import {
  AdminEventDto,
  useCreateAdminEvent,
  useUpdateAdminEvent,
} from '../../hooks/useAdminEvents';
import { extractApiError } from '../../lib/axios';

const WORKSHOP_CATEGORIES = [
  'Storytelling & Art',
  'Sensory & Wooden Play',
  'Parenting & Read-Aloud',
  'Special Weekend',
];

interface WorkshopFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingEvent: AdminEventDto | null;
}

export function WorkshopFormModal({ isOpen, onClose, editingEvent }: WorkshopFormModalProps) {
  const createMutation = useCreateAdminEvent();
  const updateMutation = useUpdateAdminEvent();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Storytelling & Art');
  const [speaker, setSpeaker] = useState('');
  const [ageRecommendation, setAgeRecommendation] = useState('2 - 6 Tahun');
  const [eventDate, setEventDate] = useState('');
  const [timeString, setTimeString] = useState('10:00 - 12:00 WIB');
  const [location, setLocation] = useState('Butik BabyShalls, Jl. Cempaka No. 12, Malang');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('0');
  const [quota, setQuota] = useState('15');
  const [shortCode, setShortCode] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [broadcastEmail, setBroadcastEmail] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (editingEvent) {
      setTitle(editingEvent.title);
      setCategory(editingEvent.category || 'Storytelling & Art');
      setSpeaker(editingEvent.speaker || '');
      setAgeRecommendation(editingEvent.ageRecommendation || '2 - 6 Tahun');
      setEventDate(editingEvent.eventDate ? editingEvent.eventDate.slice(0, 10) : '');
      setTimeString(editingEvent.timeString || '10:00 - 12:00 WIB');
      setLocation(editingEvent.location || 'Butik BabyShalls, Jl. Cempaka No. 12, Malang');
      setIsPaid(editingEvent.price > 0);
      setPrice(String(editingEvent.price || 0));
      setQuota(String(editingEvent.quota || 15));
      setShortCode(editingEvent.shortCode || '');
      setDescription(editingEvent.description || '');
      setImages(editingEvent.bannerImage ? [editingEvent.bannerImage] : []);
      setIsActive(editingEvent.isActive ?? true);
      setBroadcastEmail(false);
    } else {
      setTitle('');
      setCategory('Storytelling & Art');
      setSpeaker('');
      setAgeRecommendation('2 - 6 Tahun');
      setEventDate('');
      setTimeString('10:00 - 12:00 WIB');
      setLocation('Butik BabyShalls, Jl. Cempaka No. 12, Malang');
      setIsPaid(false);
      setPrice('0');
      setQuota('15');
      setShortCode('');
      setDescription('');
      setImages(['/images/event-craft.jpg']);
      setIsActive(true);
      setBroadcastEmail(false);
    }
  }, [editingEvent, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = isPaid ? Math.max(1000, Number(price || 0)) : 0;
    const payload = {
      title: title.trim(),
      category,
      speaker: speaker.trim() || null,
      ageRecommendation: ageRecommendation.trim() || null,
      eventDate,
      timeString: timeString.trim(),
      location: location.trim(),
      price: numericPrice,
      quota: Math.max(1, Number(quota || 15)),
      shortCode: shortCode.trim() || null,
      description: description.trim(),
      bannerImage: images[0] || '/images/event-craft.jpg',
      isActive,
      broadcastEmail: editingEvent ? false : broadcastEmail,
    };

    try {
      if (editingEvent) {
        await updateMutation.mutateAsync({ id: editingEvent.id, data: payload });
        toast.success(`Workshop "${payload.title}" diperbarui.`);
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(`Workshop "${payload.title}" dibuat beserta shortlink & QR!`);
      }
      onClose();
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal menyimpan workshop.'));
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#502E1E]/45 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl h-full bg-[#FFF8EF] shadow-2xl border-l border-[#EBDCCB] flex flex-col text-xs"
      >
        {/* Sticky Top Header */}
        <div className="shrink-0 bg-[#FCF6EC] border-b border-[#EBDCCB] px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-[#502E1E]">
              {editingEvent ? 'Edit Workshop / Event' : 'Buat Workshop / Event Baru'}
            </h3>
            <p className="text-xs text-[#6B3F2A] mt-0.5">
              Editor 2 kolom — mendukung tiket Gratis atau Berbayar (Midtrans), custom shortlink &amp; QR Share.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup editor workshop"
            className="p-2 rounded-xl border border-[#EBDCCB] bg-white text-[#6B3F2A] hover:bg-[#F5E9D9] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable 2-Column Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6" data-lenis-prevent>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Kolom Kiri (~60%): Info Workshop & Banner */}
            <div className="lg:col-span-7 space-y-5">
              <section className="bg-white border border-[#EBDCCB] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#F3E8D8]">
                  <Sparkles className="w-4 h-4 text-[#D9744A]" />
                  <h4 className="text-sm font-extrabold text-[#502E1E]">Informasi Workshop</h4>
                </div>

                <div>
                  <label className="block font-bold text-[#502E1E] mb-1">Judul Workshop *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Little Explorers: Nature Craft & Storytime"
                    className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-[#502E1E] mb-1">Kategori</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                    >
                      {WORKSHOP_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#502E1E] mb-1">Pemateri / Fasilitator</label>
                    <input
                      type="text"
                      value={speaker}
                      onChange={(e) => setSpeaker(e.target.value)}
                      placeholder="Contoh: Kak Maya (Storyteller Malang)"
                      className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#502E1E] mb-1">Deskripsi Workshop *</label>
                  <textarea
                    rows={5}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan aktivitas, perlengkapan yang didapat, dan manfaat untuk anak..."
                    className="w-full p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                  />
                </div>
              </section>

              <section className="bg-white border border-[#EBDCCB] rounded-2xl p-5">
                <MultiImageUploader
                  images={images}
                  onChange={setImages}
                  folder="babyshalls/events"
                  maxImages={1}
                  label="Banner Workshop"
                />
              </section>
            </div>

            {/* Kolom Kanan (~40%): Jadwal, Tiket, Shortlink & Publikasi */}
            <div className="lg:col-span-5 space-y-5">
              <section className="bg-white border border-[#EBDCCB] rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center gap-2 pb-2 border-b border-[#F3E8D8]">
                  <Calendar className="w-4 h-4 text-[#D9744A]" />
                  <h4 className="text-sm font-extrabold text-[#502E1E]">Jadwal, Lokasi &amp; Kuota</h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#502E1E] mb-1">Tanggal *</label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#502E1E] mb-1">Jam Pelaksanaan *</label>
                    <input
                      type="text"
                      required
                      value={timeString}
                      onChange={(e) => setTimeString(e.target.value)}
                      placeholder="10:00 - 12:00 WIB"
                      className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#502E1E] mb-1">Lokasi *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#502E1E] mb-1">Rekomendasi Usia</label>
                    <input
                      type="text"
                      value={ageRecommendation}
                      onChange={(e) => setAgeRecommendation(e.target.value)}
                      placeholder="2 - 6 Tahun"
                      className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#502E1E] mb-1">Kuota Kursi *</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={quota}
                      onChange={(e) => setQuota(e.target.value)}
                      className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#D9744A]"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white border border-[#EBDCCB] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#F3E8D8]">
                  <Ticket className="w-4 h-4 text-[#D9744A]" />
                  <h4 className="text-sm font-extrabold text-[#502E1E]">Tiket &amp; Shortlink Share</h4>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-[#502E1E]">Tipe Tiket Workshop</div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPaid(false);
                        setPrice('0');
                      }}
                      className={`flex-1 h-9 rounded-xl font-bold border cursor-pointer ${
                        !isPaid
                          ? 'bg-[#1E543B] text-white border-[#1E543B]'
                          : 'bg-[#FCF6EC] text-[#502E1E] border-[#EBDCCB]'
                      }`}
                    >
                      Gratis
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPaid(true);
                        if (Number(price) <= 0) setPrice('50000');
                      }}
                      className={`flex-1 h-9 rounded-xl font-bold border cursor-pointer ${
                        isPaid
                          ? 'bg-[#D9744A] text-white border-[#D9744A]'
                          : 'bg-[#FCF6EC] text-[#502E1E] border-[#EBDCCB]'
                      }`}
                    >
                      Berbayar (Midtrans)
                    </button>
                  </div>
                  {isPaid && (
                    <CurrencyInput
                      required
                      value={price}
                      onChange={setPrice}
                      placeholder="50.000"
                    />
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block font-bold text-[#502E1E]">Custom URL Shortlink</label>
                    <button
                      type="button"
                      onClick={() =>
                        setShortCode(
                          title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, '')
                            .slice(0, 32)
                        )
                      }
                      className="text-[11px] font-bold text-[#D9744A] hover:underline cursor-pointer"
                    >
                      Isi dari judul
                    </button>
                  </div>
                  <div className="flex items-center bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl overflow-hidden">
                    <span className="px-2.5 text-[11px] font-mono font-bold text-[#6B3F2A] bg-[#FCF6EC] h-[38px] flex items-center border-r border-[#EBDCCB]">
                      /w/
                    </span>
                    <input
                      type="text"
                      value={shortCode}
                      onChange={(e) =>
                        setShortCode(
                          e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^a-z0-9_-]/g, '')
                        )
                      }
                      placeholder="misal: storytime-malang"
                      className="flex-1 h-[38px] px-3 font-mono text-xs bg-white focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-[#6B3F2A]">
                    Link QR: <span className="font-mono font-bold">/w/{shortCode || 'otomatis-dari-judul'}</span>
                  </p>
                </div>
              </section>

              <section className="bg-white border border-[#EBDCCB] rounded-2xl p-5 space-y-2.5">
                <div className="flex items-center gap-2 pb-2 border-b border-[#F3E8D8]">
                  <Globe className="w-4 h-4 text-[#D9744A]" />
                  <h4 className="text-sm font-extrabold text-[#502E1E]">Publikasi &amp; Notifikasi</h4>
                </div>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FCF6EC]/70 border border-[#EBDCCB] cursor-pointer">
                  <div>
                    <p className="font-bold text-[#502E1E]">Tampilkan di /events</p>
                    <p className="text-[11px] text-[#6B7280]">Buka pendaftaran di halaman publik</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#D9744A]"
                  />
                </label>

                {!editingEvent && (
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#FCF6EC]/70 border border-[#EBDCCB] cursor-pointer">
                    <div>
                      <p className="font-bold text-[#502E1E]">Auto-broadcast Email</p>
                      <p className="text-[11px] text-[#6B7280]">Kirim undangan ke pelanggan saat dibuat</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={broadcastEmail}
                      onChange={(e) => setBroadcastEmail(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#D9744A]"
                    />
                  </label>
                )}
              </section>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="shrink-0 bg-[#FCF6EC] border-t border-[#EBDCCB] px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-[#6B3F2A]">
            {isPaid ? `Tiket Berbayar: Rp ${Number(price || 0).toLocaleString('id-ID')}` : 'Tiket Gratis'} • Kuota:{' '}
            <span className="font-bold">{quota || 0} kursi</span>
          </p>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-[40px] px-5 rounded-xl border border-[#EBDCCB] bg-white font-bold text-[#6B3F2A] hover:bg-[#F5E9D9] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="h-[40px] px-6 rounded-xl bg-[#D9744A] hover:bg-[#c5633b] disabled:opacity-60 text-white font-bold cursor-pointer"
            >
              {isPending ? 'Menyimpan...' : editingEvent ? 'Simpan Perubahan' : 'Buat Workshop'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
