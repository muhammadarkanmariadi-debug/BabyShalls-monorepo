'use client';

import React, { useMemo, useState } from 'react';
import { Edit2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminBookRequest, useAdminBookRequests, useUpdateBookRequest } from '../../hooks/useAdminDashboard';
import { extractApiError } from '../../lib/axios';
import { DataTableToolbar } from './DataTableToolbar';
import { AdminModal } from './AdminModal';

const STATUS_OPTIONS: { label: string; value: AdminBookRequest['status'] }[] = [
  { label: 'PENDING', value: 'PENDING' },
  { label: 'QUOTED', value: 'QUOTED' },
  { label: 'ORDERED', value: 'ORDERED' },
  { label: 'COMPLETED', value: 'COMPLETED' },
];

export function AdminBookRequestsSection({ enabled }: { enabled: boolean }) {
  const { data: requests = [], isLoading } = useAdminBookRequests(enabled);
  const updateMutation = useUpdateBookRequest();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [selected, setSelected] = useState<AdminBookRequest | null>(null);
  const [draftStatus, setDraftStatus] = useState<AdminBookRequest['status']>('PENDING');
  const [draftNotes, setDraftNotes] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = requests.filter((r) => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (q) {
        const match =
          r.title.toLowerCase().includes(q) ||
          (r.customerName || '').toLowerCase().includes(q) ||
          (r.authorPublisher || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
    return [...list].sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [requests, search, statusFilter, sortBy]);

  const openModal = (req: AdminBookRequest) => {
    setSelected(req);
    setDraftStatus(req.status);
    setDraftNotes(req.adminNotes || '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    try {
      await updateMutation.mutateAsync({
        id: selected.id,
        status: draftStatus,
        adminNotes: draftNotes.trim() || null,
      });
      toast.success(`Book Request "${selected.title}" diperbarui.`);
      setSelected(null);
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal memperbarui Book Request.'));
    }
  };

  return (
    <div className="bg-white border border-[#EBDCCB] rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="text-base font-extrabold text-[#502E1E]">
          Book Request Jastip ({filtered.length}/{requests.length})
        </h2>
        <p className="text-xs text-[#6B3F2A]">Kelola permintaan buku impor &amp; konfirmasi harga via WhatsApp.</p>
      </div>

      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari judul buku, penulis, atau pemohon..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={STATUS_OPTIONS}
        filterLabel="Semua Status"
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Terbaru', value: 'newest' },
          { label: 'Terlama', value: 'oldest' },
        ]}
      />

      {isLoading ? (
        <p className="text-xs text-[#6B7280]">Memuat permintaan buku...</p>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-[#6B7280] py-6 text-center">Belum ada permintaan Book Request yang cocok.</p>
      ) : (
        <div className="divide-y divide-[#F3ECE2] text-xs">
          {filtered.map((req) => (
            <div key={req.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-extrabold text-[#1A1A1A]">{req.title}</div>
                <div className="text-[#6B7280] mt-0.5">
                  Pemohon: {req.customerName || 'Pelanggan'} ({req.whatsappNumber})
                  {req.authorPublisher ? ` • ${req.authorPublisher}` : ''}
                </div>
                {req.adminNotes && (
                  <div className="text-[11px] text-[#502E1E] mt-1 bg-[#FCF6EC] px-2.5 py-1 rounded-lg inline-block">
                    Catatan: {req.adminNotes}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#FCF6EC] border border-[#EBDCCB] font-bold text-[#502E1E]">
                  {req.status}
                </span>
                <a
                  href={`https://wa.me/${req.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E9F3E4] text-[#1E543B] font-bold"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WA
                </a>
                <button
                  type="button"
                  onClick={() => openModal(req)}
                  className="p-1.5 rounded-lg border border-[#EBDCCB] text-[#502E1E] hover:bg-[#FCF6EC] cursor-pointer"
                  title="Detail & Catatan"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={`Detail Request: ${selected?.title || ''}`}
        subtitle={`Pemohon: ${selected?.customerName || 'Pelanggan'} (${selected?.whatsappNumber || ''})`}
        size="md"
      >
        {selected && (
          <form onSubmit={handleSave} className="space-y-3.5 text-xs">
            {selected.notes && (
              <div className="p-3 rounded-xl bg-[#FCF6EC] border border-[#EBDCCB]">
                <div className="font-bold text-[#502E1E] mb-1">Catatan Pelanggan</div>
                <p className="text-[#6B3F2A]">{selected.notes}</p>
              </div>
            )}
            {selected.referenceImageUrl && (
              <div>
                <div className="font-bold text-[#502E1E] mb-1">Gambar Referensi</div>
                <img
                  src={selected.referenceImageUrl}
                  alt={selected.title}
                  className="w-32 h-32 object-cover rounded-xl border border-[#EBDCCB]"
                />
              </div>
            )}
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">Status Request</label>
              <select
                value={draftStatus}
                onChange={(e) => setDraftStatus(e.target.value as AdminBookRequest['status'])}
                className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">Catatan Penawaran / Estimasi PO</label>
              <textarea
                rows={3}
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                placeholder="Contoh: Estimasi harga Rp 245.000, PO 14 hari kerja..."
                className="w-full p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#EBDCCB]">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="h-[40px] px-4 rounded-xl border border-[#EBDCCB] font-bold text-[#6B3F2A] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="h-[40px] px-5 rounded-xl bg-[#D9744A] text-white font-bold cursor-pointer"
              >
                {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Update'}
              </button>
            </div>
          </form>
        )}
      </AdminModal>
    </div>
  );
}
