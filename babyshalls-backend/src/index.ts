import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { productsRouter } from './routes/products.js';
import { ordersRouter } from './routes/orders.js';
import { workshopsRouter } from './routes/workshops.js';
import { authRouter } from './routes/auth.js';

dotenv.config();

const app = express();
const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001;

// CORS setup for Next.js frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001'
];

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/workshops', workshopsRouter);

// Health check & Info
app.get('/', (_req, res) => {
  res.json({
    name: 'Babyshalls REST API Server',
    description: "Boutique Children's Bookstore, Toys & Hampers (Malang, Indonesia)",
    status: 'online',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      orders: '/api/orders',
      workshops: '/api/workshops'
    }
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const server = app.listen(DEFAULT_PORT, () => {
  console.log(`✨ Babyshalls API Server running on http://localhost:${DEFAULT_PORT}`);
  console.log(`📦 Endpoints ready at http://localhost:${DEFAULT_PORT}/api/products`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    const fallbackPort = DEFAULT_PORT === 5000 ? 5001 : 5002;
    console.warn(`⚠️ Port ${DEFAULT_PORT} in use (common on macOS due to AirPlay). Retrying on http://localhost:${fallbackPort}...`);
    app.listen(fallbackPort, () => {
      console.log(`✨ Babyshalls API Server running on http://localhost:${fallbackPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
});
