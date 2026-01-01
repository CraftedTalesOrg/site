import { schema } from '../schema';
import { DrizzleD1 } from '..';

const {
  media,
  users,
  categories,
  gameVersions,
  mods,
  modVersions,
  modVersionGameVersions,
  modCategories,
  modLikes,
  reports,
} = schema;

/**
 * Reset database by deleting all data (in reverse dependency order)
 */
export async function resetDatabase(db: DrizzleD1): Promise<void> {
  console.info('\n🚮  Resetting database...');

  await db.delete(reports);
  console.info('   ✓ Deleted reports');

  await db.delete(modLikes);
  console.info('   ✓ Deleted mod_likes');

  await db.delete(modCategories);
  console.info('   ✓ Deleted mod_categories');

  await db.delete(modVersionGameVersions);
  console.info('   ✓ Deleted mod_version_game_versions');

  await db.delete(modVersions);
  console.info('   ✓ Deleted mod_versions');

  await db.delete(mods);
  console.info('   ✓ Deleted mods');

  await db.delete(users);
  console.info('   ✓ Deleted users');

  await db.delete(gameVersions);
  console.info('   ✓ Deleted game_versions');

  await db.delete(categories);
  console.info('   ✓ Deleted categories');

  await db.delete(media);
  console.info('   ✓ Deleted media');

  console.info('\n✅ Database reset complete');
}
