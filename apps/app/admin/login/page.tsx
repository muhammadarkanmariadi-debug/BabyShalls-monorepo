'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, AlertCircle, KeyRound } from 'lucide-react';
import { ADMIN_TOKEN_STORAGE_KEY, USER_TOKEN_STORAGE_KEY, apiClient } from '@/lib/axios';
import { AuthResponse, OtpChallengeResponse, useResendOtp, useVerifyOtp } from '@/hooks/useAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@babyshalls.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  const handleSuccessAdminAuth = (authData: AuthResponse) => {
    if (authData.user?.role !== 'ADMIN') {
      setErrorMessage('Access denied (403): This account does not have Admin privileges.');
      return;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, authData.token);
      window.localStorage.removeItem(USER_TOKEN_STORAGE_KEY);
      window.localStorage.setItem('babyshalls_admin_user', JSON.stringify(authData.user));
      window.dispatchEvent(new Event('babyshalls-auth-changed'));
    }

    router.push('/admin');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (requiresOtp) {
        const authData = await verifyOtpMutation.mutateAsync({
          email: email.trim(),
          otp: otpCode.trim(),
        });
        handleSuccessAdminAuth(authData);
        setIsLoading(false);
        return;
      }

      const response = await apiClient.post<{
        success: boolean;
        data: AuthResponse | OtpChallengeResponse;
      }>('/auth/login', { email: email.trim(), password });

      const payload = response.data?.data;
      if (!payload) {
        setErrorMessage('Invalid authentication response.');
        setIsLoading(false);
        return;
      }

      if ('requiresOtp' in payload && payload.requiresOtp) {
        setRequiresOtp(true);
        setIsLoading(false);
        return;
      }

      if ('token' in payload) {
        handleSuccessAdminAuth(payload);
      }
    } catch (apiErr: unknown) {
      const errObj = apiErr as {
        response?: { data?: { error?: string; message?: string } };
        message?: string;
      };
      setErrorMessage(
        errObj?.response?.data?.error ||
          errObj?.response?.data?.message ||
          errObj?.message ||
          'Invalid admin email or password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans">
      {/* Top back button */}
      <div className="p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#7A5644] hover:text-[#B05A26] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Store</span>
        </Link>
      </div>

      {/* Main Centered Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[440px] bg-white border border-[#E6D2C0] rounded-[4px] p-8 sm:p-10 shadow-sm flex flex-col gap-4">
          <div className="relative w-[62px] h-[56px] mb-1">
            <Image
              src="/BabyShallsLogo 1.PNG"
              alt="Baby Shall's"
              fill
              priority
              className="object-contain object-left"
            />
          </div>

          <h1 className="text-[28px] sm:text-[32px] font-medium text-[#4A2A1C] leading-[1.25] tracking-[-0.005em]">
            {requiresOtp ? 'Admin OTP Verification' : 'Admin Sign In'}
          </h1>

          {errorMessage && (
            <div className="p-3 bg-[#FDF2F2] border border-[#F8B4B4] rounded-[4px] text-xs text-[#C0392B] flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {!requiresOtp ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#4A2A1C]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@babyshalls.com"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[4px] text-[14px] text-[#4A2A1C] placeholder-[#C9B3A5] focus:outline-none focus:border-[#B05A26] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#4A2A1C]">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3.5 py-2.5 pr-10 bg-white border border-[#E6D2C0] rounded-[4px] text-[14px] text-[#4A2A1C] placeholder-[#C9B3A5] focus:outline-none focus:border-[#B05A26] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-[#7A5644] hover:text-[#4A2A1C] p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#4A2A1C] flex items-center gap-1.5">
                  <KeyRound size={14} className="text-[#B05A26]" />
                  <span>6-Digit OTP Code ({email})</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[4px] text-[16px] tracking-[0.25em] font-semibold text-[#4A2A1C] focus:outline-none focus:border-[#B05A26] transition-colors"
                />
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => resendOtpMutation.mutate({ email: email.trim() })}
                    className="text-[#B05A26] hover:underline cursor-pointer"
                  >
                    Resend OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRequiresOtp(false);
                      setOtpCode('');
                    }}
                    className="text-[#7A5644] hover:underline cursor-pointer"
                  >
                    Switch account
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || verifyOtpMutation.isPending}
              className="w-full mt-2 py-3 px-5 bg-[#B05A26] hover:bg-[#8E431A] text-white text-[16px] font-medium rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              {isLoading || verifyOtpMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{requiresOtp ? 'Verify OTP' : 'Sign In'}</span>
              )}
            </button>
          </form>

          <p className="text-[13px] text-[#7A5644] text-center mt-1">
            Restricted to accounts with Admin role.
          </p>
        </div>
      </main>

      <footer className="p-6 text-center text-xs text-[#C9B3A5]">
        &copy; {new Date().getFullYear()} BabyShalls Malang · Administration Portal
      </footer>
    </div>
  );
}
