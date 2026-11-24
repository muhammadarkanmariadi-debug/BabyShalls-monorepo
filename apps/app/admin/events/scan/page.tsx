'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import { AlertCircle, ArrowLeft, Camera, CameraOff, CheckCircle2, Clock, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import { ADMIN_TOKEN_STORAGE_KEY, extractApiError } from '@/lib/axios';
import { EventCheckInResponse, useCheckInEventTicket } from '@/hooks/useAdminEvents';

type ScanState =
  | { status: 'ready' }
  | { status: 'success'; code: string; childName: string; eventTitle?: string; message: string }
  | { status: 'already'; code: string; childName: string; message: string }
  | { status: 'error'; code: string; message: string };

interface ScanHistoryItem {
  code: string;
  status: 'success' | 'already' | 'error';
  message: string;
  time: string;
}

export default function MobileQrScanPage() {
  const router = useRouter();
  const checkInMutation = useCheckInEventTicket();
  const [ready, setReady] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanState, setScanState] = useState<ScanState>({ status: 'ready' });
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScannedRef = useRef<{ code: string; at: number }>({ code: '', at: 0 });

  const stopCameraSafe = async () => {
    const instance = scannerRef.current;
    if (!instance) return;
    scannerRef.current = null;
    try {
      if (instance.isScanning) {
        await instance.stop();
      }
      instance.clear();
    } catch {
      // ignore cleanup error
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)) {
      router.replace('/admin/login');
      return;
    }
    setReady(true);
    return () => {
      void stopCameraSafe();
    };
  }, [router]);

  const pushHistory = (item: ScanHistoryItem) => {
    setHistory((prev) => [item, ...prev].slice(0, 10));
  };

  const processTicketCode = async (rawCode: string) => {
    const clean = rawCode.trim().toUpperCase();
    if (!clean) return;
    const now = Date.now();
    if (lastScannedRef.current.code === clean && now - lastScannedRef.current.at < 3000) return;
    lastScannedRef.current = { code: clean, at: now };

    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    try {
      const res: EventCheckInResponse = await checkInMutation.mutateAsync({ ticketCode: clean });
      if (res.alreadyCheckedIn) {
        const msg = res.message || 'Ticket has already been used for check-in.';
        setScanState({
          status: 'already',
          code: clean,
          childName: res.data?.childName || 'Participant',
          message: msg,
        });
        pushHistory({ code: clean, status: 'already', message: msg, time });
      } else {
        const msg = res.message || 'Check-in successful!';
        setScanState({
          status: 'success',
          code: clean,
          childName: res.data?.childName || 'Participant',
          eventTitle: res.data?.event?.title,
          message: msg,
        });
        pushHistory({ code: clean, status: 'success', message: `${res.data?.childName || 'Participant'} — ${msg}`, time });
      }
    } catch (err) {
      const msg = extractApiError(err, 'Invalid ticket code or ticket not found.');
      setScanState({ status: 'error', code: clean, message: msg });
      pushHistory({ code: clean, status: 'error', message: msg, time });
    }
  };

  const toggleCamera = async () => {
    if (cameraActive) {
      await stopCameraSafe();
      return;
    }

    try {
      await stopCameraSafe();
      const qr = new Html5Qrcode('bs-mobile-qr-reader');
      scannerRef.current = qr;
      setCameraActive(true);
      await qr.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (text: string) => void processTicketCode(text),
        () => {}
      );
    } catch {
      setCameraActive(false);
      scannerRef.current = null;
      toast.error('Camera unavailable or permission denied. Please use manual code entry.');
    }
  };

  if (!ready) return null;

  const borderClass =
    scanState.status === 'success'
      ? 'border-emerald-500'
      : scanState.status === 'already'
        ? 'border-amber-400'
        : scanState.status === 'error'
          ? 'border-red-500'
          : 'border-[#B05A26]';

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#4A2A1C] font-sans">
      <header className="h-[64px] bg-white border-b border-[#E6D2C0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A5644] hover:text-[#B05A26]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Link>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#B05A26]">
          Workshop Check-in Scanner
        </span>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Camera Scanner Card */}
        <div className="lg:col-span-6 bg-[#4A2A1C] text-white rounded-[8px] p-5 space-y-4 shadow-sm">
          <div className={`relative w-full aspect-square rounded-[6px] border-2 ${borderClass} bg-[#381F14] overflow-hidden`}>
            {/* Keep this div completely empty so Html5Qrcode owns its DOM children without conflicting with React */}
            <div id="bs-mobile-qr-reader" className="w-full h-full" />

            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-2 pointer-events-none">
                <QrCode className="w-12 h-12 text-[#FBE6D8]/70" />
                <p className="text-xs text-[#FBE6D8]/85">Point camera at participant&apos;s e-ticket QR</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleCamera}
            className="w-full h-10 rounded-[4px] bg-[#B05A26] hover:bg-[#8E431A] text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            {cameraActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            <span>{cameraActive ? 'Turn Off Camera' : 'Activate QR Camera'}</span>
          </button>
        </div>

        {/* Right: Result + Manual Input + Scan History */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-5 space-y-4">
            <h2 className="text-base font-semibold text-[#4A2A1C]">Participant Ticket Verification</h2>

            {scanState.status === 'ready' && (
              <div className="p-3 rounded-[4px] bg-[#FFF6EA] border border-[#E6D2C0] text-xs text-[#7A5644]">
                Ready to scan workshop tickets (format <code>BS-EVT-...</code>).
              </div>
            )}
            {scanState.status === 'success' && (
              <div className="p-3 rounded-[4px] bg-[#E9F3E4] text-[#1E543B] flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold">Check-in Successful ({scanState.code})</p>
                  <p>{scanState.childName} — {scanState.message}</p>
                </div>
              </div>
            )}
            {scanState.status === 'already' && (
              <div className="p-3 rounded-[4px] bg-amber-50 text-amber-800 flex items-start gap-2.5 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold">Ticket Already Used ({scanState.code})</p>
                  <p>{scanState.message}</p>
                </div>
              </div>
            )}
            {scanState.status === 'error' && (
              <div className="p-3 rounded-[4px] bg-red-50 text-red-700 flex items-start gap-2.5 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold">Invalid Ticket ({scanState.code})</p>
                  <p>{scanState.message}</p>
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void processTicketCode(manualCode);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="Manual entry: BS-EVT-..."
                className="flex-1 h-10 px-3 rounded-[4px] border border-[#E6D2C0] text-xs font-mono uppercase"
              />
              <button
                type="submit"
                disabled={checkInMutation.isPending}
                className="h-10 px-5 rounded-[4px] bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold cursor-pointer"
              >
                Verify
              </button>
            </form>
          </div>

          <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#4A2A1C]">
              <Clock className="w-4 h-4 text-[#B05A26]" />
              <span>Current Session Scan History ({history.length})</span>
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-[#7A5644]">No tickets scanned yet.</p>
            ) : (
              <div className="divide-y divide-[#F2E4D6] text-xs max-h-60 overflow-y-auto">
                {history.map((h, i) => (
                  <div key={`${h.code}-${i}`} className="py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-mono font-bold text-[#4A2A1C]">{h.code}</span>
                      <p className="text-[11px] text-[#7A5644] truncate">{h.message}</p>
                    </div>
                    <span className="text-[10px] text-[#7A5644] shrink-0">{h.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
