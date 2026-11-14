'use client';

import React from 'react';
import { Eye, Brain, Compass, ArrowRight } from 'lucide-react';

interface ReadingGuideSectionProps {
  onSelectAgeFilter?: (age: string) => void;
}

export const ReadingGuideSection: React.FC<ReadingGuideSectionProps> = ({ onSelectAgeFilter }) => {
  const guides = [
    {
      id: 'guide-0-2',
      chapter: 'Bab I',
      age: '0–2 Tahun',
      filterKey: '0–2 Years',
      icon: Eye,
      title: 'Fase Sensori & Irama Suara',
      focus: 'Board Books • Touch & Feel • High Contrast',
      handwrittenNote: 'Buku pertama yang aman digigit si kecil ♡',
      description:
        'Bayi mengeksplorasi buku dengan tangan dan mulut. Pilihlah buku karton tebal bersudut tumpul, rima suara berulang yang merdu, dan tekstur raba untuk menstimulasi sensorik.',
      recommendations: ['The Very Hungry Caterpillar', 'Guess How Much I Love You', 'We’re Going on a Bear Hunt'],
      stampColor: 'text-[#C86D51] border-[#C86D51]'
    },
    {
      id: 'guide-3-5',
      chapter: 'Bab II',
      age: '3–5 Tahun',
      filterKey: '3–5 Years',
      icon: Brain,
      title: 'Fase Imajinasi & Validasi Emosi',
      focus: 'Picture Books • Fabel Karakter • Budi Pekerti',
      handwrittenNote: 'Mengenalkan rasa takut, amarah & empati 🍃',
      description:
        'Anak balita mulai memahami sudut pandang orang lain dan mengalami lonjakan kosakata. Dongeng bergambar dengan alur emosi membantu mereka belajar meregulasi perasaan.',
      recommendations: ['Where the Wild Things Are', 'Bintang Kecil Puncak Tidar', 'Balok Kayu Alfabet Phonics'],
      stampColor: 'text-[#5E7D63] border-[#5E7D63]'
    },
    {
      id: 'guide-6-plus',
      chapter: 'Bab III',
      age: '6+ Tahun',
      filterKey: '6+ Years',
      icon: Compass,
      title: 'Fase Rasa Ingin Tahu & Refleksi',
      focus: 'Ensiklopedia Cilik • Fabel Reflektif • Buku Bab',
      handwrittenNote: 'Menjawab pertanyaan "mengapa" si kecil ✨',
      description:
        'Anak siap menjelajahi dunia di luar rumah. Mereka menyukai ensiklopedia sains alam yang menjawab rasa penasaran ilmiah serta cerita reflektif yang mengasah kebaikan hati.',
      recommendations: ['The Boy, The Mole, The Fox & Horse', 'Ensiklopedia Cilik Alam Semesta', 'Petualangan Kancil Bijak'],
      stampColor: 'text-[#36688D] border-[#36688D]'
    }
  ];

  const handleAgeClick = (filterKey: string) => {
    if (onSelectAgeFilter) {
      onSelectAgeFilter(filterKey);
    }
    const el = document.getElementById('katalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#FAF5EC] border-b border-[#EADBCA] relative" id="panduan-usia">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="library-stamp">
              <span>🌱</span>
              <span>Pedoman Membaca Orang Tua</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3B2820]">
            Buku Sesuai Tahap Tumbuh Kembang
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#4A332A]/80 leading-relaxed font-normal">
            Membaca bukan tentang menuntut si kecil lekas membaca mandiri, melainkan membangun kelekatan batin yang hangat di setiap pergantian halaman.
          </p>

          <div className="font-handwriting text-xl text-[#C86D51] mt-2">
            &ldquo;Setiap anak memiliki ritme dan cahayanya masing-masing ✨&rdquo;
          </div>
        </div>

        {/* 3 Storybook Chapter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <div
                key={guide.id}
                className="paper-card p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-1.5 transition-all duration-300 relative"
              >
                {/* Washi tape on first card */}
                {guide.id === 'guide-0-2' && (
                  <div className="washi-tape -top-2.5 right-8 rotate-2"></div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#C4A482] uppercase tracking-wider">
                      {guide.chapter}
                    </span>
                    
                    <span className="px-3 py-1 rounded-full bg-[#FAF5EC] border border-[#EADBCA] text-xs font-bold text-[#4A332A]">
                      {guide.age}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-[#FFEBDC] border border-[#EADBCA] flex items-center justify-center text-[#C86D51] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-semibold text-[#3B2820] mb-1 leading-snug">
                    {guide.title}
                  </h3>

                  <div className="text-[11px] font-bold text-[#C86D51] mb-2 font-sans">
                    {guide.focus}
                  </div>

                  <div className="font-handwriting text-base text-[#5E7D63] mb-4">
                    {guide.handwrittenNote}
                  </div>

                  <p className="text-xs text-[#4A332A]/85 leading-relaxed mb-6 font-normal">
                    {guide.description}
                  </p>

                  <div className="pt-4 border-t border-[#EADBCA]">
                    <span className="text-[10px] font-bold text-[#4A332A]/60 block uppercase tracking-wider mb-2 ">
                      Rekomendasi di Rak Butik:
                    </span>
                    <ul className="space-y-1.5">
                      {guide.recommendations.map((rec, i) => (
                        <li key={i} className="text-xs text-[#4A332A] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C86D51]" />
                          <span className="font-medium">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 mt-6 border-t border-[#EADBCA]">
                  <button
                    onClick={() => handleAgeClick(guide.filterKey)}
                    className="w-full py-2.5 px-4 rounded-full text-xs font-bold text-[#4A332A] bg-[#FAF5EC] hover:bg-[#FFEBDC] border border-[#EADBCA] transition flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <span>Lihat Buku {guide.age}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C86D51] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
