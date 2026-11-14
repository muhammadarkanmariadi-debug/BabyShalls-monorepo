'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Clock, MapPin, Users, Search } from 'lucide-react';
import { usePublicEvents } from '../../hooks/useEvents';
import { formatIDR } from '../../lib/utils';

type EventCategoryFilter =
  | 'ALL'
  | 'Storytelling & Art'
  | 'Sensory & Wooden Play'
  | 'Parenting & Read-Aloud';

export default function EventsPage() {
  const { data: events = [], isLoading } = usePublicEvents();
  const [selectedCategory, setSelectedCategory] = useState<EventCategoryFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (selectedCategory !== 'ALL' && event.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          event.title.toLowerCase().includes(q) ||
          event.description.toLowerCase().includes(q) ||
          (event.speaker || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [events, selectedCategory, searchQuery]);

  const categories: { label: string; value: EventCategoryFilter }[] = [
    { label: 'Semua Workshop', value: 'ALL' },
    { label: 'Storytelling & Art', value: 'Storytelling & Art' },
    { label: 'Sensory & Wooden Play', value: 'Sensory & Wooden Play' },
    { label: 'Parenting & Read-Aloud', value: 'Parenting & Read-Aloud' },
  ];

  return (
    <div className="bg-white py-10 lg:py-14 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
              Workshops &amp; Events
            </h1>
            <p className="text-sm text-[#6B7280] mt-1 max-w-xl">
              Aktivitas akhir pekan bersama si kecil di Butik BabyShalls Malang. Daftar online dan dapatkan E-Ticket QR.
            </p>
          </div>
          <Link
            href="/account"
            className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full bg-[#FAF4E8] border border-[#E5E7EB] text-xs font-bold text-[#1A1A1A]"
          >
            Lihat Tiket Saya →
          </Link>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`min-h-[40px] px-4 rounded-full text-xs font-bold transition-colors border cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#4A4A4A] border-[#E5E7EB] hover:border-[#1A1A1A]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari workshop atau pembicara..."
              className="w-full h-[42px] pl-10 pr-4 text-xs bg-white border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-[#FAF4E8] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event, idx) => {
              const fallbackImg = idx % 2 === 0 ? '/images/event-craft.jpg' : '/images/event-play.jpg';
              const formattedDate = Number.isNaN(Date.parse(event.eventDate))
                ? event.eventDate
                : new Date(event.eventDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  });

              return (
                <div
                  key={event.id}
                  className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#FCE694] transition-all flex flex-col sm:flex-row"
                >
                  <div className="sm:w-52 h-52 sm:h-auto bg-[#FAF4E8] flex-shrink-0 overflow-hidden">
                    <img
                      src={event.bannerImage || fallbackImg}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E9F3E4] text-[#1E543B] text-[11px] font-bold">
                          {event.category}
                        </span>
                        <span className="text-[11px] font-bold text-[#6B7280]">
                          Sisa {event.quota} kursi
                        </span>
                      </div>
                      <h2 className="text-lg font-extrabold text-[#1A1A1A] leading-snug">
                        {event.title}
                      </h2>
                      <p className="text-xs text-[#6B7280] mt-1.5 line-clamp-2">{event.description}</p>
                      <div className="mt-3 space-y-1 text-xs text-[#4A4A4A] font-medium">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#1E543B]" />
                          <span>
                            {formattedDate} • {event.timeString}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#1E543B]" />
                          <span>{event.location}</span>
                        </div>
                        {event.speaker && (
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-[#1E543B]" />
                            <span>Narasumber: {event.speaker}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                      <span className="text-base font-extrabold text-[#1E543B]">
                        {event.price > 0 ? formatIDR(event.price) : 'Gratis'}
                      </span>
                      <Link
                        href={`/events/register?eventId=${event.slug}`}
                        className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full bg-[#FDF0B8] hover:bg-[#FCE694] text-[#1A1A1A] font-bold text-xs transition-colors"
                      >
                        {event.price > 0 ? 'Beli Tiket →' : 'Daftar Gratis →'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
