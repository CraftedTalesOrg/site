import { createRoute, z } from '@hono/zod-openapi';
import type { OpenAPIHono } from '@hono/zod-openapi';
import type { Env } from '../../env.d';

export const registerUserRoutes = (app: OpenAPIHono<Env>): void => {
  const me = createRoute({
    method: 'get',
    path: '/me',
    responses: {
      200: {
        description: 'Current user',
        content: {
          'application/json': {
            schema: z
              .object({ id: z.string().optional(), username: z.string().optional() })
              .openapi('UserMeResponse'),
          },
        },
      },
    },
    tags: ['users'],
  });

  app.openapi(me, c => c.json({}));
};
