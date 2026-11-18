import type { Context, Next } from 'hono';
import { verifyJwt, type JwtUserPayload } from '../lib/jwt';

export type AuthVariables = {
  user: JwtUserPayload;
};

export async function requireAuth(c: Context<{ Variables: AuthVariables }>, next: Next) {
  const authHeader = c.req.header('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      { success: false, error: 'Akses ditolak. Token otentikasi tidak ditemukan.', code: 'UNAUTHORIZED' },
      401
    );
  }

  const token = authHeader.slice(7).trim();
  const payload = await verifyJwt(token);
  if (!payload) {
    return c.json(
      { success: false, error: 'Token tidak valid atau sudah kedaluwarsa.', code: 'UNAUTHORIZED' },
      401
    );
  }

  c.set('user', payload);
  await next();
}

export async function requireAdmin(c: Context<{ Variables: AuthVariables }>, next: Next) {
  const user = c.get('user');
  if (!user || user.role !== 'ADMIN') {
    return c.json(
      { success: false, error: 'Akses ditolak. Hanya Admin yang diizinkan.', code: 'FORBIDDEN' },
      403
    );
  }
  await next();
}

