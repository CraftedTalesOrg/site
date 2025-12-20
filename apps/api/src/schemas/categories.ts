import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { categories } from '@craftedtales/db';

/**
 * Category schemas for API validation
 */

// Base schemas from Drizzle
export const selectCategorySchema = createSelectSchema(categories);
export const insertCategorySchema = createInsertSchema(categories);

// Public category (full info)
export const categorySchema = selectCategorySchema.openapi('Category');

export type Category = z.infer<typeof categorySchema>;

// Create category request (admin only)
export const createCategoryRequestSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
}).openapi('CreateCategoryRequest');

export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>;

// Update category request (admin only)
export const updateCategoryRequestSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(500).optional(),
}).openapi('UpdateCategoryRequest');

export type UpdateCategoryRequest = z.infer<typeof updateCategoryRequestSchema>;
