import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser, createTestMod } from '../../factories';
import { authenticatedRequest } from '../../helpers/auth';
import type { SuccessResponse, ErrorResponse } from '../../../src/features/_shared/common.schemas';

describe('POST /api/v1/mods/:slug/like', () => {
  describe('success cases - liking', () => {
    it('should like a mod', async () => {
      const owner = await createTestUser(env);
      const liker = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: owner.id,
        status: 'published',
        approved: true,
      });

      const res = await authenticatedRequest(app, env, liker, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.success).toBe(true);
      expect(data.message).toBe('Mod liked successfully');
    });

    it('should allow user to like their own mod', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.success).toBe(true);
      expect(data.message).toBe('Mod liked successfully');
    });

    it('should like a draft mod', async () => {
      const owner = await createTestUser(env);
      const liker = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: owner.id,
        status: 'draft',
      });

      const res = await authenticatedRequest(app, env, liker, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.success).toBe(true);
    });

    it('should like an unlisted mod', async () => {
      const owner = await createTestUser(env);
      const liker = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: owner.id,
        status: 'published',
        approved: true,
        visibility: 'unlisted',
      });

      const res = await authenticatedRequest(app, env, liker, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.success).toBe(true);
    });

    it('should like a private mod', async () => {
      const owner = await createTestUser(env);
      const liker = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: owner.id,
        status: 'published',
        approved: true,
        visibility: 'private',
      });

      const res = await authenticatedRequest(app, env, liker, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.success).toBe(true);
    });
  });

  describe('success cases - unliking', () => {
    it('should unlike a previously liked mod', async () => {
      const owner = await createTestUser(env);
      const liker = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: owner.id,
        status: 'published',
        approved: true,
      });

      // Like the mod first
      await authenticatedRequest(app, env, liker, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      // Unlike the mod
      const res = await authenticatedRequest(app, env, liker, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.success).toBe(true);
      expect(data.message).toBe('Mod unliked successfully');
    });

    it('should toggle like status correctly', async () => {
      const owner = await createTestUser(env);
      const liker = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: owner.id,
        status: 'published',
        approved: true,
      });

      // Like
      const likeRes1 = await authenticatedRequest(app, env, liker, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      expect(likeRes1.status).toBe(200);
      const likeData1 = await likeRes1.json<SuccessResponse>();

      expect(likeData1.message).toBe('Mod liked successfully');

      // Unlike
      const likeRes2 = await authenticatedRequest(app, env, liker, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      expect(likeRes2.status).toBe(200);
      const likeData2 = await likeRes2.json<SuccessResponse>();

      expect(likeData2.message).toBe('Mod unliked successfully');

      // Like again
      const likeRes3 = await authenticatedRequest(app, env, liker, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      expect(likeRes3.status).toBe(200);
      const likeData3 = await likeRes3.json<SuccessResponse>();

      expect(likeData3.message).toBe('Mod liked successfully');
    });
  });

  describe('authentication errors', () => {
    it('should reject unauthenticated requests', async () => {
      const owner = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: owner.id,
        status: 'published',
        approved: true,
      });

      const res = await app.request(`/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      }, env);

      expect(res.status).toBe(401);
    });

    it('should reject requests with invalid token', async () => {
      const owner = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: owner.id,
        status: 'published',
        approved: true,
      });

      const res = await app.request(`/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer invalid-token',
        },
      }, env);

      expect(res.status).toBe(401);
    });
  });

  describe('error cases', () => {
    it('should return 404 for non-existent mod', async () => {
      const user = await createTestUser(env);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods/non-existent-mod/like', {
        method: 'POST',
      });

      expect(res.status).toBe(404);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('MOD_NOT_FOUND');
      expect(error.error).toBe('Mod not found');
    });

    it('should return 404 for deleted mod', async () => {
      const owner = await createTestUser(env);
      const liker = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: owner.id,
        status: 'published',
        approved: true,
      });

      // Delete the mod
      await authenticatedRequest(app, env, owner, `/api/v1/mods/${mod.slug}`, {
        method: 'DELETE',
      });

      // Try to like the deleted mod
      const res = await authenticatedRequest(app, env, liker, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      expect(res.status).toBe(404);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple users liking the same mod', async () => {
      const owner = await createTestUser(env);
      const liker1 = await createTestUser(env);
      const liker2 = await createTestUser(env);
      const liker3 = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: owner.id,
        status: 'published',
        approved: true,
      });

      // Multiple users like the same mod
      const res1 = await authenticatedRequest(app, env, liker1, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      const res2 = await authenticatedRequest(app, env, liker2, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      const res3 = await authenticatedRequest(app, env, liker3, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(res3.status).toBe(200);
    });

    it('should isolate like status per user', async () => {
      const owner = await createTestUser(env);
      const user1 = await createTestUser(env);
      const user2 = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: owner.id,
        status: 'published',
        approved: true,
      });

      // User 1 likes
      await authenticatedRequest(app, env, user1, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      // User 2 should still be able to like (not affected by user 1)
      const res = await authenticatedRequest(app, env, user2, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.message).toBe('Mod liked successfully');
    });

    it('should handle rapid like/unlike toggles', async () => {
      const owner = await createTestUser(env);
      const liker = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: owner.id,
        status: 'published',
        approved: true,
      });

      // Rapid toggles
      for (let i = 0; i < 5; i++) {
        const res = await authenticatedRequest(app, env, liker, `/api/v1/mods/${mod.slug}/like`, {
          method: 'POST',
        });

        expect(res.status).toBe(200);
      }

      // Final state should be "liked" (odd number of toggles)
      const finalRes = await authenticatedRequest(app, env, liker, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      expect(finalRes.status).toBe(200);
      const data = await finalRes.json<SuccessResponse>();

      expect(data.message).toBe('Mod unliked successfully');
    });

    it('should handle liking mod with special characters in slug', async () => {
      const owner = await createTestUser(env);
      const liker = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: owner.id,
        slug: 'mod-with-dashes-123',
        status: 'published',
        approved: true,
      });

      const res = await authenticatedRequest(app, env, liker, `/api/v1/mods/${mod.slug}/like`, {
        method: 'POST',
      });

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.success).toBe(true);
    });
  });
});
