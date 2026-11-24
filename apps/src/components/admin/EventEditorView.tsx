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
  const [ageRecommendation, setAgeRecommendation] = useState('3–6 years');
  const [description, setDescription] = useState('');
  const [agenda, setAgenda] = useState<EventAgendaItem[]>([
    { time: '10:00', activity: 'Registration & check-in' },
    { time: '10:15', activity: 'Story time & main activity' },
  ]);
  const [bannerImages, setBannerImages] = useState<string[]>(['/images/event-craft.jpg']);
  const [eventDate, setEventDate] = useState('');
  const [timeString, setTimeString] = useState('10:00 - 12:00 WIB');
  const [location, setLocation] = useState('BabyShalls Boutique, Citraland Puncak Tidar Blok HH-26, Malang');
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
    setLocation(editingEvent.location || 'BabyShalls Boutique Malang');
    setPrice(String(editingEvent.price ?? 0));
    setQuota(String(editingEvent.quota ?? 20));
    setShortCode(editingEvent.shortCode || '');
  }, [editingEvent]);

  const submitEvent = async (asDraft: boolean) => {
    if (!title.trim() || !eventDate) {
      toast.error('Event title and date are required.');
      return;
    }

    const payload: AdminEventPayload = {
      title: title.trim(),
      category,
      speaker: speaker.trim() || null,
      ageRecommendation: ageRecommendation.trim() || null,
      description: description.trim() || `${title.trim()} at BabyShalls Boutique Malang.`,
      bannerImage: bannerImages[0] || '/images/event-craft.jpg',
      eventDate: new Date(`${eventDate}T09:00:00`).toISOString(),
      timeString: timeString.trim() || '10:00 - 12:00 WIB',
      location: location.trim() || 'BabyShalls Boutique Malang',
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
        toast.success(`Event "${payload.title}" updated.`);
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(asDraft ? 'Event saved as draft.' : 'Event published successfully!');
      }
      router.push('/admin');
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to save event.'));
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
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
          <span className="text-[#E6D2C0]">|</span>
          <h1 className="text-lg sm:text-xl font-semibold text-[#4A2A1C]">
            {editingEvent ? 'Edit Event' : 'Create Event'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => submitEvent(true)}
            className="h-9 px-4 rounded-[4px] border border-[#E6D2C0] bg-white hover:bg-[#FFF6EA] text-xs font-semibold text-[#4A2A1C] cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => submitEvent(false)}
            className="h-9 px-5 rounded-[4px] bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Publish'}</span>
          </button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-5">
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-4">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Event Information</h2>
            <div>
              <label className="block font-semibold mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Nature Craft & Sensory Play"
                className="w-full h-10 px-3.5 rounded-[4px] border border-[#E6D2C0]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Category</label>
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
                <label className="block font-semibold mb-1">Participant Age</label>
                <input
                  type="text"
                  value={ageRecommendation}
                  onChange={(e) => setAgeRecommendation(e.target.value)}
                  placeholder="3–6 years"
                  className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Speaker / Facilitator</label>
                <input
                  type="text"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  placeholder="e.g. Kak Rina"
                  className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe workshop activities, materials provided, and benefits for children..."
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
                    placeholder="10:00"
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
                    placeholder="Registration & check-in"
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
              <Plus className="w-3.5 h-3.5" /> Add Agenda
            </button>
          </section>

          {/* Banner */}
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-6">
            <MultiImageUploader
              images={bannerImages}
              onChange={setBannerImages}
              folder="babyshalls/events"
              maxImages={1}
              label="Event Photo / Banner (16:9)"
            />
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-5">
          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-5 space-y-3">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Schedule &amp; Location</h2>
            <div>
              <label className="block font-semibold mb-1">Date *</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Time</label>
              <input
                type="text"
                value={timeString}
                onChange={(e) => setTimeString(e.target.value)}
                placeholder="10:00 - 12:00 WIB"
                className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0]"
              />
            </div>
          </section>

          <section className="bg-white border border-[#E6D2C0] rounded-[6px] p-5 space-y-3">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Tickets &amp; Quota</h2>
            <div>
              <label className="block font-semibold mb-1">Ticket Price (0 = Free)</label>
              <CurrencyInput value={price} onChange={setPrice} placeholder="0" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Maximum Quota</label>
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
                <span>Send email broadcast to opt-in subscribers</span>
              </label>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

