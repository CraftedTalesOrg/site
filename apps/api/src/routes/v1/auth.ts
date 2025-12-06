import { createRoute, z } from '@hono/zod-openapi';
import type { OpenAPIHono } from '@hono/zod-openapi';
import type { Env } from '../../env.d';

export const registerAuthRoutes = (app: OpenAPIHono<Env>): void => {
  const login = createRoute({
    method: 'post',
    path: '/auth/login',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z
              .object({
                email: z.string().email(),
                password: z.string().min(8),
              })
              .openapi('LoginBody'),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Logged in',
        content: { 'application/json': { schema: z.object({ ok: z.literal(true) }) } },
      },
      401: { description: 'Invalid credentials' },
    },
    tags: ['auth'],
  });

  app.openapi(login, c => c.json({ ok: true }));
};
