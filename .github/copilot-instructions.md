# GitHub Copilot Instructions

## Project Overview
This is a monorepo managed with **pnpm** and **Turbo**. It contains a full-stack application using modern web technologies.

### Workspace Structure
- **apps/web**: Frontend application using **TanStack Start** (SSR), **TanStack Router**, **TanStack Query**.
- **apps/api**: Backend service using **Hono**.
- **packages/db**: Database schema and connection logic using **Drizzle ORM** and **Postgres**.

## Tech Stack & Patterns

### Frontend (`apps/web`)
- **Framework**: React 19 with **TanStack Start** (Nitro-powered SSR).
- **Routing**: File-based routing via **TanStack Router** in `src/routes`.
  - The file `src/routeTree.gen.ts` is auto-generated. Do not edit it manually.
  - Use `__root.tsx` for global layout and context.
- **Data Management**:
  - **TanStack Query** for async state.
  - **TanStack DB** (`@tanstack/react-db`) for local-first/client-side collections (see `src/db-collections`).
- **Styling**: **Chakra**.
- **Compiler**: **React Compiler** is enabled via Babel. Avoid manual memoization (`useMemo`, `useCallback`) unless strictly necessary.

### Backend (`apps/api`)
- **Framework**: **Hono** running on Node.js.
- **Development**: Uses `tsx` for watching changes.

### Database (`packages/db`)
- **ORM**: **Drizzle ORM**.
- **Commands**:
  - `pnpm generate`: Generate migrations.
  - `pnpm push`: Push schema changes to the DB.

## Development Workflow
- **Start Dev Server**: `pnpm dev` (runs `turbo run dev`).
- **Package Management**: Always use `pnpm`.
- **Linting/Formatting**: `pnpm lint`, `pnpm format`.
- **Commit Messages**: Follow Conventional Commits.
  - **Scope**: The app or package name with the most significant changes (e.g., `web`, `api`, `db`, `ui`).
  - **Format**: `type(scope): description`.

## Coding Guidelines
- **React**:
  - Use functional components.
  - Leverage React 19 features.
  - Rely on React Compiler for optimization.
- **Routing**:
  - Create new routes by adding files to `apps/web/src/routes`.
  - Use `createFileRoute` for type-safe routing.
- **Type Safety**:
  - Use **Zod** for schema validation (especially in `db-collections`).
  - Ensure strict TypeScript usage.
- **Linting**:
  - Strictly follow the project's ESLint configuration.
  - Ensure no linting errors are introduced (e.g. unused variables, missing hook dependencies).

## AI Agent Behavior
- **File Edits**: Prefer `replace_string_in_file` for precise edits. Only use `insert_edit_into_file` if necessary.
- **ESLint Compliance**:
  - The project has strict ESLint rules. Always generate code that is compliant.
  - Pay attention to common linting issues like unused imports/variables and React hook dependencies.
- **Context**: When working on `apps/web`, check `vite.config.ts` and `src/router.tsx` to understand the build and routing setup.
- **Monorepo Awareness**: Be aware of the workspace structure. If a change involves shared logic, check if it belongs in a `packages/*` directory.
