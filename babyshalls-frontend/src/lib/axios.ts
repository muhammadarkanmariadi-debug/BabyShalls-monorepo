import axios from 'axios';

export const ADMIN_TOKEN_STORAGE_KEY = 'babyshalls_admin_token';
export const USER_TOKEN_STORAGE_KEY = 'babyshalls_user_token';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token =
      window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ||
      window.localStorage.getItem(USER_TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

interface ApiErrorPayload {
  error?: string;
  message?: string;
  code?: string;
  fieldErrors?: Record<string, string>;
  details?: Array<{ field?: string; message?: string }>;
}

export function extractApiFieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError(error)) return {};
  const data = error.response?.data as ApiErrorPayload | undefined;
  if (data?.fieldErrors && typeof data.fieldErrors === 'object') {
    return data.fieldErrors;
  }
  if (Array.isArray(data?.details)) {
    const map: Record<string, string> = {};
    for (const item of data.details) {
      if (item.field && item.message && !map[item.field]) {
        map[item.field] = item.message;
      }
    }
    return map;
  }
  return {};
}

export function extractApiError(error: unknown, fallback = 'Terjadi kesalahan pada server.'): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return 'Koneksi ke server melebihi batas waktu. Silakan coba lagi.';
      }
      return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    }

    const data = error.response.data as ApiErrorPayload | undefined;
    if (data?.error && typeof data.error === 'string') {
      return data.error;
    }
    if (data?.message && typeof data.message === 'string') {
      return data.message;
    }
    if (Array.isArray(data?.details) && data.details[0]?.message) {
      return data.details[0].message;
    }

    const status = error.response.status;
    if (status === 401) return 'Sesi Anda telah berakhir. Silakan login kembali.';
    if (status === 403) return 'Anda tidak memiliki izin untuk melakukan aksi ini.';
    if (status === 404) return 'Data yang diminta tidak ditemukan.';
    if (status === 409) return 'Data sudah ada atau terjadi konflik data.';
    if (status === 413) return 'Ukuran file atau data yang dikirim terlalu besar.';
    if (status === 429) return 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.';
    if (status >= 500) return 'Terjadi gangguan pada server. Silakan coba lagi beberapa saat.';

    return error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
}

