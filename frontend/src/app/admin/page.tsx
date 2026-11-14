'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Ticket,
  BookOpen,
  Calendar,
  LogOut,
  BookMarked,
  Sliders,
  Mail,
  ExternalLink,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { formatIDR } from '../../lib/utils';
import { ADMIN_TOKEN_STORAGE_KEY, USER_TOKEN_STORAGE_KEY } from '../../lib/axios';
import { useCurrentUser } from '../../hooks/useAuth';
import { useAdminStats } from '../../hooks/useAdminDashboard';
import { SalesAnalyticsChart } from '../../components/admin/SalesAnalyticsChart';
import { AdminOrdersSection } from '../../components/admin/AdminOrdersSection';
import { AdminCatalogSection } from '../../components/admin/AdminCatalogSection';
import { AdminWorkshopsSection } from '../../components/admin/AdminWorkshopsSection';
import { AdminVouchersSection } from '../../components/admin/AdminVouchersSection';
import { AdminBroadcastSection } from '../../components/admin/AdminBroadcastSection';
import { AdminBookRequestsSection } from '../../components/admin/AdminBookRequestsSection';
import { AdminCmsSection } from '../../components/admin/AdminCmsSection';

type AdminSection =
  | 'overview'
  | 'orders'
  | 'catalog'
  | 'workshops'
  | 'vouchers'
  | 'broadcast'
  | 'book-requests'
  | 'cms';

export default function AdminDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [section, setSection] = useState<AdminSection>('overview');
  const [hasToken, setHasToken] = useState(false);
  const [checkedToken, setCheckedToken] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);

  useEffect(() => {
    const token =
      window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ||
      window.localStorage.getItem(USER_TOKEN_STORAGE_KEY);
    if (!token) {
      router.replace('/auth?redirect=/admin');
      return;
    }
    setHasToken(true);
    setCheckedToken(true);
  }, [router]);

  const { data: currentUser, isLoading: userLoading, isError: userError } = useCurrentUser(hasToken);

  useEffect(() => {
    if (!checkedToken || userLoading) return;
    if (userError || !currentUser) {
      window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
      router.replace('/auth?redirect=/admin');
      return;
    }
    if (currentUser.role !== 'ADMIN') {
      toast.error('Akses khusus Admin BabyShalls.');
      router.replace('/account');
    }
  }, [checkedToken, userLoading, userError, currentUser, router]);

  const isAdminVerified = Boolean(currentUser && currentUser.role === 'ADMIN');
  const { data: stats } = useAdminStats(isAdminVerified);

  const handleAdminLogout = () => {
    window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(USER_TOKEN_STORAGE_KEY);
    window.dispatchEvent(new Event('babyshalls-auth-changed'));
    queryClient.clear();
    toast.success('Sesi Admin diakhiri.');
    router.replace('/auth');
  };

  if (!checkedToken || userLoading || !isAdminVerified) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-full border-4 border-[#D9744A]/30 border-t-[#D9744A] animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#502E1E]">Memverifikasi sesi Admin BabyShalls...</p>
        </div>
      </div>
    );
  }

  const navItems: { id: AdminSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Ringkasan & Grafik', icon: LayoutDashboard },
    { id: 'orders', label: 'Pesanan & Pengiriman', icon: Package },
    { id: 'catalog', label: `Katalog SKU (${stats?.totalProducts ?? 0})`, icon: BookOpen },
    { id: 'workshops', label: 'Workshops & QR Share', icon: Calendar },
    { id: 'vouchers', label: 'Kupon & Voucher', icon: Ticket },
    { id: 'broadcast', label: 'Email Broadcast', icon: Mail },
    { id: 'book-requests', label: 'Book Request Jastip', icon: BookMarked },
    { id: 'cms', label: 'Semi-CMS Storefront', icon: Sliders },
  ];

  const activeTitle = navItems.find((n) => n.id === section)?.label || 'Admin Dashboard';

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      {!sidebarHidden && (
        <aside
          className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[#EBDCCB] z-30 transition-all duration-200 ${
            sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
          }`}
        >
          <div className="px-4 py-4 border-b border-[#EBDCCB] flex items-center justify-between gap-2">
            <div className={`flex items-center gap-3 min-w-0 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
              <img
                src="/logo.png"
                alt="BabyShalls"
                className="w-9 h-9 rounded-full border border-[#EBDCCB] object-contain p-0.5 shrink-0"
              />
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1E543B] block truncate">
                    BabyShalls Admin
                  </span>
                  <h1 className="text-sm font-extrabold text-[#502E1E] leading-tight truncate">
                    Command Center
                  </h1>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                title="Perkecil Sidebar"
                className="p-1.5 rounded-lg text-[#6B3F2A] hover:bg-[#FCF6EC] cursor-pointer shrink-0"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {sidebarCollapsed && (
            <div className="px-2 pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setSidebarCollapsed(false)}
                title="Perlebar Sidebar"
                className="p-2 rounded-xl text-[#6B3F2A] hover:bg-[#FCF6EC] cursor-pointer"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  title={item.label}
                  onClick={() => setSection(item.id)}
                  className={`w-full min-h-[42px] px-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                    sidebarCollapsed ? 'justify-center' : ''
                  } ${
                    active
                      ? 'bg-[#D9744A] text-white shadow-sm'
                      : 'text-[#502E1E] hover:bg-[#FCF6EC]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-[#EBDCCB] space-y-2">
            <Link
              href="/"
              target="_blank"
              title="Lihat Storefront"
              className="w-full h-9 px-3 rounded-xl border border-[#EBDCCB] bg-[#FCF6EC] text-xs font-bold text-[#502E1E] flex items-center justify-center gap-1.5 hover:bg-[#F5E9D9]"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span>Lihat Storefront</span>}
            </Link>
            <button
              type="button"
              onClick={handleAdminLogout}
              title="Keluar Admin"
              className="w-full h-9 px-3 rounded-xl border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span>Keluar Admin</span>}
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          sidebarHidden ? 'lg:pl-0' : sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-[#EBDCCB] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-[#EBDCCB] text-[#502E1E]"
              aria-label="Menu Admin"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => setSidebarHidden((prev) => !prev)}
              title={sidebarHidden ? 'Tampilkan Sidebar' : 'Sembunyikan Sidebar'}
              className="hidden lg:inline-flex p-2 rounded-xl border border-[#EBDCCB] bg-[#FCF6EC] text-[#502E1E] hover:bg-[#F5E9D9] cursor-pointer"
            >
              {sidebarHidden ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#502E1E]">{activeTitle}</h2>
              <p className="hidden sm:block text-[11px] text-[#6B3F2A]">
                Malang Single-Store Boutique • {currentUser?.name} ({currentUser?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={handleAdminLogout}
              className="p-2 rounded-xl border border-red-200 text-red-600"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile Drawer Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#EBDCCB] p-3 grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    section === item.id ? 'bg-[#D9744A] text-white' : 'bg-[#FCF6EC] text-[#502E1E]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {section === 'overview' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#FAF4E8] border border-[#EBDCCB]">
                  <span className="text-xs font-bold text-[#6B3F2A]">Omzet Tercatat</span>
                  <div className="text-xl font-extrabold text-[#502E1E] mt-1">
                    {formatIDR(stats?.totalRevenue ?? 0)}
                  </div>
                  <span className="text-[11px] font-bold text-[#1E543B]">
                    {stats?.totalOrders ?? 0} total pesanan
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-[#FDECE6] border border-[#EBDCCB]">
                  <span className="text-xs font-bold text-[#6B3F2A]">Total Produk</span>
                  <div className="text-xl font-extrabold text-[#502E1E] mt-1">
                    {stats?.totalProducts ?? 0} SKU
                  </div>
                  <span className="text-[11px] font-bold text-[#502E1E]">Katalog Aktif</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#E9F3E4] border border-[#EBDCCB]">
                  <span className="text-xs font-bold text-[#6B3F2A]">Request a Book</span>
                  <div className="text-xl font-extrabold text-[#502E1E] mt-1">
                    {stats?.totalBookRequests ?? 0}
                  </div>
                  <span className="text-[11px] font-bold text-[#1E543B]">Jastip Buku Impor</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#EBF1FA] border border-[#EBDCCB]">
                  <span className="text-xs font-bold text-[#6B3F2A]">Peserta Workshop</span>
                  <div className="text-xl font-extrabold text-[#502E1E] mt-1">
                    {stats?.totalEventRegistrations ?? 0}
                  </div>
                  <span className="text-[11px] font-bold text-[#1E543B]">Pendaftar Terdata</span>
                </div>
              </div>

              <SalesAnalyticsChart enabled={isAdminVerified} />
              <AdminOrdersSection enabled={isAdminVerified} />
            </>
          )}

          {section === 'orders' && <AdminOrdersSection enabled={isAdminVerified} />}
          {section === 'catalog' && <AdminCatalogSection enabled={isAdminVerified} />}
          {section === 'workshops' && <AdminWorkshopsSection enabled={isAdminVerified} />}
          {section === 'vouchers' && <AdminVouchersSection enabled={isAdminVerified} />}
          {section === 'broadcast' && <AdminBroadcastSection enabled={isAdminVerified} />}
          {section === 'book-requests' && <AdminBookRequestsSection enabled={isAdminVerified} />}
          {section === 'cms' && <AdminCmsSection enabled={isAdminVerified} />}
        </main>
      </div>
    </div>
  );
}
