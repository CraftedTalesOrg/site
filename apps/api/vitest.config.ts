import { D1Migration, defineWorkersConfig, readD1Migrations } from '@cloudflare/vitest-pool-workers/config';
import path from 'node:path';
import fs from 'node:fs/promises';

// Drizzle puts migrations in nested folders rather than all in the same directory, so we need to read them all
async function readAllD1Migrations(dir: string): Promise<D1Migration[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const migrations: D1Migration[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name);

      // Check if this directory contains migration.sql (indicating it's a migration folder)
      try {
        const migrationFiles = await fs.readdir(fullPath);

        if (migrationFiles.includes('migration.sql')) {
          // This is a migration directory, read it directly
          const dirMigrations = await readD1Migrations(fullPath);

          migrations.push(...dirMigrations);
        } else {
          // Not a migration directory, recurse deeper
          const nested = await readAllD1Migrations(fullPath);

          migrations.push(...nested);
        }
      } catch {
        // If we can't read the directory, skip it
        continue;
      }
    }
  }

  return migrations;
}

export default defineWorkersConfig(async () => {
  // Read D1 migrations from the db package
  const migrationsPath = path.join(__dirname, '../../packages/db/drizzle');
  const migrations = await readAllD1Migrations(migrationsPath);

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
