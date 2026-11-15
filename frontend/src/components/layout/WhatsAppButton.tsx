'use client';

import React from 'react';
import { DEFAULT_CMS_VALUES, usePublicCms } from '../../hooks/useCms';

export const WhatsAppButton: React.FC = () => {
  const { data: cms } = usePublicCms();
  const baseWaUrl =
    cms?.social_whatsapp_url || cms?.announcement_wa_url || DEFAULT_CMS_VALUES.social_whatsapp_url;
  const message = encodeURIComponent(
    'Halo BabyShalls Malang! Saya ingin bertanya tentang kurasi buku dan mainan edukasi anak.'
  );
  const href = baseWaUrl.includes('?') ? baseWaUrl : `${baseWaUrl}?text=${message}`;

  return (
    <aside aria-label="Customer Support WhatsApp">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA59] flex items-center justify-center shadow-hover hover:scale-105 active:scale-95 transition-all"
        aria-label="Chat WhatsApp dengan Customer Service BabyShalls"
        title="Chat WhatsApp CS BabyShalls"
      >
        <img
          src="/images/logos/whatsapp.svg"
          alt="WhatsApp CS"
          className="w-8 h-8 object-contain"
        />
      </a>
    </aside>
  );
};
