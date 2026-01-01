import type { GameVersion } from './gameVersions.schemas';
import { Database } from '@craftedtales/db';

export const gameVersionsQueries = {
  /**
   * List game versions
   */
  async list(db: Database): Promise<GameVersion[]> {
    const gameVersionsList = await db.query.gameVersions.findMany({
      orderBy: { id: 'desc' },
    });

    return gameVersionsList;
  },
};
