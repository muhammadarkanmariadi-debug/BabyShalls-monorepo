'use client';

import React from 'react';
import { X, Truck, CheckCircle2, Clock, MapPin, PackageCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useOrderTracking } from '@/hooks/useAccount';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string | null;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
}) => {
  const { data, isLoading, isError, error } = useOrderTracking(orderNumber, isOpen);

  if (!isOpen || !orderNumber) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-[#E6D2C0] rounded-[2px] p-6 sm:p-7 max-w-lg w-full shadow-2xl relative text-left max-h-[85vh] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7A5644] hover:text-[#4A2A1C] p-1 cursor-pointer transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Truck className="w-5 h-5 text-[#B05A26]" />
          <h3 className="text-base font-semibold text-[#4A2A1C]">
            Courier Delivery Tracking
          </h3>
        </div>
        <p className="text-xs text-[#7A5644] mb-4">
          Order Number: <strong className="font-mono text-[#4A2A1C]">{orderNumber}</strong>
        </p>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-[#7A5644]">
            <Loader2 className="w-6 h-6 text-[#B05A26] animate-spin" />
            <span>Loading courier tracking details...</span>
          </div>
        ) : isError ? (
          <div className="p-4 bg-[#FDF0ED] border border-[#F5C2B8] text-[#C0392B] text-xs rounded-[2px] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{(error as any)?.response?.data?.error || 'Failed to load tracking status.'}</span>
          </div>
        ) : data ? (
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
            {/* Courier summary banner */}
            <div className="p-4 bg-[#FFF8EF] border border-[#F2E4D6] rounded-[2px] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[#7A5644] block text-[11px]">Courier &amp; Service</span>
                <span className="font-semibold text-[#4A2A1C] uppercase">
                  {data.courier} ({data.courierService})
                </span>
              </div>
              <div>
                <span className="text-[#7A5644] block text-[11px]">Waybill Tracking Number</span>
                <span className="font-mono font-semibold text-[#B05A26] text-sm">
                  {data.waybillNumber || 'Pending Courier Pickup'}
                </span>
              </div>
              <div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-[2px] inline-block ${
                    data.isDelivered
                      ? 'bg-[#DDF1E5] text-[#2A6E37]'
                      : data.waybillNumber
                      ? 'bg-[#E3EDF9] text-[#2C5282]'
                      : 'bg-[#FFF6EA] text-[#B05A26]'
                  }`}
                >
                  {data.isDelivered
                    ? 'Delivered'
                    : data.waybillNumber
                    ? 'In Transit'
                    : 'Awaiting Courier'}
                </span>
              </div>
            </div>

            {/* Timeline checkpoints */}
            <div className="pt-2">
              <h4 className="font-semibold text-xs text-[#4A2A1C] mb-3">
                Package Journey History
              </h4>

              {Array.isArray(data.history) && data.history.length > 0 ? (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E6D2C0]">
                  {data.history.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Checkpoint marker icon */}
                      <div
                        className={`absolute -left-6 top-0 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 bg-white ${
                          idx === 0
                            ? 'border-[#B05A26] text-[#B05A26]'
                            : 'border-[#A89080] text-[#7A5644]'
                        }`}
                      >
                        {idx === 0 ? (
                          <PackageCheck className="w-2.5 h-2.5" />
                        ) : (
                          <div className="w-1.5 h-1.5 bg-[#A89080] rounded-full" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                          <span className="font-semibold text-[#4A2A1C] uppercase tracking-wide">
                            {step.status}
                          </span>
                          <span className="text-[#7A5644]">
                            {new Date(step.timestamp).toLocaleString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-[#4A2A1C] mt-0.5 leading-relaxed">
                          {step.message}
                        </p>
                        {step.location && (
                          <div className="flex items-center gap-1 text-[11px] text-[#7A5644] mt-0.5">
                            <MapPin className="w-3 h-3 text-[#B05A26]" />
                            <span>{step.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-[#FFFBF7] border border-[#F2E4D6] rounded-[2px] text-center text-xs text-[#7A5644]">
                  No tracking checkpoints recorded yet.
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className="pt-4 mt-2 border-t border-[#F2E4D6] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#B05A26] hover:bg-[#964B1F] text-white text-xs font-semibold rounded-[2px] cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
