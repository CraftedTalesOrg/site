import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser, createTestReport, createTestMod, createTestCategory, getReportStatus } from '../../factories';
import { authenticatedRequest } from '../../helpers/auth';
import type { SuccessResponse, ErrorResponse } from '../../../src/features/_shared/common.schemas';

describe('POST /api/v1/reports/{id}/resolve', () => {
  describe('success cases - resolved', () => {
    it('should allow admin to resolve a report', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const report = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'pending',
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/reports/${report.id}/resolve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolution: 'resolved',
            notes: 'Reviewed and action taken',
          }),
        },
      );

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.message).toBeDefined();

      // Verify report status was updated
      const status = await getReportStatus(env, report.id);

      expect(status).toBe('resolved');
    });

    it('should allow moderator to resolve a report', async () => {
      const moderator = await createTestUser(env, { roles: ['moderator'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const report = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'pending',
      });

      const res = await authenticatedRequest(
        app,
        env,
        moderator,
        `/api/v1/reports/${report.id}/resolve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolution: 'resolved',
          }),
        },
      );

      expect(res.status).toBe(200);
    });

    it('should resolve report without notes', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const reporter = await createTestUser(env);
      const targetUser = await createTestUser(env);

      const report = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'user',
        targetId: targetUser.id,
        status: 'pending',
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/reports/${report.id}/resolve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolution: 'resolved',
          }),
        },
      );

      expect(res.status).toBe(200);
    });

    it('should resolve report with notes', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const report = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'pending',
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/reports/${report.id}/resolve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolution: 'resolved',
            notes: 'Contacted mod author, issue resolved',
          }),
        },
      );

      expect(res.status).toBe(200);
    });
  });

  describe('success cases - dismissed', () => {
    it('should allow admin to dismiss a report', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const report = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'pending',
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/reports/${report.id}/resolve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolution: 'dismissed',
            notes: 'Report is unfounded',
          }),
        },
      );

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.message).toBeDefined();

      // Verify report status was updated
      const status = await getReportStatus(env, report.id);

      expect(status).toBe('dismissed');
    });

    it('should allow moderator to dismiss a report', async () => {
      const moderator = await createTestUser(env, { roles: ['moderator'] });
      const reporter = await createTestUser(env);
      const targetUser = await createTestUser(env);

      const report = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'user',
        targetId: targetUser.id,
        status: 'pending',
      });

      const res = await authenticatedRequest(
        app,
        env,
        moderator,
        `/api/v1/reports/${report.id}/resolve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolution: 'dismissed',
          }),
        },
      );

      expect(res.status).toBe(200);
    });
  });

  describe('authorization errors', () => {
    it('should deny access to regular users', async () => {
      const user = await createTestUser(env, { roles: ['user'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const report = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'pending',
      });

      const res = await authenticatedRequest(
        app,
        env,
        user,
        `/api/v1/reports/${report.id}/resolve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolution: 'resolved',
          }),
        },
      );

      expect(res.status).toBe(403);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('ACCESS_DENIED');
    });

    it('should deny unauthenticated requests', async () => {
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const report = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'pending',
      });

      const res = await app.request(
        `/api/v1/reports/${report.id}/resolve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolution: 'resolved',
          }),
        },
        env,
      );

      expect(res.status).toBe(401);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('not found errors', () => {
    it('should return 404 for non-existent report ID', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const fakeId = crypto.randomUUID();

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/reports/${fakeId}/resolve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolution: 'resolved',
          }),
        },
      );

      expect(res.status).toBe(404);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('REPORT_NOT_FOUND');
    });
  });

  describe('validation errors', () => {
    it('should reject missing resolution', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const report = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'pending',
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/reports/${report.id}/resolve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notes: 'Some notes',
          }),
        },
      );

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid resolution value', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const report = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'pending',
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/reports/${report.id}/resolve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolution: 'invalid',
          }),
        },
      );

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject notes too long', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const report = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'pending',
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/reports/${report.id}/resolve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolution: 'resolved',
            notes: 'a'.repeat(2001), // Max is 2000
          }),
        },
      );

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate UUID format for report ID', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/reports/not-a-uuid/resolve',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolution: 'resolved',
          }),
        },
      );

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('edge cases', () => {
    it('should handle resolving an already resolved report', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const report = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'resolved',
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/reports/${report.id}/resolve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolution: 'dismissed',
          }),
        },
      );

      // Should still succeed (idempotent) or return appropriate status
      expect([200, 400]).toContain(res.status);
    });

    it('should handle resolving a dismissed report', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      const report = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'dismissed',
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        `/api/v1/reports/${report.id}/resolve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolution: 'resolved',
          }),
        },
      );

      // Should still succeed or return appropriate status
      expect([200, 400]).toContain(res.status);
    });
  });
});
