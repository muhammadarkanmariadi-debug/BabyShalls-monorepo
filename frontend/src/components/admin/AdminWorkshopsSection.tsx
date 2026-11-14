'use client';

import React, { useMemo, useState } from 'react';
import { Calendar, Edit2, Plus, QrCode, ScanLine, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AdminEventDto,
  EventRegistrationDto,
  useAdminEventRegistrations,
  useAdminEvents,
  useDeleteAdminEvent,
  useUpdateEventRegistrationStatus,
} from '../../hooks/useAdminEvents';
import { formatIDR } from '../../lib/utils';
import { extractApiError } from '../../lib/axios';
import { DataTableToolbar } from './DataTableToolbar';
import { WorkshopFormModal } from './WorkshopFormModal';
import { WorkshopShareModal } from './WorkshopShareModal';
import { EventQrScannerModal } from './EventQrScannerModal';
import { AdminModal } from './AdminModal';

export function AdminWorkshopsSection({ enabled }: { enabled: boolean }) {
  const { data: events = [], isLoading } = useAdminEvents(enabled);
  const deleteMutation = useDeleteAdminEvent();
  const updateRegMutation = useUpdateEventRegistrationStatus();

  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [formOpen, setFormOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEventDto | null>(null);
  const [shareEvent, setShareEvent] = useState<AdminEventDto | null>(null);
  const [regEvent, setRegEvent] = useState<AdminEventDto | null>(null);

  const { data: registrations = [], isLoading: regLoading } = useAdminEventRegistrations(
    regEvent?.id || null
  );

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
            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="h-[38px] px-3.5 rounded-xl bg-[#1E543B] hover:bg-[#163F2C] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ScanLine className="w-4 h-4" /> Scan QR Check-In
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingEvent(null);
                setFormOpen(true);
              }}
              className="h-[38px] px-4 rounded-xl bg-[#D9744A] hover:bg-[#c5633b] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Buat Workshop
            </button>
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
                  <button
                    type="button"
                    onClick={() => setRegEvent(ev)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#EBDCCB] text-[#502E1E] font-bold inline-flex items-center gap-1.5 hover:bg-[#FCF6EC] cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" /> Peserta ({ev.registrationsCount})
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEvent(ev);
                      setFormOpen(true);
                    }}
                    className="p-1.5 rounded-lg border border-[#EBDCCB] bg-white text-[#502E1E] cursor-pointer"
                    title="Edit Workshop"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm(`Hapus workshop "${ev.title}"?`)) return;
                      deleteMutation.mutate(ev.id, {
                        onSuccess: () => toast.success(`Workshop "${ev.title}" dihapus.`),
                        onError: (err) => toast.error(extractApiError(err, 'Gagal menghapus workshop.')),
                      });
                    }}
                    className="p-1.5 rounded-lg border border-[#EBDCCB] bg-white text-[#6B7280] hover:text-red-600 cursor-pointer"
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

      <WorkshopFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        editingEvent={editingEvent}
      />

      <WorkshopShareModal event={shareEvent} onClose={() => setShareEvent(null)} />

      <EventQrScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />

      <AdminModal
        isOpen={Boolean(regEvent)}
        onClose={() => setRegEvent(null)}
        title={`Peserta: ${regEvent?.title || ''}`}
        subtitle="Kelola status pembayaran & check-in kehadiran di lokasi."
        size="lg"
      >
        {regLoading ? (
          <p className="text-xs text-[#6B7280]">Memuat peserta...</p>
        ) : registrations.length === 0 ? (
          <p className="text-xs text-[#6B7280] py-6 text-center">Belum ada peserta mendaftar.</p>
        ) : (
          <div className="divide-y divide-[#F3ECE2] text-xs">
            {registrations.map((reg) => (
              <div key={reg.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-[#1A1A1A]">
                    {reg.childName} ({reg.childAge}) • {reg.ticketQuantity} Tiket
                  </div>
                  <div className="text-[#6B7280]">
                    Orang tua: {reg.participantName} ({reg.whatsappNumber}) • Kode:{' '}
                    <span className="font-mono font-bold text-[#502E1E]">{reg.ticketCode || '-'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${reg.paymentStatus === 'PAID' || reg.paymentStatus === 'FREE'
                        ? 'bg-[#E9F3E4] text-[#1E543B]'
                        : 'bg-amber-100 text-amber-800'
                      }`}
                  >
                    {reg.paymentStatus}
                  </span>
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
                    className="h-8 px-2 rounded-lg border border-[#EBDCCB] bg-[#FCF6EC] font-bold"
                  >
                    <option value="REGISTERED">REGISTERED</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CHECKED_IN">CHECKED_IN</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminModal>
    </div>
  );
}

