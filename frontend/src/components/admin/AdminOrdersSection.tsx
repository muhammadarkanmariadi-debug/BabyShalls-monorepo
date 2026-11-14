'use client';

import React, { useMemo, useState } from 'react';
import { CheckCircle2, Clock, Eye, MapPin, PackageCheck, Search, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AdminOrder,
  useAdminOrders,
  useUpdateAdminOrderStatus,
} from '../../hooks/useAdminDashboard';
import {
  useLogisticsQuota,
  useSetOrderWaybill,
  useTrackWaybill,
} from '../../hooks/useShipping';
import { formatIDR } from '../../lib/utils';
import { extractApiError } from '../../lib/axios';
import { DataTableToolbar } from './DataTableToolbar';
import { AdminModal } from './AdminModal';

const ORDER_STATUS_OPTIONS: { label: string; value: AdminOrder['status'] }[] = [
  { label: 'Menunggu Pembayaran', value: 'PENDING_PAYMENT' },
  { label: 'Sudah Dibayar', value: 'PAID' },
  { label: 'Diproses', value: 'PROCESSING' },
  { label: 'Dikirim', value: 'SHIPPED' },
  { label: 'Selesai', value: 'COMPLETED' },
  { label: 'Dibatalkan', value: 'CANCELLED' },
];

const COURIER_OPTIONS = [
  { label: 'Wahana Express (wahana)', value: 'wahana' },
  { label: 'JNE (jne)', value: 'jne' },
  { label: 'J&T Express (jnt)', value: 'jnt' },
  { label: 'SiCepat (sicepat)', value: 'sicepat' },
  { label: 'POS Indonesia (pos)', value: 'pos' },
  { label: 'AnterAja (anteraja)', value: 'anteraja' },
];

const STATUS_BADGE: Record<AdminOrder['status'], string> = {
  PENDING_PAYMENT: 'bg-amber-100 text-amber-800',
  PAID: 'bg-emerald-100 text-emerald-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  COMPLETED: 'bg-[#E9F3E4] text-[#1E543B]',
  CANCELLED: 'bg-red-100 text-red-700',
};

export function AdminOrdersSection({ enabled }: { enabled: boolean }) {
  const { data: orders = [], isLoading } = useAdminOrders(enabled);
  const { data: quotaStats } = useLogisticsQuota(enabled);
  const setWaybillMutation = useSetOrderWaybill();
  const updateOrderMutation = useUpdateAdminOrderStatus();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [draftStatus, setDraftStatus] = useState<AdminOrder['status']>('PAID');
  const [draftWaybill, setDraftWaybill] = useState('');

  const [waybillModalOrder, setWaybillModalOrder] = useState<AdminOrder | null>(null);
  const [waybillCourier, setWaybillCourier] = useState('wahana');
  const [waybillService, setWaybillService] = useState('Normal');
  const [waybillInput, setWaybillInput] = useState('');

  const [trackingTarget, setTrackingTarget] = useState<{ courier: string; waybill: string } | null>(null);
  const { data: trackingData, isLoading: trackingLoading, error: trackingError } = useTrackWaybill(
    trackingTarget?.courier || null,
    trackingTarget?.waybill || null
  );

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = orders.filter((ord) => {
      if (statusFilter !== 'ALL' && ord.status !== statusFilter) return false;
      if (q) {
        const customer =
          ord.shippingAddress?.recipientName ||
          ord.shippingAddress?.receiverName ||
          ord.user?.name ||
          '';
        const match =
          ord.orderNumber.toLowerCase().includes(q) ||
          customer.toLowerCase().includes(q) ||
          (ord.waybillNumber || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'total_desc') return b.grandTotal - a.grandTotal;
      if (sortBy === 'total_asc') return a.grandTotal - b.grandTotal;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders, search, statusFilter, sortBy]);

  const openWaybillModal = (ord: AdminOrder) => {
    setWaybillModalOrder(ord);
    setWaybillCourier((ord.courierCode || 'wahana').toLowerCase());
    setWaybillService(ord.courierService || 'Reguler');
    setWaybillInput(ord.waybillNumber || '');
  };

  const handleSaveWaybill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waybillModalOrder) return;
    try {
      await setWaybillMutation.mutateAsync({
        orderId: waybillModalOrder.id,
        courierCode: waybillCourier,
        courierService: waybillService,
        waybillNumber: waybillInput.trim(),
      });
      toast.success(`Resi ${waybillInput.trim().toUpperCase()} disimpan & status menjadi SHIPPED.`);
      setWaybillModalOrder(null);
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal menyimpan nomor resi.'));
    }
  };

  const openDetailModal = (ord: AdminOrder) => {
    setSelectedOrder(ord);
    setDraftStatus(ord.status);
    setDraftWaybill(ord.waybillNumber || '');
  };

  const handleSaveOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      await updateOrderMutation.mutateAsync({
        id: selectedOrder.id,
        status: draftStatus,
        waybillNumber: draftWaybill.trim() || null,
      });
      toast.success(`Pesanan ${selectedOrder.orderNumber} diperbarui.`);
      setSelectedOrder(null);
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal memperbarui status pesanan.'));
    }
  };

  return (
    <div className="bg-white border border-[#EBDCCB] rounded-2xl p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-extrabold text-[#502E1E]">
            Pesanan Masuk ({filteredOrders.length}/{orders.length})
          </h2>
          <p className="text-xs text-[#6B3F2A]">
            Pantau pembayaran Midtrans, input resi mandiri (Wahana/JNE/J&amp;T), &amp; lacak resi BinderByte.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {quotaStats && (
            <span className="text-[11px] font-bold text-[#502E1E] px-3 py-1 rounded-full bg-[#FCF6EC] border border-[#EBDCCB]">
              Sisa Kuota Resi BinderByte: {quotaStats.binderByte.remaining.toLocaleString('id-ID')} /{' '}
              {quotaStats.binderByte.totalQuota.toLocaleString('id-ID')}
            </span>
          )}
          <span className="text-xs font-bold text-[#1E543B] inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F3E4]">
            <Truck className="w-3.5 h-3.5" /> Malang Hub Origin
          </span>
        </div>
      </div>

      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari Order ID, pelanggan, atau resi..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={ORDER_STATUS_OPTIONS}
        filterLabel="Semua Status"
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Terbaru', value: 'newest' },
          { label: 'Terlama', value: 'oldest' },
          { label: 'Total Terbesar', value: 'total_desc' },
          { label: 'Total Terkecil', value: 'total_asc' },
        ]}
      />

      {isLoading ? (
        <p className="text-xs text-[#6B7280]">Memuat pesanan...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-xs text-[#6B7280] py-6 text-center">Tidak ada pesanan yang cocok.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCF6EC] text-[#6B3F2A] font-bold border-b border-[#EBDCCB]">
              <tr>
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Pelanggan</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Kurir &amp; Resi</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3ECE2]">
              {filteredOrders.map((ord) => {
                const customerName =
                  ord.shippingAddress?.recipientName ||
                  ord.shippingAddress?.receiverName ||
                  ord.user?.name ||
                  '-';
                return (
                  <tr key={ord.id} className="hover:bg-[#FCF6EC]/40">
                    <td className="py-3 px-3 font-bold text-[#1A1A1A]">{ord.orderNumber}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#1A1A1A]">{customerName}</div>
                      <div className="text-[11px] text-[#6B7280]">{ord.shippingAddress?.city || '-'}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${STATUS_BADGE[ord.status]}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold uppercase text-[#502E1E]">
                        {ord.courierCode || '-'} {ord.courierService || ''}
                      </div>
                      {ord.waybillNumber && (
                        <div className="text-[11px] font-mono text-[#1E543B]">{ord.waybillNumber}</div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#1A1A1A]">{formatIDR(ord.grandTotal)}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {ord.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            onClick={() => openWaybillModal(ord)}
                            className="px-2.5 py-1 rounded-lg bg-[#FDF0B8] text-[#502E1E] font-bold hover:bg-[#FCE694] cursor-pointer"
                          >
                            {ord.waybillNumber ? 'Edit Resi' : 'Input Resi'}
                          </button>
                        )}
                        {ord.waybillNumber && (
                          <button
                            type="button"
                            onClick={() =>
                              setTrackingTarget({
                                courier: ord.courierCode || 'jne',
                                waybill: ord.waybillNumber || '',
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-[#E9F3E4] text-[#1E543B] font-bold hover:opacity-90 inline-flex items-center gap-1 cursor-pointer"
                            title="Lacak Resi"
                          >
                            <Search className="w-3 h-3" /> Lacak
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openDetailModal(ord)}
                          className="p-1.5 rounded-lg border border-[#EBDCCB] text-[#502E1E] hover:bg-[#FCF6EC] cursor-pointer"
                          title="Detail & Update Pesanan"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Input Resi Manual */}
      <AdminModal
        isOpen={Boolean(waybillModalOrder)}
        onClose={() => setWaybillModalOrder(null)}
        title={`Input Resi Pengiriman ${waybillModalOrder?.orderNumber || ''}`}
        subtitle="Simpan nomor resi dari gerai kurir (Wahana Express wajib min. 8 karakter alfanumerik)."
        size="md"
      >
        {waybillModalOrder && (
          <form onSubmit={handleSaveWaybill} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">Kurir Pengiriman *</label>
              <select
                value={waybillCourier}
                onChange={(e) => setWaybillCourier(e.target.value)}
                className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              >
                {COURIER_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">Layanan Kurir</label>
              <input
                type="text"
                value={waybillService}
                onChange={(e) => setWaybillService(e.target.value)}
                placeholder="Contoh: Normal / REG / EZ"
                className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">Nomor Resi *</label>
              <input
                type="text"
                required
                value={waybillInput}
                onChange={(e) => setWaybillInput(e.target.value.toUpperCase())}
                placeholder={waybillCourier === 'wahana' ? 'Contoh: 12345678 (min. 8 digit)' : 'Masukkan nomor resi'}
                className="w-full h-[40px] px-3.5 font-mono uppercase bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              />
              {waybillCourier === 'wahana' && (
                <p className="text-[11px] text-[#6B3F2A] mt-1">
                  Validasi Wahana Express: minimal 8 karakter huruf/angka tanpa spasi.
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#EBDCCB]">
              <button
                type="button"
                onClick={() => setWaybillModalOrder(null)}
                className="h-[40px] px-4 rounded-xl border border-[#EBDCCB] font-bold text-[#6B3F2A] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={setWaybillMutation.isPending}
                className="h-[40px] px-5 rounded-xl bg-[#D9744A] text-white font-bold cursor-pointer"
              >
                {setWaybillMutation.isPending ? 'Menyimpan...' : 'Simpan Resi & Tandai Dikirim'}
              </button>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Modal Lacak Resi Universal (BinderByte + Cache) */}
      <AdminModal
        isOpen={Boolean(trackingTarget)}
        onClose={() => setTrackingTarget(null)}
        title={`Lacak Resi ${trackingTarget?.waybill || ''}`}
        subtitle={`Kurir: ${(trackingTarget?.courier || '').toUpperCase()}`}
        size="md"
      >
        {trackingLoading ? (
          <p className="text-xs text-[#6B7280] py-6 text-center">Mengambil status pengiriman...</p>
        ) : trackingError ? (
          <p className="text-xs text-red-600 py-4">{extractApiError(trackingError, 'Gagal melacak resi.')}</p>
        ) : trackingData ? (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FCF6EC] border border-[#EBDCCB] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {trackingData.isDelivered ? (
                  <PackageCheck className="w-5 h-5 text-[#1E543B]" />
                ) : (
                  <Truck className="w-5 h-5 text-[#D9744A]" />
                )}
                <div>
                  <p className="font-extrabold text-[#502E1E]">Status: {trackingData.status}</p>
                  <p className="text-[11px] text-[#6B3F2A]">
                    {trackingData.summary?.currentLocation || 'Dalam perjalanan'}
                  </p>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  trackingData.isDelivered ? 'bg-[#E9F3E4] text-[#1E543B]' : 'bg-white text-[#6B3F2A] border border-[#EBDCCB]'
                }`}
              >
                {trackingData.isDelivered ? 'Terkirim (Cache Permanen)' : trackingData.fromCache ? 'Dari Cache (Cooldown)' : 'Live API'}
              </span>
            </div>

            {!trackingData.isDelivered && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  Cek ulang tersedia setelah: {new Date(trackingData.nextCheckAfter).toLocaleString('id-ID')}
                </span>
              </div>
            )}

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {trackingData.history.map((ev, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                  {idx === 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-[#1E543B] shrink-0 mt-0.5" />
                  ) : (
                    <MapPin className="w-4 h-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-[#1A1A1A]">{ev.description}</p>
                    <p className="text-[11px] text-[#6B7280]">
                      {ev.date} • {ev.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </AdminModal>

      {/* Modal Detail Order */}
      <AdminModal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={`Detail Pesanan ${selectedOrder?.orderNumber || ''}`}
        subtitle={selectedOrder ? new Date(selectedOrder.createdAt).toLocaleString('id-ID') : ''}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FCF6EC] border border-[#EBDCCB] rounded-2xl p-4">
              <div>
                <div className="font-bold text-[#502E1E] mb-1">Penerima &amp; Alamat</div>
                <div className="font-semibold">
                  {selectedOrder.shippingAddress?.recipientName ||
                    selectedOrder.shippingAddress?.receiverName ||
                    selectedOrder.user?.name}
                </div>
                <div className="text-[#6B3F2A]">
                  {selectedOrder.shippingAddress?.address ||
                    selectedOrder.shippingAddress?.streetAddress ||
                    '-'}
                </div>
                <div className="text-[#6B3F2A]">
                  {[
                    selectedOrder.shippingAddress?.subdistrict,
                    selectedOrder.shippingAddress?.city,
                    selectedOrder.shippingAddress?.postalCode,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </div>
              </div>
              <div>
                <div className="font-bold text-[#502E1E] mb-1">Ringkasan Pembayaran</div>
                <div>Subtotal: {formatIDR(selectedOrder.totalAmount)}</div>
                <div>Diskon: -{formatIDR(selectedOrder.discountAmount)}</div>
                <div>Ongkir: {formatIDR(selectedOrder.shippingCost)}</div>
                <div className="font-extrabold text-[#1E543B] mt-1">
                  Grand Total: {formatIDR(selectedOrder.grandTotal)}
                </div>
              </div>
            </div>

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="border border-[#EBDCCB] rounded-2xl overflow-hidden">
                <div className="px-4 py-2 bg-[#FCF6EC] font-bold text-[#502E1E]">Item Pesanan</div>
                <div className="divide-y divide-[#F3ECE2]">
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="px-4 py-2.5 flex justify-between">
                      <span>
                        {it.product?.name || 'Produk'} × {it.quantity}
                      </span>
                      <span className="font-bold">{formatIDR(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveOrderStatus} className="space-y-3 pt-2 border-t border-[#EBDCCB]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#502E1E] mb-1">Status Pesanan</label>
                  <select
                    value={draftStatus}
                    onChange={(e) => setDraftStatus(e.target.value as AdminOrder['status'])}
                    className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                  >
                    {ORDER_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#502E1E] mb-1">Nomor Resi</label>
                  <input
                    type="text"
                    value={draftWaybill}
                    onChange={(e) => setDraftWaybill(e.target.value)}
                    placeholder="Contoh: 12345678"
                    className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="h-[40px] px-4 rounded-xl border border-[#EBDCCB] font-bold text-[#6B3F2A] cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={updateOrderMutation.isPending}
                  className="h-[40px] px-5 rounded-xl bg-[#D9744A] text-white font-bold cursor-pointer"
                >
                  {updateOrderMutation.isPending ? 'Menyimpan...' : 'Simpan Status'}
                </button>
              </div>
            </form>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
