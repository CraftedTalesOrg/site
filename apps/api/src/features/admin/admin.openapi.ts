import { createRoute, z } from '@hono/zod-openapi';
import {
  errorResponseSchema,
  successResponseSchema,
  createPaginatedSchema,
} from '../_shared/common.schemas';
import { publicModSchema, reviewModsQuerySchema } from '../mods/mods.schemas';
import {
  reportSchema,
  reviewReportsQuerySchema,
  resolveReportRequestSchema,
} from '../reports/reports.schemas';

/**
 * GET /admin/review-queue - List mods pending approval
 */
export const listReviewQueueRoute = createRoute({
  method: 'get',
  path: '/admin/review-queue',
  request: {
    query: reviewModsQuerySchema,
  },
  responses: {
    200: {
      description: 'List of mods pending review',
      content: { 'application/json': { schema: createPaginatedSchema(publicModSchema) } },
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
  tags: ['admin'],
});

/**
 * POST /admin/mods/{id}/{action} - Review a mod (approve/reject)
 */
export const reviewModRoute = createRoute({
  method: 'post',
  path: '/admin/mods/{id}/{action}',
  request: {
    params: z.object({
      id: z.string().uuid(),
      action: z.enum(['approve', 'reject']),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            reason: z.string().min(1).max(500).optional(),
          }),
        },
      },
      required: false,
    },
  },
  responses: {
    200: {
      description: 'Mod reviewed',
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
      description: 'Mod not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['admin'],
});

/**
 * POST /admin/users/{id}/{action} - User moderation (suspend/unsuspend)
 */
export const userActionRoute = createRoute({
  method: 'post',
  path: '/admin/users/{id}/{action}',
  request: {
    params: z.object({
      id: z.string().uuid(),
      action: z.enum(['suspend', 'unsuspend']),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            reason: z.string().min(1).max(500).optional(),
          }),
        },
      },
      required: false,
    },
  },
  responses: {
    200: {
      description: 'User action completed',
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
      description: 'User not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['admin'],
});

/**
 * GET /admin/reports - List reports
 */
export const listReportsRoute = createRoute({
  method: 'get',
  path: '/admin/reports',
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
  tags: ['admin'],
});

/**
 * POST /admin/reports/{id}/resolve - Resolve a report
 */
export const resolveReportRoute = createRoute({
  method: 'post',
  path: '/admin/reports/{id}/resolve',
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
  tags: ['admin'],
});
