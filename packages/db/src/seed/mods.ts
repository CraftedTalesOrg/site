import { faker } from '@faker-js/faker';
import { schema } from '../schema';
import { batchInsert, logInsert, weightedRandom } from './utils';
import { DrizzleD1 } from '..';

const { mods } = schema;

/**
 * Seed mods table
 */
export async function seedMods(
  db: DrizzleD1,
  userIds: string[],
  iconIds: string[],
): Promise<string[]> {
  console.info('\n🎮 Seeding mods...');

  const modData = [
    { slug: 'dragon-realms', name: 'Dragon Realms' },
    { slug: 'dragonscale-armor', name: 'Dragonscale Armor' },
    { slug: 'dragon-flight', name: 'Dragon Flight Mechanics' },
    { slug: 'retro-pixel-pack', name: 'Retro Pixel Pack' },
    { slug: 'pixel-creatures', name: 'Pixel Creatures' },
    { slug: 'biomes-expanded', name: 'Biomes Expanded' },
    { slug: 'terraforming-tools', name: 'Terraforming Tools' },
    { slug: 'climate-system', name: 'Climate System' },
    { slug: 'procedural-dungeons', name: 'Procedural Dungeons' },
    { slug: 'industrial-revolution', name: 'Industrial Revolution' },
    { slug: 'redstone-plus-plus', name: 'Redstone++' },
    { slug: 'energy-networks', name: 'Energy Networks' },
    { slug: 'arcane-arts', name: 'Arcane Arts' },
    { slug: 'spellbook-library', name: 'Spellbook Library' },
    { slug: 'magical-creatures', name: 'Magical Creatures' },
    { slug: 'blueprint-system', name: 'Blueprint System' },
    { slug: 'decorative-blocks-plus', name: 'Decorative Blocks Plus' },
    { slug: 'combat-overhaul', name: 'Combat Overhaul' },
    { slug: 'legendary-weapons', name: 'Legendary Weapons' },
    { slug: 'immersive-audio', name: 'Immersive Audio' },
  ];

  const modsWithDetails = modData.map((mod, index) => ({
    id: crypto.randomUUID(),
    slug: mod.slug,
    name: mod.name,
    summary: faker.lorem.sentence(),
    description: faker.lorem.paragraphs(3),
    ownerId: userIds[index % userIds.length],
    iconId: iconIds[index % iconIds.length] || null,
    status: weightedRandom([
      { weight: 0.85, value: 'published' as const },
      { weight: 0.15, value: 'draft' as const },
    ]),
    visibility: weightedRandom([
      { weight: 0.85, value: 'public' as const },
      { weight: 0.10, value: 'unlisted' as const },
      { weight: 0.05, value: 'private' as const },
    ]),
    approved: weightedRandom([
      { weight: 0.8, value: true },
      { weight: 0.2, value: false },
    ]),
    license: 'MIT',
    licenseUrl: null,
    issueTrackerUrl: null,
    sourceCodeUrl: null,
    wikiUrl: null,
    discordInviteUrl: null,
    donationUrls: null,
    likes: 0, // Will be updated after seedModLikes
    downloads: faker.number.int({ min: 0, max: 20000 }),
    createdAt: faker.date.past({ years: 1 }),
    updatedAt: faker.date.recent({ days: 30 }),
    enabled: true,
    deleted: false,
    deletedAt: null,
  }));

  await batchInsert(db, mods, modsWithDetails);

  logInsert('mods', modsWithDetails.length);

  return modsWithDetails.map(m => m.id);
}
