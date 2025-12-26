import { reports, Database } from '@craftedtales/db';
import { eq, and } from 'drizzle-orm';
import type {
  CreateReportRequest,
  Report,
  ReviewReportsQuery,
  ResolveReportRequest,
} from './reports.schemas';
import type { PaginatedResponse } from '../_shared/common.schemas';

export const reportsQueries = {
  /**
   * Find report by ID
   */
  async findById(db: Database, reportId: string): Promise<Report | null> {
    const report = await db.query.reports.findFirst({
      where: { id: reportId },
    });

    return report ?? null;
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
  async create(
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
   * List reports
   */
  async list(
    db: Database,
    query: ReviewReportsQuery,
  ): Promise<PaginatedResponse<Report>> {
    const { status, targetType, page, limit } = query;

    const data = await db.query.reports.findMany({
      where: {
        status: status !== 'all' ? status : undefined,
        targetType,
      },
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

    // Build filter conditions for count
    const filters = [];

    if (status !== 'all') {
      filters.push(eq(reports.status, status));
    }

    if (targetType) {
      filters.push(eq(reports.targetType, targetType));
    }

    // Get total count
    const totalItems = await db.$count(
      reports,
      filters.length > 0 ? and(...filters) : undefined,
    );

    return { data, totalItems };
  },

  /**
   * Update a report (resolve)
   */
  async update(
    db: Database,
    reportId: string,
    adminId: string,
    resolution: ResolveReportRequest,
  ): Promise<void> {
    await db
      .update(reports)
      .set({
        status: resolution.resolution,
        reviewedBy: adminId,
        resolution: resolution.notes,
      })
      .where(eq(reports.id, reportId));
  },
};
