import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser } from '../../factories';
import { authenticatedRequest } from '../../helpers/auth';
import type { PrivateUser } from '../../../src/features/users/users.schemas';

describe('GET /api/v1/users/me', () => {
  describe('success cases', () => {
    it('should return current user profile with private fields', async () => {
      // Arrange: Create a test user
      const user = await createTestUser(env, {
        email: 'testuser@example.com',
        username: 'testuser',
        bio: 'Test bio',
      });

      // Act: Make authenticated request
      const res = await authenticatedRequest(app, env, user, '/api/v1/users/me');

      // Assert: Check response
      expect(res.status).toBe(200);
      const data = await res.json<PrivateUser>();

      expect(data.id).toBe(user.id);
      expect(data.email).toBe('testuser@example.com');
      expect(data.username).toBe('testuser');
      expect(data.bio).toBe('Test bio');
    });

    it('should return user with roles', async () => {
      // Arrange: Create user with specific roles
      const user = await createTestUser(env, {
        username: 'adminuser',
        roles: ['admin', 'moderator'],
      });

      // Act: Make authenticated request
      const res = await authenticatedRequest(app, env, user, '/api/v1/users/me');

      // Assert: Check roles are returned
      expect(res.status).toBe(200);
      const data = await res.json<PrivateUser>();

      expect(data.roles).toEqual(expect.arrayContaining(['admin', 'moderator']));
    });

    it('should include avatar if present', async () => {
      // Arrange: Create user (avatar will be null by default from factory)
      const user = await createTestUser(env, { username: 'userwithouavatar' });

      // Act: Make authenticated request
      const res = await authenticatedRequest(app, env, user, '/api/v1/users/me');

      // Assert: Check avatar field exists
      expect(res.status).toBe(200);
      const data = await res.json<PrivateUser>();

      expect(data).toHaveProperty('avatar');
      expect(data.avatar).toBeNull();
    });

    it('should not include sensitive fields like password', async () => {
      // Arrange: Create user
      const user = await createTestUser(env);

      // Act: Make authenticated request
      const res = await authenticatedRequest(app, env, user, '/api/v1/users/me');

      // Assert: Verify password is NOT in response
      expect(res.status).toBe(200);
      const data = await res.json<PrivateUser>();

      expect(data).not.toHaveProperty('password');
      expect(data).not.toHaveProperty('twoFactorSecret');
    });
  });

  describe('authentication errors', () => {
    it('should reject request without authentication', async () => {
      // Act: Make request without auth
      const res = await app.request('/api/v1/users/me', {}, env);

      // Assert: Should return 401
      expect(res.status).toBe(401);
    });

    it('should reject request with invalid token', async () => {
      // Act: Make request with invalid token
      const res = await app.request('/api/v1/users/me', {
        headers: {
          Authorization: 'Bearer invalid-token-12345',
        },
      }, env);

      // Assert: Should return 401
      expect(res.status).toBe(401);
    });
  });

  describe('response headers', () => {
    it('should return correct content-type header', async () => {
      // Arrange: Create user
      const user = await createTestUser(env);

      // Act: Make authenticated request
      const res = await authenticatedRequest(app, env, user, '/api/v1/users/me');

      // Assert: Check content-type
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');
    });
  });
});
