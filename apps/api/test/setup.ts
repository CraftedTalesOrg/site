import { env, applyD1Migrations } from 'cloudflare:test';

/**
 * Global test setup
 * Applies D1 migrations before all tests run
 */
await applyD1Migrations(env.craftedtales_db, env.TEST_MIGRATIONS);
