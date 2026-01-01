import type { OpenAPIHono } from '@hono/zod-openapi';
import type { Env } from '../../env';
import { createDb } from '../../utils/db';
import { listGameVersionsRoute } from './game-versions.openapi';
import { gameVersionsQueries } from './game-versions.queries';

/**
 * Register game versions routes
 */
export const registerGameVersionsRoutes = (app: OpenAPIHono<Env>): void => {
  /**
   * GET /game-versions
   */
  app.openapi(listGameVersionsRoute, async (c) => {
    const db = createDb(c.env);
    const gameVersions = await gameVersionsQueries.list(db);

    return c.json({ data: gameVersions }, 200);
  });
};
