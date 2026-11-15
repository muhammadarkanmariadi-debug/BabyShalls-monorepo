'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BookRequestRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/request-a-book');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-sm text-[#555555]">
      Redirecting to Request a Book...
    </div>
  );
}
