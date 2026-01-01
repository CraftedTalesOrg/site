import { Category, schema } from '../schema';
import { batchInsert, logInsert } from './utils';
import { DrizzleD1 } from '..';

const { categories } = schema;

/**
 * Seed categories table with fixed list
 */
export async function seedCategories(db: DrizzleD1): Promise<string[]> {
  console.info('\n📂 Seeding categories...');

  const categoryData: Category[] = [
    { id: 'adventure', name: 'Adventure' },
    { id: 'building', name: 'Building' },
    { id: 'combat', name: 'Combat' },
    { id: 'farming', name: 'Farming' },
    { id: 'magic', name: 'Magic' },
    { id: 'mobs', name: 'Mobs' },
    { id: 'quality-of-life', name: 'Quality of Life' },
    { id: 'social', name: 'Social' },
    { id: 'storage', name: 'Storage' },
    { id: 'technology', name: 'Technology' },
    { id: 'transportation', name: 'Transportation' },
    { id: 'utility', name: 'Utility' },
    { id: 'world-generation', name: 'World Generation' },
  ];

  await batchInsert(db, categories, categoryData);

  logInsert('categories', categoryData.length);

  return categoryData.map(c => c.id);
}
