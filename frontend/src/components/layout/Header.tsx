'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, ShoppingBag, Menu, X, Heart, LogIn } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStorefrontProducts } from '../../hooks/useProducts';
import { formatIDR } from '../../lib/utils';
import { ADMIN_TOKEN_STORAGE_KEY, USER_TOKEN_STORAGE_KEY } from '../../lib/axios';

interface HeaderProps {
  onToggleMobileNav: () => void;
  isMobileNavOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileNav,
  isMobileNavOpen,
}) => {
  const { totalItems, openCart } = useCart();
  const { totalWishlist } = useWishlist();
  const { products } = useStorefrontProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminSession, setIsAdminSession] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const syncAuth = () => {
      const adminToken = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
      const userToken = window.localStorage.getItem(USER_TOKEN_STORAGE_KEY);
      setIsAdminSession(Boolean(adminToken));
      setIsAuthenticated(Boolean(adminToken || userToken));
      setAuthChecked(true);
    };
    syncAuth();
    window.addEventListener('storage', syncAuth);
    window.addEventListener('focus', syncAuth);
    window.addEventListener('popstate', syncAuth);
    window.addEventListener('babyshalls-auth-changed', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('focus', syncAuth);
      window.removeEventListener('popstate', syncAuth);
      window.removeEventListener('babyshalls-auth-changed', syncAuth);
    };
  }, []);

  const suggestions = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setShowSuggestions(false);
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : '/catalog');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Button + Horizontal Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileNav}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded border border-[#E2E8F0] text-[#1A1A1A] hover:bg-[#F8FAFC] transition-colors"
            aria-label={isMobileNavOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center group min-h-[44px]" aria-label="Baby Shall's Beranda">
            <img
              src="/images/babyshalls-logo.png"
              alt="Baby Shall's Logo"
              className="h-11 sm:h-13 w-auto object-contain shrink-0"
            />
          </Link>
        </div>

        {/* Center: Search Bar with Live Autocomplete (Desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-4 relative"
          role="search"
        >
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
              className="w-full h-[44px] pl-10 pr-4 text-sm text-[#1A1A1A] placeholder:text-[#64748B] bg-white border border-[#CBD5E1] rounded focus:outline-none focus:border-[#1A1A1A] transition-colors"
            />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-[48px] bg-white border border-[#E5E7EB] rounded-2xl shadow-lg z-50 overflow-hidden divide-y divide-[#F3F4F6]">
              {suggestions.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.slug}`}
                  onClick={() => setShowSuggestions(false)}
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

        {/* Right: Wishlist + Account + Cart (when logged in) OR Masuk button (when logged out) */}
        <div className="flex items-center gap-2 shrink-0">
          {authChecked && !isAuthenticated && (
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 h-[44px] px-5 rounded-full bg-[#D9744A] hover:bg-[#c5633b] text-white text-sm font-bold transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </Link>
          )}

          {authChecked && isAuthenticated && (
            <>
              <Link
                href="/wishlist"
                className="inline-flex items-center justify-center gap-1.5 h-[44px] px-3.5 rounded border border-[#CBD5E1] bg-white text-[#1A1A1A] text-sm font-medium hover:bg-[#FDECE6] transition-colors relative"
                aria-label={`Wishlist (${totalWishlist} item)`}
              >
                <Heart className="w-4 h-4" />
                <span className="hidden md:inline">Wishlist</span>
                {totalWishlist > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#F5B7A1] text-[#1A1A1A] text-[10px] font-extrabold">
                    {totalWishlist}
                  </span>
                )}
              </Link>

              <Link
                href={isAdminSession ? '/admin' : '/account'}
                className="hidden sm:inline-flex items-center justify-center gap-2 h-[44px] px-4 rounded border border-[#CBD5E1] bg-white text-[#1A1A1A] text-sm font-medium hover:bg-[#F8FAFC] transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{isAdminSession ? 'Admin' : 'Akun'}</span>
              </Link>

              <button
                type="button"
                onClick={() => openCart()}
                className="inline-flex items-center justify-center gap-2 h-[44px] px-4 rounded bg-[#F5B7A1] hover:bg-[#F0A48A] text-[#1A1A1A] text-sm font-bold transition-colors cursor-pointer"
                aria-label={`Buka keranjang (${totalItems} item)`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Keranjang ({totalItems})</span>
                <span className="sm:hidden">Bag ({totalItems})</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
