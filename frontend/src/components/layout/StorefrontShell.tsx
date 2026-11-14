'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SiteHeaderWrapper } from './SiteHeaderWrapper';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { WhatsAppButton } from './WhatsAppButton';

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <main className="min-h-screen bg-[#FAF8F4]">{children}</main>;
  }

  return (
    <>
      <SiteHeaderWrapper />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}

