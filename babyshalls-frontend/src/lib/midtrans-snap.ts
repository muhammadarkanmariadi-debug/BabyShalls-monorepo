'use client';

export interface MidtransSnapCallbacks {
  onSuccess?: (result: unknown) => void;
  onPending?: (result: unknown) => void;
  onError?: (result: unknown) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    snap?: {
      pay: (snapToken: string, options?: MidtransSnapCallbacks) => void;
    };
  }
}

export function openMidtransSnap(
  snapToken?: string | null,
  redirectUrl?: string | null,
  callbacks?: MidtransSnapCallbacks
): 'snap' | 'redirect' | 'dev' | 'unavailable' {
  if (typeof window === 'undefined') return 'unavailable';

  if (snapToken && (snapToken.startsWith('snap-dev-') || snapToken.startsWith('snap-evt-dev-'))) {
    callbacks?.onPending?.({ status_message: 'Mode dev/placeholder Midtrans aktif' });
    return 'dev';
  }

  if (snapToken && window.snap && typeof window.snap.pay === 'function') {
    window.snap.pay(snapToken, {
      onSuccess: (res) => callbacks?.onSuccess?.(res),
      onPending: (res) => callbacks?.onPending?.(res),
      onError: (res) => callbacks?.onError?.(res),
      onClose: () => callbacks?.onClose?.(),
    });
    return 'snap';
  }

  if (redirectUrl) {
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    return 'redirect';
  }

  return 'unavailable';
}

