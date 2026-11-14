'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface CategoryShowcaseProps {
  onSelectCategory?: (category: string) => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'Board Books',
      title: 'Books',
      subtitle: 'Board Books & Picture Stories',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      tag: 'Curated'
    },
    {
      id: 'Educational Toys',
      title: 'Toys',
      subtitle: 'Natural Wood & Montessori',
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      tag: 'Sensory'
    },
    {
      id: 'Hampers',
      title: 'Hampers',
      subtitle: 'Newborn Gifts & Keepsake Sets',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      tag: 'Gift Ready'
    },
    {
      id: 'All',
      title: 'Collections',
      subtitle: 'Seasonal & Thematic Edits',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      tag: 'Full Catalog'
    }
  ];

  const handleClick = (categoryId: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-20 bg-[#FAF8F5] border-b border-[#EAE6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#EAE6DF] gap-4 text-left">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#5C5753] block mb-1">
              Shop by Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#221F1F]">
              Explore Our Curations
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5C5753] max-w-sm">
            Four primary disciplines crafted to cultivate literacy, fine motor coordination, and wonder.
          </p>
        </div>

        {/* 4 Category Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <button
              key={cat.title}
              type="button"
              onClick={() => handleClick(cat.id)}
              className="group relative flex flex-col text-left bg-white border border-[#EAE6DF] rounded-md overflow-hidden transition-all hover:border-[#C86D51] cursor-pointer"
            >
              {/* Image Container with 4:5 Aspect Ratio */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F4EFEA]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#FAF8F5]/90 border border-[#EAE6DF] px-2 py-0.5 rounded-sm text-[10px] font-medium text-[#221F1F]">
                  {cat.tag}
                </div>
              </div>

              {/* Minimal Label Below Image */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#221F1F] group-hover:text-[#C86D51] transition-colors leading-snug">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#5C5753] mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center text-[#5C5753] group-hover:bg-[#C86D51] group-hover:text-white group-hover:border-[#C86D51] transition-colors shrink-0 ml-2">
                  <ArrowUpRight size={14} strokeWidth={1.5} />
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
