import { createRoute, z } from '@hono/zod-openapi';
import type { OpenAPIHono } from '@hono/zod-openapi';
import { mods, users, reports } from '@craftedtales/db';
import { eq } from 'drizzle-orm';
import type { Env } from '../../env.d';
import { createDb, getDbBinding } from '../../utils/db';
import { requireAuth, requireRole } from '../../middleware';
import {
  errorResponseSchema,
  successResponseSchema,
  paginationQuerySchema,
  createPaginatedSchema,
} from '../../schemas/common';
import { publicModSchema } from '../../schemas/mods';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const adminModsQuerySchema = z
  .object({
    status: z.enum(['pending', 'approved', 'all']).default('pending'),
  })
  .merge(paginationQuerySchema);

const reportResolveSchema = z
  .object({
    resolution: z.enum(['resolved', 'dismissed']),
    notes: z.string().max(2000).optional(),
  })
  .openapi('ReportResolve');

const reportSchema = z
  .object({
    id: z.string().uuid(),
    reporterId: z.string().uuid().nullable(),
    targetType: z.enum(['mod', 'user']),
    targetId: z.string(),
    reason: z.string(),
    description: z.string(),
    status: z.enum(['pending', 'reviewed', 'resolved', 'dismissed']),
    reviewedBy: z.string().uuid().nullable(),
    resolution: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('AdminReport');

// ─────────────────────────────────────────────────────────────────────────────
// Route Definitions
// ─────────────────────────────────────────────────────────────────────────────

const listReviewQueueRoute = createRoute({
  method: 'get',
  path: '/admin/review-queue',
  request: {
    query: adminModsQuerySchema,
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

const reviewModRoute = createRoute({
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

const userActionRoute = createRoute({
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

const listReportsRoute = createRoute({
  method: 'get',
  path: '/admin/reports',
  request: {
    query: z.object({
      status: z.enum(['pending', 'reviewed', 'resolved', 'dismissed', 'all']).default('pending'),
      targetType: z.enum(['mod', 'user']).optional(),
    }).merge(paginationQuerySchema),
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

const resolveReportRoute = createRoute({
  method: 'post',
  path: '/admin/reports/{id}/resolve',
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { 'application/json': { schema: reportResolveSchema } },
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

// ─────────────────────────────────────────────────────────────────────────────
// Route Handlers
// ─────────────────────────────────────────────────────────────────────────────

export const registerAdminRoutes = (app: OpenAPIHono<Env>): void => {
  // Apply auth and role check to all admin routes
  app.use('/admin/*', requireAuth(), requireRole(['admin', 'moderator']));

  // ─────────────────────────────────────────────────────────────────────────
  // GET /admin/review-queue - List mods pending approval
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(listReviewQueueRoute, async (c) => {
    const { status, page, limit } = c.req.valid('query');
    const db = createDb(getDbBinding(c.env));

    // Build where condition based on status
    const whereConditions: Record<string, unknown> = { deleted: false };

    if (status === 'pending') {
      whereConditions.approved = false;
      whereConditions.status = 'published';
    } else if (status === 'approved') {
      whereConditions.approved = true;
    }
    // 'all' doesn't add additional filters

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
        icon: {
          where: { deleted: false },
        },
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
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'asc' },
    });

    const allMods = await db.query.mods.findMany({
      where: whereConditions,
      columns: { id: true },
    });

    const totalItems = allMods.length;
    const totalPages = Math.ceil(totalItems / limit);

    const data = modsList.map(mod => ({
      ...mod,
      owner: mod.owner ?? { id: '', username: '[deleted]', bio: null, avatarId: null, roles: [] },
      categories: mod.modCategories
        .map(mc => mc.category)
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null),
      versions: mod.modVersions,
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
  // POST /admin/mods/{id}/{approve|reject} - Review a mod
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(reviewModRoute, async (c) => {
    const { id, action } = c.req.valid('param');
    const body = c.req.valid('json');
    const db = createDb(getDbBinding(c.env));

    const mod = await db.query.mods.findFirst({
      where: { id, deleted: false },
    });

    if (!mod) {
      return c.json(
        { error: 'Mod not found', code: 'NOT_FOUND', statusCode: 404 },
        404,
      );
    }

    if (action === 'approve') {
      await db
        .update(mods)
        .set({ approved: true, updatedAt: new Date() })
        .where(eq(mods.id, id));

      return c.json({ success: true, message: 'Mod approved successfully' }, 200);
    } else {
      // Reject - set to draft status
      await db
        .update(mods)
        .set({
          approved: false,
          status: 'draft',
          updatedAt: new Date(),
        })
        .where(eq(mods.id, id));

      // TODO: Notify mod owner with rejection reason via email
      if (body?.reason) {
        console.info(`[STUB] Mod ${id} rejected with reason: ${body.reason}`);
      }

      return c.json({ success: true, message: 'Mod rejected successfully' }, 200);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // POST /admin/users/{id}/{suspend|unsuspend} - User moderation
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(userActionRoute, async (c) => {
    const { id, action } = c.req.valid('param');
    const body = c.req.valid('json');
    const admin = c.get('user')!;
    const db = createDb(getDbBinding(c.env));

    const targetUser = await db.query.users.findFirst({
      where: { id, deleted: false },
    });

    if (!targetUser) {
      return c.json(
        { error: 'User not found', code: 'NOT_FOUND', statusCode: 404 },
        404,
      );
    }

    // Prevent admin from suspending themselves
    if (targetUser.id === admin.id) {
      return c.json(
        { error: 'Cannot perform action on yourself', code: 'FORBIDDEN', statusCode: 403 },
        403,
      );
    }

    if (action === 'suspend') {
      await db
        .update(users)
        .set({ enabled: false, updatedAt: new Date() })
        .where(eq(users.id, id));

      // TODO: Add audit log entry
      console.info(`[AUDIT] User ${id} suspended by ${admin.id}. Reason: ${body?.reason ?? 'No reason provided'}`);

      return c.json({ success: true, message: 'User suspended successfully' }, 200);
    } else {
      await db
        .update(users)
        .set({ enabled: true, updatedAt: new Date() })
        .where(eq(users.id, id));

      console.info(`[AUDIT] User ${id} unsuspended by ${admin.id}`);

      return c.json({ success: true, message: 'User unsuspended successfully' }, 200);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /admin/reports - List reports
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(listReportsRoute, async (c) => {
    const { status, targetType, page, limit } = c.req.valid('query');
    const db = createDb(getDbBinding(c.env));

    const whereConditions: Record<string, unknown> = {};

    if (status !== 'all') {
      whereConditions.status = status;
    }

    if (targetType) {
      whereConditions.targetType = targetType;
    }

    const reportsList = await db.query.reports.findMany({
      where: whereConditions,
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

    const allReports = await db.query.reports.findMany({
      where: whereConditions,
      columns: { id: true },
    });

    const totalItems = allReports.length;
    const totalPages = Math.ceil(totalItems / limit);

    const data = reportsList.map(report => ({
      id: report.id,
      reporterId: report.reporterId,
      targetType: report.targetType,
      targetId: report.targetId,
      reason: report.reason,
      description: report.description,
      status: report.status,
      reviewedBy: report.reviewedBy,
      resolution: report.resolution,
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
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
  // POST /admin/reports/{id}/resolve - Resolve a report
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(resolveReportRoute, async (c) => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    const admin = c.get('user')!;
    const db = createDb(getDbBinding(c.env));

    const report = await db.query.reports.findFirst({
      where: { id },
    });

    if (!report) {
      return c.json(
        { error: 'Report not found', code: 'NOT_FOUND', statusCode: 404 },
        404,
      );
    }

    await db
      .update(reports)
      .set({
        status: body.resolution,
        reviewedBy: admin.id,
        resolution: body.notes,
        updatedAt: new Date(),
      })
      .where(eq(reports.id, id));

    console.info(`[AUDIT] Report ${id} resolved as ${body.resolution} by ${admin.id}`);

    return c.json({ success: true, message: `Report ${body.resolution} successfully` }, 200);
  });
};
