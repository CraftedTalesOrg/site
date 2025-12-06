import { createRoute, z } from '@hono/zod-openapi';
import type { OpenAPIHono } from '@hono/zod-openapi';
import type { Env } from '../../env.d';

export const registerAdminRoutes = (app: OpenAPIHono<Env>): void => {
  const listPending = createRoute({
    method: 'get',
    path: '/admin/mods',
    request: {
      query: z
        .object({ status: z.enum(['pending', 'approved', 'rejected']).default('pending') })
        .openapi('AdminModsQuery'),
    },
    responses: {
      200: {
        description: 'Admin mods list',
        content: {
          'application/json': {
            schema: z
              .object({
                items: z.array(
                  z.object({ id: z.string(), name: z.string(), status: z.string() }),
                ),
              })
              .openapi('AdminModsListResponse'),
          },
        },
      },
    },
    tags: ['admin'],
  });

  app.openapi(listPending, c => c.json({ items: [] }));
};
