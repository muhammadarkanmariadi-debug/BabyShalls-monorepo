'use client';

import React, { useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, Link2, Plus, Trash2 } from 'lucide-react';
import { HeroSlideCms } from '../../hooks/useCms';
import { AdminModal } from './AdminModal';
import { MultiImageUploader } from './MultiImageUploader';

interface CmsHomeCanvasProps {
  fields: Record<string, string>;
  setField: (key: string, val: string) => void;
  heroSlides: HeroSlideCms[];
  setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlideCms[]>>;
}

export function CmsHomeCanvas({
  fields,
  setField,
  heroSlides,
  setHeroSlides,
}: CmsHomeCanvasProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [editingSlideMedia, setEditingSlideMedia] = useState<number | null>(null);
  const [editingHampersImg, setEditingHampersImg] = useState(false);
  const [editingWaUrl, setEditingWaUrl] = useState(false);

  const safeIdx = activeIdx >= heroSlides.length ? 0 : activeIdx;
  const slide = heroSlides[safeIdx] || heroSlides[0];

  const updateSlide = (idx: number, patch: Partial<HeroSlideCms>) => {
    setHeroSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  return (
    <div className="border-2 border-[#EBDCCB] rounded-3xl overflow-hidden bg-white shadow-sm">
      {/* 1. Simulated Announcement Bar */}
      <div className="w-full bg-[#FDF0B8] border-b border-[#F3DF90] text-[#1A1A1A] py-2 px-4 text-xs font-medium">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2">
          <input
            type="text"
            value={fields.announcement_text_1 || ''}
            onChange={(e) => setField('announcement_text_1', e.target.value)}
            aria-label="Teks pengumuman 1"
            className="bg-white/60 hover:bg-white focus:bg-white px-2.5 py-1 rounded-lg border border-transparent focus:border-[#D9744A] text-center min-w-[210px] focus:outline-none"
          />
          <span className="text-[#1A1A1A]/40">•</span>
          <input
            type="text"
            value={fields.announcement_text_2 || ''}
            onChange={(e) => setField('announcement_text_2', e.target.value)}
            aria-label="Teks pengumuman 2"
            className="bg-white/60 hover:bg-white focus:bg-white px-2.5 py-1 rounded-lg border border-transparent focus:border-[#D9744A] text-center min-w-[230px] focus:outline-none"
          />
          <span className="text-[#1A1A1A]/40">•</span>
          <div className="inline-flex items-center gap-1">
            <input
              type="text"
              value={fields.announcement_wa_label || ''}
              onChange={(e) => setField('announcement_wa_label', e.target.value)}
              aria-label="Label WA"
              className="bg-white/60 hover:bg-white focus:bg-white px-2 py-1 rounded-lg border border-transparent focus:border-[#D9744A] font-semibold underline w-28 text-center focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setEditingWaUrl(true)}
              title="Ubah URL WhatsApp"
              className="p-1 rounded-lg bg-white/80 hover:bg-white border border-[#EBDCCB] cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5 text-[#502E1E]" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Simulated Hero Carousel */}
      <section className="w-full bg-white py-8 px-4 sm:px-8 border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B3F2A]">
              Direct Edit: Hero Carousel (Slide {safeIdx + 1}/{heroSlides.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingSlideMedia(safeIdx)}
                className="px-3 py-1.5 rounded-xl bg-[#FCF6EC] border border-[#EBDCCB] text-xs font-bold text-[#502E1E] inline-flex items-center gap-1.5 hover:bg-[#F5E9D9] cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-[#D9744A]" /> Ganti Foto &amp; Link Slide
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextIdx = heroSlides.length;
                  setHeroSlides((prev) => [
                    ...prev,
                    {
                      id: Date.now(),
                      badge: 'PROMO BARU',
                      label: `0${prev.length + 1} Promo Baru`,
                      title: 'Judul Promo Baru',
                      subtitle: 'Klik teks ini untuk mengedit deskripsi promo...',
                      ctaLabel: 'Lihat Katalog →',
                      ctaHref: '/catalog',
                      image: '/hero-child-reading.jpg',
                      imageAlt: 'Promo BabyShalls',
                    },
                  ]);
                  setActiveIdx(nextIdx);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#E9F3E4] text-[#1E543B] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Slide
              </button>
              {heroSlides.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setHeroSlides((prev) => prev.filter((_, i) => i !== safeIdx));
                    setActiveIdx(0);
                  }}
                  className="p-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                  title="Hapus Slide Ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="relative w-full h-[320px] sm:h-[360px] rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F7F7F5]">
            <img src={slide.image} alt={slide.imageAlt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent pointer-events-none" />

            {/* Floating Editable Promo Card */}
            <div className="absolute inset-x-3 bottom-3 sm:inset-auto sm:left-14 sm:top-1/2 sm:-translate-y-1/2 sm:w-[420px] bg-white/95 backdrop-blur-sm rounded-xl p-5 border border-[#E2E8F0] shadow-lg space-y-2">
              <input
                type="text"
                value={slide.badge}
                onChange={(e) => updateSlide(safeIdx, { badge: e.target.value })}
                className="w-full px-2.5 py-1 rounded bg-[#FDF0B8] text-[#1A1A1A] text-[10px] font-bold tracking-wider border border-transparent focus:border-[#D9744A] focus:outline-none"
              />
              <input
                type="text"
                value={slide.title}
                onChange={(e) => updateSlide(safeIdx, { title: e.target.value })}
                className="w-full text-lg font-bold text-[#1A1A1A] bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-1.5 py-0.5 focus:outline-none"
              />
              <textarea
                rows={2}
                value={slide.subtitle}
                onChange={(e) => updateSlide(safeIdx, { subtitle: e.target.value })}
                className="w-full text-xs text-[#334155] leading-relaxed bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-1.5 py-1 focus:outline-none resize-none"
              />
              <input
                type="text"
                value={slide.ctaLabel}
                onChange={(e) => updateSlide(safeIdx, { ctaLabel: e.target.value })}
                className="inline-block px-4 py-2 rounded-full bg-[#1E543B] text-white text-xs font-bold w-44 text-center focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setActiveIdx((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-[#E2E8F0] items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIdx((prev) => (prev + 1) % heroSlides.length)}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-[#E2E8F0] items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {heroSlides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`px-3 py-1.5 rounded-full text-xs border cursor-pointer ${idx === safeIdx
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold'
                    : 'bg-[#FCF6EC] text-[#502E1E] border-[#EBDCCB]'
                  }`}
              >
                {s.label || `Slide ${idx + 1}`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Simulated Gift Hampers Section */}
      <section className="py-10 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[52%_48%] gap-6 items-center">
          <div className="space-y-3 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B3F2A]">
              Direct Edit: Section Gift Hampers
            </span>
            <input
              type="text"
              value={fields.hampers_title || ''}
              onChange={(e) => setField('hampers_title', e.target.value)}
              className="w-full text-3xl font-extrabold text-[#1A1A1A] bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-xl px-2 py-1 focus:outline-none"
            />
            <textarea
              rows={3}
              value={fields.hampers_description || ''}
              onChange={(e) => setField('hampers_description', e.target.value)}
              className="w-full text-sm text-[#4A4A4A] leading-relaxed bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-xl px-2 py-1.5 focus:outline-none"
            />
          </div>

          <div
            onClick={() => setEditingHampersImg(true)}
            className="relative h-64 rounded-3xl overflow-hidden border border-[#EBDCCB] group cursor-pointer"
          >
            <img
              src={fields.hampers_image || '/images/hampers-gift.jpg'}
              alt="Gift Hampers"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="px-4 py-2 rounded-full bg-white text-[#502E1E] text-xs font-bold inline-flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#D9744A]" /> Klik untuk Ganti Foto Hampers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Modals for Media / Links */}
      <AdminModal
        isOpen={editingSlideMedia !== null}
        onClose={() => setEditingSlideMedia(null)}
        title={`Pengaturan Media & Link Slide #${(editingSlideMedia ?? 0) + 1}`}
        size="md"
      >
        {editingSlideMedia !== null && heroSlides[editingSlideMedia] && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">Label Tab Navigasi</label>
              <input
                type="text"
                value={heroSlides[editingSlideMedia].label}
                onChange={(e) => updateSlide(editingSlideMedia, { label: e.target.value })}
                className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">URL Tujuan Tombol CTA</label>
              <input
                type="text"
                value={heroSlides[editingSlideMedia].ctaHref}
                onChange={(e) => updateSlide(editingSlideMedia, { ctaHref: e.target.value })}
                className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              />
            </div>
            <MultiImageUploader
              images={heroSlides[editingSlideMedia].image ? [heroSlides[editingSlideMedia].image] : []}
              onChange={(imgs) =>
                updateSlide(editingSlideMedia, { image: imgs[0] || '/hero-child-reading.jpg' })
              }
              folder="babyshalls/cms"
              maxImages={1}
              label="Foto Banner Slide"
            />
          </div>
        )}
      </AdminModal>

      <AdminModal
        isOpen={editingHampersImg}
        onClose={() => setEditingHampersImg(false)}
        title="Ganti Foto Banner Gift Hampers"
        size="md"
      >
        <MultiImageUploader
          images={fields.hampers_image ? [fields.hampers_image] : []}
          onChange={(imgs) => setField('hampers_image', imgs[0] || '/images/hampers-gift.jpg')}
          folder="babyshalls/cms"
          maxImages={1}
          label="Foto Gift Hampers"
        />
      </AdminModal>

      <AdminModal
        isOpen={editingWaUrl}
        onClose={() => setEditingWaUrl(false)}
        title="URL WhatsApp Announcement Bar"
        size="md"
      >
        <div className="space-y-2 text-xs">
          <label className="block font-bold text-[#502E1E]">Link WhatsApp CS</label>
          <input
            type="text"
            value={fields.announcement_wa_url || ''}
            onChange={(e) => setField('announcement_wa_url', e.target.value)}
            className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
          />
        </div>
      </AdminModal>
    </div>
  );
}

