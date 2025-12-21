import { createRoute } from '@hono/zod-openapi';
import { createReportRequestSchema } from './reports.schemas';
import { errorResponseSchema, successResponseSchema } from '../_shared/common.schemas';

/**
 * OpenAPI route definitions for reports feature
 */

export const createReportRoute = createRoute({
  method: 'post',
  path: '/reports',
  request: {
    body: {
      content: {
        'application/json': { schema: createReportRequestSchema },
      },
    },
  },
  responses: {
    201: {
      description: 'Report created',
      content: { 'application/json': { schema: successResponseSchema } },
    },
    400: {
      description: 'Validation error',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    404: {
      description: 'Target not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    429: {
      description: 'Rate limit exceeded',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['reports'],
});
