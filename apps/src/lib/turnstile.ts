/**
 * Verify a Cloudflare Turnstile token on the server.
 * Gracefully passes in local development when TURNSTILE_SECRET_KEY is not configured.
 */
export async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secretKey) {
    // Allow local development without Turnstile keys configured
    return { success: true };
  }

  if (!token) {
    return { success: false, error: 'Verifikasi keamanan (Turnstile) wajib diselesaikan.' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (!data.success) {
      return {
        success: false,
        error: 'Verifikasi keamanan gagal atau kedaluwarsa. Silakan muat ulang.',
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Gagal memverifikasi keamanan Cloudflare Turnstile.' };
  }
}

