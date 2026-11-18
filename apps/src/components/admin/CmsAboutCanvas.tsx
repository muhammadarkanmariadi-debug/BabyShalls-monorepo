'use client';

import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { AdminModal } from './AdminModal';
import { MultiImageUploader } from './MultiImageUploader';

interface CmsAboutCanvasProps {
  fields: Record<string, string>;
  setField: (key: string, val: string) => void;
}

export function CmsAboutCanvas({ fields, setField }: CmsAboutCanvasProps) {
  const [editingBlockImg, setEditingBlockImg] = useState<1 | 2 | 3 | null>(null);

  return (
    <div className="border-2 border-[#EBDCCB] rounded-3xl overflow-hidden bg-white shadow-sm text-[#1A1A1A]">
      {/* 1. Pastel Yellow Top Banner */}
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

      {/* 2. Centered Editorial Intro */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-10 text-center space-y-3">
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

      {/* 3. Alternating Zig-Zag Blocks */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 pb-12">
        {([1, 2, 3] as const).map((idx) => {
          const isEven = idx === 2;
          return (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div
                onClick={() => setEditingBlockImg(idx)}
                className={`relative aspect-[4/3.4] w-full overflow-hidden rounded-xl bg-[#F8FAFC] border border-[#EBDCCB] group cursor-pointer ${isEven ? 'md:order-2' : ''
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
          );
        })}
      </section>

      {/* 4. Visit Us */}
      <section className="max-w-xl mx-auto px-4 sm:px-6 py-8 text-center space-y-2 border-t border-[#F3F4F6]">
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

      <AdminModal
        isOpen={editingBlockImg !== null}
        onClose={() => setEditingBlockImg(null)}
        title={`Ganti Foto Blok #${editingBlockImg || 1}`}
        size="md"
      >
        {editingBlockImg && (
          <MultiImageUploader
            images={
              fields[`about_block_${editingBlockImg}_image`]
                ? [fields[`about_block_${editingBlockImg}_image`]]
                : []
            }
            onChange={(imgs) => setField(`about_block_${editingBlockImg}_image`, imgs[0] || '')}
            folder="babyshalls/cms"
            maxImages={1}
            label={`Foto Blok ${editingBlockImg}`}
          />
        )}
      </AdminModal>
    </div>
  );
}

