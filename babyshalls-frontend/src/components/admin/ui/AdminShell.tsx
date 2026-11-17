'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, Calendar, LogOut, Menu, Store, X, Sparkles } from 'lucide-react';

export type NavItemTheme = 'terracotta' | 'blue' | 'yellow' | 'purple' | 'teal' | 'green' | 'pink';

export interface AdminNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: string | number;
  group?: string;
  theme?: NavItemTheme;
  badgeTheme?: 'yellow' | 'teal' | 'blue' | 'pink' | 'green' | 'terracotta';
}

interface AdminShellProps {
  navItems: AdminNavItem[];
  activeTab: string;
  onSelectTab: (id: string) => void;
  pageTitle: string;
  adminName?: string;
  adminEmail?: string;
  onLogout: () => void;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

const THEME_STYLES: Record<NavItemTheme, { activeBg: string; activeText: string; border: string; iconColor: string }> = {
  terracotta: {
    activeBg: 'bg-[#FBE6D8]',
    activeText: 'text-[#8E431A]',
    border: 'border-l-4 border-[#B05A26]',
    iconColor: 'text-[#B05A26]',
  },
  blue: {
    activeBg: 'bg-[#E4ECFB]',
    activeText: 'text-[#3F5FA0]',
    border: 'border-l-4 border-[#3F5FA0]',
    iconColor: 'text-[#3F5FA0]',
  },
  yellow: {
    activeBg: 'bg-[#FFF1C7]',
    activeText: 'text-[#8A5A00]',
    border: 'border-l-4 border-[#D89F29]',
    iconColor: 'text-[#8A5A00]',
  },
  purple: {
    activeBg: 'bg-[#F3E6F2]',
    activeText: 'text-[#7E4A84]',
    border: 'border-l-4 border-[#BA7EB8]',
    iconColor: 'text-[#7E4A84]',
  },
  teal: {
    activeBg: 'bg-[#DDF6F9]',
    activeText: 'text-[#1F6B76]',
    border: 'border-l-4 border-[#8DDBE6]',
    iconColor: 'text-[#1F6B76]',
  },
  green: {
    activeBg: 'bg-[#DDF1E5]',
    activeText: 'text-[#2A6E37]',
    border: 'border-l-4 border-[#82BC85]',
    iconColor: 'text-[#2A6E37]',
  },
  pink: {
    activeBg: 'bg-[#FDE3E8]',
    activeText: 'text-[#B83246]',
    border: 'border-l-4 border-[#FBA6B2]',
    iconColor: 'text-[#B83246]',
  },
};

const BADGE_THEMES: Record<string, string> = {
  yellow: 'bg-[#FFF1C7] text-[#8A5A00] border border-[#F7C94B]',
  teal: 'bg-[#DDF6F9] text-[#1F6B76] border border-[#8DDBE6]',
  blue: 'bg-[#E4ECFB] text-[#3F5FA0] border border-[#92B2F3]',
  pink: 'bg-[#FDE3E8] text-[#B83246] border border-[#FBA6B2]',
  green: 'bg-[#DDF1E5] text-[#2A6E37] border border-[#82BC85]',
  terracotta: 'bg-[#FBE6D8] text-[#8E431A] border border-[#EFA27A]',
};

const GROUP_DOTS: Record<string, string> = {
  'UTAMA': 'bg-[#B05A26]',
  'TOKO & KATALOG': 'bg-[#3F5FA0]',
  'KEGIATAN & JASTIP': 'bg-[#7E4A84]',
  'PENGATURAN': 'bg-[#2A6E37]',
};

export function AdminShell({
  navItems,
  activeTab,
  onSelectTab,
  pageTitle,
  adminName = 'Admin',
  adminEmail = 'ADMIN',
  onLogout,
  headerActions,
  children,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const todayLabel = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#FFFDF9] border-r border-[#E6D2C0]">
      {/* Brand Header */}
      <div className="h-[70px] px-5 border-b border-[#E6D2C0] bg-white flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 shrink-0">
            <Image
              src="/BabyShallsLogo 1.PNG"
              alt="BabyShalls"
              fill
              sizes="32px"
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-[#4A2A1C] leading-tight">BabyShalls</p>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#E4ECFB] text-[#3F5FA0] border border-[#C5D7F8]">
                CMS
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#7A5644]">Admin Panel · Malang</p>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-[4px] text-[#7A5644] hover:bg-[#FFF6EA]"
          aria-label="Tutup Menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          const prevItem = navItems[idx - 1];
          const isNewGroup = item.group && (!prevItem || prevItem.group !== item.group);
          const themeConfig = THEME_STYLES[item.theme || 'terracotta'];
          const badgeClass = item.badgeTheme ? BADGE_THEMES[item.badgeTheme] : (active ? 'bg-white/80 text-[#4A2A1C]' : 'bg-[#F2E4D6] text-[#4A2A1C]');

          return (
            <React.Fragment key={item.id}>
              {isNewGroup && (
                <div className="text-[10px] font-bold text-[#7A5644] tracking-[0.08em] uppercase pt-4 pb-1.5 px-3 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${GROUP_DOTS[item.group!] || 'bg-[#B05A26]'}`} />
                  <span>{item.group}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-[4px] text-[13px] transition-all cursor-pointer ${
                  active
                    ? `${themeConfig.activeBg} ${themeConfig.activeText} ${themeConfig.border} font-semibold shadow-2xs`
                    : 'text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] font-normal'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${active ? themeConfig.iconColor : 'text-[#7A5644]'}`} />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge !== undefined && Number(item.badge) > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-[#E6D2C0] bg-white space-y-1.5">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-[4px] text-[13px] font-medium text-[#4A2A1C] hover:bg-[#FFF6EA] hover:text-[#B05A26] transition-colors"
        >
          <Store className="w-4 h-4 text-[#B05A26]" />
          <span>Lihat Toko Publik</span>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-[4px] text-[13px] font-medium text-[#C0392B] hover:bg-[#FDF2F2] transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#4A2A1C] flex font-sans">
      {/* Desktop Sidebar (264px fixed) */}
      <aside className="hidden lg:block w-[264px] shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#4A2A1C]/40 backdrop-blur-[1px]"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-[264px] max-w-[82vw] h-full z-10">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-[70px] bg-white border-b border-[#E6D2C0] px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-[4px] border border-[#E6D2C0] text-[#4A2A1C] hover:bg-[#FFF6EA] cursor-pointer"
              aria-label="Buka Menu Admin"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#4A2A1C] tracking-tight truncate">
                {pageTitle}
              </h1>
              <p className="text-[11px] text-[#7A5644] hidden sm:block">
                BabyShalls Butik Citraland Malang · Kurasi Buku &amp; Mainan Kayu Edukasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {headerActions}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#E6D2C0] bg-[#FFF8EF] text-xs font-medium text-[#4A2A1C]">
              <Calendar className="w-3.5 h-3.5 text-[#B05A26]" />
              <span>{todayLabel}</span>
            </div>
            <div
              className="w-8 h-8 rounded-[4px] border border-[#E6D2C0] bg-[#FFF8EF] flex items-center justify-center text-[#7A5644] hover:text-[#B05A26] hover:bg-[#FFF6EA] transition-colors cursor-pointer"
              title="Notifikasi Toko"
            >
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-[#E6D2C0]">
              <div className="w-8 h-8 rounded-[4px] bg-[#FBE6D8] border border-[#EFA27A]/50 text-[#B05A26] text-xs font-bold flex items-center justify-center">
                {adminName.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden md:block text-left leading-tight">
                <p className="text-xs font-semibold text-[#4A2A1C] max-w-[120px] truncate">{adminName}</p>
                <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#E4ECFB] text-[#3F5FA0] border border-[#C5D7F8]">
                  {adminEmail || 'ADMIN'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1300px] w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

