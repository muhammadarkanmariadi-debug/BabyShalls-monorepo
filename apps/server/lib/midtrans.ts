/**
 * Native fetch Midtrans Snap & Core API client for Cloudflare Workers.
 */

function getMidtransConfig() {
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
  const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-sample';
  const snapBaseUrl = isProduction
    ? 'https://app.midtrans.com/snap/v1'
    : 'https://app.sandbox.midtrans.com/snap/v1';
  const coreBaseUrl = isProduction
    ? 'https://api.midtrans.com/v2'
    : 'https://api.sandbox.midtrans.com/v2';

  const authHeader = `Basic ${btoa(`${serverKey}:`)}`;
  return { serverKey, snapBaseUrl, coreBaseUrl, authHeader };
}

export async function createMidtransSnapTransaction(
  payload: Record<string, unknown>
): Promise<{ token: string; redirect_url: string }> {
  const { snapBaseUrl, authHeader } = getMidtransConfig();
  const res = await fetch(`${snapBaseUrl}/transactions`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Midtrans Snap error (${res.status}): ${errBody}`);
  }

  return (await res.json()) as { token: string; redirect_url: string };
}

export async function getMidtransTransactionStatus(
  orderId: string
): Promise<Record<string, unknown>> {
  const { coreBaseUrl, authHeader } = getMidtransConfig();
  const res = await fetch(`${coreBaseUrl}/${encodeURIComponent(orderId)}/status`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: authHeader,
    },
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Midtrans status error (${res.status}): ${errBody}`);
  }

  return (await res.json()) as Record<string, unknown>;
}

export async function verifyMidtransSignature(params: {
  orderId: string;
  statusCode: string;
  grossAmount: string;
  signatureKey: string;
}): Promise<boolean> {
  const { serverKey } = getMidtransConfig();
  const raw = `${params.orderId}${params.statusCode}${params.grossAmount}${serverKey}`;
  const digest = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(raw));
  const expectedHex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return expectedHex === params.signatureKey;
}

