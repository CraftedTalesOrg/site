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

  for (const modId of modIds) {
    // Each mod gets 1-3 categories
    const numCategories = faker.number.int({ min: 1, max: 3 });
    const selectedCategories = sample(categoryIds, numCategories);

    for (const categoryId of selectedCategories) {
      associations.push({ modId, categoryId });
    }
  }

  await batchInsert(db, modCategories, associations);

  logInsert('mod_categories', associations.length);
}
