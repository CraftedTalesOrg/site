import { modCategories, modLikes, mods, modVersions, Database } from '@craftedtales/db';
import { and, eq } from 'drizzle-orm';
import type { PaginatedResponse } from '../_shared/common.schemas';
import type {
  CreateModRequest,
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
      where: { id: modId, deleted: false },
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
      where: {
        slug,
        deleted: false,
        status: 'published',
        approved: true,
        NOT: { visibility: 'private' },
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
    });

    return mod ?? null;
  },

  /**
   * Check if a slug exists
   */
  async existsSlug(db: Database, slug: string): Promise<boolean> {
    // Not filtering with deleted: false to allow checking slugs of deleted mods
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
          data.categoryIds.map(categoryId => ({
            modId,
            categoryId,
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
   * Check if user has liked a mod
   */
  async hasLike(db: Database, modId: string, userId: string): Promise<boolean> {
    const like = await db.query.modLikes.findFirst({
      where: { modId, userId },
    });

    return !!like;
  },

  /**
   * Add a like to a mod and update the count
   */
  async addLike(db: Database, modId: string, userId: string): Promise<void> {
    // Insert the like
    await db.insert(modLikes).values({
      modId,
      userId,
    });

    // Count actual likes from join table
    const likesCount = await db.$count(modLikes, eq(modLikes.modId, modId));

    // Update mod's likes count
    await db.update(mods).set({ likes: likesCount }).where(eq(mods.id, modId));
  },

  /**
   * Remove a like from a mod and update the count
   */
  async removeLike(db: Database, modId: string, userId: string): Promise<void> {
    // Delete the like
    await db.delete(modLikes)
      .where(and(eq(modLikes.modId, modId), eq(modLikes.userId, userId)));

    // Count actual likes from join table
    const likesCount = await db.$count(modLikes, eq(modLikes.modId, modId));

    // Update mod's likes count
    await db.update(mods).set({ likes: likesCount }).where(eq(mods.id, modId));
  },

  /**
   * List mods
   */
  async list(
    db: Database,
    filters: ListModsQuery,
  ): Promise<PaginatedResponse<PublicMod>> {
    const { page, limit, categoryIds, search, sortBy, sortOrder } = filters;

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
        // Only add categories filter if there are category IDs to filter by
        ...(categoryIds && categoryIds.length > 0
          ? {
              categories: {
                id: {
                  in: categoryIds,
                },
              },
            }
          : {}),
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

    return { data: versions, totalItems };
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
   * Set mod approval status
   */
  async setApprovalStatus(
    db: Database,
    modId: string,
    approved: boolean,
    setDraftIfRejected?: boolean,
  ): Promise<void> {
    await db
      .update(mods)
      .set({
        approved,
        status: setDraftIfRejected && !approved ? 'draft' : undefined,
      })
      .where(eq(mods.id, modId));
  },
};
