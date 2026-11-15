'use client';

import React from 'react';
import { mockWorkshops, formatIDR } from '../data/mockProducts';

export const WorkshopBanner: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24 border-b border-[#E5E5E5]" id="events">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="border-b border-[#E5E5E5] pb-6 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Events &amp; Workshops
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Mindful weekend community gatherings held at our bookstore reading space in Malang.
          </p>
        </div>

        {/* 2-Column Minimal Editorial Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          {mockWorkshops.map((event) => (
            <article key={event.id} className="flex flex-col sm:flex-row gap-6 items-start text-left">
              <div className="w-full sm:w-44 aspect-[4/3] bg-neutral-100 overflow-hidden shrink-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 flex-1">
                <div className="text-xs uppercase tracking-wider text-[#666666]">
                  {event.date} • {event.time}
                </div>

                <h3 className="text-base font-semibold text-[#111111] leading-snug">
                  {event.title}
                </h3>

                <p className="text-xs text-[#666666] leading-relaxed">
                  {event.subtitle}
                </p>

                <div className="text-xs text-[#111111] font-medium pt-1">
                  Location: {event.location}
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-sm font-normal text-[#111111]">
                    {formatIDR(event.price)} / child
                  </span>
                  <a
                    href={`https://wa.me/6281234567890?text=Hello%20BabyShalls,%20I%20would%20like%20to%20register%20for%20the%20event:%20${encodeURIComponent(event.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white px-4 py-2 text-xs font-medium transition-colors rounded-none"
                  >
                    Reserve Slot
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
