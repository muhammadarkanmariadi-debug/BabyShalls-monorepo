'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface HeaderProps {
  onToggleMobileNav: () => void;
  isMobileNavOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav, isMobileNavOpen }) => {
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F0]/95 backdrop-blur-md border-b border-[#EEDBC9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-xl text-[#5B3A29] hover:bg-[#FFE4D0] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo with Official BabyShalls Artwork */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <img
            src="/logo.png"
            alt="BabyShalls Logo"
            className="w-10 h-10 md:w-11 md:h-11 object-contain rounded-full bg-white p-0.5 border border-[#EEDBC9] shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0"
          />
          <span className="font-serif text-2xl md:text-[26px] font-bold tracking-tight text-[#5B3A29] group-hover:text-[#DA7A5B] transition-colors">
            BabyShalls
          </span>
        </Link>

        {/* Search Bar matching mockup: "Search for books or toys..." */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-4 relative"
        >
          <Search className="w-4 h-4 text-[#8FA87E] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for books or toys..."
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-[#FFFDF9] border border-[#EEDBC9] rounded-full text-[#5B3A29] placeholder-[#CBA989] focus:outline-none focus:border-[#DA7A5B] focus:ring-2 focus:ring-[#DA7A5B]/15 transition-all shadow-xs"
          />
        </form>

        {/* Actions: Account & Cart with badge */}
        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="w-10 h-10 rounded-full border border-[#EEDBC9] bg-white flex items-center justify-center text-[#5B3A29] hover:bg-[#FFE4D0] transition-colors shadow-xs"
            title="My Account"
            aria-label="My Account"
          >
            <User className="w-4 h-4 text-[#5B3A29]" />
          </Link>

          <button
            onClick={openCart}
            className="relative w-10 h-10 rounded-full border border-[#EEDBC9] bg-white flex items-center justify-center text-[#5B3A29] hover:bg-[#FFE4D0] transition-colors shadow-xs"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#5B3A29]" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#DA7A5B] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
