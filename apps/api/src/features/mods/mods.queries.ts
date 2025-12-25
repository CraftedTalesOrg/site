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
   * List mods with filters and pagination
   */
  async listWithFilters(
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
   * Get a single mod by slug with all relations
   */
  async getBySlug(db: Database, slug: string): Promise<PublicMod | null> {
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
   * Check if a slug already exists
   */
  async slugExists(db: Database, slug: string): Promise<boolean> {
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

    return await this.getById(db, result.id);
  },

  /**
   * Find mod for update (checks ownership)
   */
  async findForUpdate(db: Database, slug: string): Promise<typeof mods.$inferSelect | undefined> {
    return db.query.mods.findFirst({
      where: { slug, deleted: false },
    });
  },

  /**
   * Update a mod with optional category update
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
   * Get mod by ID with all relations
   */
  async getById(db: Database, modId: string): Promise<PrivateMod | null> {
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
   * Get mod ID by slug (for version listing)
   */
  async getIdBySlug(db: Database, slug: string): Promise<string | null> {
    const mod = await db.query.mods.findFirst({
      where: { slug, deleted: false },
      columns: { id: true },
    });

    return mod?.id ?? null;
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
};
