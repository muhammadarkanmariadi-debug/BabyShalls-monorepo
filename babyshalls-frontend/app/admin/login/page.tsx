'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { ADMIN_TOKEN_STORAGE_KEY, USER_TOKEN_STORAGE_KEY, apiClient } from '@/lib/axios';

/**
 * Admin Login Page — Exact Match with Figma Node #218:4683
 * Centered Card (440px), Logo (62x56), Poppins Medium H2 32px,
 * Terracotta #B05A26 Submit Button, Clean Minimalist Design.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@babyshalls.com');
  const [password, setPassword] = useState('babyshalls2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fillDemoAccount = (role: 'admin' | 'curator') => {
    if (role === 'admin') {
      setEmail('admin@babyshalls.com');
      setPassword('babyshalls2026');
    } else {
      setEmail('curator@babyshalls.com');
      setPassword('curator123');
    }
    setErrorMessage('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // 1. Try real backend API
      try {
        const response = await apiClient.post('/auth/login', { email, password });
        if (response.data?.success && response.data?.data) {
          const authData = response.data.data;
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, authData.token);
            window.localStorage.setItem('babyshalls_admin_user', JSON.stringify(authData.user));
            window.dispatchEvent(new Event('babyshalls-auth-changed'));
          }
          router.push('/admin');
          return;
        }
      } catch (apiErr: any) {
        if (apiErr?.response?.data?.error || apiErr?.response?.data?.message) {
          setErrorMessage(apiErr.response.data.error || apiErr.response.data.message);
          setIsLoading(false);
          return;
        }
      }

      // 2. Fallback offline development authentication
      if (
        (email === 'admin@babyshalls.com' && (password === 'babyshalls2026' || password === 'babyshalls2025')) ||
        (email === 'curator@babyshalls.com' && password === 'curator123')
      ) {
        const mockAdmin = {
          id: 'admin-1',
          name: email.includes('admin') ? 'Superadmin BabyShalls' : 'Kurator Utama',
          email,
          role: 'ADMIN',
        };
        const mockToken = `mock-admin-token-${Date.now()}`;

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, mockToken);
          window.localStorage.setItem('babyshalls_admin_user', JSON.stringify(mockAdmin));
          window.dispatchEvent(new Event('babyshalls-auth-changed'));
        }

        setTimeout(() => {
          router.push('/admin');
        }, 400);
      } else {
        setErrorMessage('Email atau kata sandi admin tidak sesuai.');
        setIsLoading(false);
      }
    } catch {
      setErrorMessage('Terjadi kendala saat login. Silakan coba lagi.');
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
          <span>Kembali ke Toko</span>
        </Link>
      </div>

      {/* Main Centered Login Card (Figma Node #218:4684: 440px width, 40px padding, 16px gap) */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[440px] bg-white border border-[#E6D2C0] rounded-[4px] p-8 sm:p-10 shadow-sm flex flex-col gap-4">
          
          {/* Brand Logo (Figma #218:4703: width 62.22, height 56) */}
          <div className="relative w-[62px] h-[56px] mb-1">
            <Image
              src="/BabyShallsLogo 1.PNG"
              alt="Baby Shall's"
              fill
              priority
              className="object-contain object-left"
            />
          </div>

          {/* Heading H2 (Figma #218:4687: Poppins Medium 32px, text #4A2A1C) */}
          <h1 className="text-[28px] sm:text-[32px] font-medium text-[#4A2A1C] leading-[1.25] tracking-[-0.005em]">
            Masuk Admin
          </h1>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 bg-[#FDF2F2] border border-[#F8B4B4] rounded-[4px] text-xs text-[#C0392B] flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Input Email (Figma #218:4688) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#4A2A1C]">
                Email
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@babyshalls.com"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D2C0] rounded-[4px] text-[14px] text-[#4A2A1C] placeholder-[#C9B3A5] focus:outline-none focus:border-[#B05A26] transition-colors"
                />
              </div>
            </div>

            {/* Input Kata Sandi (Figma #218:4692) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#4A2A1C]">
                Kata sandi
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

            {/* Tombol Masuk (Figma #218:4697: bg #B05A26, text white, rounded 2px, Poppins Medium 16px) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-5 bg-[#B05A26] hover:bg-[#8E431A] text-white text-[16px] font-medium rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>

          {/* Caption (Figma #218:4699: text #7A5644, 13px) */}
          <p className="text-[13px] text-[#7A5644] text-center mt-1">
            Hanya untuk akun dengan peran Admin.
          </p>

          {/* Quick Demo Helper */}
          <div className="pt-3 border-t border-[#F2E4D6] flex items-center justify-center gap-2">
            <span className="text-[11px] text-[#C9B3A5]">Akun Demo:</span>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="text-[11px] font-medium text-[#B05A26] hover:underline"
            >
              Superadmin
            </button>
            <span className="text-[11px] text-[#C9B3A5]">·</span>
            <button
              type="button"
              onClick={() => fillDemoAccount('curator')}
              className="text-[11px] font-medium text-[#B05A26] hover:underline"
            >
              Kurator
            </button>
          </div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="p-6 text-center text-xs text-[#C9B3A5]">
        &copy; {new Date().getFullYear()} BabyShalls Malang · Sistem Administrasi
      </footer>
    </div>
  );
}
