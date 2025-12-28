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
    { id: crypto.randomUUID(), name: 'Magic & Spells', slug: 'magic-spells' },
    { id: crypto.randomUUID(), name: 'Technology', slug: 'technology' },
    { id: crypto.randomUUID(), name: 'World Generation', slug: 'world-generation' },
    { id: crypto.randomUUID(), name: 'Creatures & Mobs', slug: 'creatures-mobs' },
    { id: crypto.randomUUID(), name: 'Building & Construction', slug: 'building-construction' },
    { id: crypto.randomUUID(), name: 'Combat & Weapons', slug: 'combat-weapons' },
    { id: crypto.randomUUID(), name: 'Exploration & Adventure', slug: 'exploration-adventure' },
    { id: crypto.randomUUID(), name: 'Quality of Life', slug: 'quality-of-life' },
    { id: crypto.randomUUID(), name: 'Cosmetics & Textures', slug: 'cosmetics-textures' },
    { id: crypto.randomUUID(), name: 'Audio & Sound', slug: 'audio-sound' },
    { id: crypto.randomUUID(), name: 'Farming & Agriculture', slug: 'farming-agriculture' },
    { id: crypto.randomUUID(), name: 'Transportation', slug: 'transportation' },
  ];

  await batchInsert(db, categories, categoryData);

  logInsert('categories', categoryData.length);

  return categoryData.map(c => c.id!);
}
