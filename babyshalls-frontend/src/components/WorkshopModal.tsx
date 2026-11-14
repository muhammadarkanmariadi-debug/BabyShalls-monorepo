'use client';

import React from 'react';
import { X, Calendar, MapPin, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { mockWorkshops, formatIDR } from '../data/mockProducts';

export const WorkshopModal: React.FC = () => {
  const { isWorkshopModalOpen, setIsWorkshopModalOpen } = useCart();
  const workshop = mockWorkshops[0];

  if (!isWorkshopModalOpen || !workshop) return null;

  const handleBook = () => {
    const text = `Hello BabyShalls! I would like to register for the workshop:\n\n*${workshop.title}*\nDate: ${workshop.date} (${workshop.time})\nLocation: ${workshop.location}\nPrice: ${formatIDR(workshop.price)} / child\n\nParent Name:\nChild Name & Age:\nWhatsApp:\n\nPlease confirm availability. Thank you!`;
    const url = `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={() => setIsWorkshopModalOpen(false)}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden bg-white text-left transition-all sm:my-8 sm:w-full sm:max-w-lg border border-[#E5E5E5] p-6 md:p-8 space-y-6">
          {/* Close Button */}
          <button
            onClick={() => setIsWorkshopModalOpen(false)}
            className="absolute right-4 top-4 text-[#666666] hover:text-[#111111] transition-colors p-1"
            aria-label="Close modal"
          >
            <X size={18} strokeWidth={1.5} />
          </button>

          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#666666] block mb-1">
              Store Event • Citraland Puncak Tidar
            </span>
            <h3 className="text-xl font-bold tracking-tight text-[#111111]">
              {workshop.title}
            </h3>
            <p className="text-xs text-[#666666] mt-1">
              {workshop.subtitle}
            </p>
          </div>

          <div className="aspect-[16/9] w-full bg-neutral-100 overflow-hidden">
            <img
              src={workshop.image}
              alt={workshop.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 text-xs text-[#111111]">
            <div className="flex items-center gap-2">
              <Calendar size={14} strokeWidth={1.5} className="text-[#666666]" />
              <span>{workshop.date} • {workshop.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} strokeWidth={1.5} className="text-[#666666]" />
              <span>{workshop.location}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
            <span className="text-sm font-medium text-[#111111]">
              {formatIDR(workshop.price)} / child
            </span>

            <button
              type="button"
              onClick={handleBook}
              className="px-5 py-2.5 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-medium uppercase tracking-wider flex items-center gap-2 transition-colors rounded-none"
            >
              <MessageCircle size={14} strokeWidth={1.5} />
              <span>Register via WhatsApp</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
