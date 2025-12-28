import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser } from '../../factories';
import type { PublicUser } from '../../../src/features/users/users.schemas';
import type { ErrorResponse } from '../../../src/features/_shared/common.schemas';

describe('GET /api/v1/users/{username}', () => {
  describe('success cases', () => {
    it('should return user by username', async () => {
      // Arrange: Create a test user
      const user = await createTestUser(env, {
        username: 'johndoe',
        bio: 'I am John Doe',
      });

      // Act: Make request
      const res = await app.request('/api/v1/users/johndoe', {}, env);

      // Assert: Check response
      expect(res.status).toBe(200);
      const data = await res.json<{ user: PublicUser }>();

      expect(data.user.id).toBe(user.id);
      expect(data.user.username).toBe('johndoe');
      expect(data.user.bio).toBe('I am John Doe');
    });

    it('should return user with avatar field', async () => {
      // Arrange: Create user
      await createTestUser(env, {
        username: 'avataruser',
      });

      // Act: Make request
      const res = await app.request('/api/v1/users/avataruser', {}, env);

      // Assert: Check avatar field exists
      expect(res.status).toBe(200);
      const data = await res.json<{ user: PublicUser }>();

      expect(data.user).toHaveProperty('avatar');
      expect(data.user.avatar).toBeNull();
    });

    it('should not include private fields', async () => {
      // Arrange: Create user with email
      await createTestUser(env, {
        username: 'publicuser',
        email: 'private@example.com',
      });

      // Act: Make request
      const res = await app.request('/api/v1/users/publicuser', {}, env);

      // Assert: Verify private fields are NOT in response
      expect(res.status).toBe(200);
      const data = await res.json<{ user: PublicUser }>();

      expect(data.user).not.toHaveProperty('email');
      expect(data.user).not.toHaveProperty('password');
      expect(data.user).not.toHaveProperty('emailVerified');
      expect(data.user).not.toHaveProperty('twoFactorEnabled');
      expect(data.user).not.toHaveProperty('twoFactorSecret');
      expect(data.user).not.toHaveProperty('roles');
    });

    it('should include public fields like createdAt', async () => {
      // Arrange: Create user
      await createTestUser(env, {
        username: 'timestampuser',
      });

      // Act: Make request
      const res = await app.request('/api/v1/users/timestampuser', {}, env);

      // Assert: Check public fields exist
      expect(res.status).toBe(200);
      const data = await res.json<{ user: PublicUser }>();

      expect(data.user).toHaveProperty('id');
      expect(data.user).toHaveProperty('username');
      expect(data.user).toHaveProperty('bio');
      expect(data.user).toHaveProperty('createdAt');
      expect(data.user).toHaveProperty('avatar');
    });
  });

  describe('not found errors', () => {
    it('should return 404 for non-existent username', async () => {
      // Act: Request non-existent user
      const res = await app.request('/api/v1/users/nonexistentuser', {}, env);

      // Assert: Should return 404
      expect(res.status).toBe(404);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('USER_NOT_FOUND');
    });

    it('should return 404 for empty username', async () => {
      // Act: Request with empty username
      const res = await app.request('/api/v1/users/', {}, env);

      // Assert: Should return 404 (route not found)
      expect(res.status).toBe(404);
    });
  });

  describe('endpoint availability', () => {
    it('should be accessible without authentication', async () => {
      // Arrange: Create user
      await createTestUser(env, { username: 'publicaccess' });

      // Act: Make request without auth
      const res = await app.request('/api/v1/users/publicaccess', {}, env);

      // Assert: Should succeed (public endpoint)
      expect(res.status).toBe(200);
      const data = await res.json<{ user: PublicUser }>();

      expect(data.user.username).toBe('publicaccess');
    });
  });

  describe('response headers', () => {
    it('should return correct content-type header', async () => {
      // Arrange: Create user
      await createTestUser(env, { username: 'headertest' });

      // Act: Make request
      const res = await app.request('/api/v1/users/headertest', {}, env);

      // Assert: Check content-type
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');
    });
  });
});
