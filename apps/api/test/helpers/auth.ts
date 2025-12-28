import type { ProvidedEnv } from 'cloudflare:test';
import type { OpenAPIHono } from '@hono/zod-openapi';
import type { Env } from '../../src/env.d';
import { signAccessToken } from '../../src/utils/auth';
import type { TestUser } from '../factories';

/**
 * Default JWT secret used in test environment
 * Matches the empty string in wrangler.json dev vars
 */
const TEST_JWT_SECRET = 'test-jwt-secret';

/**
 * Make an authenticated request with a valid JWT for the given user
 *
 * @example
 * const user = await createTestUser(env, { roles: ['user'] });
 * const res = await authenticatedRequest(app, env, user, '/api/v1/users/me');
 *
 * @example
 * const admin = await createTestUser(env, { roles: ['admin'] });
 * const res = await authenticatedRequest(app, env, admin, '/api/v1/mods/review-queue', {
 *   method: 'GET',
 * });
 */
export async function authenticatedRequest(
  app: OpenAPIHono<Env>,
  env: ProvidedEnv,
  user: TestUser,
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  // Generate a valid JWT for the user
  const token = await signAccessToken(user.id, user.roles, TEST_JWT_SECRET);

  // Merge headers with Authorization
  const headers = new Headers(options.headers);

  headers.set('Authorization', `Bearer ${token}`);

  // Set Content-Type for JSON body if not already set
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Override env with test JWT secret
  const testEnv = {
    ...env,
    JWT_SECRET: TEST_JWT_SECRET,
  };

  return app.request(path, {
    ...options,
    headers,
  }, testEnv);
}
