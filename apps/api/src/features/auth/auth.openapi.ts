import { createRoute } from '@hono/zod-openapi';
import {
  registerRequestSchema,
  loginRequestSchema,
  authResponseSchema,
  verifyEmailRequestSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
} from './auth.schemas';
import { errorResponseSchema, successResponseSchema } from '../_shared/common.schemas';
import { requireAuth, rateLimit } from '../../middleware';
import { RATE_LIMITS } from '../../utils/rate-limit';

/**
 * POST /auth/register
 */
export const registerRoute = createRoute({
  method: 'post',
  path: '/auth/register',
  request: {
    body: {
      content: {
        'application/json': { schema: registerRequestSchema },
      },
    },
  },
  responses: {
    201: {
      description: 'User registered successfully',
      content: { 'application/json': { schema: authResponseSchema } },
    },
    409: {
      description: 'Email or username already exists',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    429: {
      description: 'Rate limit exceeded',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    500: {
      description: 'Internal server error',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['auth'],
  middleware: [rateLimit(RATE_LIMITS.AUTH_REGISTER)] as const,
});

/**
 * POST /auth/login
 */
export const loginRoute = createRoute({
  method: 'post',
  path: '/auth/login',
  request: {
    body: {
      content: {
        'application/json': { schema: loginRequestSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: { 'application/json': { schema: authResponseSchema } },
    },
    401: {
      description: 'Invalid credentials',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    429: {
      description: 'Rate limit exceeded',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['auth'],
  middleware: [rateLimit(RATE_LIMITS.AUTH_LOGIN)] as const,
});

/**
 * POST /auth/forgot-password
 */
export const forgotPasswordRoute = createRoute({
  method: 'post',
  path: '/auth/forgot-password',
  request: {
    body: {
      content: {
        'application/json': { schema: forgotPasswordRequestSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Password reset email sent (if email exists)',
      content: { 'application/json': { schema: successResponseSchema } },
    },
    429: {
      description: 'Rate limit exceeded',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['auth'],
  middleware: [rateLimit(RATE_LIMITS.AUTH_FORGOT_PASSWORD)] as const,
});

/**
 * POST /auth/reset-password
 */
export const resetPasswordRoute = createRoute({
  method: 'post',
  path: '/auth/reset-password',
  request: {
    body: {
      content: {
        'application/json': { schema: resetPasswordRequestSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Password reset successfully',
      content: { 'application/json': { schema: successResponseSchema } },
    },
    400: {
      description: 'Invalid or expired token',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['auth'],
});

/**
 * POST /auth/verify-email
 */
export const verifyEmailRoute = createRoute({
  method: 'post',
  path: '/auth/verify-email',
  request: {
    body: {
      content: {
        'application/json': { schema: verifyEmailRequestSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Email verified successfully',
      content: { 'application/json': { schema: successResponseSchema } },
    },
    400: {
      description: 'Invalid or expired token',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['auth'],
});

/**
 * POST /auth/resend-verification
 */
// TODO Check, will this work? Where do we get the email to resend to? The user is not logged
export const resendVerificationRoute = createRoute({
  method: 'post',
  path: '/auth/resend-verification',
  responses: {
    200: {
      description: 'Verification email sent',
      content: { 'application/json': { schema: successResponseSchema } },
    },
    400: {
      description: 'Email already verified',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    404: {
      description: 'User not found',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['auth'],
  security: [{ Bearer: [] }],
  middleware: [requireAuth()] as const,
});
