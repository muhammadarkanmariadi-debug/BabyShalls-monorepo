'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { StripInfo } from '@/components/common/StripInfo';
import { MegaMenu } from '@/components/common/MegaMenu';
import { X, Search } from 'lucide-react';

interface HeaderProps {
  onCategorySelect?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onCategorySelect }) => {
  const { totalItemsCount, setIsCartOpen, searchQuery, setSearchQuery } = useCart();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    <header className="sticky top-0 z-40 bg-white transition-all w-full shadow-none">
      {/* Strip Info Announcement */}
      <StripInfo />

      {/* Main Bar */}
      <div className="w-full border-b border-[#EBEBEB] bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-center justify-between h-[72px]">
            
            {/* Left: Hamburger (Mobile) + Logo */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-[#2B2B2B] p-1.5 rounded-md hover:bg-[#F0F0F0] transition-colors focus:outline-none cursor-pointer"
                aria-label="Buka menu navigasi"
              >
                <img
                  src="/images/icons/icon-menu.svg"
                  alt="Menu"
                  className="w-6 h-6 object-contain"
                />
              </button>

              <Link href="/" className="flex items-center gap-2 group py-1" aria-label="BabyShalls Home">
                <img
                  src="/BabyShallsLogo 1.PNG"
                  alt="BabyShalls Logo"
                  className="hidden sm:block h-[38px] w-auto object-contain transition-transform group-hover:scale-102"
                />
                <img
                  src="/BabyShallsIcon.png"
                  alt="BabyShalls Icon"
                  className="block sm:hidden h-[34px] w-auto object-contain"
                />
              </Link>
            </div>

            {/* Center: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-7 text-[14px] font-medium text-[#2B2B2B]">
              {/* Shop with Mega Menu Trigger */}
              <div
                className="relative py-4"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
              >
                <button
                  type="button"
                  onClick={() => setIsMegaMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 hover:text-[#D9744A] transition-colors cursor-pointer text-[14px] font-medium text-[#2B2B2B]"
                  aria-expanded={isMegaMenuOpen}
                >
                  <span>Shop</span>
                  <span className="text-[10px] transform transition-transform duration-200">▾</span>
                </button>
              </div>

              <Link
                href="/shop?category=Preloved"
                className="hover:text-[#D9744A] transition-colors"
              >
                Preloved
              </Link>

              <Link
                href="/events"
                className="hover:text-[#D9744A] transition-colors"
              >
                Event &amp; Workshop
              </Link>

              <Link
                href="/about"
                className="hover:text-[#D9744A] transition-colors"
              >
                About
              </Link>

              <Link
                href="/request-a-book"
                className="hover:text-[#D9744A] transition-colors"
              >
                Request Buku
              </Link>
            </nav>

            {/* Right: Action Icons (Search, Account, Cart) */}
            <div className="flex items-center space-x-4 md:space-x-5">
              
              {/* Search Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleSearch}
                  className="p-1.5 text-[#2B2B2B] hover:text-[#D9744A] transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
                  aria-label="Cari produk"
                >
                  <img
                    src="/images/icons/icon-search.svg"
                    alt="Search"
                    className="w-5 h-5 object-contain"
                  />
                </button>

                {/* Search Bar Flyout */}
                {isSearchOpen && (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="absolute right-0 top-11 w-72 sm:w-80 bg-white border border-[#EBEBEB] rounded-lg shadow-figma-card p-2 flex items-center gap-2 z-50 animate-in fade-in duration-150"
                  >
                    <Search size={16} className="text-[#8C8C8C] shrink-0 ml-1" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari judul, kategori, usia..."
                      className="w-full text-xs text-[#2B2B2B] bg-transparent focus:outline-none placeholder:text-[#8C8C8C]"
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="text-[#8C8C8C] hover:text-[#2B2B2B] p-1"
                    >
                      <X size={14} />
                    </button>
                  </form>
                )}
              </div>

              {/* Customer Account Icon */}
              <Link
                href="/account"
                className="p-1.5 text-[#2B2B2B] hover:text-[#D9744A] transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Akun saya"
              >
                <img
                  src="/images/icons/icon-user.svg"
                  alt="Account"
                  className="w-5 h-5 object-contain"
                />
              </Link>

              {/* Shopping Bag Button with Badge */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 text-[#2B2B2B] hover:text-[#D9744A] transition-colors cursor-pointer flex items-center justify-center"
                aria-label={`Keranjang belanja, ${totalItemsCount} item`}
              >
                <img
                  src="/images/icons/icon-cart.svg"
                  alt="Cart"
                  className="w-5 h-5 object-contain"
                />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D9744A] text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
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
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#EBEBEB]">
                <img
                  src="/BabyShallsLogo 1.PNG"
                  alt="BabyShalls Logo"
                  className="h-8 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#6B6B6B] hover:text-[#2B2B2B] p-1"
                  aria-label="Tutup menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Navigation List */}
              <div className="py-6 space-y-4 text-left">
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[15px] font-semibold text-[#2B2B2B] hover:text-[#D9744A]"
                >
                  Shop Semua Produk
                </Link>

                <div className="pl-3 space-y-2 border-l-2 border-[#EBEBEB]">
                  <Link
                    href="/shop?category=Board+Books"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-[13px] text-[#6B6B6B] hover:text-[#D9744A]"
                  >
                    • Board Books
                  </Link>
                  <Link
                    href="/shop?category=Picture+Books"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-[13px] text-[#6B6B6B] hover:text-[#D9744A]"
                  >
                    • Picture Books
                  </Link>
                  <Link
                    href="/shop?category=Educational+Toys"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-[13px] text-[#6B6B6B] hover:text-[#D9744A]"
                  >
                    • Mainan Montessori
                  </Link>
                  <Link
                    href="/hampers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-[13px] text-[#6B6B6B] hover:text-[#D9744A]"
                  >
                    • Hampers Kado
                  </Link>
                </div>

                <Link
                  href="/shop?category=Preloved"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[15px] font-semibold text-[#2B2B2B] hover:text-[#D9744A]"
                >
                  Preloved
                </Link>

                <Link
                  href="/events"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[15px] font-semibold text-[#2B2B2B] hover:text-[#D9744A]"
                >
                  Event &amp; Workshop
                </Link>

                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[15px] font-semibold text-[#2B2B2B] hover:text-[#D9744A]"
                >
                  About
                </Link>

                <Link
                  href="/request-a-book"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[15px] font-semibold text-[#2B2B2B] hover:text-[#D9744A]"
                >
                  Request Buku
                </Link>

                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[15px] font-semibold text-[#2B2B2B] hover:text-[#D9744A]"
                >
                  Akun &amp; Riwayat Pesanan
                </Link>
              </div>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="pt-6 border-t border-[#EBEBEB] text-xs text-[#6B6B6B] space-y-2">
              <p className="font-semibold text-[#2B2B2B]">Butik BabyShalls</p>
              <p>Citraland Puncak Tidar Blok HH-26, Malang</p>
              <p>Selasa – Minggu: 10.00 – 19.00 WIB</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
