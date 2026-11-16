import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'babyshalls-secret-jwt-key-2026-malang';
export function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token otentikasi tidak ditemukan.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ error: 'Sesi login tidak valid atau kadaluarsa.' });
    }
}
export function optionalAuthenticateJWT(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
    }
    catch {
        // Abaikan token tidak valid pada endpoint publik opsional
    }
    return next();
}
export function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Akses khusus Admin BabyShalls.' });
    }
    next();
}
