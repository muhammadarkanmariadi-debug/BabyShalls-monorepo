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
  Sparkles,
} from 'lucide-react';
import {
  AGE_GROUPS_DROPDOWN,
  BOOKS_CATEGORIES_DROPDOWN,
  TOYS_CATEGORIES_DROPDOWN,
  HAMPERS_CATEGORIES_DROPDOWN,
} from '@/data/categories';
import { HeaderSearchBar } from './HeaderSearchBar';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCORDION_SECTIONS = [
  {
    key: 'age',
    label: 'Shop by Age',
    icon: Sparkles,
    dropdown: AGE_GROUPS_DROPDOWN,
  },
  {
    key: 'books',
    label: 'Books',
    icon: BookOpen,
    dropdown: BOOKS_CATEGORIES_DROPDOWN,
  },
  {
    key: 'toys',
    label: 'Toys',
    icon: Shapes,
    dropdown: TOYS_CATEGORIES_DROPDOWN,
  },
  {
    key: 'hampers',
    label: 'Hampers & Gifts',
    icon: Gift,
    dropdown: HAMPERS_CATEGORIES_DROPDOWN,
  },
] as const;

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token =
      window.localStorage.getItem(USER_TOKEN_STORAGE_KEY) ||
      window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    setIsAuthenticated(Boolean(token));
  }, [isOpen]);

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
      />

      {/* Top-Down Sliding Panel */}
      <div
        className={`fixed inset-x-0 top-0 max-h-[88vh] bg-white shadow-xl rounded-b-3xl border-b border-[#E5E7EB] overflow-y-auto z-10 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-2xl mx-auto px-5 pt-4 pb-6 space-y-5">
          {/* Top Brand & Close */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
            <Link href="/" onClick={onClose} className="flex items-center">
              <img
                src="/images/babyshalls-logo.png"
                alt="Baby Shall's Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-[#E5E7EB] hover:bg-[#F8FAFC] text-[#1A1A1A] transition-colors"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar (same as desktop) */}
          <HeaderSearchBar className="w-full" onNavigate={onClose} />

          {/* Category Accordions */}
          <div className="space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B7280] px-1">
              Kategori Kurasi
            </p>
            <div className="space-y-1.5">
              {ACCORDION_SECTIONS.map(({ key, label, icon: Icon, dropdown }) => {
                const isExpanded = expandedSection === key;
                return (
                  <div
                    key={key}
                    className="rounded-2xl border border-[#F3F4F6] bg-[#FAFAFA]/60 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(key)}
                      className="w-full min-h-[46px] flex items-center justify-between px-4 py-2.5 hover:bg-[#FAF4E8]/70 font-bold text-sm text-[#1A1A1A] transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-[#1E543B]" />
                        <span>{label}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-[#1E543B]' : 'opacity-60'
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-3 pt-1 space-y-2 bg-white border-t border-[#F3F4F6]">
                        <Link
                          href={dropdown.href}
                          onClick={onClose}
                          className="block py-2 px-3 text-xs font-bold text-[#1E543B] bg-[#E9F3E4]/60 hover:bg-[#E9F3E4] rounded-xl transition-colors"
                        >
                          → {dropdown.viewAllText}
                        </Link>
                        <div className="grid grid-cols-2 gap-1.5">
                          {dropdown.items.map((item) => (
                            <Link
                              key={item.id}
                              href={item.href}
                              onClick={onClose}
                              className="py-2 px-3 text-xs font-semibold text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[#FAF4E8] rounded-xl transition-colors"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Highlighted Programs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Link
              href="/catalog?category=Preloved"
              onClick={onClose}
              className="flex items-center justify-between min-h-[46px] px-4 py-2.5 rounded-2xl bg-[#E9F3E4] hover:bg-[#DCECD4] font-bold text-sm text-[#1A1A1A] transition-colors"
            >
              <span>Preloved Kurasi</span>
              <span className="text-[10px] font-bold bg-white text-[#1E543B] px-2.5 py-0.5 rounded-full">
                Steril UV
              </span>
            </Link>
            <Link
              href="/request-book"
              onClick={onClose}
              className="flex items-center gap-2.5 min-h-[46px] px-4 py-2.5 rounded-2xl bg-[#EBF1FA] hover:bg-[#DCE7F7] font-bold text-sm text-[#1E543B] transition-colors"
            >
              <BookmarkCheck className="w-4 h-4 shrink-0" />
              <span>Request a Book (Jastip)</span>
            </Link>
          </div>

          {/* Quick Links Grid (Airy 2-Column Layout) */}
          <div className="space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B7280] px-1">
              Menu Lainnya
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/events"
                onClick={onClose}
                className="flex items-center gap-2.5 min-h-[44px] px-3.5 py-2.5 rounded-2xl border border-[#F3F4F6] hover:bg-[#FAF4E8] font-bold text-xs text-[#1A1A1A] transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#1E543B] shrink-0" />
                <span>Workshops &amp; Events</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/wishlist"
                    onClick={onClose}
                    className="flex items-center gap-2.5 min-h-[44px] px-3.5 py-2.5 rounded-2xl border border-[#F3F4F6] hover:bg-[#FDECE6] font-bold text-xs text-[#1A1A1A] transition-colors"
                  >
                    <Heart className="w-4 h-4 text-[#1E543B] shrink-0" />
                    <span>Wishlist Saya</span>
                  </Link>
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="flex items-center gap-2.5 min-h-[44px] px-3.5 py-2.5 rounded-2xl border border-[#F3F4F6] hover:bg-[#F8FAFC] font-bold text-xs text-[#1A1A1A] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#1E543B] shrink-0" />
                    <span>Akun &amp; Pesanan</span>
                  </Link>
                </>
              ) : (
                <Link
                  href="/auth"
                  onClick={onClose}
                  className="flex items-center gap-2.5 min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-[#D9744A] hover:bg-[#c5633b] font-bold text-xs text-white transition-colors"
                >
                  <LogIn className="w-4 h-4 shrink-0" />
                  <span>Masuk ke Akun</span>
                </Link>
              )}

              <Link
                href="/about"
                onClick={onClose}
                className="flex items-center gap-2.5 min-h-[44px] px-3.5 py-2.5 rounded-2xl border border-[#F3F4F6] hover:bg-[#F8FAFC] font-semibold text-xs text-[#4A4A4A] transition-colors"
              >
                <Info className="w-4 h-4 shrink-0" />
                <span>Tentang BabyShalls</span>
              </Link>

              <Link
                href="/faq"
                onClick={onClose}
                className="flex items-center gap-2.5 min-h-[44px] px-3.5 py-2.5 rounded-2xl border border-[#F3F4F6] hover:bg-[#F8FAFC] font-semibold text-xs text-[#4A4A4A] transition-colors"
              >
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>Tanya Jawab (FAQ)</span>
              </Link>
            </div>
          </div>

          {/* Store Footer */}
          <div className="pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#4A4A4A]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#1E543B] shrink-0" />
                <span>Jl. Cempaka No. 12, Lowokwaru, Malang</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#1E543B] shrink-0" />
                <span>WA: +62 812-3456-7890</span>
              </div>
            </div>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center min-h-[42px] px-5 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#20ba59] transition-colors shrink-0"
            >
              Chat WhatsApp CS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
