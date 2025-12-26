import { createRoute } from '@hono/zod-openapi';
import { listCategoriesResponseSchema } from './categories.schemas';

/**
 * GET /categories
 */
export const listCategoriesRoute = createRoute({
  method: 'get',
  path: '/categories',
  responses: {
    200: {
      description: 'List of categories',
      content: {
        'application/json': {
          schema: listCategoriesResponseSchema,
        },
      },
    },
  },
  tags: ['categories'],
});
