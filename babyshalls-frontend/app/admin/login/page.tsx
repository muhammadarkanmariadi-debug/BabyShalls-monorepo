'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowLeft, Check, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fillDemoAccount = (role: 'curator' | 'store') => {
    if (role === 'curator') {
      setIdentifier('admin@babyshalls.com');
      setPassword('babyshalls2025');
    } else {
      setIdentifier('store@babyshalls.com');
      setPassword('admin123');
    }
    setErrorMessage('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      let success = false;
      let userData = null;

      try {
        const res = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
        });
        const data = await res.json();
        if (data.success && data.data) {
          success = true;
          userData = data.data;
        } else {
          setErrorMessage(data.message || 'Invalid credentials');
        }
      } catch {
        // Fallback local mock authentication
        const validUsers = [
          {
            email: 'admin@babyshalls.com',
            user: 'admin',
            pass: 'babyshalls2025',
            name: 'Head Curator',
            role: 'curator'
          },
          {
            email: 'store@babyshalls.com',
            user: 'store',
            pass: 'admin123',
            name: 'Store Manager (Malang)',
            role: 'store_manager'
          }
        ];

        const match = validUsers.find(
          (u) =>
            (u.email.toLowerCase() === identifier.trim().toLowerCase() ||
              u.user.toLowerCase() === identifier.trim().toLowerCase()) &&
            u.pass === password.trim()
        );

        if (match) {
          success = true;
          userData = {
            user: {
              id: `usr-${match.user}`,
              name: match.name,
              email: match.email,
              role: match.role
            },
            token: `bs-demo-${Date.now()}`
          };
        } else {
          setErrorMessage('Invalid login. Please use the demo accounts below.');
        }
      }

      if (success && userData) {
        localStorage.setItem('babyshalls_admin_user', JSON.stringify(userData.user));
        localStorage.setItem('babyshalls_admin_token', userData.token);
        setSuccessMessage('Login successful. Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/admin');
        }, 600);
      }
    } catch {
      setErrorMessage('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col justify-between">
      {/* Top minimal bar */}
      <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#666666] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          <span>Return to Store</span>
        </Link>
        <span className="text-xs uppercase tracking-widest text-[#666666]">
          BabyShalls Curator Portal
        </span>
      </div>

      {/* Center login box */}
      <div className="max-w-md w-full mx-auto px-4 py-16">
        <div className="border border-[#E5E5E5] p-8 md:p-10 space-y-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#111111]">
              Admin Sign In
            </h1>
            <p className="text-xs text-[#666666] mt-1">
              Access catalog management, inventory levels, and orders.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 border border-red-500 bg-red-50/50 text-red-900 text-xs flex items-center gap-2">
              <AlertCircle size={15} strokeWidth={1.5} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 border border-neutral-900 bg-neutral-50 text-neutral-900 text-xs flex items-center gap-2">
              <Check size={15} strokeWidth={1.5} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-[#111111] mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <Mail size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                <input
                  type="text"
                  required
                  placeholder="admin@babyshalls.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E5] rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-[#111111] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E5] rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#111111] hover:bg-neutral-800 text-white text-xs uppercase tracking-wider font-medium rounded-none transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* 1-Click Demo Accounts */}
          <div className="pt-6 border-t border-[#E5E5E5] space-y-3">
            <p className="text-[11px] uppercase tracking-wider text-[#666666] text-center font-medium">
              Demo 1-Click Fill
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemoAccount('curator')}
                className="py-2 px-3 border border-[#E5E5E5] hover:border-[#111111] text-[#111111] text-xs transition-colors rounded-none"
              >
                Head Curator
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('store')}
                className="py-2 px-3 border border-[#E5E5E5] hover:border-[#111111] text-[#111111] text-xs transition-colors rounded-none"
              >
                Store Manager
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="p-6 border-t border-[#E5E5E5] text-center text-xs text-[#666666]">
        BabyShalls Bookstore Admin • Citraland Puncak Tidar HH-26, Malang
      </div>
    </div>
  );
}
