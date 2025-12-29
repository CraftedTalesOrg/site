import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser } from '../../factories';
import { authenticatedRequest } from '../../helpers/auth';
import type { PrivateUser } from '../../../src/features/users/users.schemas';

describe('PATCH /api/v1/users/me', () => {
  describe('success cases', () => {
    it('should update username', async () => {
      // Arrange: Create a test user
      const user = await createTestUser(env, {
        username: 'oldusername',
      });

      // Act: Update username
      const res = await authenticatedRequest(app, env, user, '/api/v1/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          username: 'newusername',
        }),
      });

      // Assert: Check response
      expect(res.status).toBe(200);
      const data = await res.json<PrivateUser>();

      expect(data.username).toBe('newusername');
      expect(data.id).toBe(user.id);
    });

    it('should update bio', async () => {
      // Arrange: Create user
      const user = await createTestUser(env, {
        bio: 'Old bio',
      });

      // Act: Update bio
      const res = await authenticatedRequest(app, env, user, '/api/v1/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          bio: 'New and improved bio!',
        }),
      });

      // Assert: Check bio updated
      expect(res.status).toBe(200);
      const data = await res.json<PrivateUser>();

      expect(data.bio).toBe('New and improved bio!');
    });

    it('should update multiple fields at once', async () => {
      // Arrange: Create user
      const user = await createTestUser(env, {
        username: 'olduser',
        bio: 'Old bio',
      });

      // Act: Update multiple fields
      const res = await authenticatedRequest(app, env, user, '/api/v1/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          username: 'newuser',
          bio: 'New bio',
        }),
      });

      // Assert: Check both fields updated
      expect(res.status).toBe(200);
      const data = await res.json<PrivateUser>();

      expect(data.username).toBe('newuser');
      expect(data.bio).toBe('New bio');
    });

    it('should allow partial updates', async () => {
      // Arrange: Create user
      const user = await createTestUser(env, {
        username: 'testuser',
        bio: 'Original bio',
      });

      // Act: Update only bio
      const res = await authenticatedRequest(app, env, user, '/api/v1/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          bio: 'Updated bio only',
        }),
      });

      // Assert: Bio updated, username unchanged
      expect(res.status).toBe(200);
      const data = await res.json<PrivateUser>();

      expect(data.bio).toBe('Updated bio only');
      expect(data.username).toBe('testuser');
    });
  });

  describe('authentication errors', () => {
    it('should reject request without authentication', async () => {
      // Act: Make request without auth
      const res = await app.request('/api/v1/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'newname' }),
      }, env);

      // Assert: Should return 401
      expect(res.status).toBe(401);
    });

    it('should reject request with invalid token', async () => {
      // Act: Make request with invalid token
      const res = await app.request('/api/v1/users/me', {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer invalid-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'newname' }),
      }, env);

      // Assert: Should return 401
      expect(res.status).toBe(401);
    });
  });

  describe('validation errors', () => {
    it('should reject invalid field types', async () => {
      // Arrange: Create user
      const user = await createTestUser(env);

      // Act: Send invalid data type
      const res = await authenticatedRequest(app, env, user, '/api/v1/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          username: 12345, // Should be string
        }),
      });

      // Assert: Should fail validation
      expect(res.status).toBe(400);
    });
  });

  describe('response headers', () => {
    it('should return correct content-type header', async () => {
      // Arrange: Create user
      const user = await createTestUser(env);

      // Act: Update profile
      const res = await authenticatedRequest(app, env, user, '/api/v1/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ bio: 'New bio' }),
      });

      // Assert: Check content-type
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');
    });
  });
});
