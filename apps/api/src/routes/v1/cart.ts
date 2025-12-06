import { createRoute, z } from '@hono/zod-openapi';
import type { OpenAPIHono } from '@hono/zod-openapi';
import type { Env } from '../../env.d';

export const registerCartRoutes = (app: OpenAPIHono<Env>): void => {
  const getCart = createRoute({
    method: 'get',
    path: '/cart',
    responses: {
      200: {
        description: 'Cart',
        content: {
          'application/json': {
            schema: z
              .object({
                items: z.array(
                  z.object({ modId: z.string(), versionId: z.string(), qty: z.number() }),
                ),
              })
              .openapi('CartResponse'),
          },
        },
      },
    },
    tags: ['cart'],
  });

  app.openapi(getCart, c => c.json({ items: [] }));
};
