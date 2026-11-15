import midtransClient from 'midtrans-client';

export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-sample',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-sample',
});

export const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-sample',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-sample',
});

