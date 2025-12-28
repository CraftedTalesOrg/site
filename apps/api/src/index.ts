import { createOpenApiApp, registerOpenApiDocs } from './docs/openapi';
import { createCors, createLogger, createPrettyJson, createRequestId, createSecurity } from './middleware';
import { registerAuthRoutes } from './features/auth/auth.routes';
import { registerCategoriesRoutes } from './features/categories/categories.routes';
import { registerReportsRoutes } from './features/reports/reports.routes';
import { registerUsersRoutes } from './features/users/users.routes';
import { registerModsRoutes } from './features/mods/mods.routes';

const app = createOpenApiApp();

// Core middleware
app.use('*', createRequestId());
app.use('*', createLogger());
app.use('*', createSecurity());
app.use('*', createCors());
app.use('*', createPrettyJson());

// Health root
app.get('/health', c => c.json({ ok: true }));

// Versioned API: use a sub OpenAPIHono and mount via route()
const v1Prefix = '/api/v1';

registerAuthRoutes(app);
registerUsersRoutes(app);
registerReportsRoutes(app);
registerModsRoutes(app);
registerCategoriesRoutes(app);

// Mount v1 router under the prefix so OpenAPI aggregates paths
app.route(v1Prefix, app);

// OpenAPI doc JSON and UI
registerOpenApiDocs(app);

export default app;

export type AppType = typeof app;
