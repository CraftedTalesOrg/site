import type { OpenAPIHono } from '@hono/zod-openapi';
import type { Env, JwtPayload } from '../../env.d';
import { createDb } from '../../utils/db';
import { hashPassword, verifyPassword, signAccessToken, storeToken, consumeToken } from '../../utils/auth';
import {
  registerRoute,
  loginRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  verifyEmailRoute,
  resendVerificationRoute,
} from './auth.openapi';
import { authQueries } from './auth.queries';
import { usersQueries } from '../users/users.queries';
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from './auth.schemas';
import type { PrivateUser } from '../users/users.schemas';

/**
 * Register auth routes
 */
export const registerAuthRoutes = (app: OpenAPIHono<Env>): void => {
  /**
   * POST /register
   */
  app.openapi(registerRoute, async (c) => {
    const db = createDb(c.env);
    const body: RegisterRequest = c.req.valid('json');

    // Check if email already exists
    const existingUserByEmail: PrivateUser | null = await usersQueries.findByEmail(db, body.email);

    if (existingUserByEmail) {
      return c.json({ error: 'Email already in use', code: 'EMAIL_EXISTS' }, 409);
    }

    // Check if username already exists
    const usernameExists: boolean = await usersQueries.existsUsername(db, body.username);

    if (usernameExists) {
      return c.json({ error: 'Username already taken', code: 'USERNAME_EXISTS' }, 409);
    }

    // Hash password
    const hashedPassword: string = await hashPassword(body.password);

    // Create user
    const user: PrivateUser | null = await usersQueries.create(db, body, hashedPassword);

    if (!user) {
      return c.json({ error: 'Failed to create user', code: 'USER_CREATE_FAILED' }, 500);
    }

    // Generate verification token and store in KV
    const verificationToken = await storeToken(c.env.craftedtales_rl, 'email-verification', user.id);

    // TODO: Send verification email with token

    // Generate access token
    const accessToken: string = await signAccessToken(user.id, user.roles, c.env.JWT_SECRET);

    return c.json({ user, accessToken }, 201);
  });

  /**
   * POST /login
   */
  app.openapi(loginRoute, async (c) => {
    const db = createDb(c.env);
    const body: LoginRequest = c.req.valid('json');

    // Find user credentials for authentication
    const credentials = await authQueries.findCredentialsByEmail(db, body.email);

    if (!credentials) {
      return c.json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }, 401);
    }

    // Verify password
    const isValid: boolean = await verifyPassword(body.password, credentials.password ?? '');

    if (!isValid) {
      return c.json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }, 401);
    }

    // Get full user data
    const user: PrivateUser | null = await usersQueries.findById(db, credentials.id);

    if (!user) {
      return c.json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }, 401);
    }

    // Generate access token
    const accessToken: string = await signAccessToken(user.id, user.roles, c.env.JWT_SECRET);

    return c.json({ user, accessToken }, 200);
  });

  /**
   * POST /forgot-password
   */
  app.openapi(forgotPasswordRoute, async (c) => {
    const db = createDb(c.env);
    const body: ForgotPasswordRequest = c.req.valid('json');

    // Find user by email
    const user: PrivateUser | null = await usersQueries.findByEmail(db, body.email);

    if (user) {
      // Generate password reset token and store in KV
      const resetToken = await storeToken(c.env.craftedtales_rl, 'password-reset', user.id, 30);

      // TODO: Send password reset email with token
    }

    // Don't reveal whether email exists - always return success
    return c.json({ success: true, message: 'If the email exists, a password reset link has been sent' }, 200);
  });

  /**
   * POST /reset-password
   */
  app.openapi(resetPasswordRoute, async (c) => {
    const db = createDb(c.env);
    const body: ResetPasswordRequest = c.req.valid('json');

    // Validate reset token and get userId
    const userId: string | null = await consumeToken(c.env.craftedtales_rl, 'password-reset', body.token);

    if (!userId) {
      return c.json({ error: 'Invalid or expired token', code: 'INVALID_TOKEN' }, 400);
    }

    // Hash new password
    const hashedPassword: string = await hashPassword(body.newPassword);

    // Update password
    await authQueries.updatePassword(db, userId, hashedPassword);

    return c.json({ success: true, message: 'Password reset successfully' }, 200);
  });

  /**
   * POST /verify-email
   */
  app.openapi(verifyEmailRoute, async (c) => {
    const db = createDb(c.env);
    const body: VerifyEmailRequest = c.req.valid('json');

    // Validate verification token and get userId
    const userId: string | null = await consumeToken(c.env.craftedtales_rl, 'email-verification', body.token);

    if (!userId) {
      return c.json({ error: 'Invalid or expired token', code: 'INVALID_TOKEN' }, 400);
    }

    // Mark email as verified
    await authQueries.markEmailVerified(db, userId);

    return c.json({ success: true, message: 'Email verified successfully' }, 200);
  });

  app.openapi(resendVerificationRoute, async (c) => {
    const db = createDb(c.env);
    const { userId }: JwtPayload = c.get('jwtPayload');

    // Get user to check if already verified
    const user: PrivateUser | null = await usersQueries.findById(db, userId);

    if (!user) {
      return c.json({ error: 'User not found', code: 'USER_NOT_FOUND' }, 404);
    }

    // TODO: Check if email already verified
    // if (user.emailVerified) {
    //   return c.json({ error: 'Email already verified', code: 'EMAIL_ALREADY_VERIFIED' }, 400);
    // }

    // Generate new verification token
    const verificationToken = await storeToken(c.env.craftedtales_rl, 'email-verification', user.id);

    // TODO: Send verification email with token

    return c.json({ success: true, message: 'Verification email sent' }, 200);
  });
};
