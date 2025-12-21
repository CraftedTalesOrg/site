import { createRoute } from '@hono/zod-openapi';
import {
  registerRequestSchema,
  loginRequestSchema,
  authResponseSchema,
  privateUserSchema,
  verifyEmailRequestSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
} from './auth.schemas';
import { errorResponseSchema, successResponseSchema } from '../_shared/common.schemas';
import { z } from 'zod';

/**
 * OpenAPI route definitions for auth feature
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
  },
  tags: ['auth'],
});

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
});

export const logoutRoute = createRoute({
  method: 'post',
  path: '/auth/logout',
  responses: {
    200: {
      description: 'Logout successful',
      content: { 'application/json': { schema: successResponseSchema } },
    },
  },
  tags: ['auth'],
});

export const meRoute = createRoute({
  method: 'get',
  path: '/auth/me',
  responses: {
    200: {
      description: 'Current user profile',
      content: {
        'application/json': {
          schema: z.object({ user: privateUserSchema }),
        },
      },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['auth'],
});

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
});

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
  },
  tags: ['auth'],
});
