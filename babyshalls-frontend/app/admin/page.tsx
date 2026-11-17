'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  Link2,
  Mail,
  Package,
  ShoppingBag,
  TicketPercent,
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
  orders: 'Pesanan',
  products: 'Produk',
  workshops: 'Event & Check-in',
  vouchers: 'Voucher & Kupon',
  broadcast: 'Email Broadcast',
  shortlinks: 'Shortlink & QR',
  requests: 'Book Request',
  cms: 'Konten (CMS)',
  users: 'Pengguna',
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Pesanan', icon: ShoppingBag, badge: pendingOrdersCount || undefined },
    { id: 'products', label: 'Produk', icon: Package },
    { id: 'workshops', label: 'Event & Check-in', icon: CalendarCheck },
    { id: 'vouchers', label: 'Voucher & Kupon', icon: TicketPercent },
    { id: 'broadcast', label: 'Email Broadcast', icon: Mail },
    { id: 'shortlinks', label: 'Shortlink & QR', icon: Link2 },
    { id: 'requests', label: 'Book Request', icon: BookOpen, badge: stats?.totalBookRequests },
    { id: 'cms', label: 'Konten (CMS)', icon: FileText },
    { id: 'users', label: 'Pengguna', icon: Users },
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
      {/* 5 KPI Cards matching Figma Admin – Dashboard (218:4716) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Pendapatan total"
          value={formatIDR(stats?.totalRevenue ?? 0)}
          hint="Transaksi terbayar"
        />
        <KpiCard
          label="Total pesanan"
          value={String(stats?.totalOrders ?? 0)}
          hint="Semua status"
        />
        <KpiCard
          label="Total produk"
          value={String(stats?.totalProducts ?? 0)}
          hint="SKU katalog aktif"
        />
        <KpiCard
          label="Pendaftar event"
          value={String(stats?.totalEventRegistrations ?? 0)}
          hint="Workshop Malang"
        />
        <KpiCard
          label="Request buku"
          value={String(stats?.totalBookRequests ?? 0)}
          hint="Permintaan jastip"
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

function KpiCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-5 flex flex-col justify-between">
      <p className="text-xs font-medium text-[#7A5644]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#4A2A1C] tracking-tight truncate">{value}</p>
      <p className="mt-2 text-[11px] font-medium text-[#B05A26]">{hint}</p>
    </div>
  );
}
