'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useStorefrontProducts } from '../../hooks/useProducts';
import { formatIDR } from '../../lib/utils';

interface HeaderSearchBarProps {
  className?: string;
  onNavigate?: () => void;
}

export const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({
  className = '',
  onNavigate,
}) => {
  const { products } = useStorefrontProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  const suggestions = searchQuery.trim()
    ? products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setShowSuggestions(false);
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : '/catalog');
    onNavigate?.();
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`} role="search">
      <div className="relative w-full">
        <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={searchQuery}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          placeholder="Cari buku atau mainan..."
          aria-label="Cari buku atau mainan"
          className="w-full h-[44px] pl-10 pr-4 text-sm text-[#1A1A1A] placeholder:text-[#64748B] bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#1A1A1A] transition-colors"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-[48px] bg-white border border-[#E5E7EB] rounded-2xl shadow-lg z-50 overflow-hidden divide-y divide-[#F3F4F6]">
          {suggestions.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.slug}`}
              onClick={() => {
                setShowSuggestions(false);
                onNavigate?.();
              }}
              className="flex items-center gap-3 p-3 hover:bg-[#FAF4E8] transition-colors"
            >
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-10 h-10 rounded-lg object-cover bg-[#F7F7F5] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[#1A1A1A] truncate">{item.title}</div>
                <div className="text-[11px] text-[#6B7280]">{item.category}</div>
              </div>
              <span className="text-xs font-extrabold text-[#1E543B] shrink-0">
                {formatIDR(item.price)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </form>
  );
};

