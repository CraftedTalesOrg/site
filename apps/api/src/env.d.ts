/**
 * Bindings interface for Cloudflare Workers
 * Matches wrangler.json configuration
 */
export interface Bindings {
  // D1 Database bindings
  craftedtales_db_dev: D1Database;
  craftedtales_db: D1Database;

  // KV namespace bindings
  craftedtales_rl_dev: KVNamespace;
  craftedtales_rl: KVNamespace;

  // R2 bucket bindings
  craftedtales_mods_dev: R2Bucket;
  craftedtales_mods: R2Bucket;
  craftedtales_media_dev: R2Bucket;
  craftedtales_media: R2Bucket;

  // Environment variables from wrangler.json vars
  SWAGGER_ENABLED: string;
  API_VERSION_PREFIX: string;
  CORS_ORIGIN: string;
  SESSION_COOKIE_NAME: string;
  ENVIRONMENT: string;
  SESSION_SECRET: string;
}

/**
 * Hono environment type with Bindings
 * This is the structure expected by Hono<Env>
 */
export interface Env {
  Bindings: Bindings;
}
