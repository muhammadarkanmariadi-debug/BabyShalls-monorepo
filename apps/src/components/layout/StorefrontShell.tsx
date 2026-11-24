'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/common/FloatingWhatsApp';

const SHELL_EXCLUDED_PREFIXES = ['/admin', '/login', '/checkout'];

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const isExcluded = SHELL_EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
