'use client';

import React from 'react';
import Link from 'next/link';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  if (!isOpen) return null;

  const ageGroups = [
    { label: 'Newborn (0–12 bln)', href: '/shop?age=0-12m' },
    { label: '1–3 tahun', href: '/shop?age=1-3y' },
    { label: '3+ tahun', href: '/shop?age=3-5y' },
    { label: '6+ tahun', href: '/shop?age=6y' },
    { label: 'Semua usia', href: '/shop' },
  ];

  const bookCategories = [
    { label: 'Board Book', href: '/shop?category=Board+Books' },
    { label: 'Picture Book', href: '/shop?category=Picture+Books' },
    { label: 'Buku Aktivitas', href: '/shop?category=Activity+Books' },
    { label: 'Chapter Book', href: '/shop?category=Chapter+Books' },
    { label: 'Buku Impor', href: '/shop?tag=impor' },
    { label: 'Buku Lokal', href: '/shop?tag=lokal' },
  ];

  const toyCategories = [
    { label: 'Mainan Edukasi', href: '/shop?category=Educational+Toys' },
    { label: 'Montessori', href: '/shop?category=Montessori' },
    { label: 'Puzzle & Permainan', href: '/shop?category=Puzzles' },
    { label: 'Hampers', href: '/hampers' },
    { label: 'Preloved', href: '/shop?category=Preloved' },
  ];

  const handleLinkClick = (categoryName?: string) => {
    if (categoryName && onSelectCategory) {
      onSelectCategory(categoryName);
    }
    onClose();
  };

  return (
    <div
      className="absolute top-full left-0 w-full bg-white border-b border-[#E6D2C0] shadow-hover z-50 animate-in fade-in duration-150"
      onMouseLeave={onClose}
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-20 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-10 text-left">
          
          {/* Column 1: Berdasarkan Usia */}
          <div className="space-y-4">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#B05A26]">
              BERDASARKAN USIA
            </h4>
            <ul className="space-y-2.5">
              {ageGroups.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => handleLinkClick(item.label)}
                    className="text-[14px] text-[#7A5644] hover:text-[#B05A26] hover:font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Buku */}
          <div className="space-y-4">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#B05A26]">
              BUKU
            </h4>
            <ul className="space-y-2.5">
              {bookCategories.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => handleLinkClick(item.label)}
                    className="text-[14px] text-[#7A5644] hover:text-[#B05A26] hover:font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Mainan & Kado */}
          <div className="space-y-4">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#B05A26]">
              MAINAN &amp; KADO
            </h4>
            <ul className="space-y-2.5">
              {toyCategories.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => handleLinkClick(item.label)}
                    className="text-[14px] text-[#7A5644] hover:text-[#B05A26] hover:font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Promo Menu */}
          <div className="space-y-3.5 bg-[#FFF6EA] border border-[#E6D2C0] p-5 rounded-2xl flex flex-col justify-between">
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#F2E4D6]">
              <img
                src="/images/products/produk-picture-book-hutan.png"
                alt="Koleksi Pilihan Bulan Ini"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-white/95 text-[#4A2A1C]">
                Curated
              </span>
            </div>

            <div>
              <h5 className="text-[14px] font-semibold text-[#4A2A1C]">
                Koleksi Pilihan Bulan Ini
              </h5>
              <p className="text-[12px] text-[#7A5644] mt-0.5">
                Pilihan board books &amp; balok Montessori terpopuler untuk tumbuh kembang si kecil.
              </p>
            </div>

            <Link
              href="/shop"
              onClick={() => handleLinkClick()}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#B05A26] hover:text-[#8E431A] transition-colors pt-1"
            >
              <span>Lihat Koleksi</span>
              <img src="/images/icons/icon-arrow-right.svg" alt="" className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
