import { createRoute, z } from '@hono/zod-openapi';
import type { OpenAPIHono } from '@hono/zod-openapi';
import { mods, modCategories, modLikes } from '@craftedtales/db';
import { eq, and } from 'drizzle-orm';
import type { Env } from '../../env.d';
import { createDb, getDbBinding } from '../../utils/db';
import { requireAuth } from '../../middleware';
import {
  modSummarySchema,
  modWithRelationsSchema,
  createModRequestSchema,
  updateModRequestSchema,
  modFiltersSchema,
} from '../../schemas/mods';
import { modVersionSchema } from '../../schemas/versions';
import {
  errorResponseSchema,
  successResponseSchema,
  slugParamSchema,
  paginationQuerySchema,
  createPaginatedSchema,
} from '../../schemas/common';

// ─────────────────────────────────────────────────────────────────────────────
// Route Definitions
// ─────────────────────────────────────────────────────────────────────────────

const listModsRoute = createRoute({
  method: 'get',
  path: '/mods',
  request: {
    query: modFiltersSchema.merge(paginationQuerySchema),
  },
  responses: {
    200: {
      description: 'List of mods',
      content: { 'application/json': { schema: createPaginatedSchema(modSummarySchema) } },
    },
  },
  tags: ['mods'],
});

const getModRoute = createRoute({
  method: 'get',
  path: '/mods/{slug}',
  request: {
    params: slugParamSchema,
  },
  responses: {
    200: {
      description: 'Mod details',
      content: { 'application/json': { schema: modWithRelationsSchema } },
    },
    404: {
      description: 'Mod not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['mods'],
});

const createModRoute = createRoute({
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
      content: { 'application/json': { schema: modWithRelationsSchema } },
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

const updateModRoute = createRoute({
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
      content: { 'application/json': { schema: modWithRelationsSchema } },
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

const deleteModRoute = createRoute({
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

const likeModRoute = createRoute({
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

const listModVersionsRoute = createRoute({
  method: 'get',
  path: '/mods/{slug}/versions',
  request: {
    params: slugParamSchema,
    query: paginationQuerySchema,
  },
  responses: {
    200: {
      description: 'List of mod versions',
      content: { 'application/json': { schema: createPaginatedSchema(modVersionSchema) } },
    },
    404: {
      description: 'Mod not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['mods'],
});

// ─────────────────────────────────────────────────────────────────────────────
// Route Handlers
// ─────────────────────────────────────────────────────────────────────────────

export const registerModsRoutes = (app: OpenAPIHono<Env>): void => {
  // ─────────────────────────────────────────────────────────────────────────
  // GET /mods - List mods with filters
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(listModsRoute, async (c) => {
    const { page, limit, categoryId, search, sortBy, sortOrder, ownerId } = c.req.valid('query');
    const db = createDb(getDbBinding(c.env));

    // Build where conditions
    const whereConditions: Record<string, unknown> = {
      deleted: false,
      status: 'published',
      visibility: 'public',
      approved: true,
    };

    if (ownerId) {
      whereConditions.ownerId = ownerId;
    }

    // Get mods with relations
    const modsList = await db.query.mods.findMany({
      where: whereConditions,
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
      orderBy: { [sortBy]: sortOrder },
    });

    // Filter by category if specified (post-query filter for now)
    let filteredMods = modsList;

    if (categoryId) {
      filteredMods = modsList.filter(mod =>
        mod.modCategories.some(mc => mc.category?.id === categoryId),
      );
    }

    // Filter by search term if specified
    if (search) {
      const searchLower = search.toLowerCase();

      filteredMods = filteredMods.filter(mod =>
        mod.name.toLowerCase().includes(searchLower)
        || mod.summary.toLowerCase().includes(searchLower),
      );
    }

    // Get total count
    const allMods = await db.query.mods.findMany({
      where: whereConditions,
      columns: { id: true },
    });

    const totalItems = allMods.length;
    const totalPages = Math.ceil(totalItems / limit);

    // Map to summary format
    const data = filteredMods.map(mod => ({
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

  // ─────────────────────────────────────────────────────────────────────────
  // GET /mods/{slug} - Get single mod with relations
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(getModRoute, async (c) => {
    const { slug } = c.req.valid('param');
    const db = createDb(getDbBinding(c.env));

    const mod = await db.query.mods.findFirst({
      where: { slug, deleted: false },
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
        icon: true,
        modCategories: {
          with: {
            category: true,
          },
        },
        modVersions: {
          where: { deleted: false },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!mod) {
      return c.json(
        { error: 'Mod not found', code: 'NOT_FOUND', statusCode: 404 },
        404,
      );
    }

    // Map to response format
    const response = {
      id: mod.id,
      slug: mod.slug,
      name: mod.name,
      iconId: mod.iconId,
      summary: mod.summary,
      description: mod.description,
      status: mod.status,
      visibility: mod.visibility,
      approved: mod.approved,
      license: mod.license,
      licenseUrl: mod.licenseUrl,
      issueTrackerUrl: mod.issueTrackerUrl,
      sourceCodeUrl: mod.sourceCodeUrl,
      wikiUrl: mod.wikiUrl,
      discordInviteUrl: mod.discordInviteUrl,
      donationUrls: mod.donationUrls,
      downloads: mod.downloads,
      likes: mod.likes,
      ownerId: mod.ownerId,
      enabled: mod.enabled,
      createdAt: mod.createdAt,
      updatedAt: mod.updatedAt,
      owner: mod.owner ?? { id: '', username: '', bio: null, avatarId: null, roles: [] },
      icon: mod.icon,
      categories: mod.modCategories
        .map(mc => mc.category)
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null),
      versions: mod.modVersions,
    };

    return c.json(response, 200);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // POST /mods - Create new mod
  // ─────────────────────────────────────────────────────────────────────────
  app.use('/mods', requireAuth());
  app.openapi(createModRoute, async (c) => {
    const user = c.get('user')!;
    const body = c.req.valid('json');
    const db = createDb(getDbBinding(c.env));

    // Check if slug already exists
    const existingSlug = await db.query.mods.findFirst({
      where: { slug: body.slug },
      columns: { id: true },
    });

    if (existingSlug) {
      return c.json(
        { error: 'Slug already exists', code: 'SLUG_EXISTS', statusCode: 409 },
        409,
      );
    }

    // Create mod
    const modId = crypto.randomUUID();

    await db.insert(mods).values({
      id: modId,
      slug: body.slug,
      name: body.name,
      summary: body.summary,
      description: body.description,
      license: body.license,
      licenseUrl: body.licenseUrl,
      issueTrackerUrl: body.issueTrackerUrl,
      sourceCodeUrl: body.sourceCodeUrl,
      wikiUrl: body.wikiUrl,
      discordInviteUrl: body.discordInviteUrl,
      donationUrls: body.donationUrls,
      visibility: body.visibility,
      status: 'draft',
      ownerId: user.id,
    });

    // Add categories
    if (body.categoryIds && body.categoryIds.length > 0) {
      await db.insert(modCategories).values(
        body.categoryIds.map(categoryId => ({
          id: crypto.randomUUID(),
          modId,
          categoryId,
        })),
      );
    }

    // Fetch created mod with relations
    const newMod = await db.query.mods.findFirst({
      where: { id: modId },
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
        icon: true,
        modCategories: {
          with: {
            category: true,
          },
        },
        modVersions: {
          where: { deleted: false },
        },
      },
    });

    if (!newMod) {
      return c.json(
        { error: 'Failed to create mod', code: 'CREATE_FAILED', statusCode: 400 },
        400,
      );
    }

    const response = {
      id: newMod.id,
      slug: newMod.slug,
      name: newMod.name,
      iconId: newMod.iconId,
      summary: newMod.summary,
      description: newMod.description,
      status: newMod.status,
      visibility: newMod.visibility,
      approved: newMod.approved,
      license: newMod.license,
      licenseUrl: newMod.licenseUrl,
      issueTrackerUrl: newMod.issueTrackerUrl,
      sourceCodeUrl: newMod.sourceCodeUrl,
      wikiUrl: newMod.wikiUrl,
      discordInviteUrl: newMod.discordInviteUrl,
      donationUrls: newMod.donationUrls,
      downloads: newMod.downloads,
      likes: newMod.likes,
      ownerId: newMod.ownerId,
      enabled: newMod.enabled,
      createdAt: newMod.createdAt,
      updatedAt: newMod.updatedAt,
      owner: newMod.owner ?? { id: '', username: '', bio: null, avatarId: null, roles: [] },
      icon: newMod.icon,
      categories: newMod.modCategories
        .map(mc => mc.category)
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null),
      versions: newMod.modVersions,
    };

    return c.json(response, 201);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // PATCH /mods/{slug} - Update mod
  // ─────────────────────────────────────────────────────────────────────────
  app.use('/mods/:slug', requireAuth());
  app.openapi(updateModRoute, async (c) => {
    const user = c.get('user')!;
    const { slug } = c.req.valid('param');
    const body = c.req.valid('json');
    const db = createDb(getDbBinding(c.env));

    // Find mod
    const mod = await db.query.mods.findFirst({
      where: { slug, deleted: false },
    });

    if (!mod) {
      return c.json(
        { error: 'Mod not found', code: 'NOT_FOUND', statusCode: 404 },
        404,
      );
    }

    // Check ownership
    if (mod.ownerId !== user.id && !user.roles.includes('admin')) {
      return c.json(
        { error: 'You do not have permission to update this mod', code: 'FORBIDDEN', statusCode: 403 },
        403,
      );
    }

    // Update mod
    await db
      .update(mods)
      .set({
        name: body.name ?? mod.name,
        summary: body.summary ?? mod.summary,
        description: body.description ?? mod.description,
        license: body.license ?? mod.license,
        licenseUrl: body.licenseUrl !== undefined ? body.licenseUrl : mod.licenseUrl,
        issueTrackerUrl: body.issueTrackerUrl !== undefined ? body.issueTrackerUrl : mod.issueTrackerUrl,
        sourceCodeUrl: body.sourceCodeUrl !== undefined ? body.sourceCodeUrl : mod.sourceCodeUrl,
        wikiUrl: body.wikiUrl !== undefined ? body.wikiUrl : mod.wikiUrl,
        discordInviteUrl: body.discordInviteUrl !== undefined ? body.discordInviteUrl : mod.discordInviteUrl,
        donationUrls: body.donationUrls !== undefined ? body.donationUrls : mod.donationUrls,
        visibility: body.visibility ?? mod.visibility,
        status: body.status ?? mod.status,
        updatedAt: new Date(),
      })
      .where(eq(mods.id, mod.id));

    // Update categories if provided
    if (body.categoryIds) {
      // Delete existing categories
      await db.delete(modCategories).where(eq(modCategories.modId, mod.id));

      // Add new categories
      if (body.categoryIds.length > 0) {
        await db.insert(modCategories).values(
          body.categoryIds.map(categoryId => ({
            id: crypto.randomUUID(),
            modId: mod.id,
            categoryId,
          })),
        );
      }
    }

    // Fetch updated mod
    const updatedMod = await db.query.mods.findFirst({
      where: { id: mod.id },
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
        icon: true,
        modCategories: {
          with: {
            category: true,
          },
        },
        modVersions: {
          where: { deleted: false },
        },
      },
    });

    if (!updatedMod) {
      return c.json(
        { error: 'Mod not found', code: 'NOT_FOUND', statusCode: 404 },
        404,
      );
    }

    const response = {
      id: updatedMod.id,
      slug: updatedMod.slug,
      name: updatedMod.name,
      iconId: updatedMod.iconId,
      summary: updatedMod.summary,
      description: updatedMod.description,
      status: updatedMod.status,
      visibility: updatedMod.visibility,
      approved: updatedMod.approved,
      license: updatedMod.license,
      licenseUrl: updatedMod.licenseUrl,
      issueTrackerUrl: updatedMod.issueTrackerUrl,
      sourceCodeUrl: updatedMod.sourceCodeUrl,
      wikiUrl: updatedMod.wikiUrl,
      discordInviteUrl: updatedMod.discordInviteUrl,
      donationUrls: updatedMod.donationUrls,
      downloads: updatedMod.downloads,
      likes: updatedMod.likes,
      ownerId: updatedMod.ownerId,
      enabled: updatedMod.enabled,
      createdAt: updatedMod.createdAt,
      updatedAt: updatedMod.updatedAt,
      owner: updatedMod.owner ?? { id: '', username: '', bio: null, avatarId: null, roles: [] },
      icon: updatedMod.icon,
      categories: updatedMod.modCategories
        .map(mc => mc.category)
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null),
      versions: updatedMod.modVersions,
    };

    return c.json(response, 200);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // DELETE /mods/{slug} - Soft delete mod
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(deleteModRoute, async (c) => {
    const user = c.get('user')!;
    const { slug } = c.req.valid('param');
    const db = createDb(getDbBinding(c.env));

    const mod = await db.query.mods.findFirst({
      where: { slug, deleted: false },
    });

    if (!mod) {
      return c.json(
        { error: 'Mod not found', code: 'NOT_FOUND', statusCode: 404 },
        404,
      );
    }

    // Check ownership
    if (mod.ownerId !== user.id && !user.roles.includes('admin')) {
      return c.json(
        { error: 'You do not have permission to delete this mod', code: 'FORBIDDEN', statusCode: 403 },
        403,
      );
    }

    // Soft delete
    await db
      .update(mods)
      .set({ deleted: true, deletedAt: new Date() })
      .where(eq(mods.id, mod.id));

    return c.json({ success: true, message: 'Mod deleted successfully' }, 200);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // POST /mods/{slug}/like - Toggle like on mod
  // ─────────────────────────────────────────────────────────────────────────
  app.use('/mods/:slug/like', requireAuth());
  app.openapi(likeModRoute, async (c) => {
    const user = c.get('user')!;
    const { slug } = c.req.valid('param');
    const db = createDb(getDbBinding(c.env));

    const mod = await db.query.mods.findFirst({
      where: { slug, deleted: false },
      columns: { id: true, likes: true },
    });

    if (!mod) {
      return c.json(
        { error: 'Mod not found', code: 'NOT_FOUND', statusCode: 404 },
        404,
      );
    }

    // Check if already liked
    const existingLike = await db.query.modLikes.findFirst({
      where: { modId: mod.id, userId: user.id },
    });

    let liked: boolean;
    let newLikes: number;

    if (existingLike) {
      // Unlike
      await db.delete(modLikes).where(
        and(eq(modLikes.modId, mod.id), eq(modLikes.userId, user.id)),
      );
      newLikes = mod.likes - 1;
      liked = false;
    } else {
      // Like
      await db.insert(modLikes).values({
        id: crypto.randomUUID(),
        modId: mod.id,
        userId: user.id,
      });
      newLikes = mod.likes + 1;
      liked = true;
    }

    // Update mod likes count
    await db
      .update(mods)
      .set({ likes: newLikes })
      .where(eq(mods.id, mod.id));

    return c.json({ liked, likes: newLikes }, 200);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /mods/{slug}/versions - List mod versions
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(listModVersionsRoute, async (c) => {
    const { slug } = c.req.valid('param');
    const { page, limit } = c.req.valid('query');
    const db = createDb(getDbBinding(c.env));

    const mod = await db.query.mods.findFirst({
      where: { slug, deleted: false },
      columns: { id: true },
    });

    if (!mod) {
      return c.json(
        { error: 'Mod not found', code: 'NOT_FOUND', statusCode: 404 },
        404,
      );
    }

    const versions = await db.query.modVersions.findMany({
      where: { modId: mod.id, deleted: false },
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

    const allVersions = await db.query.modVersions.findMany({
      where: { modId: mod.id, deleted: false },
      columns: { id: true },
    });

    const totalItems = allVersions.length;
    const totalPages = Math.ceil(totalItems / limit);

    return c.json({
      data: versions,
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
