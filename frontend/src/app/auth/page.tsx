'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AccountAuthGate } from '../../components/account/AccountAuthGate';
import { AuthUser, useCurrentUser } from '../../hooks/useAuth';
import { ADMIN_TOKEN_STORAGE_KEY, USER_TOKEN_STORAGE_KEY } from '../../lib/axios';

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const hasToken =
    typeof window !== 'undefined' &&
    Boolean(
      window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ||
      window.localStorage.getItem(USER_TOKEN_STORAGE_KEY)
    );

  const { data: currentUser } = useCurrentUser(hasToken);

  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === 'ADMIN') {
      router.replace('/admin');
    } else {
      router.replace(redirectParam && !redirectParam.startsWith('/admin') ? redirectParam : '/account');
    }
  }, [currentUser, redirectParam, router]);

  const handleAuthenticated = (user?: AuthUser) => {
    if (user?.role === 'ADMIN') {
      router.replace('/admin');
      return;
    }
    router.replace(redirectParam && !redirectParam.startsWith('/admin') ? redirectParam : '/account');
  };

  return <AccountAuthGate onAuthenticated={handleAuthenticated} />;
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-[#FFF8EF]" />}>
      <AuthPageContent />
    </Suspense>
  );
}

