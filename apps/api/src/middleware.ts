import { useSession } from '@hono/session';
import type { MiddlewareHandler } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';

// Core middleware
export const createCoreMiddleware = (): MiddlewareHandler => async (_c, next) => next();

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
