'use client';

import React, { useState, useRef } from 'react';
import { Camera, Cloud, HardDrive, Link2, UploadCloud, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient, extractApiError } from '@/src/lib/axios';
import { compressImageToWebP } from '@/src/lib/image-compress';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: (publicUrl: string) => void;
  folder?: string;
  maxFileSizeBytes?: number;
}

type TabId = 'local' | 'url' | 'gdrive' | 'dropbox';

declare global {
  interface Window {
    gapi?: {
      load: (api: string, callback: () => void) => void;
    };
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (resp: { access_token?: string; error?: string }) => void;
          }) => { requestAccessToken: (opts?: { prompt?: string }) => void };
        };
      };
      picker?: {
        PickerBuilder: new () => {
          addView: (view: unknown) => unknown;
          setOAuthToken: (token: string) => unknown;
          setDeveloperKey: (key: string) => unknown;
          setCallback: (cb: (data: { action: string; docs?: Array<{ id: string }> }) => void) => unknown;
          build: () => { setVisible: (visible: boolean) => void };
        };
        DocsView: new (viewId?: unknown) => {
          setMimeTypes: (mimeTypes: string) => unknown;
        };
        ViewId: { DOCS_IMAGES: unknown };
        Action: { PICKED: string };
      };
    };
    Dropbox?: {
      choose: (options: {
        success: (files: Array<{ link: string; name: string }>) => void;
        cancel?: () => void;
        linkType: 'direct' | 'preview';
        multiselect?: boolean;
        extensions?: string[];
      }) => void;
    };
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() || '';
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY?.trim() || '';
const DROPBOX_APP_KEY = process.env.NEXT_PUBLIC_DROPBOX_APP_KEY?.trim() || '';

function loadExternalScript(src: string, attrs?: Record<string, string>): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        script.setAttribute(k, v);
      }
    }
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Gagal memuat script ${src}`));
    document.head.appendChild(script);
  });
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onUploaded,
  folder = 'babyshalls',
  maxFileSizeBytes = 5_000_000,
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('local');
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const uploadLocalFile = async (file: File) => {
    if (file.size > maxFileSizeBytes) {
      toast.error(`Ukuran file maksimal ${Math.round(maxFileSizeBytes / 1_000_000)} MB.`);
      return;
    }
    setBusy(true);
    try {
      const compressed = await compressImageToWebP(file, { maxWidth: 900, quality: 0.82 });
      const formData = new FormData();
      formData.append('file', compressed);
      formData.append('folder', folder);

      const res = await apiClient.post<{ success: boolean; data?: { url: string } }>(
        '/admin/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (res.data?.success && res.data.data?.url) {
        onUploaded(res.data.data.url);
        toast.success('Foto berhasil dikompres WebP & disimpan di VPS!');
        onClose();
      } else {
        toast.error('Gagal mengunggah foto.');
      }
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal mengunggah foto ke server.'));
    } finally {
      setBusy(false);
    }
  };

  const importFromUrl = async (url: string, bearerToken?: string) => {
    if (!url.trim()) return;
    setBusy(true);
    try {
      const res = await apiClient.post<{ success: boolean; data?: { url: string } }>(
        '/admin/upload-from-url',
        { url: url.trim(), folder, bearerToken }
      );
      if (res.data?.success && res.data.data?.url) {
        onUploaded(res.data.data.url);
        toast.success('Foto berhasil diimpor & disimpan di VPS!');
        setExternalUrl('');
        onClose();
      } else {
        toast.error('Gagal mengimpor gambar.');
      }
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal mengimpor gambar dari URL.'));
    } finally {
      setBusy(false);
    }
  };

  const handleOpenGoogleDrivePicker = async () => {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_API_KEY) {
      toast.error('Set NEXT_PUBLIC_GOOGLE_API_KEY di .env.local untuk mengaktifkan Google Picker.');
      return;
    }
    setBusy(true);
    try {
      await Promise.all([
        loadExternalScript('https://apis.google.com/js/api.js'),
        loadExternalScript('https://accounts.google.com/gsi/client'),
      ]);

      await new Promise<void>((resolve) => {
        window.gapi?.load('picker', () => resolve());
      });

      const tokenClient = window.google?.accounts?.oauth2?.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.readonly',
        callback: (tokenResp) => {
          if (!tokenResp.access_token || !window.google?.picker) {
            setBusy(false);
            toast.error('Gagal mendapatkan izin akses Google Drive.');
            return;
          }
          const accessToken = tokenResp.access_token;
          const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS_IMAGES);
          view.setMimeTypes('image/png,image/jpeg,image/jpg,image/webp');

          const builder = new window.google.picker.PickerBuilder();
          builder.addView(view);
          builder.setOAuthToken(accessToken);
          builder.setDeveloperKey(GOOGLE_API_KEY);
          builder.setCallback((data) => {
            if (data.action === window.google?.picker?.Action.PICKED && data.docs?.[0]?.id) {
              const fileId = data.docs[0].id;
              void importFromUrl(
                `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
                accessToken
              );
            } else {
              setBusy(false);
            }
          });
          const picker = builder.build();
          picker.setVisible(true);
        },
      });

      tokenClient?.requestAccessToken({ prompt: '' });
    } catch (err) {
      setBusy(false);
      toast.error(err instanceof Error ? err.message : 'Gagal membuka Google Drive Picker.');
    }
  };

  const handleOpenDropboxChooser = async () => {
    if (!DROPBOX_APP_KEY) {
      toast.error('Set NEXT_PUBLIC_DROPBOX_APP_KEY di .env.local untuk mengaktifkan Dropbox Chooser.');
      return;
    }
    setBusy(true);
    try {
      await loadExternalScript('https://www.dropbox.com/static/api/2/dropins.js', {
        id: 'dropboxjs',
        'data-app-key': DROPBOX_APP_KEY,
      });

      if (!window.Dropbox?.choose) {
        setBusy(false);
        toast.error('Dropbox Chooser SDK belum siap.');
        return;
      }

      window.Dropbox.choose({
        linkType: 'direct',
        multiselect: false,
        extensions: ['.png', '.jpg', '.jpeg', '.webp'],
        success: (files) => {
          if (files[0]?.link) {
            void importFromUrl(files[0].link);
          } else {
            setBusy(false);
          }
        },
        cancel: () => setBusy(false),
      });
    } catch (err) {
      setBusy(false);
      toast.error(err instanceof Error ? err.message : 'Gagal membuka Dropbox Chooser.');
    }
  };

  const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
    { id: 'local', label: 'Perangkat & Kamera', icon: <UploadCloud className="w-3.5 h-3.5" /> },
    { id: 'url', label: 'Paste Link', icon: <Link2 className="w-3.5 h-3.5" /> },
    { id: 'gdrive', label: 'Google Drive', icon: <HardDrive className="w-3.5 h-3.5" /> },
    { id: 'dropbox', label: 'Dropbox', icon: <Cloud className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-[#EBDCCB] bg-[#FFF8EF] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#EBDCCB] bg-[#FCF6EC] px-5 py-3.5">
          <div>
            <h3 className="text-sm font-bold text-[#502E1E]">Upload & Import Media</h3>
            <p className="text-[11px] text-[#6B3F2A]">Semua foto otomatis disimpan di server VPS</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#6B3F2A] hover:bg-[#EBDCCB]/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex border-b border-[#EBDCCB] bg-[#FCF6EC]/60 px-3 pt-2 gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 rounded-t-xl px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#FFF8EF] text-[#D9744A] border border-b-0 border-[#EBDCCB]'
                  : 'text-[#6B3F2A] hover:text-[#502E1E]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'local' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && void uploadLocalFile(e.target.files[0])}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && void uploadLocalFile(e.target.files[0])}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) void uploadLocalFile(file);
                }}
                onClick={() => !busy && fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-[#D9744A] bg-[#D9744A]/10'
                    : 'border-[#EBDCCB] bg-white hover:border-[#D9744A]/60'
                }`}
              >
                <UploadCloud className="w-8 h-8 text-[#D9744A] mb-2" />
                <p className="text-xs font-bold text-[#502E1E]">
                  {busy ? 'Mengompres WebP & Mengunggah...' : 'Klik atau tarik file foto ke sini'}
                </p>
                <p className="text-[11px] text-[#6B3F2A] mt-1">
                  JPG, PNG, WebP, AVIF (otomatis dikompres ke WebP)
                </p>
              </div>

              <button
                type="button"
                disabled={busy}
                onClick={() => cameraInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#EBDCCB] bg-white py-2.5 text-xs font-bold text-[#502E1E] hover:bg-[#FCF6EC] disabled:opacity-50"
              >
                <Camera className="w-4 h-4 text-[#D9744A]" />
                <span>Ambil Foto dari Kamera</span>
              </button>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-3">
              <p className="text-xs text-[#6B3F2A]">
                Tempel link gambar publik, link share <strong>Google Drive</strong>, atau link{' '}
                <strong>Dropbox</strong> — server akan mengunduh &amp; menyimpannya ke VPS.
              </p>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/... atau https://www.dropbox.com/..."
                className="w-full rounded-xl border border-[#EBDCCB] bg-white px-3.5 py-2.5 text-xs text-[#502E1E] focus:outline-none focus:border-[#D9744A]"
              />
              <button
                type="button"
                disabled={busy || !externalUrl.trim()}
                onClick={() => void importFromUrl(externalUrl)}
                className="w-full rounded-xl bg-[#D9744A] py-2.5 text-xs font-bold text-white hover:bg-[#C3623A] disabled:opacity-50"
              >
                {busy ? 'Mengimpor ke VPS...' : 'Import & Simpan ke VPS'}
              </button>
            </div>
          )}

          {activeTab === 'gdrive' && (
            <div className="space-y-3 text-center py-2">
              <HardDrive className="w-9 h-9 text-[#D9744A] mx-auto" />
              <p className="text-xs text-[#6B3F2A]">
                Pilih foto langsung dari akun Google Drive Anda melalui Google Picker.
              </p>
              {!GOOGLE_API_KEY && (
                <p className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-800 text-left">
                  <strong>Catatan Setup:</strong> Tambahkan <code>NEXT_PUBLIC_GOOGLE_API_KEY</code> di{' '}
                  <code>.env.local</code> (dan aktifkan <em>Google Picker API</em> di Google Cloud
                  Console) untuk membuka jendela picker, atau gunakan tab <strong>Paste Link</strong>.
                </p>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={handleOpenGoogleDrivePicker}
                className="w-full rounded-xl bg-[#502E1E] py-2.5 text-xs font-bold text-white hover:bg-[#6B3F2A] disabled:opacity-50"
              >
                {busy ? 'Membuka Google Drive...' : 'Pilih dari Google Drive'}
              </button>
            </div>
          )}

          {activeTab === 'dropbox' && (
            <div className="space-y-3 text-center py-2">
              <Cloud className="w-9 h-9 text-[#D9744A] mx-auto" />
              <p className="text-xs text-[#6B3F2A]">
                Pilih foto langsung dari akun Dropbox Anda melalui Dropbox Chooser.
              </p>
              {!DROPBOX_APP_KEY && (
                <p className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-800 text-left">
                  <strong>Catatan Setup:</strong> Tambahkan <code>NEXT_PUBLIC_DROPBOX_APP_KEY</code> di{' '}
                  <code>.env.local</code> (dari Dropbox App Console) untuk membuka picker, atau gunakan
                  tab <strong>Paste Link</strong>.
                </p>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={handleOpenDropboxChooser}
                className="w-full rounded-xl bg-[#0061FF] py-2.5 text-xs font-bold text-white hover:bg-[#0052D6] disabled:opacity-50"
              >
                {busy ? 'Membuka Dropbox...' : 'Pilih dari Dropbox'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

