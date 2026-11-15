'use client';

import React, { useState, Suspense } from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Navbar } from './Navbar';
import { MobileDrawer } from './MobileDrawer';

export const SiteHeaderWrapper: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <>
      <AnnouncementBar />
      <Header
        onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
        isMobileNavOpen={isMobileNavOpen}
      />
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <MobileDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
};

