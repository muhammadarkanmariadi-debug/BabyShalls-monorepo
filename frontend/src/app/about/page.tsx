'use client';

import React from 'react';
import {
  AboutSectionId,
  DEFAULT_ABOUT_SECTION_ORDER,
  DEFAULT_CMS_VALUES,
  parseSectionOrder,
  usePublicCms,
} from '../../hooks/useCms';

export default function AboutPage() {
  const { data: cms } = usePublicCms();
  const c = (key: string) => cms?.[key] || DEFAULT_CMS_VALUES[key] || '';
  const order = parseSectionOrder(cms?.about_section_order, DEFAULT_ABOUT_SECTION_ORDER);

  const renderSection = (sectionId: AboutSectionId) => {
    switch (sectionId) {
      case 'banner':
        return (
          <section className="w-full bg-[#FDF0B8] py-7 sm:py-9 border-b border-[#FCE694]">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#1A1A1A]">
                {c('about_banner_title')}
              </h1>
            </div>
          </section>
        );
      case 'intro':
        return (
          <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-12 text-center space-y-4">
            <p className="text-sm sm:text-[15px] text-[#4A4A4A] leading-relaxed">{c('about_intro_1')}</p>
            <p className="text-sm sm:text-[15px] text-[#4A4A4A] leading-relaxed">{c('about_intro_2')}</p>
          </section>
        );
      case 'block_1':
        return (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="aspect-[4/3.6] w-full overflow-hidden rounded-lg bg-[#F8FAFC]">
                <img
                  src={c('about_block_1_image')}
                  alt={c('about_block_1_title')}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3 text-left">
                <h2 className="text-lg font-extrabold text-[#1A1A1A]">{c('about_block_1_title')}</h2>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{c('about_block_1_p1')}</p>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{c('about_block_1_p2')}</p>
              </div>
            </div>
          </section>
        );
      case 'block_2':
        return (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="space-y-3 text-left order-2 md:order-1">
                <h2 className="text-lg font-extrabold text-[#1A1A1A]">{c('about_block_2_title')}</h2>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{c('about_block_2_p1')}</p>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{c('about_block_2_p2')}</p>
              </div>
              <div className="aspect-[4/3.6] w-full overflow-hidden rounded-lg bg-[#F8FAFC] order-1 md:order-2">
                <img
                  src={c('about_block_2_image')}
                  alt={c('about_block_2_title')}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        );
      case 'block_3':
        return (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="aspect-[4/3.6] w-full overflow-hidden rounded-lg bg-[#F8FAFC]">
                <img
                  src={c('about_block_3_image')}
                  alt={c('about_block_3_title')}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3 text-left">
                <h2 className="text-lg font-extrabold text-[#1A1A1A]">{c('about_block_3_title')}</h2>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{c('about_block_3_p1')}</p>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  {c('about_block_3_p2')}{' '}
                  <a
                    href={`mailto:${c('about_block_3_email')}`}
                    className="font-bold text-[#1A1A1A] underline underline-offset-4"
                  >
                    {c('about_block_3_email')}
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>
        );
      case 'visit':
        return (
          <section className="max-w-xl mx-auto px-4 sm:px-6 pt-10 pb-20 text-center space-y-3 border-t border-[#F3F4F6]">
            <h2 className="text-lg font-extrabold text-[#1A1A1A]">{c('about_visit_title')}</h2>
            <p className="text-xs sm:text-sm text-[#4A4A4A]">{c('about_visit_address')}</p>
            <div className="pt-2 text-xs text-[#6B7280] space-y-1">
              <p className="font-bold text-[#1A1A1A]">Jam Operasional:</p>
              <p>{c('about_hours_weekday')}</p>
              <p>{c('about_hours_weekend')}</p>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#1A1A1A] pb-8">
      {order.map((sectionId) => (
        <React.Fragment key={sectionId}>{renderSection(sectionId)}</React.Fragment>
      ))}
    </div>
  );
}
