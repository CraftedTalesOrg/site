import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import type { Env } from '../env.d';

export const createOpenApiApp = (): OpenAPIHono<Env> => new OpenAPIHono<Env>();

export const registerOpenApiDocs = (app: OpenAPIHono<Env>): void => {
  app.doc('/doc', {
    openapi: '3.1.0',
    info: { title: 'CraftedTales API', version: '1.0.0' },
  });

  app.get('/health', c => c.json({ ok: true }));
};

export const maybeRegisterSwaggerUI = (app: OpenAPIHono<Env>): void => {
  // Gate Swagger by env at runtime, then mount UI handler
  app.use('/docs', async (c, next) => {
    const enabled = (c.env.SWAGGER_ENABLED ?? 'false').toString().toLowerCase() === 'true';

    if (!enabled) {
      return c.text('Not Found', 404);
    }

    await next();
  });
  app.get('/docs', swaggerUI({ url: '/doc' }));
};
