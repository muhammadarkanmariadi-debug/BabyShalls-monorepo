'use client';

import React, { useState } from 'react';
import { ArrowDown, ArrowUp, GripVertical, HelpCircle, Plus, Trash2 } from 'lucide-react';
import { FaqItemCms } from '../../hooks/useCms';

interface CmsFaqCanvasProps {
  fields: Record<string, string>;
  setField: (key: string, val: string) => void;
  faqItems: FaqItemCms[];
  setFaqItems: React.Dispatch<React.SetStateAction<FaqItemCms[]>>;
}

export function CmsFaqCanvas({
  fields,
  setField,
  faqItems,
  setFaqItems,
}: CmsFaqCanvasProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const moveFaq = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= faqItems.length || fromIdx === toIdx) return;
    setFaqItems((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      return next;
    });
  };

  const updateFaq = (idx: number, patch: Partial<FaqItemCms>) => {
    setFaqItems((prev) => prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
  };

  const addFaq = () => {
    setFaqItems((prev) => [
      ...prev,
      {
        id: `faq-${Date.now()}`,
        q: 'Pertanyaan baru...',
        a: 'Tulis jawaban lengkap di sini...',
      },
    ]);
  };

  const removeFaq = (idx: number) => {
    if (faqItems.length <= 1) return;
    setFaqItems((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="border-2 border-[#EBDCCB] rounded-3xl overflow-hidden bg-white shadow-sm p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F3F4F6]">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B3F2A]">
          <HelpCircle className="w-4 h-4 text-[#D9744A]" />
          <span>Direct Edit: Halaman FAQ ({faqItems.length} Poin • Drag untuk mengurutkan)</span>
        </div>
        <button
          type="button"
          onClick={addFaq}
          className="px-3.5 py-2 rounded-xl bg-[#E9F3E4] hover:bg-[#D7EAD0] text-[#1E543B] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Poin FAQ
        </button>
      </div>

      {/* Header FAQ */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <input
          type="text"
          value={fields.faq_page_title || ''}
          onChange={(e) => setField('faq_page_title', e.target.value)}
          className="w-full text-center text-2xl font-extrabold text-[#1A1A1A] bg-[#FCF6EC]/60 hover:bg-[#FCF6EC] focus:bg-white border border-transparent focus:border-[#D9744A] rounded-xl px-3 py-1.5 focus:outline-none"
        />
        <input
          type="text"
          value={fields.faq_page_subtitle || ''}
          onChange={(e) => setField('faq_page_subtitle', e.target.value)}
          className="w-full text-center text-xs text-[#6B7280] bg-[#FCF6EC]/60 hover:bg-[#FCF6EC] focus:bg-white border border-transparent focus:border-[#D9744A] rounded-xl px-3 py-1.5 focus:outline-none"
        />
      </div>

      {/* Daftar Poin FAQ (Draggable) */}
      <div className="max-w-3xl mx-auto space-y-3">
        {faqItems.map((item, idx) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e) => {
              e.preventDefault();
              if (overIdx !== idx) setOverIdx(idx);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIdx !== null) moveFaq(dragIdx, idx);
              setDragIdx(null);
              setOverIdx(null);
            }}
            onDragEnd={() => {
              setDragIdx(null);
              setOverIdx(null);
            }}
            className={`border rounded-2xl p-4 space-y-2.5 transition-all ${overIdx === idx && dragIdx !== idx
                ? 'border-[#D9744A] ring-2 ring-[#D9744A]/40 bg-[#FCF6EC]'
                : 'border-[#EBDCCB] bg-[#FCF6EC]/40'
              }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#6B3F2A] cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4 text-[#9A7B68]" />
                Poin FAQ #{idx + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveFaq(idx, idx - 1)}
                  title="Geser ke atas"
                  className="p-1.5 rounded-lg bg-white border border-[#EBDCCB] disabled:opacity-40 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-[#502E1E]" />
                </button>
                <button
                  type="button"
                  disabled={idx === faqItems.length - 1}
                  onClick={() => moveFaq(idx, idx + 1)}
                  title="Geser ke bawah"
                  className="p-1.5 rounded-lg bg-white border border-[#EBDCCB] disabled:opacity-40 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-[#502E1E]" />
                </button>
                {faqItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFaq(idx)}
                    title="Hapus poin FAQ"
                    className="p-1.5 rounded-lg bg-[#FDECE6] text-[#B91C1C] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <input
              type="text"
              value={item.q}
              onChange={(e) => updateFaq(idx, { q: e.target.value })}
              placeholder="Pertanyaan..."
              className="w-full px-3 py-2 text-sm font-bold text-[#1A1A1A] bg-white border border-[#EBDCCB] rounded-xl focus:outline-none focus:border-[#D9744A]"
            />
            <textarea
              rows={2}
              value={item.a}
              onChange={(e) => updateFaq(idx, { a: e.target.value })}
              placeholder="Jawaban..."
              className="w-full px-3 py-2 text-xs text-[#4A4A4A] leading-relaxed bg-white border border-[#EBDCCB] rounded-xl focus:outline-none focus:border-[#D9744A]"
            />
          </div>
        ))}
      </div>

      {/* Teks CTA WhatsApp di Halaman FAQ */}
      <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-[#E9F3E4] border border-[#D4E6CA] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-bold text-[#1E543B] mb-1">Judul CTA WhatsApp</label>
          <input
            type="text"
            value={fields.faq_wa_title || ''}
            onChange={(e) => setField('faq_wa_title', e.target.value)}
            className="w-full h-9 px-2.5 bg-white border border-[#D4E6CA] rounded-lg"
          />
        </div>
        <div>
          <label className="block font-bold text-[#1E543B] mb-1">Subjudul CTA WhatsApp</label>
          <input
            type="text"
            value={fields.faq_wa_subtitle || ''}
            onChange={(e) => setField('faq_wa_subtitle', e.target.value)}
            className="w-full h-9 px-2.5 bg-white border border-[#D4E6CA] rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

