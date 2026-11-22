'use client';

import React, { useState } from 'react';
import { X, Mail, KeyRound, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useRequestEmailChange, useVerifyEmailChange } from '@/hooks/useAccount';

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  onSuccess: (newEmail: string) => void;
}

export const EmailChangeModal: React.FC<EmailChangeModalProps> = ({
  isOpen,
  onClose,
  currentEmail,
  onSuccess,
}) => {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const requestMutation = useRequestEmailChange();
  const verifyMutation = useVerifyEmailChange();

  // Dynamic progress calculation based on user input
  const progressPercent = (() => {
    if (step === 'verify') {
      return otpCode.trim().length >= 6 ? 100 : otpCode.trim().length > 0 ? 75 : 50;
    }
    const hasValidEmail = newEmail.trim().length > 0 && newEmail.includes('@');
    const hasPassword = currentPassword.length > 0;
    if (hasValidEmail && hasPassword) return 50;
    if (hasValidEmail || hasPassword) return 25;
    return 0;
  })();

  if (!isOpen) return null;

  const handleClose = () => {
    setStep('request');
    setNewEmail('');
    setCurrentPassword('');
    setOtpCode('');
    setErrorMsg('');
    setInfoMsg('');
    onClose();
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!newEmail.trim() || !newEmail.includes('@')) {
      setErrorMsg('Masukkan format email baru yang valid.');
      return;
    }
    if (!currentPassword) {
      setErrorMsg('Masukkan password saat ini untuk konfirmasi keamanan.');
      return;
    }
    if (newEmail.trim().toLowerCase() === currentEmail.trim().toLowerCase()) {
      setErrorMsg('Email baru tidak boleh sama dengan email akun saat ini.');
      return;
    }

    try {
      const res = await requestMutation.mutateAsync({
        newEmail: newEmail.trim().toLowerCase(),
        currentPassword,
      });
      setStep('verify');
      const devHint = res.previewOtp ? ` (Kode Dev Testing: ${res.previewOtp})` : '';
      setInfoMsg(`Kode OTP 6 digit telah diterbitkan untuk ${newEmail.trim()}.${devHint}`);
      if (res.previewOtp) {
        setOtpCode(res.previewOtp);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Gagal mengirimkan kode OTP.';
      setErrorMsg(msg);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!otpCode.trim() || otpCode.trim().length < 4) {
      setErrorMsg('Masukkan kode OTP dengan lengkap.');
      return;
    }

    try {
      const res = await verifyMutation.mutateAsync({
        newEmail: newEmail.trim().toLowerCase(),
        otp: otpCode.trim(),
      });
      onSuccess(res.user.email);
      handleClose();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Kode OTP tidak valid atau kedaluwarsa.';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-[#E6D2C0] rounded-[2px] p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-left">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#7A5644] hover:text-[#4A2A1C] p-1 cursor-pointer transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-5 h-5 text-[#B05A26]" />
          <h3 className="text-base font-semibold text-[#4A2A1C]">
            {step === 'request' ? 'Ganti Alamat Email' : 'Verifikasi OTP Email Baru'}
          </h3>
        </div>

        {/* Step indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#7A5644] mb-1.5">
            <span>
              {step === 'request'
                ? 'Langkah 1 dari 2: Masukkan Email Baru & Sandi'
                : 'Langkah 2 dari 2: Verifikasi Kode OTP'}
            </span>
            <span className="text-[#B05A26] font-mono font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#F2E4D6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#B05A26] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-[#7A5644] mb-4">
          {step === 'request'
            ? 'Demi keamanan akun, masukkan password akun saat ini dan alamat email baru Anda.'
            : `Masukkan kode 6 digit yang kami kirimkan ke ${newEmail}.`}
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-[#FDF0ED] border border-[#F5C2B8] text-[#C0392B] text-xs rounded-[2px] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="mb-4 p-3 bg-[#DDF1E5] border border-[#A7DBB8] text-[#2A6E37] text-xs rounded-[2px] flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{infoMsg}</span>
          </div>
        )}

        {step === 'request' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#7A5644] font-medium mb-1">
                Email Baru
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="nama@emailbaru.com"
                required
                className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] placeholder:text-[#A89080] focus:outline-none focus:border-[#B05A26]"
              />
            </div>

            <div>
              <label className="block text-[#7A5644] font-medium mb-1">
                Password Saat Ini (Konfirmasi Keamanan)
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] placeholder:text-[#A89080] focus:outline-none focus:border-[#B05A26]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-[#E6D2C0] text-[#7A5644] hover:bg-[#FFF6EA] font-medium rounded-[2px] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={requestMutation.isPending}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#B05A26] hover:bg-[#964B1F] text-white font-medium rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
              >
                {requestMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengirim OTP...</span>
                  </>
                ) : (
                  <span>Kirim Kode OTP</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#7A5644] font-medium mb-1">
                Kode Verifikasi (OTP) 6 Digit
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#7A5644] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  required
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 text-center text-lg tracking-widest font-mono border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] placeholder:text-[#A89080] focus:outline-none focus:border-[#B05A26]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('request')}
                className="text-xs text-[#B05A26] hover:underline cursor-pointer"
              >
                Kirim Ulang / Ubah Email
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-[#E6D2C0] text-[#7A5644] hover:bg-[#FFF6EA] font-medium rounded-[2px] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={verifyMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#B05A26] hover:bg-[#964B1F] text-white font-medium rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {verifyMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <span>Verifikasi &amp; Simpan</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
