import bcrypt from 'bcryptjs';

/**
 * Authentication utilities
 */

const SALT_ROUNDS = 10;

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
