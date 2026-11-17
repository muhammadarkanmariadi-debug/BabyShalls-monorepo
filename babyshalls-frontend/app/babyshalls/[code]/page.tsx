'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/axios';

export default function BabyshallsShortlinkRedirectPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const code = params?.code;
    if (!code) return;

    let cancelled = false;
    apiClient
      .get<{ success: boolean; data: { targetUrl: string } }>(`/shortlinks/${encodeURIComponent(code)}`)
      .then((res) => {
        if (cancelled) return;
        const target = res.data?.data?.targetUrl;
        if (!target) {
          setErrorMsg('Shortlink tidak ditemukan.');
          return;
        }
        if (target.startsWith('/')) {
          router.replace(target);
        } else {
          window.location.replace(target);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMsg('Shortlink tidak ditemukan atau sudah tidak aktif.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [params?.code, router]);

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#FFF8EF] flex flex-col items-center justify-center p-6 text-center text-[#502E1E]">
        <h1 className="font-serif text-2xl font-bold mb-2">Tautan Tidak Tersedia</h1>
        <p className="text-sm text-[#6B3F2A] mb-5">{errorMsg}</p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-bold transition-colors"
        >
          Kembali ke Beranda BabyShalls
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EF] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-10 h-10 border-3 border-[#B05A26] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm font-bold text-[#4A2A1C]">Mengalihkan ke halaman tujuan BabyShalls...</p>
    </div>
  );
}
