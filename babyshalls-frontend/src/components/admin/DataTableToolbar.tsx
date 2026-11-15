'use client';

import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

interface DataTableToolbarProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  filterValue?: string;
  onFilterChange?: (val: string) => void;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  sortValue?: string;
  onSortChange?: (val: string) => void;
  sortOptions?: FilterOption[];
  rightAction?: React.ReactNode;
}

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Cari data...',
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel = 'Semua',
  sortValue,
  onSortChange,
  sortOptions,
  rightAction,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#FCF6EC]/70 border border-[#EBDCCB] rounded-2xl p-3">
      <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#6B3F2A]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-[38px] pl-9 pr-3.5 text-xs bg-white border border-[#EBDCCB] rounded-xl focus:outline-none focus:border-[#D9744A]"
          />
        </div>

        {filterOptions && onFilterChange && (
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="h-[38px] px-3 text-xs font-semibold bg-white border border-[#EBDCCB] rounded-xl text-[#502E1E] focus:outline-none focus:border-[#D9744A]"
          >
            <option value="ALL">{filterLabel}</option>
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {sortOptions && onSortChange && (
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6B3F2A]/70 absolute left-3 pointer-events-none" />
            <select
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-[38px] pl-8 pr-3 text-xs font-semibold bg-white border border-[#EBDCCB] rounded-xl text-[#502E1E] focus:outline-none focus:border-[#D9744A]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {rightAction && <div className="shrink-0 flex items-center gap-2">{rightAction}</div>}
    </div>
  );
}

