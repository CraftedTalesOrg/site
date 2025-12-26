import { OpenAPIHono } from '@hono/zod-openapi';
import { Scalar } from '@scalar/hono-api-reference';
import type { Env } from '../env.d';

export const createOpenApiApp = (): OpenAPIHono<Env> => new OpenAPIHono<Env>();

export const registerOpenApiDocs = async (app: OpenAPIHono<Env>): Promise<void> => {
  app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
    type: 'http',
    scheme: 'bearer',
  });

  app.use('/doc', async (c, next) => {
    const enabled = (c.env.SWAGGER_ENABLED ?? 'false').toString().toLowerCase() === 'true';

    if (!enabled) {
      return c.text('Not Found', 404);
    }

    await next();
  });

  app.doc('/doc', {
    openapi: '3.1.0',
    info: { title: 'CraftedTales API', version: '1.0.0' },
  });

  app.get('/docs', Scalar({
    url: '/doc',
    pageTitle: 'CraftedTales API Docs',
    hideClientButton: true,
  }));
  app.get('/health', c => c.json({ ok: true }));
};
