'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'masuk' | 'daftar'>('masuk');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/account');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 font-sans">
      
      {/* Top Floating Back Link */}
      <div className="w-full max-w-4xl mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#7A5644] hover:text-[#B05A26] transition-colors group"
        >
          <span className="text-[#B05A26] transition-transform group-hover:-translate-x-1">&larr;</span>
          <span>Kembali ke Butik</span>
        </Link>
        
        <Link href="/" className="inline-block relative">
          <div className="relative w-28 h-9">
            <Image
              src="/BabyShallsLogo 1.PNG"
              alt="Baby Shall's"
              fill
              sizes="112px"
              className="object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Card Container (Figma Node #169:6204) */}
      <div className="w-full max-w-4xl bg-white border border-[#E6D2C0] rounded-[6px] overflow-hidden flex flex-col md:flex-row shadow-sm min-h-[560px]">
        
        {/* Left Panel: Ilustrasi & Sambutan (Figma Node #169:6205, bg #FBE6D8) */}
        <div className="w-full md:w-5/12 bg-[#FBE6D8] p-8 sm:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 my-2 shrink-0">
            <Image
              src="/images/mascot/maskot-melambai.png"
              alt="Maskot BabyShalls"
              fill
              priority
              className="object-contain"
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#4A2A1C] mb-2 tracking-tight">
            Halo, selamat datang!
          </h2>

          <p className="text-xs text-[#7A5644] max-w-xs leading-relaxed">
            Masuk untuk melacak pesanan buku anak, menyimpan wishlist kurasi, dan mengakses tiket QR workshop si kecil.
          </p>
        </div>

        {/* Right Panel: Form Masuk & Daftar (Figma Node #169:6212) */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Tab Selector (Masuk / Daftar) */}
          <div className="flex bg-[#F2E4D6] p-1 rounded-[4px] mb-6">
            <button
              type="button"
              onClick={() => setAuthMode('masuk')}
              className={`flex-1 py-2 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer ${
                authMode === 'masuk'
                  ? 'bg-white text-[#4A2A1C] shadow-xs'
                  : 'text-[#7A5644] hover:text-[#4A2A1C]'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('daftar')}
              className={`flex-1 py-2 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer ${
                authMode === 'daftar'
                  ? 'bg-white text-[#4A2A1C] shadow-xs'
                  : 'text-[#7A5644] hover:text-[#4A2A1C]'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Field: Nama Lengkap (Only on Daftar) */}
            {authMode === 'daftar' && (
              <div>
                <label className="block text-[#4A2A1C] font-semibold mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Contoh: Rina Wahyuni"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                />
              </div>
            )}

            {/* Field: Email */}
            {authMode === 'daftar' ? (
              <div>
                <label className="block text-[#4A2A1C] font-semibold mb-1">
                  Alamat Email *
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="email@anda.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                />
              </div>
            ) : (
              <div>
                <label className="block text-[#4A2A1C] font-semibold mb-1">
                  Email atau Nomor WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="email@anda.com atau 0812xxxx"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                />
              </div>
            )}

            {/* Field: Nomor WhatsApp (Figma Node #169:6241 - WAJIB DI REGISTER) */}
            {authMode === 'daftar' && (
              <div>
                <label className="block text-[#4A2A1C] font-semibold mb-1">
                  Nomor WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                />
                <span className="text-[10px] text-[#7A5644] mt-0.5 block">
                  Penting untuk informasi pengiriman resi &amp; tiket workshop anak.
                </span>
              </div>
            )}

            {/* Field: Kata Sandi */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[#4A2A1C] font-semibold">Kata Sandi *</label>
                {authMode === 'masuk' && (
                  <button
                    type="button"
                    onClick={() => alert('Fitur pemulihan kata sandi telah dikirim ke email/WhatsApp terdaftar.')}
                    className="text-[11px] text-[#B05A26] hover:underline cursor-pointer"
                  >
                    Lupa kata sandi?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder={authMode === 'daftar' ? 'Minimal 8 karakter' : 'Masukkan kata sandi'}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
              />
              {authMode === 'daftar' && (
                <span className="text-[10px] text-[#7A5644] mt-0.5 block">
                  Gunakan minimal 8 karakter dengan kombinasi angka dan huruf.
                </span>
              )}
            </div>

            {/* Remember Me on Masuk */}
            {authMode === 'masuk' && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMeLogin"
                  defaultChecked
                  className="w-4 h-4 accent-[#B05A26] rounded-[2px]"
                />
                <label htmlFor="rememberMeLogin" className="text-xs text-[#7A5644] cursor-pointer">
                  Ingat saya di perangkat ini
                </label>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#B05A26] hover:bg-[#8E431A] text-white font-semibold text-xs rounded-[2px] transition-colors cursor-pointer shadow-xs mt-2 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Memproses...'
                : authMode === 'masuk'
                ? 'Masuk ke Akun'
                : 'Buat Akun BabyShalls'}
            </button>

            <p className="text-[11px] text-[#7A5644] text-center pt-2 leading-relaxed">
              Belanja tanpa akun? Kamu tetap bisa checkout langsung sebagai tamu di keranjang belanja.
            </p>
          </form>

        </div>

      </div>

    </div>
  );
}

