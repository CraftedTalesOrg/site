---
applyTo: "apps/api/**/**.openapi.ts"
---

# API OpenAPI Route Definitions (*.openapi.ts) Instructions

This document provides guidelines for creating and maintaining OpenAPI route definitions in the `apps/api` directory. These files define typed routes using `@hono/zod-openapi` that power automatic request/response validation and OpenAPI documentation generation.

---

## 🏗️ Architecture Overview

**Tech Stack:**

- **@hono/zod-openapi** (v0.17+) — OpenAPI-first route definitions
- **Zod** (v3.23+) — Schema validation
- **Hono** (v4.6+) — Web framework

**Purpose:**
OpenAPI files define route specifications including:

- HTTP method and path
- Request validation (params, query, body, headers)
- Response schemas and status codes
- OpenAPI tags for documentation grouping

---

## 📂 File Organization

```
apps/api/src/features/
├── _shared/
│   └── common.schemas.ts    # Shared schemas (imported, not routes)
├── auth/
│   ├── auth.openapi.ts      # Route definitions
│   ├── auth.routes.ts       # Route handlers
│   └── auth.schemas.ts      # Validation schemas
├── mods/
│   ├── mods.openapi.ts
│   ├── mods.routes.ts
│   └── mods.schemas.ts
└── ...
```

**Naming Pattern:**

- File: `{feature}.openapi.ts`
- Located in: `apps/api/src/features/{feature}/`

**Separation of Concerns:**

- `*.schemas.ts` — Zod schemas for validation
- `*.openapi.ts` — Route definitions using `createRoute()`
- `*.routes.ts` — Route handlers using `app.openapi()`
- `*.queries.ts` — Database query functions

---

## 🔧 Core Patterns

### 1. **Imports**

Import `createRoute` and `z` from `@hono/zod-openapi`:

```typescript
import { createRoute, z } from '@hono/zod-openapi';

// Import schemas from the feature's schema file
import {
  publicModSchema,
  createModRequestSchema,
  updateModRequestSchema,
  modFiltersSchema,
} from './mods.schemas';

// Import shared schemas
import {
  errorResponseSchema,
  successResponseSchema,
  slugParamSchema,
  paginationQuerySchema,
  createPaginatedSchema,
} from '../_shared/common.schemas';
```

### 2. **Basic Route Definition**

Use `createRoute()` to define typed routes:

```typescript
/**
 * GET /mods - List mods with filters
 */
export const listModsRoute = createRoute({
  method: 'get',
  path: '/mods',
  request: {
    query: modFiltersSchema,
  },
  responses: {
    200: {
      description: 'List of mods',
      content: { 'application/json': { schema: createPaginatedSchema(publicModSchema) } },
    },
  },
  tags: ['mods'],
});
```

### 3. **Route with Path Parameters**

Use `{paramName}` syntax for path parameters (OpenAPI style, not `:paramName`):

```typescript
/**
 * GET /mods/{slug} - Get single mod
 */
export const getModRoute = createRoute({
  method: 'get',
  path: '/mods/{slug}',
  request: {
    params: slugParamSchema,
  },
  responses: {
    200: {
      description: 'Mod details',
      content: { 'application/json': { schema: publicModSchema } },
    },
    404: {
      description: 'Mod not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['mods'],
});
```

### 4. **Route with Request Body**

```typescript
/**
 * POST /mods - Create new mod
 */
export const createModRoute = createRoute({
  method: 'post',
  path: '/mods',
  request: {
    body: {
      content: {
        'application/json': { schema: createModRequestSchema },
      },
    },
  },
  responses: {
    201: {
      description: 'Mod created',
      content: { 'application/json': { schema: privateModSchema } },
    },
    400: {
      description: 'Validation error',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['mods'],
});
```

### 5. **Optional Request Body**

For routes where the body is optional:

```typescript
export const reviewModRoute = createRoute({
  method: 'post',
  path: '/admin/mods/{id}/{action}',
  request: {
    params: z.object({
      id: z.string().uuid(),
      action: z.enum(['approve', 'reject']),
    }),
    body: {
      content: {
        'application/json': { schema: adminActionSchema },
      },
      required: false, // Body is optional
    },
  },
  responses: {
    200: {
      description: 'Mod reviewed',
      content: { 'application/json': { schema: successResponseSchema } },
    },
  },
  tags: ['admin'],
});
```

### 6. **Multiple Path Parameters**

```typescript
export const userActionRoute = createRoute({
  method: 'post',
  path: '/admin/users/{id}/{action}',
  request: {
    params: z.object({
      id: z.string().uuid(),
      action: z.enum(['suspend', 'unsuspend']),
    }),
  },
  responses: {
    200: {
      description: 'User action completed',
      content: { 'application/json': { schema: successResponseSchema } },
    },
  },
  tags: ['admin'],
});
```

---

## 📋 Response Patterns

### Standard Response Status Codes

Follow these conventions for response status codes:

| Status | Use Case                                | Schema                  |
| ------ | --------------------------------------- | ----------------------- |
| 200    | Successful GET, PATCH, DELETE, actions  | Resource or success     |
| 201    | Successful POST (resource created)      | Created resource        |
| 400    | Validation error, bad request           | `errorResponseSchema`   |
| 401    | Not authenticated                       | `errorResponseSchema`   |
| 403    | Not authorized (forbidden)              | `errorResponseSchema`   |
| 404    | Resource not found                      | `errorResponseSchema`   |
| 409    | Conflict (duplicate slug, email, etc.)  | `errorResponseSchema`   |
| 429    | Rate limit exceeded                     | `errorResponseSchema`   |

### Comprehensive Error Responses

Always include appropriate error responses:

```typescript
export const updateModRoute = createRoute({
  method: 'patch',
  path: '/mods/{slug}',
  request: {
    params: slugParamSchema,
    body: {
      content: {
        'application/json': { schema: updateModRequestSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Mod updated',
      content: { 'application/json': { schema: privateModSchema } },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    403: {
      description: 'Not owner of mod',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    404: {
      description: 'Mod not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['mods'],
});
```

### Paginated Responses

Use the `createPaginatedSchema()` helper for list endpoints:

```typescript
import { createPaginatedSchema, paginationQuerySchema } from '../_shared/common.schemas';

export const listModsRoute = createRoute({
  method: 'get',
  path: '/mods',
  request: {
    query: modFiltersSchema, // Should merge paginationQuerySchema
  },
  responses: {
    200: {
      description: 'List of mods',
      content: { 'application/json': { schema: createPaginatedSchema(publicModSchema) } },
    },
  },
  tags: ['mods'],
});
```

### Wrapped Response Objects

For responses that wrap a resource:

```typescript
export const meRoute = createRoute({
  method: 'get',
  path: '/auth/me',
  responses: {
    200: {
      description: 'Current user profile',
      content: {
        'application/json': {
          schema: z.object({ user: privateUserSchema }),
        },
      },
    },
  },
  tags: ['auth'],
});
```

---

## 🏷️ Tags

Use consistent tags for OpenAPI grouping:

| Tag          | Use Case                           |
| ------------ | ---------------------------------- |
| `auth`       | Authentication routes              |
| `users`      | User profile routes                |
| `mods`       | Mod CRUD and related operations    |
| `categories` | Category listing                   |
| `reports`    | User reports                       |
| `admin`      | Admin-only operations              |

```typescript
export const someRoute = createRoute({
  // ...
  tags: ['mods'], // Always include a tag
});
```

---

## 📝 Documentation Comments

Add JSDoc comments above each route for clarity:

```typescript
/**
 * GET /mods - List mods with filters
 */
export const listModsRoute = createRoute({
  // ...
});

/**
 * POST /mods/{slug}/like - Toggle like on mod
 */
export const likeModRoute = createRoute({
  // ...
});
```

For file-level documentation:

```typescript
/**
 * OpenAPI route definitions for mods feature
 */

export const listModsRoute = createRoute({
  // ...
});
```

---

## 🚨 Common Pitfalls & Best Practices

### ❌ DON'T: Use Hono-style path params

```typescript
// ❌ BAD - Hono style (won't generate correct OpenAPI docs)
path: '/mods/:slug',

// ✅ GOOD - OpenAPI style
path: '/mods/{slug}',
```

### ❌ DON'T: Define schemas inline (unless simple)

```typescript
// ❌ BAD - Complex inline schema
responses: {
  200: {
    content: {
      'application/json': {
        schema: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          // ... many more fields
        }),
      },
    },
  },
},

// ✅ GOOD - Import from schemas file
responses: {
  200: {
    content: { 'application/json': { schema: publicModSchema } },
  },
},
```

**Exception:** Simple wrapper objects are fine inline:

```typescript
// ✅ OK - Simple wrapper
schema: z.object({ user: privateUserSchema }),

// ✅ OK - Simple toggle response
schema: z.object({
  liked: z.boolean(),
  likes: z.number().int(),
}),
```

### ❌ DON'T: Forget error responses

```typescript
// ❌ BAD - Missing error responses
responses: {
  200: { description: 'Success', content: { ... } },
},

// ✅ GOOD - Include all possible error responses
responses: {
  200: { description: 'Success', content: { ... } },
  401: { description: 'Not authenticated', content: { 'application/json': { schema: errorResponseSchema } } },
  404: { description: 'Not found', content: { 'application/json': { schema: errorResponseSchema } } },
},
```

### ❌ DON'T: Mix route definitions with handlers

```typescript
// ❌ BAD - Handler logic in openapi file
export const listModsRoute = createRoute({ ... });
app.openapi(listModsRoute, async (c) => { ... }); // Don't put this here!

// ✅ GOOD - Keep openapi.ts for definitions only, handlers in routes.ts
// mods.openapi.ts
export const listModsRoute = createRoute({ ... });

// mods.routes.ts
import { listModsRoute } from './mods.openapi';
app.openapi(listModsRoute, async (c) => { ... });
```

### ❌ DON'T: Forget to export routes

```typescript
// ❌ BAD - Route not exported
const listModsRoute = createRoute({ ... });

// ✅ GOOD - Always export routes
export const listModsRoute = createRoute({ ... });
```

---

## 🔗 Naming Conventions

### Route Variable Names

Use descriptive names following the pattern `{verb}{Resource}Route`:

| Pattern                    | Example                      |
| -------------------------- | ---------------------------- |
| List resources             | `listModsRoute`              |
| Get single resource        | `getModRoute`                |
| Get by specific field      | `getUserByUsernameRoute`     |
| Create resource            | `createModRoute`             |
| Update resource            | `updateModRoute`             |
| Delete resource            | `deleteModRoute`             |
| Action on resource         | `likeModRoute`               |
| Nested resource list       | `listModVersionsRoute`       |
| Current user               | `getMeRoute`, `updateMeRoute`|

---

## ✅ Route Definition Checklist

Before committing an openapi file, verify:

- [ ] All routes are exported
- [ ] Path parameters use `{param}` syntax (not `:param`)
- [ ] All routes have a `tags` array
- [ ] All routes have descriptive `description` for each response
- [ ] Error responses (401, 403, 404, etc.) are included where appropriate
- [ ] Complex schemas are imported from `*.schemas.ts`, not defined inline
- [ ] JSDoc comments describe each route
- [ ] Routes follow the naming convention `{verb}{Resource}Route`
- [ ] Paginated endpoints use `createPaginatedSchema()`
- [ ] Request body uses `content: { 'application/json': { schema: ... } }` structure
