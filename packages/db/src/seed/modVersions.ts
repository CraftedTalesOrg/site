import { faker } from '@faker-js/faker';
import { ModVersion, schema } from '../schema';
import { batchInsert, logInsert, weightedRandom } from './utils';
import { DrizzleD1 } from '..';

const { modVersions } = schema;

/**
 * Seed mod versions
 */
export async function seedModVersions(
  db: DrizzleD1,
  modIds: string[],
): Promise<string[]> {
  console.info('\n📦 Seeding mod versions...');

  const versionNames = ['0.9.0', '0.9.5', '1.0.0', '1.1.0', '1.2.0', '2.0.0', '2.1.0'];

  const allVersions: ModVersion[] = [];

  for (const modId of modIds) {
    // Weighted version count distribution
    const versionCount = weightedRandom([
      { weight: 0.3, value: 1 },
      { weight: 0.4, value: 2 },
      { weight: 0.2, value: 3 },
      { weight: 0.1, value: faker.number.int({ min: 4, max: 5 }) },
    ]);

    for (let i = 0; i < versionCount; i++) {
      allVersions.push({
        id: crypto.randomUUID(),
        modId,
        name: versionNames[i % versionNames.length],
        url: 'https://cdn.example.com/mods/download.zip',
        size: faker.number.int({ min: 5242880, max: 52428800 }), // 5MB - 50MB
        channel: weightedRandom([
          { weight: 0.7, value: 'release' as const },
          { weight: 0.2, value: 'beta' as const },
          { weight: 0.1, value: 'alpha' as const },
        ]),
        changelog: faker.lorem.paragraphs(2),
        downloads: faker.number.int({ min: 0, max: 1000 }),
        publishedAt: faker.date.between({ from: '2024-01-01', to: '2024-12-27' }),
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent({ days: 30 }),
        enabled: true,
        deleted: false,
        deletedAt: null,
      });
    }
  }

  await batchInsert(db, modVersions, allVersions);

  logInsert('mod_versions', allVersions.length);

  return allVersions.map(v => v.id!);
}
