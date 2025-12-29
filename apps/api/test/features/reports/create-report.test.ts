import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser, createTestMod, createTestCategory, softDeleteMod } from '../../factories';
import { authenticatedRequest } from '../../helpers/auth';
import type { SuccessResponse, ErrorResponse } from '../../../src/features/_shared/common.schemas';

describe('POST /api/v1/reports', () => {
  describe('success cases - mod reports', () => {
    it('should create a report for a mod', async () => {
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        status: 'published',
      });

      const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'mod',
          targetId: mod.id,
          reason: 'spam',
          description: 'This mod is spam',
        }),
      });

      expect(res.status).toBe(201);
      const data = await res.json<SuccessResponse>();

      expect(data.message).toBeDefined();
    });

    it('should create a report with different reason types', async () => {
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);

      const reasons = ['spam', 'inappropriate', 'copyright', 'malware', 'other'];

      for (const reason of reasons) {
        // Create a new mod for each reason to avoid duplicate report check
        const mod = await createTestMod(env, {
          ownerId: author.id,
          categoryIds: [category.id],
          status: 'published',
        });

        const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetType: 'mod',
            targetId: mod.id,
            reason,
            description: `Testing ${reason} reason`,
          }),
        });

        expect(res.status).toBe(201);
      }
    });

    it('should create a report with long description', async () => {
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        status: 'published',
      });

      const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'mod',
          targetId: mod.id,
          reason: 'other',
          description: 'A'.repeat(2000), // Max is 2000 characters
        }),
      });

      expect(res.status).toBe(201);
    });
  });

  describe('success cases - user reports', () => {
    it('should create a report for a user', async () => {
      const reporter = await createTestUser(env);
      const targetUser = await createTestUser(env);

      const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'user',
          targetId: targetUser.id,
          reason: 'harassment',
          description: 'This user is harassing others',
        }),
      });

      expect(res.status).toBe(201);
      const data = await res.json<SuccessResponse>();

      expect(data.message).toBeDefined();
    });
  });

  describe('validation errors', () => {
    it('should reject missing targetType', async () => {
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId: mod.id,
          reason: 'spam',
          description: 'Test',
        }),
      });

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject missing targetId', async () => {
      const reporter = await createTestUser(env);

      const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'mod',
          reason: 'spam',
          description: 'Test',
        }),
      });

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject missing reason', async () => {
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'mod',
          targetId: mod.id,
          description: 'Test',
        }),
      });

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject missing description', async () => {
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'mod',
          targetId: mod.id,
          reason: 'spam',
        }),
      });

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid targetType', async () => {
      const reporter = await createTestUser(env);
      const fakeId = crypto.randomUUID();

      const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'invalid',
          targetId: fakeId,
          reason: 'spam',
          description: 'Test',
        }),
      });

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid reason', async () => {
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'mod',
          targetId: mod.id,
          reason: 'invalid-reason',
          description: 'Test',
        }),
      });

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject description too short', async () => {
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'mod',
          targetId: mod.id,
          reason: 'spam',
          description: 'a', // Min is probably 10 characters
        }),
      });

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject description too long', async () => {
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'mod',
          targetId: mod.id,
          reason: 'spam',
          description: 'A'.repeat(2001), // Max is 2000
        }),
      });

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid UUID for targetId', async () => {
      const reporter = await createTestUser(env);

      const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'mod',
          targetId: 'not-a-uuid',
          reason: 'spam',
          description: 'Test description',
        }),
      });

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('not found errors', () => {
    it('should return 404 for non-existent mod', async () => {
      const reporter = await createTestUser(env);
      const fakeId = crypto.randomUUID();

      const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'mod',
          targetId: fakeId,
          reason: 'spam',
          description: 'This mod does not exist',
        }),
      });

      expect(res.status).toBe(404);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('MOD_NOT_FOUND');
    });

    it('should return 404 for non-existent user', async () => {
      const reporter = await createTestUser(env);
      const fakeId = crypto.randomUUID();

      const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'user',
          targetId: fakeId,
          reason: 'harassment',
          description: 'This user does not exist',
        }),
      });

      expect(res.status).toBe(404);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('USER_NOT_FOUND');
    });

    it('should return 404 for deleted mod', async () => {
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      // Soft delete the mod
      await softDeleteMod(env, mod.id);

      const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'mod',
          targetId: mod.id,
          reason: 'spam',
          description: 'Reporting deleted mod',
        }),
      });

      expect(res.status).toBe(404);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('MOD_NOT_FOUND');
    });
  });

  describe('authentication errors', () => {
    it('should deny unauthenticated requests', async () => {
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const res = await app.request(
        '/api/v1/reports',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetType: 'mod',
            targetId: mod.id,
            reason: 'spam',
            description: 'Test',
          }),
        },
        env,
      );

      expect(res.status).toBe(401);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('rate limiting', () => {
    it('should enforce rate limit on reports', async () => {
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);

      // Create multiple mods to report
      const mods = [];

      for (let i = 0; i < 10; i++) {
        const mod = await createTestMod(env, {
          ownerId: author.id,
          categoryIds: [category.id],
          slug: `rate-limit-mod-${i}`,
        });

        mods.push(mod);
      }

      // Attempt to create reports rapidly
      let rateLimited = false;

      for (const mod of mods) {
        const res = await authenticatedRequest(app, env, reporter, '/api/v1/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetType: 'mod',
            targetId: mod.id,
            reason: 'spam',
            description: 'Rate limit test',
          }),
        });

        if (res.status === 429) {
          rateLimited = true;
          const error = await res.json<ErrorResponse>();

          expect(error.code).toBe('RATE_LIMITED');
          break;
        }
      }

      expect(rateLimited).toBe(true);
    });
  });
});
