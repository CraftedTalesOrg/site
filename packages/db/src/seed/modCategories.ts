import { faker } from '@faker-js/faker';
import { schema } from '../schema';
import { batchInsert, logInsert, sample } from './utils';
import { DrizzleD1 } from '..';

const { modCategories } = schema;

/**
 * Seed mod categories junction table
 */
export async function seedModCategories(
  db: DrizzleD1,
  modIds: string[],
  categoryIds: string[],
): Promise<void> {
  console.info('\n🐛  Seeding mod categories...');

  const associations = [];

  for (let i = 0; i < modIds.length; i++) {
    const modId = modIds[i];

    // Edge case: Last 2 mods get excessive categories (10) to test max limit (5)
    let numCategories;

    if (i >= modIds.length - 2) {
      numCategories = Math.min(10, categoryIds.length);
      console.info(`  🔥 Edge case: Assigning ${numCategories} categories to mod ${i + 1} (exceeds max of 5)`);
    } else {
      // Normal mods get 1-3 categories
      numCategories = faker.number.int({ min: 1, max: 3 });
    }

    const selectedCategories = sample(categoryIds, numCategories);

    for (const categoryId of selectedCategories) {
      associations.push({ modId, categoryId });
    }
  }

  await batchInsert(db, modCategories, associations);

  logInsert('mod_categories', associations.length);
}
