import { defineConfig } from '@prisma/config';
import { config } from 'dotenv';

// .env faylındakı gizli linki məcburi oxuyub gətiririk
config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});