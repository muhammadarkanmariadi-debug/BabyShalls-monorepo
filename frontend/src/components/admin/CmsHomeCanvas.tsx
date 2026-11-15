'use client';

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Camera,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Link2,
  Plus,
  Star,
  Trash2,
  Zap,
} from 'lucide-react';
import { HeroSlideCms, HOME_SECTION_LABELS, HomeSectionId } from '../../hooks/useCms';
import { AdminModal } from './AdminModal';
import { MultiImageUploader } from './MultiImageUploader';

interface CmsHomeCanvasProps {
  fields: Record<string, string>;
  setField: (key: string, val: string) => void;
  heroSlides: HeroSlideCms[];
  setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlideCms[]>>;
  homeOrder: HomeSectionId[];
  setHomeOrder: React.Dispatch<React.SetStateAction<HomeSectionId[]>>;
}

export function CmsHomeCanvas({
  fields,
  setField,
  heroSlides,
  setHeroSlides,
  homeOrder,
  setHomeOrder,
}: CmsHomeCanvasProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [editingSlideMedia, setEditingSlideMedia] = useState<number | null>(null);
  const [editingHampersImg, setEditingHampersImg] = useState(false);
  const [editingWaUrl, setEditingWaUrl] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const safeIdx = activeIdx >= heroSlides.length ? 0 : activeIdx;
  const slide = heroSlides[safeIdx] || heroSlides[0];

  const updateSlide = (idx: number, patch: Partial<HeroSlideCms>) => {
    setHeroSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const moveSection = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= homeOrder.length || fromIdx === toIdx) return;
    setHomeOrder((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      return next;
    });
  };

  const renderSection = (sectionId: HomeSectionId) => {
    switch (sectionId) {
      case 'hero':
        return (
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
                      className="p-1.5 rounded-xl bg-[#FDECE6] text-[#B91C1C] cursor-pointer"
                      title="Hapus slide ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-[#FAF4E8] border border-[#E2E8F0] h-[320px] sm:h-[360px]">
                <img
                  src={slide?.image || '/hero-child-reading.jpg'}
                  alt={slide?.imageAlt || ''}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />

                <div className="relative z-10 h-full flex items-center px-6 sm:px-10">
                  <div className="w-full max-w-[390px] bg-white/95 backdrop-blur-sm border border-[#E5E7EB] rounded-2xl p-5 space-y-2.5 shadow-sm">
                    <input
                      type="text"
                      value={slide?.badge || ''}
                      onChange={(e) => updateSlide(safeIdx, { badge: e.target.value })}
                      className="w-full px-2.5 py-1 rounded-full bg-[#FDF0B8] text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] border border-transparent focus:border-[#D9744A] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={slide?.title || ''}
                      onChange={(e) => updateSlide(safeIdx, { title: e.target.value })}
                      className="w-full text-lg sm:text-xl font-extrabold text-[#1A1A1A] bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-1.5 py-0.5 focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      value={slide?.subtitle || ''}
                      onChange={(e) => updateSlide(safeIdx, { subtitle: e.target.value })}
                      className="w-full text-xs text-[#4A4A4A] leading-relaxed bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-1.5 py-0.5 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={slide?.ctaLabel || ''}
                      onChange={(e) => updateSlide(safeIdx, { ctaLabel: e.target.value })}
                      className="inline-flex h-[36px] px-4 rounded-full bg-[#1E543B] text-white text-xs font-bold border border-transparent focus:border-[#FDF0B8] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveIdx((p) => (p - 1 + heroSlides.length) % heroSlides.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 border border-[#E2E8F0] flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIdx((p) => (p + 1) % heroSlides.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 border border-[#E2E8F0] flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {heroSlides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`px-3 py-1.5 rounded-full text-xs border cursor-pointer ${
                      idx === safeIdx
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
        );

      case 'shop_by_age':
        return (
          <section className="w-full bg-white py-8 px-4 sm:px-8 border-b border-[#E2E8F0]">
            <div className="max-w-5xl mx-auto space-y-4">
              <input
                type="text"
                value={fields.home_shop_age_title || ''}
                onChange={(e) => setField('home_shop_age_title', e.target.value)}
                className="text-xl font-bold text-[#1A1A1A] bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-2 py-1 focus:outline-none"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { meta: '0–1 TAHUN', title: 'Newborn+', bg: 'bg-[#FAF4E8]' },
                  { meta: '1–3 TAHUN', title: 'Ages 1–3', bg: 'bg-[#FDECE6]' },
                  { meta: '3–5 TAHUN', title: 'Ages 3+', bg: 'bg-[#E9F3E4]' },
                  { meta: '6+ TAHUN', title: 'Ages 6+', bg: 'bg-[#EBF1FA]' },
                ].map((g) => (
                  <div key={g.title} className={`${g.bg} rounded-lg border border-[#E2E8F0] p-3.5`}>
                    <div className="text-[10px] font-bold text-[#555555]">{g.meta}</div>
                    <div className="font-bold text-[#1A1A1A] text-sm">{g.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'voucher_promo':
        return (
          <section className="w-full bg-white py-8 px-4 sm:px-8 border-b border-[#E2E8F0]">
            <div className="max-w-5xl mx-auto rounded-2xl bg-[#FAF4E8] border border-[#E5E7EB] p-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 fill-[#FCE694] text-[#1A1A1A]" />
                <input
                  type="text"
                  value={fields.home_flash_sale_title || ''}
                  onChange={(e) => setField('home_flash_sale_title', e.target.value)}
                  className="text-base font-extrabold text-[#1A1A1A] bg-white/60 hover:bg-white focus:bg-white border border-transparent focus:border-[#D9744A] rounded-lg px-2 py-1 focus:outline-none"
                />
              </div>
              <input
                type="text"
                value={fields.home_flash_sale_cta || ''}
                onChange={(e) => setField('home_flash_sale_cta', e.target.value)}
                className="text-xs font-bold text-[#1E543B] bg-white/60 hover:bg-white focus:bg-white border border-transparent focus:border-[#D9744A] rounded-lg px-2.5 py-1 text-right focus:outline-none"
              />
            </div>
          </section>
        );

      case 'new_arrivals':
        return (
          <section className="w-full bg-white py-8 px-4 sm:px-8 border-b border-[#E2E8F0]">
            <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={fields.home_new_tab_new || ''}
                  onChange={(e) => setField('home_new_tab_new', e.target.value)}
                  className="px-4 py-1.5 rounded-full bg-[#1A1A1A] text-white text-xs font-bold w-28 text-center focus:outline-none"
                />
                <input
                  type="text"
                  value={fields.home_new_tab_bestseller || ''}
                  onChange={(e) => setField('home_new_tab_bestseller', e.target.value)}
                  className="px-4 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#4A4A4A] text-xs font-bold w-36 text-center focus:outline-none focus:border-[#D9744A]"
                />
                <input
                  type="text"
                  value={fields.home_new_tab_preloved || ''}
                  onChange={(e) => setField('home_new_tab_preloved', e.target.value)}
                  className="px-4 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#4A4A4A] text-xs font-bold w-36 text-center focus:outline-none focus:border-[#D9744A]"
                />
              </div>
              <input
                type="text"
                value={fields.home_new_cta || ''}
                onChange={(e) => setField('home_new_cta', e.target.value)}
                className="text-xs font-semibold text-[#1A1A1A] underline bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-2 py-1 text-right focus:outline-none"
              />
            </div>
          </section>
        );

      case 'hampers':
        return (
          <section className="py-10 px-4 sm:px-8 bg-white border-b border-[#E2E8F0]">
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
        );

      case 'events':
        return (
          <section className="w-full bg-white py-8 px-4 sm:px-8 border-b border-[#E2E8F0]">
            <div className="max-w-5xl mx-auto flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-[240px]">
                <input
                  type="text"
                  value={fields.home_events_badge || ''}
                  onChange={(e) => setField('home_events_badge', e.target.value)}
                  className="text-xs font-bold uppercase tracking-wider text-[#1E543B] bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-2 py-0.5 focus:outline-none"
                />
                <input
                  type="text"
                  value={fields.home_events_title || ''}
                  onChange={(e) => setField('home_events_title', e.target.value)}
                  className="w-full text-2xl font-extrabold text-[#1A1A1A] bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-2 py-0.5 focus:outline-none"
                />
              </div>
              <input
                type="text"
                value={fields.home_events_cta || ''}
                onChange={(e) => setField('home_events_cta', e.target.value)}
                className="text-xs font-bold text-[#1A1A1A] bg-[#FCF6EC] border border-[#EBDCCB] rounded-lg px-3 py-1.5 text-right focus:outline-none focus:border-[#D9744A]"
              />
            </div>
          </section>
        );

      case 'reviews':
        return (
          <section className="w-full bg-white py-8 px-4 sm:px-8">
            <div className="max-w-5xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                <input
                  type="text"
                  value={fields.home_reviews_badge || ''}
                  onChange={(e) => setField('home_reviews_badge', e.target.value)}
                  className="text-xs font-bold text-[#1E543B] bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-2 py-0.5 w-64 focus:outline-none"
                />
              </div>
              <input
                type="text"
                value={fields.home_reviews_title || ''}
                onChange={(e) => setField('home_reviews_title', e.target.value)}
                className="w-full text-2xl font-extrabold text-[#1A1A1A] bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-2 py-0.5 focus:outline-none"
              />
            </div>
          </section>
        );
    }
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

      {/* 2. Reorderable Full-Page Home Sections */}
      {homeOrder.map((sectionId, idx) => (
        <div
          key={sectionId}
          draggable
          onDragStart={() => setDragIdx(idx)}
          onDragOver={(e) => {
            e.preventDefault();
            if (overIdx !== idx) setOverIdx(idx);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragIdx !== null) moveSection(dragIdx, idx);
            setDragIdx(null);
            setOverIdx(null);
          }}
          onDragEnd={() => {
            setDragIdx(null);
            setOverIdx(null);
          }}
          className={`relative transition-all ${
            overIdx === idx && dragIdx !== idx ? 'ring-2 ring-[#D9744A] bg-[#FCF6EC]/40' : ''
          }`}
        >
          <div className="bg-[#FCF6EC]/80 border-b border-[#EBDCCB] px-4 py-2 flex items-center justify-between text-[11px]">
            <span className="inline-flex items-center gap-1.5 font-bold text-[#6B3F2A] cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4 text-[#9A7B68]" />
              #{idx + 1} • {HOME_SECTION_LABELS[sectionId]}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => moveSection(idx, idx - 1)}
                title="Pindah ke atas"
                className="p-1 rounded-lg bg-white border border-[#EBDCCB] disabled:opacity-40 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5 text-[#502E1E]" />
              </button>
              <button
                type="button"
                disabled={idx === homeOrder.length - 1}
                onClick={() => moveSection(idx, idx + 1)}
                title="Pindah ke bawah"
                className="p-1 rounded-lg bg-white border border-[#EBDCCB] disabled:opacity-40 cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5 text-[#502E1E]" />
              </button>
            </div>
          </div>
          {renderSection(sectionId)}
        </div>
      ))}

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
