import { OpenAPIHono } from '@hono/zod-openapi';
import { Scalar } from '@scalar/hono-api-reference';
import type { Env } from '../env.d';

export const createOpenApiApp = (): OpenAPIHono<Env> => new OpenAPIHono<Env>();

export const registerOpenApiDocs = async (app: OpenAPIHono<Env>): Promise<void> => {
  app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
    type: 'http',
    scheme: 'bearer',
  });

  app.doc('/doc', {
    openapi: '3.1.0',
    info: { title: 'CraftedTales API', version: '1.0.0' },
  });

  app.get('/docs', Scalar<Env>(c => ({
    url: '/doc',
    pageTitle: 'CraftedTales API Docs',
    persistAuth: c.env.ENVIRONMENT !== 'production',
    hideClientButton: c.env.ENVIRONMENT === 'production',
    hideTestRequestButton: c.env.ENVIRONMENT === 'production',
  })));
  app.get('/health', c => c.json({ ok: true }));
};
