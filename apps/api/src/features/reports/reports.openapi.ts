import { createRoute, z } from '@hono/zod-openapi';
import {
  createReportRequestSchema,
  reportSchema,
  reviewReportsQuerySchema,
  resolveReportRequestSchema,
} from './reports.schemas';
import {
  errorResponseSchema,
  successResponseSchema,
  createPaginatedSchema,
} from '../_shared/common.schemas';
import { requireAuth, rateLimit, requireAnyRole } from '../../middleware';
import { RATE_LIMITS } from '../../utils/rate-limit';

/**
 * GET /reports
 */
export const listReportsRoute = createRoute({
  method: 'get',
  path: '/reports',
  request: {
    query: reviewReportsQuerySchema,
  },
  responses: {
    200: {
      description: 'List of reports',
      content: { 'application/json': { schema: createPaginatedSchema(reportSchema) } },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    403: {
      description: 'Not authorized',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['reports'],
  security: [{ Bearer: [] }],
  middleware: [requireAuth(), requireAnyRole(['admin', 'moderator'])] as const,
});

/**
 * POST /reports
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
  security: [{ Bearer: [] }],
  middleware: [requireAuth(), rateLimit(RATE_LIMITS.REPORTS)] as const,
});

/**
 * POST /reports/{id}/resolve
 */
export const resolveReportRoute = createRoute({
  method: 'post',
  path: '/reports/{id}/resolve',
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { 'application/json': { schema: resolveReportRequestSchema } },
    },
  },
  responses: {
    200: {
      description: 'Report resolved',
      content: { 'application/json': { schema: successResponseSchema } },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    403: {
      description: 'Not authorized',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    404: {
      description: 'Report not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['reports'],
  security: [{ Bearer: [] }],
  middleware: [requireAuth(), requireAnyRole(['admin', 'moderator'])] as const,
});
