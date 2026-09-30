import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import pg from 'pg';

// Configuramos el pool de conexiones específicamente para Supabase
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Esto evita el bloqueo de SSL de Supabase
  },
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });