'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ADMIN_TOKEN_STORAGE_KEY, apiClient, USER_TOKEN_STORAGE_KEY } from '../lib/axios';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  phone?: string | null;
  parentName?: string | null;
  childName?: string | null;
  childAge?: string | null;
  emailOptIn?: boolean;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface OtpChallengeResponse {
  requiresOtp: boolean;
  email: string;
  expiresInSeconds: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  parentName?: string;
  childName?: string;
  childAge?: string;
  emailOptIn?: boolean;
}

export function useCurrentUser(enabled: boolean) {
  return useQuery<AuthUser>({
    queryKey: ['current-user'],
    enabled,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: AuthUser }>('/auth/me');
      return response.data.data;
    },
  });
}

function persistAuthSession(data: AuthResponse) {
  if (typeof window === 'undefined') return;
  if (data.user.role === 'ADMIN') {
    window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, data.token);
    window.localStorage.removeItem(USER_TOKEN_STORAGE_KEY);
  } else {
    window.localStorage.setItem(USER_TOKEN_STORAGE_KEY, data.token);
    window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  }
  window.dispatchEvent(new Event('babyshalls-auth-changed'));
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, unknown, LoginPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/login', payload);
      const data = response.data.data;
      persistAuthSession(data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['current-user'], data.user);
    },
  });
}

export function useVerifyOtp() {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, unknown, VerifyOtpPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/verify-otp', payload);
      const data = response.data.data;
      persistAuthSession(data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['current-user'], data.user);
    },
  });
}

export function useResendOtp() {
  return useMutation<{ email: string; expiresInSeconds: number }, unknown, { email: string }>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<{
        success: boolean;
        data: { email: string; expiresInSeconds: number };
      }>('/auth/resend-otp', payload);
      return response.data.data;
    },
  });
}

export function useVerifyMagicLink() {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, unknown, { token: string }>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<{ success: boolean; data: AuthResponse }>(
        '/auth/verify-magic-link',
        payload
      );
      const data = response.data.data;
      persistAuthSession(data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['current-user'], data.user);
    },
  });
}

export function useGoogleAuth() {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, unknown, { credential?: string; accessToken?: string }>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/google', payload);
      const data = response.data.data;
      persistAuthSession(data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['current-user'], data.user);
    },
  });
}

export function useRegister() {
  return useMutation<OtpChallengeResponse, unknown, RegisterPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<{ success: boolean; data: OtpChallengeResponse }>('/auth/register', payload);
      return response.data.data;
    },
  });
}

export function useForgotPassword() {
  return useMutation<{ email: string; expiresInSeconds: number }, unknown, { email: string }>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<{
        success: boolean;
        data: { email: string; expiresInSeconds: number };
      }>('/auth/forgot-password', payload);
      return response.data.data;
    },
  });
}

export function useResetPassword() {
  return useMutation<void, unknown, { email: string; otp: string; newPassword: string }>({
    mutationFn: async (payload) => {
      await apiClient.post('/auth/reset-password', payload);
    },
  });
}

