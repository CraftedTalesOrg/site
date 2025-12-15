# @craftedtales/db

Drizzle ORM database package for CraftedTales, configured for Cloudflare D1 (SQLite).

## 📁 Directory Structure

```
packages/db/
├── src/
│   ├── schema/
│   │   ├── users.ts         # User accounts and roles
│   │   ├── categories.ts    # Mod categories/tags
│   │   ├── mods.ts          # Mods and mod_categories junction table
│   │   ├── modVersions.ts   # Mod versions (releases)
│   │   ├── media.ts         # Media/image storage (avatars, icons)
│   │   ├── interactions.ts  # Likes and reports
│   │   ├── relations.ts     # Drizzle relations
│   │   └── column.helpers.ts # Reusable column patterns (timestamps, state)
│   └── index.ts             # Main entry point (createDb function)
├── drizzle/                 # Generated migrations (auto-created)
├── drizzle.config.ts        # Drizzle Kit configuration
├── .env.example             # Environment variables template
└── package.json
```

## 🚀 Setup

### 1. Install Dependencies

```bash
cd packages/db
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_D1_TOKEN=your_api_token
```

Get these values from:
- **Account ID**: [Cloudflare Dashboard](https://dash.cloudflare.com) → Account → Account ID
- **Database ID**: The D1 database ID from your `wrangler.json` (e.g., `55f3cf71-e95c-40b8-b8e4-4f993a0297eb`)
- **API Token**: [Create API Token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
  - Template: "Edit Cloudflare Workers" or custom with D1 permissions

### 3. Generate Migrations

```bash
pnpm generate
```

This creates SQL migration files in the `drizzle/` directory.

### 4. Apply Migrations

Option A: **Push directly** (for development):
```bash
pnpm push
```

Option B: **Apply migrations** (for production):
```bash
npx drizzle-kit migrate
```

### 5. View Database (Optional)

```bash
pnpm studio
```

Opens Drizzle Studio at `https://local.drizzle.studio`

## 🔧 Usage in API Worker

```typescript
import { createDb } from '@craftedtales/db';

export default {
  async fetch(request: Request, env: Env) {
    // Create DB client from D1 binding
    const db = createDb(env.craftedtales_db_dev);
    
    // Query users with relations
    const usersWithMods = await db.query.users.findMany({
      with: {
        avatar: true,           // User's avatar
        ownedMods: {            // Mods owned by user
          with: {
            icon: true,         // Mod icon
            modCategories: {    // Mod categories
              with: {
                category: true, // Category details
              },
            },
          },
        },
        modLikes: true,         // Mods liked by user
      },
    });
    
    return Response.json(usersWithMods);
  }
}
```

## 📊 Database Schema

### Tables

#### **Users & Media**
- `users` - User accounts with email/password and role management
- `media` - Media files (images) for avatars and mod icons

#### **Mods System**
- `mods` - Mod metadata, content, and external links
- `categories` - Mod categories/tags (e.g., "Adventure", "Magic", "QOL")
- `mod_categories` - Many-to-many junction: mods ↔ categories
- `mod_versions` - Mod releases with semver, changelogs, and download tracking

#### **User Interactions**
- `mod_likes` - User likes on mods
- `reports` - Content moderation reports (for mods or users)

### Key Relations

- **Users** → `avatar` (one-to-one with media), `ownedMods` (one-to-many), `modLikes`, `submittedReports`, `reviewedReports`
- **Mods** → `icon` (one-to-one with media), `owner` (many-to-one with users), `modCategories`, `modVersions`, `modLikes`
- **Categories** → `modCategories` (many mods through junction table)
- **Media** → `userAvatars`, `modIcons` (reverse relations)
- **ModCategories** (junction) → `mod`, `category`
- **ModVersions** → `mod` (many-to-one)
- **ModLikes** → `mod`, `user`
- **Reports** → `reporter`, `reviewer` (both reference users)

## 🔑 Key Features

- ✅ **Cloudflare D1** - Serverless SQLite at the edge
- ✅ **Type-safe** - Full TypeScript support via Drizzle ORM
- ✅ **Relational queries** - Easy joins and nested queries with `db.query`
- ✅ **Migration management** - Version-controlled schema changes
- ✅ **Organized schema** - Separate files by domain (users, mods, interactions, media)
- ✅ **Reusable patterns** - Shared column helpers for timestamps and state tracking

## 📝 Schema Modifications

1. Edit schema files in `src/schema/`
2. Run `pnpm generate` to create migration
3. Run `pnpm push` to apply changes
4. Commit both schema and migration files

## 🛠 Scripts

- `pnpm generate` - Generate SQL migrations from schema
- `pnpm push` - Push schema changes directly to D1
- `pnpm studio` - Open Drizzle Studio (visual database editor)

## 📚 Documentation

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Drizzle Kit Docs](https://orm.drizzle.team/kit-docs/overview)
