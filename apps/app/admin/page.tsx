'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  Link2,
  Mail,
  Package,
  Plus,
  ShoppingBag,
  Tag,
  TicketPercent,
  Truck,
  Users,
} from 'lucide-react';
import { ADMIN_TOKEN_STORAGE_KEY } from '@/lib/axios';
import { formatIDR } from '@/lib/utils';
import { useAdminOrders, useAdminStats } from '@/hooks/useAdminDashboard';
import { AdminNavItem, AdminShell } from '@/components/admin/ui/AdminShell';
import { SalesAnalyticsChart } from '@/components/admin/SalesAnalyticsChart';
import { AdminCatalogSection } from '@/components/admin/AdminCatalogSection';
import { AdminOrdersSection } from '@/components/admin/AdminOrdersSection';
import { AdminWorkshopsSection } from '@/components/admin/AdminWorkshopsSection';
import { AdminVouchersSection } from '@/components/admin/AdminVouchersSection';
import { AdminBroadcastSection } from '@/components/admin/AdminBroadcastSection';
import { AdminBookRequestsSection } from '@/components/admin/AdminBookRequestsSection';
import { AdminCmsSection } from '@/components/admin/AdminCmsSection';
import { AdminShortlinksSection } from '@/components/admin/AdminShortlinksSection';
import { AdminUsersSection } from '@/components/admin/AdminUsersSection';

type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'workshops'
  | 'vouchers'
  | 'broadcast'
  | 'shortlinks'
  | 'requests'
  | 'cms'
  | 'users';

interface AdminSessionUser {
  name?: string;
  email?: string;
  role?: string;
}

const TAB_TITLES: Record<AdminTab, string> = {
  dashboard: 'Dashboard',
  orders: 'Pesanan Masuk',
  products: 'Katalog Produk',
  workshops: 'Event & Check-in',
  vouchers: 'Voucher & Kupon',
  broadcast: 'Email Broadcast',
  shortlinks: 'Shortlink & QR',
  requests: 'Book Request Pengadaan Buku',
  cms: 'Konten (CMS)',
  users: 'Pengguna Staf',
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminSessionUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    try {
      const raw = window.localStorage.getItem('babyshalls_admin_user');
      const parsed: AdminSessionUser | null = raw ? JSON.parse(raw) : null;
      if (parsed && parsed.role && parsed.role !== 'ADMIN') {
        window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
        router.replace('/admin/login');
        return;
      }
      setAdminUser(parsed || { name: 'Admin', role: 'ADMIN' });
    } catch {
      setAdminUser({ name: 'Admin', role: 'ADMIN' });
    }
    setIsReady(true);
  }, [router]);

  const { data: stats, isError: isStatsError } = useAdminStats(isReady);
  const { data: orders = [] } = useAdminOrders(isReady && activeTab === 'dashboard');

  useEffect(() => {
    if (isStatsError && typeof window !== 'undefined') {
      const token = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
      if (!token) {
        router.replace('/admin/login');
      }
    }
  }, [isStatsError, router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
      window.localStorage.removeItem('babyshalls_admin_user');
      window.dispatchEvent(new Event('babyshalls-auth-changed'));
    }
    router.replace('/admin/login');
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center text-sm font-medium text-[#7A5644]">
        Memuat Panel Admin BabyShalls...
      </div>
    );
  }

  const pendingOrdersCount = orders.filter((o) => o.status === 'PAID' || o.status === 'PROCESSING').length;

  const navItems: AdminNavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      group: 'UTAMA',
      theme: 'terracotta',
    },
    {
      id: 'orders',
      label: 'Pesanan Masuk',
      icon: ShoppingBag,
      badge: pendingOrdersCount || undefined,
      group: 'TOKO & KATALOG',
      theme: 'blue',
      badgeTheme: 'yellow',
    },
    {
      id: 'products',
      label: 'Katalog Produk',
      icon: Package,
      group: 'TOKO & KATALOG',
      theme: 'yellow',
    },
    {
      id: 'vouchers',
      label: 'Voucher & Kupon',
      icon: TicketPercent,
      group: 'TOKO & KATALOG',
      theme: 'purple',
    },
    {
      id: 'workshops',
      label: 'Event & Check-in',
      icon: CalendarCheck,
      group: 'KEGIATAN & REQUEST BUKU',
      theme: 'purple',
    },
    {
      id: 'requests',
      label: 'Book Request',
      icon: BookOpen,
      badge: stats?.totalBookRequests,
      group: 'KEGIATAN & REQUEST BUKU',
      theme: 'teal',
      badgeTheme: 'teal',
    },
    {
      id: 'broadcast',
      label: 'Email Broadcast',
      icon: Mail,
      group: 'KEGIATAN & REQUEST BUKU',
      theme: 'blue',
    },
    {
      id: 'shortlinks',
      label: 'Shortlink & QR',
      icon: Link2,
      group: 'KEGIATAN & REQUEST BUKU',
      theme: 'green',
    },
    {
      id: 'cms',
      label: 'Konten (CMS)',
      icon: FileText,
      group: 'PENGATURAN',
      theme: 'green',
    },
    {
      id: 'users',
      label: 'Pengguna Staf',
      icon: Users,
      group: 'PENGATURAN',
      theme: 'pink',
    },
  ];

  return (
    <AdminShell
      navItems={navItems}
      activeTab={activeTab}
      onSelectTab={(id) => setActiveTab(id as AdminTab)}
      pageTitle={TAB_TITLES[activeTab]}
      adminName={adminUser?.name || 'Admin'}
      adminEmail={adminUser?.email || 'ADMIN'}
      onLogout={handleLogout}
    >
      {/* Mascot Welcome Hero Banner with Harmonious Pastel Accents */}
      <div className="bg-gradient-to-r from-[#FFF8EF] via-[#FBE6D8]/30 to-[#E4ECFB]/25 border border-[#E6D2C0] rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-2.5 max-w-xl z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#B05A26] text-white text-[11px] font-semibold rounded-full tracking-wide">
              Butik Citraland Malang
            </span>
            <span className="px-2.5 py-0.5 bg-[#E4ECFB] text-[#3F5FA0] text-[11px] font-semibold rounded-full border border-[#C5D7F8]">
              Buka Hari Ini 10.00 – 17.00 WIB
            </span>
            <span className="px-2.5 py-0.5 bg-[#DDF1E5] text-[#2A6E37] text-[11px] font-semibold rounded-full border border-[#BCE1C3]">
              Katalog Aktif
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#4A2A1C] leading-tight">
            Halo, {adminUser?.name || 'Admin BabyShalls'}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-[#7A5644] leading-relaxed">
            Ada <strong className="text-[#3F5FA0] font-semibold">{pendingOrdersCount} pesanan</strong> perlu diproses,{' '}
            <strong className="text-[#7E4A84] font-semibold">{stats?.totalEventRegistrations ?? 0} pendaftar workshop</strong>, dan{' '}
            <strong className="text-[#1F6B76] font-semibold">{stats?.totalBookRequests ?? 0} request pengadaan buku</strong> pelanggan.
          </p>

          {/* Quick Action Shortcuts with Colorful Tokens */}
          <div className="flex flex-wrap items-center gap-2 pt-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FFFBF7] border border-[#E6D2C0] hover:border-[#B05A26] text-xs font-semibold text-[#4A2A1C] rounded-[4px] transition-colors shadow-2xs cursor-pointer"
            >
              <Plus size={13} className="text-[#B05A26]" />
              <span>Kelola Produk</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E4ECFB] hover:bg-[#D5E3FA] border border-[#92B2F3]/60 text-xs font-semibold text-[#3F5FA0] rounded-[4px] transition-colors shadow-2xs cursor-pointer"
            >
              <Truck size={13} />
              <span>Kirim Pesanan ({pendingOrdersCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('workshops')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F3E6F2] hover:bg-[#EBD5EA] border border-[#BA7EB8]/60 text-xs font-semibold text-[#7E4A84] rounded-[4px] transition-colors shadow-2xs cursor-pointer"
            >
              <CalendarCheck size={13} />
              <span>Workshop &amp; Tiket</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cms')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DDF1E5] hover:bg-[#CEEAD6] border border-[#82BC85]/60 text-xs font-semibold text-[#2A6E37] rounded-[4px] transition-colors shadow-2xs cursor-pointer"
            >
              <FileText size={13} />
              <span>Edit Banner CMS</span>
            </button>
          </div>
        </div>

        {/* Right Mascot Graphic */}
        <div className="hidden md:flex items-center justify-center shrink-0 relative w-[130px] h-[130px] z-10">
          <Image
            src="/images/mascot/maskot-lompat-konfeti.png"
            alt="Maskot BabyShalls"
            fill
            className="object-contain drop-shadow-md"
          />
        </div>

        {/* Soft Decorative Pastel Circles in Background */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-[#E4ECFB]/40 blur-2xl pointer-events-none" />
        <div className="absolute right-36 -top-8 w-32 h-32 rounded-full bg-[#FFF1C7]/40 blur-2xl pointer-events-none" />
      </div>

      {/* 5 KPI Cards styled with Figma Design System Pastel Tokens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <KpiCard
          label="Pendapatan total"
          value={formatIDR(stats?.totalRevenue ?? 0)}
          hint="Transaksi terbayar"
          icon={Tag}
          theme="terracotta"
          trend="Omzet Toko"
        />
        <KpiCard
          label="Total pesanan"
          value={String(stats?.totalOrders ?? 0)}
          hint="Semua status order"
          icon={ShoppingBag}
          theme="blue"
          trend={`${pendingOrdersCount} Perlu Diproses`}
        />
        <KpiCard
          label="Total produk"
          value={String(stats?.totalProducts ?? 0)}
          hint="SKU katalog kurasi"
          icon={Package}
          theme="yellow"
          trend="Koleksi Buku & Mainan"
        />
        <KpiCard
          label="Pendaftar event"
          value={String(stats?.totalEventRegistrations ?? 0)}
          hint="Workshop Malang"
          icon={CalendarCheck}
          theme="purple"
          trend="Peserta Terdaftar"
        />
        <KpiCard
          label="Request buku"
          value={String(stats?.totalBookRequests ?? 0)}
          hint="Pengadaan buku"
          icon={BookOpen}
          theme="teal"
          trend="Concierge Kurasi"
        />
      </div>

      {activeTab === 'dashboard' && <SalesAnalyticsChart enabled={isReady} />}
      {activeTab === 'orders' && <AdminOrdersSection enabled={isReady} />}
      {activeTab === 'products' && <AdminCatalogSection enabled={isReady} />}
      {activeTab === 'workshops' && <AdminWorkshopsSection enabled={isReady} />}
      {activeTab === 'vouchers' && <AdminVouchersSection enabled={isReady} />}
      {activeTab === 'broadcast' && <AdminBroadcastSection enabled={isReady} />}
      {activeTab === 'shortlinks' && <AdminShortlinksSection enabled={isReady} />}
      {activeTab === 'requests' && <AdminBookRequestsSection enabled={isReady} />}
      {activeTab === 'cms' && <AdminCmsSection enabled={isReady} />}
      {activeTab === 'users' && <AdminUsersSection enabled={isReady} />}
    </AdminShell>
  );
}

interface KpiCardProps {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  theme: 'terracotta' | 'blue' | 'yellow' | 'purple' | 'teal';
  trend?: string;
}

const KPI_THEMES: Record<
  'terracotta' | 'blue' | 'yellow' | 'purple' | 'teal',
  { card: string; label: string; value: string; iconBox: string; hintBadge: string }
> = {
  terracotta: {
    card: 'bg-gradient-to-br from-white to-[#FBE6D8]/40 border-[#EFA27A]/60',
    label: 'text-[#8E431A]',
    value: 'text-[#4A2A1C]',
    iconBox: 'bg-[#FBE6D8] text-[#B05A26]',
    hintBadge: 'bg-[#DDF1E5] text-[#2A6E37] border border-[#82BC85]/40',
  },
  blue: {
    card: 'bg-gradient-to-br from-white to-[#E4ECFB]/40 border-[#92B2F3]/60',
    label: 'text-[#3F5FA0]',
    value: 'text-[#3F5FA0]',
    iconBox: 'bg-[#E4ECFB] text-[#3F5FA0]',
    hintBadge: 'bg-[#E4ECFB] text-[#3F5FA0] border border-[#92B2F3]/40',
  },
  yellow: {
    card: 'bg-gradient-to-br from-white to-[#FFF1C7]/40 border-[#F7C94B]/60',
    label: 'text-[#8A5A00]',
    value: 'text-[#8A5A00]',
    iconBox: 'bg-[#FFF1C7] text-[#8A5A00]',
    hintBadge: 'bg-[#FFF1C7] text-[#8A5A00] border border-[#F7C94B]/40',
  },
  purple: {
    card: 'bg-gradient-to-br from-white to-[#F3E6F2]/40 border-[#BA7EB8]/60',
    label: 'text-[#7E4A84]',
    value: 'text-[#7E4A84]',
    iconBox: 'bg-[#F3E6F2] text-[#7E4A84]',
    hintBadge: 'bg-[#F3E6F2] text-[#7E4A84] border border-[#BA7EB8]/40',
  },
  teal: {
    card: 'bg-gradient-to-br from-white to-[#DDF6F9]/40 border-[#8DDBE6]/60',
    label: 'text-[#1F6B76]',
    value: 'text-[#1F6B76]',
    iconBox: 'bg-[#DDF6F9] text-[#1F6B76]',
    hintBadge: 'bg-[#DDF6F9] text-[#1F6B76] border border-[#8DDBE6]/40',
  },
};

function KpiCard({ label, value, hint, icon: Icon, theme, trend }: KpiCardProps) {
  const styles = KPI_THEMES[theme];

  return (
    <div
      className={`p-4 sm:p-5 rounded-xl border shadow-xs flex flex-col justify-between transition-all hover:shadow-sm ${styles.card}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${styles.label}`}>
          {label}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${styles.iconBox}`}>
          <Icon size={16} />
        </div>
      </div>
      <div>
        <span className={`text-[20px] sm:text-[22px] font-bold block leading-tight truncate ${styles.value}`}>
          {value}
        </span>
        <div className="flex items-center justify-between gap-1.5 mt-2">
          <span className="text-[11px] font-medium text-[#7A5644] truncate">{hint}</span>
          {trend && (
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${styles.hintBadge}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
