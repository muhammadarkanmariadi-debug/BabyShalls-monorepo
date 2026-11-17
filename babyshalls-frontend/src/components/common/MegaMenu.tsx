'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useStorefrontProducts } from '@/hooks/useProducts';
import { MAIN_CATEGORIES, resolveProductTaxonomy } from '@/lib/catalog-categories';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { products } = useStorefrontProducts();
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);

  const ageGroups = [
    { label: 'Newborn (0–12 bln)', href: '/shop?age=0%E2%80%931+th' },
    { label: '1–3 tahun', href: '/shop?age=1%E2%80%933+th' },
    { label: '3+ tahun', href: '/shop?age=3%2B+th' },
    { label: '6+ tahun', href: '/shop?age=6%2B+th' },
    { label: 'Semua usia', href: '/shop' },
  ];

  const mainCategories = [
    ...MAIN_CATEGORIES.map((cat) => ({
      label: cat,
      href: `/shop?category=${encodeURIComponent(cat)}`,
    })),
    { label: 'Semua Produk', href: '/shop' },
  ];

  const allSubCategories = useMemo(() => {
    const map = new Map<string, { label: string; href: string }>();
    products.forEach((p) => {
      const { mainCategory, subCategory } = resolveProductTaxonomy(p);
      if (subCategory && !map.has(subCategory.toLowerCase())) {
        map.set(subCategory.toLowerCase(), {
          label: subCategory,
          href: `/shop?category=${encodeURIComponent(mainCategory)}&subCategory=${encodeURIComponent(subCategory)}`,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [products]);

  if (!isOpen) return null;

  const MAX_SUB_VISIBLE = 4;
  const visibleSubCategories = showAllSubcategories
    ? allSubCategories
    : allSubCategories.slice(0, MAX_SUB_VISIBLE);
  const hiddenSubCount = Math.max(0, allSubCategories.length - MAX_SUB_VISIBLE);

  const handleLinkClick = (categoryName?: string) => {
    if (categoryName && onSelectCategory) {
      onSelectCategory(categoryName);
    }
    onClose();
  };

  return (
    <div
      className="absolute top-full left-0 w-full bg-white border-b border-[#E6D2C0] shadow-[0_16px_40px_rgba(74,42,28,0.12)] z-50 animate-in fade-in duration-150 before:content-[''] before:absolute before:-top-4 before:left-0 before:w-full before:h-4 before:bg-transparent"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave || onClose}
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

          {/* Column 2: Kategori (4 Jenis Barang) */}
          <div className="space-y-4">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#B05A26]">
              KATEGORI
            </h4>
            <ul className="space-y-2.5">
              {mainCategories.map((item) => (
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

          {/* Column 3: Sub-Kategori (terbatas + Lihat lainnya) */}
          <div className="space-y-4">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#B05A26]">
              SUB-KATEGORI
            </h4>
            <ul className="space-y-2.5">
              {visibleSubCategories.map((item) => (
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
              {hiddenSubCount > 0 && (
                <li>
                  <button
                    type="button"
                    onClick={() => setShowAllSubcategories((prev) => !prev)}
                    className="text-[13px] font-semibold text-[#B05A26] hover:underline cursor-pointer"
                  >
                    {showAllSubcategories ? 'Lebih sedikit' : `Lihat lainnya (+${hiddenSubCount})`}
                  </button>
                </li>
              )}
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
