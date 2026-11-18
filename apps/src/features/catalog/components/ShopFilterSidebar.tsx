'use client';

import React from 'react';
import { RotateCcw, Search, X } from 'lucide-react';

interface ShopFilterSidebarProps {
  isFilterDrawerOpen: boolean;
  onCloseDrawer: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  ageOptions: string[];
  selectedAge: string;
  onSelectAge: (age: string) => void;
  categoryOptions: readonly string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  subCategories: string[];
  activeSubcategory: string;
  onSelectSubcategory: (sub: string) => void;
  showAllSubcategories: boolean;
  onToggleShowAllSubcategories: () => void;
  conditionOptions: string[];
  selectedCondition: string;
  onSelectCondition: (cond: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
  onlyInStock: boolean;
  onOnlyInStockChange: (val: boolean) => void;
  onlyDiscount: boolean;
  onOnlyDiscountChange: (val: boolean) => void;
  onResetFilters: () => void;
}

export const ShopFilterSidebar: React.FC<ShopFilterSidebarProps> = ({
  isFilterDrawerOpen,
  onCloseDrawer,
  searchQuery,
  onSearchChange,
  ageOptions,
  selectedAge,
  onSelectAge,
  categoryOptions,
  activeCategory,
  onSelectCategory,
  subCategories,
  activeSubcategory,
  onSelectSubcategory,
  showAllSubcategories,
  onToggleShowAllSubcategories,
  conditionOptions,
  selectedCondition,
  onSelectCondition,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onlyInStock,
  onOnlyInStockChange,
  onlyDiscount,
  onOnlyDiscountChange,
  onResetFilters,
}) => {
  return (
    <aside
      className={`w-full lg:w-[264px] shrink-0 ${isFilterDrawerOpen
          ? 'fixed inset-0 z-50 bg-black/40 flex justify-end lg:static lg:bg-transparent'
          : 'hidden lg:block'
        }`}
    >
      <div
        className={`w-full max-w-xs lg:max-w-none bg-white p-6 lg:p-0 h-full lg:h-auto overflow-y-auto lg:overflow-visible flex flex-col gap-7 ${isFilterDrawerOpen ? 'shadow-2xl' : ''
          }`}
      >
        {/* Mobile Drawer Header */}
        <div className="flex lg:hidden items-center justify-between pb-4 border-b border-[#F2E4D6]">
          <h3 className="font-semibold text-lg text-[#4A2A1C]">Filter Produk</h3>
          <button
            type="button"
            onClick={onCloseDrawer}
            className="p-1 text-gray-500 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter: Pencarian */}
        <div className="flex flex-col gap-2">
          <h4 className="text-[15px] font-semibold text-[#4A2A1C]">Cari Produk</h4>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#7A5644] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Judul, penulis, kategori..."
              className="w-full text-xs pl-8 pr-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
            />
          </div>
        </div>

        {/* Filter: Usia */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[15px] font-semibold text-[#4A2A1C]">Usia</h4>
          <div className="flex flex-wrap gap-1.5">
            {ageOptions.map((age) => {
              const isActive = selectedAge === age;
              return (
                <button
                  key={age}
                  type="button"
                  onClick={() => onSelectAge(age)}
                  className={`px-3 py-1.5 text-xs rounded-[2px] transition-colors cursor-pointer ${isActive
                      ? 'bg-[#B05A26] text-white font-medium'
                      : 'bg-[#FFF6EA] text-[#4A2A1C] border border-[#E6D2C0] hover:border-[#B05A26]'
                    }`}
                >
                  {age}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter: Kategori */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[15px] font-semibold text-[#4A2A1C]">Kategori</h4>
          <div className="flex flex-col gap-2">
            {categoryOptions.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2.5 text-sm text-[#4A2A1C] cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category_filter"
                  checked={activeCategory === cat}
                  onChange={() => onSelectCategory(cat)}
                  className="w-4 h-4 text-[#B05A26] border-[#C9B3A5] focus:ring-[#B05A26]"
                />
                <span className="group-hover:text-[#B05A26] transition-colors">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter: Sub-Kategori (dinamis sesuai Kategori terpilih, maks 5 + Lihat lainnya) */}
        {activeCategory !== 'Semua Kategori' && subCategories.length > 1 && (
          <div className="flex flex-col gap-3">
            <h4 className="text-[15px] font-semibold text-[#4A2A1C]">
              Sub-Kategori ({activeCategory})
            </h4>
            <div className="flex flex-col gap-2">
              {(showAllSubcategories ? subCategories : subCategories.slice(0, 5)).map((sub) => (
                <label
                  key={sub}
                  className="flex items-center gap-2.5 text-sm text-[#4A2A1C] cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="subcategory_filter"
                    checked={activeSubcategory === sub}
                    onChange={() => onSelectSubcategory(sub)}
                    className="w-4 h-4 text-[#B05A26] border-[#C9B3A5] focus:ring-[#B05A26]"
                  />
                  <span className="group-hover:text-[#B05A26] transition-colors">{sub}</span>
                </label>
              ))}
            </div>
            {subCategories.length > 5 && (
              <button
                type="button"
                onClick={onToggleShowAllSubcategories}
                className="text-xs font-semibold text-[#B05A26] hover:underline text-left cursor-pointer"
              >
                {showAllSubcategories
                  ? 'Lebih sedikit'
                  : `Lihat lainnya (+${subCategories.length - 5})`}
              </button>
            )}
          </div>
        )}

        {/* Filter: Kondisi */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[15px] font-semibold text-[#4A2A1C]">Kondisi</h4>
          <div className="flex flex-col gap-2">
            {conditionOptions.map((cond) => (
              <label
                key={cond}
                className="flex items-center gap-2.5 text-sm text-[#4A2A1C] cursor-pointer group"
              >
                <input
                  type="radio"
                  name="condition_filter"
                  checked={selectedCondition === cond}
                  onChange={() => onSelectCondition(cond)}
                  className="w-4 h-4 text-[#B05A26] border-[#C9B3A5] focus:ring-[#B05A26]"
                />
                <span className="group-hover:text-[#B05A26] transition-colors">{cond}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter: Harga */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[15px] font-semibold text-[#4A2A1C]">Rentang Harga</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
            />
            <span className="text-gray-400 text-xs">-</span>
            <input
              type="number"
              placeholder="Maks"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
            />
          </div>
        </div>

        {/* Filter: Ketersediaan */}
        <div className="flex items-center justify-between border-t border-[#F2E4D6] pt-4">
          <span className="text-sm text-[#4A2A1C] font-medium">Hanya stok tersedia</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => onOnlyInStockChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#B05A26]" />
          </label>
        </div>

        {/* Filter: Diskon / Promo */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#4A2A1C] font-medium">Hanya produk promo</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={onlyDiscount}
              onChange={(e) => onOnlyDiscountChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#B05A26]" />
          </label>
        </div>

        {/* Reset */}
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full py-2.5 border border-[#C9B3A5] text-[#4A2A1C] text-sm font-medium rounded-[2px] hover:bg-[#FFF6EA] hover:border-[#B05A26] transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Atur Ulang Filter</span>
        </button>
      </div>
    </aside>
  );
};

