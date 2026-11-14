'use client';

import React from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { AuthUser, useGoogleAuth } from '../../hooks/useAuth';
import { extractApiError } from '../../lib/axios';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

function GoogleSignInInner({ onSuccess }: { onSuccess: (user?: AuthUser) => void }) {
  const googleAuthMutation = useGoogleAuth();

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (!tokenResponse.access_token) {
        toast.error('Token Google tidak ditemukan.');
        return;
      }
      try {
        const res = await googleAuthMutation.mutateAsync({
          accessToken: tokenResponse.access_token,
        });
        toast.success('Login dengan Google berhasil!');
        onSuccess(res.user);
      } catch (err) {
        toast.error(extractApiError(err, 'Gagal login dengan Google.'));
      }
    },
    onError: () => {
      toast.error('Login Google dibatalkan atau gagal.');
    },
  });

  return (
    <button
      type="button"
      disabled={googleAuthMutation.isPending}
      onClick={() => triggerGoogleLogin()}
      className="w-full min-h-[46px] px-4 rounded-full border border-[#EBDCCB] bg-white hover:bg-[#FCF6EC] disabled:opacity-60 text-[#3D2F28] text-sm font-semibold flex items-center justify-center gap-3 transition-colors cursor-pointer"
    >
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
        />
      </svg>
      <span>{googleAuthMutation.isPending ? 'Menghubungkan ke Google...' : 'Continue with Google'}</span>
    </button>
  );
}

export function GoogleAuthButton({ onSuccess }: { onSuccess: (user?: AuthUser) => void }) {
  if (!GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        disabled
        title="Tambahkan NEXT_PUBLIC_GOOGLE_CLIENT_ID di frontend/.env.local untuk mengaktifkan Google Sign-In"
        className="w-full min-h-[46px] px-4 rounded-full border border-[#E5E7EB] bg-[#F8FAFC] text-[#9CA3AF] text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed"
      >
        <span>Masuk dengan Google (Perlu NEXT_PUBLIC_GOOGLE_CLIENT_ID)</span>
      </button>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleSignInInner onSuccess={onSuccess} />
    </GoogleOAuthProvider>
  );
}
