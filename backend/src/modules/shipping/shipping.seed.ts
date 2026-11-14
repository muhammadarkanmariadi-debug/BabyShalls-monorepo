import { prisma } from '../../lib/prisma.js';

export const DEFAULT_MALANG_ORIGIN_ID = process.env.MALANG_ORIGIN_RAJAONGKIR_ID || '46757';

const INITIAL_REGIONS = [
  // Origin Kota Malang (Locked Hub — ID Komerce V2)
  {
    provinceName: 'JAWA TIMUR',
    cityName: 'MALANG',
    districtName: 'LOWOKWARU',
    postalCode: '65141',
    rajaongkirId: '46757',
    binderbyteCode: 'malang-lowokwaru',
    searchLabel: 'LOWOKWARU, LOWOKWARU, MALANG, JAWA TIMUR, 65141',
    isOrigin: true,
  },
  {
    provinceName: 'Jawa Timur',
    cityName: 'Kota Malang',
    districtName: 'Klojen',
    postalCode: '65111',
    rajaongkirId: '255',
    binderbyteCode: 'malang-klojen',
    searchLabel: 'Klojen, Kota Malang, Jawa Timur',
    isOrigin: false,
  },
  {
    provinceName: 'Jawa Timur',
    cityName: 'Kota Malang',
    districtName: 'Blimbing',
    postalCode: '65126',
    rajaongkirId: '254',
    binderbyteCode: 'malang-blimbing',
    searchLabel: 'Blimbing, Kota Malang, Jawa Timur',
    isOrigin: false,
  },
  {
    provinceName: 'Jawa Timur',
    cityName: 'Kota Malang',
    districtName: 'Sukun',
    postalCode: '65147',
    rajaongkirId: '257',
    binderbyteCode: 'malang-sukun',
    searchLabel: 'Sukun, Kota Malang, Jawa Timur',
    isOrigin: false,
  },
  {
    provinceName: 'Jawa Timur',
    cityName: 'Kota Batu',
    districtName: 'Batu',
    postalCode: '65311',
    rajaongkirId: '51',
    binderbyteCode: 'batu',
    searchLabel: 'Batu, Kota Batu, Jawa Timur',
    isOrigin: false,
  },
  {
    provinceName: 'Jawa Timur',
    cityName: 'Kota Surabaya',
    districtName: 'Gubeng',
    postalCode: '60281',
    rajaongkirId: '444',
    binderbyteCode: 'surabaya-gubeng',
    searchLabel: 'Gubeng, Kota Surabaya, Jawa Timur',
    isOrigin: false,
  },
  {
    provinceName: 'Jawa Timur',
    cityName: 'Kota Surabaya',
    districtName: 'Tegalsari',
    postalCode: '60262',
    rajaongkirId: '445',
    binderbyteCode: 'surabaya-tegalsari',
    searchLabel: 'Tegalsari, Kota Surabaya, Jawa Timur',
    isOrigin: false,
  },
  {
    provinceName: 'Jawa Timur',
    cityName: 'Kabupaten Sidoarjo',
    districtName: 'Sidoarjo',
    postalCode: '61212',
    rajaongkirId: '409',
    binderbyteCode: 'sidoarjo',
    searchLabel: 'Sidoarjo, Kabupaten Sidoarjo, Jawa Timur',
    isOrigin: false,
  },
  {
    provinceName: 'DKI Jakarta',
    cityName: 'Kota Jakarta Selatan',
    districtName: 'Kebayoran Baru',
    postalCode: '12160',
    rajaongkirId: '153',
    binderbyteCode: 'jakarta-selatan',
    searchLabel: 'Kebayoran Baru, Kota Jakarta Selatan, DKI Jakarta',
    isOrigin: false,
  },
  {
    provinceName: 'DKI Jakarta',
    cityName: 'Kota Jakarta Pusat',
    districtName: 'Menteng',
    postalCode: '10310',
    rajaongkirId: '152',
    binderbyteCode: 'jakarta-pusat',
    searchLabel: 'Menteng, Kota Jakarta Pusat, DKI Jakarta',
    isOrigin: false,
  },
  {
    provinceName: 'Jawa Barat',
    cityName: 'Kota Bandung',
    districtName: 'Coblong',
    postalCode: '40132',
    rajaongkirId: '23',
    binderbyteCode: 'bandung-coblong',
    searchLabel: 'Coblong, Kota Bandung, Jawa Barat',
    isOrigin: false,
  },
  {
    provinceName: 'Jawa Tengah',
    cityName: 'Kota Semarang',
    districtName: 'Semarang Tengah',
    postalCode: '50132',
    rajaongkirId: '399',
    binderbyteCode: 'semarang-tengah',
    searchLabel: 'Semarang Tengah, Kota Semarang, Jawa Tengah',
    isOrigin: false,
  },
  {
    provinceName: 'DI Yogyakarta',
    cityName: 'Kota Yogyakarta',
    districtName: 'Gondokusuman',
    postalCode: '55224',
    rajaongkirId: '501',
    binderbyteCode: 'yogyakarta-gondokusuman',
    searchLabel: 'Gondokusuman, Kota Yogyakarta, DI Yogyakarta',
    isOrigin: false,
  },
  {
    provinceName: 'Bali',
    cityName: 'Kota Denpasar',
    districtName: 'Denpasar Selatan',
    postalCode: '80226',
    rajaongkirId: '114',
    binderbyteCode: 'denpasar-selatan',
    searchLabel: 'Denpasar Selatan, Kota Denpasar, Bali',
    isOrigin: false,
  },
  {
    provinceName: 'Sumatera Utara',
    cityName: 'Kota Medan',
    districtName: 'Medan Baru',
    postalCode: '20153',
    rajaongkirId: '278',
    binderbyteCode: 'medan-baru',
    searchLabel: 'Medan Baru, Kota Medan, Sumatera Utara',
    isOrigin: false,
  },
  {
    provinceName: 'Sulawesi Selatan',
    cityName: 'Kota Makassar',
    districtName: 'Panakkukang',
    postalCode: '90231',
    rajaongkirId: '2540',
    binderbyteCode: 'makassar-panakkukang',
    searchLabel: 'Panakkukang, Kota Makassar, Sulawesi Selatan',
    isOrigin: false,
  },
];

let seededOnce = false;

export async function ensureDefaultShippingRegions(): Promise<void> {
  if (seededOnce) return;
  const count = await prisma.shippingRegion.count();
  if (count === 0) {
    await prisma.shippingRegion.createMany({
      data: INITIAL_REGIONS,
      skipDuplicates: true,
    });
  } else {
    // Sinkronkan origin Malang jika masih memakai ID lama '256'
    await prisma.shippingRegion.updateMany({
      where: { isOrigin: true, rajaongkirId: '256' },
      data: {
        rajaongkirId: '46757',
        searchLabel: 'LOWOKWARU, LOWOKWARU, MALANG, JAWA TIMUR, 65141',
      },
    });
  }
  seededOnce = true;
}

