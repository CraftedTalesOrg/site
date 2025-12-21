import { OpenAPIHono } from '@hono/zod-openapi';
import { createOpenApiApp, maybeRegisterSwaggerUI, registerOpenApiDocs } from './docs/openapi';
import type { Env } from './env.d';
import { createCors, createLogger, createPrettyJson, createRequestId, createSecurity, createSession } from './middleware';
import { registerAuthRoutes } from './features/auth/auth.routes';
import { registerCategoriesRoutes } from './features/categories/categories.routes';
import { registerReportRoutes } from './features/reports/reports.routes';
import { registerUserRoutes } from './features/users/users.routes';
import { registerModsRoutes } from './features/mods/mods.routes';
import { registerAdminRoutes } from './features/admin/admin.routes';

const app = createOpenApiApp();

// Core middleware
app.use('*', createRequestId());
app.use('*', createLogger());
app.use('*', createSecurity());
app.use('*', createCors());
app.use('*', createPrettyJson());
app.use('*', createSession());

// Health root
app.get('/health', c => c.json({ ok: true }));

// Versioned API: use a sub OpenAPIHono and mount via route()
const v1Prefix = '/api/v1';
const v1 = new OpenAPIHono<Env>();

registerModsRoutes(v1);
registerAuthRoutes(v1);
registerUserRoutes(v1);
registerCategoriesRoutes(v1);
registerAdminRoutes(v1);
registerReportRoutes(v1);

// Mount v1 router under the prefix so OpenAPI aggregates paths
app.route(v1Prefix, v1);

// OpenAPI doc JSON and maybe Swagger UI (register after routes so paths are included)
registerOpenApiDocs(app);
maybeRegisterSwaggerUI(app);

export default {
  fetch: (req: Request, env: Env['Bindings'], ctx: ExecutionContext): Response | Promise<Response> => app.fetch(req, env, ctx),
};

export type AppType = typeof app;
