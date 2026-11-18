import { SignJWT, jwtVerify } from 'jose';

export interface JwtUserPayload {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || 'babyshalls-dev-secret-change-me';
  return new TextEncoder().encode(secret);
}

export async function signJwt(
  payload: JwtUserPayload,
  expiresIn = '7d'
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecretKey());
}

export async function verifyJwt(token: string): Promise<JwtUserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.id === 'string' &&
      typeof payload.email === 'string' &&
      (payload.role === 'USER' || payload.role === 'ADMIN')
    ) {
      return {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };
    }
    return null;
  } catch {
    return null;
  }
}

