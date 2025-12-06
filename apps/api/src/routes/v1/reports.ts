import { createRoute, z } from '@hono/zod-openapi';
import type { OpenAPIHono } from '@hono/zod-openapi';
import type { Env } from '../../env.d';

export const registerReportRoutes = (app: OpenAPIHono<Env>): void => {
  const createReport = createRoute({
    method: 'post',
    path: '/reports',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z
              .object({
                targetType: z.enum(['mod', 'user']),
                targetId: z.string(),
                reason: z.string().min(3),
                details: z.string().optional(),
              })
              .openapi('CreateReportBody'),
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Report created',
        content: {
          'application/json': {
            schema: z.object({ id: z.string() }).openapi('CreateReportResponse'),
          },
        },
      },
    },
    tags: ['reports'],
  });

  app.openapi(createReport, c => c.json({ id: 'placeholder' }, 201));
};
