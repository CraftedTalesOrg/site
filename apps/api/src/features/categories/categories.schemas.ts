import { z } from '@hono/zod-openapi';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { categories } from '@craftedtales/db';

// ─────────────────────────────────────────────────────────────────────────────
// Base
// ─────────────────────────────────────────────────────────────────────────────

export const selectCategorySchema = createSelectSchema(categories);
export const insertCategorySchema = createInsertSchema(categories);

/**
 * Category
 */
export const categorySchema = selectCategorySchema.openapi('Category');

export type Category = z.infer<typeof categorySchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create category request
 */
export const createCategoryRequestSchema = insertCategorySchema
  .omit({
    id: true,
  })
  .openapi('CreateCategoryRequest');

export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>;

/**
 * Update category request
 */
export const updateCategoryRequestSchema = insertCategorySchema
  .omit({
    id: true,
  })
  .partial()
  .openapi('UpdateCategoryRequest');

export type UpdateCategoryRequest = z.infer<typeof updateCategoryRequestSchema>;
