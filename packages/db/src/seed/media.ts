import { faker } from '@faker-js/faker';
import { Media, schema } from '../schema';
import { batchInsert, logInsert } from './utils';
import { DrizzleD1 } from '..';

const { media } = schema;

/**
 * Seed media table with avatars, mod icons, and banners
 */
export async function seedMedia(db: DrizzleD1): Promise<string[]> {
  console.info('\n📸 Seeding media...');

  const mediaData: Media[] = [];

  // 20 avatars (400x400)
  for (let i = 0; i < 20; i++) {
    mediaData.push({
      id: crypto.randomUUID(),
      filename: `avatar-${i + 1}.jpg`,
      url: faker.image.avatar(),
      size: faker.number.int({ min: 30000, max: 150000 }),
      mimeType: faker.helpers.arrayElement(['image/jpeg', 'image/png', 'image/webp']),
      width: 400,
      height: 400,
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 }),
      enabled: true,
      deleted: false,
      deletedAt: null,
    });
  }

  // 20 mod icons (512x512)
  for (let i = 0; i < 20; i++) {
    mediaData.push({
      id: crypto.randomUUID(),
      filename: `modicon-${i + 1}.png`,
      url: faker.image.urlLoremFlickr({ category: 'abstract', width: 512, height: 512 }),
      size: faker.number.int({ min: 50000, max: 300000 }),
      mimeType: 'image/png',
      width: 512,
      height: 512,
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 }),
      enabled: true,
      deleted: false,
      deletedAt: null,
    });
  }

  // 20 banners/screenshots (1920x1080)
  for (let i = 0; i < 20; i++) {
    mediaData.push({
      id: crypto.randomUUID(),
      filename: `banner-${i + 1}.jpg`,
      url: faker.image.urlLoremFlickr({ category: 'nature', width: 1920, height: 1080 }),
      size: faker.number.int({ min: 100000, max: 500000 }),
      mimeType: faker.helpers.arrayElement(['image/jpeg', 'image/webp']),
      width: 1920,
      height: 1080,
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 }),
      enabled: true,
      deleted: false,
      deletedAt: null,
    });
  }

  await batchInsert(db, media, mediaData);

  logInsert('media', mediaData.length);

  return mediaData.map(m => m.id!);
}
