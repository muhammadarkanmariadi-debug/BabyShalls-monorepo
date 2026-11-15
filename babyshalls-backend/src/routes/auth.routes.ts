import { Router, Request, Response } from 'express';
import { Role } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { OAuth2Client } from 'google-auth-library';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticateJWT, AuthRequest } from '../middleware/auth.middleware.js';
import { generateMagicLinkToken, issueLoginOtp, verifyLoginOtp, verifyMagicLinkToken } from '../lib/otp.js';
import { sendOtpEmail, sendPasswordResetEmail } from '../lib/mailer.js';
import {
  childAgeSchema,
  emailSchema,
  handleRouteError,
  optionalIndonesianPhoneSchema,
  sendValidationError,
} from '../lib/http-error.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'babyshalls-secret-jwt-key-2026-malang';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Terlalu banyak percobaan autentikasi. Silakan coba lagi dalam 15 menit.',
    code: 'RATE_LIMITED',
  },
});

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nama lengkap minimal 2 karakter.')
    .max(100, 'Nama lengkap maksimal 100 karakter.'),
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter.')
    .max(100, 'Password maksimal 100 karakter.')
    .refine((val) => val.trim().length >= 8, 'Password tidak boleh hanya berisi spasi.'),
  phone: optionalIndonesianPhoneSchema,
  parentName: z.string().trim().max(100, 'Nama orang tua maksimal 100 karakter.').optional().nullable(),
  childName: z.string().trim().max(100, 'Nama anak maksimal 100 karakter.').optional().nullable(),
  childAge: childAgeSchema.optional().nullable().or(z.literal('')),
  emailOptIn: z.boolean().optional().default(true),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password minimal 6 karakter.').max(100, 'Password maksimal 100 karakter.'),
});

const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: z.string().trim().regex(/^\d{6}$/, 'Kode OTP harus terdiri dari 6 digit angka.'),
});

const resendOtpSchema = z.object({
  email: emailSchema,
});

/**
 * POST /api/auth/register
 * Register a new customer account (always Role.USER) with Bcrypt 10 salt rounds.
 */
router.post('/register', authRateLimiter, async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data registrasi tidak valid.');
  }

  const normalizedEmail = parsed.data.email.toLowerCase().trim();

  try {
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Email ini sudah terdaftar. Silakan login.',
        code: 'VALIDATION_ERROR',
      });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: normalizedEmail,
        phone: parsed.data.phone ?? null,
        parentName: parsed.data.parentName?.trim() || parsed.data.name,
        childName: parsed.data.childName?.trim() || null,
        childAge: parsed.data.childAge?.trim() || null,
        emailOptIn: parsed.data.emailOptIn ?? true,
        passwordHash,
        role: Role.USER,
      },
    });

    const { code, expiresInSeconds } = await issueLoginOtp(user.id, user.email);
    const magicToken = generateMagicLinkToken(user.email, code);
    const magicLinkUrl = `${FRONTEND_URL}/account?magicToken=${encodeURIComponent(magicToken)}`;

    await sendOtpEmail({
      to: user.email,
      name: user.parentName || user.name,
      otpCode: code,
      expiresInMinutes: Math.round(expiresInSeconds / 60),
      magicLinkUrl,
    });

    return res.status(201).json({
      success: true,
      data: {
        requiresOtp: true,
        email: user.email,
        expiresInSeconds,
      },
      message: 'Akun dibuat! Link verifikasi & kode OTP 6 digit telah dikirim ke email Anda.',
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal melakukan registrasi.');
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and issue JWT token.
 */
router.post('/login', authRateLimiter, async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Input login tidak valid.');
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email atau password salah.',
        code: 'UNAUTHORIZED',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Email atau password salah.',
        code: 'UNAUTHORIZED',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          phone: user.phone,
          parentName: user.parentName,
          childName: user.childName,
          childAge: user.childAge,
          emailOptIn: user.emailOptIn,
          role: user.role,
        },
      },
      message: 'Login berhasil. Selamat datang kembali!',
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal melakukan proses login.');
  }
});

/**
 * POST /api/auth/verify-otp
 * Verify 6-digit login OTP and issue BabyShalls JWT.
 */
router.post('/verify-otp', authRateLimiter, async (req: Request, res: Response) => {
  const parsed = verifyOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Format OTP tidak valid.');
  }

  try {
    const result = await verifyLoginOtp(parsed.data.email, parsed.data.otp);
    if (!result.valid || !result.userId) {
      return res.status(401).json({
        success: false,
        error: result.reason || 'Kode OTP tidak valid.',
        code: 'UNAUTHORIZED',
      });
    }

    const user = await prisma.user.findUnique({ where: { id: result.userId } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Akun tidak ditemukan.',
        code: 'NOT_FOUND',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          phone: user.phone,
          parentName: user.parentName,
          childName: user.childName,
          childAge: user.childAge,
          emailOptIn: user.emailOptIn,
          role: user.role,
        },
      },
      message: 'Verifikasi OTP berhasil. Selamat datang!',
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memverifikasi kode OTP.');
  }
});

/**
 * POST /api/auth/resend-otp
 * Re-send a fresh 6-digit login OTP to user's email.
 */
router.post('/resend-otp', authRateLimiter, async (req: Request, res: Response) => {
  const parsed = resendOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Format email tidak valid.');
  }

  try {
    const normalizedEmail = parsed.data.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Email tidak terdaftar.',
        code: 'NOT_FOUND',
      });
    }

    const { code, expiresInSeconds } = await issueLoginOtp(user.id, user.email);
    const magicToken = generateMagicLinkToken(user.email, code);
    const magicLinkUrl = `${FRONTEND_URL}/account?magicToken=${encodeURIComponent(magicToken)}`;

    await sendOtpEmail({
      to: user.email,
      name: user.parentName || user.name,
      otpCode: code,
      expiresInMinutes: Math.round(expiresInSeconds / 60),
      magicLinkUrl,
    });

    return res.json({
      success: true,
      data: {
        email: user.email,
        expiresInSeconds,
      },
      message: 'Link verifikasi & kode OTP baru telah dikirim ke email Anda.',
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal mengirim ulang kode OTP.');
  }
});

const verifyMagicLinkSchema = z.object({
  token: z.string().min(10, 'Token verifikasi tidak valid.'),
});

/**
 * POST /api/auth/verify-magic-link
 * Verify 1-click magic link token from email and issue BabyShalls JWT.
 */
router.post('/verify-magic-link', authRateLimiter, async (req: Request, res: Response) => {
  const parsed = verifyMagicLinkSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Token tidak valid.');
  }

  try {
    const result = await verifyMagicLinkToken(parsed.data.token);
    if (!result.valid || !result.userId) {
      return res.status(401).json({
        success: false,
        error: result.reason || 'Link verifikasi sudah kedaluwarsa atau tidak valid.',
        code: 'UNAUTHORIZED',
      });
    }

    const user = await prisma.user.findUnique({ where: { id: result.userId } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Akun tidak ditemukan.',
        code: 'NOT_FOUND',
      });
    }

    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      data: {
        token: jwtToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          phone: user.phone,
          parentName: user.parentName,
          childName: user.childName,
          childAge: user.childAge,
          emailOptIn: user.emailOptIn,
          role: user.role,
        },
      },
      message: 'Verifikasi link berhasil. Selamat datang!',
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memverifikasi link login.');
  }
});

const googleAuthSchema = z
  .object({
    credential: z.string().min(10, 'Token Google tidak valid.').optional(),
    accessToken: z.string().min(10, 'Access token Google tidak valid.').optional(),
  })
  .refine((v) => Boolean(v.credential || v.accessToken), {
    message: 'Token Google wajib disertakan.',
  });

/**
 * POST /api/auth/google
 * Verify Google ID token or OAuth access token, find/create USER, and issue BabyShalls JWT.
 */
router.post('/google', authRateLimiter, async (req: Request, res: Response) => {
  if (!GOOGLE_CLIENT_ID) {
    return res.status(503).json({
      success: false,
      error: 'Google OAuth belum dikonfigurasi di server (GOOGLE_CLIENT_ID kosong).',
      code: 'INTERNAL_ERROR',
    });
  }

  const parsed = googleAuthSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Credential Google tidak valid.');
  }

  try {
    let googleEmail: string | undefined;
    let googleEmailVerified = false;
    let googleName: string | undefined;
    let googlePicture: string | undefined;

    if (parsed.data.credential) {
      const ticket = await googleClient.verifyIdToken({
        idToken: parsed.data.credential,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      googleEmail = payload?.email;
      googleEmailVerified = Boolean(payload?.email_verified);
      googleName = payload?.name;
      googlePicture = payload?.picture;
    } else if (parsed.data.accessToken) {
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${parsed.data.accessToken}` },
      });
      if (!userInfoRes.ok) {
        return res.status(401).json({
          success: false,
          error: 'Token Google tidak valid atau sudah kedaluwarsa.',
          code: 'UNAUTHORIZED',
        });
      }
      const info = (await userInfoRes.json()) as {
        email?: string;
        email_verified?: boolean;
        name?: string;
        picture?: string;
      };
      googleEmail = info.email;
      googleEmailVerified = Boolean(info.email_verified);
      googleName = info.name;
      googlePicture = info.picture;
    }

    if (!googleEmail || !googleEmailVerified) {
      return res.status(401).json({
        success: false,
        error: 'Akun Google tidak memiliki email terverifikasi.',
        code: 'UNAUTHORIZED',
      });
    }

    const normalizedEmail = googleEmail.toLowerCase().trim();
    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      const randomPasswordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: googleName || normalizedEmail.split('@')[0],
          avatarUrl: googlePicture || null,
          passwordHash: randomPasswordHash,
          role: Role.USER,
        },
      });
    } else if (!user.avatarUrl && googlePicture) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { avatarUrl: googlePicture },
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          phone: user.phone,
          parentName: user.parentName,
          childName: user.childName,
          childAge: user.childAge,
          emailOptIn: user.emailOptIn,
          role: user.role,
        },
      },
      message: 'Login Google berhasil.',
    });
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      error: err.message || 'Verifikasi Google Sign-In gagal.',
      code: 'UNAUTHORIZED',
    });
  }
});

/**
 * GET /api/auth/me
 * Return authenticated user profile.
 */
router.get('/me', authenticateJWT, async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Sesi tidak ditemukan.',
      code: 'UNAUTHORIZED',
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        phone: true,
        parentName: true,
        childName: true,
        childAge: true,
        emailOptIn: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Pengguna tidak ditemukan.',
        code: 'NOT_FOUND',
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat profil pengguna.');
  }
});

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

const resetPasswordSchema = z.object({
  email: emailSchema,
  otp: z.string().trim().regex(/^\d{6}$/, 'Kode verifikasi harus terdiri dari 6 digit angka.'),
  newPassword: z
    .string()
    .min(8, 'Password baru minimal 8 karakter.')
    .max(100, 'Password baru maksimal 100 karakter.')
    .refine((val) => val.trim().length >= 8, 'Password baru tidak boleh hanya berisi spasi.'),
});

/**
 * POST /api/auth/forgot-password
 * Send 6-digit OTP + reset password link to registered email.
 */
router.post('/forgot-password', authRateLimiter, async (req: Request, res: Response) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Format email tidak valid.');
  }

  const normalizedEmail = parsed.data.email;

  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Email belum terdaftar di BabyShalls.',
        code: 'NOT_FOUND',
      });
    }

    const { code, expiresInSeconds } = await issueLoginOtp(user.id, user.email);
    const resetLinkUrl = `${FRONTEND_URL}/account?resetEmail=${encodeURIComponent(user.email)}&resetCode=${code}`;

    await sendPasswordResetEmail({
      to: user.email,
      name: user.parentName || user.name,
      otpCode: code,
      expiresInMinutes: Math.round(expiresInSeconds / 60),
      resetLinkUrl,
    });

    return res.json({
      success: true,
      data: {
        email: user.email,
        expiresInSeconds,
      },
      message: 'Kode reset password 6 digit telah dikirim ke email Anda.',
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal mengirim email reset password.');
  }
});

/**
 * POST /api/auth/reset-password
 * Verify 6-digit OTP and set a new password.
 */
router.post('/reset-password', authRateLimiter, async (req: Request, res: Response) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, parsed.error, 'Data reset password tidak valid.');
  }

  try {
    const result = await verifyLoginOtp(parsed.data.email, parsed.data.otp);
    if (!result.valid || !result.userId) {
      return res.status(401).json({
        success: false,
        error: result.reason || 'Kode verifikasi tidak valid atau sudah kedaluwarsa.',
        code: 'UNAUTHORIZED',
      });
    }

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
    await prisma.user.update({
      where: { id: result.userId },
      data: { passwordHash },
    });

    return res.json({
      success: true,
      message: 'Password berhasil direset! Silakan masuk dengan password baru Anda.',
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal mereset password.');
  }
});

export default router;

