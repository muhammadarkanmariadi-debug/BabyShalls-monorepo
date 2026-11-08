'use client';

import React, { useState } from 'react';
import { User, Package, MapPin, Truck, ExternalLink } from 'lucide-react';
import { formatIDR } from '../../lib/utils';

interface OrderHistory {
  orderNumber: string;
  date: string;
  status: 'DIPROSES' | 'DIKIRIM' | 'SELESAI';
  courier: string;
  trackingNumber: string;
  items: string[];
  total: number;
}

const SAMPLE_ORDERS: OrderHistory[] = [
  {
    orderNumber: 'BS-20261108-001',
    date: '8 Nov 2026',
    status: 'DIKIRIM',
    courier: 'J&T Express (KiriminAja)',
    trackingNumber: 'JX8920192801ID',
    items: ['Look and Grow: Nature (Board Book)', 'Wooden Rainbow Stacker'],
    total: 442500,
  },
  {
    orderNumber: 'BS-20261025-014',
    date: '25 Okt 2026',
    status: 'SELESAI',
    courier: 'SiCepat (KiriminAja)',
    trackingNumber: 'SI0019283749ID',
    items: ['Baby Sensory: Touch & Feel Animals'],
    total: 182000,
  }
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  return (
    <div className="py-10 lg:py-16 bg-[#FFF8EF]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Profile Header */}
        <div className="bg-[#FFF9F0] border border-[#EEDBC9] rounded-[28px] p-6 sm:p-8 mb-8 shadow-xs flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#FFE4D0] border-2 border-[#F6B79B] flex items-center justify-center text-[#DA7A5B]">
            <User className="w-10 h-10" />
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#502E1E]">Bunda Amanda Rahma</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EBF2E0] text-[#709154] text-[11px] font-bold">
                Member BabyShalls
              </span>
            </div>
            <p className="text-xs text-[#8FA87E] mt-1">amanda.rahma@email.com • WhatsApp: 0812-3456-7890</p>
            <p className="text-xs text-[#6B3F2A] mt-0.5">Alamat Utama: Jl. Merbabu No. 15, Klojen, Kota Malang</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-3 border-b border-[#EEDBC9] pb-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-[#DA7A5B] text-white shadow-subtle'
                : 'bg-[#FCF6EC] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Riwayat Pesanan ({SAMPLE_ORDERS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'addresses'
                ? 'bg-[#DA7A5B] text-white shadow-subtle'
                : 'bg-[#FCF6EC] text-[#6B3F2A] hover:bg-[#FFE4D0]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Buku Alamat Pengiriman</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' ? (
          <div className="space-y-4">
            {SAMPLE_ORDERS.map((order) => (
              <div
                key={order.orderNumber}
                className="bg-[#FFF9F0] border border-[#EEDBC9] rounded-[24px] p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EEDBC9]">
                  <div>
                    <span className="text-xs text-[#8FA87E] block">Nomor Pesanan</span>
                    <span className="font-bold text-sm text-[#502E1E]">{order.orderNumber}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#8FA87E]">{order.date}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        order.status === 'DIKIRIM'
                          ? 'bg-[#FDF3D6] text-[#9A7010]'
                          : 'bg-[#EBF2E0] text-[#709154]'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-[#6B3F2A]">
                  <span className="font-bold block text-[#502E1E]">Produk yang Dipesan:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[#8FA87E]">
                    {order.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Tracking info */}
                <div className="p-3.5 bg-[#FCF6EC] rounded-xl border border-[#EEDBC9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#DA7A5B] flex-shrink-0" />
                    <div>
                      <span className="text-[#8FA87E]">Kurir: <strong>{order.courier}</strong></span>
                      <span className="block font-mono font-bold text-[#502E1E]">Resi: {order.trackingNumber}</span>
                    </div>
                  </div>
                  <a
                    href={`https://cekresi.com/?noresi=${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFE4D0] hover:bg-[#F6B79B] text-[#502E1E] font-bold text-[11px] transition-colors"
                  >
                    <span>Lacak Pengiriman</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-[#8FA87E]">Total Pembayaran:</span>
                  <span className="font-serif font-extrabold text-base text-[#DA7A5B]">
                    {formatIDR(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#FFF9F0] border border-[#EEDBC9] rounded-[24px] p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#502E1E]">Alamat Tersimpan</h3>
            <div className="p-4 rounded-2xl bg-[#FCF6EC] border border-[#EEDBC9] space-y-1 text-xs">
              <span className="font-bold text-[#DA7A5B] block">Alamat Rumah (Utama)</span>
              <p className="font-bold text-[#502E1E]">Bunda Amanda Rahma (0812-3456-7890)</p>
              <p className="text-[#6B3F2A]">Jl. Merbabu No. 15, RT 02 / RW 05, Oro-oro Dowo, Kec. Klojen, Kota Malang, Jawa Timur 65111</p>
            </div>
            <button className="px-5 py-2.5 rounded-full bg-[#DA7A5B] text-white font-bold text-xs shadow-subtle">
              + Tambah Alamat Baru
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

