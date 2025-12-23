import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { reports } from '@craftedtales/db';
import { paginationQuerySchema } from '../_shared/common.schemas';

/**
 * Admin mods query schema - for review queue
 */
export const adminModsQuerySchema = z
  .object({
    approved: z.enum(['true', 'false', 'all']).default('false'),
  })
  .merge(paginationQuerySchema);

export type AdminModsQuery = z.infer<typeof adminModsQuerySchema>;

/**
 * Report resolve schema
 */
export const reportResolveSchema = z
  .object({
    resolution: z.enum(['resolved', 'dismissed']),
    notes: z.string().max(2000).optional(),
  })
  .openapi('ReportResolve');

export type ReportResolve = z.infer<typeof reportResolveSchema>;

// Base Drizzle schema
export const selectReportSchema = createSelectSchema(reports);

/**
 * Admin report schema - for list/detail views
 * Excludes: deletedAt (reports are not soft-deleted)
 */
export const adminReportSchema = selectReportSchema
  .omit({
    deletedAt: true,
  })
  .openapi('AdminReport');

export type AdminReport = z.infer<typeof adminReportSchema>;

/**
 * Admin list reports query schema
 */
export const adminReportsQuerySchema = z
  .object({
    status: z.enum(['pending', 'reviewed', 'resolved', 'dismissed', 'all']).default('pending'),
    targetType: z.enum(['mod', 'user']).optional(),
  })
  .merge(paginationQuerySchema);

export type AdminReportsQuery = z.infer<typeof adminReportsQuerySchema>;

/**
 * Mod/User action schema
 */
export const adminActionSchema = z.object({
  reason: z.string().min(1).max(500).optional(),
});

export type AdminAction = z.infer<typeof adminActionSchema>;
