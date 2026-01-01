import { faker } from '@faker-js/faker';
import { schema } from '../schema';
import { batchInsert, logInsert, sample } from './utils';
import { DrizzleD1 } from '..';

const { modVersionGameVersions } = schema;

/**
 * Seed mod version game versions junction table
 */
export async function seedModVersionGameVersions(
  db: DrizzleD1,
  modVersionIds: string[],
  gameVersionIds: string[],
): Promise<void> {
  console.info('\n🔗 Seeding mod version game versions...');

  const associations = [];

  for (const modVersionId of modVersionIds) {
    // Each mod version is compatible with 1-3 game versions
    const numGameVersions = faker.number.int({ min: 1, max: 3 });
    const selectedGameVersions = sample(gameVersionIds, numGameVersions);

    for (const gameVersionId of selectedGameVersions) {
      associations.push({ modVersionId, gameVersionId });
    }
  }

  await batchInsert(db, modVersionGameVersions, associations);

  logInsert('mod_version_game_versions', associations.length);
}
