'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, Calendar, LogOut, Menu, Store, X } from 'lucide-react';

export interface AdminNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
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
    <div className="flex flex-col h-full bg-white border-r border-[#E6D2C0]">
      {/* Brand */}
      <div className="h-[68px] px-5 border-b border-[#E6D2C0] flex items-center justify-between">
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
            <p className="text-sm font-bold text-[#4A2A1C] leading-tight">BabyShalls</p>
            <p className="text-[11px] font-medium text-[#7A5644]">Admin Panel</p>
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

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-[4px] text-[13px] font-medium transition-colors cursor-pointer ${active
                  ? 'bg-[#FBE6D8] text-[#B05A26] font-semibold'
                  : 'text-[#7A5644] hover:bg-[#FFF6EA] hover:text-[#4A2A1C]'
                }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </span>
              {item.badge !== undefined && Number(item.badge) > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold ${active ? 'bg-[#B05A26] text-white' : 'bg-[#F2E4D6] text-[#4A2A1C]'
                    }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-[#E6D2C0] space-y-1.5">
        <Link
          href="/"
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-[4px] text-[13px] font-medium text-[#4A2A1C] hover:bg-[#FFF6EA] transition-colors"
        >
          <Store className="w-4 h-4 text-[#B05A26]" />
          <span>Lihat Toko</span>
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
      {/* Desktop Sidebar (264px fixed like Figma Admin/Sidebar) */}
      <aside className="hidden lg:block w-[264px] shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#4A2A1C]/40"
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
        <header className="h-[68px] bg-white border-b border-[#E6D2C0] px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-[4px] border border-[#E6D2C0] text-[#4A2A1C] hover:bg-[#FFF6EA]"
              aria-label="Buka Menu Admin"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#4A2A1C] tracking-tight truncate">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {headerActions}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#E6D2C0] bg-[#FFFDF9] text-xs font-medium text-[#4A2A1C]">
              <Calendar className="w-3.5 h-3.5 text-[#B05A26]" />
              <span>{todayLabel}</span>
            </div>
            <div
              className="w-8 h-8 rounded-[4px] border border-[#E6D2C0] bg-[#FFFDF9] flex items-center justify-center text-[#7A5644]"
              title="Notifikasi"
            >
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-[#B05A26] text-white text-xs font-bold flex items-center justify-center">
                {adminName.slice(0, 1).toUpperCase()}
              </div>
              <div className="hidden md:block text-left leading-tight">
                <p className="text-xs font-semibold text-[#4A2A1C] max-w-[120px] truncate">{adminName}</p>
                <p className="text-[10px] text-[#7A5644] max-w-[120px] truncate">{adminEmail}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1240px] w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

