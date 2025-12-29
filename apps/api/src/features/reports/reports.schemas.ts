import { z } from '@hono/zod-openapi';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { reports } from '@craftedtales/db';
import { paginationQuerySchema } from '../_shared/common.schemas';

// ─────────────────────────────────────────────────────────────────────────────
// Base
// ─────────────────────────────────────────────────────────────────────────────

export const selectReportSchema = createSelectSchema(reports);
export const insertReportSchema = createInsertSchema(reports);

/**
 * Report
 */
export const reportSchema = selectReportSchema.openapi('PublicReport');

export type Report = z.infer<typeof reportSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create report request
 */
export const createReportRequestSchema = insertReportSchema
  .pick({
    targetType: true,
    targetId: true,
    reason: true,
    description: true,
  })
  .extend({
    targetId: z.string().uuid(),
    description: z.string().min(10).max(2000),
  })
  .openapi('CreateReportRequest');

export type CreateReportRequest = z.infer<typeof createReportRequestSchema>;

/**
 * Resolve report request
 */
export const resolveReportRequestSchema = z
  .object({
    resolution: z.enum(['resolved', 'dismissed']),
    notes: z.string().max(2000).optional(),
  })
  .openapi('ResolveReportRequest');

export type ResolveReportRequest = z.infer<typeof resolveReportRequestSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Review reports query
 */
export const reviewReportsQuerySchema = z
  .object({
    status: z.enum(['pending', 'reviewed', 'resolved', 'dismissed', 'all']).default('pending'),
    targetType: z.enum(['mod', 'user']).optional(),
  })
  .merge(paginationQuerySchema)
  .openapi('ReviewReportsQuery');

export type ReviewReportsQuery = z.infer<typeof reviewReportsQuerySchema>;
