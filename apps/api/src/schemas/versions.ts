import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { modVersions } from '@craftedtales/db';

/**
 * Mod version schemas for API validation
 */

// Base schemas from Drizzle
export const selectModVersionSchema = createSelectSchema(modVersions);
export const insertModVersionSchema = createInsertSchema(modVersions);

// Public mod version (excludes soft-delete fields)
export const modVersionSchema = selectModVersionSchema
  .omit({
    deleted: true,
    deletedAt: true,
  })
  .openapi('ModVersion');

export type ModVersion = z.infer<typeof modVersionSchema>;

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
