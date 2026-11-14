'use client';

import React from 'react';
import { X, MapPin, Clock, MessageCircle, Navigation, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';

const InstagramIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const StoreInfoModal: React.FC = () => {
  const { isStoreInfoOpen, setIsStoreInfoOpen } = useCart();

  if (!isStoreInfoOpen) return null;

  const googleMapsUrl = 'https://maps.google.com/?q=Citraland+Puncak+Tidar+Malang';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#382E2B]/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsStoreInfoOpen(false)}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-3xl bg-[#FAF6F0] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-[#EDE4D8]">
          {/* Close Button */}
          <button
            onClick={() => setIsStoreInfoOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full p-2 text-[#382E2B]/60 hover:bg-[#F2E8DC] hover:text-[#382E2B] transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Image / Store Atmosphere */}
          <div className="relative h-44 bg-[#F5EDE1] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
              alt="Suasana Toko Buku Babyshalls Malang"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#382E2B]/90 via-[#382E2B]/30 to-transparent flex items-end p-6">
              <div>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#FFFDF9] bg-[#7CA992] px-2.5 py-0.5 rounded-full">
                  Boutique Children&apos;s Sanctuary
                </span>
                <h3 className="text-2xl font-bold text-[#FFFDF9] mt-1">
                  Babyshalls Malang
                </h3>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            <p className="text-xs text-[#6B5E57] leading-relaxed">
              Berada di kawasan sejuk dan tenang Citraland Puncak Tidar, Babyshalls hadir sebagai ruang singgah ramah anak yang dirancang untuk kenyamanan keluarga kecil Anda.
            </p>

            <div className="space-y-3">
              {/* Address */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#EBE3D7]">
                <MapPin className="w-5 h-5 text-[#D96B43] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-[#382E2B]">Alamat Toko Fisik:</div>
                  <div className="text-[#6B5E57] mt-0.5">
                    Citraland Puncak Tidar HH-26, Kalisongo, Kec. Dau, Kota Malang, Jawa Timur 65151
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#EBE3D7]">
                <Clock className="w-5 h-5 text-[#7CA992] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-[#382E2B]">Jam Operasional:</div>
                  <div className="text-[#6B5E57] mt-0.5">
                    Buka Setiap Hari (Senin – Minggu): <strong>10.00 – 17.00 WIB</strong>
                  </div>
                  <div className="text-[11px] text-[#7CA992] font-semibold mt-0.5">
                    Sudut baca &amp; sofa santai bebas digunakan saat berkunjung 🧸
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="https://instagram.com/babyshalls"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-[#E5DDD0] hover:bg-[#FAF8F5] transition-colors text-[#382E2B]"
                >
                  <InstagramIcon className="w-4 h-4 text-[#D96B43]" />
                  <div>
                    <div className="font-semibold">Instagram</div>
                    <div className="text-[11px] text-[#7A6D65]">@babyshalls</div>
                  </div>
                </a>

                <a
                  href="https://wa.me/6281234567890?text=Halo%20Babyshalls%2C%20saya%20ingin%20tanya%20tentang%20toko%20dan%20koleksi%20buku"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-[#E5DDD0] hover:bg-[#FAF8F5] transition-colors text-[#382E2B]"
                >
                  <MessageCircle className="w-4 h-4 text-[#7CA992]" />
                  <div>
                    <div className="font-semibold">WhatsApp</div>
                    <div className="text-[11px] text-[#7A6D65]">+62 812-3456-7890</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Navigation Button */}
            <div className="pt-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-full bg-[#382E2B] hover:bg-[#251E1C] text-[#FFFDF9] font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Navigation className="w-4 h-4 text-[#D96B43]" />
                <span>Buka Rute di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
