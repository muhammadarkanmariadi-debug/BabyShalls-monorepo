'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatIDR } from '../data/mockProducts';

export const GiftWrapping: React.FC = () => {
  const { giftWrapping, updateGiftWrapping, giftWrappingCost } = useCart();

  const options = [
    {
      key: 'birthdayCard' as const,
      title: 'Greeting Card & Handwritten Note',
      subtitle: 'Kartu ucapan elegan dengan pesan personal yang ditulis tangan untuk penerima kado',
      price: 15000,
      tag: 'Most Popular'
    },
    {
      key: 'customRibbon' as const,
      title: 'Signature Fabric Ribbon (Terracotta / Sage)',
      subtitle: 'Pita kain premium bertekstur lembut dengan ikatan rapi khas butik',
      price: 10000,
      tag: 'Sweet Touch'
    },
    {
      key: 'signatureBox' as const,
      title: 'Pinewood Keepsake Hamper Box',
      subtitle: 'Peti kayu pinus natural dengan serbuk kertas halus untuk kado istimewa',
      price: 35000,
      tag: 'Deluxe'
    }
  ];

  return (
    <section id="gift-wrapping" className="py-16 md:py-20 bg-[#FAF4ED] border-b border-[#EEDBC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EEDBC9] text-xs font-bold text-[#DA7A5B]">
              <Gift className="w-3.5 h-3.5" />
              <span>Gift Wrapping Service</span>
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#6B3F2A] tracking-tight leading-tight">
              Bungkus Kado &amp; Hampers
            </h2>

            <p className="text-sm sm:text-base text-[#6B3F2A]/80 leading-relaxed font-normal">
              Ingin menghadiahkan buku atau mainan ini untuk ulang tahun si kecil atau kelahiran kerabat? Tambahkan opsi kemasan kado dan pesan ucapan personal.
            </p>

            <div className="p-4 rounded-2xl bg-white border border-[#EEDBC9] space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-[#6B3F2A]">
                <span>Total Biaya Kemasan Tambahan:</span>
                <span className="text-base font-bold text-[#DA7A5B]">
                  +{formatIDR(giftWrappingCost)}
                </span>
              </div>
              <p className="text-[11px] text-[#6B3F2A]/60">
                Pilihan ini akan otomatis disertakan saat checkout / pemesanan via WhatsApp.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Options Checkboxes */}
          <div className="lg:col-span-7 space-y-3.5">
            {options.map((opt) => {
              const isChecked = giftWrapping[opt.key];
              return (
                <motion.div
                  key={opt.key}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => updateGiftWrapping({ [opt.key]: !isChecked })}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isChecked
                      ? 'bg-white border-[#DA7A5B] shadow-sm ring-2 ring-[#DA7A5B]/15'
                      : 'bg-white/80 border-[#EEDBC9] hover:bg-white hover:border-[#CBA989]'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                    isChecked ? 'bg-[#DA7A5B] text-white' : 'border border-[#CBA989] bg-white'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm sm:text-base text-[#6B3F2A]">
                          {opt.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE4D0] text-[#DA7A5B]">
                          {opt.tag}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-[#DA7A5B]">
                        +{formatIDR(opt.price)}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B3F2A]/70">
                      {opt.subtitle}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            <AnimatePresence>
              {giftWrapping.birthdayCard && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pt-2 overflow-hidden"
                >
                  <label className="block text-xs font-bold text-[#6B3F2A] mb-1.5">
                    Tuliskan Pesan untuk Kartu Ucapan:
                  </label>
                  <textarea
                    value={giftWrapping.cardMessage}
                    onChange={(e) => updateGiftWrapping({ cardMessage: e.target.value })}
                    placeholder="Contoh: Selamat ulang tahun ke-3 Kenzo tersayang! Semoga tumbuh jadi anak yang ceria dan suka membaca..."
                    className="w-full text-xs p-3.5 rounded-xl border border-[#EEDBC9] bg-white text-[#6B3F2A] placeholder-[#CBA989] focus:outline-none focus:border-[#DA7A5B] focus:ring-2 focus:ring-[#DA7A5B]/20 transition-all resize-none h-20"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
