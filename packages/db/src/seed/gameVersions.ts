import { GameVersion, schema } from '../schema';
import { batchInsert, logInsert } from './utils';
import { DrizzleD1 } from '..';

const { gameVersions } = schema;

/**
 * Seed game versions table with fixed list
 */
export async function seedGameVersions(db: DrizzleD1): Promise<string[]> {
  console.info('\n🎮 Seeding game versions...');

  const gameVersionData: GameVersion[] = [
    { id: '1.0.0', name: '1.0.0' },
    { id: '1.0.1', name: '1.0.1' },
    { id: '1.1.0', name: '1.1.0' },
    { id: '1.2.0', name: '1.2.0' },
    { id: '2.0.0-beta.1', name: '2.0.0-beta.1' },
  ];

  await batchInsert(db, gameVersions, gameVersionData);

  logInsert('game_versions', gameVersionData.length);

  return gameVersionData.map(v => v.id);
}
