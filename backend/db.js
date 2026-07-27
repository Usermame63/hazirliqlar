require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Verilənlər bazamıza Neon linki ilə qoşuluruq
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Prisma 7 standartına uyğun olaraq adapteri client-ə göndəririk
const prisma = new PrismaClient({ adapter });

module.exports = prisma;