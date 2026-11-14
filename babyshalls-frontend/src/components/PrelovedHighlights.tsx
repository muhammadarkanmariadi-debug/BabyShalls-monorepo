'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Check, Recycle, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { formatIDR } from '../data/mockProducts';
import { useCart } from '../context/CartContext';

export const PrelovedHighlights: React.FC = () => {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  // Preloved curated items with authentic condition ratings
  const prelovedItems: (Product & { conditionGrade: string; originalPrice: number; conditionNote: string })[] = [
    {
      id: 'preloved-01',
      title: 'Where the Wild Things Are',
      author: 'Maurice Sendak',
      category: 'Picture Books',
      ageGroup: '3–5 Years',
      price: 95000,
      originalPrice: 195000,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      description: 'The Caldecott Medal-winning masterwork. A wild adventure into the land of imagination.',
      inStock: true,
      badge: 'Preloved',
      conditionGrade: 'Like New (9.5/10)',
      conditionNote: 'Crisp spine, zero pencil marks, minor edge wear on dust jacket.'
    },
    {
      id: 'preloved-02',
      title: 'Brown Bear, Brown Bear, What Do You See?',
      author: 'Bill Martin Jr. & Eric Carle',
      category: 'Board Books',
      ageGroup: '0–2 Years',
      price: 78000,
      originalPrice: 155000,
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      description: 'Classic rhyming board book introducing colors and animals to little hands.',
      inStock: true,
      badge: 'Preloved',
      conditionGrade: 'Excellent (9/10)',
      conditionNote: 'Sturdy pages intact, cleaned and sanitised with child-safe UV.'
    },
    {
      id: 'preloved-03',
      title: 'We’re Going on a Bear Hunt',
      author: 'Michael Rosen & Helen Oxenbury',
      category: 'Picture Books',
      ageGroup: '3–5 Years',
      price: 88000,
      originalPrice: 180000,
      coverImage: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80',
      description: 'The beloved chant-along picture book adventure through swishy grass and deep rivers.',
      inStock: true,
      badge: 'Preloved',
      conditionGrade: 'Like New (9.5/10)',
      conditionNote: 'Pristine pages, hardcover in beautiful shape.'
    },
    {
      id: 'preloved-04',
      title: 'Goodnight Moon (Board Book)',
      author: 'Margaret Wise Brown',
      category: 'Board Books',
      ageGroup: '0–2 Years',
      price: 82000,
      originalPrice: 165000,
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      description: 'In the great green room, a little bunny says goodnight to all the familiar things.',
      inStock: true,
      badge: 'Preloved',
      conditionGrade: 'Very Good (8.8/10)',
      conditionNote: 'Gently loved, all corners clean and firm.'
    }
  ];

  const handleQuickAdd = (e: React.MouseEvent, item: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item, 1);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="preloved" className="py-16 md:py-24 bg-[#FAF8F5] border-b border-[#EAE6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#EAE6DF] gap-4 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF2E8] border border-[#8FA882]/40 text-[#546e49] text-[10px] font-semibold uppercase tracking-wider mb-2">
              <Recycle size={11} strokeWidth={1.5} />
              <span>Sustainable Circular Reading</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#221F1F]">
              Preloved Treasury
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#5C5753] max-w-xl">
              Certified genuine imported books gently read by fellow families. Each copy is individually inspected, graded, and UV-sanitised at our Malang studio.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#5C5753]">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-[#8FA882]" />
              <span>Individually Curated</span>
            </span>
            <span>•</span>
            <span>Up to 50% off original retail</span>
          </div>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
          {prelovedItems.map((item) => {
            const isJustAdded = addedId === item.id;

            return (
              <div key={item.id} className="group relative flex flex-col text-left">
                {/* 3:4 Cover Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-white rounded-md border border-[#EAE6DF] shadow-xs">
                  <Link href={`/product/${item.id}`} className="block w-full h-full">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                      loading="lazy"
                    />
                  </Link>

                  {/* Preloved Condition Badge */}
                  <div className="absolute top-2.5 left-2.5 pointer-events-none">
                    <span className="bg-[#EBF2E8] text-[#3D5632] border border-[#8FA882]/50 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-xs">
                      {item.conditionGrade}
                    </span>
                  </div>

                  {/* Terracotta Add to Bag on Hover */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, item)}
                      className={`w-9 h-9 rounded-md flex items-center justify-center shadow-xs cursor-pointer transition-colors ${
                        isJustAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#C86D51] hover:bg-[#b2583d] text-white'
                      }`}
                      aria-label={`Add preloved copy of ${item.title} to bag`}
                      title="Add to Bag"
                    >
                      {isJustAdded ? (
                        <Check size={16} strokeWidth={2} />
                      ) : (
                        <ShoppingBag size={15} strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Preloved Metadata */}
                <div className="mt-3 space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-[#8FA882] font-semibold">
                    Preloved • {item.ageGroup}
                  </div>

                  <Link href={`/product/${item.id}`} className="block">
                    <h3 className="text-sm font-semibold text-[#221F1F] line-clamp-1 group-hover:text-[#C86D51] transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#5C5753] line-clamp-1">
                    {item.author}
                  </p>

                  <p className="text-[11px] text-[#5C5753] italic line-clamp-1">
                    {item.conditionNote}
                  </p>

                  <div className="pt-1 flex items-baseline gap-2">
                    <span className="text-sm font-bold text-[#C86D51]">
                      {formatIDR(item.price)}
                    </span>
                    <span className="text-xs text-[#8C8782] line-through">
                      {formatIDR(item.originalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

