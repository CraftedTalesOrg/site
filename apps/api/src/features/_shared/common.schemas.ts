import { z } from '@hono/zod-openapi';

// ─────────────────────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────────────────────

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
  limit: z.coerce.number().int().min(1).max(100).default(20).openapi({ example: 20 }),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

/**
 * Creates a paginated response schema for a given data schema.
 * Use this to wrap API responses that return paginated data.
 */
export function createPaginatedSchema<T extends z.ZodTypeAny>(
  dataSchema: T,
): z.ZodObject<{
  data: z.ZodArray<T>;
  totalItems: z.ZodNumber;
}> {
  return z.object({
    data: z.array(dataSchema),
    totalItems: z.number().int().openapi({ example: 87 }),
  });
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Response Types
// ─────────────────────────────────────────────────────────────────────────────

export const errorResponseSchema = z.object({
  error: z.string().openapi({ example: 'Resource not found' }),
  code: z.string().openapi({ example: 'NOT_FOUND' }),
  details: z.record(z.any()).optional().openapi({
    example: { field: 'email', message: 'Invalid email format' },
  }),
}).openapi('ErrorResponse');

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const successResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().optional().openapi({ example: 'Operation completed successfully' }),
}).openapi('SuccessResponse');

export type SuccessResponse = z.infer<typeof successResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Parameter Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const slugParamSchema = z.object({
  slug: z.string().min(1).max(255).openapi({ example: 'advanced-building-mod' }),
});

export type SlugParam = z.infer<typeof slugParamSchema>;

export const usernameParamSchema = z.object({
  username: z.string().min(1).max(50).openapi({ example: 'johndoe' }),
});

export type UsernameParam = z.infer<typeof usernameParamSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// File Upload Constants
// ─────────────────────────────────────────────────────────────────────────────

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB for mods
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB for images

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
export const ALLOWED_MOD_TYPES = ['application/zip', 'application/x-zip-compressed'];
