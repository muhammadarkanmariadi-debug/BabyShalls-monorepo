'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Clock,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from 'lucide-react';
import { EVENTS } from '../../data/events';
import { WorkshopEvent } from '../../types';
import { formatIDR } from '../../lib/utils';

type EventCategoryFilter = 'ALL' | 'Storytelling & Art' | 'Sensory & Wooden Play' | 'Parenting & Read-Aloud';
type SortOption = 'date-asc' | 'price-asc' | 'price-desc' | 'quota-asc';

const ITEMS_PER_PAGE = 4;

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategoryFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal Detail State
  const [detailModalEvent, setDetailModalEvent] = useState<WorkshopEvent | null>(null);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setNewsletterEmail('');
      }, 3500);
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedEvents = useMemo(() => {
    return EVENTS.filter((event) => {
      // Category Filter
      if (selectedCategory !== 'ALL' && event.category !== selectedCategory) {
        return false;
      }
      // Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = event.title.toLowerCase().includes(q);
        const matchDesc = event.description.toLowerCase().includes(q);
        const matchSpeaker = event.speaker.toLowerCase().includes(q);
        const matchCategory = event.category?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchSpeaker && !matchCategory) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'quota-asc') return a.remainingQuota - b.remainingQuota;
      return 0; // Default date order
    });
  }, [selectedCategory, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAndSortedEvents.length / ITEMS_PER_PAGE) || 1;
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedEvents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedEvents, currentPage]);

  const handleCategoryChange = (cat: EventCategoryFilter) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#FFF8EF] min-h-screen text-[#4A2E1F] font-sans overflow-hidden">

      {/* 1. Grand Waving Hero Section (Continuous Flowing Ribbon matching Reference) */}
      <section
        className="relative w-full min-h-[500px] lg:min-h-[560px] xl:min-h-[600px] overflow-hidden flex items-center"
        style={{
          background: 'linear-gradient(135deg, #FFF9F0 0%, #FFEBDC 45%, #FBDDC9 100%)',
        }}
        id="events-hero"
        aria-label="Workshops & Events Hero"
      >
        {/* 1a. Asymmetrical Top Wave */}
        <div className="absolute top-0 left-0 w-full h-[65px] lg:h-[75px] leading-none overflow-hidden z-[4] pointer-events-none">
          <svg
            viewBox="0 0 1440 90"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,0 L360,0 C270,36 170,68 70,74 C30,76 10,79 0,82 Z" fill="#FFE4D2" />
            <path
              d="M0,0 L1440,0 L1440,32 C1320,56 1200,52 1090,34 C970,14 850,56 710,50 C550,44 350,16 190,36 C95,48 35,34 0,22 Z"
              fill="#FFF8EF"
            />
          </svg>
        </div>

        {/* 1b. Botanical Sage Leaf Branch (Far Left Edge) */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-14 sm:w-20 lg:w-24 h-32 lg:h-40 z-[3] pointer-events-none hidden sm:block animate-float-1"
          aria-hidden="true"
        >
          <svg viewBox="0 0 95 150" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 145 C18 105 35 65 72 20" stroke="#7A9A60" strokeWidth="2.8" strokeLinecap="round" />
            <ellipse cx="26" cy="118" rx="15" ry="9" transform="rotate(-32 26 118)" fill="#91B077" />
            <ellipse cx="44" cy="90" rx="16" ry="9.5" transform="rotate(28 44 90)" fill="#91B077" />
            <ellipse cx="47" cy="54" rx="16" ry="9" transform="rotate(-34 47 54)" fill="#91B077" />
            <ellipse cx="70" cy="24" rx="14" ry="8" transform="rotate(22 70 24)" fill="#91B077" />
          </svg>
        </div>

        {/* 1c. Storybook Floating Doodles */}
        {/* Sparkle 1 */}
        <div className="absolute left-[38%] top-[14%] w-6 h-6 z-[3] pointer-events-none hidden md:block animate-twinkle-1">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z" fill="#F6C95E" opacity="0.9" />
          </svg>
        </div>

        {/* Floating Open Book */}
        <div className="absolute left-[41%] top-[19%] w-10 h-8 lg:w-12 lg:h-9 z-[3] pointer-events-none hidden lg:block animate-float-2">
          <svg viewBox="0 0 54 40" fill="none" className="w-full h-full">
            <path
              d="M27 10 C21 6 10 7 4 11 L4 35 C10 31 21 30 27 34 C33 30 44 31 50 35 L50 11 C44 7 33 6 27 10 Z"
              fill="#FFF5EB"
              stroke="#DA7A5B"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M27 10 L27 34" stroke="#DA7A5B" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M9 19 Q16 16 22 18" stroke="#DA7A5B" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <path d="M32 18 Q38 16 45 19" stroke="#DA7A5B" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>

        {/* Floating Heart */}
        <div className="absolute left-[47%] top-[25%] w-8 h-7 lg:w-9 lg:h-8 z-[3] pointer-events-none hidden md:block animate-float-1">
          <svg viewBox="0 0 34 30" fill="none" className="w-full h-full">
            <path
              d="M17 26 C17 26 4 17.5 4 9.2 C4 4.8 7.4 1.8 11.4 1.8 C14.2 1.8 16 3.4 17 4.8 C18 3.4 19.8 1.8 22.6 1.8 C26.6 1.8 30 4.8 30 9.2 C30 17.5 17 26 17 26 Z"
              stroke="#DA7A5B"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Curvilinear Bee Flight Trail */}
        <div className="absolute left-[35%] top-[36%] w-48 lg:w-64 h-24 z-[3] pointer-events-none hidden lg:block">
          <svg viewBox="0 0 220 90" fill="none" className="w-full h-full">
            <path
              d="M10 65 Q60 20 110 55 T200 30"
              stroke="#D9A688"
              strokeWidth="2"
              strokeDasharray="4 6"
              strokeLinecap="round"
              opacity="0.65"
            />
            <g transform="translate(196, 22) rotate(-15)">
              <ellipse cx="8" cy="8" rx="7" ry="4.5" fill="#F6C95E" />
              <path d="M5 4.5 L5 11.5" stroke="#502E1E" strokeWidth="1.2" />
              <path d="M8 3.5 L8 12.5" stroke="#502E1E" strokeWidth="1.2" />
              <ellipse cx="6" cy="3" rx="3.5" ry="2.2" fill="#FFFFFF" opacity="0.8" />
              <ellipse cx="10" cy="3" rx="3.5" ry="2.2" fill="#FFFFFF" opacity="0.8" />
            </g>
          </svg>
        </div>

        {/* Mini Rainbow Doodle */}
        <div className="absolute left-[43%] bottom-[23%] w-12 h-9 lg:w-14 lg:h-10 z-[3] pointer-events-none hidden lg:block animate-float-3">
          <svg viewBox="0 0 60 44" fill="none" className="w-full h-full">
            <path d="M6,40 A24,24 0 0,1 54,40" stroke="#DA7A5B" strokeWidth="5.5" fill="none" strokeLinecap="round" />
            <path d="M14,40 A16,16 0 0,1 46,40" stroke="#F6C95E" strokeWidth="5.5" fill="none" strokeLinecap="round" />
            <path d="M22,40 A8,8 0 0,1 38,40" stroke="#8FA87E" strokeWidth="5.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Little Sage Sprout */}
        <div className="absolute left-[34%] top-[56%] w-7 h-9 z-[3] pointer-events-none hidden xl:block animate-float-2">
          <svg viewBox="0 0 32 40" fill="none" className="w-full h-full">
            <path d="M16 38 C16 26 18 16 24 8" stroke="#7A9A60" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="12" cy="22" rx="7" ry="4" transform="rotate(-30 12 22)" fill="#91B077" />
            <ellipse cx="23" cy="14" rx="7" ry="4" transform="rotate(25 23 14)" fill="#A7C48A" />
          </svg>
        </div>

        {/* 1d. Main Layout Grid */}
        <div className="relative w-full min-h-[500px] lg:min-h-[560px] xl:min-h-[600px] grid grid-cols-1 lg:grid-cols-[48%_52%] items-center z-[2]">

          {/* Left Column: Heading, Subtext & CTA */}
          <div className="relative z-[3] pt-20 pb-12 lg:py-24 px-6 sm:px-12 lg:pl-16 xl:pl-28 flex flex-col items-start text-left">
            {/* Mustard Doodle Sunburst */}
            <div className="inline-flex items-end gap-1.5 mb-3.5 h-7" aria-hidden="true">
              <span className="block w-1 h-4 bg-[#F6C95E] rounded-full transform -rotate-[32deg] origin-bottom"></span>
              <span className="block w-1 h-5.5 bg-[#F6C95E] rounded-full"></span>
              <span className="block w-1 h-4 bg-[#F6C95E] rounded-full transform rotate-[32deg] origin-bottom"></span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[48px] xl:text-[54px] font-bold text-[#502E1E] leading-[1.16] tracking-tight mb-4">
              Workshops &<br />Events
            </h1>

            <p className="font-sans text-sm sm:text-base lg:text-lg text-[#6B3F2A]/90 max-w-md font-medium leading-relaxed mb-6">
              Learn, play, and grow together at BabyShalls.
            </p>

            {/* CTA with Flower Cluster */}
            <div className="relative flex items-center gap-4 lg:gap-5">
              <a
                href="#upcoming-events"
                className="inline-flex items-center gap-3 px-8 py-3.5 sm:px-9 sm:py-4 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white font-extrabold text-sm sm:text-base shadow-card hover:shadow-hover hover:scale-103 active:scale-98 transition-all group tracking-wide"
              >
                <span>Explore Events</span>
                <span className="transform group-hover:translate-x-1.5 transition-transform text-lg">→</span>
              </a>

              {/* Flower Cluster beside CTA */}
              <div className="w-16 h-14 sm:w-20 sm:h-16 flex-shrink-0" aria-hidden="true">
                <svg viewBox="0 0 90 70" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 46 C10 40 6 28 14 20 C24 24 28 36 22 44 Z" fill="#91B077" />
                  <path d="M60 54 C70 50 80 38 74 28 C64 32 58 42 60 54 Z" fill="#A7C48A" />
                  <g>
                    <circle cx="32" cy="38" r="8.5" fill="#F6C95E" />
                    <circle cx="45" cy="30" r="8.5" fill="#F6C95E" />
                    <circle cx="49" cy="44" r="8.5" fill="#F6C95E" />
                    <circle cx="39" cy="54" r="8.5" fill="#F6C95E" />
                    <circle cx="28" cy="50" r="8.5" fill="#F6C95E" />
                    <circle cx="38" cy="43" r="5.5" fill="#502E1E" />
                  </g>
                  <g>
                    <circle cx="56" cy="24" r="6.5" fill="#F6B79B" />
                    <circle cx="66" cy="20" r="6.5" fill="#F6B79B" />
                    <circle cx="61.5" cy="29" r="4.2" fill="#DA7A5B" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column: Full-height Photograph Blended Seamlessly */}
          <div className="relative w-full h-[380px] sm:h-[460px] lg:h-full lg:min-h-[560px] xl:min-h-[600px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80"
              alt="Mother and young children doing crafts and painting at cozy wooden workshop table"
              className="w-full h-[115%] -top-[5%] relative object-cover object-[center_30%]"
            />
            {/* Seamless Left Gradient Mask */}
            <div
              className="absolute inset-y-0 left-0 w-[35%] pointer-events-none z-[2]"
              style={{
                background:
                  'linear-gradient(to right, #FFEBDC 0%, rgba(255, 235, 220, 0.75) 45%, transparent 100%)',
              }}
              aria-hidden="true"
            />
          </div>

        </div>

        {/* 1e. 3-Layer Flowing Bottom Wave */}
        <div
          className="absolute bottom-0 left-0 w-full h-[75px] lg:h-[95px] leading-none overflow-hidden z-[4] pointer-events-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,62 C180,22 360,18 540,66 C720,110 920,54 1100,84 C1240,106 1350,64 1440,52 L1440,120 L0,120 Z"
              fill="#FAD9C5"
              opacity="0.88"
            />
            <path
              d="M0,78 C160,38 340,42 510,76 C680,110 880,68 1060,90 C1220,108 1360,74 1440,66 L1440,120 L0,120 Z"
              fill="#FFE8D9"
              opacity="0.8"
            />
            <path
              d="M0,88 C200,58 380,50 560,82 C740,112 940,74 1140,92 C1280,104 1380,78 1440,72 L1440,120 L0,120 Z"
              fill="#FFF8EF"
            />
          </svg>
        </div>
      </section>

      {/* 2. Section: Upcoming Events */}
      <section id="upcoming-events" className="py-12 sm:py-20 relative">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header with Sparkles */}
          <div className="flex items-center justify-center gap-2 text-[#DA7A5B] mb-8">
            <span className="text-xl"></span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A2E1F] text-center">
              Upcoming Events
            </h2>
            <span className="text-xl"></span>
          </div>

          {/* Search, Filter & Sort Controls */}
          <div className="bg-[#FAF2E6] border border-[#EEDBC9] rounded-[24px] p-4 sm:p-5 mb-8 shadow-2xs space-y-3.5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

              {/* Search input */}
              <div className="w-full sm:max-w-xs relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari tema workshop..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#EEDBC9] rounded-full text-[#4A2E1F] focus:outline-none focus:border-[#DA7A5B]"
                />
                <Search className="w-3.5 h-3.5 text-[#CBA989] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort Dropdown */}
              <div className="w-full sm:w-auto flex items-center justify-end gap-2 text-xs">
                <span className="font-bold text-[#8FA87E] flex items-center gap-1 text-[11px]">
                  <SlidersHorizontal className="w-3 h-3" /> Urutkan:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white border border-[#EEDBC9] text-[#4A2E1F] text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#DA7A5B]"
                >
                  <option value="date-asc">Jadwal Terdekat</option>
                  <option value="price-asc">Biaya Terendah</option>
                  <option value="price-desc">Biaya Tertinggi</option>
                  <option value="quota-asc">Sisa Kuota Terbatas</option>
                </select>
              </div>

            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#EEDBC9]/60">
              {(['ALL', 'Storytelling & Art', 'Sensory & Wooden Play', 'Parenting & Read-Aloud'] as EventCategoryFilter[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === cat
                      ? 'bg-[#DA7A5B] text-white shadow-xs'
                      : 'bg-white border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#FFE4D0]'
                    }`}
                >
                  {cat === 'ALL' ? 'Semua Workshop' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid (2 Cards Per Row matching Reference Screenshot) */}
          {paginatedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {paginatedEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#FCF8F2] border border-[#EEDBC9] rounded-[26px] p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 shadow-xs hover:shadow-subtle hover:-translate-y-1 transition-all duration-300"
                >

                  {/* Left: Thumbnail with Floating Date Tag */}
                  <div className="relative w-full sm:w-48 h-44 sm:h-auto rounded-[20px] overflow-hidden flex-shrink-0 bg-[#F5E6D8] border border-white">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-[#502E1E] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs border border-[#EEDBC9]">
                      {event.date}
                    </span>
                  </div>

                  {/* Right: Info & Learn More CTA */}
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#4A2E1F] leading-snug">
                        {event.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6B3F2A]/85 mt-1 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <div className="space-y-1 text-xs text-[#8A6A55] pt-1">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#DA7A5B] flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#DA7A5B] flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => setDetailModalEvent(event)}
                        className="inline-flex items-center gap-1.5 bg-[#D9744A] hover:bg-[#C46749] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-2xs hover:shadow-xs transition-all"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-xs font-bold text-[#DA7A5B]">
                        {formatIDR(event.price)}
                      </span>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/60 border border-[#EEDBC9] rounded-[24px] p-8 max-w-md mx-auto">
              <Sparkles className="w-8 h-8 text-[#DA7A5B] mx-auto mb-2 opacity-60" />
              <p className="font-bold text-[#4A2E1F] text-sm">Tidak ada workshop yang cocok</p>
              <p className="text-xs text-[#8A6A55] mt-1">Coba ubah kata kunci pencarian atau kategori filter.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full border border-[#EEDBC9] bg-white text-[#4A2E1F] disabled:opacity-40 hover:bg-[#FFE4D0] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${currentPage === i + 1
                      ? 'bg-[#DA7A5B] text-white shadow-2xs'
                      : 'bg-white border border-[#EEDBC9] text-[#4A2E1F] hover:bg-[#FFE4D0]'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full border border-[#EEDBC9] bg-white text-[#4A2E1F] disabled:opacity-40 hover:bg-[#FFE4D0] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 3. Section: Stay Updated (Newsletter Banner with Illustration) */}
      <section className="py-8 sm:py-16 relative">
        <div className="max-w-5xl mx-auto px-6">

          <div className="bg-[#EFF5E9] border border-[#DAE8D2] rounded-[36px] p-6 sm:p-10 shadow-xs relative overflow-hidden">

            {/* Decorative Leaves Left */}
            <div className="absolute -left-3 bottom-0 text-[#8FA87E] pointer-events-none opacity-60 hidden sm:block">
              <svg className="w-14 h-20" viewBox="0 0 50 70" fill="none">
                <path d="M10 60 C 10 30, 30 20, 45 10 C 35 25, 20 45, 10 60 Z" fill="#8FA87E" />
                <path d="M15 50 C 25 35, 35 30, 42 20" stroke="#709154" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Decorative Leaves Right */}
            <div className="absolute -right-3 top-0 text-[#8FA87E] pointer-events-none opacity-60 hidden sm:block">
              <svg className="w-14 h-20" viewBox="0 0 50 70" fill="none">
                <path d="M40 10 C 40 40, 20 50, 5 60 C 15 45, 30 25, 40 10 Z" fill="#8FA87E" />
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">

              {/* Left Column: Cute Child Reading on Belly Illustration / Visual */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-52 sm:w-64 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xs border-2 border-white bg-[#FAF2E6]">
                  <img
                    src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=700&q=80"
                    alt="Child reading book happily on the floor"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Column: Newsletter Title & Form */}
              <div className="md:col-span-7 space-y-3 text-center md:text-left">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2E1F]">
                  Stay Updated
                </h3>
                <p className="text-xs sm:text-sm text-[#6B3F2A]/90 leading-relaxed max-w-md">
                  Get the latest workshop, event and special offers from BabyShalls.
                </p>

                {/* Newsletter Form */}
                <form onSubmit={handleSubscribe} className="pt-2 flex flex-col sm:flex-row items-center gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full sm:flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-[#D5E4CA] rounded-full text-[#4A2E1F] focus:outline-none focus:border-[#DA7A5B]"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#D9744A] hover:bg-[#C46749] text-white font-bold text-xs sm:text-sm rounded-full transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-1.5"
                  >
                    {isSubscribed ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Subscribed!</span>
                      </>
                    ) : (
                      <span>Subscribe</span>
                    )}
                  </button>
                </form>

                {isSubscribed && (
                  <p className="text-xs text-[#709154] font-semibold animate-in fade-in-0">
                    Terima kasih! Jadwal workshop terbaru akan dikirimkan ke email Anda.
                  </p>
                )}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. Rich Detail Modal Pop-Up */}
      {detailModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div className="bg-[#FFFDF9] border border-[#EEDBC9] rounded-[28px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 animate-in zoom-in-95 duration-200 text-[#4A2E1F]">

            {/* Close Button */}
            <button
              onClick={() => setDetailModalEvent(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-[#FFE4D0] text-[#6B3F2A] border border-[#EEDBC9] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Cover Image */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-5 border border-[#EEDBC9] bg-[#F5E6D8]">
              <img
                src={detailModalEvent.image}
                alt={detailModalEvent.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#502E1E] text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-[#EEDBC9]">
                {detailModalEvent.date}
              </span>
            </div>

            {/* Modal Title & Meta */}
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2E1F] leading-tight">
              {detailModalEvent.title}
            </h2>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#8A6A55] my-3 pb-3 border-b border-[#EEDBC9]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#DA7A5B]" /> {detailModalEvent.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#DA7A5B]" /> {detailModalEvent.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#709154]" /> Sisa Kuota: <strong>{detailModalEvent.remainingQuota} anak</strong>
              </span>
            </div>

            {/* Description */}
            <div className="space-y-4 text-xs sm:text-sm text-[#6B3F2A] leading-relaxed">
              <p>{detailModalEvent.description}</p>

              {/* Inclusions */}
              {detailModalEvent.includes && detailModalEvent.includes.length > 0 && (
                <div className="bg-[#FCF6EC] border border-[#EEDBC9] rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-[#4A2E1F] text-xs uppercase tracking-wider">
                    Fasilitas & Paket Termasuk:
                  </h4>
                  <ul className="space-y-1.5">
                    {detailModalEvent.includes.map((inc, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-[#6B3F2A]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#709154] flex-shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Speaker info */}
              <div className="p-3 bg-[#FFF3E8] border border-[#F6DECE] rounded-xl text-xs text-[#8A5237]">
                <strong>Fasilitator / Pembicara:</strong> {detailModalEvent.speaker}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="mt-6 pt-4 border-t border-[#EEDBC9] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-[#8A6A55] block">Biaya Registrasi:</span>
                <span className="font-extrabold text-xl text-[#DA7A5B]">
                  {formatIDR(detailModalEvent.price)}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setDetailModalEvent(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-full border border-[#EEDBC9] text-xs font-bold text-[#6B3F2A] hover:bg-[#FFE4D0]"
                >
                  Tutup
                </button>
                <Link
                  href={`/events/register?eventId=${detailModalEvent.id}`}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white text-xs font-bold shadow-xs hover:shadow-subtle transition-all text-center"
                >
                  Daftar Sekarang
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
