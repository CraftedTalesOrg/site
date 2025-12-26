import type { OpenAPIHono } from '@hono/zod-openapi';
import type { Env } from '../../env.d';
import { createDb } from '../../utils/db';
import { listCategoriesRoute } from './categories.openapi';
import { categoriesQueries } from './categories.queries';

/**
 * Register categories routes
 */
export const registerCategoriesRoutes = (app: OpenAPIHono<Env>): void => {
  app.openapi(listCategoriesRoute, async (c) => {
    const db = createDb(c.env);
    const categories = await categoriesQueries.list(db);

    return c.json({ data: categories }, 200);
  });
};
