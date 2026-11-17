'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import {
  useForgotPassword,
  useGoogleAuth,
  useLogin,
  useRegister,
  useResendOtp,
  useResetPassword,
  useVerifyOtp,
} from '@/hooks/useAuth';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

function extractApiError(err: unknown, fallback: string): string {
  const anyErr = err as {
    response?: { data?: { error?: string; message?: string } };
    message?: string;
  };
  return anyErr?.response?.data?.error || anyErr?.response?.data?.message || anyErr?.message || fallback;
}

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'masuk' | 'daftar' | 'otp' | 'forgot' | 'reset'>('masuk');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const googleAuthMutation = useGoogleAuth();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  const isSubmitting =
    loginMutation.isPending ||
    registerMutation.isPending ||
    verifyOtpMutation.isPending ||
    resendOtpMutation.isPending ||
    googleAuthMutation.isPending ||
    forgotPasswordMutation.isPending ||
    resetPasswordMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    try {
      if (authMode === 'masuk') {
        await loginMutation.mutateAsync({
          email: authEmail.trim(),
          password: authPassword,
        });
        router.push('/account');
        return;
      }

      if (authMode === 'daftar') {
        const res = await registerMutation.mutateAsync({
          name: authName.trim(),
          email: authEmail.trim(),
          password: authPassword,
          phone: authPhone.trim() || undefined,
        });
        setInfoMsg(
          `Akun dibuat! Kode OTP 6 digit telah dikirim ke ${res.email}. Masukkan kode di bawah untuk mengaktifkan sesi.`
        );
        setAuthMode('otp');
        return;
      }

      if (authMode === 'otp') {
        await verifyOtpMutation.mutateAsync({
          email: authEmail.trim(),
          otp: otpCode.trim(),
        });
        router.push('/account');
        return;
      }

      if (authMode === 'forgot') {
        const res = await forgotPasswordMutation.mutateAsync({
          email: authEmail.trim(),
        });
        setInfoMsg(`Kode OTP pemulihan kata sandi telah dikirim ke ${res.email}.`);
        setAuthMode('reset');
        return;
      }

      if (authMode === 'reset') {
        await resetPasswordMutation.mutateAsync({
          email: authEmail.trim(),
          otp: otpCode.trim(),
          newPassword,
        });
        setInfoMsg('Kata sandi berhasil diperbarui. Silakan masuk menggunakan kata sandi baru.');
        setAuthPassword('');
        setOtpCode('');
        setNewPassword('');
        setAuthMode('masuk');
      }
    } catch (err: unknown) {
      setErrorMsg(extractApiError(err, 'Terjadi kesalahan autentikasi. Silakan coba lagi.'));
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg('');
    setInfoMsg('');
    try {
      const res = await resendOtpMutation.mutateAsync({ email: authEmail.trim() });
      setInfoMsg(`Kode OTP baru telah dikirim ke ${res.email}.`);
    } catch (err: unknown) {
      setErrorMsg(extractApiError(err, 'Gagal mengirim ulang OTP.'));
    }
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
        {/* Left Panel */}
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

        {/* Right Panel */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-center">
          {/* Tab Selector (Masuk / Daftar) */}
          {(authMode === 'masuk' || authMode === 'daftar') && (
            <div className="flex bg-[#F2E4D6] p-1 rounded-[4px] mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('masuk');
                  setErrorMsg('');
                  setInfoMsg('');
                }}
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
                onClick={() => {
                  setAuthMode('daftar');
                  setErrorMsg('');
                  setInfoMsg('');
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer ${
                  authMode === 'daftar'
                    ? 'bg-white text-[#4A2A1C] shadow-xs'
                    : 'text-[#7A5644] hover:text-[#4A2A1C]'
                }`}
              >
                Daftar Akun Baru
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 bg-[#FEECE8] border border-[#F5C2B8] rounded-[2px] text-xs text-[#C0392B] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="mb-4 p-3 bg-[#EBF7EE] border border-[#B8DFC2] rounded-[2px] text-xs text-[#2A6E37] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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

            {(authMode === 'masuk' || authMode === 'daftar' || authMode === 'forgot') && (
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
            )}

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
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                />
                <span className="text-[10px] text-[#7A5644] mt-0.5 block">
                  Penting untuk informasi pengiriman resi &amp; tiket workshop anak.
                </span>
              </div>
            )}

            {(authMode === 'masuk' || authMode === 'daftar') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#4A2A1C] font-semibold">Kata Sandi *</label>
                  {authMode === 'masuk' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setErrorMsg('');
                        setInfoMsg('');
                      }}
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
                    Gunakan minimal 8 karakter.
                  </span>
                )}
              </div>
            )}

            {(authMode === 'otp' || authMode === 'reset') && (
              <div>
                <label className="block text-[#4A2A1C] font-semibold mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#B05A26]" />
                  <span>Kode OTP 6 Digit *</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] tracking-[0.25em] font-semibold focus:outline-none focus:border-[#B05A26]"
                />
              </div>
            )}

            {authMode === 'reset' && (
              <div>
                <label className="block text-[#4A2A1C] font-semibold mb-1">
                  Kata Sandi Baru *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#B05A26] hover:bg-[#8E431A] text-white font-semibold text-xs rounded-[2px] transition-colors cursor-pointer shadow-xs mt-2 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Memproses...'
                : authMode === 'masuk'
                ? 'Masuk ke Akun'
                : authMode === 'daftar'
                ? 'Buat Akun BabyShalls'
                : authMode === 'otp'
                ? 'Verifikasi OTP'
                : authMode === 'forgot'
                ? 'Kirim Kode Pemulihan'
                : 'Simpan Kata Sandi Baru'}
            </button>

            {authMode === 'otp' && (
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="text-[11px] font-medium text-[#B05A26] hover:underline cursor-pointer"
                >
                  Kirim ulang kode OTP
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('masuk')}
                  className="text-[11px] text-[#7A5644] hover:underline cursor-pointer"
                >
                  Kembali ke Masuk
                </button>
              </div>
            )}

            {(authMode === 'forgot' || authMode === 'reset') && (
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('masuk');
                    setErrorMsg('');
                    setInfoMsg('');
                  }}
                  className="text-[11px] text-[#7A5644] hover:underline cursor-pointer"
                >
                  &larr; Kembali ke halaman Masuk
                </button>
              </div>
            )}

            {(authMode === 'masuk' || authMode === 'daftar') && GOOGLE_CLIENT_ID && (
              <div className="pt-3 border-t border-[#F2E4D6] flex flex-col items-center gap-2.5">
                <span className="text-[11px] text-[#7A5644]">Atau masuk dengan Google</span>
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    setErrorMsg('');
                    if (!credentialResponse.credential) {
                      setErrorMsg('Token Google tidak tersedia.');
                      return;
                    }
                    try {
                      await googleAuthMutation.mutateAsync({
                        credential: credentialResponse.credential,
                      });
                      router.push('/account');
                    } catch (err: unknown) {
                      setErrorMsg(extractApiError(err, 'Gagal login dengan Google.'));
                    }
                  }}
                  onError={() => {
                    setErrorMsg('Login Google dibatalkan atau gagal.');
                  }}
                />
              </div>
            )}

            <p className="text-[11px] text-[#7A5644] text-center pt-2 leading-relaxed">
              Belanja tanpa akun? Kamu tetap bisa checkout langsung sebagai tamu di keranjang belanja.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
