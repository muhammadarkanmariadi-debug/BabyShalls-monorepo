import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/server/generated/prisma/client';

function createPrismaClient(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL?.trim() ||
    'postgresql://postgres:postgres@localhost:5432/babyshalls_db';

  const pool = new Pool({
    connectionString,
    max: 10,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { __babyshallsPrisma?: PrismaClient };

export const prisma = globalForPrisma.__babyshallsPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__babyshallsPrisma = prisma;
}
