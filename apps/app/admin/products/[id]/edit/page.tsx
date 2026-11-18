'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ADMIN_TOKEN_STORAGE_KEY } from '@/lib/axios';
import { useAdminProduct } from '@/hooks/useAdminDashboard';
import { ProductEditorView } from '@/components/admin/ProductEditorView';

export default function EditAdminProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)) {
      router.replace('/admin/login');
      return;
    }
    setReady(true);
  }, [router]);

  const { data: product, isLoading } = useAdminProduct(ready ? params?.id || null : null);

  if (!ready || isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center text-sm font-medium text-[#7A5644]">
        Memuat data produk...
      </div>
    );
  }

  return <ProductEditorView editingProduct={product || null} />;
}

