import dotenv from 'dotenv';
import { prisma } from '../../lib/prisma.js';
import { RajaOngkirV2Provider } from './providers/rajaongkir-v2.provider.js';

dotenv.config();

const MAJOR_CITIES = [
  'malang',
  'batu',
  'surabaya',
  'sidoarjo',
  'gresik',
  'kediri',
  'jember',
  'banyuwangi',
  'pasuruan',
  'mojokerto',
  'jakarta selatan',
  'jakarta pusat',
  'jakarta barat',
  'jakarta timur',
  'jakarta utara',
  'bekasi',
  'depok',
  'tangerang',
  'bogor',
  'bandung',
  'cimahi',
  'cirebon',
  'semarang',
  'surakarta',
  'yogyakarta',
  'sleman',
  'bantul',
  'denpasar',
  'badung',
  'medan',
  'palembang',
  'lampung',
  'pekanbaru',
  'batam',
  'padang',
  'makassar',
  'balikpapan',
  'samarinda',
  'banjarmasin',
  'pontianak',
  'manado',
  'mataram',
];

async function main() {
  const rawKeys = process.env.RAJAONGKIR_V2_API_KEYS || process.env.RAJAONGKIR_V2_API_KEY || '';
  const apiKey = rawKeys.split(',')[0]?.trim();
  if (!apiKey) {
    console.error('❌ RAJAONGKIR_V2_API_KEYS belum diatur di backend/.env');
    process.exit(1);
  }

  const provider = new RajaOngkirV2Provider();
  let totalInserted = 0;

  // Bersihkan data ID lama V1 yang bukan origin jika belum valid
  await prisma.shippingRegion.deleteMany({
    where: { isOrigin: false, rajaongkirId: { in: ['254', '255', '256', '257', '51', '444', '445', '409', '153', '152', '23', '399', '501', '114', '278', '2540'] } },
  });

  for (const city of MAJOR_CITIES) {
    try {
      const items = await provider.searchDestinations(city, apiKey, 100);
      if (items.length > 0) {
        const res = await prisma.shippingRegion.createMany({
          data: items.map((d) => ({
            rajaongkirId: d.rajaongkirId,
            provinceName: d.provinceName,
            cityName: d.cityName,
            districtName: d.districtName,
            postalCode: d.postalCode,
            searchLabel: d.searchLabel,
            binderbyteCode: [d.cityName, d.districtName].filter(Boolean).join('-').toLowerCase(),
            isOrigin: d.rajaongkirId === '46757',
          })),
          skipDuplicates: true,
        });
        totalInserted += res.count;
        console.log(`✓ ${city}: fetched ${items.length}, inserted ${res.count}`);
      }
    } catch (err) {
      console.warn(`⚠ Gagal fetch ${city}:`, err instanceof Error ? err.message : err);
    }
  }

  const totalDb = await prisma.shippingRegion.count();
  console.log(`\n🎉 Selesai! Baru masuk: ${totalInserted} wilayah. Total di PostgreSQL: ${totalDb} wilayah.`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});

