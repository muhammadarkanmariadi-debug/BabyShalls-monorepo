'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Sparkles,
  BookOpen,
  Shapes,
  Gift,
  Calendar,
  BookmarkCheck,
  Phone,
  MapPin,
  User,
  ChevronDown,
  Info,
  HelpCircle,
} from 'lucide-react';
import {
  AGE_GROUPS_DROPDOWN,
  BOOKS_CATEGORIES_DROPDOWN,
  TOYS_CATEGORIES_DROPDOWN,
  HAMPERS_CATEGORIES_DROPDOWN,
} from '@/data/categories';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#502E1E]/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Content */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FFF8EF] shadow-drawer p-6 flex flex-col justify-between overflow-y-auto z-10 border-r border-[#EEDBC9]">
        <div>
          {/* Top Brand & Close */}
          <div className="flex items-center justify-between pb-4 border-b border-[#EEDBC9]">
            <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="BabyShalls Logo"
                className="w-8 h-8 object-contain rounded-full bg-white p-0.5 border border-[#EEDBC9] shadow-2xs"
              />
              <span className="font-serif text-xl font-bold text-[#502E1E]">BabyShalls</span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#FFE4D0] text-[#6B3F2A]"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Accordions */}
          <div className="mt-5 flex flex-col gap-1.5">
            {/* 1. Shop by Age */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('age')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#FFE4D0] font-bold text-[#6B3F2A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#DA7A5B]" />
                  <span>Shop by Age</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedSection === 'age' ? 'rotate-180 text-[#D9744A]' : 'opacity-60'
                  }`}
                />
              </button>
              {expandedSection === 'age' && (
                <div className="pl-9 pr-2 py-1 space-y-1 animate-in fade-in-0 duration-150">
                  <Link
                    href={AGE_GROUPS_DROPDOWN.href}
                    onClick={onClose}
                    className="block py-1.5 px-2 text-xs font-bold text-[#D9744A] hover:bg-[#FFF3E8] rounded-lg transition-colors border-b border-[#EEDBC9]/40 mb-1"
                  >
                    → {AGE_GROUPS_DROPDOWN.viewAllText}
                  </Link>
                  {AGE_GROUPS_DROPDOWN.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className="block py-1.5 px-2 text-xs font-semibold text-[#5B3A29] hover:text-[#D9744A] hover:bg-[#FFF3E8] rounded-lg transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Books */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('books')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#FFE4D0] font-bold text-[#6B3F2A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-[#8FA87E]" />
                  <span>Books</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedSection === 'books' ? 'rotate-180 text-[#D9744A]' : 'opacity-60'
                  }`}
                />
              </button>
              {expandedSection === 'books' && (
                <div className="pl-9 pr-2 py-1 space-y-1 animate-in fade-in-0 duration-150">
                  <Link
                    href={BOOKS_CATEGORIES_DROPDOWN.href}
                    onClick={onClose}
                    className="block py-1.5 px-2 text-xs font-bold text-[#D9744A] hover:bg-[#FFF3E8] rounded-lg transition-colors border-b border-[#EEDBC9]/40 mb-1"
                  >
                    → {BOOKS_CATEGORIES_DROPDOWN.viewAllText}
                  </Link>
                  {BOOKS_CATEGORIES_DROPDOWN.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className="block py-1.5 px-2 text-xs font-semibold text-[#5B3A29] hover:text-[#D9744A] hover:bg-[#FFF3E8] rounded-lg transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Toys */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('toys')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#FFE4D0] font-bold text-[#6B3F2A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shapes className="w-4 h-4 text-[#DA7A5B]" />
                  <span>Toys</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedSection === 'toys' ? 'rotate-180 text-[#D9744A]' : 'opacity-60'
                  }`}
                />
              </button>
              {expandedSection === 'toys' && (
                <div className="pl-9 pr-2 py-1 space-y-1 animate-in fade-in-0 duration-150">
                  <Link
                    href={TOYS_CATEGORIES_DROPDOWN.href}
                    onClick={onClose}
                    className="block py-1.5 px-2 text-xs font-bold text-[#D9744A] hover:bg-[#FFF3E8] rounded-lg transition-colors border-b border-[#EEDBC9]/40 mb-1"
                  >
                    → {TOYS_CATEGORIES_DROPDOWN.viewAllText}
                  </Link>
                  {TOYS_CATEGORIES_DROPDOWN.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className="block py-1.5 px-2 text-xs font-semibold text-[#5B3A29] hover:text-[#D9744A] hover:bg-[#FFF3E8] rounded-lg transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Hampers & Gifts */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('hampers')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#FFE4D0] font-bold text-[#6B3F2A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Gift className="w-4 h-4 text-[#F6C95E]" />
                  <span>Hampers & Gifts</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedSection === 'hampers' ? 'rotate-180 text-[#D9744A]' : 'opacity-60'
                  }`}
                />
              </button>
              {expandedSection === 'hampers' && (
                <div className="pl-9 pr-2 py-1 space-y-1 animate-in fade-in-0 duration-150">
                  <Link
                    href={HAMPERS_CATEGORIES_DROPDOWN.href}
                    onClick={onClose}
                    className="block py-1.5 px-2 text-xs font-bold text-[#D9744A] hover:bg-[#FFF3E8] rounded-lg transition-colors border-b border-[#EEDBC9]/40 mb-1"
                  >
                    → {HAMPERS_CATEGORIES_DROPDOWN.viewAllText}
                  </Link>
                  {HAMPERS_CATEGORIES_DROPDOWN.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className="block py-1.5 px-2 text-xs font-semibold text-[#5B3A29] hover:text-[#D9744A] hover:bg-[#FFF3E8] rounded-lg transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Preloved Kurasi Link */}
            <Link
              href="/catalog?category=Preloved"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#FFE4D0] font-bold text-[#6B3F2A] transition-colors bg-[#FFF4E8]/80 border border-[#F6DECE]"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#8FA87E]" />
                <span>Barang Preloved Kurasi</span>
              </div>
              <span className="text-[10px] font-bold bg-[#EBF2E5] text-[#709154] px-2 py-0.5 rounded-full border border-[#D5E4CA]">
                Disanitasi UV
              </span>
            </Link>

            {/* Direct Links */}
            <Link
              href="/events"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFE4D0] font-bold text-[#6B3F2A] transition-colors"
            >
              <Calendar className="w-4 h-4 text-[#709154]" />
              <span>Workshops & Events</span>
            </Link>
            <Link
              href="/about"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFE4D0] font-bold text-[#6B3F2A] transition-colors"
            >
              <Info className="w-4 h-4 text-[#DA7A5B]" />
              <span>Tentang BabyShalls</span>
            </Link>
            <Link
              href="/faq"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFE4D0] font-bold text-[#6B3F2A] transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-[#8FA87E]" />
              <span>Tanya Jawab (FAQ)</span>
            </Link>
            <Link
              href="/request-book"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFE4D0] font-bold text-[#6B3F2A] transition-colors"
            >
              <BookmarkCheck className="w-4 h-4 text-[#DA7A5B]" />
              <span>Request a Book (Jastip)</span>
            </Link>
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFE4D0] font-bold text-[#6B3F2A] transition-colors"
            >
              <User className="w-4 h-4 text-[#DA7A5B]" />
              <span>Akun & Riwayat Pesanan</span>
            </Link>
          </div>
        </div>

        {/* Bottom Store Info */}
        <div className="pt-6 border-t border-[#EEDBC9] space-y-3 text-xs text-[#6B3F2A]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#DA7A5B]" />
            <span>Jl. Cempaka No. 12, Klojen, Malang</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#8FA87E]" />
            <span>WA: +62 812-3456-7890</span>
          </div>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-2.5 px-4 bg-[#25D366] text-white font-bold rounded-xl shadow-subtle hover:bg-[#20ba59]"
          >
            Chat WhatsApp CS
          </a>
        </div>
      </div>
    </div>
  );
};
