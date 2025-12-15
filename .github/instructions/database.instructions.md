---
applyTo: "packages/db/**"
---

# Database Package (@craftedtales/db) Instructions

This package provides the Drizzle ORM database layer for the CraftedTales platform, configured for Cloudflare D1 (SQLite). All database schema, relations, and migration logic live here.

---

## 🏗️ Architecture Overview

**Tech Stack:**
- **Drizzle ORM v1.0.0-beta** (new relations API)
- **Cloudflare D1** (serverless SQLite at the edge)
- **TypeScript** (strict mode)

**Core Concepts:**
- Schema files define tables using `sqliteTable`
- Relations are defined separately in `relations.ts` using `defineRelations`
- Migrations are generated via `drizzle-kit` and stored in `drizzle/`
- The `createDb` function wraps D1 bindings with schema context

---

## 📂 File Organization

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
For many-to-many relationships, define the junction table in the same file as the primary entity:

```typescript
// In mods.ts
export const modCategories = sqliteTable('mod_categories', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  modId: text().notNull().references(() => mods.id, { onDelete: 'cascade' }),
  categoryId: text().notNull().references(() => categories.id, { onDelete: 'cascade' }),
});
```

Then in `relations.ts`, define the relations through the junction:
```typescript
mods: {
  modCategories: r.many.modCategories(), // Access junction
},
categories: {
  modCategories: r.many.modCategories(), // Access junction
},
modCategories: {
  mod: r.one.mods({ from: r.modCategories.modId, to: r.mods.id }),
  category: r.one.categories({ from: r.modCategories.categoryId, to: r.categories.id }),
}
```

**Access pattern:**
```typescript
// Get categories for a mod
const mod = await db.query.mods.findFirst({
  with: {
    modCategories: {
      with: { category: true }
    }
  }
});
// Access: mod.modCategories[].category
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
  }),
},
parentTable: {
  children: r.many.childTable(),
}
```

### Querying with Relations (Usage in API)
```typescript
import { createDb } from '@craftedtales/db';

const db = createDb(env.craftedtales_db_dev);

// Nested relations with soft-delete filtering
const mods = await db.query.mods.findMany({
  where: { deleted: false },
  with: {
    owner: {                        // User who owns the mod
      where: { deleted: false }
    },
    icon: {                         // Mod icon
      where: { deleted: false }
    },
    modCategories: {                // Categories through junction
      with: {
        category: true,
      },
    },
    modVersions: {                  // All active versions
      where: { deleted: false },
      orderBy: { createdAt: "desc" },
    },
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

## 🚫 What NOT to Do

- ❌ Do NOT edit files in `drizzle/` — they are auto-generated
- ❌ Do NOT skip migration generation after schema changes
- ❌ Do NOT use relation names that match column names
- ❌ Do NOT define many-to-many relations with `.through()` — use junction table pattern
- ❌ Do NOT forget `onDelete: 'cascade'` for child foreign keys (unless using SET NULL for soft-delete)
- ❌ Do NOT use `any` types — leverage Drizzle's type inference
- ❌ Do NOT create duplicate junction tables — check existing schema first
- ❌ **Do NOT forget to filter `deleted = false` in API queries** — Drizzle doesn't auto-filter soft-deletes
- ❌ **Do NOT hard-delete users, mods, versions, or media** — always soft-delete with `deleted: true, deletedAt: new Date()`
- ❌ **Do NOT forget to set BOTH `deleted` and `deletedAt` fields** when soft-deleting

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
5. **Junction tables** should be exported in the same file as the primary entity
6. **When in doubt**, refer to existing tables like `mods.ts` or `users.ts` for patterns

---

**When modifying this package, always prioritize:**
1. Type safety
2. Referential integrity
3. Consistent naming
4. Migration generation
5. Documentation updates (README.md if adding major features)
