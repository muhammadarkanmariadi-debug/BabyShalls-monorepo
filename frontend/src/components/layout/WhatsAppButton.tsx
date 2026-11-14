'use client';

import React from 'react';

export const WhatsAppButton: React.FC = () => {
  const phoneNumber = '6281234567890';
  const message = encodeURIComponent(
    'Halo BabyShalls Malang! Saya ingin bertanya tentang kurasi buku dan mainan edukasi anak.'
  );

  return (
    <aside aria-label="Customer Support WhatsApp">
      <a
        href={`https://wa.me/${phoneNumber}?text=${message}`}
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
