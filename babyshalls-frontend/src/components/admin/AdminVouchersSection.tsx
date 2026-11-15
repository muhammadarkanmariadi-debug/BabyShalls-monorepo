'use client';

import React, { useMemo, useState } from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { CouponDto, DiscountType } from '../../hooks/useCoupons';
import {
  useAdminCoupons,
  useCreateCoupon,
  useDeleteCoupon,
  useUpdateCoupon,
} from '../../hooks/useAdminCoupons';
import { formatIDR } from '../../lib/utils';
import { extractApiError } from '../../lib/axios';
import { DataTableToolbar } from './DataTableToolbar';
import { AdminModal } from './AdminModal';
import { CurrencyInput } from '../ui/CurrencyInput';

function formatDiscountLabel(c: CouponDto): string {
  if (c.discountType === 'PERCENTAGE') {
    return `${c.discountValue}%${c.maxDiscount ? ` (Maks ${formatIDR(c.maxDiscount)})` : ''}`;
  }
  if (c.discountType === 'SHIPPING_SUBSIDY') {
    return `Subsidi Ongkir ${formatIDR(c.discountValue)}`;
  }
  return formatIDR(c.discountValue);
}

export function AdminVouchersSection({ enabled }: { enabled: boolean }) {
  const { data: vouchers = [], isLoading } = useAdminCoupons(enabled);
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CouponDto | null>(null);

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('FIXED_AMOUNT');
  const [discountValue, setDiscountValue] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [minOrder, setMinOrder] = useState('0');
  const [maxUsage, setMaxUsage] = useState('');
  const [broadcastEmail, setBroadcastEmail] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = vouchers.filter((v) => {
      if (statusFilter === 'ACTIVE' && !v.isActive) return false;
      if (statusFilter === 'INACTIVE' && v.isActive) return false;
      if (q && !v.code.toLowerCase().includes(q) && !(v.description || '').toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
    return [...list].sort((a, b) => {
      if (sortBy === 'code_asc') return a.code.localeCompare(b.code);
      if (sortBy === 'used_desc') return (b.usedCount ?? 0) - (a.usedCount ?? 0);
      return 0;
    });
  }, [vouchers, search, statusFilter, sortBy]);

  const openModal = (coupon: CouponDto | null) => {
    setEditing(coupon);
    if (coupon) {
      setCode(coupon.code);
      setDescription(coupon.description || '');
      setDiscountType(coupon.discountType);
      setDiscountValue(String(coupon.discountValue));
      setMaxDiscount(coupon.maxDiscount ? String(coupon.maxDiscount) : '');
      setMinOrder(String(coupon.minOrder ?? 0));
      setMaxUsage(coupon.maxUsage ? String(coupon.maxUsage) : '');
      setBroadcastEmail(false);
    } else {
      setCode('');
      setDescription('');
      setDiscountType('FIXED_AMOUNT');
      setDiscountValue('');
      setMaxDiscount('');
      setMinOrder('0');
      setMaxUsage('');
      setBroadcastEmail(false);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    const val = Number(discountValue);
    if (!cleanCode || !Number.isFinite(val) || val <= 0) {
      toast.error('Kode kupon dan nilai diskon valid wajib diisi.');
      return;
    }

    const payload = {
      code: cleanCode,
      description: description.trim() || null,
      discountType,
      discountValue: val,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      minOrder: minOrder ? Number(minOrder) : 0,
      maxUsage: maxUsage ? Number(maxUsage) : null,
      isActive: editing ? editing.isActive : true,
      broadcastEmail: editing ? false : broadcastEmail,
    };

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, data: payload });
        toast.success(`Kupon ${cleanCode} diperbarui.`);
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(`Kupon ${cleanCode} dibuat.`);
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal menyimpan kupon.'));
    }
  };

  return (
    <div className="bg-white border border-[#EBDCCB] rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="text-base font-extrabold text-[#502E1E]">
          Manajemen Kupon &amp; Voucher ({filtered.length}/{vouchers.length})
        </h2>
        <p className="text-xs text-[#6B3F2A]">Kelola promo diskon nominal, persentase, &amp; subsidi ongkir.</p>
      </div>

      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari kode atau deskripsi kupon..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { label: 'Aktif', value: 'ACTIVE' },
          { label: 'Nonaktif', value: 'INACTIVE' },
        ]}
        filterLabel="Semua Status"
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Terbaru', value: 'newest' },
          { label: 'Kode (A-Z)', value: 'code_asc' },
          { label: 'Terbanyak Dipakai', value: 'used_desc' },
        ]}
        rightAction={
          <button
            type="button"
            onClick={() => openModal(null)}
            className="h-[38px] px-4 rounded-xl bg-[#D9744A] hover:bg-[#c5633b] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Kupon
          </button>
        }
      />

      {isLoading ? (
        <p className="text-xs text-[#6B7280]">Memuat kupon...</p>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-[#6B7280] py-6 text-center">Belum ada kupon yang cocok.</p>
      ) : (
        <div className="divide-y divide-[#F3ECE2] text-xs">
          {filtered.map((v) => (
            <div key={v.id} className="py-3 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-[#502E1E] text-sm">{v.code}</span>
                  <span className="text-[#6B3F2A]">• {formatDiscountLabel(v)}</span>
                </div>
                <div className="text-[11px] text-[#6B7280] mt-0.5">
                  {v.description || 'Tanpa deskripsi'} • Min Order: {formatIDR(v.minOrder)} • Terpakai: {v.usedCount}
                  {v.maxUsage ? `/${v.maxUsage}` : ''}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateMutation.mutate(
                      { id: v.id, data: { isActive: !v.isActive } },
                      {
                        onSuccess: () =>
                          toast.success(`Kupon ${v.code} ${!v.isActive ? 'diaktifkan' : 'dinonaktifkan'}.`),
                        onError: (err) => toast.error(extractApiError(err, 'Gagal mengubah status kupon.')),
                      }
                    )
                  }
                  className={`px-3 py-1 rounded-full font-bold cursor-pointer ${v.isActive ? 'bg-[#E9F3E4] text-[#1E543B]' : 'bg-[#F3F4F6] text-[#6B7280]'
                    }`}
                >
                  {v.isActive ? 'Aktif' : 'Nonaktif'}
                </button>
                <button
                  type="button"
                  onClick={() => openModal(v)}
                  className="p-1.5 rounded-lg border border-[#EBDCCB] text-[#502E1E] hover:bg-[#FCF6EC] cursor-pointer"
                  title="Edit Kupon"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!window.confirm(`Hapus kupon ${v.code}?`)) return;
                    deleteMutation.mutate(v.id, {
                      onSuccess: () => toast.success(`Kupon ${v.code} dihapus.`),
                      onError: (err) => toast.error(extractApiError(err, 'Gagal menghapus kupon.')),
                    });
                  }}
                  className="p-1.5 rounded-lg border border-[#EBDCCB] text-[#6B7280] hover:text-red-600 cursor-pointer"
                  title="Hapus Kupon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit Kupon ${editing.code}` : 'Buat Kupon Promo Baru'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">Kode Kupon *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="HEMAT25"
                className="w-full h-[40px] px-3.5 uppercase font-mono bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">Tipe Diskon *</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              >
                <option value="FIXED_AMOUNT">Nominal (Rp)</option>
                <option value="PERCENTAGE">Persentase (%)</option>
                <option value="SHIPPING_SUBSIDY">Subsidi Ongkir (Rp)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">
                {discountType === 'PERCENTAGE' ? 'Persentase Diskon (%) *' : 'Nilai Diskon (Rp) *'}
              </label>
              {discountType === 'PERCENTAGE' ? (
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="15"
                  className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                />
              ) : (
                <CurrencyInput
                  required
                  value={discountValue}
                  onChange={setDiscountValue}
                  placeholder="25.000"
                />
              )}
            </div>
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">Maksimal Diskon (Rp)</label>
              <CurrencyInput
                value={maxDiscount}
                onChange={setMaxDiscount}
                placeholder="Opsional (untuk %)"
              />
            </div>
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">Minimal Belanja (Rp)</label>
              <CurrencyInput
                value={minOrder}
                onChange={setMinOrder}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">Kuota Pemakaian</label>
              <input
                type="number"
                min={1}
                value={maxUsage}
                onChange={(e) => setMaxUsage(e.target.value)}
                placeholder="Kosongkan = tak terbatas"
                className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#502E1E] mb-1">Deskripsi Promo</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Potongan spesial akhir pekan untuk semua buku cerita"
              className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
            />
          </div>

          {!editing && (
            <label className="flex items-center gap-2 text-[#502E1E] font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={broadcastEmail}
                onChange={(e) => setBroadcastEmail(e.target.checked)}
                className="rounded accent-[#D9744A]"
              />
              Auto-broadcast email promo kupon ke pelanggan opt-in
            </label>
          )}

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
              disabled={createMutation.isPending || updateMutation.isPending}
              className="h-[40px] px-5 rounded-xl bg-[#D9744A] text-white font-bold cursor-pointer"
            >
              {editing ? 'Simpan Perubahan' : 'Buat Kupon'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

