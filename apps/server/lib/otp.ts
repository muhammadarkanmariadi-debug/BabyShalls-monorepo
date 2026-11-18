import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';
import { getCache, setCache, delCache } from './redis';

const OTP_TTL_SECONDS = 300;
const MAX_OTP_ATTEMPTS = 5;

function getOtpSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || 'babyshalls-otp-secret-2026';
  return new TextEncoder().encode(secret);
}

async function hashOtp(email: string, code: string): Promise<string> {
  const secretBytes = new Uint8Array(getOtpSecret()).buffer as ArrayBuffer;
  const key = await crypto.subtle.importKey(
    'raw',
    secretBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const payloadBytes = new Uint8Array(
    new TextEncoder().encode(`${email.toLowerCase().trim()}:${code}`)
  ).buffer as ArrayBuffer;
  const sig = await crypto.subtle.sign('HMAC', key, payloadBytes);
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateSixDigitCode(): string {
  const arr = crypto.getRandomValues(new Uint32Array(1));
  return String(100000 + (arr[0] % 900000));
}

export async function issueLoginOtp(userId: string, email: string): Promise<{
  code: string;
  expiresInSeconds: number;
}> {
  const normalizedEmail = email.toLowerCase().trim();
  const code = generateSixDigitCode();
  const codeHash = await hashOtp(normalizedEmail, code);
  const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000);

  await prisma.otpCode.updateMany({
    where: { email: normalizedEmail, usedAt: null },
    data: { usedAt: new Date() },
  });

  const record = await prisma.otpCode.create({
    data: {
      userId,
      email: normalizedEmail,
      codeHash,
      expiresAt,
    },
  });

  await setCache(
    `otp:login:${normalizedEmail}`,
    { id: record.id, codeHash, attempts: 0, expiresAt: expiresAt.toISOString() },
    OTP_TTL_SECONDS
  );

  return { code, expiresInSeconds: OTP_TTL_SECONDS };
}

export async function verifyLoginOtp(
  email: string,
  code: string
): Promise<{ valid: boolean; reason?: string; userId?: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  const submittedHash = await hashOtp(normalizedEmail, code.trim());

  const cached = await getCache<{
    id: string;
    codeHash: string;
    attempts: number;
    expiresAt: string;
  }>(`otp:login:${normalizedEmail}`);

  const dbOtp = await prisma.otpCode.findFirst({
    where: { email: normalizedEmail, usedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  if (!dbOtp) {
    return { valid: false, reason: 'Kode OTP tidak ditemukan atau sudah digunakan. Silakan minta kode baru.' };
  }

  if (dbOtp.expiresAt.getTime() < Date.now()) {
    await prisma.otpCode.update({
      where: { id: dbOtp.id },
      data: { usedAt: new Date() },
    });
    await delCache(`otp:login:${normalizedEmail}`);
    return { valid: false, reason: 'Kode OTP sudah kedaluwarsa. Silakan kirim ulang kode baru.' };
  }

  if (dbOtp.attempts >= MAX_OTP_ATTEMPTS || (cached && cached.attempts >= MAX_OTP_ATTEMPTS)) {
    return { valid: false, reason: 'Terlalu banyak percobaan OTP salah. Silakan kirim ulang kode OTP baru.' };
  }

  if (dbOtp.codeHash !== submittedHash) {
    const nextAttempts = dbOtp.attempts + 1;
    await prisma.otpCode.update({
      where: { id: dbOtp.id },
      data: { attempts: nextAttempts },
    });
    if (cached) {
      await setCache(
        `otp:login:${normalizedEmail}`,
        { ...cached, attempts: nextAttempts },
        OTP_TTL_SECONDS
      );
    }
    return {
      valid: false,
      reason: `Kode OTP salah. Sisa percobaan: ${Math.max(0, MAX_OTP_ATTEMPTS - nextAttempts)}.`,
    };
  }

  await prisma.otpCode.update({
    where: { id: dbOtp.id },
    data: { usedAt: new Date() },
  });
  await delCache(`otp:login:${normalizedEmail}`);

  return { valid: true, userId: dbOtp.userId };
}

export async function generateMagicLinkToken(email: string, otpCode: string): Promise<string> {
  return new SignJWT({
    email: email.toLowerCase().trim(),
    otp: otpCode,
    purpose: 'magic-login',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${OTP_TTL_SECONDS}s`)
    .sign(getOtpSecret());
}

export async function verifyMagicLinkToken(
  token: string
): Promise<{ valid: boolean; reason?: string; userId?: string }> {
  try {
    const { payload } = await jwtVerify(token, getOtpSecret());
    if (
      payload.purpose !== 'magic-login' ||
      typeof payload.email !== 'string' ||
      typeof payload.otp !== 'string'
    ) {
      return { valid: false, reason: 'Link verifikasi tidak valid.' };
    }
    return verifyLoginOtp(payload.email, payload.otp);
  } catch {
    return { valid: false, reason: 'Link verifikasi sudah kedaluwarsa atau tidak valid.' };
  }
}

