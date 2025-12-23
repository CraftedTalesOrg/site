import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import { relations, schema } from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// Database Client for Cloudflare D1
// ─────────────────────────────────────────────────────────────────────────────
export * from './schema';

/**
 * Create a Drizzle database client from a Cloudflare D1 binding
 * @param d1 - The D1Database binding from Cloudflare Workers
 * @returns Drizzle database client with relations for db.query API
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createDb(d1: D1Database) {
  return drizzle(d1, { schema, relations });
}

export type Database = ReturnType<typeof createDb>;
