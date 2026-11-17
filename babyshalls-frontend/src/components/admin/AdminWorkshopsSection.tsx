'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, Edit2, Plus, QrCode, ScanLine, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AdminEventDto,
  useAdminEvents,
  useDeleteAdminEvent,
} from '../../hooks/useAdminEvents';
import { formatIDR } from '../../lib/utils';
import { extractApiError } from '../../lib/axios';
import { DataTableToolbar } from './DataTableToolbar';
import { WorkshopShareModal } from './WorkshopShareModal';
import { AdminConfirmDialog } from './ui/AdminConfirmDialog';

export function AdminWorkshopsSection({ enabled }: { enabled: boolean }) {
  const { data: events = [], isLoading } = useAdminEvents(enabled);
  const deleteMutation = useDeleteAdminEvent();

  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [shareEvent, setShareEvent] = useState<AdminEventDto | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<AdminEventDto | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = events.filter((ev) => {
      if (priceFilter === 'FREE' && ev.price > 0) return false;
      if (priceFilter === 'PAID' && ev.price <= 0) return false;
      if (q) {
        const match =
          ev.title.toLowerCase().includes(q) ||
          (ev.shortCode || '').toLowerCase().includes(q) ||
          ev.category.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'date_asc') return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      if (sortBy === 'price_desc') return b.price - a.price;
      return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
    });
  }, [events, search, priceFilter, sortBy]);

  return (
    <div className="bg-white border border-[#EBDCCB] rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="text-base font-extrabold text-[#502E1E]">
          Manajemen Workshops &amp; Events ({filtered.length}/{events.length})
        </h2>
        <p className="text-xs text-[#6B3F2A]">
          Kelola workshop gratis maupun berbayar, shortlink, QR share, &amp; daftar peserta.
        </p>
      </div>

      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari judul workshop atau shortlink code..."
        filterValue={priceFilter}
        onFilterChange={setPriceFilter}
        filterOptions={[
          { label: 'Gratis', value: 'FREE' },
          { label: 'Berbayar', value: 'PAID' },
        ]}
        filterLabel="Semua Tipe Tiket"
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Jadwal Terbaru', value: 'newest' },
          { label: 'Jadwal Terdekat', value: 'date_asc' },
          { label: 'Harga Tertinggi', value: 'price_desc' },
        ]}
        rightAction={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/events/scan"
              className="h-[38px] px-3.5 rounded-[4px] bg-[#1E543B] hover:bg-[#163F2C] text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <ScanLine className="w-4 h-4" /> Scan QR Check-In
            </Link>
            <Link
              href="/admin/events/new"
              className="h-[38px] px-4 rounded-[4px] bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Buat Workshop
            </Link>
          </div>
        }
      />

      {isLoading ? (
        <p className="text-xs text-[#6B7280]">Memuat daftar workshop...</p>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-[#6B7280] py-6 text-center">Belum ada workshop yang cocok.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((ev) => (
            <div
              key={ev.id}
              className="border border-[#EBDCCB] rounded-2xl p-4 flex flex-col justify-between gap-3 bg-[#FCF6EC]/35"
            >
              <div className="flex gap-3">
                <img
                  src={ev.bannerImage || '/images/event-craft.jpg'}
                  alt={ev.title}
                  className="w-20 h-20 rounded-xl object-cover border border-[#EBDCCB] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ev.price > 0 ? 'bg-[#FDF0B8] text-[#502E1E]' : 'bg-[#E9F3E4] text-[#1E543B]'
                        }`}
                    >
                      {ev.price > 0 ? formatIDR(ev.price) : 'GRATIS'}
                    </span>
                    {ev.shortCode && (
                      <span className="px-2 py-0.5 rounded-full bg-white border border-[#EBDCCB] font-mono text-[10px] font-bold text-[#6B3F2A]">
                        /w/{ev.shortCode}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-extrabold text-[#1A1A1A] line-clamp-1">{ev.title}</h3>
                  <div className="text-[11px] text-[#6B3F2A] flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-[#D9744A]" />
                    <span>
                      {new Date(ev.eventDate).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      • {ev.timeString}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5">
                    Sisa kuota: <strong>{ev.quota}</strong> • Terdaftar: <strong>{ev.registrationsCount}</strong>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EBDCCB]/70 text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShareEvent(ev)}
                    className="px-3 py-1.5 rounded-lg bg-[#FDF0B8] text-[#502E1E] font-bold inline-flex items-center gap-1.5 hover:bg-[#FCE694] cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" /> Shortlink &amp; QR
                  </button>
                  <Link
                    href={`/admin/events/${ev.id}/attendees`}
                    className="px-3 py-1.5 rounded-[4px] bg-white border border-[#E6D2C0] text-[#4A2A1C] font-semibold inline-flex items-center gap-1.5 hover:bg-[#FFF6EA]"
                  >
                    <Users className="w-3.5 h-3.5" /> Peserta ({ev.registrationsCount})
                  </Link>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/events/${ev.id}/edit`}
                    className="p-1.5 rounded-[4px] border border-[#E6D2C0] bg-white text-[#4A2A1C] hover:bg-[#FFF6EA]"
                    title="Edit Workshop"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeletingEvent(ev)}
                    className="p-1.5 rounded-[4px] border border-[#E6D2C0] bg-white text-[#7A5644] hover:text-red-600 cursor-pointer"
                    title="Hapus Workshop"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <WorkshopShareModal event={shareEvent} onClose={() => setShareEvent(null)} />

      <AdminConfirmDialog
        isOpen={Boolean(deletingEvent)}
        onClose={() => setDeletingEvent(null)}
        title="Hapus workshop ini?"
        description={`Workshop "${deletingEvent?.title || ''}" beserta data pendaftarannya akan dihapus. Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deletingEvent) return;
          deleteMutation.mutate(deletingEvent.id, {
            onSuccess: () => {
              toast.success(`Workshop "${deletingEvent.title}" dihapus.`);
              setDeletingEvent(null);
            },
            onError: (err) => toast.error(extractApiError(err, 'Gagal menghapus workshop.')),
          });
        }}
      />
    </div>
  );
}

