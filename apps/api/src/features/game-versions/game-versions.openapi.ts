import { createRoute } from '@hono/zod-openapi';
import { listGameVersionsResponseSchema } from './game-versions.schemas';

/**
 * GET /game-versions
 */
export const listGameVersionsRoute = createRoute({
  method: 'get',
  path: '/game-versions',
  responses: {
    200: {
      description: 'List of game versions',
      content: {
        'application/json': {
          schema: listGameVersionsResponseSchema,
        },
      },
    },
  },
  tags: ['game-versions'],
});
