'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onCategorySelect?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onCategorySelect }) => {
  const { totalItemsCount, setIsCartOpen, searchQuery, setSearchQuery } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const shopItems = [
    { label: 'All Products', href: '/shop', category: 'All', desc: 'Semua koleksi buku & mainan edukasi' },
    { label: 'Books', href: '/shop?category=Board+Books', category: 'Board Books', desc: 'Curated board books & picture stories' },
    { label: 'Toys', href: '/shop?category=Educational+Toys', category: 'Educational Toys', desc: 'Montessori & natural wooden play' },
    { label: 'Hampers', href: '/hampers', category: 'Hampers', desc: 'Bespoke baby gifts & keepsake boxes' },
    { label: 'Preloved Items', href: '/shop?category=Preloved+Item', category: 'Preloved Item', desc: 'Buku & mainan preloved terkurasi' }
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsShopDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsShopDropdownOpen(false);
    }, 150);
  };

  const handleShopItemClick = (item: typeof shopItems[0]) => {
    setIsShopDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (item.category && onCategorySelect) {
      onCategorySelect(item.category);
    }
    if (item.href.startsWith('/#')) {
      const id = item.href.replace('/#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Sleek, Sticky Navbar with Refined Backdrop */}
      <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EDE8E1] transition-all w-full">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          {/* Balanced header height: h-16 on mobile, h-18 on tablet, h-20 on desktop */}
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
            
            {/* 1. BabyShalls Brand Logo (Left) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-[#2C2725] p-2 rounded-md hover:bg-[#FBE7E3]/60 transition-colors focus:outline-none"
                aria-label="Buka menu navigasi"
              >
                <Menu size={22} strokeWidth={1.75} />
              </button>

              <Link
                href="/"
                className="flex items-center gap-2 group py-1"
                aria-label="BabyShalls Home"
              >
                <img
                  src="/BabyShallsLogo 1.PNG"
                  alt="BabyShalls Logo"
                  className="h-9 sm:h-11 md:h-13 w-auto object-contain transition-transform group-hover:scale-102"
                />
              </Link>
            </div>

            {/* Center Navigation: Exact Order:
                1. (Logo Left)
                2. Shop (Dropdown)
                3. Preloved Item
                4. Event & Workshop
                5. About
                6. FAQ
                7. Request a Book
            */}
            <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-[#2C2725]">
              
              {/* 2. Shop Dropdown */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setIsShopDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 py-2 hover:text-[#E07A5F] transition-colors cursor-pointer text-sm font-semibold ${
                    isShopDropdownOpen ? 'text-[#E07A5F]' : 'text-[#2C2725]'
                  }`}
                  aria-expanded={isShopDropdownOpen}
                >
                  <span>Shop</span>
                  <ChevronDown
                    size={15}
                    strokeWidth={1.75}
                    className={`transition-transform duration-200 ${
                      isShopDropdownOpen ? 'rotate-180 text-[#E07A5F]' : ''
                    }`}
                  />
                </button>

                {/* Refined Dropdown Menu */}
                {isShopDropdownOpen && (
                  <div className="absolute top-full left-0 w-68 pt-2 z-50">
                    <div className="bg-[#FFFDF9] border border-[#EDE8E1] rounded-lg shadow-md py-2.5">
                      {shopItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => handleShopItemClick(item)}
                          className="block px-4 py-2.5 hover:bg-[#FBE7E3]/60 transition-colors group"
                        >
                          <div className="text-sm font-semibold text-[#2C2725] group-hover:text-[#E07A5F]">
                            {item.label}
                          </div>
                          <div className="text-xs text-[#68625D]">
                            {item.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Preloved Item */}
              <Link
                href="/shop?category=Preloved+Item"
                className="hover:text-[#E07A5F] transition-colors text-sm font-semibold"
              >
                Preloved Item
              </Link>

              {/* 4. Event & Workshop */}
              <Link
                href="/events"
                className="hover:text-[#E07A5F] transition-colors text-sm font-semibold"
              >
                Event &amp; Workshop
              </Link>

              {/* 5. About */}
              <Link
                href="/about"
                className="hover:text-[#E07A5F] transition-colors text-sm font-semibold"
              >
                About
              </Link>

              {/* 6. FAQ */}
              <Link
                href="/faq"
                className="hover:text-[#E07A5F] transition-colors text-sm font-semibold"
              >
                FAQ
              </Link>

              {/* 7. Request a Book */}
              <Link
                href="/request-a-book"
                className="hover:text-[#E07A5F] transition-colors text-[#E07A5F] font-bold"
              >
                Request a Book
              </Link>
            </nav>

            {/* Right Utility Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4 text-[#2C2725]">
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hover:text-[#E07A5F] transition-colors p-2 rounded-full hover:bg-[#FBE7E3]/60 cursor-pointer"
                aria-label="Cari buku atau mainan"
              >
                <Search size={20} strokeWidth={1.75} />
              </button>

              <Link
                href="/account"
                className="hover:text-[#E07A5F] transition-colors p-2 rounded-full hover:bg-[#FBE7E3]/60"
                aria-label="Akun Saya &amp; Riwayat Pesanan"
                title="Akun Saya &amp; Riwayat Pesanan"
              >
                <User size={20} strokeWidth={1.75} />
              </Link>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative hover:text-[#E07A5F] transition-colors p-2 rounded-full hover:bg-[#FBE7E3]/60 flex items-center cursor-pointer"
                aria-label="Buka Keranjang Belanja"
              >
                <ShoppingBag size={20} strokeWidth={1.75} />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E07A5F] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>

          </div>

          {/* Minimal Search Dropdown Bar */}
          {isSearchOpen && (
            <div className="py-4 border-t border-[#EDE8E1] animate-in fade-in duration-150">
              <div className="relative max-w-2xl mx-auto flex items-center">
                <Search size={18} strokeWidth={1.75} className="absolute left-3 text-[#68625D]" />
                <input
                  type="text"
                  placeholder="Cari buku, mainan, atau penulis (contoh: Eric Carle, Board Books)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-16 py-2.5 text-sm bg-white border border-[#EDE8E1] rounded-md text-[#2C2725] placeholder-[#8C8782] focus:outline-none focus:border-[#E07A5F]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-xs text-[#68625D] hover:text-[#2C2725] px-2 py-1"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer (Slide-Over from Left for Superior Mobile Experience) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-sm bg-[#FFFDF9] h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-left duration-300 border-r border-[#EDE8E1]">
            <div className="p-6">
              
              {/* Drawer Top Header with Logo & Close Button */}
              <div className="flex items-center justify-between pb-6 border-b border-[#EDE8E1]">
                <img
                  src="/BabyShallsLogo 1.PNG"
                  alt="BabyShalls Logo"
                  className="h-12 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#2C2725] hover:text-[#E07A5F] hover:bg-[#FBE7E3]/60 rounded-md transition-colors"
                  aria-label="Tutup menu"
                >
                  <X size={22} strokeWidth={1.75} />
                </button>
              </div>

              {/* Search Bar inside Drawer */}
              <div className="mt-5">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#68625D]" />
                  <input
                    type="text"
                    placeholder="Cari buku..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#EDE8E1] rounded-md focus:outline-none focus:border-[#E07A5F]"
                  />
                </div>
              </div>

              {/* Navigation Items (Touch targets >= 48px) */}
              <div className="mt-6 space-y-1 text-left">
                
                {/* Shop Expandable */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsMobileShopOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between py-3.5 px-3 rounded-md text-base font-semibold text-[#2C2725] hover:bg-[#FBE7E3]/50 transition-colors"
                  >
                    <span>Shop</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-200 ${isMobileShopOpen ? 'rotate-180 text-[#E07A5F]' : ''}`}
                    />
                  </button>

                  {isMobileShopOpen && (
                    <div className="ml-3 pl-3 border-l-2 border-[#E07A5F]/40 space-y-1 py-1">
                      {shopItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => handleShopItemClick(item)}
                          className="block py-2.5 px-2 text-sm font-medium text-[#68625D] hover:text-[#E07A5F] rounded transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/shop?category=Preloved+Item"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-3 rounded-md text-base font-semibold text-[#2C2725] hover:bg-[#FBE7E3]/50 transition-colors"
                >
                  Preloved Item
                </Link>

                <Link
                  href="/events"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-3 rounded-md text-base font-semibold text-[#2C2725] hover:bg-[#FBE7E3]/50 transition-colors"
                >
                  Event &amp; Workshop
                </Link>

                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-3 rounded-md text-base font-semibold text-[#2C2725] hover:bg-[#FBE7E3]/50 transition-colors"
                >
                  About
                </Link>

                <Link
                  href="/faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-3 rounded-md text-base font-semibold text-[#2C2725] hover:bg-[#FBE7E3]/50 transition-colors"
                >
                  FAQ
                </Link>

                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-3 rounded-md text-base font-semibold text-[#2C2725] hover:bg-[#FBE7E3]/50 transition-colors"
                >
                  Akun &amp; Riwayat Pesanan
                </Link>

                <div className="pt-2">
                  <Link
                    href="/request-a-book"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-4 bg-[#E07A5F] text-white rounded-md text-sm font-semibold transition-colors shadow-xs"
                  >
                    <span>Request a Book</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>

              </div>
            </div>

            {/* Drawer Bottom Info */}
            <div className="p-6 border-t border-[#EDE8E1] bg-white space-y-3 text-left">
              <div className="text-xs text-[#68625D]">
                <p className="font-semibold text-[#2C2725]">Butik BabyShalls</p>
                <p>Citraland Puncak Tidar Blok HH-26, Malang</p>
                <p className="mt-1 text-[11px]">Buka Selasa – Minggu: 10.00 – 19.00 WIB</p>
              </div>

              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xs font-semibold uppercase tracking-wider text-[#E07A5F] hover:underline"
              >
                Portal Admin Kurator →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
