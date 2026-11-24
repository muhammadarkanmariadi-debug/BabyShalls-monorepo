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
import { AdminDrawer } from './ui/AdminDrawer';
import { CsvExportButton } from './ui/CsvExportButton';

const ORDER_STATUS_OPTIONS: { label: string; value: AdminOrder['status'] }[] = [
  { label: 'Awaiting Payment', value: 'PENDING_PAYMENT' },
  { label: 'Paid', value: 'PAID' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
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
  PENDING_PAYMENT: 'bg-[#FFF1C7] text-[#8A5A00] border border-[#F7C94B]',
  PAID: 'bg-[#DDF1E5] text-[#2A6E37] border border-[#82BC85]',
  PROCESSING: 'bg-[#E4ECFB] text-[#3F5FA0] border border-[#92B2F3]',
  SHIPPED: 'bg-[#DDF6F9] text-[#1F6B76] border border-[#8DDBE6]',
  COMPLETED: 'bg-[#E9F3E4] text-[#1E543B] border border-[#A7D7A9]',
  CANCELLED: 'bg-[#FDE3E8] text-[#C0392B] border border-[#FBA6B2]',
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
      toast.success(`Waybill ${waybillInput.trim().toUpperCase()} saved & order marked as SHIPPED.`);
      setWaybillModalOrder(null);
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to save waybill number.'));
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
      toast.success(`Order ${selectedOrder.orderNumber} updated.`);
      setSelectedOrder(null);
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to update order status.'));
    }
  };

  return (
    <div className="bg-white border border-[#E6D2C0] rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-[#4A2A1C]">
            Incoming Orders ({filteredOrders.length}/{orders.length})
          </h2>
          <p className="text-xs text-[#7A5644]">
            Monitor Midtrans payments, enter shipping waybills, &amp; track shipments from Malang.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {quotaStats && (
            <span className="text-[11px] font-bold text-[#8A5A00] px-3 py-1 rounded-full bg-[#FFF1C7] border border-[#F7C94B]/60">
              BinderByte Waybill Quota: {quotaStats.binderByte.remaining.toLocaleString('en-US')} /{' '}
              {quotaStats.binderByte.totalQuota.toLocaleString('en-US')}
            </span>
          )}
          <span className="text-xs font-bold text-[#2A6E37] inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF1E5] border border-[#82BC85]/60">
            <Truck className="w-3.5 h-3.5" /> Malang Hub Origin
          </span>
        </div>
      </div>

      {/* Quick Status Tabs (Figma Admin – Pesanan) with Pastel Tokens */}
      <div className="flex flex-wrap gap-1.5 border-b border-[#E6D2C0] pb-3">
        {[
          { label: 'All', value: 'ALL', activeCls: 'bg-[#FBE6D8] text-[#8E431A] font-semibold border-b-2 border-[#B05A26]' },
          { label: 'Awaiting Payment', value: 'PENDING_PAYMENT', activeCls: 'bg-[#FFF1C7] text-[#8A5A00] font-semibold border-b-2 border-[#F7C94B]' },
          { label: 'Paid', value: 'PAID', activeCls: 'bg-[#DDF1E5] text-[#2A6E37] font-semibold border-b-2 border-[#82BC85]' },
          { label: 'Processing', value: 'PROCESSING', activeCls: 'bg-[#E4ECFB] text-[#3F5FA0] font-semibold border-b-2 border-[#92B2F3]' },
          { label: 'Shipped', value: 'SHIPPED', activeCls: 'bg-[#DDF6F9] text-[#1F6B76] font-semibold border-b-2 border-[#8DDBE6]' },
          { label: 'Completed', value: 'COMPLETED', activeCls: 'bg-[#E9F3E4] text-[#1E543B] font-semibold border-b-2 border-[#A7D7A9]' },
          { label: 'Cancelled', value: 'CANCELLED', activeCls: 'bg-[#FDE3E8] text-[#C0392B] font-semibold border-b-2 border-[#FBA6B2]' },
        ].map((tab) => {
          const active = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-[4px] text-xs font-medium transition-all cursor-pointer ${
                active ? tab.activeCls : 'text-[#7A5644] hover:bg-[#FFF6EA] hover:text-[#4A2A1C]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search Order ID, customer, or waybill..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={ORDER_STATUS_OPTIONS}
        filterLabel="All Statuses"
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Newest', value: 'newest' },
          { label: 'Oldest', value: 'oldest' },
          { label: 'Highest Amount', value: 'total_desc' },
          { label: 'Lowest Amount', value: 'total_asc' },
        ]}
        rightAction={
          <CsvExportButton
            endpoint="/admin/import-export/orders/export"
            filename="babyshalls-orders.csv"
          />
        }
      />

      {isLoading ? (
        <p className="text-xs text-[#7A5644] py-6 text-center">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-xs text-[#7A5644] py-6 text-center">No orders match the filter.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#E6D2C0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF8EF] text-[#4A2A1C] font-semibold border-b border-[#E6D2C0]">
              <tr>
                <th className="py-3 px-3.5">Order ID</th>
                <th className="py-3 px-3.5">Customer</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5">Courier &amp; Waybill</th>
                <th className="py-3 px-3.5">Total</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2E4D6]">
              {filteredOrders.map((ord) => {
                const customerName =
                  ord.shippingAddress?.recipientName ||
                  ord.shippingAddress?.receiverName ||
                  ord.user?.name ||
                  '-';
                return (
                  <tr key={ord.id} className="hover:bg-[#FFF8EF]/50 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-[#4A2A1C]">{ord.orderNumber}</td>
                    <td className="py-3 px-3.5">
                      <div className="font-semibold text-[#4A2A1C]">{customerName}</div>
                      <div className="text-[11px] text-[#7A5644]">{ord.shippingAddress?.city || '-'}</div>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${STATUS_BADGE[ord.status]}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-semibold uppercase text-[#4A2A1C]">
                        {ord.courierCode || '-'} {ord.courierService || ''}
                      </div>
                      {ord.waybillNumber && (
                        <div className="text-[11px] font-mono text-[#2A6E37] font-bold">{ord.waybillNumber}</div>
                      )}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-[#4A2A1C]">{formatIDR(ord.grandTotal)}</td>
                    <td className="py-3 px-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {ord.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            onClick={() => openWaybillModal(ord)}
                            className="px-2.5 py-1 rounded-[4px] bg-[#FFF1C7] text-[#8A5A00] border border-[#F7C94B]/60 font-semibold hover:bg-[#FFE7A3] cursor-pointer transition-colors"
                          >
                            {ord.waybillNumber ? 'Edit Waybill' : 'Enter Waybill'}
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
                            className="px-2.5 py-1 rounded-[4px] bg-[#DDF1E5] text-[#2A6E37] border border-[#82BC85]/60 font-semibold hover:bg-[#CEEAD6] inline-flex items-center gap-1 cursor-pointer transition-colors"
                            title="Track Waybill"
                          >
                            <Search className="w-3 h-3" /> Track
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openDetailModal(ord)}
                          className="p-1.5 rounded-[4px] border border-[#92B2F3]/60 text-[#3F5FA0] hover:bg-[#E4ECFB] cursor-pointer transition-colors"
                          title="Order Details & Status"
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

      {/* Drawer Input Resi Manual */}
      <AdminDrawer
        isOpen={Boolean(waybillModalOrder)}
        onClose={() => setWaybillModalOrder(null)}
        title={`Enter Shipping Waybill ${waybillModalOrder?.orderNumber || ''}`}
        subtitle="Save the waybill tracking number from the courier (Wahana Express requires min. 8 alphanumeric characters)."
        width="md"
      >
        {waybillModalOrder && (
          <form onSubmit={handleSaveWaybill} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">Shipping Courier *</label>
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
              <label className="block font-bold text-[#502E1E] mb-1">Courier Service</label>
              <input
                type="text"
                value={waybillService}
                onChange={(e) => setWaybillService(e.target.value)}
                placeholder="Example: Normal / REG / EZ"
                className="w-full h-[40px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-[#502E1E] mb-1">Waybill Number *</label>
              <input
                type="text"
                required
                value={waybillInput}
                onChange={(e) => setWaybillInput(e.target.value.toUpperCase())}
                placeholder={waybillCourier === 'wahana' ? 'Example: 12345678 (min. 8 digits)' : 'Enter waybill number'}
                className="w-full h-[40px] px-3.5 font-mono uppercase bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              />
              {waybillCourier === 'wahana' && (
                <p className="text-[11px] text-[#6B3F2A] mt-1">
                  Wahana Express validation: minimum 8 alphanumeric characters without spaces.
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#EBDCCB]">
              <button
                type="button"
                onClick={() => setWaybillModalOrder(null)}
                className="h-[40px] px-4 rounded-xl border border-[#EBDCCB] font-bold text-[#6B3F2A] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={setWaybillMutation.isPending}
                className="h-[40px] px-5 rounded-xl bg-[#D9744A] text-white font-bold cursor-pointer"
              >
                {setWaybillMutation.isPending ? 'Saving...' : 'Save Waybill & Mark as Shipped'}
              </button>
            </div>
          </form>
        )}
      </AdminDrawer>

      {/* Drawer Lacak Resi Universal (BinderByte + Cache) */}
      <AdminDrawer
        isOpen={Boolean(trackingTarget)}
        onClose={() => setTrackingTarget(null)}
        title={`Track Waybill ${trackingTarget?.waybill || ''}`}
        subtitle={`Courier: ${(trackingTarget?.courier || '').toUpperCase()}`}
        width="md"
      >
        {trackingLoading ? (
          <p className="text-xs text-[#6B7280] py-6 text-center">Fetching shipping status...</p>
        ) : trackingError ? (
          <p className="text-xs text-red-600 py-4">{extractApiError(trackingError, 'Failed to track waybill.')}</p>
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
                    {trackingData.summary?.currentLocation || 'In transit'}
                  </p>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  trackingData.isDelivered ? 'bg-[#E9F3E4] text-[#1E543B]' : 'bg-white text-[#6B3F2A] border border-[#EBDCCB]'
                }`}
              >
                {trackingData.isDelivered ? 'Delivered (Permanent Cache)' : trackingData.fromCache ? 'Cached (Cooldown)' : 'Live API'}
              </span>
            </div>

            {!trackingData.isDelivered && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  Next check available after: {new Date(trackingData.nextCheckAfter).toLocaleString('en-US')}
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
      </AdminDrawer>

      {/* Drawer Detail & Input Resi Order (Figma 640px) */}
      <AdminDrawer
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details ${selectedOrder?.orderNumber || ''}`}
        subtitle={selectedOrder ? new Date(selectedOrder.createdAt).toLocaleString('en-US') : ''}
        width="lg"
      >
        {selectedOrder && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FCF6EC] border border-[#EBDCCB] rounded-2xl p-4">
              <div>
                <div className="font-bold text-[#502E1E] mb-1">Recipient &amp; Address</div>
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
                <div className="font-bold text-[#502E1E] mb-1">Payment Summary</div>
                <div>Subtotal: {formatIDR(selectedOrder.totalAmount)}</div>
                <div>Discount: -{formatIDR(selectedOrder.discountAmount)}</div>
                <div>Shipping: {formatIDR(selectedOrder.shippingCost)}</div>
                <div className="font-extrabold text-[#1E543B] mt-1">
                  Grand Total: {formatIDR(selectedOrder.grandTotal)}
                </div>
              </div>
            </div>

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="border border-[#EBDCCB] rounded-2xl overflow-hidden">
                <div className="px-4 py-2 bg-[#FCF6EC] font-bold text-[#502E1E]">Order Items</div>
                <div className="divide-y divide-[#F3ECE2]">
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="px-4 py-2.5 flex justify-between">
                      <span>
                        {it.product?.name || 'Product'} × {it.quantity}
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
                  <label className="block font-bold text-[#502E1E] mb-1">Order Status</label>
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
                  <label className="block font-bold text-[#502E1E] mb-1">Waybill Number</label>
                  <input
                    type="text"
                    value={draftWaybill}
                    onChange={(e) => setDraftWaybill(e.target.value)}
                    placeholder="Example: 12345678"
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
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updateOrderMutation.isPending}
                  className="h-[40px] px-5 rounded-xl bg-[#D9744A] text-white font-bold cursor-pointer"
                >
                  {updateOrderMutation.isPending ? 'Saving...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}
