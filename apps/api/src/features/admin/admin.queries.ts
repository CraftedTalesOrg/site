import type { Database } from '../../utils/db';
import { mods, users, reports } from '@craftedtales/db';
import { eq } from 'drizzle-orm';
import type { AdminModsQuery, AdminReportsQuery, AdminReport, ReportResolve } from './admin.schemas';
import type { PublicMod } from '../mods/mods.schemas';
import type { PaginatedResponse } from '../_shared/common.schemas';

// ============================================================================
// Admin Queries
// ============================================================================

export const adminQueries = {
  /**
   * List mods in review queue by approval status
   */
  async listReviewQueue(
    db: Database,
    query: AdminModsQuery,
  ): Promise<PaginatedResponse<PublicMod>> {
    const { approved, page, limit } = query;

    const modsList = await db.query.mods.findMany({
      where: {
        deleted: false,
        approved: approved === 'all' ? undefined : approved === 'true',
      },
      with: {
        owner: {
          columns: {
            id: true,
            username: true,
            bio: true,
            avatarId: true,
            roles: true,
          },
        },
        icon: {
          where: { deleted: false },
        },
        modCategories: {
          with: {
            category: true,
          },
        },
        modVersions: {
          where: { deleted: false },
          orderBy: { createdAt: 'desc' },
        },
      },
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'asc' },
    });

    const allMods = await db.query.mods.findMany({
      where: {
        deleted: false,
        approved: approved === 'all' ? undefined : approved === 'true',
      },
      columns: { id: true },
    });

    const totalItems = allMods.length;

    const data = modsList.map(mod => ({
      ...mod,
      icon: mod.icon ?? null,
      owner: mod.owner ?? { id: '', username: '[deleted]', bio: null, avatarId: null, roles: [] },
      categories: mod.modCategories
        .map(mc => mc.category)
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null),
      versions: mod.modVersions,
    }));

    return { data, totalItems };
  },

  /**
   * Review a mod (approve or reject)
   */
  async reviewMod(
    db: Database,
    modId: string,
    action: 'approve' | 'reject',
    reason?: string,
  ): Promise<{ success: boolean; message: string } | null> {
    const mod = await db.query.mods.findFirst({
      where: { id: modId, deleted: false },
    });

    if (!mod) {
      return null;
    }

    if (action === 'approve') {
      await db
        .update(mods)
        .set({ approved: true })
        .where(eq(mods.id, modId));

      return { success: true, message: 'Mod approved successfully' };
    } else {
    // Reject - set to draft status
      await db
        .update(mods)
        .set({
          approved: false,
          status: 'draft',
        })
        .where(eq(mods.id, modId));

      // TODO: Notify mod owner with rejection reason via email
      if (reason) {
        console.info(`[STUB] Mod ${modId} rejected with reason: ${reason}`);
      }

      return { success: true, message: 'Mod rejected successfully' };
    }
  },

  /**
   * Perform user moderation action (suspend or unsuspend)
   */
  async userAction(
    db: Database,
    userId: string,
    adminId: string,
    action: 'suspend' | 'unsuspend',
    reason?: string,
  ): Promise<{ error: string; code: 'SELF_ACTION' } | { success: boolean; message: string } | null> {
    const targetUser = await db.query.users.findFirst({
      where: { id: userId, deleted: false },
    });

    if (!targetUser) {
      return null;
    }

    // Prevent admin from suspending themselves
    if (targetUser.id === adminId) {
      return { error: 'Cannot perform action on yourself', code: 'SELF_ACTION' };
    }

    if (action === 'suspend') {
      await db
        .update(users)
        .set({ enabled: false })
        .where(eq(users.id, userId));

      // TODO: Add audit log entry
      console.info(
        `[AUDIT] User ${userId} suspended by ${adminId}. Reason: ${reason ?? 'No reason provided'}`,
      );

      return { success: true, message: 'User suspended successfully' };
    } else {
      await db
        .update(users)
        .set({ enabled: true })
        .where(eq(users.id, userId));

      console.info(`[AUDIT] User ${userId} unsuspended by ${adminId}`);

      return { success: true, message: 'User unsuspended successfully' };
    }
  },

  /**
   * List reports with filters
   */
  async listReports(
    db: Database,
    query: AdminReportsQuery,
  ): Promise<PaginatedResponse<AdminReport>> {
    const { status, targetType, page, limit } = query;

    const reportsList = await db.query.reports.findMany({
      where: {
        status: status !== 'all' ? status : undefined,
        targetType: targetType,
      },
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

    const allReports = await db.query.reports.findMany({
      where: {
        status: status !== 'all' ? status : undefined,
        targetType: targetType,
      },
      columns: { id: true },
    });

    const totalItems = allReports.length;

    const data = reportsList;

    return { data, totalItems };
  },

  /**
   * Resolve a report
   */
  async resolveReport(
    db: Database,
    reportId: string,
    adminId: string,
    resolution: ReportResolve,
  ): Promise<{ success: boolean; message: string } | null> {
    const report = await db.query.reports.findFirst({
      where: { id: reportId },
    });

    if (!report) {
      return null;
    }

    await db
      .update(reports)
      .set({
        status: resolution.resolution,
        reviewedBy: adminId,
        resolution: resolution.notes,
      })
      .where(eq(reports.id, reportId));

    console.info(`[AUDIT] Report ${reportId} resolved as ${resolution.resolution} by ${adminId}`);

    return { success: true, message: `Report ${resolution.resolution} successfully` };
  },
};
