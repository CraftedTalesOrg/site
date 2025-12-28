# @craftedtales/web

React frontend built with TanStack Start, deployed to Cloudflare Pages.

## 📁 Structure

```
apps/web/
├── src/
│   ├── routes/         # File-based routing (TanStack Router)
│   ├── components/     # UI components
│   ├── theming/        # Chakra UI theme & tokens
│   ├── i18n/           # Internationalization (i18next)
│   └── hooks/          # Custom React hooks
├── public/             # Static assets
├── wrangler.json       # Cloudflare Pages config
└── .env.example        # Environment template
```

## 🚀 Getting Started

```bash
# From monorepo root
pnpm --filter @craftedtales/web run dev
```

The app runs at `http://localhost:3000`

## ⚙️ Environment

Create `.env` from `.env.example`:

```bash
VITE_SENTRY_DSN=         # Sentry error tracking
VITE_SENTRY_ORG=         # Sentry organization
VITE_SENTRY_PROJECT=     # Sentry project name
SENTRY_AUTH_TOKEN=       # Sentry auth token
CLOUDFLARE_ENV=          # development | production
```

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build for production |
| `pnpm deploy` | Build and deploy to Cloudflare |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run Vitest tests |
| `pnpm typegen` | Generate Chakra theme types |

## 📚 Docs

- [React](https://react.dev/)
- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Chakra UI](https://chakra-ui.com/)
- [i18next](https://www.i18next.com/)
- [Vite](https://vitejs.dev/)

