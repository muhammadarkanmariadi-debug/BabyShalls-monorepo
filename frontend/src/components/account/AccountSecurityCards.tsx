'use client';

import React, { useState } from 'react';
import { KeyRound, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useChangeAccountPassword,
  useRequestEmailChange,
  useVerifyEmailChange,
} from '../../hooks/useAccount';
import { extractApiError } from '../../lib/axios';

export function AccountSecurityCards({ currentEmail }: { currentEmail: string }) {
  // Change Password state
  const changePasswordMutation = useChangeAccountPassword();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Change Email state
  const requestEmailMutation = useRequestEmailChange();
  const verifyEmailMutation = useVerifyEmailChange();
  const [newEmail, setNewEmail] = useState('');
  const [emailConfirmPassword, setEmailConfirmPassword] = useState('');
  const [emailOtpStep, setEmailOtpStep] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('Password baru minimal 8 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi password baru tidak cocok.');
      return;
    }
    try {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
      toast.success('Password berhasil diperbarui!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal memperbarui password.'));
    }
  };

  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestEmailMutation.mutateAsync({
        newEmail: newEmail.trim(),
        currentPassword: emailConfirmPassword,
      });
      setEmailOtpStep(true);
      toast.success(`Kode verifikasi 6 digit dikirim ke ${newEmail.trim()}.`);
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal mengirim verifikasi email baru.'));
    }
  };

  const handleVerifyEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyEmailMutation.mutateAsync({
        newEmail: newEmail.trim(),
        otp: emailOtp.trim(),
      });
      toast.success('Alamat email berhasil diperbarui!');
      setNewEmail('');
      setEmailConfirmPassword('');
      setEmailOtp('');
      setEmailOtpStep(false);
    } catch (err) {
      toast.error(extractApiError(err, 'Kode OTP tidak valid atau sudah kedaluwarsa.'));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Ganti Email */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 text-xs">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#D9744A]" />
          <h3 className="text-sm font-extrabold text-[#1A1A1A]">Ganti Alamat Email</h3>
        </div>
        <p className="text-[#6B7280]">
          Email aktif saat ini: <strong className="text-[#1A1A1A]">{currentEmail}</strong>
        </p>

        {!emailOtpStep ? (
          <form onSubmit={handleRequestEmailChange} className="space-y-3">
            <div>
              <label className="block font-bold mb-1">Email Baru *</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email.baru@domain.com"
                className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Password Saat Ini *</label>
              <input
                type="password"
                required
                minLength={6}
                value={emailConfirmPassword}
                onChange={(e) => setEmailConfirmPassword(e.target.value)}
                placeholder="Konfirmasi dengan password Anda"
                className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              />
            </div>
            <button
              type="submit"
              disabled={requestEmailMutation.isPending}
              className="px-5 min-h-[40px] rounded-full bg-[#502E1E] hover:bg-[#3b2115] disabled:opacity-60 text-white font-bold cursor-pointer"
            >
              {requestEmailMutation.isPending ? 'Mengirim OTP...' : 'Kirim Kode Verifikasi'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyEmailChange} className="space-y-3">
            <div className="p-3 rounded-xl bg-[#FCF6EC] border border-[#EBDCCB] text-[#6B3F2A]">
              Masukkan kode 6 digit yang dikirim ke <strong>{newEmail}</strong>.
            </div>
            <div>
              <label className="block font-bold mb-1">Kode OTP 6 Digit *</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full h-[44px] px-3.5 text-center text-base font-extrabold tracking-[0.35em] bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={verifyEmailMutation.isPending || emailOtp.length !== 6}
                className="px-5 min-h-[40px] rounded-full bg-[#1E543B] hover:bg-[#163f2c] disabled:opacity-60 text-white font-bold cursor-pointer"
              >
                {verifyEmailMutation.isPending ? 'Memverifikasi...' : 'Verifikasi & Ganti Email'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmailOtpStep(false);
                  setEmailOtp('');
                }}
                className="px-3 min-h-[40px] font-bold text-[#6B7280] hover:text-[#1A1A1A] cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Reset / Ubah Password */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 text-xs">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#1E543B]" />
          <h3 className="text-sm font-extrabold text-[#1A1A1A]">Reset / Ubah Password</h3>
        </div>
        <p className="text-[#6B7280] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1E543B]" />
          <span>Gunakan minimal 8 karakter agar akun tetap aman.</span>
        </p>

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className="block font-bold mb-1">Password Saat Ini *</label>
            <input
              type="password"
              required
              minLength={6}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Masukkan password saat ini"
              className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Password Baru *</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Konfirmasi Password Baru *</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
              className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
            />
          </div>
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="px-5 min-h-[40px] rounded-full bg-[#D9744A] hover:bg-[#c5633b] disabled:opacity-60 text-white font-bold cursor-pointer"
          >
            {changePasswordMutation.isPending ? 'Menyimpan...' : 'Perbarui Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

