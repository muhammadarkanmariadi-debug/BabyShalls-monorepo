'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Mail,
  UserPlus,
  LogIn,
  KeyRound,
  Baby,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AuthUser,
  useForgotPassword,
  useLogin,
  useRegister,
  useResendOtp,
  useResetPassword,
  useVerifyMagicLink,
  useVerifyOtp,
} from '../../hooks/useAuth';
import { extractApiError } from '../../lib/axios';
import { formatChildAge, formatPhoneInput, normalizePhoneDigits } from '../../lib/utils';
import { GoogleAuthButton } from '../auth/GoogleAuthButton';

interface AccountAuthGateProps {
  onAuthenticated: (user?: AuthUser) => void;
}

export function AccountAuthGate({ onAuthenticated }: AccountAuthGateProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [registerStep, setRegisterStep] = useState<1 | 2 | 'otp'>(1);
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Profil keluarga (Langkah 2 registrasi)
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [childAgeValue, setChildAgeValue] = useState('');
  const [childAgeUnit, setChildAgeUnit] = useState<'Tahun' | 'Bulan'>('Tahun');
  const [emailOptIn, setEmailOptIn] = useState(true);

  // OTP & error state
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [verifyingMagic, setVerifyingMagic] = useState(false);
  const [formError, setFormError] = useState('');
  const magicAttemptedRef = useRef(false);

  const loginMutation = useLogin();
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const verifyMagicLinkMutation = useVerifyMagicLink();
  const registerMutation = useRegister();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  // Auto-verify 1-click magic link (?magicToken=...) or open reset password (?resetEmail=...&resetCode=...)
  useEffect(() => {
    if (typeof window === 'undefined' || magicAttemptedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const resetEmailParam = params.get('resetEmail');
    const resetCodeParam = params.get('resetCode');
    if (resetEmailParam && resetCodeParam) {
      magicAttemptedRef.current = true;
      setMode('forgot');
      setForgotStep('reset');
      setEmail(resetEmailParam);
      setOtpCode(resetCodeParam.replace(/\D/g, '').slice(0, 6));
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    const magicToken = params.get('magicToken');
    if (!magicToken) return;

    magicAttemptedRef.current = true;
    setVerifyingMagic(true);

    verifyMagicLinkMutation
      .mutateAsync({ token: magicToken })
      .then((res) => {
        window.history.replaceState({}, '', window.location.pathname);
        toast.success('Login berhasil via link email!');
        onAuthenticated(res.user);
      })
      .catch((err) => {
        const msg = extractApiError(err, 'Link verifikasi kedaluwarsa. Silakan login ulang.');
        setFormError(msg);
        toast.error(msg);
      })
      .finally(() => {
        setVerifyingMagic(false);
      });
  }, [onAuthenticated, verifyMagicLinkMutation]);

  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = window.setInterval(() => {
      setOtpCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpCountdown]);

  const handleModeSwitch = (nextMode: 'login' | 'register' | 'forgot') => {
    setMode(nextMode);
    setRegisterStep(1);
    setForgotStep('request');
    setOtpCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setFormError('');
  };

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = await forgotPasswordMutation.mutateAsync({ email: email.trim() });
      setForgotStep('reset');
      setOtpCountdown(res.expiresInSeconds || 300);
      toast.success('Kode reset password 6 digit telah dikirim ke email Anda.');
    } catch (err) {
      const msg = extractApiError(err, 'Gagal mengirim kode reset password.');
      setFormError(msg);
      toast.error(msg);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (newPassword.length < 8) {
      const msg = 'Password baru minimal 8 karakter.';
      setFormError(msg);
      toast.error(msg);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      const msg = 'Konfirmasi password baru tidak cocok.';
      setFormError(msg);
      toast.error(msg);
      return;
    }
    try {
      await resetPasswordMutation.mutateAsync({
        email: email.trim(),
        otp: otpCode.trim(),
        newPassword,
      });
      toast.success('Password berhasil direset! Silakan login dengan password baru.');
      handleModeSwitch('login');
      setPassword('');
    } catch (err) {
      const msg = extractApiError(err, 'Gagal mereset password. Periksa kode OTP Anda.');
      setFormError(msg);
      toast.error(msg);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = await loginMutation.mutateAsync({ email, password });
      toast.success('Login berhasil! Selamat datang kembali.');
      onAuthenticated(res.user);
    } catch (err) {
      const msg = extractApiError(err, 'Autentikasi gagal. Periksa kembali email & password Anda.');
      setFormError(msg);
      toast.error(msg);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = await verifyOtpMutation.mutateAsync({ email, otp: otpCode.trim() });
      toast.success('Email terverifikasi! Selamat datang di BabyShalls!');
      onAuthenticated(res.user);
    } catch (err) {
      const msg = extractApiError(err, 'Kode OTP tidak valid atau sudah kedaluwarsa.');
      setFormError(msg);
      toast.error(msg);
    }
  };

  const handleResendOtp = async () => {
    setFormError('');
    try {
      const res = await resendOtpMutation.mutateAsync({ email });
      setOtpCountdown(res.expiresInSeconds || 300);
      toast.success('Link verifikasi & kode OTP baru telah dikirim ke email Anda.');
    } catch (err) {
      const msg = extractApiError(err, 'Gagal mengirim ulang verifikasi.');
      setFormError(msg);
      toast.error(msg);
    }
  };

  const handleRegisterStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const digits = normalizePhoneDigits(phone);
    if (phone.trim() && (digits.length < 9 || digits.length > 15)) {
      setFormError('Nomor WhatsApp harus terdiri dari 9–15 digit (contoh: 0812-3456-7890).');
      return;
    }
    if (!parentName.trim()) {
      setParentName(name.trim());
    }
    setRegisterStep(2);
  };

  const submitRegistration = async (skipFamilyProfile = false) => {
    setFormError('');
    const cleanPhone = normalizePhoneDigits(phone);
    const formattedChildAge = formatChildAge(childAgeValue, childAgeUnit);

    try {
      const res = await registerMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: cleanPhone || undefined,
        parentName: skipFamilyProfile ? undefined : parentName.trim() || name.trim(),
        childName: skipFamilyProfile ? undefined : childName.trim() || undefined,
        childAge: skipFamilyProfile ? undefined : formattedChildAge || undefined,
        emailOptIn,
      });
      setOtpCountdown(res.expiresInSeconds || 300);
      setRegisterStep('otp');
      toast.success('Akun dibuat! Link verifikasi & kode OTP telah dikirim ke email Anda.');
    } catch (err) {
      const msg = extractApiError(err, 'Registrasi gagal. Periksa kembali data Anda.');
      setFormError(msg);
      toast.error(msg);
    }
  };

  const isPending =
    loginMutation.isPending ||
    verifyOtpMutation.isPending ||
    resendOtpMutation.isPending ||
    registerMutation.isPending ||
    forgotPasswordMutation.isPending ||
    resetPasswordMutation.isPending ||
    verifyingMagic;

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FFF8EF]">
      <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
        {/* Left Visual Panel (Full-bleed BabyShalls Store Image) */}
        <div className="hidden lg:block relative min-h-screen overflow-hidden bg-[#FCF6EC]">
          <img
            src="/images/store-boutique.jpg"
            alt="Toko Buku Anak & Mainan Kayu BabyShalls"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right Form Panel (Edge-to-Edge) */}
        <div className="bg-white min-h-screen p-6 sm:p-10 lg:p-14 flex flex-col justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B3F2A] hover:text-[#502E1E]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Toko</span>
            </Link>
          </div>

          <div className="w-full max-w-md mx-auto py-6 space-y-6">
            {verifyingMagic ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FDF0B8] text-[#502E1E] flex items-center justify-center mx-auto animate-pulse">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h1 className="text-lg font-extrabold text-[#502E1E]">Memverifikasi Link Login...</h1>
                <p className="text-xs text-[#6B3F2A]">Mohon tunggu sebentar, kami sedang menyiapkan akun Anda.</p>
              </div>
            ) : (
              <>
                <div className="space-y-1.5 text-center lg:text-left">
                  <h1 className="text-2xl font-extrabold text-[#502E1E]">
                    {mode === 'forgot'
                      ? forgotStep === 'reset'
                        ? 'Atur Password Baru'
                        : 'Lupa Password?'
                      : mode === 'register' && registerStep === 'otp'
                      ? 'Verifikasi Email Pendaftaran'
                      : mode === 'login'
                      ? 'Selamat Datang Kembali'
                      : registerStep === 2
                      ? 'Lengkapi Profil Keluarga'
                      : 'Buat Akun BabyShalls'}
                  </h1>
                  <p className="text-xs text-[#6B3F2A]">
                    {mode === 'forgot'
                      ? forgotStep === 'reset'
                        ? `Masukkan kode 6 digit yang dikirim ke ${email} beserta password baru Anda.`
                        : 'Masukkan email terdaftar Anda untuk menerima kode reset password 6 digit.'
                      : mode === 'register' && registerStep === 'otp'
                      ? `Kami mengirim tombol "Verifikasi & Masuk" dan kode 6 digit ke ${email}.`
                      : mode === 'register' && registerStep === 2
                      ? 'Data ini membantu pengisian otomatis saat mendaftar workshop & checkout.'
                      : 'Kelola pesanan, tiket workshop, dan profil keluarga dalam satu tempat.'}
                  </p>
                </div>

                {formError && (
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {mode !== 'forgot' && !(mode === 'register' && registerStep === 'otp') && (
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-full bg-[#FCF6EC] border border-[#EBDCCB]">
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('login')}
                      className={`h-10 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        mode === 'login' ? 'bg-[#502E1E] text-white' : 'text-[#6B3F2A]'
                      }`}
                    >
                      <LogIn className="w-3.5 h-3.5" /> Masuk
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('register')}
                      className={`h-10 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        mode === 'register' ? 'bg-[#502E1E] text-white' : 'text-[#6B3F2A]'
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Daftar
                    </button>
                  </div>
                )}

                {mode === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#502E1E] mb-1.5">Email *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="bunda@babyshalls.com"
                          className="w-full h-[44px] pl-10 pr-4 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block font-bold text-[#502E1E]">Password *</label>
                        <button
                          type="button"
                          onClick={() => handleModeSwitch('forgot')}
                          className="text-[11px] font-bold text-[#D9744A] hover:underline cursor-pointer"
                        >
                          Lupa password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukkan password"
                          className="w-full h-[44px] pl-10 pr-4 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full min-h-[46px] rounded-full bg-[#D9744A] hover:bg-[#c5633b] disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer"
                    >
                      {isPending ? 'Memproses...' : 'Masuk ke Akun'}
                    </button>
                  </form>
                )}

                {mode === 'forgot' && forgotStep === 'request' && (
                  <form onSubmit={handleForgotRequest} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#502E1E] mb-1.5">Email Terdaftar *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="bunda@babyshalls.com"
                          className="w-full h-[44px] pl-10 pr-4 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full min-h-[46px] rounded-full bg-[#D9744A] hover:bg-[#c5633b] disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer"
                    >
                      {forgotPasswordMutation.isPending ? 'Mengirim Kode...' : 'Kirim Kode Reset Password'}
                    </button>
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => handleModeSwitch('login')}
                        className="inline-flex items-center gap-1 font-bold text-[#6B3F2A] hover:text-[#502E1E] cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Halaman Masuk
                      </button>
                    </div>
                  </form>
                )}

                {mode === 'forgot' && forgotStep === 'reset' && (
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-[#502E1E] mb-1">Kode Verifikasi 6 Digit *</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full h-[48px] px-4 text-center text-lg font-extrabold tracking-[0.4em] bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#502E1E] mb-1">Password Baru (min. 8 karakter) *</label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimal 8 karakter"
                        className="w-full h-[44px] px-4 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#502E1E] mb-1">Konfirmasi Password Baru *</label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Ulangi password baru"
                        className="w-full h-[44px] px-4 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isPending || otpCode.length !== 6}
                      className="w-full min-h-[46px] rounded-full bg-[#1E543B] hover:bg-[#163f2c] disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer"
                    >
                      {resetPasswordMutation.isPending ? 'Menyimpan...' : 'Simpan Password Baru'}
                    </button>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => handleModeSwitch('login')}
                        className="inline-flex items-center gap-1 font-bold text-[#6B3F2A] hover:text-[#502E1E]"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali Masuk
                      </button>
                      <button
                        type="button"
                        disabled={otpCountdown > 240 || forgotPasswordMutation.isPending}
                        onClick={handleForgotRequest}
                        className="font-bold text-[#D9744A] disabled:text-[#9CA3AF]"
                      >
                        {otpCountdown > 0 ? `Kirim Ulang (${formatCountdown(otpCountdown)})` : 'Kirim Ulang Kode'}
                      </button>
                    </div>
                  </form>
                )}

                {mode === 'register' && registerStep === 'otp' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-[#FCF6EC] border border-[#EBDCCB] text-[#6B3F2A] leading-relaxed">
                      <strong>Tips cepat:</strong> Buka email di perangkat ini lalu klik tombol{' '}
                      <strong>&ldquo;Masuk Langsung (1-Klik)&rdquo;</strong>, atau ketik kode 6 digit di bawah jika membuka email dari HP lain.
                    </div>
                    <div>
                      <label className="block font-bold text-[#502E1E] mb-1.5">Kode Verifikasi 6 Digit *</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full h-[50px] px-4 text-center text-xl font-extrabold tracking-[0.4em] bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isPending || otpCode.length !== 6}
                      className="w-full min-h-[46px] rounded-full bg-[#1E543B] hover:bg-[#163f2c] disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer"
                    >
                      {verifyOtpMutation.isPending ? 'Memverifikasi...' : 'Verifikasi & Aktifkan Akun'}
                    </button>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setRegisterStep(1);
                          setOtpCode('');
                          setFormError('');
                        }}
                        className="inline-flex items-center gap-1 font-bold text-[#6B3F2A] hover:text-[#502E1E]"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Ganti Email
                      </button>
                      <button
                        type="button"
                        disabled={otpCountdown > 240 || resendOtpMutation.isPending}
                        onClick={handleResendOtp}
                        className="font-bold text-[#D9744A] disabled:text-[#9CA3AF]"
                      >
                        {otpCountdown > 0 ? `Kirim Ulang (${formatCountdown(otpCountdown)})` : 'Kirim Ulang Email'}
                      </button>
                    </div>
                  </form>
                )}

                {mode === 'register' && registerStep === 1 && (
                  <form onSubmit={handleRegisterStep1} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-[#502E1E] mb-1">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        minLength={2}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Bunda Rania Putri"
                        className="w-full h-[44px] px-4 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#502E1E] mb-1">
                        Nomor WhatsApp <span className="font-normal text-[#9CA3AF]">(Format: 0812-3456-7890)</span>
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                        placeholder="0812-3456-7890"
                        maxLength={18}
                        className="w-full h-[44px] px-4 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#502E1E] mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="bunda@babyshalls.com"
                        className="w-full h-[44px] px-4 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#502E1E] mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 8 karakter"
                        className="w-full h-[44px] px-4 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full min-h-[46px] rounded-full bg-[#D9744A] hover:bg-[#c5633b] text-white font-bold text-sm transition-colors cursor-pointer"
                    >
                      Lanjut: Profil Keluarga
                    </button>
                  </form>
                )}

                {mode === 'register' && registerStep === 2 && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void submitRegistration(false);
                    }}
                    className="space-y-3.5 text-xs"
                  >
                    <div className="p-3.5 rounded-2xl bg-[#FCF6EC] border border-[#EBDCCB] flex items-start gap-2.5 text-[#6B3F2A]">
                      <Baby className="w-4 h-4 text-[#D9744A] shrink-0 mt-0.5" />
                      <span>
                        Isi data keluarga agar pendaftaran workshop, request buku, &amp; checkout bisa diisi otomatis dalam 1 klik.
                      </span>
                    </div>
                    <div>
                      <label className="block font-bold text-[#502E1E] mb-1">Nama Ayah / Ibu</label>
                      <input
                        type="text"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="Contoh: Ibu Rania / Ayah Dimas"
                        className="w-full h-[44px] px-4 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#502E1E] mb-1">Nama Anak</label>
                        <input
                          type="text"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          placeholder="Contoh: Arka"
                          className="w-full h-[44px] px-4 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#502E1E] mb-1">Umur Anak</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min={0}
                            max={childAgeUnit === 'Tahun' ? 18 : 36}
                            step="1"
                            inputMode="numeric"
                            value={childAgeValue}
                            onChange={(e) => setChildAgeValue(e.target.value.replace(/[^\d]/g, ''))}
                            placeholder={childAgeUnit === 'Tahun' ? '2' : '18'}
                            className="w-full h-[44px] px-3 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl text-sm"
                          />
                          <select
                            value={childAgeUnit}
                            onChange={(e) => setChildAgeUnit(e.target.value as 'Tahun' | 'Bulan')}
                            className="h-[44px] px-2.5 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl text-xs font-bold text-[#502E1E]"
                          >
                            <option value="Tahun">Tahun</option>
                            <option value="Bulan">Bulan</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <label className="flex items-start gap-2 pt-1 cursor-pointer text-[#6B3F2A]">
                      <input
                        type="checkbox"
                        checked={emailOptIn}
                        onChange={(e) => setEmailOptIn(e.target.checked)}
                        className="mt-0.5 accent-[#D9744A]"
                      />
                      <span>Kirimkan info promo terbaru &amp; jadwal event/workshop BabyShalls via email.</span>
                    </label>
                    <button
                      type="submit"
                      disabled={registerMutation.isPending}
                      className="w-full min-h-[46px] rounded-full bg-[#1E543B] hover:bg-[#163f2c] disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer inline-flex items-center justify-center"
                    >
                      <span>{registerMutation.isPending ? 'Membuat Akun...' : 'Simpan & Buat Akun'}</span>
                    </button>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setRegisterStep(1);
                          setFormError('');
                        }}
                        className="inline-flex items-center gap-1 font-bold text-[#6B3F2A]"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                      </button>
                      <button
                        type="button"
                        disabled={registerMutation.isPending}
                        onClick={() => void submitRegistration(true)}
                        className="font-bold text-[#6B3F2A] hover:text-[#502E1E] underline cursor-pointer"
                      >
                        Lewati langkah ini
                      </button>
                    </div>
                  </form>
                )}

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-[#EBDCCB]" />
                  <span className="shrink mx-3 text-[11px] font-bold text-[#9CA3AF]">ATAU MASUK INSTAN</span>
                  <div className="flex-grow border-t border-[#EBDCCB]" />
                </div>

                <GoogleAuthButton onSuccess={onAuthenticated} />
              </>
            )}
          </div>

          <div className="text-center text-[11px] text-[#9CA3AF]">
            © {new Date().getFullYear()} BabyShalls Malang. Semua hak dilindungi.
          </div>
        </div>
      </div>
    </div>
  );
}
