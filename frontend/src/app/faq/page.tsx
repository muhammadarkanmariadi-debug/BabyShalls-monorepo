'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search } from 'lucide-react';
import { DEFAULT_CMS_VALUES, parseFaqItems, usePublicCms } from '../../hooks/useCms';

export default function FAQPage() {
  const { data: cms } = usePublicCms();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [query, setQuery] = useState('');

  const faqs = parseFaqItems(cms?.faq_items_json);
  const pageTitle = cms?.faq_page_title || DEFAULT_CMS_VALUES.faq_page_title;
  const pageSubtitle = cms?.faq_page_subtitle || DEFAULT_CMS_VALUES.faq_page_subtitle;
  const waTitle = cms?.faq_wa_title || DEFAULT_CMS_VALUES.faq_wa_title;
  const waSubtitle = cms?.faq_wa_subtitle || DEFAULT_CMS_VALUES.faq_wa_subtitle;
  const waUrl = cms?.faq_wa_url || DEFAULT_CMS_VALUES.faq_wa_url;

  const filtered = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(query.toLowerCase()) ||
      item.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-sm text-[#6B7280]">{pageSubtitle}</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari pertanyaan..."
            className="w-full h-[46px] pl-11 pr-4 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.id || item.q}
                className="border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full min-h-[56px] px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#1A1A1A] hover:bg-[#F8FAFC]"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-[#4A4A4A] leading-relaxed border-t border-[#F3F4F6] pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-[#6B7280] py-8">
              Tidak ada pertanyaan yang cocok dengan pencarian Anda.
            </p>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-[#E9F3E4] border border-[#D4E6CA] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-extrabold text-[#1A1A1A]">{waTitle}</h2>
            <p className="text-xs text-[#4A4A4A]">{waSubtitle}</p>
          </div>
          <Link
            href={waUrl}
            target="_blank"
            className="min-h-[44px] inline-flex items-center px-6 rounded-full bg-[#25D366] text-white text-xs font-bold"
          >
            Chat WhatsApp CS
          </Link>
        </div>
      </div>
    </div>
  );
}
