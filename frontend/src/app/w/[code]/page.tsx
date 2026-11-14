'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/axios';

function WorkshopShortlinkContent() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const code = params?.code;
    if (!code) return;

    apiClient
      .get<{ success: boolean; data: { slug: string } }>(`/events/short/${encodeURIComponent(code)}`)
      .then((res) => {
        if (res.data.data?.slug) {
          router.replace(`/events/register?event=${encodeURIComponent(res.data.data.slug)}`);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        setNotFound(true);
      });
  }, [params?.code, router]);

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <h1 className="text-xl font-extrabold text-[#502E1E]">Link Workshop Tidak Ditemukan</h1>
        <p className="text-xs text-[#6B3F2A]">
          Maaf, shortlink workshop tersebut sudah tidak aktif atau tidak valid.
        </p>
        <Link
          href="/events"
          className="px-5 py-2.5 rounded-full bg-[#D9744A] text-white text-xs font-bold"
        >
          Lihat Semua Workshop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 rounded-full border-4 border-[#D9744A]/30 border-t-[#D9744A] animate-spin mx-auto" />
        <p className="text-xs font-bold text-[#502E1E]">Mengarahkan ke pendaftaran workshop...</p>
      </div>
    </div>
  );
}

export default function WorkshopShortlinkRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-xs font-bold text-[#502E1E]">
          Mengarahkan ke pendaftaran workshop...
        </div>
      }
    >
      <WorkshopShortlinkContent />
    </Suspense>
  );
}
