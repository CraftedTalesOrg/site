import { createRoute } from '@hono/zod-openapi';
import type { OpenAPIHono } from '@hono/zod-openapi';
import { users } from '@craftedtales/db';
import { eq } from 'drizzle-orm';
import type { Env } from '../../env.d';
import { createDb, getDbBinding, getRateLimitKV } from '../../utils/db';
import { hashPassword, verifyPassword, storeToken, consumeToken } from '../../utils/auth';
import { RATE_LIMITS } from '../../utils/rate-limit';
import { rateLimit, requireAuth } from '../../middleware';
import {
  loginRequestSchema,
  registerRequestSchema,
  authResponseSchema,
  publicUserSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
  verifyEmailRequestSchema,
} from '../../schemas/users';
import { errorResponseSchema, successResponseSchema } from '../../schemas/common';

// ─────────────────────────────────────────────────────────────────────────────
// Stubbed email function (to be replaced with actual email service later)
// ─────────────────────────────────────────────────────────────────────────────
async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  console.info(`[STUB EMAIL] To: ${to}, Subject: ${subject}, Body: ${body}`);
  // TODO: Integrate with Resend, SendGrid, or another email service
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper to map user to public user response
// ─────────────────────────────────────────────────────────────────────────────
type PublicUserResponse = {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  avatarId: string | null;
  roles: string[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function toPublicUser(user: typeof users.$inferSelect): PublicUserResponse {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    avatarId: user.avatarId,
    roles: user.roles,
    enabled: user.enabled,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Route Definitions
// ─────────────────────────────────────────────────────────────────────────────

const registerRoute = createRoute({
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
    400: {
      description: 'Validation error',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    409: {
      description: 'Email or username already exists',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    500: {
      description: 'Internal server error',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['auth'],
});

const loginRoute = createRoute({
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
  },
  tags: ['auth'],
});

const logoutRoute = createRoute({
  method: 'post',
  path: '/auth/logout',
  responses: {
    200: {
      description: 'Logged out successfully',
      content: { 'application/json': { schema: successResponseSchema } },
    },
  },
  tags: ['auth'],
});

const meRoute = createRoute({
  method: 'get',
  path: '/auth/me',
  responses: {
    200: {
      description: 'Current user info',
      content: { 'application/json': { schema: publicUserSchema } },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['auth'],
});

const forgotPasswordRoute = createRoute({
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
      description: 'Password reset email sent (if account exists)',
      content: { 'application/json': { schema: successResponseSchema } },
    },
  },
  tags: ['auth'],
});

const resetPasswordRoute = createRoute({
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

const verifyEmailRoute = createRoute({
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

const resendVerificationRoute = createRoute({
  method: 'post',
  path: '/auth/resend-verification',
  responses: {
    200: {
      description: 'Verification email sent',
      content: { 'application/json': { schema: successResponseSchema } },
    },
    401: {
      description: 'Not authenticated',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
  },
  tags: ['auth'],
});

// ─────────────────────────────────────────────────────────────────────────────
// Route Handlers
// ─────────────────────────────────────────────────────────────────────────────

export const registerAuthRoutes = (app: OpenAPIHono<Env>): void => {
  // ─────────────────────────────────────────────────────────────────────────
  // POST /auth/register
  // ─────────────────────────────────────────────────────────────────────────
  app.use('/auth/register', rateLimit(RATE_LIMITS.AUTH_REGISTER));
  app.openapi(registerRoute, async (c) => {
    const { username, email, password, bio } = c.req.valid('json');
    const db = createDb(getDbBinding(c.env));

    // Check if email already exists (using new v2 relational query API)
    const existingEmail = await db.query.users.findFirst({
      where: { email },
      columns: { id: true },
    });

    if (existingEmail) {
      return c.json(
        { error: 'Email already registered', code: 'EMAIL_EXISTS', statusCode: 409 },
        409,
      );
    }

    // Check if username already exists
    const existingUsername = await db.query.users.findFirst({
      where: { username },
      columns: { id: true },
    });

    if (existingUsername) {
      return c.json(
        { error: 'Username already taken', code: 'USERNAME_EXISTS', statusCode: 409 },
        409,
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const userId = crypto.randomUUID();

    await db.insert(users).values({
      id: userId,
      username,
      email,
      password: hashedPassword,
      bio: bio ?? null,
      roles: ['user'],
      emailVerified: false,
    });

    // Generate email verification token and send email
    const kv = getRateLimitKV(c.env);
    const verificationToken = await storeToken(kv, 'email-verification', userId, 60 * 24); // 24 hours

    await sendEmail(
      email,
      'Verify your email',
      `Click here to verify: /auth/verify-email?token=${verificationToken}`,
    );

    // Create session
    const session = c.get('session');

    session.set('userId', userId);

    // Fetch the created user for response
    const newUser = await db.query.users.findFirst({
      where: { id: userId },
    });

    if (!newUser) {
      return c.json(
        { error: 'Failed to create user', code: 'CREATE_FAILED', statusCode: 500 },
        500,
      );
    }

    return c.json({ user: toPublicUser(newUser), sessionId: session.sessionId }, 201);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // POST /auth/login
  // ─────────────────────────────────────────────────────────────────────────
  app.use('/auth/login', rateLimit(RATE_LIMITS.AUTH_LOGIN));
  app.openapi(loginRoute, async (c) => {
    const { email, password } = c.req.valid('json');
    const db = createDb(getDbBinding(c.env));

    // Find user by email (using new v2 relational query API)
    const user = await db.query.users.findFirst({
      where: { email, deleted: false },
    });

    if (!user) {
      return c.json(
        { error: 'Invalid email or password', code: 'INVALID_CREDENTIALS', statusCode: 401 },
        401,
      );
    }

    // Verify password
    if (!user.password) {
      // OAuth-only account
      return c.json(
        { error: 'Please login with your social account', code: 'OAUTH_ONLY', statusCode: 401 },
        401,
      );
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return c.json(
        { error: 'Invalid email or password', code: 'INVALID_CREDENTIALS', statusCode: 401 },
        401,
      );
    }

    // Create session
    const session = c.get('session');

    session.set('userId', user.id);

    return c.json({ user: toPublicUser(user), sessionId: session.sessionId }, 200);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // POST /auth/logout
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(logoutRoute, async (c) => {
    const session = c.get('session');

    session.deleteSession();

    return c.json({ success: true, message: 'Logged out successfully' }, 200);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /auth/me
  // ─────────────────────────────────────────────────────────────────────────
  app.use('/auth/me', requireAuth());
  app.openapi(meRoute, async (c) => {
    const user = c.get('user')!;

    return c.json(toPublicUser(user), 200);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // POST /auth/forgot-password
  // ─────────────────────────────────────────────────────────────────────────
  app.use('/auth/forgot-password', rateLimit(RATE_LIMITS.AUTH_FORGOT_PASSWORD));
  app.openapi(forgotPasswordRoute, async (c) => {
    const { email } = c.req.valid('json');
    const db = createDb(getDbBinding(c.env));

    // Always return success to prevent email enumeration
    const user = await db.query.users.findFirst({
      where: { email, deleted: false },
      columns: { id: true, email: true },
    });

    if (user) {
      const kv = getRateLimitKV(c.env);
      const resetToken = await storeToken(kv, 'password-reset', user.id, 30); // 30 minutes

      await sendEmail(
        email,
        'Reset your password',
        `Click here to reset: /auth/reset-password?token=${resetToken}`,
      );
    }

    return c.json({ success: true, message: 'If the email exists, a reset link has been sent' }, 200);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // POST /auth/reset-password
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(resetPasswordRoute, async (c) => {
    const { token, newPassword } = c.req.valid('json');
    const kv = getRateLimitKV(c.env);

    const userId = await consumeToken(kv, 'password-reset', token);

    if (!userId) {
      return c.json(
        { error: 'Invalid or expired reset token', code: 'INVALID_TOKEN', statusCode: 400 },
        400,
      );
    }

    const db = createDb(getDbBinding(c.env));
    const hashedPassword = await hashPassword(newPassword);

    // Use traditional update API with eq() for mutations
    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return c.json({ success: true, message: 'Password reset successfully' }, 200);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // POST /auth/verify-email
  // ─────────────────────────────────────────────────────────────────────────
  app.openapi(verifyEmailRoute, async (c) => {
    const { token } = c.req.valid('json');
    const kv = getRateLimitKV(c.env);

    const userId = await consumeToken(kv, 'email-verification', token);

    if (!userId) {
      return c.json(
        { error: 'Invalid or expired verification token', code: 'INVALID_TOKEN', statusCode: 400 },
        400,
      );
    }

    const db = createDb(getDbBinding(c.env));

    // Use traditional update API with eq() for mutations
    await db
      .update(users)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return c.json({ success: true, message: 'Email verified successfully' }, 200);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // POST /auth/resend-verification
  // ─────────────────────────────────────────────────────────────────────────
  app.use('/auth/resend-verification', requireAuth());
  app.openapi(resendVerificationRoute, async (c) => {
    const user = c.get('user')!;

    if (user.emailVerified) {
      return c.json({ success: true, message: 'Email already verified' }, 200);
    }

    const kv = getRateLimitKV(c.env);
    const verificationToken = await storeToken(kv, 'email-verification', user.id, 60 * 24); // 24 hours

    await sendEmail(
      user.email,
      'Verify your email',
      `Click here to verify: /auth/verify-email?token=${verificationToken}`,
    );

    return c.json({ success: true, message: 'Verification email sent' }, 200);
  });
};
