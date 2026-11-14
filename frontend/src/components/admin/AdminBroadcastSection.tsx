'use client';

import React, { useMemo, useState } from 'react';
import { Mail, Send, Clock, Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient, extractApiError } from '../../lib/axios';
import { RichTextEditor } from './RichTextEditor';
import { DataTableToolbar } from './DataTableToolbar';
import { AdminModal } from './AdminModal';

interface BroadcastLogItem {
  id: string;
  type: string;
  subject: string;
  recipientCount: number;
  sentCount: number;
  status: string;
  createdAt: string;
}

export function AdminBroadcastSection({ enabled }: { enabled: boolean }) {
  const qc = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [bcType, setBcType] = useState<'PROMO' | 'EVENT' | 'CUSTOM'>('PROMO');
  const [bcSubject, setBcSubject] = useState('');
  const [bcHeadline, setBcHeadline] = useState('');
  const [bcMessageHtml, setBcMessageHtml] = useState('');
  const [bcCode, setBcCode] = useState('');

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const { data: logs = [], isLoading } = useQuery<BroadcastLogItem[]>({
    queryKey: ['admin-broadcasts'],
    enabled,
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: BroadcastLogItem[] }>('/admin/broadcasts');
      return res.data.data;
    },
  });

  const filteredLogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs.filter((l) => {
      if (typeFilter !== 'ALL' && l.type !== typeFilter) return false;
      if (q && !l.subject.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [logs, search, typeFilter]);

  const sendBroadcastMutation = useMutation({
    mutationFn: async () => {
      const strippedText = bcMessageHtml.replace(/<[^>]+>/g, '').trim();
      if (strippedText.length < 5) {
        throw new Error('Isi pesan broadcast minimal 5 karakter.');
      }
      const res = await apiClient.post('/admin/broadcast', {
        type: bcType,
        subject: bcSubject,
        badgeText:
          bcType === 'PROMO'
            ? 'PROMO TERBARU'
            : bcType === 'EVENT'
              ? 'EVENT & WORKSHOP'
              : 'KABAR BABYSHALLS',
        headline: bcHeadline,
        messageBody: bcMessageHtml,
        highlightCode: bcCode.trim() || null,
      });
      return res.data;
    },
    onSuccess: (res: { message?: string }) => {
      toast.success(res.message || 'Broadcast email berhasil dikirim.');
      setBcSubject('');
      setBcHeadline('');
      setBcMessageHtml('');
      setBcCode('');
      setModalOpen(false);
      qc.invalidateQueries({ queryKey: ['admin-broadcasts'] });
    },
    onError: (err) => {
      toast.error(extractApiError(err, 'Gagal mengirim broadcast email.'));
    },
  });

  return (
    <div className="bg-white border border-[#EBDCCB] rounded-2xl p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-extrabold text-[#502E1E]">
            Email Broadcast &amp; Riwayat ({filteredLogs.length})
          </h2>
          <p className="text-xs text-[#6B3F2A]">
            Kirim buletin promo/kabar toko ke pelanggan opt-in menggunakan Rich-Text Editor.
          </p>
        </div>
      </div>

      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari subjek email broadcast..."
        filterValue={typeFilter}
        onFilterChange={setTypeFilter}
        filterOptions={[
          { label: 'Promo', value: 'PROMO' },
          { label: 'Event', value: 'EVENT' },
          { label: 'Custom', value: 'CUSTOM' },
        ]}
        filterLabel="Semua Tipe"
        rightAction={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="h-[38px] px-4 rounded-xl bg-[#D9744A] hover:bg-[#c5633b] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tulis Broadcast Email
          </button>
        }
      />

      {isLoading ? (
        <p className="text-xs text-[#6B7280]">Memuat riwayat broadcast...</p>
      ) : filteredLogs.length === 0 ? (
        <p className="text-xs text-[#6B7280] py-6 text-center">Belum ada riwayat email broadcast.</p>
      ) : (
        <div className="divide-y divide-[#F3ECE2] text-xs">
          {filteredLogs.map((log) => (
            <div key={log.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#FCF6EC] border border-[#EBDCCB] text-[10px] font-bold text-[#502E1E]">
                    {log.type}
                  </span>
                  <span className="font-bold text-[#1A1A1A]">{log.subject}</span>
                </div>
                <div className="text-[11px] text-[#6B7280] flex items-center gap-1.5 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(log.createdAt).toLocaleString('id-ID')}</span>
                  <span>• {log.sentCount}/{log.recipientCount} terkirim</span>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  log.status === 'SENT'
                    ? 'bg-[#E9F3E4] text-[#1E543B]'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {log.status}
              </span>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tulis Broadcast Email Manual"
        subtitle="Gunakan Rich-Text Editor untuk memformat teks, daftar poin, dan tautan promo."
        size="xl"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendBroadcastMutation.mutate();
          }}
          className="space-y-3.5 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">Kategori Broadcast</label>
              <select
                value={bcType}
                onChange={(e) => setBcType(e.target.value as 'PROMO' | 'EVENT' | 'CUSTOM')}
                className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              >
                <option value="PROMO">Promo / Diskon</option>
                <option value="EVENT">Undangan Event / Workshop</option>
                <option value="CUSTOM">Pengumuman Umum</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">Kode Kupon Highlight (Opsional)</label>
              <input
                type="text"
                value={bcCode}
                onChange={(e) => setBcCode(e.target.value.toUpperCase())}
                placeholder="Contoh: BABYNEW"
                className="w-full h-[40px] px-3.5 uppercase font-mono bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#502E1E] mb-1">Subjek Email *</label>
            <input
              type="text"
              required
              value={bcSubject}
              onChange={(e) => setBcSubject(e.target.value)}
              placeholder="Contoh: Akhir Pekan Seru! Diskon 15% Board Book Pilihan"
              className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-[#502E1E] mb-1">Headline Utama di Email *</label>
            <input
              type="text"
              required
              value={bcHeadline}
              onChange={(e) => setBcHeadline(e.target.value)}
              placeholder="Contoh: Koleksi Board Book Baru Telah Tiba di Malang!"
              className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-[#502E1E] mb-1.5">Isi Pesan (Rich-Text Editor) *</label>
            <RichTextEditor value={bcMessageHtml} onChange={setBcMessageHtml} />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#EBDCCB]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="h-[40px] px-4 rounded-xl border border-[#EBDCCB] font-bold text-[#6B3F2A] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={sendBroadcastMutation.isPending}
              className="h-[40px] px-5 rounded-xl bg-[#D9744A] hover:bg-[#c5633b] disabled:opacity-60 text-white font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sendBroadcastMutation.isPending ? 'Mengirim...' : 'Kirim Broadcast'}</span>
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
