import { OpenAPIHono } from '@hono/zod-openapi';
import { Scalar } from '@scalar/hono-api-reference';
import type { Env } from '../env.d';

export const createOpenApiApp = (): OpenAPIHono<Env> => new OpenAPIHono<Env>({
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: 'Validation error',
          code: 'VALIDATION_ERROR',
          details: {
            issues: result.error.issues,
          },
        },
        400,
      );
    }
  },
});

export const registerOpenApiDocs = async (app: OpenAPIHono<Env>): Promise<void> => {
  app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
    type: 'http',
    scheme: 'bearer',
  });

  app.doc('/docs.json', {
    openapi: '3.1.0',
    info: { title: 'CraftedTales API', version: '1.0.0' },
  });

  app.get('/docs', Scalar<Env>(c => ({
    url: '/docs.json',
    pageTitle: 'CraftedTales API Docs',
    persistAuth: c.env.ENVIRONMENT !== 'production',
    hideClientButton: c.env.ENVIRONMENT === 'production',
    hideTestRequestButton: c.env.ENVIRONMENT === 'production',
  })));
  app.get('/health', c => c.json({ ok: true }));
};
