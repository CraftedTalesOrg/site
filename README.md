# CraftedTales

> 🎮 An open-source mod platform for discovering, downloading, and managing Hytale mods.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Hono](https://img.shields.io/badge/Hono-4.x-E36002?logo=hono&logoColor=white)](https://hono.dev/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Overview
https://craftedtales.org/

CraftedTales is a mod platform for Hytale, built on a modern, edge-first architecture. Discover, download, and share amazing content with creators worldwide.

### Why Choose CraftedTales?

- ⚡ **Lightning Fast CDN** — Global delivery powered by Cloudflare ensures downloads are fast and reliable anywhere
- 👥 **Team Management** — Collaborate on mod projects with role-based permissions for multiple creators
- 💰 **Creator Monetization** — Earn revenue from your creations through our creator program
- 🌐 **Open Source** — Built transparently in the open with a community-driven approach
- 🧱 **Block Expertise** — Created by developers with years of Minecraft modding experience
- 🛡️ **Community Safety** — Comprehensive reporting and active moderation for a welcoming community

---

## 🏗️ Architecture

This monorepo follows a full-stack TypeScript approach, running entirely on Cloudflare's ecosystem.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare CDN (Global Edge)                 │
└──────────────────────────────┬──────────────────────────────────┘
                               │
         ┌─────────────────────┴─────────────────────┐
         │                                           │
         ▼                                           ▼
┌─────────────────────┐                 ┌─────────────────────┐
│   Frontend (Web)    │                 │   Backend (API)     │
│   TanStack Start    │ ◄────────────►  │   Hono on Workers   │
│   Cloudflare Pages  │                 │   OpenAPI Docs      │
└─────────────────────┘                 └──────────┬──────────┘
                                                   │
                        ┌──────────────────────────┼────────────────────────┐
                        │                          │                        │
                        ▼                          ▼                        ▼
               ┌────────────────┐        ┌────────────────┐       ┌────────────────┐
               │  Cloudflare D1 │        │  Cloudflare R2 │       │  Workers KV    │
               │  (SQLite DB)   │        │  (File Storage)│       │  (Caching)     │
               └────────────────┘        └────────────────┘       └────────────────┘
```

---

## 📦 Monorepo Structure

```
craftedtales-monorepo/
├── apps/
│   ├── api/                 # Hono API server (Cloudflare Workers)
│   │   ├── src/
│   │   │   ├── features/    # Feature modules (auth, mods, users, etc.)
│   │   │   └── utils/       # Shared utilities
│   │   └── wrangler.json    # Cloudflare Workers config
│   │
│   └── web/                 # React frontend (TanStack Start)
│       ├── src/
│       │   ├── routes/      # File-based routing
│       │   ├── components/  # UI components
│       │   ├── theming/     # Chakra UI theme
│       │   ├── i18n/        # Internationalization
│       │   └── hooks/       # Custom React hooks
│       └── wrangler.json    # Cloudflare Pages config
│
├── packages/
│   ├── db/                  # Drizzle ORM schema & migrations
│   │   ├── src/schema/      # Database tables
│   │   ├── src/seed/        # Seed data scripts
│   │   └── drizzle/         # Generated migrations
│   │
│   └── config/              # Shared ESLint & TS configs
│
├── docs/                    # Project documentation
│
├── turbo.json               # Turborepo configuration
├── pnpm-workspace.yaml      # pnpm workspace config
└── package.json             # Root package scripts
```

---

## 🛠️ Tech Stack

### Frontend (`apps/web`)

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev/) | UI library with React Compiler |
| [TanStack Start](https://tanstack.com/start) | Full-stack React framework with SSR |
| [TanStack Router](https://tanstack.com/router) | Type-safe file-based routing |
| [TanStack Query](https://tanstack.com/query) | Async state management |
| [Chakra UI v3](https://chakra-ui.com/) | Component library & design system |
| [i18next](https://www.i18next.com/) | Internationalization |
| [Zod](https://zod.dev/) | Runtime validation |
| [Vite](https://vitejs.dev/) | Build tool |

### Backend (`apps/api`)

| Technology | Purpose |
|------------|---------|
| [Hono](https://hono.dev/) | Ultrafast web framework for edge |
| [Zod OpenAPI](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) | Type-safe OpenAPI schemas |
| [Scalar](https://scalar.com/) | Beautiful API documentation |
| [Drizzle ORM](https://orm.drizzle.team/) | TypeScript ORM |
| [Cloudflare Workers](https://workers.cloudflare.com/) | Edge runtime |

### Database (`packages/db`)

| Technology | Purpose |
|------------|---------|
| [Cloudflare D1](https://developers.cloudflare.com/d1/) | Serverless SQLite database |
| [Drizzle ORM](https://orm.drizzle.team/) | Schema, migrations, queries |
| [Cloudflare R2](https://developers.cloudflare.com/r2/) | Object storage for files |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 25+ ([Download](https://nodejs.org/))
- **pnpm** 10+ ([Install](https://pnpm.io/installation))
- **Wrangler CLI** (Cloudflare's CLI, installed via pnpm)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/CraftedTalesOrg/site.git
   cd site
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   # Frontend
   cp apps/web/.env.example apps/web/.env

   # Database
   cp packages/db/.env.example packages/db/.env

   # API
   cp apps/api/.dev.vars.example apps/api/.dev.vars
   ```

   See package READMEs for detailed configuration:
   - [Web](apps/web/README.md#%EF%B8%8F-environment) — Sentry setup
   - [API](apps/api/README.md#%EF%B8%8F-environment) — JWT secret
   - [Database](packages/db/README.md#-getting-started) — Cloudflare D1

4. **Start development servers**

   ```bash
   pnpm dev
   ```

   This starts both the frontend (port 3000) and API simultaneously.

---

## 🛠️ Scripts

Run these from the **root** of the monorepo:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint all packages |
| `pnpm deploy` | Deploy all apps to Cloudflare |
| `pnpm deploy:api` | Deploy only the API |
| `pnpm deploy:web` | Deploy only the frontend |

### Database Commands (run in `packages/db`)

| Command | Description |
|---------|-------------|
| `pnpm generate` | Generate Drizzle migrations |
| `pnpm push` | Push schema changes to D1 |
| `pnpm seed` | Seed database with sample data |
| `pnpm seed:reset` | Reset and reseed database |

---

## 📚 Documentation

**Project Docs:**
- [Architecture Guide](docs/architecture-stack.md) — System design and decisions
- [Page Specifications](docs/pages/) — UI/UX documentation
- [Data Models](docs/models/) — Entity and relationship docs
- [Error Handling](docs/error-handling.md) — Error pages and states

**Package READMEs:**
- [API](apps/api/README.md) — Backend API documentation
- [Web](apps/web/README.md) — Frontend application
- [Database](packages/db/README.md) — Schema and migrations

**API Docs** (when running locally):
- Scalar UI: http://localhost:8787/docs
- OpenAPI JSON: http://localhost:8787/openapi.json

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes following our conventions:
   - Use [Conventional Commits](https://www.conventionalcommits.org/) with package scope
   - Example: `feat(web): add mod search` or `fix(api): validate auth token`
4. Run `pnpm lint` to check for errors
5. Commit and push your changes
6. Open a Pull Request
---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

Built with amazing open-source tools:

- [TanStack](https://tanstack.com/) — For the incredible React ecosystem
- [Hono](https://hono.dev/) — For the blazing-fast edge framework
- [Cloudflare](https://cloudflare.com/) — For the global edge infrastructure
- [Chakra UI](https://chakra-ui.com/) — For the beautiful component library
- [Drizzle](https://orm.drizzle.team/) — For the TypeScript-first ORM

---

<p align="center">
  Made with ❤️ by <a href="https://drav.dev">drav.dev</a>
</p>
