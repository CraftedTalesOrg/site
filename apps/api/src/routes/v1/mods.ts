import { createRoute, z } from '@hono/zod-openapi';
import type { Env } from '../../env.d';
import type { OpenAPIHono } from '@hono/zod-openapi';

export const registerModsRoutes = (app: OpenAPIHono<Env>): void => {
  const listMods = createRoute({
    method: 'get',
    path: '/mods',
    request: {
      query: z
        .object({
          q: z.string().optional(),
          page: z.coerce.number().int().min(1).default(1),
          per_page: z.coerce.number().int().min(1).max(100).default(20),
        })
        .openapi('ModsListQuery'),
    },
    responses: {
      200: {
        description: 'List mods',
        content: {
          'application/json': {
            schema: z
              .object({
                items: z.array(z.object({ id: z.string(), name: z.string() })),
                page: z.number(),
                per_page: z.number(),
                total: z.number(),
              })
              .openapi('ModsListResponse'),
          },
        },
      },
    },
    tags: ['mods'],
  });

  app.openapi(listMods, (c) => {
    const page = Number(c.req.query('page') ?? 1);
    const perPage = Number(c.req.query('per_page') ?? 20);

    return c.json({ items: [], page, per_page: perPage, total: 0 });
  });
};
