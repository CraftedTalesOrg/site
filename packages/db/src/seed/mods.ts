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
    // Edge case: Extremely long mod name (200+ chars)
    {
      slug: 'extremely-long-mod-name-test-case',
      name: 'The Ultimate Super Extremely Long Mod Name That Tests Maximum Character Limits And UI Layout Handling Across Multiple Lines And Components And Should Definitely Break Some Layouts ' + 'A'.repeat(100) + ' Edge Case Test Mod',
    },
    // Edge case: Mod with very long summary (will be added below)
    { slug: 'long-summary-test', name: 'Long Summary Test Mod' },
    // Edge case: Mod with excessive categories (will get 10 categories)
    { slug: 'many-categories-test', name: 'Many Categories Test Mod' },
  ];

  const modsWithDetails = modData.map((mod, index) => {
    // Special handling for edge case mods
    let summary = faker.lorem.sentence();
    let description = faker.lorem.paragraphs(3);

    // Edge case: Very long summary (2000+ chars)
    if (mod.slug === 'long-summary-test') {
      summary = faker.lorem.paragraphs(15) + ' EDGE_CASE_VERY_LONG_SUMMARY_TESTING_UI_OVERFLOW_AND_TEXT_TRUNCATION_BEHAVIOR '.repeat(10) + faker.lorem.paragraphs(10);
    }

    // Edge case: Very long description (10000+ chars)
    if (mod.slug === 'many-categories-test') {
      description = faker.lorem.paragraphs(100) + ' EDGE_CASE_TESTING_EXTREMELY_LONG_DESCRIPTION_CONTENT '.repeat(50);
    }

    return {
      id: crypto.randomUUID(),
      slug: mod.slug,
      name: mod.name,
      summary,
      description,
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
    };
  });

  await batchInsert(db, mods, modsWithDetails);

  logInsert('mods', modsWithDetails.length);

  return modsWithDetails.map(m => m.id);
}
