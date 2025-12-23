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

### 2. **Base Drizzle Schemas**

Use `drizzle-zod` to generate base schemas from database tables:

```typescript
// ============================================================================
// Base Drizzle Schemas
// ============================================================================

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
```

**Available functions:**
- `createSelectSchema(table)` — Schema matching SELECT query results
- `createInsertSchema(table)` — Schema for INSERT operations
- `createUpdateSchema(table)` — Schema for UPDATE operations (all fields optional)

### 3. **Public vs Private Schemas**

Always create separate schemas for public and private API responses:

```typescript
// ============================================================================
// Public Schema (external users see this)
// ============================================================================

/**
 * Public user schema - for public profiles
 * Excludes: password, email, emailVerified, twoFactorSecret, deleted
 */
export const publicUserSchema = selectUserSchema
  .omit({
    password: true,
    email: true,
    emailVerified: true,
    twoFactorSecret: true,
    deleted: true,
    deletedAt: true,
  })
  .extend({
    avatar: publicMediaSchema.nullable().optional(),
  })
  .openapi('PublicUser');

export type PublicUser = z.infer<typeof publicUserSchema>;

// ============================================================================
// Private Schema (owner/authenticated user sees this)
// ============================================================================

/**
 * Private user schema - for authenticated user's own profile
 * Includes email but excludes password and internal fields
 */
export const privateUserSchema = selectUserSchema
  .omit({
    password: true,
    twoFactorSecret: true,
    deleted: true,
    deletedAt: true,
  })
  .extend({
    avatar: publicMediaSchema.nullable().optional(),
  })
  .openapi('PrivateUser');

export type PrivateUser = z.infer<typeof privateUserSchema>;
```

**Key principles:**
- **Public schemas** exclude sensitive data (`password`, `email`, `deleted`, etc.)
- **Private schemas** include more data for the resource owner
- Always use `.openapi('SchemaName')` to register in OpenAPI components

### 4. **Summary Schemas for Relations**

Create lightweight schemas for nested relations:

```typescript
/**
 * User summary schema - minimal user info for nested relations (e.g., mod.owner)
 */
export const userSummarySchema = z
  .object({
    id: z.string().uuid(),
    username: z.string(),
    bio: z.string().nullable(),
    avatarId: z.string().uuid().nullable(),
    roles: z.array(z.string()),
  })
  .openapi('UserSummary');

export type UserSummary = z.infer<typeof userSummarySchema>;
```

### 5. **Request Schemas**

Build request schemas by omitting auto-generated fields from insert schemas:

```typescript
// ============================================================================
// Request Schemas
// ============================================================================

export const createModRequestSchema = insertModSchema
  .omit({
    id: true,              // Auto-generated
    ownerId: true,         // Set from auth context
    iconId: true,          // Set via separate upload
    downloads: true,       // Defaults to 0
    likes: true,           // Defaults to 0
    approved: true,        // Defaults to false
    deleted: true,         // Soft-delete field
    deletedAt: true,       // Soft-delete timestamp
    createdAt: true,       // Auto-generated
    updatedAt: true,       // Auto-generated
  })
  .extend({
    // Add fields not in the base table
    categoryIds: z.array(z.string().uuid()).min(1).max(5),
  })
  .openapi('CreateModRequest');

export type CreateModRequest = z.infer<typeof createModRequestSchema>;
```

**Update schemas** should make all fields optional with `.partial()`:

```typescript
export const updateModRequestSchema = insertModSchema
  .omit({
    id: true,
    ownerId: true,
    // ... omit auto-managed fields
  })
  .extend({
    categoryIds: z.array(z.string().uuid()).min(1).max(5).optional(),
  })
  .partial()
  .openapi('UpdateModRequest');

export type UpdateModRequest = z.infer<typeof updateModRequestSchema>;
```

### 6. **Query/Filter Schemas**

Use `z.coerce` for query string parameters (they arrive as strings):

```typescript
export const modFiltersSchema = z
  .object({
    categoryId: z.string().uuid().optional(),
    ownerId: z.string().uuid().optional(),
    search: z.string().max(255).optional(),
    sortBy: z
      .enum(['downloads', 'likes', 'createdAt', 'updatedAt'])
      .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .merge(paginationQuerySchema)  // Reuse common pagination
  .openapi('ModFilters');

export type ModFilters = z.infer<typeof modFiltersSchema>;
```

**Pagination pattern** (from `_shared/common.schemas.ts`):

```typescript
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
  limit: z.coerce.number().int().min(1).max(100).default(20).openapi({ example: 20 }),
});
```

### 7. **Path Parameter Schemas**

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

```typescript
export const errorResponseSchema = z.object({
  error: z.string().openapi({ example: 'Resource not found' }),
  code: z.string().openapi({ example: 'NOT_FOUND' }),
  statusCode: z.number().int().openapi({ example: 404 }),
  details: z.record(z.any()).optional().openapi({
    example: { field: 'email', message: 'Invalid email format' },
  }),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
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
  avatar: publicMediaSchema.nullable(),
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
});
```

### ❌ DON'T: Duplicate schema definitions

```typescript
// ❌ BAD - Duplicating between features
// In mods/mods.schemas.ts
const userSummarySchema = z.object({ id: z.string(), username: z.string() });

// ✅ GOOD - Import from the owning feature
import { userSummarySchema } from '../auth/auth.schemas';
```

---

## 🔗 Cross-Feature Imports

Import shared schemas from `_shared/` and domain schemas from their owning feature:

```typescript
// Shared utilities
import { paginationQuerySchema, errorResponseSchema } from '../_shared/common.schemas';
import { publicMediaSchema } from '../_shared/media.schemas';

// Domain schemas (import from owning feature)
import { userSummarySchema } from '../auth/auth.schemas';
import { categorySchema } from '../categories/categories.schemas';
```

---

## ✅ Schema Checklist

Before committing a schema file, verify:

- [ ] All schemas have corresponding `type` exports using `z.infer<>`
- [ ] Public schemas omit sensitive/internal fields (`password`, `deleted`, etc.)
- [ ] Schemas used in OpenAPI routes call `.openapi('Name')`
- [ ] Query params use `z.coerce` for numeric values
- [ ] Request schemas omit auto-generated fields (`id`, `createdAt`, etc.)
- [ ] Relations use imported schemas, not `z.any()`
- [ ] JSDoc comments explain schema hierarchy
- [ ] Section dividers organize the file
- [ ] No duplicate schemas across features
