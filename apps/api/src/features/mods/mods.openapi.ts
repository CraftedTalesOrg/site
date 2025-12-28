import { createRoute, z } from '@hono/zod-openapi';
import {
  publicModSchema,
  privateModSchema,
  createModRequestSchema,
  updateModRequestSchema,
  listModsQuerySchema,
  reviewModsQuerySchema,
  publicModVersionSchema,
} from './mods.schemas';
import {
  errorResponseSchema,
  successResponseSchema,
  slugParamSchema,
  paginationQuerySchema,
  createPaginatedSchema,
} from '../_shared/common.schemas';
import { requireAuth, requireAnyRole } from '../../middleware';

/**
 * GET /mods
 */
export const listModsRoute = createRoute({
  method: 'get',
  path: '/mods',
  request: {
    query: listModsQuerySchema,
  },
  responses: {
    200: {
      description: 'List of mods',
      content: { 'application/json': { schema: createPaginatedSchema(publicModSchema) } },
    },
  },
  tags: ['mods'],
});

/**
 * GET /mods/{slug}
 */
export const getModRoute = createRoute({
  method: 'get',
  path: '/mods/{slug}',
  request: {
    params: slugParamSchema,
  },
  responses: {
    200: {
      description: 'Mod details',
      content: { 'application/json': { schema: publicModSchema } },
    },
    404: {
      description: 'Mod not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['mods'],
});

/**
 * POST /mods
 */
export const createModRoute = createRoute({
  method: 'post',
  path: '/mods',
  request: {
    body: {
      content: {
        'application/json': { schema: createModRequestSchema },
      },
    },
  },
  responses: {
    201: {
      description: 'Mod created',
      content: { 'application/json': { schema: privateModSchema } },
    },
    400: {
      description: 'Validation error',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    409: {
      description: 'Slug already exists',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    500: {
      description: 'Failed to create mod',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['mods'],
  security: [{ Bearer: [] }],
  middleware: [requireAuth()] as const,
});

/**
 * PATCH /mods/{id}
 */
export const updateModRoute = createRoute({
  method: 'patch',
  path: '/mods/{id}',
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        'application/json': { schema: updateModRequestSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Mod updated',
      content: { 'application/json': { schema: privateModSchema } },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    403: {
      description: 'Not owner of mod',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    404: {
      description: 'Mod not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    409: {
      description: 'Slug already exists',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    500: {
      description: 'Failed to fetch updated mod',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['mods'],
  security: [{ Bearer: [] }],
  middleware: [requireAuth()] as const,
});

/**
 * DELETE /mods/{id}
 */
export const deleteModRoute = createRoute({
  method: 'delete',
  path: '/mods/{id}',
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      description: 'Mod deleted',
      content: { 'application/json': { schema: successResponseSchema } },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    403: {
      description: 'Not owner of mod',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    404: {
      description: 'Mod not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['mods'],
  security: [{ Bearer: [] }],
  middleware: [requireAuth()] as const,
});

/**
 * POST /mods/{slug}/like
 */
export const likeModRoute = createRoute({
  method: 'post',
  path: '/mods/{slug}/like',
  request: {
    params: slugParamSchema,
  },
  responses: {
    200: {
      description: 'Like toggled',
      content: { 'application/json': { schema: successResponseSchema } },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    404: {
      description: 'Mod not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['mods'],
  security: [{ Bearer: [] }],
  middleware: [requireAuth()] as const,
});

/**
 * GET /mods/{slug}/versions
 */
export const listModVersionsRoute = createRoute({
  method: 'get',
  path: '/mods/{slug}/versions',
  request: {
    params: slugParamSchema,
    query: paginationQuerySchema,
  },
  responses: {
    200: {
      description: 'List of mod versions',
      content: { 'application/json': { schema: createPaginatedSchema(publicModVersionSchema) } },
    },
    404: {
      description: 'Mod not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['mods'],
});

/**
 * GET /admin/mods/review-queue
 */
export const listReviewQueueRoute = createRoute({
  method: 'get',
  path: '/admin/mods/review-queue',
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
  tags: ['mods'],
  security: [{ Bearer: [] }],
  middleware: [requireAuth(), requireAnyRole(['admin', 'moderator'])] as const,
});

/**
 * POST /admin/mods/{id}/review
 */
export const reviewModRoute = createRoute({
  method: 'post',
  path: '/admin/mods/{id}/review',
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            action: z.enum(['approve', 'reject']),
            reason: z.string().min(1).max(500).optional(),
          }),
        },
      },
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
  tags: ['mods'],
  security: [{ Bearer: [] }],
  middleware: [requireAuth(), requireAnyRole(['admin', 'moderator'])] as const,
});
