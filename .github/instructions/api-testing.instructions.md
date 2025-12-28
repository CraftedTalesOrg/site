---
applyTo: "apps/api/**/*.test.ts"
---

# API Testing (*.test.ts) Instructions

This document provides guidelines for writing and maintaining API integration tests in the `apps/api` directory. Tests run inside the Cloudflare Workers runtime using Vitest and `@cloudflare/vitest-pool-workers`, with isolated per-test storage for D1, KV, and R2 bindings.

---

## 🏗️ Architecture Overview

**Tech Stack:**

- **Vitest** (v3.2+) — Test runner
- **@cloudflare/vitest-pool-workers** — Workers runtime test pool
- **Hono** — `app.request()` for testing routes
- **D1/KV/R2** — Real bindings with isolated storage per test

**Purpose:**
Test files validate API endpoint behavior including:

- Request/response validation
- Authentication and authorization
- Business logic correctness
- Error handling and edge cases

---

## 📂 File Organization

```
apps/api/test/
├── env.d.ts                    # Test environment types
├── setup.ts                    # Global setup (migrations)
├── factories/
│   └── index.ts                # Test data factories
├── helpers/
│   └── auth.ts                 # Authentication helpers
└── features/
    ├── auth/
    │   ├── register.test.ts    # One test file per endpoint
    │   ├── login.test.ts
    │   └── ...
    ├── mods/
    │   ├── list-mods.test.ts
    │   ├── get-mod.test.ts
    │   └── ...
    └── ...
```

**Naming Pattern:**

- File: `{endpoint-name}.test.ts` (kebab-case, matches route action)
- Located in: `apps/api/test/features/{feature}/`
- One test file per endpoint (e.g., `register.test.ts` for POST `/auth/register`)

---

## 🔧 Core Patterns

### 1. **Imports**

Always import from `vitest` and `cloudflare:test`:

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser } from '../../factories';
import { authenticatedRequest } from '../../helpers/auth';
```

### 2. **Test Structure**

Use a consistent describe/it structure per endpoint:

```typescript
describe('POST /api/v1/auth/register', () => {
  describe('success cases', () => {
    it('should register a new user with valid data', async () => {
      // Test implementation
    });
  });

  describe('validation errors', () => {
    it('should reject invalid email format', async () => {
      // Test implementation
    });

    it('should reject password shorter than 8 characters', async () => {
      // Test implementation
    });
  });

  describe('business logic errors', () => {
    it('should reject duplicate email', async () => {
      // Test implementation
    });
  });
});
```

### 3. **Making Requests with `app.request()`**

Use Hono's built-in `app.request()` method with the `env` from `cloudflare:test`:

```typescript
// GET request
const res = await app.request('/api/v1/mods', {}, env);

// POST request with JSON body
const res = await app.request('/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    username: 'testuser',
    password: 'SecurePass123!',
  }),
}, env);

// Request with path parameters
const res = await app.request('/api/v1/mods/my-cool-mod', {}, env);

// Request with query parameters
const res = await app.request('/api/v1/mods?page=1&limit=10&status=published', {}, env);
```

### 4. **Asserting Responses**

Always check status code first, then parse and validate the body with proper TypeScript types:

```typescript
// Success response - ALWAYS type res.json() with the expected response type
import type { PublicUser } from '../../../src/features/users/users.schemas';

expect(res.status).toBe(200);
const data = await res.json<PublicUser>();
expect(data.email).toBe('test@example.com');

// Error response - use ErrorResponse or SuccessResponse types
import type { ErrorResponse } from '../../../src/features/_shared/common.schemas';

expect(res.status).toBe(400);
const error = await res.json<ErrorResponse>();
expect(error.code).toBe('VALIDATION_ERROR');
expect(error.message).toBeDefined();
```

**CRITICAL:** Always import and use the appropriate TypeScript types for `res.json<Type>()` calls. This ensures type safety and catches response shape mismatches at compile time.

### 5. **Using Factories**

Use factory functions to create test data. Factories insert records directly into D1:

```typescript
import { createTestUser, createTestMod, createTestCategory } from '../../factories';

describe('GET /api/v1/mods/{slug}', () => {
  it('should return a mod by slug', async () => {
    // Arrange: Create test data
    const user = await createTestUser(env, { username: 'modauthor' });
    const category = await createTestCategory(env, { name: 'Tools' });
    const mod = await createTestMod(env, {
      authorId: user.id,
      categoryIds: [category.id],
      slug: 'awesome-mod',
      status: 'published',
    });

    // Act: Make request
    const res = await app.request(`/api/v1/mods/${mod.slug}`, {}, env);

    // Assert: Check response
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.slug).toBe('awesome-mod');
    expect(data.author.username).toBe('modauthor');
  });
});
```

### 6. **Authenticated Requests**

Use the `authenticatedRequest` helper for protected endpoints:

```typescript
import { authenticatedRequest } from '../../helpers/auth';

describe('POST /api/v1/mods', () => {
  it('should create a mod for authenticated user', async () => {
    const user = await createTestUser(env, { roles: ['user'] });

    const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
      method: 'POST',
      body: JSON.stringify({
        title: 'My New Mod',
        slug: 'my-new-mod',
        summary: 'A great mod',
      }),
    });

    expect(res.status).toBe(201);
  });

  it('should reject unauthenticated request', async () => {
    const res = await app.request('/api/v1/mods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'My Mod' }),
    }, env);

    expect(res.status).toBe(401);
  });
});
```

### 7. **Testing Role-Based Access**

Test authorization with different user roles:

```typescript
describe('GET /api/v1/mods/review-queue', () => {
  it('should allow admin access', async () => {
    const admin = await createTestUser(env, { roles: ['admin'] });
    const res = await authenticatedRequest(app, env, admin, '/api/v1/mods/review-queue');
    expect(res.status).toBe(200);
  });

  it('should allow moderator access', async () => {
    const mod = await createTestUser(env, { roles: ['moderator'] });
    const res = await authenticatedRequest(app, env, mod, '/api/v1/mods/review-queue');
    expect(res.status).toBe(200);
  });

  it('should deny regular user access', async () => {
    const user = await createTestUser(env, { roles: ['user'] });
    const res = await authenticatedRequest(app, env, user, '/api/v1/mods/review-queue');
    expect(res.status).toBe(403);
  });
});
```

---

## 🏭 Factory Conventions

### Factory Function Signature

All factories follow this pattern:

```typescript
export async function createTestUser(
  env: ProvidedEnv,
  overrides?: Partial<UserOverrides>,
): Promise<User> {
  // Merge defaults with overrides
  // Insert into database
  // Return created entity
}
```

### Available Factories

| Factory | Returns | Common Overrides |
|---------|---------|------------------|
| `createTestUser` | `User` | `email`, `username`, `roles`, `emailVerified` |
| `createTestCategory` | `Category` | `name`, `slug` |
| `createTestMod` | `Mod` | `authorId`, `slug`, `status`, `categoryIds` |
| `createTestReport` | `Report` | `reporterId`, `targetType`, `targetId`, `reason` |

### Factory Best Practices

- **Use meaningful overrides** — Only override fields relevant to the test
- **Generate unique values** — Factories auto-generate unique emails, usernames, slugs
- **Return full entity** — Factories return the complete database record with `id`

---

## 🚨 Critical Rules

### ✅ DO

- **One endpoint per file** — Keep tests focused and maintainable
- **Test both success and error cases** — Cover happy path and edge cases
- **Use descriptive test names** — Clearly state what is being tested
- **Arrange-Act-Assert** — Structure each test with clear phases
- **Test response shape** — Verify the structure matches OpenAPI schemas
- **Use factories** — Never insert raw SQL in tests

### ❌ DON'T

- **Share mutable state** — Each test gets isolated storage automatically
- **Depend on test order** — Tests must be independent
- **Test implementation details** — Test behavior, not internal functions
- **Skip status code checks** — Always verify HTTP status before body
- **Hardcode IDs** — Use factory-returned IDs
- **Mock bindings unnecessarily** — Real bindings are available via `env`

---

## 📋 Test Categories Checklist

For each endpoint, consider testing:

### Success Cases
- [ ] Valid request returns expected status and body
- [ ] Pagination works correctly (for list endpoints)
- [ ] Filtering works correctly (for list endpoints)
- [ ] Created/updated entity is persisted correctly

### Validation Errors (400)
- [ ] Missing required fields
- [ ] Invalid field formats (email, URL, etc.)
- [ ] Field length violations (min/max)
- [ ] Invalid enum values

### Authentication Errors (401)
- [ ] Missing Authorization header
- [ ] Invalid/expired JWT token

### Authorization Errors (403)
- [ ] User lacks required role
- [ ] User not owner of resource

### Not Found Errors (404)
- [ ] Resource with given ID/slug doesn't exist

### Conflict Errors (409)
- [ ] Duplicate unique field (email, username, slug)

### Rate Limiting (429)
- [ ] Exceeds rate limit (for rate-limited endpoints)

---

## 🔗 Related Files

- `apps/api/vitest.config.ts` — Vitest configuration
- `apps/api/test/setup.ts` — Global test setup
- `apps/api/test/factories/index.ts` — Test data factories
- `apps/api/test/helpers/auth.ts` — Authentication helpers
- `apps/api/test/env.d.ts` — Test environment types
