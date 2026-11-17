'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/axios';

export default function ShortlinkRedirectPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const code = params?.code;
    if (!code) return;
    router.replace(`/babyshalls/${encodeURIComponent(code)}`);
  }, [params?.code, router]);

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#FFF8EF] flex flex-col items-center justify-center p-6 text-center text-[#502E1E]">
        <h1 className="font-serif text-2xl font-bold mb-2">Tautan Tidak Tersedia</h1>
        <p className="text-sm text-[#6B3F2A] mb-5">{errorMsg}</p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full bg-[#D9744A] text-white text-xs font-bold hover:bg-[#c5633b]"
        >
          Kembali ke Beranda BabyShalls
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EF] flex items-center justify-center p-6 text-sm font-bold text-[#6B3F2A]">
      Mengalihkan ke halaman tujuan...
    </div>
  );
}

