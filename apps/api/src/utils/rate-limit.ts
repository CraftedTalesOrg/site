/**
 * Rate limiting utilities using Cloudflare KV
 */

interface RateLimitData {
  count: number;
  resetAt: number;
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
  /** Identifier for the rate limit (e.g., 'auth:login', 'mods:create') */
  identifier: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check and update rate limit for a given key
 */
export async function checkRateLimit(
  kv: KVNamespace,
  key: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const now = Date.now();
  const kvKey = `ratelimit:${config.identifier}:${key}`;

  // Get current counter and expiration
  const data = await kv.get<RateLimitData>(kvKey, 'json');

  if (!data || data.resetAt < now) {
    // First request or window expired - create new window
    const resetAt = now + config.windowSeconds * 1000;

    await kv.put(
      kvKey,
      JSON.stringify({ count: 1, resetAt }),
      { expirationTtl: config.windowSeconds },
    );

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt,
    };
  }

  // Window still valid - check if limit exceeded
  if (data.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: data.resetAt,
    };
  }

  // Increment counter
  const newCount = data.count + 1;

  await kv.put(
    kvKey,
    JSON.stringify({ count: newCount, resetAt: data.resetAt }),
    { expirationTtl: config.windowSeconds },
  );

  return {
    allowed: true,
    remaining: config.maxRequests - newCount,
    resetAt: data.resetAt,
  };
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Auth endpoints (strict)
  AUTH_LOGIN: { maxRequests: 5, windowSeconds: 60, identifier: 'auth:login' },
  AUTH_REGISTER: { maxRequests: 3, windowSeconds: 300, identifier: 'auth:register' },
  AUTH_FORGOT_PASSWORD: { maxRequests: 3, windowSeconds: 300, identifier: 'auth:forgot-password' },

  // Read endpoints (lenient)
  READ_DEFAULT: { maxRequests: 100, windowSeconds: 60, identifier: 'read:default' },

  // Write endpoints (moderate)
  WRITE_DEFAULT: { maxRequests: 20, windowSeconds: 60, identifier: 'write:default' },

  // File upload endpoints (strict)
  UPLOAD_MEDIA: { maxRequests: 10, windowSeconds: 300, identifier: 'upload:media' },
  UPLOAD_MOD: { maxRequests: 5, windowSeconds: 3600, identifier: 'upload:mod' },

  // Report endpoints (moderate-strict)
  REPORTS: { maxRequests: 10, windowSeconds: 3600, identifier: 'reports:create' },
} as const;

/**
 * Get client identifier (IP address or user ID if authenticated)
 */
export function getClientIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Try to get IP from Cloudflare headers
  const cfConnectingIp = request.headers.get('CF-Connecting-IP');

  if (cfConnectingIp) {
    return `ip:${cfConnectingIp}`;
  }

  // Fallback to X-Forwarded-For
  const xForwardedFor = request.headers.get('X-Forwarded-For');

  if (xForwardedFor) {
    return `ip:${xForwardedFor.split(',')[0].trim()}`;
  }

  // Last resort - use a default (not ideal for rate limiting)
  return 'ip:unknown';
}
