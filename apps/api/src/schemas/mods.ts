import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { mods } from '@craftedtales/db';
import { userSummarySchema } from './users';
import { categorySchema } from './categories';
import { modVersionSchema } from './versions';
import { mediaSchema } from './media';

/**
 * Mod schemas for API validation
 */

// Base schemas from Drizzle
export const selectModSchema = createSelectSchema(mods);
export const insertModSchema = createInsertSchema(mods);

// Public mod (excludes soft-delete fields)
export const modSchema = selectModSchema
  .omit({
    deleted: true,
    deletedAt: true,
  })
  .openapi('Mod');

export type Mod = z.infer<typeof modSchema>;

// Mod with relations (for detail view)
export const modWithRelationsSchema = modSchema.extend({
  owner: userSummarySchema,
  icon: mediaSchema.nullable(),
  categories: z.array(categorySchema),
  versions: z.array(modVersionSchema),
}).openapi('ModWithRelations');

export type ModWithRelations = z.infer<typeof modWithRelationsSchema>;

// Mod summary (for list views)
export const modSummarySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  summary: z.string(),
  iconId: z.string().nullable(),
  status: z.enum(['draft', 'published']),
  visibility: z.enum(['public', 'unlisted', 'private']),
  approved: z.boolean(),
  downloads: z.number().int(),
  likes: z.number().int(),
  owner: userSummarySchema,
  categories: z.array(categorySchema),
  createdAt: z.string(),
  updatedAt: z.string(),
}).openapi('ModSummary');

export type ModSummary = z.infer<typeof modSummarySchema>;

// Create mod request
export const createModRequestSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  summary: z.string().min(10).max(500),
  description: z.string().min(50),
  license: z.string().min(1).max(100),
  licenseUrl: z.string().url().max(255).optional(),
  categoryIds: z.array(z.string().uuid()).min(1).max(5),
  issueTrackerUrl: z.string().url().max(255).optional(),
  sourceCodeUrl: z.string().url().max(255).optional(),
  wikiUrl: z.string().url().max(255).optional(),
  discordInviteUrl: z.string().url().max(255).optional(),
  donationUrls: z.array(z.string().url()).max(5).optional(),
  visibility: z.enum(['public', 'unlisted', 'private']).default('public'),
  // Icon will be uploaded via multipart form
}).openapi('CreateModRequest');

export type CreateModRequest = z.infer<typeof createModRequestSchema>;

// Update mod request
export const updateModRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  summary: z.string().min(10).max(500).optional(),
  description: z.string().min(50).optional(),
  license: z.string().min(1).max(100).optional(),
  licenseUrl: z.string().url().max(255).optional().nullable(),
  categoryIds: z.array(z.string().uuid()).min(1).max(5).optional(),
  issueTrackerUrl: z.string().url().max(255).optional().nullable(),
  sourceCodeUrl: z.string().url().max(255).optional().nullable(),
  wikiUrl: z.string().url().max(255).optional().nullable(),
  discordInviteUrl: z.string().url().max(255).optional().nullable(),
  donationUrls: z.array(z.string().url()).max(5).optional().nullable(),
  visibility: z.enum(['public', 'unlisted', 'private']).optional(),
  status: z.enum(['draft', 'published']).optional(),
}).openapi('UpdateModRequest');

export type UpdateModRequest = z.infer<typeof updateModRequestSchema>;

// Mod filters for list endpoint
export const modFiltersSchema = z.object({
  categoryId: z.string().uuid().optional(),
  status: z.enum(['draft', 'published']).optional(),
  visibility: z.enum(['public', 'unlisted', 'private']).optional(),
  approved: z.coerce.boolean().optional(),
  ownerId: z.string().uuid().optional(),
  search: z.string().max(255).optional(),
  sortBy: z.enum(['downloads', 'likes', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
}).openapi('ModFilters');

export type ModFilters = z.infer<typeof modFiltersSchema>;
