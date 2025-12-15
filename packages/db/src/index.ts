import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { relations } from './schema/relations';

// ============================================================================
// Database Client for Cloudflare D1
// ============================================================================

/**
 * Create a Drizzle database client from a Cloudflare D1 binding
 * @param d1 - The D1Database binding from Cloudflare Workers
 * @returns Drizzle database client with schema
 *
 * @example
 * ```ts
 * // In your Cloudflare Worker
 * import { createDb } from '@craftedtales/db';
 *
 * export default {
 *   async fetch(request: Request, env: Env) {
 *     const db = createDb(env.craftedtales_db_dev);
 *
 *     // Query with relations
 *     const usersWithMods = await db.query.users.findMany({
 *       with: {
 *         ownedMods: true,
 *         modLikes: true,
 *       },
 *     });
 *
 *     return Response.json(usersWithMods);
 *   }
 * }
 * ```
 */
export function createDb(d1: DrizzleD1Database): DrizzleD1Database {
  return drizzle(d1, { relations });
}

// Export type helper for the database client
export type Database = ReturnType<typeof createDb>;
