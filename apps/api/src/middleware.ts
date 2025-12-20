import { useSession } from '@hono/session';
import type { MiddlewareHandler } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import { HTTPException } from 'hono/http-exception';
import { createDb, getDbBinding, getRateLimitKV } from './utils/db';
import { checkRateLimit, getClientIdentifier, type RateLimitConfig } from './utils/rate-limit';
import type { Env } from './env';

// CORS middleware
export const createCors = (): MiddlewareHandler => (c, next) => {
  const rawOrigins = (c.env?.CORS_ORIGIN ?? '*').toString();
  const allowHeaders = ['Content-Type', 'Authorization'];
  const allowMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

  if (rawOrigins === '*') {
    return cors({ origin: '*', allowHeaders, allowMethods, credentials: true })(c, next);
  }

  const allowedOrigins = rawOrigins.split(',').map((o: unknown) => o?.toString().trim()).filter(Boolean);

  // Use Hono CORS native support for array of origins
  return cors({ origin: allowedOrigins, allowHeaders, allowMethods, credentials: true })(c, next);
};

// Security and utilities
export const createSecurity = (): MiddlewareHandler => secureHeaders();
export const createLogger = (): MiddlewareHandler => logger();
export const createPrettyJson = (): MiddlewareHandler => prettyJSON();
export const createRequestId = (): MiddlewareHandler => requestId();

// Session
export type SessionEnv = { SESSION_SECRET?: string; SESSION_COOKIE_NAME?: string };

export const createSession = (): MiddlewareHandler => (c, next) => {
  const secret = c.env?.SESSION_SECRET ?? 'dev-secret-change-me';

  return useSession({ duration: { absolute: 60 * 60 * 24 * 7 }, secret })(c, next);
};

/**
 * Authentication middleware - requires user to be logged in
 */
export const requireAuth = (): MiddlewareHandler<Env> => async (c, next) => {
  const session = c.get('session');
  const userId = session?.get('userId');

  if (!userId) {
    throw new HTTPException(401, { message: 'Authentication required' });
  }

  // Fetch user from database to ensure they still exist and aren't deleted
  const db = createDb(getDbBinding(c.env));
  const user = await db.query.users.findFirst({
    where: { id: userId, deleted: false },
  });

  if (!user) {
    // Clear invalid session
    session?.deleteSession();
    throw new HTTPException(401, { message: 'Invalid or expired session' });
  }

  // Attach user to context
  c.set('userId', userId);
  c.set('user', user);

  await next();
};

/**
 * Role-based access control middleware
 */
export const requireRole = (allowedRoles: string[]): MiddlewareHandler<Env> => async (c, next) => {
  const user = c.get('user');

  if (!user) {
    throw new HTTPException(401, { message: 'Authentication required' });
  }

  // Check if user has any of the allowed roles
  const hasRole = user.roles.some(role => allowedRoles.includes(role));

  if (!hasRole) {
    throw new HTTPException(403, {
      message: `Access denied.`,
    });
  }

  await next();
};

/**
 * Rate limiting middleware
 */
export const rateLimit = (config: RateLimitConfig): MiddlewareHandler<Env> => async (c, next) => {
  const kv = getRateLimitKV(c.env);
  const userId = c.get('userId');
  const clientId = getClientIdentifier(c.req.raw, userId);

  const result = await checkRateLimit(kv, clientId, config);

  // Set rate limit headers
  c.header('X-RateLimit-Limit', config.maxRequests.toString());
  c.header('X-RateLimit-Remaining', result.remaining.toString());
  c.header('X-RateLimit-Reset', new Date(result.resetAt).toISOString());

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);

    c.header('Retry-After', retryAfter.toString());

    throw new HTTPException(429, {
      message: 'Too many requests. Please try again later.',
    });
  }

  await next();
};
