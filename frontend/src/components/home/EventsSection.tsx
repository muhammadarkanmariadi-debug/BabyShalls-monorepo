'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Store } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion } from '@/lib/motion';
import { RequestBookForm } from '../request-book/RequestBookForm';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const EventsSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.event-card');
        gsap.fromTo(
          cards,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.1,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-12 lg:py-16 bg-white space-y-12" id="workshops-events">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 1. Workshops & Events Header + Cards */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#1E543B] mb-1">
                KOMUNITAS MALANG
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                Workshops &amp; Events
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1A1A1A] hover:text-[#1E543B] transition-colors min-h-[44px]"
            >
              <span>Lihat Semua Jadwal</span>
              <span>→</span>
            </Link>
          </div>

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event 1 */}
            <div className="event-card bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#FCE694] transition-all flex flex-col sm:flex-row">
              <div className="sm:w-[210px] h-52 sm:h-auto relative overflow-hidden flex-shrink-0 bg-[#FAF4E8]">
                <img
                  src="/images/event-craft.jpg"
                  alt="Little Explorers: Nature Craft Workshop"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FAF4E8] text-[#1A1A1A] text-[11px] font-bold mb-2">
                    Sisa 6 Kursi
                  </span>
                  <h3 className="text-lg font-bold text-[#1A1A1A] leading-snug">
                    Little Explorers: Nature Craft Workshop
                  </h3>
                  <div className="mt-3 space-y-1.5 text-xs text-[#6B7280] font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#1E543B]" />
                      <span>Sabtu, 24 Mei 2025 • 10:00 WIB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#1E543B]" />
                      <span>Butik BabyShalls, Jl. Cempaka No. 12, Malang</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6]">
                  <span className="text-sm font-extrabold text-[#1E543B]">Gratis</span>
                  <Link
                    href="/events/register?event=wooden-toy-craft-workshop"
                    className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full bg-[#FDF0B8] hover:bg-[#FCE694] text-[#1A1A1A] text-xs font-bold transition-colors"
                  >
                    Daftar Gratis →
                  </Link>
                </div>
              </div>
            </div>

            {/* Event 2 */}
            <div className="event-card bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#FCE694] transition-all flex flex-col sm:flex-row">
              <div className="sm:w-[210px] h-52 sm:h-auto relative overflow-hidden flex-shrink-0 bg-[#FDECE6]">
                <img
                  src="/images/event-play.jpg"
                  alt="Play & Learn: Wooden Toys Session"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E9F3E4] text-[#1E543B] text-[11px] font-bold mb-2">
                    Terbuka untuk 2-5 Tahun
                  </span>
                  <h3 className="text-lg font-bold text-[#1A1A1A] leading-snug">
                    Play &amp; Learn: Wooden Toys Session
                  </h3>
                  <div className="mt-3 space-y-1.5 text-xs text-[#6B7280] font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#1E543B]" />
                      <span>Sabtu, 7 Juni 2025 • 10:00 WIB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#1E543B]" />
                      <span>Butik BabyShalls, Jl. Cempaka No. 12, Malang</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6]">
                  <span className="text-sm font-extrabold text-[#1E543B]">Gratis</span>
                  <Link
                    href="/events/register?event=storytime-book-talk"
                    className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full bg-[#FDF0B8] hover:bg-[#FCE694] text-[#1A1A1A] text-xs font-bold transition-colors"
                  >
                    Daftar Gratis →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Butik Fisik Kota Malang */}
        <div className="rounded-3xl bg-[#F8FAFC] border border-[#E5E7EB] overflow-hidden grid grid-cols-1 md:grid-cols-[48%_52%] items-center">
          <div className="h-72 md:h-full min-h-[320px] relative overflow-hidden bg-[#F1F5F9]">
            <iframe
              title="Peta Lokasi Butik BabyShalls Kota Malang"
              src="https://maps.google.com/maps?q=Jl.%20Cempaka%20No.%2012%2C%20Lowokwaru%2C%20Kota%20Malang&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="p-8 sm:p-10 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E543B]">
              <Store className="w-4 h-4" />
              <span>BUTIK FISIK KOTA MALANG</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Kunjungi Pojok Baca &amp; Bermain Kami
            </h3>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              Jl. Cempaka No. 12, Lowokwaru, Kota Malang • Buka setiap hari pukul 09.00 – 17.00 WIB. Anak-anak bebas mencoba mainan kayu Montessori dan membaca langsung di tempat.
            </p>
            <div className="pt-1 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-white border border-[#E5E7EB] hover:border-[#1A1A1A] text-sm font-bold text-[#1A1A1A] transition-colors"
              >
                Tentang BabyShalls
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-[#F5B7A1] hover:bg-[#ED9E84] text-sm font-bold text-[#1A1A1A] transition-colors"
              >
                Lihat Stok Toko
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Form Request a Book (Langsung di bawah section Maps) */}
        <div className="rounded-3xl bg-white border border-[#E5E7EB] p-6 sm:p-10 space-y-6">
          <div className="max-w-2xl space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
              Request a Book
            </h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Mencari buku anak impor atau judul tertentu yang belum ada di katalog? Kirim permintaan di bawah ini dan tim kami akan menghubungi Anda maksimal 1x24 jam.
            </p>
          </div>
          <RequestBookForm compact />
        </div>
      </div>
    </section>
  );
};
