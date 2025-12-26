import { createRoute, z } from '@hono/zod-openapi';
import {
  publicUserSchema,
  privateUserSchema,
  updateProfileRequestSchema,
} from './users.schemas';
import {
  errorResponseSchema,
  successResponseSchema,
  usernameParamSchema,
  paginationQuerySchema,
  createPaginatedSchema,
} from '../_shared/common.schemas';
import { publicModSchema } from '../mods/mods.schemas';
import { requireAuth, requireAnyRole } from '../../middleware';

/**
 * GET /users/me
 */
export const getMeRoute = createRoute({
  method: 'get',
  path: '/users/me',
  responses: {
    200: {
      description: 'Current user profile',
      content: {
        'application/json': {
          schema: z.object({ user: privateUserSchema }),
        },
      },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    404: {
      description: 'User not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['users'],
  security: [{ Bearer: [] }],
  middleware: [requireAuth()] as const,
});

/**
 * PATCH /users/me
 */
export const updateMeRoute = createRoute({
  method: 'patch',
  path: '/users/me',
  request: {
    body: {
      content: {
        'application/json': { schema: updateProfileRequestSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Profile updated',
      content: {
        'application/json': {
          schema: z.object({ user: privateUserSchema }),
        },
      },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    500: {
      description: 'Internal server error',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['users'],
  security: [{ Bearer: [] }],
  middleware: [requireAuth()] as const,
});

/**
 * GET /users/{username}
 */
export const getUserByUsernameRoute = createRoute({
  method: 'get',
  path: '/users/{username}',
  request: {
    params: usernameParamSchema,
  },
  responses: {
    200: {
      description: 'User profile',
      content: {
        'application/json': {
          schema: z.object({ user: publicUserSchema }),
        },
      },
    },
    404: {
      description: 'User not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['users'],
});

/**
 * GET /users/{username}/mods
 */
export const getUserModsRoute = createRoute({
  method: 'get',
  path: '/users/{username}/mods',
  request: {
    params: usernameParamSchema,
    query: paginationQuerySchema,
  },
  responses: {
    200: {
      description: 'User mods',
      content: {
        'application/json': {
          schema: createPaginatedSchema(publicModSchema),
        },
      },
    },
    404: {
      description: 'User not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['users'],
});

/**
 * POST /users/{id}/{action}
 */
export const userActionRoute = createRoute({
  method: 'post',
  path: '/users/{id}/{action}',
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
  tags: ['users'],
  security: [{ Bearer: [] }],
  middleware: [requireAuth(), requireAnyRole(['admin', 'moderator'])] as const,
});
