import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { modVersions } from '@craftedtales/db';

/**
 * Mod version schemas for API validation
 *
 * Schema hierarchy:
 * - selectModVersionSchema: Base Drizzle schema (all DB fields)
 * - publicModVersionSchema: Public API response (excludes deleted/deletedAt, NO circular mod reference)
 * - ownerModVersionSchema: Owner API response (same as public)
 */

// Base schemas from Drizzle
export const selectModVersionSchema = createSelectSchema(modVersions);
export const insertModVersionSchema = createInsertSchema(modVersions);

/**
 * Public mod version schema - for use in mod.versions array
 * Excludes: deleted, deletedAt
 * Note: Does NOT include mod relation to avoid circular references
 */
export const publicModVersionSchema = selectModVersionSchema
  .omit({
    deleted: true,
    deletedAt: true,
  })
  .openapi('PublicModVersion');

export type PublicModVersion = z.infer<typeof publicModVersionSchema>;

/**
 * Owner mod version schema - for use when the authenticated user is the mod owner
 * Same as publicModVersionSchema (all fields are visible to owner)
 */
export const ownerModVersionSchema = publicModVersionSchema.openapi('OwnerModVersion');

export type OwnerModVersion = z.infer<typeof ownerModVersionSchema>;

// Create version request
export const createModVersionRequestSchema = z.object({
  versionNumber: z.string().regex(/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/), // Semver format
  releaseType: z.enum(['release', 'beta', 'alpha']).default('release'),
  gameVersions: z.array(z.string()).min(1),
  changelog: z.string().optional(),
  // File will be uploaded via multipart form
}).openapi('CreateModVersionRequest');

export type CreateModVersionRequest = z.infer<typeof createModVersionRequestSchema>;

// Update version request
export const updateModVersionRequestSchema = z.object({
  changelog: z.string().optional(),
  releaseType: z.enum(['release', 'beta', 'alpha']).optional(),
}).openapi('UpdateModVersionRequest');

export type UpdateModVersionRequest = z.infer<typeof updateModVersionRequestSchema>;

// Version upload response
export const modVersionUploadResponseSchema = z.object({
  id: z.string().uuid(),
  versionNumber: z.string(),
  url: z.string(),
  size: z.number().int(),
  downloads: z.number().int(),
  releaseType: z.enum(['release', 'beta', 'alpha']),
}).openapi('ModVersionUploadResponse');

export type ModVersionUploadResponse = z.infer<typeof modVersionUploadResponseSchema>;
