import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma.js';
import { getCache, setCache, delCache } from './redis.js';

const OTP_SECRET = process.env.JWT_SECRET || 'babyshalls-otp-secret-2026';
const OTP_TTL_SECONDS = 300; // 5 menit
const MAX_OTP_ATTEMPTS = 5;

function hashOtp(email: string, code: string): string {
  return crypto
    .createHmac('sha256', OTP_SECRET)
    .update(`${email.toLowerCase().trim()}:${code}`)
    .digest('hex');
}

export async function issueLoginOtp(userId: string, email: string): Promise<{
  code: string;
  expiresInSeconds: number;
}> {
  const normalizedEmail = email.toLowerCase().trim();
  const code = crypto.randomInt(100000, 1000000).toString();
  const codeHash = hashOtp(normalizedEmail, code);
  const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000);

  // Invalidate previous unused OTPs for this email
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

  // Also cache in Redis for fast verification when Redis is available
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
  const submittedHash = hashOtp(normalizedEmail, code.trim());

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

  const activeRecord = dbOtp
    ? {
        id: dbOtp.id,
        userId: dbOtp.userId,
        codeHash: dbOtp.codeHash,
        attempts: dbOtp.attempts,
        expiresAt: dbOtp.expiresAt,
      }
    : null;

  if (!activeRecord) {
    return { valid: false, reason: 'Kode OTP tidak ditemukan atau sudah digunakan. Silakan minta kode baru.' };
  }

  if (activeRecord.expiresAt.getTime() < Date.now()) {
    await prisma.otpCode.update({
      where: { id: activeRecord.id },
      data: { usedAt: new Date() },
    });
    await delCache(`otp:login:${normalizedEmail}`);
    return { valid: false, reason: 'Kode OTP sudah kedaluwarsa. Silakan kirim ulang kode baru.' };
  }

  if (activeRecord.attempts >= MAX_OTP_ATTEMPTS || (cached && cached.attempts >= MAX_OTP_ATTEMPTS)) {
    return { valid: false, reason: 'Terlalu banyak percobaan OTP salah. Silakan kirim ulang kode OTP baru.' };
  }

  if (activeRecord.codeHash !== submittedHash) {
    const nextAttempts = activeRecord.attempts + 1;
    await prisma.otpCode.update({
      where: { id: activeRecord.id },
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
    where: { id: activeRecord.id },
    data: { usedAt: new Date() },
  });
  await delCache(`otp:login:${normalizedEmail}`);

  return { valid: true, userId: activeRecord.userId };
}

export function generateMagicLinkToken(email: string, otpCode: string): string {
  return jwt.sign(
    {
      email: email.toLowerCase().trim(),
      otp: otpCode,
      purpose: 'magic-login',
    },
    OTP_SECRET,
    { expiresIn: OTP_TTL_SECONDS }
  );
}

export async function verifyMagicLinkToken(
  token: string
): Promise<{ valid: boolean; reason?: string; userId?: string }> {
  try {
    const decoded = jwt.verify(token, OTP_SECRET) as {
      email?: string;
      otp?: string;
      purpose?: string;
    };

    if (decoded.purpose !== 'magic-login' || !decoded.email || !decoded.otp) {
      return { valid: false, reason: 'Link verifikasi tidak valid.' };
    }

    return verifyLoginOtp(decoded.email, decoded.otp);
  } catch {
    return { valid: false, reason: 'Link verifikasi sudah kedaluwarsa atau tidak valid.' };
  }
}
