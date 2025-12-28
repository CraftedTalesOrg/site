## GitHub Copilot / AI Agent Instructions

This monorepo is powered by `pnpm` and `turbo` and contains a full-stack app split into frontend, backend, and shared packages. Keep changes minimal, respect generated files, and prefer edits in the smallest logical package.

Key areas to inspect before coding:
- **Frontend:** `apps/web` — React 19, TanStack Start (SSR), TanStack Router. See `apps/web/src/router.tsx`, `apps/web/src/routeTree.gen.ts` (auto-generated — do NOT edit), and `apps/web/src/routes` for route files. Global layout: `apps/web/src/routes/__root.tsx`.
- **Backend:** `apps/api` — Hono server. Entrypoints: `apps/api/src/index.ts`, middleware at `apps/api/src/middleware.ts`, and routes in `apps/api/src/routes/v1/*.ts`.
- **Database:** `packages/db` — Drizzle ORM. Schema and DB helpers live in `packages/db/src/index.ts`.

Important commands (root workspace):
- `pnpm dev` — starts development (`turbo run dev`).
- `pnpm build` — runs `turbo run build` for all packages.
- `pnpm lint` — runs lint across the monorepo.
- DB-specific (in `packages/db`): `pnpm generate` to generate migrations, `pnpm push` to push schema changes (run in the `db` package workspace).

Conventions & patterns specific to this repo:
- Monorepo package boundaries: Prefer making changes in the package that owns the code. Search `packages/*` before duplicating logic.
- Routes: Add file-based routes under `apps/web/src/routes`. Do NOT modify `routeTree.gen.ts` — it's generated from the routes. Use `createFileRoute` helpers where present.
- State & data:
  - Use TanStack Query for async data fetching in the frontend.
  - Local client collections live in `apps/web/src/db-collections` using `@tanstack/react-db` patterns and Zod schemas.
- Styling: Chakra is the design system. Look in `apps/web/src/theming` for tokens and shared components.
- React Compiler: The project uses the React compiler (via Babel). Avoid manual memoization (`useMemo`, `useCallback`) unless you have a measured need.
- Validation: Use Zod for input and API schema validation where present (see `db-collections` and API route validators).

Developer workflow notes for AI agents:
- Always run lint locally after edits: `pnpm lint` (or run the package-level lint if available).
- Keep TypeScript strictness: fix type errors rather than bypassing with `any`.
- When touching shared DB or API schemas, update migrations in `packages/db` and include `pnpm generate` / `pnpm push` steps in PR description.
- Commit messages: use Conventional Commits with the package as scope, e.g. `feat(web): add categories section` or `fix(api): validate auth token`.

Files to check for local conventions and examples:
- `apps/web/src/router.tsx` — routing setup and route imports.
- `apps/web/src/routeTree.gen.ts` — generated route tree (read-only reference).
- `apps/web/src/routes/__root.tsx` — global layout, providers (TanStack Query, i18n, Chakra).
- `apps/api/src/index.ts` and `apps/api/src/routes/v1/*.ts` — API route patterns and middleware usage.
- `packages/db/src/index.ts` — Drizzle schema and helpers.
- `.eslintrc`/`eslint.config.js` files in `apps/*` and `packages/*` — repo enforces strict linting.

What not to do:
- Do not edit generated files (`routeTree.gen.ts`, other `*.gen.*` files).
- Do not add large, cross-cutting changes across packages without a clear rationale and PR description. Prefer targeted edits and follow-up tasks.

If anything is unclear or you need more project-specific examples (tests, CI scripts, package-level scripts), ask and I will expand this guidance with examples from the repo.

---
If you'd like, I can also:
- Add package-level script examples (e.g., running a single package's dev/lint).
- Generate a short PR template reminding reviewers to run `pnpm dev` and `pnpm lint`.

Please tell me which sections need more detail or specific examples.
