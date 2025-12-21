import { createRoute } from '@hono/zod-openapi';
import type { OpenAPIHono } from '@hono/zod-openapi';
import { users } from '@craftedtales/db';
import { eq } from 'drizzle-orm';
import type { Env } from '../../env.d';
import { createDb, getDbBinding } from '../../utils/db';
import { requireAuth } from '../../middleware';
import {
  publicUserSchema,
  updateUserRequestSchema,
} from '../../schemas/users';
import {
  errorResponseSchema,
  usernameParamSchema,
  paginationQuerySchema,
  createPaginatedSchema,
} from '../../schemas/common';
import { modSummarySchema } from '../../schemas/mods';

// ─────────────────────────────────────────────────────────────────────────────
// Helper to map user to public user response
// ─────────────────────────────────────────────────────────────────────────────
type PublicUserResponse = {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  avatarId: string | null;
  roles: string[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function toPublicUser(user: typeof users.$inferSelect): PublicUserResponse {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    avatarId: user.avatarId,
    roles: user.roles,
    enabled: user.enabled,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Route Definitions
// ─────────────────────────────────────────────────────────────────────────────

const getMeRoute = createRoute({
  method: 'get',
  path: '/users/me',
  responses: {
    200: {
      description: 'Current authenticated user',
      content: { 'application/json': { schema: publicUserSchema } },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['users'],
});

const updateMeRoute = createRoute({
  method: 'patch',
  path: '/users/me',
  request: {
    body: {
      content: {
        'application/json': { schema: updateUserRequestSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Profile updated successfully',
      content: { 'application/json': { schema: publicUserSchema } },
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

const getUserByUsernameRoute = createRoute({
  method: 'get',
  path: '/users/{username}',
  request: {
    params: usernameParamSchema,
  },
  responses: {
    200: {
      description: 'User public profile',
      content: { 'application/json': { schema: publicUserSchema } },
    },
    404: {
      description: 'User not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['users'],
});

const getUserModsRoute = createRoute({
  method: 'get',
  path: '/users/{username}/mods',
  request: {
    params: usernameParamSchema,
    query: paginationQuerySchema,
  },
  responses: {
    200: {
      description: 'User mods list',
      content: { 'application/json': { schema: createPaginatedSchema(modSummarySchema) } },
    },
    404: {
      description: 'User not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['users'],
});

// ─────────────────────────────────────────────────────────────────────────────
// Route Handlers
// ─────────────────────────────────────────────────────────────────────────────

export const registerUserRoutes = (app: OpenAPIHono<Env>): void => {
  // ─────────────────────────────────────────────────────────────────────────
  // GET /users/me - Get current authenticated user
  // ─────────────────────────────────────────────────────────────────────────
  app.use('/users/me', requireAuth());
  app.openapi(getMeRoute, async (c) => {
    const user = c.get('user')!;

    return c.json(toPublicUser(user), 200);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // PATCH /users/me - Update current user profile
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(updateMeRoute, async (c) => {
    const user = c.get('user')!;
    const { bio } = c.req.valid('json');
    const db = createDb(getDbBinding(c.env));

    // Update user profile
    await db
      .update(users)
      .set({
        bio: bio ?? user.bio,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Fetch updated user
    const updatedUser = await db.query.users.findFirst({
      where: { id: user.id },
    });

    if (!updatedUser) {
      return c.json(
        { error: 'User not found', code: 'NOT_FOUND', statusCode: 404 },
        404,
      );
    }

    return c.json(toPublicUser(updatedUser), 200);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /users/{username} - Get public user profile by username
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(getUserByUsernameRoute, async (c) => {
    const { username } = c.req.valid('param');
    const db = createDb(getDbBinding(c.env));

    const user = await db.query.users.findFirst({
      where: { username, deleted: false },
    });

    if (!user) {
      return c.json(
        { error: 'User not found', code: 'NOT_FOUND', statusCode: 404 },
        404,
      );
    }

    return c.json(toPublicUser(user), 200);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /users/{username}/mods - Get user's published mods
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(getUserModsRoute, async (c) => {
    const { username } = c.req.valid('param');
    const { page, limit } = c.req.valid('query');
    const db = createDb(getDbBinding(c.env));

    // First find the user
    const user = await db.query.users.findFirst({
      where: { username, deleted: false },
      columns: { id: true },
    });

    if (!user) {
      return c.json(
        { error: 'User not found', code: 'NOT_FOUND', statusCode: 404 },
        404,
      );
    }

    // Get user's published mods
    const userMods = await db.query.mods.findMany({
      where: {
        ownerId: user.id,
        deleted: false,
        status: 'published',
        visibility: 'public',
      },
      with: {
        owner: {
          columns: {
            id: true,
            username: true,
            bio: true,
            avatarId: true,
            roles: true,
          },
        },
        modCategories: {
          with: {
            category: true,
          },
        },
      },
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

    // Get total count for pagination
    const allUserMods = await db.query.mods.findMany({
      where: {
        ownerId: user.id,
        deleted: false,
        status: 'published',
        visibility: 'public',
      },
      columns: { id: true },
    });

    const totalItems = allUserMods.length;
    const totalPages = Math.ceil(totalItems / limit);

    // Map to summary format
    const data = userMods.map(mod => ({
      id: mod.id,
      slug: mod.slug,
      name: mod.name,
      summary: mod.summary,
      iconId: mod.iconId,
      status: mod.status,
      visibility: mod.visibility,
      approved: mod.approved,
      downloads: mod.downloads,
      likes: mod.likes,
      owner: mod.owner ?? { id: '', username: '', bio: null, avatarId: null, roles: [] },
      categories: mod.modCategories
        .map(mc => mc.category)
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null),
      createdAt: mod.createdAt.toISOString(),
      updatedAt: mod.updatedAt.toISOString(),
    }));

    return c.json({
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    }, 200);
  });
};
