# @craftedtales/api

Hono-based REST API running on Cloudflare Workers with OpenAPI documentation.

## 📁 Structure

```
apps/api/
├── src/
│   ├── features/       # Feature modules (auth, mods, users, etc.)
│   ├── docs/           # OpenAPI configuration
│   └── utils/          # Shared utilities (auth, db, rate-limit)
├── wrangler.json       # Cloudflare Workers config
└── .dev.vars.example   # Local secrets template
```

## 🚀 Getting Started

```bash
# From monorepo root
pnpm --filter @craftedtales/api run dev
```

The API runs at `http://localhost:8787`

## ⚙️ Environment

Create `.dev.vars` for local secrets (copy from `.dev.vars.example`):

```bash
JWT_SECRET=your_jwt_secret_here
```

> Generate a secret: `openssl rand -base64 32`

Other environment variables are configured in `wrangler.json`.

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Type-check the project |
| `pnpm deploy` | Deploy to Cloudflare Workers |
| `pnpm lint` | Run ESLint |

## 📚 Docs

- [Hono](https://hono.dev/)
- [Zod OpenAPI](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Cloudflare Workers](https://workers.cloudflare.com/)

## 📖 API Docs

When running locally:
- **Scalar UI**: http://localhost:8787/docs
- **OpenAPI JSON**: http://localhost:8787/docs.json
- **Health Check**: http://localhost:8787/health