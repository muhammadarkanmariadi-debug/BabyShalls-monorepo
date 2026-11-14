'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Where is BabyShalls located and can I pick up in person?',
      answer: 'Our physical reading studio and boutique is located at Citraland Puncak Tidar Blok HH-26, Sukun, Malang. In-store pickup is free and available Tuesday through Sunday between 10:00 and 19:00 WIB.'
    },
    {
      question: 'Are all titles genuine publisher originals?',
      answer: 'Yes, 100%. All titles in our catalog are genuine publisher editions sourced from verified distributors in the UK, US, and certified Indonesian publishers. We never sell unauthorized reprints or unverified copies.'
    },
    {
      question: 'How do you inspect and sanitize Preloved books?',
      answer: 'Every preloved book is manually examined for page integrity, graded on a clear 10-point scale, and treated with medical-grade UV light in our Malang studio before being placed on the shelf.'
    },
    {
      question: 'Can I request an out-of-stock or international title?',
      answer: 'Absolutely. You can use our dedicated "Request a Book" page to submit the title and author. Our curator will check global publisher stocks and get back to you with pricing and arrival estimates within 24 hours.'
    }
  ];

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-white border-b border-[#EAE6DF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-left mb-10 pb-4 border-b border-[#EAE6DF]">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#5C5753] block mb-1">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#221F1F]">
            Common Inquiries
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#5C5753]">
            Everything you need to know about our book curation, store pickup in Malang, and circular preloved program.
          </p>
        </div>

        <div className="divide-y divide-[#EAE6DF]">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="py-5 text-left">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-[#221F1F] group-hover:text-[#C86D51] transition-colors pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={16}
                    strokeWidth={1.5}
                    className={`text-[#5C5753] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#C86D51]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="mt-3 text-xs sm:text-sm text-[#5C5753] leading-relaxed pr-8 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
