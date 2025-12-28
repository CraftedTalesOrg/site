import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser } from '../../factories';
import { authenticatedRequest } from '../../helpers/auth';
import type { ErrorResponse, SuccessResponse } from '../../../src/features/_shared/common.schemas';

describe('POST /api/v1/users/{id}/{action}', () => {
  describe('success cases - suspend', () => {
    it('should allow admin to suspend a user', async () => {
      // Arrange: Create admin and target user
      const admin = await createTestUser(env, {
        username: 'admin',
        roles: ['admin'],
      });
      const targetUser = await createTestUser(env, {
        username: 'suspendme',
      });

      // Act: Suspend user
      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/users/${targetUser.id}/suspend`,
        {
          method: 'POST',
          body: JSON.stringify({
            reason: 'Violating community guidelines',
          }),
        },
      );

      // Assert: Check response
      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.message).toBeDefined();
    });

    it('should allow moderator to suspend a user', async () => {
      // Arrange: Create moderator and target user
      const moderator = await createTestUser(env, {
        username: 'moderator',
        roles: ['moderator'],
      });
      const targetUser = await createTestUser(env, {
        username: 'baduser',
      });

      // Act: Suspend user
      const res = await authenticatedRequest(
        app,
        env,
        moderator,
        `/api/v1/users/${targetUser.id}/suspend`,
        {
          method: 'POST',
          body: JSON.stringify({
            reason: 'Spam',
          }),
        },
      );

      // Assert: Check response
      expect(res.status).toBe(200);
    });

    it('should allow suspension without a reason', async () => {
      // Arrange: Create admin and target user
      const admin = await createTestUser(env, {
        username: 'admin2',
        roles: ['admin'],
      });
      const targetUser = await createTestUser(env, {
        username: 'suspendwithoutreason',
      });

      // Act: Suspend user without reason
      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/users/${targetUser.id}/suspend`,
        {
          method: 'POST',
          body: JSON.stringify({}),
        },
      );

      // Assert: Check response
      expect(res.status).toBe(200);
    });
  });

  describe('success cases - unsuspend', () => {
    it('should allow admin to unsuspend a user', async () => {
      // Arrange: Create admin and target user
      const admin = await createTestUser(env, {
        username: 'adminunsuspend',
        roles: ['admin'],
      });
      const targetUser = await createTestUser(env, {
        username: 'suspendeduser',
      });

      // Act: Unsuspend user
      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/users/${targetUser.id}/unsuspend`,
        {
          method: 'POST',
          body: JSON.stringify({
            reason: 'Appeal accepted',
          }),
        },
      );

      // Assert: Check response
      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.message).toBeDefined();
    });

    it('should allow moderator to unsuspend a user', async () => {
      // Arrange: Create moderator and target user
      const moderator = await createTestUser(env, {
        username: 'modunsuspend',
        roles: ['moderator'],
      });
      const targetUser = await createTestUser(env, {
        username: 'reactivateuser',
      });

      // Act: Unsuspend user
      const res = await authenticatedRequest(
        app,
        env,
        moderator,
        `/api/v1/users/${targetUser.id}/unsuspend`,
        {
          method: 'POST',
          body: JSON.stringify({}),
        },
      );

      // Assert: Check response
      expect(res.status).toBe(200);
    });
  });

  describe('authorization errors', () => {
    it('should deny regular user from suspending another user', async () => {
      // Arrange: Create two regular users
      const regularUser = await createTestUser(env, {
        username: 'regularuser',
        roles: ['user'],
      });
      const targetUser = await createTestUser(env, {
        username: 'targetuser',
      });

      // Act: Try to suspend as regular user
      const res = await authenticatedRequest(
        app,
        env,
        regularUser,
        `/api/v1/users/${targetUser.id}/suspend`,
        {
          method: 'POST',
          body: JSON.stringify({ reason: 'I dont like them' }),
        },
      );

      // Assert: Should return 403
      expect(res.status).toBe(403);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('ACCESS_DENIED');
    });

    it('should deny user without admin/moderator role', async () => {
      // Arrange: Create user without proper role
      const user = await createTestUser(env, {
        username: 'noroleuser',
        roles: [],
      });
      const targetUser = await createTestUser(env, {
        username: 'victim',
      });

      // Act: Try to suspend
      const res = await authenticatedRequest(
        app,
        env,
        user,
        `/api/v1/users/${targetUser.id}/suspend`,
        {
          method: 'POST',
          body: JSON.stringify({}),
        },
      );

      // Assert: Should return 403
      expect(res.status).toBe(403);
    });
  });

  describe('authentication errors', () => {
    it('should reject request without authentication', async () => {
      // Arrange: Create target user
      const targetUser = await createTestUser(env);

      // Act: Make request without auth
      const res = await app.request(
        `/api/v1/users/${targetUser.id}/suspend`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: 'Test' }),
        },
        env,
      );

      // Assert: Should return 401
      expect(res.status).toBe(401);
    });
  });

  describe('business logic errors', () => {
    it('should prevent admin from suspending themselves', async () => {
      // Arrange: Create admin
      const admin = await createTestUser(env, {
        username: 'selfadmin',
        roles: ['admin'],
      });

      // Act: Try to suspend self
      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/users/${admin.id}/suspend`,
        {
          method: 'POST',
          body: JSON.stringify({ reason: 'Self-suspend' }),
        },
      );

      // Assert: Should return 403
      expect(res.status).toBe(403);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('SELF_ACTION');
    });

    it('should prevent moderator from suspending themselves', async () => {
      // Arrange: Create moderator
      const moderator = await createTestUser(env, {
        username: 'selfmod',
        roles: ['moderator'],
      });

      // Act: Try to suspend self
      const res = await authenticatedRequest(
        app,
        env,
        moderator,
        `/api/v1/users/${moderator.id}/suspend`,
        {
          method: 'POST',
          body: JSON.stringify({}),
        },
      );

      // Assert: Should return 403
      expect(res.status).toBe(403);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('SELF_ACTION');
    });
  });

  describe('not found errors', () => {
    it('should return 404 for non-existent user', async () => {
      // Arrange: Create admin
      const admin = await createTestUser(env, {
        username: 'admin404',
        roles: ['admin'],
      });

      // Act: Try to suspend non-existent user
      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/users/00000000-0000-0000-0000-000000000000/suspend',
        {
          method: 'POST',
          body: JSON.stringify({ reason: 'Test' }),
        },
      );

      // Assert: Should return 404
      expect(res.status).toBe(404);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('USER_NOT_FOUND');
    });
  });

  describe('validation errors', () => {
    it('should reject invalid action type', async () => {
      // Arrange: Create admin and target user
      const admin = await createTestUser(env, {
        username: 'validationadmin',
        roles: ['admin'],
      });
      const targetUser = await createTestUser(env);

      // Act: Try invalid action
      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/users/${targetUser.id}/invalidaction`,
        {
          method: 'POST',
          body: JSON.stringify({}),
        },
      );

      // Assert: Should fail validation (likely 400 or 404)
      expect([400, 404]).toContain(res.status);
    });

    it('should reject invalid UUID format', async () => {
      // Arrange: Create admin
      const admin = await createTestUser(env, {
        username: 'uuidadmin',
        roles: ['admin'],
      });

      // Act: Try with invalid UUID
      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/users/not-a-uuid/suspend',
        {
          method: 'POST',
          body: JSON.stringify({}),
        },
      );

      // Assert: Should fail validation
      expect(res.status).toBe(400);
    });
  });

  describe('response headers', () => {
    it('should return correct content-type header', async () => {
      // Arrange: Create admin and target user
      const admin = await createTestUser(env, {
        username: 'headeradmin',
        roles: ['admin'],
      });
      const targetUser = await createTestUser(env, {
        username: 'headertarget',
      });

      // Act: Suspend user
      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/users/${targetUser.id}/suspend`,
        {
          method: 'POST',
          body: JSON.stringify({}),
        },
      );

      // Assert: Check content-type
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');
    });
  });
});
