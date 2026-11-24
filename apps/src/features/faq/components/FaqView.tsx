'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Search } from 'lucide-react';
import { TombolKembali } from '@/components/common/TombolKembali';
import { CampaignBanner } from '@/components/home/CampaignBanner';
import { useCms, CmsFaqItem } from '@/context/CmsContext';

export function FaqView() {
  const { cms } = useCms();
  const faqItems: CmsFaqItem[] = (cms.faq || []).filter((item: CmsFaqItem) => item.isActive !== false);
  const store = cms.store;

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const set = new Set<string>();
    faqItems.forEach((item: CmsFaqItem) => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, [faqItems]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (!hash) return;
    const matched = categories.find((c) => c.toLowerCase().includes(hash));
    if (matched) {
      setSelectedCategory(matched);
      setOpenIndex(0);
    }
  }, [categories]);

  const filteredFaqs = useMemo(() => {
    return faqItems.filter((item: CmsFaqItem) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchQ = item.question.toLowerCase().includes(q);
        const matchA = item.answer.toLowerCase().includes(q);
        return matchQ || matchA;
      }
      return true;
    });
  }, [faqItems, selectedCategory, searchQuery]);

  const waSupportUrl = `https://wa.me/${store.whatsappNumber || '6281234567890'}?text=${encodeURIComponent(
    'Hello BabyShalls Team, I have a question regarding your store services.'
  )}`;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">


      {/* Hero Header */}
      <section className="bg-[#FFF6EA] py-12 sm:py-16 border-b border-[#F2E4D6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B05A26] block mb-2">
            HELP CENTER
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#4A2A1C] tracking-tight mb-4">
            Frequently Asked Questions (FAQ)
          </h1>
          <p className="text-sm sm:text-base text-[#7A5644] max-w-xl mx-auto leading-relaxed">
            Find quick answers about ordering books, courier shipping from Malang, children workshops, and curation services.
          </p>

          {/* Search bar inside Hero */}
          <div className="mt-6 max-w-md mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-xs sm:text-sm text-[#4A2A1C] placeholder:text-[#A0887A] focus:outline-none focus:border-[#B05A26] shadow-xs"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-[#A0887A]" />
          </div>
        </div>
      </section>

      {/* Main FAQ Accordion */}
      <section id="pengiriman" className="py-12 sm:py-16 bg-[#FFFDF9]">
        <div id="preloved" className="max-w-[860px] mx-auto px-4 sm:px-8">

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 mb-8 justify-center">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setOpenIndex(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-[2px] text-xs font-medium transition-colors cursor-pointer ${isActive
                      ? 'bg-[#B05A26] text-white shadow-xs'
                      : 'bg-white border border-[#E6D2C0] text-[#7A5644] hover:border-[#B05A26] hover:text-[#B05A26]'
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-white border border-[#F2E4D6] rounded-[2px]">
              <p className="text-sm text-[#7A5644]">
                No questions match your search keywords or current filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs font-semibold text-[#B05A26] underline"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq: CmsFaqItem, idx: number) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={faq.id || idx}
                    className="bg-white border border-[#F2E4D6] rounded-[2px] overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-[#FFFBF7] transition-colors"
                    >
                      <div>
                        <span className="text-[11px] font-semibold text-[#B05A26] uppercase tracking-wider block mb-1">
                          {faq.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-semibold text-[#4A2A1C]">
                          {faq.question}
                        </h3>
                      </div>

                      <div className="p-1 rounded-full text-[#7A5644] shrink-0 mt-1">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-[#B05A26]" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#7A5644] leading-relaxed border-t border-[#F9EAE1]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Need More Help Box */}
          <div className="mt-12 p-6 sm:p-8 bg-[#FFF6EA] border border-[#F2E4D6] rounded-[2px] text-center flex flex-col items-center">
            <HelpCircle className="w-8 h-8 text-[#B05A26] mb-2" />
            <h3 className="text-lg font-medium text-[#4A2A1C] mb-1">
              Still Have Questions?
            </h3>
            <p className="text-xs sm:text-sm text-[#7A5644] max-w-md mb-6 leading-relaxed">
              Our curation and customer support team is ready to assist you via WhatsApp daily ({store.operatingHours || '10:00 AM – 5:00 PM WIB'}).
            </p>
            <a
              href={waSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B05A26] text-white text-xs font-semibold rounded-[2px] hover:bg-[#964B1F] transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Our Team on WhatsApp</span>
            </a>
          </div>

        </div>
      </section>

      <CampaignBanner />
    </div>
  );
}

