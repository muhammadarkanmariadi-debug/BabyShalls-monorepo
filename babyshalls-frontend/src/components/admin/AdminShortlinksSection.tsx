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
      await navigator.clipboard.writeText(`${origin}/babyshalls/${code}`);
      toast.success('Shortlink disalin ke clipboard!');
    } catch {
      toast.error('Gagal menyalin shortlink.');
    }
  };

  const handleToggleActive = async (item: AdminShortlink) => {
    try {
      await updateMutation.mutateAsync({ id: item.id, isActive: !item.isActive });
      toast.success(`Shortlink /babyshalls/${item.code} ${!item.isActive ? 'diaktifkan' : 'dinonaktifkan'}.`);
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal memperbarui status shortlink.'));
    }
  };

  const handleDelete = async (item: AdminShortlink) => {
    if (!window.confirm(`Hapus shortlink /babyshalls/${item.code}?`)) return;
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
        className="bg-white border border-[#E6D2C0] rounded-xl p-5 sm:p-6 space-y-4 shadow-xs"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#4A2A1C]">
              Generator Shortlink &amp; QR Universal
            </h2>
            <p className="text-xs text-[#7A5644]">
              Ubah link katalog, promo, WhatsApp, atau Google Form menjadi shortlink <code>/babyshalls/nama-singkatan</code> &amp; QR Code cetak.
            </p>
          </div>
          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setTitle('QR Meja Kasir BabyShalls Citraland');
                setTargetUrl(`${origin}/shop?source=store_qr`);
                setCustomCode('kasir');
              }}
              className="px-2.5 py-1 text-[11px] font-bold bg-[#FFF1C7] border border-[#F7C94B]/60 text-[#8A5A00] rounded-[4px] hover:bg-[#FFE7A3] cursor-pointer"
            >
              Preset Kasir
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle('Rak Preloved Kurasi Steril UV');
                setTargetUrl(`${origin}/preloved`);
                setCustomCode('preloved');
              }}
              className="px-2.5 py-1 text-[11px] font-bold bg-[#FDE3E8] border border-[#FBA6B2]/60 text-[#B83246] rounded-[4px] hover:bg-[#FCD2D9] cursor-pointer"
            >
              Preset Preloved
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle('Area Workshop Sensory Play');
                setTargetUrl(`${origin}/events`);
                setCustomCode('workshop');
              }}
              className="px-2.5 py-1 text-[11px] font-bold bg-[#F3E6F2] border border-[#BA7EB8]/60 text-[#7E4A84] rounded-[4px] hover:bg-[#EBD5EA] cursor-pointer"
            >
              Preset Workshop
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          <div className="md:col-span-5">
            <label className="block font-bold text-[#4A2A1C] mb-1">URL Tujuan *</label>
            <input
              type="text"
              required
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://... atau /shop?category=Board%20Books"
              className="w-full h-[38px] px-3 rounded-[4px] border border-[#E6D2C0] bg-[#FFFDF9] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block font-bold text-[#4A2A1C] mb-1">Custom Slug (Opsional)</label>
            <div className="flex items-center h-[38px] rounded-[4px] border border-[#E6D2C0] bg-[#FFFDF9] overflow-hidden">
              <span className="px-2.5 text-[11px] font-mono text-[#7A5644] bg-[#FFF8EF] border-r border-[#E6D2C0] h-full flex items-center">
                /babyshalls/
              </span>
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.replace(/[^A-Za-z0-9_-]/g, ''))}
                placeholder="promo-mei"
                className="w-full h-full px-2.5 bg-transparent focus:outline-none font-mono text-[#4A2A1C]"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block font-bold text-[#4A2A1C] mb-1">Label / Judul</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="QR Kasir Toko"
              className="w-full h-[38px] px-3 rounded-[4px] border border-[#E6D2C0] bg-[#FFFDF9] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
            />
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full h-[38px] px-4 rounded-[4px] bg-[#B05A26] hover:bg-[#8E431A] text-white font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>{createMutation.isPending ? 'Membuat...' : 'Buat Shortlink'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* List Card */}
      <div className="bg-white border border-[#E6D2C0] rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#4A2A1C]">
            Daftar Shortlink Aktif ({filtered.length}/{links.length})
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
          <p className="text-xs text-[#7A5644] py-6 text-center">Memuat daftar shortlink...</p>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-[#7A5644] py-6 text-center">Belum ada shortlink.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#E6D2C0]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF8EF] text-[#4A2A1C] font-semibold border-b border-[#E6D2C0]">
                <tr>
                  <th className="py-3 px-3.5">Shortlink</th>
                  <th className="py-3 px-3.5">Judul &amp; URL Tujuan</th>
                  <th className="py-3 px-3.5">Klik</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2E4D6]">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FFF8EF]/50 transition-colors">
                    <td className="py-3 px-3.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#DDF6F9] border border-[#8DDBE6]/60 text-[#1F6B76] font-mono font-bold">
                        <Link2 className="w-3.5 h-3.5" />
                        <span>/babyshalls/{item.code}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 max-w-xs">
                      {item.title && <div className="font-bold text-[#4A2A1C]">{item.title}</div>}
                      <div className="text-[11px] text-[#7A5644] truncate">{item.targetUrl}</div>
                    </td>
                    <td className="py-3 px-3.5 font-bold text-[#3F5FA0]">{item.clicks}</td>
                    <td className="py-3 px-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                          item.isActive
                            ? 'bg-[#DDF1E5] text-[#2A6E37] border border-[#82BC85]/60'
                            : 'bg-[#FDE3E8] text-[#C0392B] border border-[#FBA6B2]/60'
                        }`}
                      >
                        {item.isActive ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(item.code)}
                          className="p-1.5 rounded-[4px] border border-[#92B2F3]/60 text-[#3F5FA0] hover:bg-[#E4ECFB] transition-colors cursor-pointer"
                          title="Salin Shortlink"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setQrLink(item)}
                          className="p-1.5 rounded-[4px] border border-[#8DDBE6]/60 text-[#1F6B76] hover:bg-[#DDF6F9] transition-colors cursor-pointer"
                          title="Lihat QR Code"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`/babyshalls/${item.code}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-[4px] border border-[#E6D2C0] text-[#7A5644] hover:bg-[#FFF6EA] transition-colors"
                          title="Tes Buka Shortlink"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-[4px] border border-[#FBA6B2]/60 text-[#C0392B] hover:bg-[#FDE3E8] transition-colors cursor-pointer"
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
        subtitle={qrLink ? qrLink.title || `/babyshalls/${qrLink.code}` : ''}
        size="md"
      >
        {qrLink && (
          <div className="space-y-4 text-center text-xs">
            <div
              ref={qrWrapRef}
              className="inline-flex flex-col items-center p-5 rounded-2xl bg-[#FFF8EF] border border-[#E6D2C0]"
            >
              <QRCodeCanvas
                value={`${origin}/babyshalls/${qrLink.code}`}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#4A2A1C"
                level="H"
                includeMargin
              />
              <span className="mt-2 font-mono font-bold text-[#B05A26]">/babyshalls/{qrLink.code}</span>
            </div>
            <p className="text-[11px] text-[#7A5644] break-all">{qrLink.targetUrl}</p>
            <button
              type="button"
              onClick={handleDownloadQr}
              className="w-full h-[40px] rounded-[4px] bg-[#2A6E37] hover:bg-[#1E543B] text-white font-bold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" /> Unduh QR Code (PNG)
            </button>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
