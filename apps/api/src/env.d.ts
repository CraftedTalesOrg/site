import type { JwtVariables } from 'hono/jwt';
import type { DrizzleD1 } from '@craftedtales/db';

/**
 * Bindings interface for Cloudflare Workers
 * Matches wrangler.json configuration
 */
export interface Bindings {
  // D1 Database bindings
  craftedtales_db: DrizzleD1;

  // KV namespace bindings
  craftedtales_rl: KVNamespace;

  // R2 bucket bindings
  craftedtales_mods: R2Bucket;
  craftedtales_media: R2Bucket;

  // Environment variables from wrangler.json vars
  API_VERSION_PREFIX: string;
  CORS_ORIGIN: string;
  ENVIRONMENT: string;
  JWT_SECRET: string;
}

export interface JwtPayload {
  userId: string;
  roles: string[];
};

export type Variables = JwtVariables<JwtPayload>;

/**
 * Hono environment type with Bindings
 * This is the structure expected by Hono<Env>
 */
export interface Env {
  Bindings: Bindings;
  Variables: Variables;
}
