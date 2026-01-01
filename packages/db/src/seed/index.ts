import 'dotenv/config';
import { drizzle } from '@nerdfolio/drizzle-d1-proxy';
import { faker } from '@faker-js/faker';
import { FAKER_SEED, TEST_PASSWORD } from './constants';
import { resetDatabase } from './reset';
import { seedMedia } from './media';
import { seedCategories } from './categories';
import { seedGameVersions } from './gameVersions';
import { seedUsers } from './users';
import { seedMods } from './mods';
import { seedModVersions } from './modVersions';
import { seedModCategories } from './modCategories';
import { seedModVersionGameVersions } from './modVersionGameVersions';
import { seedModLikes } from './modLikes';
import { seedReports } from './reports';
import { relations, schema } from '..';

// Parse CLI flags
const hasResetFlag = process.argv.includes('--reset');

/**
 * Main seeding function
 */
async function main(): Promise<void> {
  const { ENVIRONMENT, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, CLOUDFLARE_D1_TOKEN }
    = process.env;

  if (!ENVIRONMENT) {
    throw new Error('Missing required environment variable: ENVIRONMENT');
  }

  if (ENVIRONMENT === 'production') {
    throw new Error('❌ PRODUCTION environment detected. Aborting to prevent data loss.');
  }

  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_DATABASE_ID || !CLOUDFLARE_D1_TOKEN) {
    throw new Error(
      'Missing Cloudflare credentials: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, CLOUDFLARE_D1_TOKEN',
    );
  }

  console.info('🌱 Starting database seeding...');
  console.info(`   Environment: ${ENVIRONMENT}`);
  console.info(`   Database ID: ${CLOUDFLARE_DATABASE_ID}`);
  console.info(`   Reset flag: ${hasResetFlag ? 'YES' : 'NO'}`);
  console.info(`   Faker seed: ${FAKER_SEED}`);
  console.info(`   Test password: ${TEST_PASSWORD}\n`);

  // Initialize Faker with seed for reproducible data
  faker.seed(FAKER_SEED);

  // Connect to remote D1 via HTTP API (same as drizzle.config.ts)
  const db = drizzle({
    accountId: CLOUDFLARE_ACCOUNT_ID,
    databaseId: CLOUDFLARE_DATABASE_ID,
    token: CLOUDFLARE_D1_TOKEN,
  }, { casing: 'snake_case', schema, relations });

  try {
    // Reset database if flag is set
    if (hasResetFlag) {
      await resetDatabase(db);
    }

    // Seed in dependency order
    const mediaIds = await seedMedia(db);
    const categoryIds = await seedCategories(db);
    const gameVersionIds = await seedGameVersions(db);
    const userIds = await seedUsers(db, mediaIds.slice(0, 20)); // Use first 20 (avatars)
    const modIds = await seedMods(db, userIds, mediaIds.slice(20, 40)); // Use next 20 (icons)
    const modVersionIds = await seedModVersions(db, modIds);

    await seedModCategories(db, modIds, categoryIds);
    await seedModVersionGameVersions(db, modVersionIds, gameVersionIds);
    await seedModLikes(db, modIds, userIds);
    await seedReports(db, modIds, userIds);

    console.info('\n✨ Database seeding completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  }
}

main();
