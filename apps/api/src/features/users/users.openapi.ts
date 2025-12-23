import { createRoute, z } from '@hono/zod-openapi';
import {
  publicUserSchema,
  privateUserSchema,
  updateProfileRequestSchema,
} from '../auth/auth.schemas';
import {
  errorResponseSchema,
  usernameParamSchema,
  paginationQuerySchema,
  createPaginatedSchema,
} from '../_shared/common.schemas';
import { publicModSchema } from '../mods/mods.schemas';

/**
 * OpenAPI route definitions for users feature
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
});

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
});

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
