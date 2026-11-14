import { Router, Request, Response } from 'express';

export const authRouter = Router();

// Demo credentials
const ADMIN_ACCOUNTS = [
  {
    username: 'admin',
    email: 'admin@babyshalls.com',
    password: 'babyshalls2025',
    name: 'Maya Citraland (Head Curator)',
    role: 'curator' as const
  },
  {
    username: 'store',
    email: 'store@babyshalls.com',
    password: 'admin123',
    name: 'Admin Toko Malang',
    role: 'store_manager' as const
  }
];

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  const { identifier, email, username, password } = req.body;
  const loginKey = (identifier || email || username || '').trim().toLowerCase();
  const inputPassword = (password || '').trim();

  if (!loginKey || !inputPassword) {
    res.status(400).json({
      success: false,
      message: 'Email / Username dan Password wajib diisi'
    });
    return;
  }

  const user = ADMIN_ACCOUNTS.find(
    (acc) =>
      (acc.email.toLowerCase() === loginKey || acc.username.toLowerCase() === loginKey) &&
      acc.password === inputPassword
  );

  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Kredensial salah. Gunakan admin@babyshalls.com dengan password babyshalls2025'
    });
    return;
  }

  const token = `bs-jwt-${Buffer.from(`${user.email}:${Date.now()}`).toString('base64')}`;

  res.json({
    success: true,
    message: 'Login berhasil! Selamat datang di Panel Admin Babyshalls',
    data: {
      user: {
        id: `usr-${user.username}`,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }
  });
});

// GET /api/auth/me
authRouter.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer bs-jwt-')) {
    res.status(401).json({
      success: false,
      message: 'Token tidak valid atau belum login'
    });
    return;
  }

  res.json({
    success: true,
    data: {
      user: {
        id: 'usr-admin',
        name: 'Maya Citraland (Head Curator)',
        email: 'admin@babyshalls.com',
        role: 'curator'
      }
    }
  });
});

