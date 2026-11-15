'use client';

import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Camera, GripVertical } from 'lucide-react';
import { ABOUT_SECTION_LABELS, AboutSectionId } from '../../hooks/useCms';
import { AdminModal } from './AdminModal';
import { MultiImageUploader } from './MultiImageUploader';

interface CmsAboutCanvasProps {
  fields: Record<string, string>;
  setField: (key: string, val: string) => void;
  aboutOrder: AboutSectionId[];
  setAboutOrder: React.Dispatch<React.SetStateAction<AboutSectionId[]>>;
}

export function CmsAboutCanvas({
  fields,
  setField,
  aboutOrder,
  setAboutOrder,
}: CmsAboutCanvasProps) {
  const [editingBlockImg, setEditingBlockImg] = useState<1 | 2 | 3 | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const moveSection = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= aboutOrder.length || fromIdx === toIdx) return;
    setAboutOrder((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      return next;
    });
  };

  const renderSection = (sectionId: AboutSectionId) => {
    switch (sectionId) {
      case 'banner':
        return (
          <section className="w-full bg-[#FDF0B8] py-7 px-4 border-b border-[#FCE694] text-center">
            <div className="max-w-3xl mx-auto">
              <input
                type="text"
                value={fields.about_banner_title || ''}
                onChange={(e) => setField('about_banner_title', e.target.value)}
                className="w-full text-center text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] bg-white/45 hover:bg-white/80 focus:bg-white rounded-xl px-3 py-1.5 border border-transparent focus:border-[#D9744A] focus:outline-none"
              />
            </div>
          </section>
        );
      case 'intro':
        return (
          <section className="max-w-2xl mx-auto px-4 sm:px-6 py-8 text-center space-y-3">
            <textarea
              rows={3}
              value={fields.about_intro_1 || ''}
              onChange={(e) => setField('about_intro_1', e.target.value)}
              className="w-full text-center text-sm text-[#4A4A4A] leading-relaxed bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-xl p-2 focus:outline-none"
            />
            <textarea
              rows={2}
              value={fields.about_intro_2 || ''}
              onChange={(e) => setField('about_intro_2', e.target.value)}
              className="w-full text-center text-sm text-[#4A4A4A] leading-relaxed bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-xl p-2 focus:outline-none"
            />
          </section>
        );
      case 'block_1':
      case 'block_2':
      case 'block_3': {
        const idx = sectionId === 'block_1' ? 1 : sectionId === 'block_2' ? 2 : 3;
        const isEven = idx === 2;
        return (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div
                onClick={() => setEditingBlockImg(idx)}
                className={`relative aspect-[4/3.4] w-full overflow-hidden rounded-xl bg-[#F8FAFC] border border-[#EBDCCB] group cursor-pointer ${
                  isEven ? 'md:order-2' : ''
                }`}
              >
                <img
                  src={fields[`about_block_${idx}_image`] || '/images/store-boutique.jpg'}
                  alt={fields[`about_block_${idx}_title`] || ''}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 rounded-full bg-white text-[#502E1E] text-xs font-bold inline-flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#D9744A]" /> Ganti Foto Blok {idx}
                  </span>
                </div>
              </div>

              <div className={`space-y-2 text-left ${isEven ? 'md:order-1' : ''}`}>
                <input
                  type="text"
                  value={fields[`about_block_${idx}_title`] || ''}
                  onChange={(e) => setField(`about_block_${idx}_title`, e.target.value)}
                  className="w-full text-lg font-extrabold text-[#1A1A1A] bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-2 py-1 focus:outline-none"
                />
                <textarea
                  rows={3}
                  value={fields[`about_block_${idx}_p1`] || ''}
                  onChange={(e) => setField(`about_block_${idx}_p1`, e.target.value)}
                  className="w-full text-sm text-[#4A4A4A] leading-relaxed bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-2 py-1 focus:outline-none"
                />
                <textarea
                  rows={2}
                  value={fields[`about_block_${idx}_p2`] || ''}
                  onChange={(e) => setField(`about_block_${idx}_p2`, e.target.value)}
                  className="w-full text-sm text-[#4A4A4A] leading-relaxed bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-2 py-1 focus:outline-none"
                />
                {idx === 3 && (
                  <input
                    type="email"
                    value={fields.about_block_3_email || ''}
                    onChange={(e) => setField('about_block_3_email', e.target.value)}
                    className="w-full text-xs font-bold underline bg-[#FCF6EC] border border-[#EBDCCB] rounded-lg px-2.5 py-1.5 focus:outline-none"
                  />
                )}
              </div>
            </div>
          </section>
        );
      }
      case 'visit':
        return (
          <section className="max-w-xl mx-auto px-4 sm:px-6 py-8 text-center space-y-2">
            <input
              type="text"
              value={fields.about_visit_title || ''}
              onChange={(e) => setField('about_visit_title', e.target.value)}
              className="w-full text-center text-lg font-extrabold text-[#1A1A1A] bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-2 py-1 focus:outline-none"
            />
            <input
              type="text"
              value={fields.about_visit_address || ''}
              onChange={(e) => setField('about_visit_address', e.target.value)}
              className="w-full text-center text-xs sm:text-sm text-[#4A4A4A] bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-2 py-1 focus:outline-none"
            />
            <div className="pt-2 space-y-1 text-xs text-[#6B7280]">
              <p className="font-bold text-[#1A1A1A]">Jam Operasional:</p>
              <input
                type="text"
                value={fields.about_hours_weekday || ''}
                onChange={(e) => setField('about_hours_weekday', e.target.value)}
                className="w-full text-center bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-2 py-0.5 focus:outline-none"
              />
              <input
                type="text"
                value={fields.about_hours_weekend || ''}
                onChange={(e) => setField('about_hours_weekend', e.target.value)}
                className="w-full text-center bg-transparent border border-transparent hover:border-[#EBDCCB] focus:border-[#D9744A] rounded-lg px-2 py-0.5 focus:outline-none"
              />
            </div>
          </section>
        );
    }
  };

  return (
    <div className="border-2 border-[#EBDCCB] rounded-3xl overflow-hidden bg-white shadow-sm text-[#1A1A1A] divide-y divide-[#F3F4F6]">
      {aboutOrder.map((sectionId, idx) => (
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
              #{idx + 1} • {ABOUT_SECTION_LABELS[sectionId]}
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
                disabled={idx === aboutOrder.length - 1}
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

      <AdminModal
        isOpen={editingBlockImg !== null}
        onClose={() => setEditingBlockImg(null)}
        title={`Ganti Foto Blok #${editingBlockImg ?? 1}`}
        size="md"
      >
        {editingBlockImg !== null && (
          <MultiImageUploader
            images={fields[`about_block_${editingBlockImg}_image`] ? [fields[`about_block_${editingBlockImg}_image`]] : []}
            onChange={(imgs) =>
              setField(`about_block_${editingBlockImg}_image`, imgs[0] || '/images/store-boutique.jpg')
            }
            folder="babyshalls/cms"
            maxImages={1}
            label={`Foto Blok ${editingBlockImg}`}
          />
        )}
      </AdminModal>
    </div>
  );
}
