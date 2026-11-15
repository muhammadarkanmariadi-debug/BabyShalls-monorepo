'use client';

import React from 'react';
import { X, Truck, MapPin, CheckCircle2, Clock, Copy, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { TrackingResult, useTrackWaybill } from '../../hooks/useShipping';

interface OrderTrackingModalProps {
  orderNumber: string;
  courier: string;
  waybillNumber: string;
  onClose: () => void;
}

const TRACKING_STATUS_META: Record<
  TrackingResult['status'],
  { label: string; bg: string; text: string }
> = {
  UNKNOWN: { label: 'Menunggu Update Kurir', bg: 'bg-[#F3F4F6]', text: 'text-[#4A4A4A]' },
  IN_TRANSIT: { label: 'Dalam Perjalanan', bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]' },
  OUT_FOR_DELIVERY: { label: 'Sedang Diantar Kurir', bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]' },
  DELIVERED: { label: 'Paket Terkirim', bg: 'bg-[#DCFCE7]', text: 'text-[#166534]' },
  RETURNED: { label: 'Dikembalikan ke Pengirim', bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]' },
};

export function OrderTrackingModal({
  orderNumber,
  courier,
  waybillNumber,
  onClose,
}: OrderTrackingModalProps) {
  const { data, isLoading, isError, refetch, isFetching } = useTrackWaybill(courier, waybillNumber);

  const handleCopyWaybill = () => {
    navigator.clipboard.writeText(waybillNumber);
    toast.success('Nomor resi disalin.');
  };

  const statusMeta = data ? TRACKING_STATUS_META[data.status] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-[#E5E7EB] shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between gap-3 bg-[#FFF8EF]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#1E543B] text-white flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-[#1A1A1A] truncate">
                Lacak Pengiriman • {orderNumber}
              </h3>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="uppercase font-bold text-[#1E543B]">
                  {data?.courierName || courier}
                </span>
                <span>•</span>
                <span className="font-mono font-bold text-[#1A1A1A] truncate">{waybillNumber}</span>
                <button
                  type="button"
                  onClick={handleCopyWaybill}
                  className="text-[#6B7280] hover:text-[#1A1A1A]"
                  title="Salin nomor resi"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-[#4A4A4A]"
            aria-label="Tutup modal lacak resi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {isLoading ? (
            <div className="py-10 text-center space-y-2 text-[#6B7280]">
              <RefreshCw className="w-6 h-6 mx-auto animate-spin text-[#1E543B]" />
              <p className="font-semibold">Mengambil status resi dari kurir...</p>
            </div>
          ) : isError || !data ? (
            <div className="py-8 text-center space-y-3">
              <AlertCircle className="w-8 h-8 mx-auto text-[#D9744A]" />
              <div className="space-y-1">
                <p className="font-bold text-[#1A1A1A]">Data pelacakan belum tersedia</p>
                <p className="text-[#6B7280]">
                  Nomor resi mungkin baru saja diinput dan belum dipindai oleh kurir.
                </p>
              </div>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-[#1E543B] text-white font-bold hover:bg-[#17422e] disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                Coba Lagi
              </button>
            </div>
          ) : (
            <>
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {statusMeta && (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold ${statusMeta.bg} ${statusMeta.text}`}
                    >
                      {data.isDelivered ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {statusMeta.label}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E543B] hover:underline disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
                    Perbarui
                  </button>
                </div>

                {data.summary?.currentLocation && (
                  <div className="flex items-start gap-1.5 text-[#1A1A1A]">
                    <MapPin className="w-3.5 h-3.5 text-[#D9744A] shrink-0 mt-0.5" />
                    <span>
                      Posisi saat ini: <strong>{data.summary.currentLocation}</strong>
                    </span>
                  </div>
                )}

                {data.summary?.receiver && (
                  <p className="text-[#4A4A4A]">
                    Penerima: <strong className="text-[#1A1A1A]">{data.summary.receiver}</strong>
                  </p>
                )}

                <p className="text-[11px] text-[#6B7280]">
                  Terakhir dicek: {new Date(data.lastCheckedAt).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-[#1A1A1A]">Riwayat Perjalanan Paket</h4>
                {data.history.length === 0 ? (
                  <p className="text-[#6B7280] py-4 text-center border border-dashed border-[#E5E7EB] rounded-xl">
                    Belum ada riwayat pergerakan dari kurir.
                  </p>
                ) : (
                  <div className="relative pl-4 space-y-4 before:content-[''] before:absolute before:left-[5px] before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-[#E5E7EB]">
                    {data.history.map((event, idx) => (
                      <div key={`${event.date}-${idx}`} className="relative">
                        <span
                          className={`absolute -left-4 top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${idx === 0 ? 'bg-[#1E543B]' : 'bg-[#9CA3AF]'
                            }`}
                        />
                        <div className="space-y-0.5">
                          <p
                            className={`font-bold ${idx === 0 ? 'text-[#1A1A1A]' : 'text-[#4A4A4A]'
                              }`}
                          >
                            {event.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#6B7280]">
                            <span>{event.date}</span>
                            {event.location && (
                              <>
                                <span>•</span>
                                <span>{event.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

