import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser, createTestMod, createTestCategory, getModApprovalStatus, softDeleteMod } from '../../factories';
import { authenticatedRequest } from '../../helpers/auth';
import type { SuccessResponse, ErrorResponse } from '../../../src/features/_shared/common.schemas';

describe('POST /api/v1/mods/{id}/review/{action}', () => {
  describe('success cases - approve', () => {
    it('should allow admin to approve a mod', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'mod-to-approve',
        status: 'published',
        approved: false,
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/mods/${mod.id}/review/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.message).toBeDefined();

      // Verify mod is approved
      const approved = await getModApprovalStatus(env, mod.id);

      expect(approved).toBe(true);
    });

    it('should allow moderator to approve a mod', async () => {
      const moderator = await createTestUser(env, { roles: ['moderator'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'mod-moderator-approve',
        status: 'published',
        approved: false,
      });

      const res = await authenticatedRequest(
        app,
        env,
        moderator,
        `/api/v1/mods/${mod.id}/review/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.message).toBeDefined();
    });

    it('should approve mod without reason', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'approve-no-reason',
        status: 'published',
        approved: false,
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/mods/${mod.id}/review/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      expect(res.status).toBe(200);
    });

    it('should approve mod with reason', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'approve-with-reason',
        status: 'published',
        approved: false,
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/mods/${mod.id}/review/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reason: 'Excellent mod, meets all quality standards',
          }),
        },
      );

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.message).toBeDefined();
    });
  });

  describe('success cases - reject', () => {
    it('should allow admin to reject a mod', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'mod-to-reject',
        status: 'published',
        approved: false,
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/mods/${mod.id}/review/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reason: 'Does not meet quality standards',
          }),
        },
      );

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.message).toBeDefined();

      // Verify mod is still not approved
      const approved = await getModApprovalStatus(env, mod.id);

      expect(approved).toBe(false);
    });

    it('should allow moderator to reject a mod', async () => {
      const moderator = await createTestUser(env, { roles: ['moderator'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'mod-moderator-reject',
        status: 'published',
        approved: false,
      });

      const res = await authenticatedRequest(
        app,
        env,
        moderator,
        `/api/v1/mods/${mod.id}/review/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reason: 'Inappropriate content',
          }),
        },
      );

      expect(res.status).toBe(200);
    });

    it('should reject mod without reason', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'reject-no-reason',
        status: 'published',
        approved: false,
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/mods/${mod.id}/review/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      expect(res.status).toBe(200);
    });
  });

  describe('authorization errors', () => {
    it('should deny access to regular users for approve', async () => {
      const user = await createTestUser(env, { roles: ['user'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'user-approve-attempt',
        status: 'published',
        approved: false,
      });

      const res = await authenticatedRequest(
        app,
        env,
        user,
        `/api/v1/mods/${mod.id}/review/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      expect(res.status).toBe(403);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('ACCESS_DENIED');
    });

    it('should deny access to regular users for reject', async () => {
      const user = await createTestUser(env, { roles: ['user'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'user-reject-attempt',
        status: 'published',
        approved: false,
      });

      const res = await authenticatedRequest(
        app,
        env,
        user,
        `/api/v1/mods/${mod.id}/review/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      expect(res.status).toBe(403);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('ACCESS_DENIED');
    });

    it('should deny unauthenticated requests', async () => {
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'unauth-review',
        status: 'published',
        approved: false,
      });

      const res = await app.request(
        `/api/v1/mods/${mod.id}/review/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        env,
      );

      expect(res.status).toBe(401);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('not found errors', () => {
    it('should return 404 for non-existent mod ID', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const fakeId = crypto.randomUUID();

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/mods/${fakeId}/review/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      expect(res.status).toBe(404);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('NOT_FOUND');
    });

    it('should return 404 for deleted mod', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'deleted-review-mod',
        status: 'published',
        approved: false,
      });

      // Soft delete the mod
      await softDeleteMod(env, mod.id);

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/mods/${mod.id}/review/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      expect(res.status).toBe(404);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('NOT_FOUND');
    });
  });

  describe('validation errors', () => {
    it('should validate action parameter - invalid action', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'invalid-action-mod',
        status: 'published',
        approved: false,
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/mods/${mod.id}/review/invalid`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate UUID format for mod ID', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/mods/not-a-uuid/review/approve',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate reason max length', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'long-reason-mod',
        status: 'published',
        approved: false,
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/mods/${mod.id}/review/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reason: 'a'.repeat(501), // Exceeds 500 character limit
          }),
        },
      );

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate reason is not empty string when provided', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'empty-reason-mod',
        status: 'published',
        approved: false,
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/mods/${mod.id}/review/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reason: '',
          }),
        },
      );

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });
  });
});
