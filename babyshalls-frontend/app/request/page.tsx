'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RequestRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/request-a-book');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FFF6EA] flex items-center justify-center text-sm text-[#7A5644]">
      Mengarahkan ke halaman Request Buku...
    </div>
  );
}

