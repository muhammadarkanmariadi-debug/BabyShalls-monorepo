'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AdminEventDto,
  AdminEventPayload,
  EventAgendaItem,
  useCreateAdminEvent,
  useUpdateAdminEvent,
} from '../../hooks/useAdminEvents';
import { extractApiError } from '../../lib/axios';
import { CurrencyInput } from '../ui/CurrencyInput';
import { MultiImageUploader } from './MultiImageUploader';

const EVENT_CATEGORIES = [
  'Storytelling & Art',
  'Sensory Play',
  'Parenting Talk',
  'Wooden Craft',
  'Book Club',
];

interface EventEditorViewProps {
  editingEvent?: AdminEventDto | null;
}

export function EventEditorView({ editingEvent }: EventEditorViewProps) {
  const router = useRouter();
  const createMutation = useCreateAdminEvent();
  const updateMutation = useUpdateAdminEvent();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Storytelling & Art');
  const [speaker, setSpeaker] = useState('');
  const [ageRecommendation, setAgeRecommendation] = useState('3–6 tahun');
  const [description, setDescription] = useState('');
  const [agenda, setAgenda] = useState<EventAgendaItem[]>([
    { time: '10.00', activity: 'Registrasi & check-in' },
    { time: '10.15', activity: 'Story time & aktivitas utama' },
  ]);
  const [bannerImages, setBannerImages] = useState<string[]>(['/images/event-craft.jpg']);
  const [eventDate, setEventDate] = useState('');
  const [timeString, setTimeString] = useState('10:00 - 12:00 WIB');
  const [location, setLocation] = useState('Butik BabyShalls, Citraland Puncak Tidar Blok HH-26, Malang');
  const [price, setPrice] = useState('0');
  const [quota, setQuota] = useState('20');
  const [shortCode, setShortCode] = useState('');
  const [broadcastEmail, setBroadcastEmail] = useState(false);

  useEffect(() => {
    if (!editingEvent) return;
    setTitle(editingEvent.title);
    setCategory(editingEvent.category || 'Storytelling & Art');
    setSpeaker(editingEvent.speaker || '');
    setAgeRecommendation(editingEvent.ageRecommendation || '');
    setDescription(editingEvent.description || '');
    if (Array.isArray(editingEvent.agenda) && editingEvent.agenda.length > 0) {
      setAgenda(editingEvent.agenda);
    }
    setBannerImages(editingEvent.bannerImage ? [editingEvent.bannerImage] : ['/images/event-craft.jpg']);
    setEventDate(editingEvent.eventDate ? new Date(editingEvent.eventDate).toISOString().slice(0, 10) : '');
    setTimeString(editingEvent.timeString || '10:00 - 12:00 WIB');
    setLocation(editingEvent.location || 'Butik BabyShalls Malang');
    setPrice(String(editingEvent.price ?? 0));
    setQuota(String(editingEvent.quota ?? 20));
    setShortCode(editingEvent.shortCode || '');
  }, [editingEvent]);

  const submitEvent = async (asDraft: boolean) => {
    if (!title.trim() || !eventDate) {
      toast.error('Nama event dan tanggal wajib diisi.');
      return;
    }

    const payload: AdminEventPayload = {
      title: title.trim(),
      category,
      speaker: speaker.trim() || null,
      ageRecommendation: ageRecommendation.trim() || null,
      description: description.trim() || `${title.trim()} di Butik BabyShalls Malang.`,
      bannerImage: bannerImages[0] || '/images/event-craft.jpg',
      eventDate: new Date(`${eventDate}T09:00:00`).toISOString(),
      timeString: timeString.trim() || '10:00 - 12:00 WIB',
      location: location.trim() || 'Butik BabyShalls Malang',
      price: Math.max(0, Number(price) || 0),
      quota: Math.max(1, Number(quota) || 20),
      agenda: agenda.filter((a) => a.time.trim() && a.activity.trim()),
      isDraft: asDraft,
      isActive: !asDraft,
      shortCode: shortCode.trim() || null,
      broadcastEmail: !asDraft && broadcastEmail,
    };

    try {
      if (editingEvent) {
        await updateMutation.mutateAsync({ id: editingEvent.id, data: payload });
        toast.success(`Event "${payload.title}" diperbarui.`);
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(asDraft ? 'Event disimpan sebagai draft.' : 'Event berhasil dipublikasikan!');
      }
      router.push('/admin');
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal menyimpan event.'));
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#4A2A1C] font-sans">
      <header className="h-[68px] bg-white border-b border-[#E6D2C0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A5644] hover:text-[#B05A26]"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Event
          </Link>
          <span className="text-[#E6D2C0]">|</span>
          <h1 className="text-lg sm:text-xl font-semibold text-[#4A2A1C]">
            {editingEvent ? 'Ubah Event' : 'Buat Event'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => submitEvent(true)}
            className="h-9 px-4 rounded-[4px] border border-[#E6D2C0] bg-white hover:bg-[#FFF6EA] text-xs font-semibold text-[#4A2A1C] cursor-pointer"
          >
            Simpan Draft
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => submitEvent(false)}
            className="h-9 px-5 rounded-[4px] bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Menyimpan...' : 'Publikasikan'}</span>
          </button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-5">
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-4">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Info Event</h2>
            <div>
              <label className="block font-semibold mb-1">Nama Event *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Nature Craft & Sensory Play"
                className="w-full h-10 px-3.5 rounded-[4px] border border-[#E6D2C0]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Jenis</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
                >
                  {EVENT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Usia Peserta</label>
                <input
                  type="text"
                  value={ageRecommendation}
                  onChange={(e) => setAgeRecommendation(e.target.value)}
                  placeholder="3–6 tahun"
                  className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Pemateri / Fasilitator</label>
                <input
                  type="text"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  placeholder="Kak Rina"
                  className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Deskripsi</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan aktivitas workshop, perlengkapan yang didapat, dan manfaat untuk anak..."
                className="w-full p-3.5 rounded-[4px] border border-[#E6D2C0]"
              />
            </div>
          </section>

          {/* Agenda */}
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-4">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Agenda</h2>
            <div className="space-y-2.5">
              {agenda.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={item.time}
                    onChange={(e) =>
                      setAgenda((prev) =>
                        prev.map((a, i) => (i === idx ? { ...a, time: e.target.value } : a))
                      )
                    }
                    placeholder="10.00"
                    className="col-span-3 h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
                  />
                  <input
                    type="text"
                    value={item.activity}
                    onChange={(e) =>
                      setAgenda((prev) =>
                        prev.map((a, i) => (i === idx ? { ...a, activity: e.target.value } : a))
                      )
                    }
                    placeholder="Registrasi & check-in"
                    className="col-span-8 h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
                  />
                  <button
                    type="button"
                    onClick={() => setAgenda((prev) => prev.filter((_, i) => i !== idx))}
                    className="col-span-1 p-2 text-red-600 hover:bg-red-50 rounded-[4px] cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setAgenda((prev) => [...prev, { time: '', activity: '' }])}
              className="h-9 px-3.5 rounded-[4px] border border-[#E6D2C0] font-semibold text-[#4A2A1C] hover:bg-[#FFF6EA] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Agenda
            </button>
          </section>

          {/* Banner */}
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-6">
            <MultiImageUploader
              images={bannerImages}
              onChange={setBannerImages}
              folder="babyshalls/events"
              maxImages={1}
              label="Foto / Banner Event (16:9)"
            />
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-5">
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-5 space-y-3">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Jadwal &amp; Lokasi</h2>
            <div>
              <label className="block font-semibold mb-1">Tanggal *</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Waktu</label>
              <input
                type="text"
                value={timeString}
                onChange={(e) => setTimeString(e.target.value)}
                placeholder="10:00 - 12:00 WIB"
                className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Lokasi</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
              />
            </div>
          </section>

          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-5 space-y-3">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Tiket &amp; Kuota</h2>
            <div>
              <label className="block font-semibold mb-1">Harga Tiket (0 = Gratis)</label>
              <CurrencyInput value={price} onChange={setPrice} placeholder="0" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Kuota Maksimal</label>
              <input
                type="number"
                min={1}
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Custom Shortlink (/w/...)</label>
              <input
                type="text"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value.replace(/[^A-Za-z0-9_-]/g, ''))}
                placeholder="nature-craft-des"
                className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0] font-mono"
              />
            </div>
            {!editingEvent && (
              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={broadcastEmail}
                  onChange={(e) => setBroadcastEmail(e.target.checked)}
                />
                <span>Kirim email broadcast ke pelanggan opt-in</span>
              </label>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

