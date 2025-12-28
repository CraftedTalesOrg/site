import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser, createTestReport, createTestMod, createTestCategory } from '../../factories';
import { authenticatedRequest } from '../../helpers/auth';
import type { Report } from '../../../src/features/reports/reports.schemas';
import type { ErrorResponse, PaginatedResponse } from '../../../src/features/_shared/common.schemas';

describe('GET /api/v1/reports', () => {
  describe('success cases', () => {
    it('should allow admin to list reports', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });

      const res = await authenticatedRequest(app, env, admin, '/api/v1/reports');

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<Report>>();

      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should allow moderator to list reports', async () => {
      const moderator = await createTestUser(env, { roles: ['moderator'] });

      const res = await authenticatedRequest(app, env, moderator, '/api/v1/reports');

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<Report>>();

      expect(data.data).toBeDefined();
    });

    it('should return only pending reports by default', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      // Create pending report
      const pendingReport = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'pending',
      });

      // Create resolved report
      await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'resolved',
      });

      const res = await authenticatedRequest(app, env, admin, '/api/v1/reports');

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<Report>>();

      expect(data.data.some(r => r.id === pendingReport.id)).toBe(true);
      expect(data.data.every(r => r.status === 'pending')).toBe(true);
    });

    it('should filter by status=reviewed', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      // Create reviewed report
      const reviewedReport = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'reviewed',
      });

      // Create pending report
      await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'pending',
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/reports?status=reviewed',
      );

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<Report>>();

      expect(data.data.some(r => r.id === reviewedReport.id)).toBe(true);
      expect(data.data.every(r => r.status === 'reviewed')).toBe(true);
    });

    it('should filter by targetType=mod', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });
      const targetUser = await createTestUser(env);

      // Create mod report
      const modReport = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'pending',
      });

      // Create user report
      await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'user',
        targetId: targetUser.id,
        status: 'pending',
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/reports?targetType=mod',
      );

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<Report>>();

      expect(data.data.some(r => r.id === modReport.id)).toBe(true);
      expect(data.data.every(r => r.targetType === 'mod')).toBe(true);
    });

    it('should filter by targetType=user', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });
      const targetUser = await createTestUser(env);

      // Create mod report
      await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'pending',
      });

      // Create user report
      const userReport = await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'user',
        targetId: targetUser.id,
        status: 'pending',
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/reports?targetType=user',
      );

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<Report>>();

      expect(data.data.some(r => r.id === userReport.id)).toBe(true);
      expect(data.data.every(r => r.targetType === 'user')).toBe(true);
    });

    it('should show all reports when status=all', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      // Create reports with different statuses
      await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'pending',
      });

      await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'reviewed',
      });

      await createTestReport(env, {
        reporterId: reporter.id,
        targetType: 'mod',
        targetId: mod.id,
        status: 'resolved',
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/reports?status=all',
      );

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<Report>>();

      expect(data.data.length).toBeGreaterThanOrEqual(3);
      const statuses = data.data.map(r => r.status);

      expect(statuses.includes('pending')).toBe(true);
      expect(statuses.includes('reviewed')).toBe(true);
      expect(statuses.includes('resolved')).toBe(true);
    });

    it('should paginate results correctly', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const reporter = await createTestUser(env);
      const author = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
      });

      // Create multiple reports
      for (let i = 0; i < 5; i++) {
        await createTestReport(env, {
          reporterId: reporter.id,
          targetType: 'mod',
          targetId: mod.id,
          status: 'pending',
        });
      }

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/reports?page=1&limit=2',
      );

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<Report>>();

      expect(data.data).toHaveLength(2);

      expect(data.totalItems).toBeGreaterThanOrEqual(5);
    });
  });

  describe('authorization errors', () => {
    it('should deny access to regular users', async () => {
      const user = await createTestUser(env, { roles: ['user'] });

      const res = await authenticatedRequest(app, env, user, '/api/v1/reports');

      expect(res.status).toBe(403);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('ACCESS_DENIED');
    });

    it('should deny unauthenticated requests', async () => {
      const res = await app.request('/api/v1/reports', {}, env);

      expect(res.status).toBe(401);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('validation', () => {
    it('should validate status parameter', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/reports?status=invalid',
      );

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate targetType parameter', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/reports?targetType=invalid',
      );

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate pagination parameters', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/reports?page=-1&limit=0',
      );

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });
  });
});
