import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Node/Postgres client (non-Workers)
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/hytale_mods';
const client = postgres(connectionString);
export const db = drizzlePg(client);

// Cloudflare D1 client (Workers)
export const createDbFromD1 = async(d1: D1Database) => {
  const { drizzle } = await import('drizzle-orm/d1');

  return drizzle(d1);
};
