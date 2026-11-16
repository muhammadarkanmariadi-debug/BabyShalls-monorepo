export const SUPPORTED_COURIERS = [
    'wahana',
    'jne',
    'jnt',
    'sicepat',
    'pos',
    'anteraja',
];
export const COURIER_DISPLAY_NAMES = {
    wahana: 'Wahana Express',
    jne: 'JNE',
    jnt: 'J&T Express',
    sicepat: 'SiCepat',
    pos: 'POS Indonesia',
    anteraja: 'AnterAja',
};
export class ProviderRateLimitError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ProviderRateLimitError';
    }
}
export function normalizeCourierCode(raw) {
    const cleaned = raw.trim().toLowerCase();
    if (cleaned.includes('wahana'))
        return 'wahana';
    if (cleaned === 'jne')
        return 'jne';
    if (cleaned === 'jnt' || cleaned === 'j&t' || cleaned.includes('j&t'))
        return 'jnt';
    if (cleaned.includes('sicepat'))
        return 'sicepat';
    if (cleaned.includes('pos'))
        return 'pos';
    if (cleaned.includes('anteraja'))
        return 'anteraja';
    return null;
}
export function validateWaybillFormat(courier, waybillNumber) {
    const trimmed = waybillNumber.trim().toUpperCase();
    if (!trimmed) {
        return { valid: false, message: 'Nomor resi wajib diisi.' };
    }
    const code = normalizeCourierCode(courier);
    if (code === 'wahana') {
        if (!/^[A-Z0-9]{8,20}$/.test(trimmed)) {
            return {
                valid: false,
                message: 'Nomor resi Wahana Express harus minimal 8 karakter alfanumerik (tanpa spasi/simbol).',
            };
        }
        return { valid: true };
    }
    if (!/^[A-Z0-9-]{6,30}$/.test(trimmed)) {
        return { valid: false, message: 'Format nomor resi tidak valid (minimal 6 karakter).' };
    }
    return { valid: true };
}
