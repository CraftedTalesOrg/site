import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { media } from '@craftedtales/db';

/**
 * Media schemas for API validation
 *
 * Schema hierarchy:
 * - selectMediaSchema: Base Drizzle schema (all DB fields)
 * - publicMediaSchema: Public API response (excludes deleted/deletedAt)
 */

// ============================================================================
// Base Drizzle Schema
// ============================================================================

export const selectMediaSchema = createSelectSchema(media);

// ============================================================================
// Public Media Schema
// ============================================================================

export const publicMediaSchema = selectMediaSchema
  .omit({
    deleted: true,
    deletedAt: true,
  })
  .openapi('PublicMedia');

export type PublicMedia = z.infer<typeof publicMediaSchema>;
