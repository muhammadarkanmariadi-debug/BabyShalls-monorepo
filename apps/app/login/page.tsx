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
  const [redirectTo, setRedirectTo] = useState<string>('/account');

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const rawRedirect = params.get('redirect');
    if (rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')) {
      setRedirectTo(rawRedirect);
      if (rawRedirect === '/checkout') {
        setInfoMsg('Please sign in or create an account to proceed with checkout.');
      }
    }
  }, []);

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
        const res = await loginMutation.mutateAsync({
          email: authEmail.trim(),
          password: authPassword,
        });
        router.push(res.user?.role === 'ADMIN' ? '/admin' : redirectTo);
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
          `Account created! A 6-digit OTP code has been sent to ${res.email}. Enter the code below to activate your session.`
        );
        setAuthMode('otp');
        return;
      }

      if (authMode === 'otp') {
        const res = await verifyOtpMutation.mutateAsync({
          email: authEmail.trim(),
          otp: otpCode.trim(),
        });
        router.push(res.user?.role === 'ADMIN' ? '/admin' : redirectTo);
        return;
      }

      if (authMode === 'forgot') {
        const res = await forgotPasswordMutation.mutateAsync({
          email: authEmail.trim(),
        });
        setInfoMsg(`A password recovery OTP code has been sent to ${res.email}.`);
        setAuthMode('reset');
        return;
      }

      if (authMode === 'reset') {
        await resetPasswordMutation.mutateAsync({
          email: authEmail.trim(),
          otp: otpCode.trim(),
          newPassword,
        });
        setInfoMsg('Password updated successfully. Please sign in with your new password.');
        setAuthPassword('');
        setOtpCode('');
        setNewPassword('');
        setAuthMode('masuk');
      }
    } catch (err: unknown) {
      setErrorMsg(extractApiError(err, 'Authentication error occurred. Please try again.'));
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg('');
    setInfoMsg('');
    try {
      const res = await resendOtpMutation.mutateAsync({ email: authEmail.trim() });
      setInfoMsg(`A new OTP code has been sent to ${res.email}.`);
    } catch (err: unknown) {
      setErrorMsg(extractApiError(err, 'Failed to resend OTP code.'));
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col md:flex-row font-sans">
      {/* Left Split Panel — Full Height Warm Peach */}
      <div className="w-full md:w-1/2 bg-[#FBE6D8] md:min-h-screen p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-[#E6D2C0]">
        {/* Top Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#7A5644] hover:text-[#B05A26] transition-colors group"
          >
            <span className="text-[#B05A26] transition-transform group-hover:-translate-x-1">&larr;</span>
            <span>Back to Boutique</span>
          </Link>

          <Link href="/" className="inline-block relative md:hidden">
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

        {/* Center Mascot & Welcome Copy */}
        <div className="flex flex-col items-center justify-center text-center my-8 md:my-0">
          <div className="relative w-48 h-48 sm:w-60 sm:h-60 lg:w-64 lg:h-64 mb-4 shrink-0">
            <Image
              src="/images/mascot/maskot-melambai.png"
              alt="BabyShalls Mascot"
              fill
              priority
              className="object-contain"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#4A2A1C] mb-3 tracking-tight">
            Hello, welcome!
          </h2>

          <p className="text-xs sm:text-sm text-[#7A5644] max-w-sm leading-relaxed">
            Sign in to track children&apos;s book orders, save curated wishlists, and access workshop QR tickets for your little one.
          </p>
        </div>

        {/* Subtle Bottom Spacer / Brand Note */}
        <div className="hidden md:block text-center text-[11px] text-[#7A5644]/80">
          BabyShalls &bull; Children&apos;s Book Boutique &amp; Educational Toys Malang
        </div>
      </div>

      {/* Right Split Panel — Full Height Form */}
      <div className="w-full md:w-1/2 bg-white md:min-h-screen p-6 sm:p-10 lg:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          {/* Desktop Logo */}
          <div className="hidden md:flex justify-center mb-6">
            <Link href="/" className="inline-block relative">
              <div className="relative w-32 h-10">
                <Image
                  src="/BabyShallsLogo 1.PNG"
                  alt="Baby Shall's"
                  fill
                  sizes="128px"
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

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
                className={`flex-1 py-2 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer ${authMode === 'masuk'
                  ? 'bg-white text-[#4A2A1C] shadow-xs'
                  : 'text-[#7A5644] hover:text-[#4A2A1C]'
                  }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('daftar');
                  setErrorMsg('');
                  setInfoMsg('');
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer ${authMode === 'daftar'
                  ? 'bg-white text-[#4A2A1C] shadow-xs'
                  : 'text-[#7A5644] hover:text-[#4A2A1C]'
                  }`}
              >
                Create Account
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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Rina Wahyuni"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                />
              </div>
            )}

            {(authMode === 'masuk' || authMode === 'daftar' || authMode === 'forgot') && (
              <div>
                <label className="block text-[#4A2A1C] font-semibold mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                />
              </div>
            )}

            {authMode === 'daftar' && (
              <div>
                <label className="block text-[#4A2A1C] font-semibold mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  placeholder="e.g. 081234567890"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                />
                <span className="text-[10px] text-[#7A5644] mt-0.5 block">
                  Important for delivery updates &amp; children&apos;s workshop tickets.
                </span>
              </div>
            )}

            {(authMode === 'masuk' || authMode === 'daftar') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#4A2A1C] font-semibold">Password *</label>
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
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder={authMode === 'daftar' ? 'At least 8 characters' : 'Enter your password'}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                />
                {authMode === 'daftar' && (
                  <span className="text-[10px] text-[#7A5644] mt-0.5 block">
                    Use at least 8 characters.
                  </span>
                )}
              </div>
            )}

            {(authMode === 'otp' || authMode === 'reset') && (
              <div>
                <label className="block text-[#4A2A1C] font-semibold mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#B05A26]" />
                  <span>6-Digit OTP Code *</span>
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
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
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
                ? 'Processing...'
                : authMode === 'masuk'
                  ? 'Sign In to Account'
                  : authMode === 'daftar'
                    ? 'Create BabyShalls Account'
                    : authMode === 'otp'
                      ? 'Verify OTP'
                      : authMode === 'forgot'
                        ? 'Send Recovery Code'
                        : 'Save New Password'}
            </button>

            {authMode === 'otp' && (
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="text-[11px] font-medium text-[#B05A26] hover:underline cursor-pointer"
                >
                  Resend OTP code
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('masuk')}
                  className="text-[11px] text-[#7A5644] hover:underline cursor-pointer"
                >
                  Back to Sign In
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
                  &larr; Back to Sign In
                </button>
              </div>
            )}

            {(authMode === 'masuk' || authMode === 'daftar') && GOOGLE_CLIENT_ID && (
              <div className="pt-3 border-t border-[#F2E4D6] flex flex-col items-center gap-2.5">
                <span className="text-[11px] text-[#7A5644]">Or sign in with Google</span>
                <GoogleLogin
                  width='650px'
                  onSuccess={async (credentialResponse) => {
                    setErrorMsg('');
                    if (!credentialResponse.credential) {
                      setErrorMsg('Google token not available.');
                      return;
                    }
                    try {
                      const res = await googleAuthMutation.mutateAsync({
                        credential: credentialResponse.credential,
                      });
                      router.push(res.user?.role === 'ADMIN' ? '/admin' : redirectTo);
                    } catch (err: unknown) {
                      setErrorMsg(extractApiError(err, 'Failed to sign in with Google.'));
                    }
                  }}
                  onError={() => {
                    setErrorMsg('Google sign in cancelled or failed.');
                  }}
                />
              </div>
            )}

            <p className="text-[11px] text-[#7A5644] text-center pt-2 leading-relaxed">
              Don&apos;t have an account? Select <strong>Create Account</strong> above to register and continue.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
