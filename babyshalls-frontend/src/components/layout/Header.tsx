'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { MegaMenu } from '@/components/common/MegaMenu';
import { USER_TOKEN_STORAGE_KEY } from '@/lib/axios';
import { ChevronDown, Menu, X } from 'lucide-react';

interface HeaderProps {
  onCategorySelect?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onCategorySelect }) => {
  const router = useRouter();
  const { totalItemsCount, searchQuery, setSearchQuery } = useCart();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const megaMenuTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterShop = () => {
    if (megaMenuTimerRef.current) {
      clearTimeout(megaMenuTimerRef.current);
      megaMenuTimerRef.current = null;
    }
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeaveShop = () => {
    if (megaMenuTimerRef.current) {
      clearTimeout(megaMenuTimerRef.current);
    }
    megaMenuTimerRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 280); // 280ms grace buffer so pointer moves into dropdown without collapsing
  };

  const handleCloseMegaMenuImmediate = () => {
    if (megaMenuTimerRef.current) {
      clearTimeout(megaMenuTimerRef.current);
      megaMenuTimerRef.current = null;
    }
    setIsMegaMenuOpen(false);
  };

  useEffect(() => {
    setMounted(true);
    const syncAuth = () => {
      try {
        setIsLoggedIn(Boolean(window.localStorage.getItem(USER_TOKEN_STORAGE_KEY)));
      } catch {
        setIsLoggedIn(false);
      }
    };
    syncAuth();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('babyshalls-auth-changed', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('babyshalls-auth-changed', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
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
    const trimmed = searchQuery.trim();
    setIsSearchOpen(false);
    if (trimmed) {
      router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/shop');
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 border-b ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(74,42,28,0.06)] border-[#E6D2C0]'
          : 'bg-white border-[#F2E4D6]'
        }`}
    >
      {/* Main Bar: Compact & Sleek (Height 64px mobile / 70px desktop) */}
      <div className="w-full">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[64px] sm:h-[70px]">

            {/* Left: Mobile Menu Trigger + Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-[#4A2A1C] p-1.5 hover:bg-[#FFF6EA] rounded transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
              </button>

              <Link href="/" className="inline-block relative py-0.5" aria-label="BabyShalls Home">
                <div className="relative w-[105px] sm:w-[125px] h-[40px] sm:h-[46px]">
                  <Image
                    src="/BabyShallsLogo 1.PNG"
                    alt="Baby Shall's"
                    fill
                    sizes="(max-width: 640px) 105px, 125px"
                    priority
                    className="object-contain object-left"
                  />
                </div>
              </Link>
            </div>

            {/* Center: Navigation Links matching Figma (Poppins Medium 14px UPPERCASE, gap: 24px) */}
            <nav className="hidden lg:flex items-center gap-6">
              {/* SHOP with Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={handleMouseEnterShop}
                onMouseLeave={handleMouseLeaveShop}
              >
                <div className="flex items-center gap-1">
                  <Link
                    href="/shop"
                    className="text-[14px] font-medium text-[#4A2A1C] hover:text-[#B05A26] transition-colors py-1 uppercase tracking-wide cursor-pointer"
                  >
                    SHOP
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsMegaMenuOpen((prev) => !prev)}
                    className="p-0.5 text-[#4A2A1C] hover:text-[#B05A26] transition-colors cursor-pointer"
                    aria-label="Toggle menu shop"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-[#B05A26]' : ''
                        }`}
                    />
                  </button>
                </div>
              </div>

              {/* <Link
                href="/shop?category=Preloved"
                className="text-[14px] font-medium text-[#4A2A1C] hover:text-[#B05A26] transition-colors py-1 uppercase tracking-wide"
              >
                PRELOVED
              </Link> */}

              <Link
                href="/events"
                className="text-[14px] font-medium text-[#4A2A1C] hover:text-[#B05A26] transition-colors py-1 uppercase tracking-wide"
              >
                EVENT &amp; WORKSHOP
              </Link>

              <Link
                href="/about"
                className="text-[14px] font-medium text-[#4A2A1C] hover:text-[#B05A26] transition-colors py-1 uppercase tracking-wide"
              >
                ABOUT
              </Link>

              <Link
                href="/request-a-book"
                className="text-[14px] font-medium text-[#4A2A1C] hover:text-[#B05A26] transition-colors py-1 uppercase tracking-wide"
              >
                REQUEST BUKU
              </Link>

              <Link
                href="/faq"
                className="text-[14px] font-medium text-[#4A2A1C] hover:text-[#B05A26] transition-colors py-1 uppercase tracking-wide"
              >
                FAQ
              </Link>
            </nav>

<<<<<<< HEAD
            {/* Right: Actions (Compact Icon 20x20 + Text 11px) */}
            <div className="flex items-center gap-4 sm:gap-5">

=======
            {/* Right: Actions (Desktop: Icon + Text, Mobile: Full Icon Only) */}
            <div className="flex items-center gap-2 sm:gap-5">
              
>>>>>>> a66eeab (test)
              {/* Cari */}
              <button
                type="button"
                onClick={toggleSearch}
                className="flex flex-col items-center justify-center p-1.5 sm:p-0 text-[#4A2A1C] hover:text-[#B05A26] transition-colors cursor-pointer group"
                aria-label="Pencarian"
              >
                <div className="w-[24px] h-[24px] sm:w-[20px] sm:h-[20px] flex items-center justify-center">
                  <Image
                    src="/images/icons/icon-search.svg"
                    alt="Cari"
                    width={22}
                    height={22}
                    className="object-contain transition-transform group-hover:scale-105"
                  />
                </div>
                <span className="hidden sm:inline text-[11px] font-semibold tracking-wider text-[#4A2A1C] group-hover:text-[#B05A26] mt-0.5">
                  Cari
                </span>
              </button>

              {/* Masuk / Akun */}
              <Link
<<<<<<< HEAD
                href={mounted && isLoggedIn ? '/account' : '/login'}
                className="flex flex-col items-center justify-center text-[#4A2A1C] hover:text-[#B05A26] transition-colors group"
                aria-label={mounted && isLoggedIn ? 'Akun saya' : 'Masuk ke akun'}
=======
                href="/account"
                className="flex flex-col items-center justify-center p-1.5 sm:p-0 text-[#4A2A1C] hover:text-[#B05A26] transition-colors group"
                aria-label="Akun saya"
>>>>>>> a66eeab (test)
              >
                <div className="w-[24px] h-[24px] sm:w-[20px] sm:h-[20px] flex items-center justify-center">
                  <Image
                    src="/images/icons/icon-user.svg"
<<<<<<< HEAD
                    alt={mounted && isLoggedIn ? 'Akun' : 'Masuk'}
                    width={18}
                    height={18}
                    className="object-contain transition-transform group-hover:scale-105"
                  />
                </div>
                <span className="text-[11px] font-semibold tracking-wider text-[#4A2A1C] group-hover:text-[#B05A26] mt-0.5">
                  {mounted && isLoggedIn ? 'Akun' : 'Masuk'}
=======
                    alt="Akun"
                    width={22}
                    height={22}
                    className="object-contain transition-transform group-hover:scale-105"
                  />
                </div>
                <span className="hidden sm:inline text-[11px] font-semibold tracking-wider text-[#4A2A1C] group-hover:text-[#B05A26] mt-0.5">
                  Akun
>>>>>>> a66eeab (test)
                </span>
              </Link>

              {/* Keranjang */}
              <Link
                href="/cart"
                className="relative flex flex-col items-center justify-center p-1.5 sm:p-0 text-[#4A2A1C] hover:text-[#B05A26] transition-colors cursor-pointer group"
                aria-label="Keranjang belanja"
              >
                <div className="relative w-[24px] h-[24px] sm:w-[20px] sm:h-[20px] flex items-center justify-center">
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
                      className="absolute -top-1.5 -right-2 bg-[#B05A26] text-white text-[10px] font-bold w-[17px] h-[17px] rounded-full flex items-center justify-center shadow-xs"
                    >
                      {totalItemsCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-[11px] font-semibold tracking-wider text-[#4A2A1C] group-hover:text-[#B05A26] mt-0.5">
                  Keranjang
                </span>
              </Link>

            </div>

          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <MegaMenu
          isOpen={isMegaMenuOpen}
          onClose={handleCloseMegaMenuImmediate}
          onMouseEnter={handleMouseEnterShop}
          onMouseLeave={handleMouseLeaveShop}
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
              href="/shop?category=Preloved"
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
            <Link
              href="/faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[16px] font-medium text-[#4A2A1C] hover:text-[#B05A26] uppercase"
            >
              FAQ
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
