import { createRoute, z } from '@hono/zod-openapi';
import { publicModSchema, privateModSchema, createModRequestSchema, updateModRequestSchema, modFiltersSchema, publicModVersionSchema } from './mods.schemas';
import {
  errorResponseSchema,
  successResponseSchema,
  slugParamSchema,
  paginationQuerySchema,
  createPaginatedSchema,
} from '../_shared/common.schemas';

/**
 * GET /mods - List mods with filters
 */
export const listModsRoute = createRoute({
  method: 'get',
  path: '/mods',
  request: {
    query: modFiltersSchema.merge(paginationQuerySchema),
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
 * GET /mods/{slug} - Get single mod
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
 * POST /mods - Create new mod
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
  },
  tags: ['mods'],
});

/**
 * PATCH /mods/{slug} - Update mod
 */
export const updateModRoute = createRoute({
  method: 'patch',
  path: '/mods/{slug}',
  request: {
    params: slugParamSchema,
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
  },
  tags: ['mods'],
});

/**
 * DELETE /mods/{slug} - Soft delete mod
 */
export const deleteModRoute = createRoute({
  method: 'delete',
  path: '/mods/{slug}',
  request: {
    params: slugParamSchema,
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
});

/**
 * POST /mods/{slug}/like - Toggle like on mod
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
      content: {
        'application/json': {
          schema: z.object({
            liked: z.boolean(),
            likes: z.number().int(),
          }),
        },
      },
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
});

/**
 * GET /mods/{slug}/versions - List mod versions
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
