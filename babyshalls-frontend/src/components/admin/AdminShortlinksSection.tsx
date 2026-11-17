'use client';

import React, { useMemo, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, Download, ExternalLink, Link2, Plus, QrCode, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AdminShortlink,
  useAdminShortlinks,
  useCreateShortlink,
  useDeleteShortlink,
  useUpdateShortlink,
} from '../../hooks/useAdminShortlinks';
import { extractApiError } from '../../lib/axios';
import { DataTableToolbar } from './DataTableToolbar';
import { AdminModal } from './AdminModal';

export function AdminShortlinksSection({ enabled }: { enabled: boolean }) {
  const { data: links = [], isLoading } = useAdminShortlinks(enabled);
  const createMutation = useCreateShortlink();
  const updateMutation = useUpdateShortlink();
  const deleteMutation = useDeleteShortlink();

  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [qrLink, setQrLink] = useState<AdminShortlink | null>(null);
  const qrWrapRef = useRef<HTMLDivElement>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://babyshalls.com';

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return links.filter((item) => {
      if (statusFilter === 'ACTIVE' && !item.isActive) return false;
      if (statusFilter === 'INACTIVE' && item.isActive) return false;
      if (q) {
        const match =
          item.code.toLowerCase().includes(q) ||
          item.targetUrl.toLowerCase().includes(q) ||
          (item.title || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [links, search, statusFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = targetUrl.trim();
    if (!cleanUrl) {
      toast.error('URL tujuan wajib diisi.');
      return;
    }

    try {
      const created = await createMutation.mutateAsync({
        targetUrl: cleanUrl,
        code: customCode.trim() || undefined,
        title: title.trim() || undefined,
      });
      toast.success(`Shortlink /s/${created.code} berhasil dibuat!`);
      setTargetUrl('');
      setCustomCode('');
      setTitle('');
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal membuat shortlink.'));
    }
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(`${origin}/s/${code}`);
      toast.success('Shortlink disalin ke clipboard!');
    } catch {
      toast.error('Gagal menyalin shortlink.');
    }
  };

  const handleToggleActive = async (item: AdminShortlink) => {
    try {
      await updateMutation.mutateAsync({ id: item.id, isActive: !item.isActive });
      toast.success(`Shortlink /s/${item.code} ${!item.isActive ? 'diaktifkan' : 'dinonaktifkan'}.`);
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal memperbarui status shortlink.'));
    }
  };

  const handleDelete = async (item: AdminShortlink) => {
    if (!window.confirm(`Hapus shortlink /s/${item.code}?`)) return;
    try {
      await deleteMutation.mutateAsync(item.id);
      toast.success('Shortlink dihapus.');
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal menghapus shortlink.'));
    }
  };

  const handleDownloadQr = () => {
    if (!qrLink) return;
    const canvas = qrWrapRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `qr-shortlink-${qrLink.code}.png`;
    link.click();
    toast.success('QR Code diunduh (PNG).');
  };

  return (
    <div className="space-y-5">
      {/* Generator Card */}
      <form
        onSubmit={handleCreate}
        className="bg-white border border-[#EBDCCB] rounded-2xl p-6 space-y-4"
      >
        <div>
          <h2 className="text-base font-extrabold text-[#502E1E]">
            Generator Shortlink Universal
          </h2>
          <p className="text-xs text-[#6B3F2A]">
            Ubah link apa pun (halaman produk, promo, Google Form, WhatsApp, atau URL eksternal) menjadi shortlink <code>/s/kode</code> &amp; QR Code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          <div className="md:col-span-5">
            <label className="block font-bold text-[#502E1E] mb-1">URL Tujuan *</label>
            <input
              type="text"
              required
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://... atau /shop?category=Board%20Books"
              className="w-full h-[40px] px-3 rounded-xl border border-[#EBDCCB] bg-[#FCF6EC]/40 focus:outline-none focus:border-[#D9744A]"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block font-bold text-[#502E1E] mb-1">Custom Slug (Opsional)</label>
            <div className="flex items-center h-[40px] rounded-xl border border-[#EBDCCB] bg-[#FCF6EC]/40 overflow-hidden">
              <span className="px-2.5 text-[11px] font-mono text-[#6B3F2A] bg-[#F4E8D8] h-full flex items-center">
                /s/
              </span>
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.replace(/[^A-Za-z0-9_-]/g, ''))}
                placeholder="promo-mei"
                className="w-full h-full px-2.5 bg-transparent focus:outline-none font-mono"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block font-bold text-[#502E1E] mb-1">Label / Judul</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="QR Kasir Toko"
              className="w-full h-[40px] px-3 rounded-xl border border-[#EBDCCB] bg-[#FCF6EC]/40 focus:outline-none focus:border-[#D9744A]"
            />
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full h-[40px] px-4 rounded-xl bg-[#D9744A] hover:bg-[#c5633b] text-white font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
              <span>{createMutation.isPending ? 'Membuat...' : 'Buat Shortlink'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* List Card */}
      <div className="bg-white border border-[#EBDCCB] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#502E1E]">
            Daftar Shortlink ({filtered.length}/{links.length})
          </h3>
        </div>

        <DataTableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari kode, judul, atau URL tujuan..."
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={[
            { label: 'Aktif', value: 'ACTIVE' },
            { label: 'Nonaktif', value: 'INACTIVE' },
          ]}
          filterLabel="Semua Status"
        />

        {isLoading ? (
          <p className="text-xs text-[#6B7280]">Memuat daftar shortlink...</p>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-[#6B7280] py-6 text-center">Belum ada shortlink.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FCF6EC] text-[#6B3F2A] font-bold border-b border-[#EBDCCB]">
                <tr>
                  <th className="py-3 px-3">Shortlink</th>
                  <th className="py-3 px-3">Judul &amp; URL Tujuan</th>
                  <th className="py-3 px-3">Klik</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3ECE2]">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FCF6EC]/40">
                    <td className="py-3 px-3 font-mono font-bold text-[#D9744A]">
                      <div className="inline-flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5" />
                        <span>/s/{item.code}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      {item.title && <div className="font-bold text-[#502E1E]">{item.title}</div>}
                      <div className="text-[11px] text-[#6B7280] truncate">{item.targetUrl}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-[#502E1E]">{item.clicks}</td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer ${
                          item.isActive
                            ? 'bg-[#E9F3E4] text-[#1E543B]'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.isActive ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(item.code)}
                          className="p-1.5 rounded-lg border border-[#EBDCCB] hover:bg-[#FCF6EC] text-[#502E1E] cursor-pointer"
                          title="Salin Shortlink"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setQrLink(item)}
                          className="p-1.5 rounded-lg border border-[#EBDCCB] hover:bg-[#FCF6EC] text-[#502E1E] cursor-pointer"
                          title="Lihat QR Code"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`/s/${item.code}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-[#EBDCCB] hover:bg-[#FCF6EC] text-[#502E1E]"
                          title="Tes Buka Shortlink"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      <AdminModal
        isOpen={Boolean(qrLink)}
        onClose={() => setQrLink(null)}
        title="QR Code Shortlink"
        subtitle={qrLink ? qrLink.title || `/s/${qrLink.code}` : ''}
        size="md"
      >
        {qrLink && (
          <div className="space-y-4 text-center text-xs">
            <div
              ref={qrWrapRef}
              className="inline-flex flex-col items-center p-5 rounded-3xl bg-[#FCF6EC] border border-[#EBDCCB]"
            >
              <QRCodeCanvas
                value={`${origin}/s/${qrLink.code}`}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#502E1E"
                level="H"
                includeMargin
              />
              <span className="mt-2 font-mono font-bold text-[#502E1E]">/s/{qrLink.code}</span>
            </div>
            <p className="text-[11px] text-[#6B7280] break-all">{qrLink.targetUrl}</p>
            <button
              type="button"
              onClick={handleDownloadQr}
              className="w-full h-[40px] rounded-xl bg-[#1E543B] text-white font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Unduh QR Code (PNG)
            </button>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
