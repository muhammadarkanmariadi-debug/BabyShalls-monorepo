'use client';

import React, { useEffect, useRef, useState } from 'react';
import { UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthUser, useCurrentUser } from '../../hooks/useAuth';
import { ADMIN_TOKEN_STORAGE_KEY, USER_TOKEN_STORAGE_KEY } from '../../lib/axios';

interface AutoFillProfileButtonProps {
  onAutoFill: (user: AuthUser) => void;
  label?: string;
  autoFillOnLoad?: boolean;
}

export function AutoFillProfileButton({
  onAutoFill,
  label = 'Isi Otomatis dari Profil',
  autoFillOnLoad = false,
}: AutoFillProfileButtonProps) {
  const [hasToken, setHasToken] = useState(false);
  const autoFilledRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token =
        window.localStorage.getItem(USER_TOKEN_STORAGE_KEY) ||
        window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
      setHasToken(Boolean(token));
    }
  }, []);

  const { data: user } = useCurrentUser(hasToken);

  useEffect(() => {
    if (autoFillOnLoad && user && !autoFilledRef.current) {
      autoFilledRef.current = true;
      onAutoFill(user);
    }
  }, [autoFillOnLoad, user, onAutoFill]);

  if (!hasToken || !user) {
    return null;
  }

  const handleClick = () => {
    onAutoFill(user);
    toast.success('Data profil keluarga berhasil diisi otomatis!');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FDF0B8] hover:bg-[#f8e48e] border border-[#EBDCCB] text-[#502E1E] text-xs font-bold transition-colors cursor-pointer"
    >
      <UserCheck className="w-3.5 h-3.5 text-[#D9744A]" />
      <span>{label}</span>
    </button>
  );
}

