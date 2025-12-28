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
    { id: 'magic-spells', name: 'Magic & Spells' },
    { id: 'technology', name: 'Technology' },
    { id: 'world-generation', name: 'World Generation' },
    { id: 'creatures-mobs', name: 'Creatures & Mobs' },
    { id: 'building-construction', name: 'Building & Construction' },
    { id: 'combat-weapons', name: 'Combat & Weapons' },
    { id: 'exploration-adventure', name: 'Exploration & Adventure' },
    { id: 'quality-of-life', name: 'Quality of Life' },
    { id: 'cosmetics-textures', name: 'Cosmetics & Textures' },
    { id: 'audio-sound', name: 'Audio & Sound' },
    { id: 'farming-agriculture', name: 'Farming & Agriculture' },
    { id: 'transportation', name: 'Transportation' },
  ];

  await batchInsert(db, categories, categoryData);

  logInsert('categories', categoryData.length);

  return categoryData.map(c => c.id);
}
