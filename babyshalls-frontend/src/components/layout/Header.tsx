'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { MegaMenu } from '@/components/common/MegaMenu';
import { ChevronDown, Menu, X } from 'lucide-react';

interface HeaderProps {
  onCategorySelect?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onCategorySelect }) => {
  const { totalItemsCount, setIsCartOpen, searchQuery, setSearchQuery } = useCart();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white transition-all w-full border-b border-[#F2E4D6]">
      {/* Main Bar: Figma #131:39041 - Height 96px */}
      <div className="w-full bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
          <div className="flex items-center justify-between min-h-[96px] py-1">
            
            {/* Left: Mobile Menu Trigger + Brand Logo (Bigger & Prominent) */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-[#4A2A1C] p-2 hover:bg-[#FFF6EA] rounded transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link href="/" className="inline-block relative py-1" aria-label="BabyShalls Home">
                <div className="relative w-[125px] sm:w-[155px] lg:w-[175px] h-[86px] sm:h-[92px]">
                  <Image
                    src="/BabyShallsLogo 1.PNG"
                    alt="Baby Shall's"
                    fill
                    sizes="(max-width: 640px) 125px, (max-width: 1024px) 155px, 175px"
                    priority
                    className="object-contain object-left"
                  />
                </div>
              </Link>
            </div>

            {/* Center: Navigation Links matching Figma (Poppins Medium 16px UPPERCASE, gap: 28px) */}
            <nav className="hidden lg:flex items-center gap-7">
              {/* SHOP with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  className="flex items-center gap-1 text-[16px] font-medium text-[#4A2A1C] hover:text-[#B05A26] transition-colors py-2 uppercase tracking-wide cursor-pointer"
                >
                  <span>SHOP</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      isMegaMenuOpen ? 'rotate-180 text-[#B05A26]' : ''
                    }`}
                  />
                </button>
              </div>

              <Link
                href="/preloved"
                className="text-[16px] font-medium text-[#4A2A1C] hover:text-[#B05A26] transition-colors py-2 uppercase tracking-wide"
              >
                PRELOVED
              </Link>

              <Link
                href="/events"
                className="text-[16px] font-medium text-[#4A2A1C] hover:text-[#B05A26] transition-colors py-2 uppercase tracking-wide"
              >
                EVENT &amp; WORKSHOP
              </Link>

              <Link
                href="/about"
                className="text-[16px] font-medium text-[#4A2A1C] hover:text-[#B05A26] transition-colors py-2 uppercase tracking-wide"
              >
                ABOUT
              </Link>

              <Link
                href="/request-a-book"
                className="text-[16px] font-medium text-[#4A2A1C] hover:text-[#B05A26] transition-colors py-2 uppercase tracking-wide"
              >
                REQUEST BUKU
              </Link>
            </nav>

            {/* Right: Actions matching Figma (Icon 26x26 + Text 12px SemiBold) */}
            <div className="flex items-center gap-6">
              
              {/* Cari */}
              <button
                type="button"
                onClick={toggleSearch}
                className="flex flex-col items-center justify-center gap-1 text-[#4A2A1C] hover:text-[#B05A26] transition-colors cursor-pointer group"
                aria-label="Pencarian"
              >
                <div className="w-[26px] h-[26px] flex items-center justify-center">
                  <Image
                    src="/images/icons/icon-search.svg"
                    alt="Cari"
                    width={22}
                    height={22}
                    className="object-contain transition-transform group-hover:scale-105"
                  />
                </div>
                <span className="text-[12px] font-semibold tracking-[0.08em] text-[#4A2A1C] group-hover:text-[#B05A26]">
                  Cari
                </span>
              </button>

              {/* Akun */}
              <Link
                href="/account"
                className="flex flex-col items-center justify-center gap-1 text-[#4A2A1C] hover:text-[#B05A26] transition-colors group"
                aria-label="Akun saya"
              >
                <div className="w-[26px] h-[26px] flex items-center justify-center">
                  <Image
                    src="/images/icons/icon-user.svg"
                    alt="Akun"
                    width={22}
                    height={22}
                    className="object-contain transition-transform group-hover:scale-105"
                  />
                </div>
                <span className="text-[12px] font-semibold tracking-[0.08em] text-[#4A2A1C] group-hover:text-[#B05A26]">
                  Akun
                </span>
              </Link>

              {/* Keranjang with Figma Counter Badge */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex flex-col items-center justify-center gap-1 text-[#4A2A1C] hover:text-[#B05A26] transition-colors cursor-pointer group"
                aria-label="Keranjang belanja"
              >
                <div className="relative w-[26px] h-[26px] flex items-center justify-center">
                  <Image
                    src="/images/icons/icon-cart.svg"
                    alt="Keranjang"
                    width={22}
                    height={22}
                    className="object-contain transition-transform group-hover:scale-105"
                  />
                  {mounted && totalItemsCount > 0 && (
                    <span
                      suppressHydrationWarning
                      className="absolute -top-1.5 -right-2.5 bg-[#B05A26] text-white text-[11px] font-semibold w-[20px] h-[20px] rounded-full flex items-center justify-center shadow-xs"
                    >
                      {totalItemsCount}
                    </span>
                  )}
                </div>
                <span className="text-[12px] font-semibold tracking-[0.08em] text-[#4A2A1C] group-hover:text-[#B05A26]">
                  Keranjang
                </span>
              </button>

            </div>

          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <MegaMenu
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
          onSelectCategory={onCategorySelect}
        />

        {/* Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="border-t border-[#F2E4D6] bg-[#FFFBF5] px-6 py-4 animate-in fade-in duration-150">
            <div className="max-w-[760px] mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul buku, mainan, atau topik edukasi..."
                  className="w-full bg-white border border-[#E6D2C0] rounded-[2px] py-3 pl-11 pr-24 text-[14px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26] shadow-xs"
                />
                <Image
                  src="/images/icons/icon-search.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="absolute left-3.5 opacity-60 pointer-events-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-1.5 bg-[#B05A26] hover:bg-[#8E431A] text-white text-[13px] font-medium rounded-[2px] transition-colors"
                >
                  Cari
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#F2E4D6] bg-white px-6 py-6 space-y-4 animate-in fade-in">
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[16px] font-medium text-[#4A2A1C] hover:text-[#B05A26] uppercase"
            >
              SHOP
            </Link>
            <Link
              href="/preloved"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[16px] font-medium text-[#4A2A1C] hover:text-[#B05A26] uppercase"
            >
              PRELOVED
            </Link>
            <Link
              href="/events"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[16px] font-medium text-[#4A2A1C] hover:text-[#B05A26] uppercase"
            >
              EVENT &amp; WORKSHOP
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[16px] font-medium text-[#4A2A1C] hover:text-[#B05A26] uppercase"
            >
              ABOUT
            </Link>
            <Link
              href="/request-a-book"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[16px] font-medium text-[#4A2A1C] hover:text-[#B05A26] uppercase"
            >
              REQUEST BUKU
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
