import { modCategories, modLikes, mods } from '@craftedtales/db';
import { and, eq } from 'drizzle-orm';
import type { Database } from '../../utils/db';
import type { PaginatedResponse } from '../_shared/common.schemas';
import type {
  CreateModRequest,
  LikeToggleResponse,
  ModFilters,
  PublicMod,
  PublicModVersion,
  UpdateModRequest,
} from './mods.schemas';

// ============================================================================
// Mods Queries
// ============================================================================

export const modsQueries = {
  /**
   * List mods with filters and pagination
   */
  async listWithFilters(
    db: Database,
    filters: ModFilters,
  ): Promise<PaginatedResponse<PublicMod>> {
    const { page, limit, categoryId, search, sortBy, sortOrder, ownerId } = filters;

    // Get mods with relations
    const modsList = await db.query.mods.findMany({
      where: {
        deleted: false,
        status: 'published',
        visibility: 'public',
        approved: true,
        ownerId: ownerId,
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
      orderBy: { [sortBy]: sortOrder },
    });

    // Filter by category if specified (post-query filter)
    let filteredMods = modsList;

    if (categoryId) {
      filteredMods = modsList.filter(mod =>
        mod.modCategories.some(mc => mc.category?.id === categoryId),
      );
    }

    // Filter by search term if specified
    if (search) {
      const searchLower = search.toLowerCase();

      filteredMods = filteredMods.filter(
        mod =>
          mod.name.toLowerCase().includes(searchLower)
          || mod.summary.toLowerCase().includes(searchLower),
      );
    }

    // Get total count
    const allMods = await db.query.mods.findMany({
      where: {
        deleted: false,
        status: 'published',
        visibility: 'public',
        approved: true,
        ownerId: ownerId,
      },
      columns: { id: true },
    });

    const totalItems = allMods.length;

    // Transform to API format
    const data = filteredMods.map(mod => ({
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
    });

    if (!mod) {
      return null;
    }

    return {
      ...mod,
      icon: mod.icon ?? null,
      owner: mod.owner ?? { id: '', username: '[deleted]', bio: null, avatarId: null, roles: [] },
      categories: mod.modCategories
        .map(mc => mc.category)
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null),
      versions: mod.modVersions,
    };
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
   * Create a new mod with categories
   */
  async create(db: Database, userId: string, data: CreateModRequest): Promise<string> {
    const modId = crypto.randomUUID();

    await db.insert(mods).values({
      id: modId,
      slug: data.slug,
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
      status: 'draft',
      ownerId: userId,
    });

    // Add categories
    if (data.categoryIds && data.categoryIds.length > 0) {
      await db.insert(modCategories).values(
        data.categoryIds.map(categoryId => ({
          id: crypto.randomUUID(),
          modId,
          categoryId,
        })),
      );
    }

    return modId;
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
    currentMod: typeof mods.$inferSelect,
  ): Promise<void> {
    await db
      .update(mods)
      .set({
        name: data.name ?? currentMod.name,
        summary: data.summary ?? currentMod.summary,
        description: data.description ?? currentMod.description,
        license: data.license ?? currentMod.license,
        licenseUrl: data.licenseUrl !== undefined ? data.licenseUrl : currentMod.licenseUrl,
        issueTrackerUrl: data.issueTrackerUrl !== undefined ? data.issueTrackerUrl : currentMod.issueTrackerUrl,
        sourceCodeUrl: data.sourceCodeUrl !== undefined ? data.sourceCodeUrl : currentMod.sourceCodeUrl,
        wikiUrl: data.wikiUrl !== undefined ? data.wikiUrl : currentMod.wikiUrl,
        discordInviteUrl: data.discordInviteUrl !== undefined ? data.discordInviteUrl : currentMod.discordInviteUrl,
        donationUrls: data.donationUrls !== undefined ? data.donationUrls : currentMod.donationUrls,
        visibility: data.visibility ?? currentMod.visibility,
        status: data.status ?? currentMod.status,
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
            id: crypto.randomUUID(),
            modId,
            categoryId,
          })),
        );
      }
    }
  },

  /**
   * Get updated mod by ID with all relations
   */
  async getById(db: Database, modId: string): Promise<PublicMod | null> {
    const mod = await db.query.mods.findFirst({
      where: { id: modId },
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
        },
      },
    });

    if (!mod) {
      return null;
    }

    return {
      ...mod,
      icon: mod.icon ?? null,
      owner: mod.owner ?? { id: '', username: '[deleted]', bio: null, avatarId: null, roles: [] },
      categories: mod.modCategories
        .map(mc => mc.category)
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null),
      versions: mod.modVersions,
    };
  },

  /**
   * Soft delete a mod
   */
  async softDelete(db: Database, modId: string): Promise<void> {
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

    const allVersions = await db.query.modVersions.findMany({
      where: { modId, deleted: false },
      columns: { id: true },
    });

    const totalItems = allVersions.length;

    return { data: versions, totalItems };
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
};
