import { createDb as _createDb } from '@craftedtales/db';
import type { Database as _Database } from '@craftedtales/db';
import type { Bindings } from '../env';

// Re-export
export const createDb = (env: Bindings): Database => _createDb(getDbBinding(env));
export type Database = _Database;

/**
 * Get the appropriate database binding based on environment
 */
export function getDbBinding(env: Bindings): D1Database {
  return env.ENVIRONMENT === 'production'
    ? env.craftedtales_db
    : env.craftedtales_db_dev;
}

/**
 * Get the appropriate R2 bucket for mods based on environment
 */
export function getModsBucket(env: Bindings): R2Bucket {
  return env.ENVIRONMENT === 'production'
    ? env.craftedtales_mods
    : env.craftedtales_mods_dev;
}

/**
 * Get the appropriate R2 bucket for media based on environment
 */
export function getMediaBucket(env: Bindings): R2Bucket {
  return env.ENVIRONMENT === 'production'
    ? env.craftedtales_media
    : env.craftedtales_media_dev;
}

/**
 * Get the appropriate KV namespace for rate limiting based on environment
 */
export function getRateLimitKV(env: Bindings): KVNamespace {
  return env.ENVIRONMENT === 'production'
    ? env.craftedtales_rl
    : env.craftedtales_rl_dev;
}
