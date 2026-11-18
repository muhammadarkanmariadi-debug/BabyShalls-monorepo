'use client';

import React, { useMemo, useState } from 'react';
import { Edit2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminBookRequest, useAdminBookRequests, useUpdateBookRequest } from '../../hooks/useAdminDashboard';
import { extractApiError } from '../../lib/axios';
import { DataTableToolbar } from './DataTableToolbar';
import { AdminDrawer } from './ui/AdminDrawer';
import { CsvExportButton } from './ui/CsvExportButton';

const STATUS_OPTIONS: { label: string; value: AdminBookRequest['status'] }[] = [
  { label: 'PENDING', value: 'PENDING' },
  { label: 'QUOTED', value: 'QUOTED' },
  { label: 'ORDERED', value: 'ORDERED' },
  { label: 'COMPLETED', value: 'COMPLETED' },
];

const STATUS_BADGE_REQUEST: Record<AdminBookRequest['status'], string> = {
  PENDING: 'bg-[#FFF1C7] text-[#8A5A00] border border-[#F7C94B]/60',
  QUOTED: 'bg-[#DDF6F9] text-[#1F6B76] border border-[#8DDBE6]/60',
  ORDERED: 'bg-[#E4ECFB] text-[#3F5FA0] border border-[#92B2F3]/60',
  COMPLETED: 'bg-[#DDF1E5] text-[#2A6E37] border border-[#82BC85]/60',
};

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
    <div className="bg-white border border-[#E6D2C0] rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
      <div>
        <h2 className="text-base font-bold text-[#4A2A1C]">
          Book Request Jastip ({filtered.length}/{requests.length})
        </h2>
        <p className="text-xs text-[#7A5644]">Kelola permintaan buku impor &amp; konfirmasi harga via WhatsApp ke bunda.</p>
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
        rightAction={
          <CsvExportButton
            endpoint="/admin/import-export/book-requests/export"
            filename="babyshalls-book-requests.csv"
          />
        }
      />

      {isLoading ? (
        <p className="text-xs text-[#7A5644] py-6 text-center">Memuat permintaan buku...</p>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-[#7A5644] py-6 text-center">Belum ada permintaan Book Request yang cocok.</p>
      ) : (
        <div className="divide-y divide-[#F2E4D6] text-xs">
          {filtered.map((req) => (
            <div key={req.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-[#FFF8EF]/40 px-2 rounded-lg transition-colors">
              <div>
                <div className="font-bold text-[#4A2A1C] text-sm">{req.title}</div>
                <div className="text-[#7A5644] mt-0.5">
                  Pemohon: <strong className="text-[#4A2A1C]">{req.customerName || 'Pelanggan'}</strong> ({req.whatsappNumber})
                  {req.authorPublisher ? ` • ${req.authorPublisher}` : ''}
                </div>
                {req.adminNotes && (
                  <div className="text-[11px] text-[#8E431A] mt-1 bg-[#FBE6D8] border border-[#EFA27A]/50 px-2.5 py-1 rounded-[4px] inline-block">
                    Catatan Staf: {req.adminNotes}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${STATUS_BADGE_REQUEST[req.status] || 'bg-[#F2E4D6] text-[#4A2A1C]'}`}>
                  {req.status}
                </span>
                <a
                  href={`https://wa.me/${req.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[4px] bg-[#DDF1E5] text-[#2A6E37] border border-[#82BC85]/60 font-semibold hover:bg-[#CEEAD6] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Chat WA
                </a>
                <button
                  type="button"
                  onClick={() => openModal(req)}
                  className="p-1.5 rounded-[4px] border border-[#92B2F3]/60 text-[#3F5FA0] hover:bg-[#E4ECFB] transition-colors cursor-pointer"
                  title="Detail & Catatan"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminDrawer
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={`Tinjau Request: ${selected?.title || ''}`}
        subtitle={`Pemohon: ${selected?.customerName || 'Pelanggan'} (${selected?.whatsappNumber || ''})`}
        width="md"
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
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E6D2C0]">
              <a
                href={`https://wa.me/${selected.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="h-[40px] px-4 rounded-[4px] bg-[#E9F3E4] text-[#1E543B] font-semibold inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" /> Balas via WhatsApp
              </a>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="h-[40px] px-4 rounded-[4px] border border-[#E6D2C0] font-semibold text-[#7A5644] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="h-[40px] px-5 rounded-[4px] bg-[#B05A26] hover:bg-[#8E431A] text-white font-semibold cursor-pointer"
                >
                  {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Update'}
                </button>
              </div>
            </div>
          </form>
        )}
      </AdminDrawer>
    </div>
  );
}
