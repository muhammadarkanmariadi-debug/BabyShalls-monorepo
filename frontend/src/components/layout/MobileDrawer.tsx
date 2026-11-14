'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ADMIN_TOKEN_STORAGE_KEY, USER_TOKEN_STORAGE_KEY } from '../../lib/axios';
import {
  X,
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
  Heart,
  LogIn,
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
  onOpenRequestBook?: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, onOpenRequestBook }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token =
      window.localStorage.getItem(USER_TOKEN_STORAGE_KEY) ||
      window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    setIsAuthenticated(Boolean(token));
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Content */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-drawer p-6 flex flex-col justify-between overflow-y-auto z-10 border-r border-[#E5E7EB]">
        <div>
          {/* Top Brand & Close */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
            <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="BabyShalls Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-base font-extrabold tracking-tight text-[#1A1A1A]">
                BABYSHALLS
              </span>
            </Link>
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-[#F8FAFC] text-[#1A1A1A]"
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
                className="w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#FAF4E8] font-bold text-sm text-[#1A1A1A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span>Shop by Age</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedSection === 'age' ? 'rotate-180 text-[#1E543B]' : 'opacity-60'
                  }`}
                />
              </button>
              {expandedSection === 'age' && (
                <div className="pl-9 pr-2 py-1 space-y-1">
                  <Link
                    href={AGE_GROUPS_DROPDOWN.href}
                    onClick={onClose}
                    className="block py-2 px-2 text-xs font-bold text-[#1E543B] hover:bg-[#E9F3E4] rounded-lg transition-colors border-b border-[#E5E7EB] mb-1"
                  >
                    → {AGE_GROUPS_DROPDOWN.viewAllText}
                  </Link>
                  {AGE_GROUPS_DROPDOWN.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className="block py-2 px-2 text-xs font-semibold text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[#F8FAFC] rounded-lg transition-colors"
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
                className="w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#FAF4E8] font-bold text-sm text-[#1A1A1A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-[#1E543B]" />
                  <span>Books</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedSection === 'books' ? 'rotate-180 text-[#1E543B]' : 'opacity-60'
                  }`}
                />
              </button>
              {expandedSection === 'books' && (
                <div className="pl-9 pr-2 py-1 space-y-1">
                  <Link
                    href={BOOKS_CATEGORIES_DROPDOWN.href}
                    onClick={onClose}
                    className="block py-2 px-2 text-xs font-bold text-[#1E543B] hover:bg-[#E9F3E4] rounded-lg transition-colors border-b border-[#E5E7EB] mb-1"
                  >
                    → {BOOKS_CATEGORIES_DROPDOWN.viewAllText}
                  </Link>
                  {BOOKS_CATEGORIES_DROPDOWN.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className="block py-2 px-2 text-xs font-semibold text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[#F8FAFC] rounded-lg transition-colors"
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
                className="w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#FAF4E8] font-bold text-sm text-[#1A1A1A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shapes className="w-4 h-4 text-[#1E543B]" />
                  <span>Toys</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedSection === 'toys' ? 'rotate-180 text-[#1E543B]' : 'opacity-60'
                  }`}
                />
              </button>
              {expandedSection === 'toys' && (
                <div className="pl-9 pr-2 py-1 space-y-1">
                  <Link
                    href={TOYS_CATEGORIES_DROPDOWN.href}
                    onClick={onClose}
                    className="block py-2 px-2 text-xs font-bold text-[#1E543B] hover:bg-[#E9F3E4] rounded-lg transition-colors border-b border-[#E5E7EB] mb-1"
                  >
                    → {TOYS_CATEGORIES_DROPDOWN.viewAllText}
                  </Link>
                  {TOYS_CATEGORIES_DROPDOWN.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className="block py-2 px-2 text-xs font-semibold text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[#F8FAFC] rounded-lg transition-colors"
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
                className="w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#FAF4E8] font-bold text-sm text-[#1A1A1A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Gift className="w-4 h-4 text-[#1E543B]" />
                  <span>Hampers &amp; Gifts</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedSection === 'hampers' ? 'rotate-180 text-[#1E543B]' : 'opacity-60'
                  }`}
                />
              </button>
              {expandedSection === 'hampers' && (
                <div className="pl-9 pr-2 py-1 space-y-1">
                  <Link
                    href={HAMPERS_CATEGORIES_DROPDOWN.href}
                    onClick={onClose}
                    className="block py-2 px-2 text-xs font-bold text-[#1E543B] hover:bg-[#E9F3E4] rounded-lg transition-colors border-b border-[#E5E7EB] mb-1"
                  >
                    → {HAMPERS_CATEGORIES_DROPDOWN.viewAllText}
                  </Link>
                  {HAMPERS_CATEGORIES_DROPDOWN.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className="block py-2 px-2 text-xs font-semibold text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[#F8FAFC] rounded-lg transition-colors"
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
              className="flex items-center justify-between min-h-[44px] px-3 py-2 rounded-xl bg-[#E9F3E4] hover:bg-[#DCECD4] font-bold text-sm text-[#1A1A1A] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span>Preloved Kurasi</span>
              </div>
              <span className="text-[10px] font-bold bg-white text-[#1E543B] px-2 py-0.5 rounded-full">
                Steril UV
              </span>
            </Link>

            {/* Direct Links */}
            <Link
              href="/events"
              onClick={onClose}
              className="flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-xl hover:bg-[#F8FAFC] font-bold text-sm text-[#1A1A1A] transition-colors"
            >
              <Calendar className="w-4 h-4 text-[#1E543B]" />
              <span>Workshops &amp; Events</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRequestBook?.();
              }}
              className="w-full text-left flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-xl bg-[#EBF1FA] hover:bg-[#DCE7F7] font-bold text-sm text-[#1E543B] transition-colors cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4 text-[#1E543B]" />
              <span>Request a Book (Jastip)</span>
            </button>
            {isAuthenticated ? (
              <>
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-xl hover:bg-[#FDECE6] font-bold text-sm text-[#1A1A1A] transition-colors"
                >
                  <Heart className="w-4 h-4 text-[#1E543B]" />
                  <span>Wishlist Saya</span>
                </Link>
                <Link
                  href="/account"
                  onClick={onClose}
                  className="flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-xl hover:bg-[#F8FAFC] font-bold text-sm text-[#1A1A1A] transition-colors"
                >
                  <User className="w-4 h-4 text-[#1E543B]" />
                  <span>Akun &amp; Pesanan Saya</span>
                </Link>
              </>
            ) : (
              <Link
                href="/account"
                onClick={onClose}
                className="flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-xl bg-[#D9744A] hover:bg-[#c5633b] font-bold text-sm text-white transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Akun</span>
              </Link>
            )}
            <Link
              href="/about"
              onClick={onClose}
              className="flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-xl hover:bg-[#F8FAFC] font-semibold text-sm text-[#4A4A4A] transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>Tentang BabyShalls</span>
            </Link>
            <Link
              href="/faq"
              onClick={onClose}
              className="flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-xl hover:bg-[#F8FAFC] font-semibold text-sm text-[#4A4A4A] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Tanya Jawab (FAQ)</span>
            </Link>
          </div>
        </div>

        {/* Bottom Store Info */}
        <div className="pt-6 border-t border-[#E5E7EB] space-y-3 text-xs text-[#4A4A4A]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#1E543B]" />
            <span>Jl. Cempaka No. 12, Lowokwaru, Malang</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#1E543B]" />
            <span>WA: +62 812-3456-7890</span>
          </div>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center min-h-[44px] px-4 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#20ba59] transition-colors"
          >
            Chat WhatsApp CS
          </a>
        </div>
      </div>
    </div>
  );
};
