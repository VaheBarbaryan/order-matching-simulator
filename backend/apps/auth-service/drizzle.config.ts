import { defineConfig } from 'drizzle-kit';
import path from 'path';
import * as dotenv from 'dotenv';

const serviceRoot = path.resolve(__dirname);

// Load .env from that service
dotenv.config({ path: path.join(serviceRoot, '.env') });

export default defineConfig({
  schema: path.join(serviceRoot, 'src/**/*.schema.ts'),
  out: path.join(serviceRoot, 'drizzle'),
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
