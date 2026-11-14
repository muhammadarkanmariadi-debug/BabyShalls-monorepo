'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface NavItem {
  key: string;
  label: string;
  href: string;
  highlight?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'age', label: 'Shop by Age', href: '/catalog' },
  { key: 'books', label: 'Books', href: '/catalog?category=Books' },
  { key: 'toys', label: 'Toys', href: '/catalog?category=Wooden+Toys' },
  { key: 'hampers', label: 'Hampers & Gifts', href: '/catalog?category=Gift+Hampers' },
  { key: 'preloved', label: 'Preloved', href: '/catalog?category=Preloved' },
  { key: 'events', label: 'Workshops & Events', href: '/events' },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'faq', label: 'FAQ', href: '/faq' },
  { key: 'request', label: 'Request a Book', href: '/request-book', highlight: true },
];

interface NavbarProps {
  onOpenRequestBook?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRequestBook }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = (searchParams.get('category') || '').toLowerCase();
  const sub = (searchParams.get('sub') || '').toLowerCase();
  const age = searchParams.get('age') || '';

  const isNavItemActive = (key: string) => {
    if (key === 'events') return pathname.startsWith('/events');
    if (key === 'about') return pathname === '/about';
    if (key === 'faq') return pathname === '/faq';
    if (key === 'request') return pathname === '/request-book';

    if (pathname !== '/catalog') return false;

    if (key === 'preloved') return category === 'preloved' || sub === 'preloved';
    if (key === 'books') {
      return (
        category === 'books' ||
        category.includes('book') ||
        ['board books', 'picture books', 'early readers'].includes(sub)
      );
    }
    if (key === 'toys') {
      return (
        category === 'wooden toys' ||
        category.includes('toy') ||
        ['stacker', 'shape sorter'].includes(sub)
      );
    }
    if (key === 'hampers') return category === 'gift hampers' || category.includes('hamper');
    if (key === 'age') {
      return Boolean(age) || (!category && !sub);
    }
    return false;
  };

  return (
    <nav
      aria-label="Navigasi utama"
      className="hidden lg:block w-full bg-white border-b border-[#E2E8F0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[48px] flex items-center justify-center gap-4">
        {NAV_ITEMS.map((item) => {
          const isActive = isNavItemActive(item.key);
          const className = `text-[13px] transition-colors whitespace-nowrap px-3 py-1.5 rounded-full cursor-pointer ${
            isActive
              ? item.highlight
                ? 'font-bold bg-[#E9F3E4] text-[#1E543B]'
                : 'font-bold bg-[#FDF0B8] text-[#1A1A1A]'
              : item.highlight
              ? 'font-bold text-[#1E543B] hover:bg-[#E9F3E4]/60'
              : 'font-medium text-[#555555] hover:text-[#1A1A1A] hover:bg-[#F8FAFC]'
          }`;

          if (item.key === 'request' && onOpenRequestBook) {
            return (
              <button
                key={item.key}
                type="button"
                onClick={onOpenRequestBook}
                className={className}
              >
                {item.label}
              </button>
            );
          }

          return (
            <Link
              key={item.key}
              href={item.href}
              className={className}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
