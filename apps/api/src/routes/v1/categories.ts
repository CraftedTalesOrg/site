import { createRoute } from '@hono/zod-openapi';
import type { OpenAPIHono } from '@hono/zod-openapi';
import type { Env } from '../../env.d';
import { createDb, getDbBinding } from '../../utils/db';
import { categorySchema } from '../../schemas/categories';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Route Definitions
// ─────────────────────────────────────────────────────────────────────────────

const listCategoriesRoute = createRoute({
  method: 'get',
  path: '/categories',
  responses: {
    200: {
      description: 'List of categories',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(categorySchema),
          }),
        },
      },
    },
  },
  tags: ['categories'],
});

// ─────────────────────────────────────────────────────────────────────────────
// Route Handlers
// ─────────────────────────────────────────────────────────────────────────────

export const registerCategoriesRoutes = (app: OpenAPIHono<Env>): void => {
  // ─────────────────────────────────────────────────────────────────────────
  // GET /categories - List all categories
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(listCategoriesRoute, async (c) => {
    const db = createDb(getDbBinding(c.env));

    const categoriesList = await db.query.categories.findMany({
      orderBy: { name: 'asc' },
    });

    return c.json({ data: categoriesList }, 200);
  });
};
