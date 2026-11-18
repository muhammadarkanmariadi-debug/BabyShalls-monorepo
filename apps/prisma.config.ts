import { config } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

// Load .env.local for local dev & fallback to .env if present
config({ path: '.env.local' });
config();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});

