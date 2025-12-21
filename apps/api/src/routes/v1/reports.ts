import { createRoute, z } from '@hono/zod-openapi';
import type { OpenAPIHono } from '@hono/zod-openapi';
import { reports } from '@craftedtales/db';
import type { Env } from '../../env.d';
import { createDb, getDbBinding } from '../../utils/db';
import { requireAuth, rateLimit } from '../../middleware';
import { RATE_LIMITS } from '../../utils/rate-limit';
import { errorResponseSchema } from '../../schemas/common';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const createReportRequestSchema = z
  .object({
    targetType: z.enum(['mod', 'user']),
    targetId: z.string().uuid(),
    reason: z.string().min(1).max(100),
    description: z.string().min(10).max(2000),
  })
  .openapi('CreateReportRequest');

const reportResponseSchema = z
  .object({
    id: z.string().uuid(),
    targetType: z.enum(['mod', 'user']),
    targetId: z.string(),
    reason: z.string(),
    description: z.string(),
    status: z.enum(['pending', 'reviewed', 'resolved', 'dismissed']),
    createdAt: z.string(),
  })
  .openapi('Report');

// ─────────────────────────────────────────────────────────────────────────────
// Route Definitions
// ─────────────────────────────────────────────────────────────────────────────

const createReportRoute = createRoute({
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
      content: { 'application/json': { schema: reportResponseSchema } },
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

// ─────────────────────────────────────────────────────────────────────────────
// Route Handlers
// ─────────────────────────────────────────────────────────────────────────────

export const registerReportRoutes = (app: OpenAPIHono<Env>): void => {
  // Apply rate limiting and auth to all report routes
  app.use('/reports', requireAuth(), rateLimit(RATE_LIMITS.REPORTS));

  // ─────────────────────────────────────────────────────────────────────────
  // POST /reports - Create a new report
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(createReportRoute, async (c) => {
    const user = c.get('user')!;
    const body = c.req.valid('json');
    const db = createDb(getDbBinding(c.env));

    // Verify the target exists
    if (body.targetType === 'mod') {
      const mod = await db.query.mods.findFirst({
        where: { id: body.targetId, deleted: false },
        columns: { id: true },
      });

      if (!mod) {
        return c.json(
          { error: 'Mod not found', code: 'NOT_FOUND', statusCode: 404 },
          404,
        );
      }
    } else if (body.targetType === 'user') {
      const targetUser = await db.query.users.findFirst({
        where: { id: body.targetId, deleted: false },
        columns: { id: true },
      });

      if (!targetUser) {
        return c.json(
          { error: 'User not found', code: 'NOT_FOUND', statusCode: 404 },
          404,
        );
      }
    }

    // Check for existing pending report from same user for same target
    const existingReport = await db.query.reports.findFirst({
      where: {
        reporterId: user.id,
        targetType: body.targetType,
        targetId: body.targetId,
        status: 'pending',
      },
    });

    if (existingReport) {
      return c.json(
        { error: 'You already have a pending report for this item', code: 'DUPLICATE_REPORT', statusCode: 400 },
        400,
      );
    }

    // Create the report
    const reportId = crypto.randomUUID();

    await db.insert(reports).values({
      id: reportId,
      reporterId: user.id,
      targetType: body.targetType,
      targetId: body.targetId,
      reason: body.reason,
      description: body.description,
      status: 'pending',
    });

    // Fetch the created report
    const newReport = await db.query.reports.findFirst({
      where: { id: reportId },
    });

    if (!newReport) {
      return c.json(
        { error: 'Failed to create report', code: 'CREATE_FAILED', statusCode: 400 },
        400,
      );
    }

    return c.json({
      id: newReport.id,
      targetType: newReport.targetType,
      targetId: newReport.targetId,
      reason: newReport.reason,
      description: newReport.description,
      status: newReport.status,
      createdAt: newReport.createdAt.toISOString(),
    }, 201);
  });
};
