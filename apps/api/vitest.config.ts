import { defineWorkersConfig, readD1Migrations } from '@cloudflare/vitest-pool-workers/config';
import path from 'node:path';

export default defineWorkersConfig(async () => {
  // Read D1 migrations from the db package
  const migrationsPath = path.join(__dirname, '../../packages/db/drizzle');
  const migrations = await readD1Migrations(migrationsPath);

  return {
    test: {
      include: ['test/**/*.test.ts'],
      setupFiles: ['./test/setup.ts'],
      poolOptions: {
        workers: {
          wrangler: { configPath: './wrangler.json' },
          main: './src/index.ts',
          miniflare: {
            bindings: {
              TEST_MIGRATIONS: migrations,
            },
            // D1 database for testing (uses local SQLite)
            d1Databases: {
              craftedtales_db: 'test-db',
            },
            // KV namespace for rate limiting
            kvNamespaces: ['craftedtales_rl'],
            // R2 buckets for file storage
            r2Buckets: ['craftedtales_mods', 'craftedtales_media'],
          },
        },
      },
    },
  };
});
