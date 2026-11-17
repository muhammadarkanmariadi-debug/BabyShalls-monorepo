'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_TOKEN_STORAGE_KEY } from '@/lib/axios';
import { EventEditorView } from '@/components/admin/EventEditorView';

export default function NewAdminEventPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)) {
      router.replace('/admin/login');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;
  return <EventEditorView />;
}

