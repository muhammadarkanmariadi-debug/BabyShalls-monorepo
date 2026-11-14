'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, CheckCircle2, AlertCircle, QrCode, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminModal } from './AdminModal';
import { EventCheckInResponse, useCheckInEventTicket } from '../../hooks/useAdminEvents';
import { extractApiError } from '../../lib/axios';

interface ScanHistoryEntry {
  code: string;
  status: 'success' | 'already' | 'error';
  message: string;
  childName?: string;
  eventTitle?: string;
  time: string;
}

interface EventQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EventQrScannerModal({ isOpen, onClose }: EventQrScannerModalProps) {
  const checkInMutation = useCheckInEventTicket();
  const [manualCode, setManualCode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [lastResult, setLastResult] = useState<ScanHistoryEntry | null>(null);
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScannedRef = useRef<{ code: string; at: number }>({ code: '', at: 0 });

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch {
        // ignore cleanup error
      }
      scannerRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (!isOpen) {
      void stopCamera();
    }
    return () => {
      void stopCamera();
    };
  }, [isOpen]);

  const processTicketCode = async (rawCode: string) => {
    const clean = rawCode.trim().toUpperCase();
    if (!clean) return;

    const now = Date.now();
    if (lastScannedRef.current.code === clean && now - lastScannedRef.current.at < 3000) {
      return;
    }
    lastScannedRef.current = { code: clean, at: now };

    try {
      const res: EventCheckInResponse = await checkInMutation.mutateAsync({ ticketCode: clean });
      const entry: ScanHistoryEntry = {
        code: clean,
        status: res.alreadyCheckedIn ? 'already' : 'success',
        message: res.message || 'Check-in berhasil.',
        childName: res.data?.childName,
        eventTitle: res.data?.event?.title,
        time: new Date().toLocaleTimeString('id-ID'),
      };
      setLastResult(entry);
      setHistory((prev) => [entry, ...prev].slice(0, 10));
      if (res.alreadyCheckedIn) {
        toast(entry.message, { icon: '⚠️' });
      } else {
        toast.success(entry.message);
      }
    } catch (err) {
      const msg = extractApiError(err, 'Kode tiket tidak valid.');
      const entry: ScanHistoryEntry = {
        code: clean,
        status: 'error',
        message: msg,
        time: new Date().toLocaleTimeString('id-ID'),
      };
      setLastResult(entry);
      setHistory((prev) => [entry, ...prev].slice(0, 10));
      toast.error(msg);
    }
  };

  const startCamera = async () => {
    try {
      await stopCamera();
      const html5QrCode = new Html5Qrcode('bs-qr-reader');
      scannerRef.current = html5QrCode;
      setCameraActive(true);
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          void processTicketCode(decodedText);
        },
        () => {
          // ignore frame decode miss
        }
      );
    } catch {
      setCameraActive(false);
      toast.error('Kamera tidak dapat diakses. Gunakan input manual atau izinkan akses kamera.');
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={() => {
        void stopCamera();
        onClose();
      }}
      title="Scan QR Check-In Pengunjung Workshop"
      subtitle="Arahkan kamera ke E-Ticket QR pengunjung atau ketik kode tiket (BS-EVT-...)."
      size="lg"
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Camera Viewport */}
          <div className="space-y-2.5">
            <div className="relative rounded-2xl overflow-hidden border border-[#EBDCCB] bg-[#1A1A1A] min-h-[240px] flex items-center justify-center">
              <div id="bs-qr-reader" className="w-full" />
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 p-4 text-center space-y-2">
                  <QrCode className="w-10 h-10 text-[#FDF0B8]" />
                  <p className="text-xs">Kamera belum aktif</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!cameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 h-[40px] rounded-xl bg-[#D9744A] hover:bg-[#c5633b] text-white font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" /> Aktifkan Kamera Scanner
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void stopCamera()}
                  className="flex-1 h-[40px] rounded-xl bg-[#1A1A1A] text-white font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CameraOff className="w-4 h-4" /> Matikan Kamera
                </button>
              )}
            </div>
          </div>

          {/* Manual Input + Latest Status */}
          <div className="space-y-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void processTicketCode(manualCode);
                setManualCode('');
              }}
              className="space-y-2"
            >
              <label className="block font-bold text-[#502E1E]">
                Input Manual / USB Barcode Scanner
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-[#6B3F2A]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    placeholder="BS-EVT-123456-789"
                    className="w-full h-[40px] pl-8 pr-3 font-mono uppercase bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  disabled={checkInMutation.isPending || !manualCode.trim()}
                  className="h-[40px] px-4 rounded-xl bg-[#1E543B] disabled:opacity-50 text-white font-bold cursor-pointer"
                >
                  Check-In
                </button>
              </div>
            </form>

            {lastResult && (
              <div
                className={`p-4 rounded-2xl border space-y-1 ${lastResult.status === 'success'
                    ? 'bg-[#E9F3E4] border-[#B8D8A8] text-[#1E543B]'
                    : lastResult.status === 'already'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
              >
                <div className="flex items-center gap-2 font-extrabold text-sm">
                  {lastResult.status === 'error' ? (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  )}
                  <span>{lastResult.code}</span>
                </div>
                <p className="font-semibold">{lastResult.message}</p>
                {lastResult.eventTitle && (
                  <p className="text-[11px] opacity-85">Workshop: {lastResult.eventTitle}</p>
                )}
              </div>
            )}

            {history.length > 0 && (
              <div className="border border-[#EBDCCB] rounded-2xl p-3 space-y-2 max-h-40 overflow-y-auto">
                <div className="font-bold text-[#502E1E]">Riwayat Scan Sesi Ini</div>
                {history.map((item, idx) => (
                  <div key={`${item.code}-${idx}`} className="flex items-center justify-between text-[11px] border-t border-[#F3ECE2] pt-1.5">
                    <div>
                      <span className="font-mono font-bold">{item.code}</span>
                      {item.childName && <span className="ml-1.5 text-[#6B3F2A]">• {item.childName}</span>}
                    </div>
                    <span className="text-[#6B7280]">{item.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminModal>
  );
}

