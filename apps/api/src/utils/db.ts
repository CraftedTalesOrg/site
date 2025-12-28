import { createDb as _createDb } from '@craftedtales/db';
import type { Database, DrizzleD1 } from '@craftedtales/db';
import type { Bindings } from '../env';

// Re-export
export const createDb = (env: Bindings): Database => _createDb(getDb(env));

/**
 * Get the appropriate database binding based on environment
 */
export function getDb(env: Bindings): DrizzleD1 {
  return env.craftedtales_db;
}

/**
 * Get the appropriate R2 bucket for mods based on environment
 */
export function getModsBucket(env: Bindings): R2Bucket {
  return env.craftedtales_mods;
}

/**
 * Get the appropriate R2 bucket for media based on environment
 */
export function getMediaBucket(env: Bindings): R2Bucket {
  return env.craftedtales_media;
}

/**
 * Get the appropriate KV namespace for rate limiting based on environment
 */
export function getRateLimitKV(env: Bindings): KVNamespace {
  return env.craftedtales_rl;
}
