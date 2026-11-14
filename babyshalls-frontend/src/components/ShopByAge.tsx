'use client';

import React from 'react';

interface ShopByAgeProps {
  selectedAge?: string;
  onSelectAge?: (age: string) => void;
}

export const ShopByAge: React.FC<ShopByAgeProps> = ({ selectedAge = 'All', onSelectAge }) => {
  const ageTiers = [
    {
      id: '0–2 Years',
      label: 'Newborn+',
      ageRange: '0 – 12 Months',
      focus: 'High-contrast visuals, crinkle textures, tactile cloth & thick board books.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '0–2 Years',
      label: 'Ages 1–3',
      ageRange: '1 – 3 Years',
      focus: 'Lift-the-flap curiosity, first words, sensory wooden stacking & bedtime rituals.',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '3–5 Years',
      label: 'Ages 3–5',
      ageRange: '3 – 5 Years',
      focus: 'Rich narrative picture books, empathy, emotional literacy & preschool wonders.',
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '6+ Years',
      label: 'Ages 6+',
      ageRange: '6+ Years',
      focus: 'Early independent readers, nature journals, mythology & STEAM curiosity.',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const handleAgeClick = (ageKey: string) => {
    if (onSelectAge) {
      onSelectAge(ageKey);
    }
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-20 bg-white border-b border-[#EAE6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#EAE6DF] gap-4 text-left">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#5C5753] block mb-1">
              Curated by Developmental Stage
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#221F1F]">
              Shop by Age
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5C5753] max-w-sm">
            Every developmental milestone has its ideal balance of weight, interaction, and visual rhythm.
          </p>
        </div>

        {/* 4 Clean Editorial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {ageTiers.map((tier) => {
            const isSelected = selectedAge === tier.id;

            return (
              <button
                key={tier.label}
                type="button"
                onClick={() => handleAgeClick(tier.id)}
                className={`group flex flex-col text-left bg-[#FAF8F5] border rounded-md p-5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#C86D51] ring-1 ring-[#C86D51]'
                    : 'border-[#EAE6DF] hover:border-[#C86D51]'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-[#221F1F] group-hover:text-[#C86D51] transition-colors">
                    {tier.label}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-[#5C5753] bg-white border border-[#EAE6DF] px-2 py-0.5 rounded-sm">
                    {tier.ageRange}
                  </span>
                </div>

                <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden bg-[#F4EFEA] mb-4 border border-[#EAE6DF]/60">
                  <img
                    src={tier.image}
                    alt={tier.label}
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <p className="text-xs text-[#5C5753] leading-relaxed line-clamp-2">
                  {tier.focus}
                </p>

                <div className="mt-4 pt-3 border-t border-[#EAE6DF] flex items-center justify-between text-[11px] font-semibold text-[#221F1F] group-hover:text-[#C86D51]">
                  <span>Browse titles</span>
                  <span>→</span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
