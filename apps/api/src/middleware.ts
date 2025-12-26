import type { MiddlewareHandler } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import { HTTPException } from 'hono/http-exception';
import { createDb, getRateLimitKV } from './utils/db';
import { checkRateLimit, getClientIdentifier, type RateLimitConfig } from './utils/rate-limit';
import type { Env } from './env';
import { jwt } from 'hono/jwt';
import { usersQueries } from './features/users/users.queries';

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

/**
 * Authentication middleware - requires user to be logged in via JWT Bearer token
 */
export const requireAuth = (): MiddlewareHandler<Env> => async (c, next) => {
  const middleware = jwt({ secret: c.env?.JWT_SECRET ?? 'dev-secret-change-me' });

  return middleware(c, next);
};

/**
 * Role-based access control middleware
 * Fetches user from DB and verifies roles match the JWT payload
 */
export const requireAnyRole = (allowedRoles: string[]): MiddlewareHandler<Env> => async (c, next) => {
  const payload = c.get('jwtPayload');

  if (!payload.userId || !Array.isArray(payload.roles)) {
    throw new HTTPException(401, { message: 'Invalid token payload' });
  }

  const db = createDb(c.env);
  const user = await usersQueries.findById(db, payload.userId);

  if (!user) {
    throw new HTTPException(401, { message: 'User not found' });
  }

  // Verify roles in JWT match the database
  const jwtRoles = [...payload.roles].sort();
  const dbRoles = [...user.roles].sort();

  if (jwtRoles.length !== dbRoles.length || !jwtRoles.every((role, i) => role === dbRoles[i])) {
    throw new HTTPException(401, { message: 'Token roles mismatch. Please re-authenticate.' });
  }

  // Check if user has any of the allowed roles
  const hasRole = user.roles.some(role => allowedRoles.includes(role));

  if (!hasRole) {
    throw new HTTPException(403, { message: 'Access denied.' });
  }

  await next();
};

/**
 * Rate limiting middleware
 */
export const rateLimit = (config: RateLimitConfig): MiddlewareHandler<Env> => async (c, next) => {
  const kv = getRateLimitKV(c.env);

  // There may be or may not be a userId if this is applied without auth middleware
  const { userId } = c.get('jwtPayload');
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
