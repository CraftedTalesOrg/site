---
applyTo: "packages/db/**,apps/api/**/*.queries.ts"
---

# Database & Query Layer Instructions

This document covers the Drizzle ORM database layer (`@craftedtales/db`) and the query functions in the API (`apps/api/src/features/**/*.queries.ts`). Both work together to provide type-safe database access.

---

## 🏗️ Architecture Overview

**Tech Stack:**
- **Drizzle ORM v1.0.0-beta** (new relations API)
- **Cloudflare D1** (serverless SQLite at the edge)
- **TypeScript** (strict mode)

**Core Concepts:**
- Schema files define tables using `sqliteTable` (in `packages/db`)
- Relations are defined separately in `relations.ts` using `defineRelations`
- Migrations are generated via `drizzle-kit` and stored in `drizzle/`
- Query functions encapsulate database operations (in `apps/api/src/features/**/*.queries.ts`)
- The `createDb` function wraps D1 bindings with schema context

---

## 📂 File Organization

### Database Package (`packages/db`)

```
packages/db/src/schema/
├── users.ts           # User accounts, roles, email/password
├── categories.ts      # Mod categories/tags (name, slug)
├── mods.ts            # Mods table + mod_categories junction table
├── modVersions.ts     # Mod releases, changelogs, downloads
├── media.ts           # Image storage (avatars, mod icons)
├── interactions.ts    # mod_likes, reports
├── relations.ts       # Drizzle relational mappings
└── column.helpers.ts  # Reusable patterns (timestamps, state)
```

### API Query Files (`apps/api/src/features/*/*.queries.ts`)

```
apps/api/src/features/
├── auth/
│   └── auth.queries.ts        # User auth queries (login, register)
├── users/
│   └── users.queries.ts       # User profile queries
├── mods/
│   └── mods.queries.ts        # Mod CRUD queries
├── categories/
│   └── categories.queries.ts  # Category listing queries
├── reports/
│   └── reports.queries.ts     # Report submission queries
└── admin/
    └── admin.queries.ts       # Admin moderation queries
```

**Key Design Patterns:**
- **Domain separation:** Each file handles one domain (users, mods, media, etc.)
- **Junction tables:** Many-to-many relationships use explicit junction tables (e.g., `mod_categories`)
- **Reusable columns:** `timestamps` and `state` helpers are spread into tables
- **UUIDs:** All primary keys use `crypto.randomUUID()`

---

## 🚨 Critical Rules & Common Pitfalls

### 1. **Relation Name Collisions**
✅ **Best Practice:** Foreign key columns should end with `Id`, allowing relations to use cleaner names:
```typescript
// ✅ GOOD - FK column ends with Id, relation has clean name
users: {
  avatarId: text().references(() => media.id),
}

// Relation uses the clean name
users: {
  avatar: r.one.media({ from: r.users.avatarId, to: r.media.id })
}
```

**Naming pattern in this codebase:**
- `users.avatarId` (column) → `users.avatar` (relation)
- `mods.iconId` (column) → `mods.icon` (relation)
- `mods.ownerId` (column) → `mods.owner` (relation)

### 2. **Many-to-Many Relations Pattern**
For many-to-many relationships, define the junction table in the same file as the primary entity using composite primary key:

```typescript
// In mods.ts
export const modCategories = sqliteTable('mod_categories',
  {
    modId: text().notNull().references(() => mods.id, { onDelete: 'cascade' }),
    categoryId: text().notNull().references(() => categories.id, { onDelete: 'cascade' }),
  },
  t => [primaryKey({ columns: [t.modId, t.categoryId] })],
);
```

Then in `relations.ts`, define the direct many-to-many relations using `.through()` syntax:
```typescript
mods: {
  categories: r.many.categories({
    from: r.mods.id.through(r.modCategories.modId),
    to: r.categories.id.through(r.modCategories.categoryId),
  }),
  versions: r.many.modVersions({
    where: { deleted: false },
  }),
},
```

**Access pattern:**
```typescript
// Get categories for a mod (direct access, no junction table in response)
const mod = await db.query.mods.findFirst({
  with: {
    categories: true,  // Direct access to categories array
  }
});
// Access: mod.categories[]  (no junction table visible)
```

### 3. **Referential Integrity**
Always use `onDelete: 'cascade'` for child foreign keys:
```typescript
modId: text().notNull().references(() => mods.id, { onDelete: 'cascade' })
```

### 4. **Column Helpers**
Use spread operators for shared columns:
```typescript
import { timestamps, state } from './column.helpers';

export const mods = sqliteTable('mods', {
  // ... other columns
  ...state,       // adds: enabled (boolean), deleted (boolean)
  ...timestamps,  // adds: createdAt, updatedAt, deletedAt
});
```

### 5. **Soft-Delete Pattern**

**Tables with soft-delete**: `users`, `mods`, `modVersions`, `media`
- All have `deleted` boolean and `deletedAt` timestamp via `state` and `timestamps` helpers
- When deleted, set BOTH `deleted = true` AND `deletedAt = new Date()` instead of removing the record
- **IMPORTANT**: Drizzle does NOT automatically filter soft-deleted records

**Foreign Key Behavior:**
- **Categories** → Hard delete (cascade removes from all mods)
- **mod_likes.userId** → `SET NULL` on user delete (preserves like count, anonymizes user)
- **reports.reporterId/reviewedBy** → `SET NULL` on user delete (preserves report history)

**API Layer Responsibilities:**
```typescript
// ✅ ALWAYS filter soft-deleted records in queries (simple object notation)
const activeUsers = await db.query.users.findMany({
  where: { deleted: false }
});

// ✅ Filter in relations
const mods = await db.query.mods.findMany({
  where: { deleted: false },
  with: {
    owner: {
      where: { deleted: false }
    },
    icon: {
      where: { deleted: false }
    },
  },
});

// ✅ Count active likes only (exclude deleted users)
const activeLikes = await db.select({ count: count() })
  .from(modLikes)
  .where(and(
    eq(modLikes.modId, modId),
    isNotNull(modLikes.userId) // Exclude likes from deleted users
  ));

// ✅ To soft-delete (set BOTH fields):
await db.update(users)
  .set({ 
    deleted: true,
    deletedAt: new Date()
  })
  .where(eq(users.id, userId));
```

---

## 🔄 Migration Workflow

### Adding/Modifying Schema

1. **Edit schema files** in `src/schema/*.ts`
2. **Generate migration:**
   ```bash
   cd packages/db
   pnpm generate
   ```
3. **Review generated SQL** in `drizzle/YYYYMMDDHHMMSS_*/migration.sql`
4. **Push to D1:**
   ```bash
   pnpm push  # for local dev
   # OR
   npx drizzle-kit migrate  # for production
   ```
5. **Commit both schema AND migration files**

### Before Generating Migrations
- Run `pnpm lint` to catch TypeScript errors
- Ensure relations in `relations.ts` match your schema changes
- Check for relation name collisions (see Rule #1)

---

## 🧪 Testing Schema Changes

After modifying schema, validate:
1. **Lint check:** `pnpm lint` (in db package)
2. **Generate migration:** `pnpm generate` (should succeed without errors)
3. **Type safety:** Check consuming code (API routes) for type errors
4. **Relational queries:** Test with `db.query.<table>.findMany({ with: {...} })`

---

## 📖 Common Tasks

### Adding a New Table
1. Create `src/schema/my-table.ts`:
   ```typescript
   import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
   import { timestamps } from './column.helpers';

   export const myTable = sqliteTable('my_table', {
     id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
     name: text().notNull(),
     ...timestamps,
   });
   ```

2. Add to `relations.ts`:
   ```typescript
   import { myTable } from './my-table';
   
   export const relations = defineRelations(
     {
       // ... existing tables
       myTable,
     },
     r => ({
       // ... existing relations
       myTable: {
         // Define relations here
       },
     })
   );
   ```

3. Generate migration: `pnpm generate`

### Adding a Foreign Key Relation
```typescript
// In schema file
export const childTable = sqliteTable('child', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  parentId: text().notNull().references(() => parentTable.id, { onDelete: 'cascade' }),
});

// In relations.ts
childTable: {
  parent: r.one.parentTable({
    from: r.childTable.parentId,
    to: r.parentTable.id,
    where: { deleted: false },  // Optional: filter soft-deleted records
  }),
},
parentTable: {
  children: r.many.childTable({
    where: { deleted: false },  // Optional: filter soft-deleted records
  }),
}
```

### Querying with Relations (Usage in API)
```typescript
import { createDb } from '@craftedtales/db';

const db = createDb(env.craftedtales_db_dev);

// Nested relations (soft-delete filtering is in relations.ts)
const mods = await db.query.mods.findMany({
  where: { deleted: false },
  with: {
    owner: {                        // User who owns the mod
      columns: {                    // Select specific columns
        id: true,
        username: true,
        bio: true,
        createdAt: true,
      },
      with: {
        avatar: true,               // Nested relation
      },
    },
    icon: true,                     // Mod icon (filtered in relations.ts)
    categories: true,               // Direct many-to-many (no junction table visible)
    versions: true,                 // Versions (filtered in relations.ts)
  },
});
```

### Soft-Delete Operations
```typescript
// Soft-delete a user (set BOTH fields)
await db.update(users)
  .set({ 
    deleted: true,
    deletedAt: new Date()
  })
  .where(eq(users.id, userId));

// Restore a soft-deleted user
await db.update(users)
  .set({ 
    deleted: false,
    deletedAt: null
  })
  .where(eq(users.id, userId));

// Get only active (non-deleted) records
const activeUsers = await db.query.users.findMany({
  where: { deleted: false }
});

// Get deleted records (for admin panel)
const deletedUsers = await db.query.users.findMany({
  where: { deleted: true }
});
```

---

## � Query Files (`*.queries.ts`) Patterns

Query files in `apps/api/src/features/**/*.queries.ts` encapsulate all database operations for a feature. They provide a clean separation between route handlers and database logic.

### File Structure

```typescript
import type { Database } from '../../utils/db';
import { tableName } from '@craftedtales/db';
import { eq, and } from 'drizzle-orm';
import type { SomeSchema } from './feature.schemas';
import type { PaginatedResponse } from '../_shared/common.schemas';

/**
 * Database queries for feature
 */
export const featureQueries = {
  async queryName(db: Database, ...args): Promise<ReturnType> {
    // Query implementation
  },
};
```

### Key Patterns

#### 1. **Export as Object with Methods**

```typescript
// ✅ GOOD - Export as named object
export const modsQueries = {
  async listWithFilters(db: Database, filters: ModFilters): Promise<...> { ... },
  async getBySlug(db: Database, slug: string): Promise<...> { ... },
  async create(db: Database, userId: string, data: CreateModRequest): Promise<string> { ... },
};

// Usage in routes:
import { modsQueries } from './mods.queries';
const mods = await modsQueries.listWithFilters(db, filters);
```

#### 2. **Database as First Parameter**

Always pass the `Database` instance as the first parameter:

```typescript
// ✅ GOOD - db is first parameter
async getUserById(db: Database, userId: string): Promise<...> {
  return await db.query.users.findFirst({
    where: { id: userId, deleted: false },
  });
}

// ❌ BAD - db not passed, uses global/closure
async getUserById(userId: string): Promise<...> {
  return await globalDb.query.users.findFirst({ ... });
}
```

#### 3. **Always Filter Soft-Deleted Records**

```typescript
// ✅ GOOD - Always include deleted: false in where clause
async findUserByEmail(db: Database, email: string) {
  return await db.query.users.findFirst({
    where: { email, deleted: false },
    with: {
      avatar: {
        where: { deleted: false },  // Also filter relations
      },
    },
  });
}
```

#### 4. **Use Typed Return Values**

Import types from schema files and use explicit return types:

```typescript
import type { PublicMod } from './mods.schemas';
import type { PaginatedResponse } from '../_shared/common.schemas';

async listWithFilters(
  db: Database,
  filters: ModFilters,
): Promise<PaginatedResponse<PublicMod>> {
  // ...
}
```

#### 5. **Direct Many-to-Many Access**

With Drizzle's `.through()` syntax, many-to-many relations are accessed directly without transforming:

```typescript
async getBySlug(db: Database, slug: string): Promise<PublicMod | null> {
  const mod = await db.query.mods.findFirst({
    where: { slug, deleted: false },
    with: {
      owner: {
        columns: {
          id: true,
          username: true,
          bio: true,
          createdAt: true,
        },
        with: {
          avatar: true,
        },
      },
      icon: true,
      categories: true,  // Direct access - no junction table transformation needed
      versions: true,
    },
  });

  return mod ?? null;  // mod.categories is already an array of Category objects
}
```

#### 6. **Pagination Pattern**

```typescript
async listWithFilters(
  db: Database,
  filters: ModFilters & PaginationQuery,
): Promise<PaginatedResponse<PublicMod>> {
  const { page, limit, ...otherFilters } = filters;

  // Get paginated results
  const items = await db.query.mods.findMany({
    where: { deleted: false, ...otherFilters },
    limit,
    offset: (page - 1) * limit,
    orderBy: { createdAt: 'desc' },
  });

  // Get total count (lightweight query)
  const allItems = await db.query.mods.findMany({
    where: { deleted: false, ...otherFilters },
    columns: { id: true },
  });

  return {
    data: items,
    totalItems: allItems.length,
  };
}
```

#### 7. **Create Operations Return ID**

```typescript
async create(db: Database, userId: string, data: CreateModRequest): Promise<string> {
  const modId = crypto.randomUUID();

  await db.insert(mods).values({
    id: modId,
    ownerId: userId,
    ...data,
  });

  return modId;  // Return the new ID
}
```

#### 8. **Update Operations with Current Values**

Pass current record when updates need to merge with existing data:

```typescript
async update(
  db: Database,
  modId: string,
  data: UpdateModRequest,
  currentMod: typeof mods.$inferSelect,  // Pass current record
): Promise<void> {
  await db
    .update(mods)
    .set({
      name: data.name ?? currentMod.name,
      summary: data.summary ?? currentMod.summary,
      updatedAt: new Date(),
    })
    .where(eq(mods.id, modId));
}
```

#### 9. **Verify Existence Before Operations**

```typescript
async verifyTargetExists(
  db: Database,
  targetType: 'mod' | 'user',
  targetId: string,
): Promise<boolean> {
  if (targetType === 'mod') {
    const mod = await db.query.mods.findFirst({
      where: { id: targetId, deleted: false },
      columns: { id: true },  // Lightweight - only fetch id
    });
    return !!mod;
  }
  // ...
}
```

#### 10. **JSDoc Comments for Each Query**

```typescript
export const authQueries = {
  /**
   * Find user by email (for login, password reset, registration check)
   */
  async findUserByEmail(db: Database, email: string) { ... },

  /**
   * Create a new user
   */
  async createUser(db: Database, userId: string, data: RegisterRequest, hashedPassword: string) { ... },
};
```

### Query File Naming Conventions

| Query Type      | Naming Pattern              | Example                          |
| --------------- | --------------------------- | -------------------------------- |
| List/Find many  | `list*`, `findMany*`        | `listWithFilters`, `listAll`     |
| Get single      | `get*`, `find*`             | `getBySlug`, `findUserByEmail`   |
| Check existence | `*Exists`, `has*`, `verify*`| `slugExists`, `hasPendingReport` |
| Create          | `create*`                   | `createUser`, `createReport`     |
| Update          | `update*`                   | `updateProfile`, `updatePassword`|
| Delete          | `delete*`, `softDelete*`    | `softDeleteMod`                  |
| Toggle          | `toggle*`                   | `toggleLike`                     |

---

## 🚫 What NOT to Do

### Schema (packages/db)

- ❌ Do NOT edit files in `drizzle/` — they are auto-generated
- ❌ Do NOT skip migration generation after schema changes
- ❌ Do NOT use relation names that match column names
- ❌ Do NOT forget `onDelete: 'cascade'` for child foreign keys (unless using SET NULL for soft-delete)
- ❌ Do NOT use `any` types — leverage Drizzle's type inference
- ❌ Do NOT create duplicate junction tables — check existing schema first

### Queries (apps/api/**/*.queries.ts)

- ❌ **Do NOT forget to filter `deleted = false` in API queries** — Drizzle doesn't auto-filter soft-deletes
- ❌ **Do NOT hard-delete users, mods, versions, or media** — always soft-delete with `deleted: true, deletedAt: new Date()`
- ❌ **Do NOT forget to set BOTH `deleted` and `deletedAt` fields** when soft-deleting
- ❌ Do NOT put database logic directly in route handlers — encapsulate in query files
- ❌ Do NOT forget to pass `db: Database` as the first parameter
- ❌ Do NOT forget explicit return types on query methods

---

## 🔗 External References

- **Drizzle ORM Docs:** https://orm.drizzle.team/
- **Drizzle Relations (Beta):** https://orm.drizzle.team/docs/rqb#select-from-relations
- **Cloudflare D1 Docs:** https://developers.cloudflare.com/d1/
- **Drizzle Kit (Migrations):** https://orm.drizzle.team/kit-docs/overview

---

## 💡 Tips for AI Agents

1. **Always check existing patterns** before creating new tables — see similar examples in `src/schema/`
2. **Read `relations.ts` carefully** when modifying foreign keys
3. **Test migration generation** immediately after schema changes
4. **Follow naming conventions:**
   - Tables: snake_case (e.g., `mod_categories`)
   - Relations: camelCase with descriptive suffixes (e.g., `iconMedia`, `ownerUser`)
   - Columns: camelCase (e.g., `createdAt`, `ownerId`)
5. **Junction tables** should be exported in the same file as the primary entity and use composite primary keys
6. **When in doubt**, refer to existing tables like `mods.ts` or `users.ts` for patterns
7. **For query files**, follow patterns in existing files like `mods.queries.ts` or `auth.queries.ts`
8. **Use `.through()` syntax** for direct many-to-many access in relations

---

**When modifying this package, always prioritize:**
1. Type safety
2. Referential integrity
3. Consistent naming
4. Migration generation

