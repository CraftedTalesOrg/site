import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { reports } from '@craftedtales/db';

/**
 * Report schemas for API validation
 *
 * Schema hierarchy:
 * - selectReportSchema: Base Drizzle schema (all DB fields)
 * - reportSchema: Public API response (for admin use)
 */

// ============================================================================
// Base Drizzle Schema
// ============================================================================

export const selectReportSchema = createSelectSchema(reports);

// ============================================================================
// Public Report Schema
// ============================================================================

/**
 * Public report schema - for admin use
 * Excludes: none (all fields visible to admins)
 */
export const reportSchema = selectReportSchema.openapi('PublicReport');

export type Report = z.infer<typeof reportSchema>;

// ============================================================================
// Request Schemas
// ============================================================================

export const createReportRequestSchema = z
  .object({
    targetType: z.enum(['mod', 'user']),
    targetId: z.string().uuid(),
    reason: z.string().min(1).max(100),
    description: z.string().min(10).max(2000),
  })
  .openapi('CreateReportRequest');

export type CreateReportRequest = z.infer<typeof createReportRequestSchema>;
