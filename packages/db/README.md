# @craftedtales/db

Drizzle ORM database package for CraftedTales, configured for Cloudflare D1 (SQLite).

## 📁 Structure

```
packages/db/
├── src/
│   ├── schema/         # Database tables & relations
│   ├── seed/           # Seed data scripts
│   └── index.ts        # Main entry (createDb function)
├── drizzle/            # Generated migrations
├── drizzle.config.ts   # Drizzle Kit config
└── .env.example        # Environment template
```

## 🚀 Getting Started

### 1. Configure Environment

Create `.env` from `.env.example`:

```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_D1_TOKEN=your_api_token
```

Get these from:
- **Account ID**: [Cloudflare Dashboard](https://dash.cloudflare.com) → Account ID
- **Database ID**: From your `wrangler.json` D1 config
- **API Token**: [Create Token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) with D1 permissions

### 2. Generate & Apply Migrations

```bash
pnpm generate   # Generate migrations from schema
pnpm push       # Push to D1 (development)
```

### 3. Seed Database (Optional)

```bash
pnpm seed         # Seed with sample data
pnpm seed:reset   # Reset and reseed
```

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `pnpm generate` | Generate SQL migrations from schema |
| `pnpm migrate` | Apply migrations (production) |
| `pnpm push` | Push schema changes to D1 (development) |
| `pnpm seed` | Seed database with sample data |
| `pnpm seed:reset` | Reset and reseed database |

## 🔧 Usage

```typescript
import { createDb } from '@craftedtales/db';

const db = createDb(env.craftedtales_db);

const mods = await db.query.mods.findMany({
  where: { deleted: false },
  with: {
    owner: true,
    categories: true,
  },
});
```

## 📚 Docs

- [Drizzle ORM](https://orm.drizzle.team/)
- [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
