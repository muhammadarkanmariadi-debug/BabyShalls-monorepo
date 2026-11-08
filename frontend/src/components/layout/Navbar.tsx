'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Sparkles, BookOpen, Shapes, Gift } from 'lucide-react';
import {
  AGE_GROUPS_DROPDOWN,
  BOOKS_CATEGORIES_DROPDOWN,
  TOYS_CATEGORIES_DROPDOWN,
  HAMPERS_CATEGORIES_DROPDOWN,
  NavDropdownGroup,
} from '@/data/categories';

export const Navbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menuId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenu(menuId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180);
  };

  const handleItemClick = () => {
    setActiveMenu(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const renderDropdownContent = (group: NavDropdownGroup, iconType: 'age' | 'book' | 'toy' | 'hamper') => {
    return (
      <div className="p-4 w-[360px] bg-[#FFFDF9] rounded-2xl shadow-xl shadow-[#5B3A29]/12 border border-[#EEDBC9] text-[#5B3A29] animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Header summary */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#F4E8DC]">
          <div className="flex items-center gap-2">
            {iconType === 'age' && <Sparkles className="w-4 h-4 text-[#DA7A5B]" />}
            {iconType === 'book' && <BookOpen className="w-4 h-4 text-[#8FA87E]" />}
            {iconType === 'toy' && <Shapes className="w-4 h-4 text-[#DA7A5B]" />}
            {iconType === 'hamper' && <Gift className="w-4 h-4 text-[#F6C95E]" />}
            <span className="font-serif font-bold text-sm text-[#5B3A29]">{group.label}</span>
          </div>
          <span className="text-[11px] text-[#A68A78] font-normal">{group.items.length} Pilihan</span>
        </div>

        {/* Category List */}
        <div className="space-y-1.5">
          {group.items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={handleItemClick}
              className="group/item flex items-start justify-between p-2 rounded-xl hover:bg-[#FFF3E8] transition-colors"
            >
              <div className="pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#5B3A29] group-hover/item:text-[#D9744A] transition-colors">
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFE8D6] text-[#D9744A]">
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-[11px] text-[#8C6D58] mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                )}
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#D9744A] opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all shrink-0 mt-1" />
            </Link>
          ))}
        </div>

        {/* Footer View All */}
        <div className="mt-3 pt-2.5 border-t border-[#F4E8DC]">
          <Link
            href={group.href}
            onClick={handleItemClick}
            className="flex items-center justify-between text-xs font-bold text-[#D9744A] hover:text-[#B85732] py-1 px-1 transition-colors"
          >
            <span>{group.viewAllText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <nav className="hidden lg:block bg-[#FFF9F0] border-b border-[#EEDBC9] text-[#5B3A29] text-sm font-semibold relative z-40">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-8 py-2.5">
        {/* 1. Shop by Age */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('age')}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href="/catalog?age=all"
            className={`hover:text-[#D9744A] transition-colors flex items-center gap-1.5 py-1 ${activeMenu === 'age' ? 'text-[#D9744A]' : ''
              }`}
          >
            <span>Shop by Age</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'age' ? 'rotate-180 text-[#D9744A]' : 'opacity-60'
                }`}
            />
          </Link>

          {activeMenu === 'age' && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
              {renderDropdownContent(AGE_GROUPS_DROPDOWN, 'age')}
            </div>
          )}
        </div>

        {/* 2. Books */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('books')}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href="/catalog?category=Books"
            className={`hover:text-[#D9744A] transition-colors flex items-center gap-1.5 py-1 ${activeMenu === 'books' ? 'text-[#D9744A]' : ''
              }`}
          >
            <span>Books</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'books' ? 'rotate-180 text-[#D9744A]' : 'opacity-60'
                }`}
            />
          </Link>

          {activeMenu === 'books' && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
              {renderDropdownContent(BOOKS_CATEGORIES_DROPDOWN, 'book')}
            </div>
          )}
        </div>

        {/* 3. Toys */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('toys')}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href="/catalog?category=Wooden%20Toys"
            className={`hover:text-[#D9744A] transition-colors flex items-center gap-1.5 py-1 ${activeMenu === 'toys' ? 'text-[#D9744A]' : ''
              }`}
          >
            <span>Toys</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'toys' ? 'rotate-180 text-[#D9744A]' : 'opacity-60'
                }`}
            />
          </Link>

          {activeMenu === 'toys' && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
              {renderDropdownContent(TOYS_CATEGORIES_DROPDOWN, 'toy')}
            </div>
          )}
        </div>

        {/* 4. Hampers & Gifts */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('hampers')}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href="/catalog?category=Gift%20Hampers"
            className={`hover:text-[#D9744A] transition-colors flex items-center gap-1.5 py-1 ${activeMenu === 'hampers' ? 'text-[#D9744A]' : ''
              }`}
          >
            <span>Hampers & Gifts</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'hampers' ? 'rotate-180 text-[#D9744A]' : 'opacity-60'
                }`}
            />
          </Link>

          {activeMenu === 'hampers' && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
              {renderDropdownContent(HAMPERS_CATEGORIES_DROPDOWN, 'hamper')}
            </div>
          )}
        </div>

        {/* 5. Preloved Kurasi */}
        <Link
          href="/catalog?category=Preloved"
          className="hover:text-[#D9744A] transition-colors py-1 flex items-center gap-1.5 font-bold group relative"
        >

          <span>Preloved</span>

        </Link>

        {/* 6. Workshops & Events */}
        <Link
          href="/events"
          className="hover:text-[#D9744A] transition-colors py-1"
        >
          Workshops & Events
        </Link>

        {/* 6. About */}
        <Link
          href="/about"
          className="hover:text-[#D9744A] transition-colors py-1"
        >
          About
        </Link>

        {/* 7. FAQ */}
        <Link
          href="/faq"
          className="hover:text-[#D9744A] transition-colors py-1"
        >
          FAQ
        </Link>

        {/* 8. Request a Book */}
        <Link
          href="/request-book"
          className="hover:text-[#D9744A] transition-colors py-1"
        >
          Request a Book
        </Link>
      </div>
    </nav>
  );
};
