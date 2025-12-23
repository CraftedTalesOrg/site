import { reports } from '@craftedtales/db';
import type { Database } from '../../utils/db';
import type { CreateReportRequest } from './reports.schemas';

/**
 * Database queries for reports feature
 */

export const reportsQueries = {
  /**
   * Verify target exists (mod or user) and is not deleted
   */
  async verifyTargetExists(
    db: Database,
    targetType: 'mod' | 'user',
    targetId: string,
  ): Promise<boolean> {
    if (targetType === 'mod') {
      const mod = await db.query.mods.findFirst({
        where: { id: targetId, deleted: false },
        columns: { id: true },
      });

      return !!mod;
    } else {
      const user = await db.query.users.findFirst({
        where: { id: targetId, deleted: false },
        columns: { id: true },
      });

      return !!user;
    }
  },

  /**
   * Check if user already has a pending report for this target
   */
  async hasPendingReport(
    db: Database,
    reporterId: string,
    targetType: 'mod' | 'user',
    targetId: string,
  ): Promise<boolean> {
    const existingReport = await db.query.reports.findFirst({
      where: {
        reporterId,
        targetType,
        targetId,
        status: 'pending',
      },
    });

    return !!existingReport;
  },

  /**
   * Create a new report
   */
  async createReport(
    db: Database,
    reporterId: string,
    data: CreateReportRequest,
  ): Promise<string> {
    const reportId = crypto.randomUUID();

    await db.insert(reports).values({
      id: reportId,
      reporterId,
      targetType: data.targetType,
      targetId: data.targetId,
      reason: data.reason,
      description: data.description,
      status: 'pending',
    });

    return reportId;
  },

  /**
   * Get report by ID
   */
  async getReportById(db: Database, reportId: string): Promise<typeof reports.$inferSelect | undefined> {
    return await db.query.reports.findFirst({
      where: { id: reportId },
    });
  },
};
