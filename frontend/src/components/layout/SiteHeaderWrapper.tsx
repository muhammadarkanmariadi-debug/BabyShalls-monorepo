'use client';

import React, { useState, Suspense } from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Navbar } from './Navbar';
import { MobileDrawer } from './MobileDrawer';
import { RequestBookModal } from '../request-book/RequestBookModal';

export const SiteHeaderWrapper: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isRequestBookOpen, setIsRequestBookOpen] = useState(false);

  return (
    <>
      <AnnouncementBar />
      <Header
        onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
        isMobileNavOpen={isMobileNavOpen}
      />
      <Suspense fallback={null}>
        <Navbar onOpenRequestBook={() => setIsRequestBookOpen(true)} />
      </Suspense>
      <MobileDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenRequestBook={() => setIsRequestBookOpen(true)}
      />
      <RequestBookModal
        isOpen={isRequestBookOpen}
        onClose={() => setIsRequestBookOpen(false)}
      />
    </>
  );
};

