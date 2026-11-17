'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/axios';

export default function WorkshopShortlinkRedirectPage() {
  const params = useParams<{ shortCode: string }>();
  const router = useRouter();

  useEffect(() => {
    const shortCode = (params?.shortCode || '').trim().toLowerCase();
    if (!shortCode) {
      router.replace('/events');
      return;
    }

    let cancelled = false;
    apiClient
      .get<{ success: boolean; data: Array<{ id: string; slug: string; shortCode?: string | null }> }>('/events')
      .then((res) => {
        if (cancelled) return;
        const events = res.data?.data || [];
        const matched = events.find(
          (ev) =>
            (ev.shortCode || '').toLowerCase() === shortCode ||
            ev.slug.toLowerCase() === shortCode
        );
        if (matched) {
          router.replace(`/events/${matched.id}/register`);
        } else {
          router.replace('/events');
        }
      })
      .catch(() => {
        if (!cancelled) router.replace('/events');
      });

    return () => {
      cancelled = true;
    };
  }, [params?.shortCode, router]);

  return (
    <div className="min-h-screen bg-[#FFF8EF] flex items-center justify-center p-6 text-sm font-bold text-[#6B3F2A]">
      Membuka halaman pendaftaran workshop...
    </div>
  );
}

