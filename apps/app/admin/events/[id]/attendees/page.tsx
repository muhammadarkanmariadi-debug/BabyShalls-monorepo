'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ScanLine, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { ADMIN_TOKEN_STORAGE_KEY, extractApiError } from '@/lib/axios';
import { formatIDR } from '@/lib/utils';
import {
  EventRegistrationDto,
  useAdminEvent,
  useAdminEventRegistrations,
  useUpdateEventRegistrationStatus,
} from '@/hooks/useAdminEvents';
import { CsvExportButton } from '@/components/admin/ui/CsvExportButton';

export default function AdminEventAttendeesPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const eventId = params?.id || null;
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)) {
      router.replace('/admin/login');
      return;
    }
    setReady(true);
  }, [router]);

  const { data: event } = useAdminEvent(ready ? eventId : null);
  const { data: registrations = [], isLoading } = useAdminEventRegistrations(ready ? eventId : null);
  const updateRegMutation = useUpdateEventRegistrationStatus();

  const stats = useMemo(() => {
    let totalTickets = 0;
    let checkedIn = 0;
    let paidRevenue = 0;
    const unitPrice = event?.price ?? 0;

    for (const r of registrations) {
      const qty = r.ticketQuantity || 1;
      totalTickets += qty;
      if (r.status === 'CHECKED_IN') checkedIn += qty;
      if (r.paymentStatus === 'PAID') paidRevenue += unitPrice * qty;
    }

    return {
      totalTickets,
      checkedIn,
      notCheckedIn: Math.max(0, totalTickets - checkedIn),
      paidRevenue,
    };
  }, [registrations, event?.price]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return registrations;
    return registrations.filter(
      (r) =>
        r.childName.toLowerCase().includes(q) ||
        r.participantName.toLowerCase().includes(q) ||
        (r.ticketCode || '').toLowerCase().includes(q)
    );
  }, [registrations, search]);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#4A2A1C] font-sans">
      <header className="h-[68px] bg-white border-b border-[#E6D2C0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A5644] hover:text-[#B05A26] shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <span className="text-[#E6D2C0]">|</span>
          <h1 className="text-lg font-semibold text-[#4A2A1C] truncate">
            {event?.title || 'Peserta & Check-in'}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {eventId && (
            <CsvExportButton
              endpoint={`/admin/import-export/events/${eventId}/attendees/export`}
              filename={`peserta-event-${eventId.slice(0, 8)}.csv`}
              label="Export Peserta CSV"
            />
          )}
          <Link
            href="/admin/events/scan"
            className="h-9 px-4 rounded-[4px] bg-[#1E543B] hover:bg-[#163F2C] text-white text-xs font-semibold inline-flex items-center gap-1.5 shrink-0"
          >
            <ScanLine className="w-4 h-4" /> Scan QR Check-in
          </Link>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto p-4 sm:p-8 space-y-6">
        {/* 4 KPI Cards matching Figma 218:6487 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiBox label="Total Pendaftar" value={`${stats.totalTickets} tiket`} />
          <KpiBox label="Sudah Hadir (Check-in)" value={`${stats.checkedIn}`} />
          <KpiBox label="Belum Hadir" value={`${stats.notCheckedIn}`} />
          <KpiBox label="Total Pemasukan" value={formatIDR(stats.paidRevenue)} />
        </div>

        <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-[#4A2A1C]">
              Daftar Peserta ({filtered.length})
            </h2>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#7A5644] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama anak, orang tua, kode tiket..."
                className="w-full h-9 pl-9 pr-3 text-xs rounded-[4px] border border-[#E6D2C0]"
              />
            </div>
          </div>

          {isLoading ? (
            <p className="text-xs text-[#7A5644]">Memuat data peserta...</p>
          ) : filtered.length === 0 ? (
            <p className="text-xs text-[#7A5644] py-8 text-center">Belum ada peserta terdaftar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFF6EA] text-[#4A2A1C] font-semibold border-b border-[#E6D2C0]">
                  <tr>
                    <th className="py-3 px-3">Kode Tiket</th>
                    <th className="py-3 px-3">Anak &amp; Orang Tua</th>
                    <th className="py-3 px-3">Tiket</th>
                    <th className="py-3 px-3">Pembayaran</th>
                    <th className="py-3 px-3 text-right">Status Kehadiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2E4D6]">
                  {filtered.map((reg) => (
                    <tr key={reg.id} className="hover:bg-[#FFFDF9]">
                      <td className="py-3 px-3 font-mono font-semibold text-[#B05A26]">
                        {reg.ticketCode || '-'}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#4A2A1C]">
                          {reg.childName} ({reg.childAge})
                        </div>
                        <div className="text-[11px] text-[#7A5644]">
                          {reg.participantName} • {reg.whatsappNumber}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold">{reg.ticketQuantity}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold ${reg.paymentStatus === 'PAID' || reg.paymentStatus === 'FREE'
                              ? 'bg-[#E9F3E4] text-[#1E543B]'
                              : 'bg-amber-100 text-amber-800'
                            }`}
                        >
                          {reg.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <select
                          value={reg.status}
                          onChange={(e) =>
                            updateRegMutation.mutate(
                              {
                                regId: reg.id,
                                status: e.target.value as EventRegistrationDto['status'],
                              },
                              {
                                onSuccess: () => toast.success('Status peserta diperbarui.'),
                                onError: (err) => toast.error(extractApiError(err, 'Gagal update status.')),
                              }
                            )
                          }
                          className="h-8 px-2.5 rounded-[4px] border border-[#E6D2C0] bg-white font-semibold"
                        >
                          <option value="REGISTERED">REGISTERED</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="CHECKED_IN">CHECKED_IN</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function KpiBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-4">
      <p className="text-xs text-[#7A5644]">{label}</p>
      <p className="mt-1.5 text-xl font-semibold text-[#4A2A1C]">{value}</p>
    </div>
  );
}

