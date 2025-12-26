---
applyTo: "apps/api/**/**.schemas.ts"
---

# API Schema Files (*.schemas.ts) Instructions

This document provides guidelines for creating and maintaining Zod validation schemas in the `apps/api` directory. These schemas power OpenAPI documentation, request/response validation, and type inference for the CraftedTales API.

---

## 🏗️ Architecture Overview

**Tech Stack:**
- **Zod** (v3.23+) — Schema validation library
- **@hono/zod-openapi** (v0.17+) — OpenAPI integration for Hono
- **drizzle-zod** (v0.5+) — Generates Zod schemas from Drizzle ORM tables

**Purpose:**
Schema files define validation schemas for:
- API request bodies, query params, and path params
- API response shapes (public/private views)
- OpenAPI documentation generation via `.openapi()` method

---

## 📂 File Organization

```
apps/api/src/features/
├── _shared/
│   ├── common.schemas.ts    # Pagination, errors, shared params
│   └── media.schemas.ts     # Media/image response schemas
├── auth/
│   └── auth.schemas.ts      # User schemas, login/register requests
├── categories/
│   └── categories.schemas.ts
├── mods/
│   └── mods.schemas.ts
└── reports/
    └── reports.schemas.ts
```

**Naming Pattern:**
- File: `{feature}.schemas.ts`
- Located in: `apps/api/src/features/{feature}/`

---

## 🔧 Core Patterns

### 1. **Imports**

Always import from `@hono/zod-openapi` or `zod` (prefer the former for OpenAPI compatibility):

```typescript
// ✅ CORRECT - Use z from @hono/zod-openapi for full OpenAPI support
import { z } from '@hono/zod-openapi';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { tableName } from '@craftedtales/db';

// ❌ WRONG - Don't use plain zod when OpenAPI metadata is needed
import { z } from 'zod';
```

### 2. **File Structure & Section Dividers**

Schema files follow a consistent structure with clear section dividers:

```typescript
// ─────────────────────────────────────────────────────────────────────────────
// Base
// ─────────────────────────────────────────────────────────────────────────────

// Base drizzle schemas and derived response schemas

// ─────────────────────────────────────────────────────────────────────────────
// Mutations (or "Requests" for auth-related features)
// ─────────────────────────────────────────────────────────────────────────────

// Create/Update request schemas

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

// Filter and list query schemas

// ─────────────────────────────────────────────────────────────────────────────
// Responses
// ─────────────────────────────────────────────────────────────────────────────

// Custom response schemas (optional, only if needed)
```

### 3. **Base Schemas**

Use `drizzle-zod` to generate base schemas, then derive public/private response schemas:

```typescript
// ─────────────────────────────────────────────────────────────────────────────
// Base
// ─────────────────────────────────────────────────────────────────────────────

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);

/**
 * Public user
 */
export const publicUserSchema = selectUserSchema
  .omit({
    password: true,
    email: true,
    emailVerified: true,
    twoFactorEnabled: true,
    twoFactorSecret: true,
    enabled: true,
    deleted: true,
    updatedAt: true,
    deletedAt: true,
    avatarId: true,
    roles: true,
  })
  .extend({
    avatar: mediaSchema.nullable(),
  })
  .openapi('PublicUser');

export type PublicUser = z.infer<typeof publicUserSchema>;

/**
 * Private user
 */
export const privateUserSchema = selectUserSchema
  .omit({
    password: true,
    emailVerified: true,
    twoFactorSecret: true,
    enabled: true,
    deleted: true,
    deletedAt: true,
    avatarId: true,
  })
  .extend({
    avatar: mediaSchema.nullable(),
  })
  .openapi('PrivateUser');

export type PrivateUser = z.infer<typeof privateUserSchema>;
```

**Key principles:**
- **Public schemas** exclude sensitive data (`password`, `email`, `deleted`, internal flags, etc.)
- **Private schemas** include more data for the resource owner
- Replace foreign key IDs (e.g., `avatarId`) with resolved relations (e.g., `avatar: mediaSchema.nullable()`)
- Always use `.openapi('SchemaName')` to register in OpenAPI components

### 4. **Simple Entity Schemas**

For entities without public/private distinction, derive directly from base:

```typescript
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
```

### 5. **Mutation Schemas**

Build create/update request schemas using `.pick()` or `.omit()`:

**Using `.pick()` (preferred for create requests):**
```typescript
// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create report request
 */
export const createReportRequestSchema = insertReportSchema
  .pick({
    targetType: true,
    targetId: true,
    reason: true,
    description: true,
  })
  .openapi('CreateReportRequest');

export type CreateReportRequest = z.infer<typeof createReportRequestSchema>;
```

**Using `.omit()` + `.partial()` (for update requests):**
```typescript
/**
 * Update profile request
 */
export const updateProfileRequestSchema = insertUserSchema
  .omit({
    id: true,
    password: true,
    emailVerified: true,
    twoFactorSecret: true,
    enabled: true,
    deleted: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    roles: true,
  })
  .partial()
  .openapi('UpdateProfileRequest');

export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;
```

**Standalone request schemas (for auth flows):**
```typescript
/**
 * Login request
 */
export const loginRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .openapi('LoginRequest');

export type LoginRequest = z.infer<typeof loginRequestSchema>;
```

### 6. **Query Schemas**

Use `z.coerce` for numeric query parameters and `.merge()` for pagination:

```typescript
// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * List mods query
 */
export const listModsQuerySchema = z
  .object({
    categories: z.array(categorySchema).optional(),
    gameVersions: z.array(z.string().max(50)).optional(),
    search: z.string().max(255).optional(),
    sortBy: z
      .enum(['downloads', 'likes', 'createdAt', 'updatedAt'])
      .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .merge(paginationQuerySchema)
  .openapi('ListModsQuery');

export type ListModsQuery = z.infer<typeof listModsQuerySchema>;
```

**Pagination pattern** (from `_shared/common.schemas.ts`):

```typescript
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
  limit: z.coerce.number().int().min(1).max(100).default(20).openapi({ example: 20 }),
});
```

### 7. **Response Schemas**

Create custom response schemas when needed for specific endpoints:

```typescript
// ─────────────────────────────────────────────────────────────────────────────
// Responses
// ─────────────────────────────────────────────────────────────────────────────

export const authResponseSchema = z
  .object({
    user: privateUserSchema,
    sessionId: z.string(),
  })
  .openapi('AuthResponse');

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const likeToggleResponseSchema = z
  .object({
    liked: z.boolean(),
    likes: z.number().int(),
  })
  .openapi('LikeToggleResponse');

export type LikeToggleResponse = z.infer<typeof likeToggleResponseSchema>;
```

### 8. **Path Parameter Schemas**

Define in `_shared/common.schemas.ts` for reuse:

```typescript
export const slugParamSchema = z.object({
  slug: z.string().min(1).max(255).openapi({ example: 'advanced-building-mod' }),
});

export type SlugParam = z.infer<typeof slugParamSchema>;

export const usernameParamSchema = z.object({
  username: z.string().min(1).max(50).openapi({ example: 'johndoe' }),
});

export type UsernameParam = z.infer<typeof usernameParamSchema>;
```

---

## 🎯 OpenAPI Metadata

### Adding OpenAPI Examples

Use `.openapi()` method for field-level and schema-level metadata:

```typescript
// Field-level examples
const userSchema = z.object({
  id: z.string().uuid().openapi({ example: '550e8400-e29b-41d4-a716-446655440000' }),
  username: z.string().openapi({ example: 'johndoe' }),
  email: z.string().email().openapi({ example: 'john@example.com' }),
});

// Schema-level registration (creates reusable component)
export const publicUserSchema = userSchema.openapi('PublicUser');
```

### Response Schemas with Error Types

Located in `_shared/common.schemas.ts`:

```typescript
export const errorResponseSchema = z.object({
  error: z.string().openapi({ example: 'Resource not found' }),
  code: z.string().openapi({ example: 'NOT_FOUND' }),
  details: z.record(z.any()).optional().openapi({
    example: { field: 'email', message: 'Invalid email format' },
  }),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const successResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().optional().openapi({ example: 'Operation completed successfully' }),
});

export type SuccessResponse = z.infer<typeof successResponseSchema>;
```

---

## 🚨 Common Pitfalls & Best Practices

### ❌ DON'T: Forget to export types

```typescript
// ❌ BAD - No type export
export const userSchema = z.object({ ... });

// ✅ GOOD - Always export inferred type
export const userSchema = z.object({ ... });
export type User = z.infer<typeof userSchema>;
```

### ❌ DON'T: Use `z.any()` for typed relations

```typescript
// ❌ BAD - Loses type safety
.extend({
  avatar: z.any().nullable(),
})

// ✅ GOOD - Use proper schema reference
.extend({
  avatar: mediaSchema.nullable(),
})
```

### ❌ DON'T: Forget `.openapi()` for schemas used in routes

```typescript
// ❌ BAD - Won't appear in OpenAPI docs as named component
export const userSchema = z.object({ ... });

// ✅ GOOD - Registered as reusable component
export const userSchema = z.object({ ... }).openapi('User');
```

### ❌ DON'T: Include sensitive fields in public schemas

```typescript
// ❌ BAD - Exposes sensitive data
export const publicUserSchema = selectUserSchema; // Includes password!

// ✅ GOOD - Explicitly omit sensitive fields
export const publicUserSchema = selectUserSchema.omit({
  password: true,
  email: true,
  deleted: true,
  enabled: true,
});
```

### ❌ DON'T: Keep foreign key IDs when relation is extended

```typescript
// ❌ BAD - Returns both avatarId and avatar object
export const publicUserSchema = selectUserSchema
  .extend({
    avatar: mediaSchema.nullable(),
  });

// ✅ GOOD - Omit the ID, keep only the resolved relation
export const publicUserSchema = selectUserSchema
  .omit({
    avatarId: true,
  })
  .extend({
    avatar: mediaSchema.nullable(),
  });
```

### ❌ DON'T: Duplicate schema definitions

```typescript
// ❌ BAD - Duplicating between features
// In mods/mods.schemas.ts
const mediaSchema = z.object({ id: z.string(), url: z.string() });

// ✅ GOOD - Import from the owning feature
import { mediaSchema } from '../_shared/media.schemas';
```

---

## 🔗 Cross-Feature Imports

Import shared schemas from `_shared/` and domain schemas from their owning feature:

```typescript
// Shared utilities
import { paginationQuerySchema, errorResponseSchema } from '../_shared/common.schemas';
import { mediaSchema } from '../_shared/media.schemas';

// Domain schemas (import from owning feature)
import { publicUserSchema, privateUserSchema } from '../auth/auth.schemas';
import { categorySchema } from '../categories/categories.schemas';
```

---

## ✅ Schema Checklist

Before committing a schema file, verify:

- [ ] All schemas have corresponding `type` exports using `z.infer<>`
- [ ] Public schemas omit sensitive/internal fields (`password`, `deleted`, `enabled`, etc.)
- [ ] Foreign key IDs are omitted when extended with resolved relations
- [ ] Schemas used in OpenAPI routes call `.openapi('Name')`
- [ ] Query params use `z.coerce` for numeric values
- [ ] Request schemas use `.pick()` or `.omit()` to select only needed fields
- [ ] Update request schemas use `.partial()` to make fields optional
- [ ] Relations use imported schemas, not `z.any()`
- [ ] JSDoc comments describe each schema
- [ ] Section dividers (Base, Mutations/Requests, Queries, Responses) organize the file
- [ ] No duplicate schemas across features
