'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Check, Eye, ShoppingBag } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '../../context/CartContext';
import { PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { isReducedMotion } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const NewArrivalsSection: React.FC = () => {
  const { addItem } = useCart();
  const [activeFilter, setActiveFilter] = useState<'all' | 'Ages 1-3' | 'Ages 3+' | 'Books' | 'Toys'>('all');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const productsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (productsGridRef.current) {
        const cards = productsGridRef.current.querySelectorAll('.product-card');
        gsap.fromTo(
          cards,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.07,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: productsGridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    setRecentlyAddedId(product.id);

    // Subtle tactile button pop
    const target = e.currentTarget as HTMLElement;
    if (!isReducedMotion()) {
      gsap.timeline()
        .to(target, { scale: 0.85, duration: 0.1, ease: 'power2.in' })
        .to(target, { scale: 1.15, duration: 0.2, ease: 'back.out(2)' })
        .to(target, { scale: 1, duration: 0.15 });
    }

    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1500);
  };

  return (
    <section ref={containerRef} className="py-12 lg:py-16 bg-[#FFF8EF]" id="new-arrivals">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading with Sunburst Rays */}
        <div ref={headingRef} className="text-center mb-6 will-change-transform">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6B3F2A] flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1 opacity-80" aria-hidden="true">
              <span className="w-1 h-3 bg-[#F6C95E] rounded-full transform -rotate-30"></span>
              <span className="w-1 h-4 bg-[#F6C95E] rounded-full"></span>
              <span className="w-1 h-3 bg-[#F6C95E] rounded-full transform rotate-30"></span>
            </span>

            <span>New Arrivals</span>

            <span className="inline-flex items-center gap-1 opacity-80" aria-hidden="true">
              <span className="w-1 h-3 bg-[#F6C95E] rounded-full transform -rotate-30"></span>
              <span className="w-1 h-4 bg-[#F6C95E] rounded-full"></span>
              <span className="w-1 h-3 bg-[#F6C95E] rounded-full transform rotate-30"></span>
            </span>
          </h2>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center justify-center gap-2.5 mb-10 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#DA7A5B] text-white shadow-subtle'
                : 'bg-[#FFFDF9] border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setActiveFilter('Ages 1-3')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'Ages 1-3'
                ? 'bg-[#DA7A5B] text-white shadow-subtle'
                : 'bg-[#FFFDF9] border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            Ages 1–3
          </button>
          <button
            onClick={() => setActiveFilter('Ages 3+')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'Ages 3+'
                ? 'bg-[#DA7A5B] text-white shadow-subtle'
                : 'bg-[#FFFDF9] border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            Ages 3+
          </button>
          <button
            onClick={() => setActiveFilter('Books')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'Books'
                ? 'bg-[#DA7A5B] text-white shadow-subtle'
                : 'bg-[#FFFDF9] border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            Books Only
          </button>
          <button
            onClick={() => setActiveFilter('Toys')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'Toys'
                ? 'bg-[#DA7A5B] text-white shadow-subtle'
                : 'bg-[#FFFDF9] border border-[#EEDBC9] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            Toys Only
          </button>
        </div>

        {/* 4 Products Grid */}
        <div ref={productsGridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Product 1: Look and Grow: Nature */}
          <div className="product-card bg-[#FFFDF9] border border-[#EEDBC9] rounded-[20px] p-3.5 sm:p-4 flex flex-col justify-between shadow-subtle hover:shadow-hover hover:-translate-y-1 transition-all group will-change-transform">
            <div>
              <div className="mb-2.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#CFE3C4] text-[#5B3A29] text-[11px] font-bold">
                  Ages 1-3
                </span>
              </div>

              {/* Cover Artwork Container (Sunflower) with subtle hover zoom */}
              <div className="w-full aspect-square rounded-[14px] bg-[#8AC4D0] flex flex-col items-center justify-center p-3 relative overflow-hidden shadow-xs mb-3 group-hover:shadow-subtle transition-shadow">
                <div className="absolute left-0 inset-y-0 w-2.5 bg-black/10 border-r border-white/20"></div>
                <div className="font-serif text-xs sm:text-sm font-extrabold text-white text-center leading-tight mb-1">
                  Look and<br />Grow: Nature
                </div>
                <svg
                  viewBox="0 0 100 100"
                  className="w-16 h-16 sm:w-20 sm:h-20 transform group-hover:scale-108 transition-transform duration-300 ease-out"
                >
                  <g fill="#F6C95E">
                    <circle cx="50" cy="20" r="10" />
                    <circle cx="50" cy="80" r="10" />
                    <circle cx="20" cy="50" r="10" />
                    <circle cx="80" cy="50" r="10" />
                    <circle cx="28" cy="28" r="10" />
                    <circle cx="72" cy="72" r="10" />
                    <circle cx="28" cy="72" r="10" />
                    <circle cx="72" cy="28" r="10" />
                  </g>
                  <circle cx="50" cy="50" r="22" fill="#6B3F2A" />
                </svg>
                <div className="text-[9px] font-bold text-white tracking-widest mt-1">BOARD BOOK</div>
              </div>

              <Link href="/product/look-and-grow-nature">
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#6B3F2A] group-hover:text-[#DA7A5B] transition-colors line-clamp-1">
                  Look and Grow: Nature
                </h3>
              </Link>
              <p className="text-xs text-[#8FA87E] font-medium mt-0.5">Board Book</p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#EEDBC9]/60 flex items-center justify-between">
              <span className="font-extrabold text-sm sm:text-base text-[#DA7A5B]">
                Rp175.500
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-1">
              <Link
                href="/product/look-and-grow-nature"
                className="py-1.5 px-2 rounded-xl border border-[#EEDBC9] hover:border-[#DA7A5B] bg-white hover:bg-[#FFE4D0]/50 text-[#502E1E] text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"
                title="Lihat Detail Produk"
              >
                <Eye className="w-3.5 h-3.5 text-[#DA7A5B]" />
                <span>Detail</span>
              </Link>
              <button
                type="button"
                onClick={(e) => handleAddToCart(PRODUCTS[0], e)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs ${
                  recentlyAddedId === PRODUCTS[0].id
                    ? 'bg-[#709154] text-white'
                    : 'bg-[#DA7A5B] hover:bg-[#C46749] text-white active:scale-95'
                }`}
                title="Tambah ke Keranjang"
              >
                {recentlyAddedId === PRODUCTS[0].id ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Masuk!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>+ Beli</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Product 2: Forest Friends */}
          <div className="product-card bg-[#FFFDF9] border border-[#EEDBC9] rounded-[20px] p-3.5 sm:p-4 flex flex-col justify-between shadow-subtle hover:shadow-hover hover:-translate-y-1 transition-all group will-change-transform">
            <div>
              <div className="mb-2.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#CFE3C4] text-[#5B3A29] text-[11px] font-bold">
                  Ages 3+
                </span>
              </div>

              {/* Cover Artwork Container (Fox) */}
              <div className="w-full aspect-square rounded-[14px] bg-[#6C9A8B] flex flex-col items-center justify-center p-3 relative overflow-hidden shadow-xs mb-3 group-hover:shadow-subtle transition-shadow">
                <div className="absolute left-0 inset-y-0 w-2.5 bg-black/10 border-r border-white/20"></div>
                <div className="font-serif text-xs sm:text-sm font-extrabold text-white text-center leading-tight mb-1">
                  Forest Friends
                </div>
                <svg
                  viewBox="0 0 100 100"
                  className="w-16 h-16 sm:w-20 sm:h-20 transform group-hover:scale-108 transition-transform duration-300 ease-out"
                >
                  <polygon points="25,75 35,55 45,75" fill="#4E7C6E" />
                  <polygon points="65,75 75,55 85,75" fill="#4E7C6E" />
                  <polygon points="50,78 35,52 65,52" fill="#DA7A5B" />
                  <polygon points="35,52 38,40 46,50" fill="#DA7A5B" />
                  <polygon points="65,52 62,40 54,50" fill="#DA7A5B" />
                  <polygon points="50,78 35,52 45,58" fill="#FFFFFF" />
                  <polygon points="50,78 65,52 55,58" fill="#FFFFFF" />
                  <circle cx="50" cy="74" r="2" fill="#6B3F2A" />
                </svg>
                <div className="text-[9px] font-bold text-white tracking-widest mt-1">PICTURE BOOK</div>
              </div>

              <Link href="/product/forest-friends-picture-book">
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#6B3F2A] group-hover:text-[#DA7A5B] transition-colors line-clamp-1">
                  Forest Friends
                </h3>
              </Link>
              <p className="text-xs text-[#8FA87E] font-medium mt-0.5">Picture Book</p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#EEDBC9]/60 flex items-center justify-between">
              <span className="font-extrabold text-sm sm:text-base text-[#DA7A5B]">
                Rp189.000
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-1">
              <Link
                href="/product/forest-friends-picture-book"
                className="py-1.5 px-2 rounded-xl border border-[#EEDBC9] hover:border-[#DA7A5B] bg-white hover:bg-[#FFE4D0]/50 text-[#502E1E] text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"
                title="Lihat Detail Produk"
              >
                <Eye className="w-3.5 h-3.5 text-[#DA7A5B]" />
                <span>Detail</span>
              </Link>
              <button
                type="button"
                onClick={(e) => handleAddToCart(PRODUCTS[1], e)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs ${
                  recentlyAddedId === PRODUCTS[1].id
                    ? 'bg-[#709154] text-white'
                    : 'bg-[#DA7A5B] hover:bg-[#C46749] text-white active:scale-95'
                }`}
                title="Tambah ke Keranjang"
              >
                {recentlyAddedId === PRODUCTS[1].id ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Masuk!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>+ Beli</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Product 3: Wooden Rainbow */}
          <div className="product-card bg-[#FFFDF9] border border-[#EEDBC9] rounded-[20px] p-3.5 sm:p-4 flex flex-col justify-between shadow-subtle hover:shadow-hover hover:-translate-y-1 transition-all group will-change-transform">
            <div>
              <div className="mb-2.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#CFE3C4] text-[#5B3A29] text-[11px] font-bold">
                  Ages 1-3
                </span>
              </div>

              <div className="w-full aspect-square rounded-[14px] bg-[#FCF6EC] border border-[#EEDBC9]/60 flex flex-col items-center justify-center p-3 relative overflow-hidden shadow-xs mb-3 group-hover:shadow-subtle transition-shadow">
                <svg
                  viewBox="0 0 100 80"
                  className="w-20 h-16 sm:w-24 sm:h-20 transform group-hover:scale-108 transition-transform duration-300 ease-out"
                >
                  <path d="M10,70 A40,40 0 0,1 90,70" stroke="#DA7A5B" strokeWidth="8" fill="none" strokeLinecap="round" />
                  <path d="M18,70 A32,32 0 0,1 82,70" stroke="#F6C95E" strokeWidth="8" fill="none" strokeLinecap="round" />
                  <path d="M26,70 A24,24 0 0,1 74,70" stroke="#8FA87E" strokeWidth="8" fill="none" strokeLinecap="round" />
                  <path d="M34,70 A16,16 0 0,1 66,70" stroke="#6EA8CD" strokeWidth="8" fill="none" strokeLinecap="round" />
                  <path d="M42,70 A8,8 0 0,1 58,70" stroke="#EFB6B0" strokeWidth="8" fill="none" strokeLinecap="round" />
                </svg>
              </div>

              <Link href="/product/wooden-rainbow-stacker">
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#6B3F2A] group-hover:text-[#DA7A5B] transition-colors line-clamp-1">
                  Wooden Rainbow
                </h3>
              </Link>
              <p className="text-xs text-[#8FA87E] font-medium mt-0.5">Stacker</p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#EEDBC9]/60 flex items-center justify-between">
              <span className="font-extrabold text-sm sm:text-base text-[#DA7A5B]">
                Rp249.000
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-1">
              <Link
                href="/product/wooden-rainbow-stacker"
                className="py-1.5 px-2 rounded-xl border border-[#EEDBC9] hover:border-[#DA7A5B] bg-white hover:bg-[#FFE4D0]/50 text-[#502E1E] text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"
                title="Lihat Detail Produk"
              >
                <Eye className="w-3.5 h-3.5 text-[#DA7A5B]" />
                <span>Detail</span>
              </Link>
              <button
                type="button"
                onClick={(e) => handleAddToCart(PRODUCTS[2], e)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs ${
                  recentlyAddedId === PRODUCTS[2].id
                    ? 'bg-[#709154] text-white'
                    : 'bg-[#DA7A5B] hover:bg-[#C46749] text-white active:scale-95'
                }`}
                title="Tambah ke Keranjang"
              >
                {recentlyAddedId === PRODUCTS[2].id ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Masuk!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>+ Beli</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Product 4: Wooden Shape Sorter */}
          <div className="product-card bg-[#FFFDF9] border border-[#EEDBC9] rounded-[20px] p-3.5 sm:p-4 flex flex-col justify-between shadow-subtle hover:shadow-hover hover:-translate-y-1 transition-all group will-change-transform">
            <div>
              <div className="mb-2.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFE4D0] text-[#DA7A5B] text-[11px] font-bold">
                  Ages 3+
                </span>
              </div>

              <div className="w-full aspect-square rounded-[14px] bg-[#FCF6EC] border border-[#EEDBC9]/60 flex flex-col items-center justify-center p-3 relative overflow-hidden shadow-xs mb-3 group-hover:shadow-subtle transition-shadow">
                <svg
                  viewBox="0 0 100 90"
                  className="w-18 h-18 sm:w-22 sm:h-22 transform group-hover:scale-108 transition-transform duration-300 ease-out"
                >
                  <rect x="25" y="40" width="50" height="42" rx="4" fill="#CBA989" />
                  <polygon points="50,15 18,42 82,42" fill="#DA7A5B" />
                  <circle cx="38" cy="54" r="6" fill="#6B3F2A" />
                  <rect x="54" y="48" width="12" height="12" rx="2" fill="#6B3F2A" />
                  <polygon points="50,66 43,76 57,76" fill="#6B3F2A" />
                </svg>
              </div>

              <Link href="/product/wooden-shape-sorter-montessori">
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#6B3F2A] group-hover:text-[#DA7A5B] transition-colors line-clamp-1">
                  Wooden Shape Sorter
                </h3>
              </Link>
              <p className="text-xs text-[#8FA87E] font-medium mt-0.5">Montessori Toy</p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#EEDBC9]/60 flex items-center justify-between">
              <span className="font-extrabold text-sm sm:text-base text-[#DA7A5B]">
                Rp299.000
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-1">
              <Link
                href="/product/wooden-shape-sorter-montessori"
                className="py-1.5 px-2 rounded-xl border border-[#EEDBC9] hover:border-[#DA7A5B] bg-white hover:bg-[#FFE4D0]/50 text-[#502E1E] text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"
                title="Lihat Detail Produk"
              >
                <Eye className="w-3.5 h-3.5 text-[#DA7A5B]" />
                <span>Detail</span>
              </Link>
              <button
                type="button"
                onClick={(e) => handleAddToCart(PRODUCTS[3], e)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs ${
                  recentlyAddedId === PRODUCTS[3].id
                    ? 'bg-[#709154] text-white'
                    : 'bg-[#DA7A5B] hover:bg-[#C46749] text-white active:scale-95'
                }`}
                title="Tambah ke Keranjang"
              >
                {recentlyAddedId === PRODUCTS[3].id ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Masuk!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>+ Beli</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
