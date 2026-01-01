import { createOpenApiApp, registerOpenApiDocs } from './docs/openapi';
import { createCors, createLogger, createPrettyJson, createRequestId, createSecurity } from './middleware';
import { registerAuthRoutes } from './features/auth/auth.routes';
import { registerCategoriesRoutes } from './features/categories/categories.routes';
import { registerGameVersionsRoutes } from './features/game-versions/game-versions.routes';
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

// Versioned API: create a sub router and mount under prefix
// Versioned API: create a sub router and mount under prefix
const v1Prefix = '/api/v1';
const v1 = createOpenApiApp();
const v1 = createOpenApiApp();

registerAuthRoutes(v1);
registerUsersRoutes(v1);
registerReportsRoutes(v1);
registerModsRoutes(v1);
registerCategoriesRoutes(v1);
registerGameVersionsRoutes(v1);
registerAuthRoutes(v1);
registerUsersRoutes(v1);
registerReportsRoutes(v1);
registerModsRoutes(v1);
registerCategoriesRoutes(v1);
registerGameVersionsRoutes(v1);

// Mount v1 router under the prefix
app.route(v1Prefix, v1);
// Mount v1 router under the prefix
app.route(v1Prefix, v1);

// OpenAPI doc JSON and UI
registerOpenApiDocs(app);

export default app;

export type AppType = typeof app;
