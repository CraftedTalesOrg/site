import { OpenAPIHono } from '@hono/zod-openapi';
import { createOpenApiApp, maybeRegisterSwaggerUI, registerOpenApiDocs } from './docs/openapi';
import type { Env } from './env.d';
import { createCors, createLogger, createPrettyJson, createRequestId, createSecurity, createSession } from './middleware';
import { registerAdminRoutes } from './routes/v1/admin';
import { registerAuthRoutes } from './routes/v1/auth';
import { registerCartRoutes } from './routes/v1/cart';
import { registerModsRoutes } from './routes/v1/mods';
import { registerReportRoutes } from './routes/v1/reports';
import { registerUserRoutes } from './routes/v1/users';

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
registerCartRoutes(v1);
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
