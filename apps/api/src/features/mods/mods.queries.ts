import { modCategories, modLikes, mods, modVersions } from '@craftedtales/db';
import { and, eq } from 'drizzle-orm';
import type { Database } from '../../utils/db';
import type { PaginatedResponse } from '../_shared/common.schemas';
import type {
  CreateModRequest,
  LikeToggleResponse,
  ListModsQuery,
  PrivateMod,
  PublicMod,
  PublicModVersion,
  UpdateModRequest,
} from './mods.schemas';

export const modsQueries = {
  /**
   * Find mod by ID
   */
  async findById(db: Database, modId: string): Promise<PrivateMod | null> {
    const mod = await db.query.mods.findFirst({
      where: { id: modId },
      with: {
        owner: {
          columns: {
            id: true,
            email: true,
            username: true,
            bio: true,
            roles: true,
            createdAt: true,
            twoFactorEnabled: true,
          },
          with: {
            avatar: true,
          },
        },
        icon: true,
        categories: true,
        versions: true,
      },
    });

    return mod ?? null;
  },

  /**
   * Find mod by slug
   */
  async findBySlug(db: Database, slug: string): Promise<PublicMod | null> {
    const mod = await db.query.mods.findFirst({
      where: { slug, deleted: false },
      with: {
        owner: {
          columns: {
            id: true,
            username: true,
            bio: true,
            createdAt: true,
          },
          with: {
            avatar: true,
          },
        },
        icon: true,
        categories: true,
        versions: true,
      },
    });

    return mod ?? null;
  },

  /**
   * Check if a slug exists
   */
  async existsSlug(db: Database, slug: string): Promise<boolean> {
    const existing = await db.query.mods.findFirst({
      where: { slug },
      columns: { id: true },
    });

    return !!existing;
  },

  /**
   * Create a new mod
   */
  async create(db: Database, userId: string, data: CreateModRequest): Promise<PrivateMod | null> {
    const [result] = await db.insert(mods).values({
      slug: data.slug,
      name: data.name,
      summary: data.summary,
      visibility: data.visibility,
      status: 'draft',
      ownerId: userId,
    }).returning();

    return await this.findById(db, result.id);
  },

  /**
   * Update a mod
   */
  async update(
    db: Database,
    modId: string,
    data: UpdateModRequest,
  ): Promise<void> {
    await db
      .update(mods)
      .set({
        name: data.name,
        summary: data.summary,
        description: data.description,
        license: data.license,
        licenseUrl: data.licenseUrl,
        issueTrackerUrl: data.issueTrackerUrl,
        sourceCodeUrl: data.sourceCodeUrl,
        wikiUrl: data.wikiUrl,
        discordInviteUrl: data.discordInviteUrl,
        donationUrls: data.donationUrls,
        visibility: data.visibility,
        status: data.status,
      })
      .where(eq(mods.id, modId));

    // Update categories if provided
    if (data.categoryIds) {
      // Delete existing categories
      await db.delete(modCategories).where(eq(modCategories.modId, modId));

      // Add new categories
      if (data.categoryIds.length > 0) {
        await db.insert(modCategories).values(
          data.categoryIds.map(category => ({
            id: crypto.randomUUID(),
            modId,
            categoryId: category.id,
          })),
        );
      }
    }
  },

  /**
   * Delete a mod (soft delete)
   */
  async delete(db: Database, modId: string): Promise<void> {
    await db
      .update(mods)
      .set({ deleted: true, deletedAt: new Date() })
      .where(eq(mods.id, modId));
  },

  /**
   * Toggle like on a mod
   */
  async toggleLike(db: Database, modId: string, userId: string): Promise<LikeToggleResponse | null> {
    const mod = await db.query.mods.findFirst({
      where: { id: modId, deleted: false },
      columns: { id: true, likes: true },
    });

    if (!mod) {
      return null;
    }

    // Check if already liked
    const existingLike = await db.query.modLikes.findFirst({
      where: { modId, userId },
    });

    let liked: boolean;
    let newLikes: number;

    if (existingLike) {
      // Unlike
      await db.delete(modLikes).where(and(eq(modLikes.modId, modId), eq(modLikes.userId, userId)));
      newLikes = mod.likes - 1;
      liked = false;
    } else {
      // Like
      await db.insert(modLikes).values({
        id: crypto.randomUUID(),
        modId,
        userId,
      });
      newLikes = mod.likes + 1;
      liked = true;
    }

    // Update mod likes count
    await db.update(mods).set({ likes: newLikes }).where(eq(mods.id, modId));

    return { liked, likes: newLikes };
  },

  /**
   * List mods
   */
  async list(
    db: Database,
    filters: ListModsQuery,
  ): Promise<PaginatedResponse<PublicMod>> {
    const { page, limit, categories, search, sortBy, sortOrder } = filters;

    const searchFilter
      = search?.trim()
        ? {
            OR: [
              { name: { ilike: `%${search}%` } },
              { summary: { ilike: `%${search}%` } },
            ],
          }
        : {};

    const modsList = await db.query.mods.findMany({
      where: {
        deleted: false,
        status: 'published',
        visibility: 'public',
        approved: true,
        categories: {
          id: {
            in: (categories && categories.length > 0) ? categories.map(c => c.id) : undefined,
          },
        },
        ...searchFilter,
      },
      with: {
        owner: {
          columns: {
            id: true,
            username: true,
            bio: true,
            createdAt: true,
          },
          with: {
            avatar: true,
          },
        },
        icon: true,
        categories: true,
        versions: true,
      },
      limit,
      offset: (page - 1) * limit,
      orderBy: { [sortBy]: sortOrder },
    });

    const totalItems = await db.$count(
      mods,
      and(
        eq(mods.deleted, false),
        eq(mods.status, 'published'),
        eq(mods.visibility, 'public'),
        eq(mods.approved, true),
      ),
    );

    return {
      data: modsList,
      totalItems,
    };
  },

  /**
   * List versions for a mod with pagination
   */
  async listVersions(
    db: Database,
    modId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<PublicModVersion>> {
    const versions = await db.query.modVersions.findMany({
      where: { modId, deleted: false },
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

    // Get total count efficiently
    const totalItems = await db.$count(
      modVersions,
      and(eq(modVersions.modId, modId), eq(modVersions.deleted, false)),
    );

    return { data: versions as PublicModVersion[], totalItems };
  },

  /**
   * Get user's published mods (paginated)
   */
  async listByOwner(
    db: Database,
    userId: string,
    options: { page: number; limit: number },
  ): Promise<PaginatedResponse<PublicMod>> {
    const { page, limit } = options;

    const data = await db.query.mods.findMany({
      where: {
        ownerId: userId,
        deleted: false,
        status: 'published',
        visibility: 'public',
      },
      with: {
        owner: {
          columns: {
            id: true,
            username: true,
            bio: true,
            createdAt: true,
          },
          with: {
            avatar: true,
          },
        },
        icon: true,
        categories: true,
        versions: true,
      },
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

    // Get total count efficiently
    const totalItems = await db.$count(
      mods,
      and(
        eq(mods.ownerId, userId),
        eq(mods.deleted, false),
        eq(mods.status, 'published'),
        eq(mods.visibility, 'public'),
      ),
    );

    return { data, totalItems };
  },

  /**
   * List mods in review queue by approval status
   */
  async listForReview(
    db: Database,
    query: { approved: 'true' | 'false' | 'all'; page: number; limit: number },
  ): Promise<PaginatedResponse<PublicMod>> {
    const { approved, page, limit } = query;

    const data = await db.query.mods.findMany({
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
            roles: true,
          },
          with: {
            avatar: true,
          },
        },
        icon: true,
        categories: true,
        versions: true,
      },
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'asc' },
    });

    // Get total count efficiently
    const totalItems = await db.$count(
      mods,
      approved === 'all'
        ? eq(mods.deleted, false)
        : and(
            eq(mods.deleted, false),
            eq(mods.approved, approved === 'true'),
          ),
    );

    return { data, totalItems };
  },

  /**
   * Review a mod (approve or reject)
   */
  async review(
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
};
