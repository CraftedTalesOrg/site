import bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';

/**
 * Authentication utilities
 */

const SALT_ROUNDS = 10;
const JWT_EXPIRY_DAYS = 7;

/**
 * Hash a plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a plain text password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a random token for email verification or password reset
 */
export function generateToken(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const randomValues = new Uint8Array(length);

  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    token += chars[randomValues[i] % chars.length];
  }

  return token;
}

/**
 * Store a token in KV with expiration (for email verification, password reset)
 */
export async function storeToken(
  kv: KVNamespace,
  type: 'email-verification' | 'password-reset',
  userId: string,
  expirationMinutes = 10,
): Promise<string> {
  const token = generateToken();
  const key = `${type}:${token}`;
  const expirationSeconds = expirationMinutes * 60;

  await kv.put(key, userId, { expirationTtl: expirationSeconds });

  return token;
}

/**
 * Retrieve and consume a token from KV (one-time use)
 */
export async function consumeToken(
  kv: KVNamespace,
  type: 'email-verification' | 'password-reset',
  token: string,
): Promise<string | null> {
  const key = `${type}:${token}`;
  const userId = await kv.get(key);

  if (userId) {
    // Delete the token after retrieving it (one-time use)
    await kv.delete(key);
  }

  return userId;
}

/**
 * Sign a JWT access token with userId and roles
 * Token expires in 7 days
 */
export async function signAccessToken(
  userId: string,
  roles: string[],
  secret: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + JWT_EXPIRY_DAYS * 24 * 60 * 60;

  const payload = {
    userId,
    roles,
    iat: now,
    exp,
  };

  return sign(payload, secret);
}
