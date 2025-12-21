import { createRoute, z } from '@hono/zod-openapi';
import { categorySchema } from './categories.schemas';

/**
 * OpenAPI route definitions for categories feature
 */

export const listCategoriesRoute = createRoute({
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
