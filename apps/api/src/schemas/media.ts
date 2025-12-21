import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { media } from '@craftedtales/db';

/**
 * Media schemas for API validation
 *
 * Schema hierarchy:
 * - selectMediaSchema: Base Drizzle schema (all DB fields)
 * - publicMediaSchema: Public API response (excludes deleted/deletedAt)
 * - ownerMediaSchema: Owner API response (same as public)
 */

// Base schemas from Drizzle
export const selectMediaSchema = createSelectSchema(media);
export const insertMediaSchema = createInsertSchema(media);

/**
 * Public media schema - for use in avatar, icon relations
 * Excludes: deleted, deletedAt
 */
export const publicMediaSchema = selectMediaSchema
  .omit({
    deleted: true,
    deletedAt: true,
  })
  .openapi('PublicMedia');

export type PublicMedia = z.infer<typeof publicMediaSchema>;

/**
 * Owner media schema - for use when the authenticated user is the uploader
 * Same as publicMediaSchema (all fields are visible to owner)
 */
export const ownerMediaSchema = publicMediaSchema.openapi('OwnerMedia');

export type OwnerMedia = z.infer<typeof ownerMediaSchema>;

// Media upload response
export const mediaUploadResponseSchema = z.object({
  id: z.string().uuid(),
  url: z.string(),
  filename: z.string(),
  size: z.number().int(),
  mimeType: z.string(),
}).openapi('MediaUploadResponse');

export type MediaUploadResponse = z.infer<typeof mediaUploadResponseSchema>;
