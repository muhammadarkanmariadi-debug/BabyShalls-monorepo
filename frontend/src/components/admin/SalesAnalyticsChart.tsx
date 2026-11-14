'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import {
  AlertTriangle,
  Award,
  CalendarCheck,
  Heart,
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useAdminAnalytics } from '../../hooks/useAdminDashboard';
import { formatIDR } from '../../lib/utils';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: 'Menunggu Bayar', color: 'bg-amber-100 text-amber-800' },
  PAID: { label: 'Dibayar', color: 'bg-emerald-100 text-emerald-800' },
  PROCESSING: { label: 'Diproses', color: 'bg-blue-100 text-blue-800' },
  SHIPPED: { label: 'Dikirim', color: 'bg-indigo-100 text-indigo-800' },
  COMPLETED: { label: 'Selesai', color: 'bg-[#E9F3E4] text-[#1E543B]' },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' },
};

const PIE_COLORS = ['#D9744A', '#2E8B57', '#502E1E', '#E59A3C', '#5B7DB1', '#C86D8A', '#8C6239'];

function getDefaultDateRange(): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

export function SalesAnalyticsChart({ enabled }: { enabled: boolean }) {
  const defaults = getDefaultDateRange();
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [categoryMetric, setCategoryMetric] = useState<'revenue' | 'soldQty'>('revenue');
  const { data: analytics, isLoading } = useAdminAnalytics(enabled, startDate, endDate);

  const categorySales = analytics?.categorySales || [];
  const totalCategoryValue = categorySales.reduce(
    (sum, item) => sum + (categoryMetric === 'revenue' ? item.revenue : item.soldQty),
    0
  );

  const topProducts = analytics?.topProducts || [];
  const ageGroupSales = analytics?.ageGroupSales || [];
  const workshopOccupancy = analytics?.workshopOccupancy || [];
  const topWishlisted = analytics?.topWishlisted || [];
  const summary = analytics?.summary;

  return (
    <div className="space-y-5">
      {/* Row 1: Revenue Area Chart + Order Status & Low Stock */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8 bg-white border border-[#EBDCCB] rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#D9744A]" />
                <h2 className="text-base font-extrabold text-[#502E1E]">Grafik Penjualan &amp; Omzet</h2>
              </div>
              <p className="text-xs text-[#6B3F2A] mt-0.5">
                Akumulasi transaksi berstatus PAID hingga COMPLETED
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {summary && (
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-[#FCF6EC] border border-[#EBDCCB] font-bold text-[#502E1E]">
                    AOV: {formatIDR(summary.averageOrderValue)}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#E9F3E4] border border-[#CBE0C0] font-bold text-[#1E543B]">
                    Repeat: {summary.repeatBuyerRate}%
                  </span>
                </div>
              )}
              <div className="inline-flex flex-wrap items-center gap-1.5 rounded-xl bg-[#FCF6EC] border border-[#EBDCCB] px-2.5 py-1.5 text-xs">
                <label className="text-[11px] font-bold text-[#6B3F2A]">Dari</label>
                <input
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white border border-[#EBDCCB] rounded-lg px-2 py-1 text-[11px] font-bold text-[#502E1E] focus:outline-none focus:border-[#D9744A]"
                />
                <span className="text-[11px] font-bold text-[#6B3F2A]">s/d</span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white border border-[#EBDCCB] rounded-lg px-2 py-1 text-[11px] font-bold text-[#502E1E] focus:outline-none focus:border-[#D9744A]"
                />
              </div>
            </div>
          </div>

          <div className="h-[260px] w-full">
            {isLoading ? (
              <div className="w-full h-full rounded-xl bg-[#FCF6EC]/60 animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.series || []} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bsRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D9744A" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#D9744A" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1E6D8" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B3F2A' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6B3F2A' }}
                    tickFormatter={(val: number) =>
                      val >= 1000000 ? `${(val / 1000000).toFixed(1)}jt` : `${Math.round(val / 1000)}rb`
                    }
                  />
                  <Tooltip
                    formatter={(value) => [formatIDR(Number(value ?? 0)), 'Omzet']}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #EBDCCB',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#D9744A"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#bsRevenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="xl:col-span-4 space-y-5">
          <div className="bg-white border border-[#EBDCCB] rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-extrabold text-[#502E1E]">Status Pesanan</h3>
            <div className="space-y-2">
              {(analytics?.statusBreakdown || []).length === 0 ? (
                <p className="text-xs text-[#6B7280]">Belum ada data pesanan.</p>
              ) : (
                analytics?.statusBreakdown.map((item) => {
                  const meta = STATUS_LABELS[item.status] || {
                    label: item.status,
                    color: 'bg-gray-100 text-gray-800',
                  };
                  return (
                    <div key={item.status} className="flex items-center justify-between text-xs">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold ${meta.color}`}>
                        {meta.label}
                      </span>
                      <span className="font-extrabold text-[#502E1E]">{item.count} order</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white border border-[#EBDCCB] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-extrabold text-[#502E1E]">Stok Menipis (≤ 5)</h3>
            </div>
            <div className="space-y-2">
              {(analytics?.lowStockProducts || []).length === 0 ? (
                <p className="text-xs text-[#1E543B] font-semibold">Semua stok produk aman.</p>
              ) : (
                analytics?.lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-semibold text-[#1A1A1A]">{p.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-extrabold shrink-0 ${
                        p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.stock} pcs
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Top Selling Products + Category Sales Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 bg-white border border-[#EBDCCB] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D9744A]" />
              <h3 className="text-sm font-extrabold text-[#502E1E]">Produk Teratas Berdasarkan Penjualan</h3>
            </div>
            <span className="text-[11px] text-[#6B7280]">Top {topProducts.length} SKU</span>
          </div>

          {isLoading ? (
            <div className="h-[220px] rounded-xl bg-[#FCF6EC]/60 animate-pulse" />
          ) : topProducts.length === 0 ? (
            <p className="text-xs text-[#6B7280] py-10 text-center">
              Belum ada produk terjual (transaksi berstatus PAID ke atas).
            </p>
          ) : (
            <div className="space-y-2.5">
              {topProducts.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FCF6EC]/60 border border-[#F1E6D8]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                        idx === 0
                          ? 'bg-[#D9744A] text-white'
                          : idx === 1
                          ? 'bg-[#502E1E] text-white'
                          : 'bg-[#EBDCCB] text-[#502E1E]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#EBDCCB] shrink-0 bg-white"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#502E1E] truncate">{item.name}</p>
                      <p className="text-[11px] text-[#6B7280]">
                        {item.category} • Sisa stok: {item.stock} pcs
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-extrabold text-[#D9744A]">{item.soldQty} terjual</p>
                    <p className="text-[11px] font-semibold text-[#6B3F2A]">{formatIDR(item.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-6 bg-white border border-[#EBDCCB] rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-[#D9744A]" />
              <h3 className="text-sm font-extrabold text-[#502E1E]">Perbandingan Penjualan Antar Kategori</h3>
            </div>
            <div className="inline-flex rounded-lg bg-[#FCF6EC] border border-[#EBDCCB] p-0.5 gap-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setCategoryMetric('revenue')}
                className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                  categoryMetric === 'revenue' ? 'bg-[#D9744A] text-white' : 'text-[#6B3F2A]'
                }`}
              >
                Omzet
              </button>
              <button
                type="button"
                onClick={() => setCategoryMetric('soldQty')}
                className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                  categoryMetric === 'soldQty' ? 'bg-[#D9744A] text-white' : 'text-[#6B3F2A]'
                }`}
              >
                Qty
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="h-[220px] rounded-xl bg-[#FCF6EC]/60 animate-pulse" />
          ) : categorySales.length === 0 ? (
            <p className="text-xs text-[#6B7280] py-10 text-center">
              Belum ada data penjualan kategori.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-6 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySales}
                      dataKey={categoryMetric}
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {categorySales.map((entry, index) => (
                        <Cell key={entry.category} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        categoryMetric === 'revenue' ? formatIDR(Number(value ?? 0)) : `${value ?? 0} pcs`,
                        categoryMetric === 'revenue' ? 'Omzet' : 'Terjual',
                      ]}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #EBDCCB',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="sm:col-span-6 space-y-2">
                {categorySales.map((entry, index) => {
                  const val = categoryMetric === 'revenue' ? entry.revenue : entry.soldQty;
                  const pct = totalCategoryValue > 0 ? Math.round((val / totalCategoryValue) * 100) : 0;
                  return (
                    <div key={entry.category} className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        />
                        <span className="truncate font-semibold text-[#502E1E]">{entry.category}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-[#502E1E]">{pct}%</span>
                        <span className="text-[11px] text-[#6B7280] ml-1.5">
                          ({categoryMetric === 'revenue' ? formatIDR(entry.revenue) : `${entry.soldQty} pcs`})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Age Group Sales + Workshop Occupancy + Top Wishlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-white border border-[#EBDCCB] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#D9744A]" />
            <h3 className="text-sm font-extrabold text-[#502E1E]">Penjualan per Kelompok Usia</h3>
          </div>

          {isLoading ? (
            <div className="h-[200px] rounded-xl bg-[#FCF6EC]/60 animate-pulse" />
          ) : ageGroupSales.length === 0 ? (
            <p className="text-xs text-[#6B7280] py-10 text-center">Belum ada data penjualan usia.</p>
          ) : (
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageGroupSales} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1E6D8" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6B3F2A' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#6B3F2A' }} allowDecimals={false} />
                  <Tooltip
                    formatter={(value) => [`${value ?? 0} pcs`, 'Terjual']}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #EBDCCB',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="soldQty" fill="#D9744A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 bg-white border border-[#EBDCCB] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-[#2E8B57]" />
            <h3 className="text-sm font-extrabold text-[#502E1E]">Okupansi &amp; Check-In Workshop</h3>
          </div>

          {isLoading ? (
            <div className="h-[180px] rounded-xl bg-[#FCF6EC]/60 animate-pulse" />
          ) : workshopOccupancy.length === 0 ? (
            <p className="text-xs text-[#6B7280] py-8 text-center">Belum ada data workshop.</p>
          ) : (
            <div className="space-y-3">
              {workshopOccupancy.map((evt) => {
                const fillPct = evt.quota > 0 ? Math.min(100, Math.round((evt.registeredCount / evt.quota) * 100)) : 0;
                return (
                  <div key={evt.id} className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-[#502E1E] truncate">{evt.title}</span>
                      <span className="text-[11px] font-extrabold text-[#6B3F2A] shrink-0">
                        {evt.registeredCount}/{evt.quota} ({fillPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FCF6EC] overflow-hidden border border-[#EBDCCB]">
                      <div
                        className="h-full bg-[#2E8B57] rounded-full transition-all"
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                      <span>Hadir QR: {evt.checkedInCount}</span>
                      {evt.paidRevenue > 0 && (
                        <span className="font-bold text-[#1E543B]">{formatIDR(evt.paidRevenue)}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-3 bg-white border border-[#EBDCCB] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#D9744A]" />
            <h3 className="text-sm font-extrabold text-[#502E1E]">Paling Di-Wishlist</h3>
          </div>

          {isLoading ? (
            <div className="h-[180px] rounded-xl bg-[#FCF6EC]/60 animate-pulse" />
          ) : topWishlisted.length === 0 ? (
            <p className="text-xs text-[#6B7280] py-8 text-center">Belum ada produk di wishlist.</p>
          ) : (
            <div className="space-y-2.5">
              {topWishlisted.map((w) => (
                <div key={w.id} className="flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-[#502E1E] truncate">{w.name}</p>
                    <p className="text-[11px] text-[#6B7280]">Stok: {w.stock} pcs</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#FDECE6] text-[#D9744A] font-extrabold shrink-0">
                    ♥ {w.wishlistCount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
