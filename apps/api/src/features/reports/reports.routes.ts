import type { OpenAPIHono } from '@hono/zod-openapi';
import type { Env, JwtPayload } from '../../env.d';
import { createDb } from '../../utils/db';
import {
  createReportRoute,
  listReportsRoute,
  resolveReportRoute,
} from './reports.openapi';
import { reportsQueries } from './reports.queries';
import { modsQueries } from '../mods/mods.queries';
import { usersQueries } from '../users/users.queries';
import {
  CreateReportRequest,
  Report,
  ResolveReportRequest,
  ReviewReportsQuery } from './reports.schemas';
import { PrivateUser } from '../users/users.schemas';
import { PrivateMod } from '../mods/mods.schemas';

/**
 * Register reports routes
 */
export const registerReportsRoutes = (app: OpenAPIHono<Env>): void => {
  app.openapi(listReportsRoute, async (c) => {
    const db = createDb(c.env);
    const query: ReviewReportsQuery = c.req.valid('query');

    const reports = await reportsQueries.list(db, query);

    return c.json(reports, 200);
  });

  app.openapi(createReportRoute, async (c) => {
    const db = createDb(c.env);
    const { userId }: JwtPayload = c.get('jwtPayload');
    const { description, reason, targetId, targetType }: CreateReportRequest = c.req.valid('json');

    // Verify target exists based on type
    if (targetType === 'mod') {
      const mod: PrivateMod | null = await modsQueries.findById(db, targetId);

      if (!mod) {
        return c.json({ error: 'Target not found', code: 'TARGET_NOT_FOUND' }, 404);
      }
    } else {
      const user: PrivateUser | null = await usersQueries.findById(db, targetId);

      if (!user) {
        return c.json({ error: 'Target not found', code: 'TARGET_NOT_FOUND' }, 404);
      }
    }

    // Check if user already has a pending report for this target
    const hasPending: boolean = await reportsQueries.hasPendingReport(db, userId, targetType, targetId);

    if (hasPending) {
      return c.json({ error: 'You already have a pending report for this target', code: 'DUPLICATE_REPORT' }, 400);
    }

    // Create report
    await reportsQueries.create(db, userId, { description, reason, targetId, targetType });

    return c.json({ success: true, message: 'Report submitted successfully' }, 201);
  });

  app.openapi(resolveReportRoute, async (c) => {
    const db = createDb(c.env);
    const { userId: adminId }: JwtPayload = c.get('jwtPayload');
    const { id } = c.req.valid('param');
    const { resolution, notes }: ResolveReportRequest = c.req.valid('json');

    // Verify report exists
    const report: Report | null = await reportsQueries.findById(db, id);

    if (!report) {
      return c.json({ error: 'Report not found', code: 'REPORT_NOT_FOUND' }, 404);
    }

    // Update the report
    await reportsQueries.update(db, id, adminId, { resolution, notes });

    // Audit log
    console.info(`[AUDIT] Report ${id} resolved as ${resolution} by ${adminId}`);

    return c.json({ success: true, message: `Report ${resolution} successfully` }, 200);
  });
};
