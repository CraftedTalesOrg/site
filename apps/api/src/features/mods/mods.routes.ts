import type { OpenAPIHono } from '@hono/zod-openapi';
import type { Env, JwtPayload } from '../../env.d';
import { createDb } from '../../utils/db';
import {
  listModsRoute,
  getModRoute,
  createModRoute,
  updateModRoute,
  deleteModRoute,
  likeModRoute,
  listModVersionsRoute,
  listReviewQueueRoute,
  reviewModRoute,
} from './mods.openapi';
import { modsQueries } from './mods.queries';
import type {
  CreateModRequest,
  UpdateModRequest,
  ListModsQuery,
  ReviewModsQuery,
  PrivateMod,
  PublicMod,
} from './mods.schemas';
import type { PaginationQuery, SlugParam } from '../_shared/common.schemas';

/**
 * Register mods routes
 */
export const registerModsRoutes = (app: OpenAPIHono<Env>): void => {
  /**
   * POST /mods/{slug}/like
   * Should be registered first to avoid param conflicts
   */
  app.openapi(likeModRoute, async (c) => {
    const db = createDb(c.env);
    const { userId }: JwtPayload = c.get('jwtPayload');
    const { slug }: SlugParam = c.req.valid('param');

    // Find mod
    const mod: PublicMod | null = await modsQueries.findBySlug(db, slug);

    if (!mod) {
      return c.json({ error: 'Mod not found', code: 'MOD_NOT_FOUND' }, 404);
    }

    // Check if user already liked the mod
    const hasLiked: boolean = await modsQueries.hasLike(db, mod.id, userId);

    if (hasLiked) {
      await modsQueries.removeLike(db, mod.id, userId);

      return c.json({ success: true, message: 'Mod unliked successfully' }, 200);
    } else {
      await modsQueries.addLike(db, mod.id, userId);

      return c.json({ success: true, message: 'Mod liked successfully' }, 200);
    }
  });

  /**
   * GET /mods/{slug}/versions
   * Should be registered first to avoid param conflicts
   */
  app.openapi(listModVersionsRoute, async (c) => {
    const db = createDb(c.env);
    const { slug }: SlugParam = c.req.valid('param');
    const query: PaginationQuery = c.req.valid('query');

    // Find mod
    const mod: PublicMod | null = await modsQueries.findBySlug(db, slug);

    if (!mod) {
      return c.json({ error: 'Mod not found', code: 'MOD_NOT_FOUND' }, 404);
    }

    // Get versions
    const versions = await modsQueries.listVersions(db, mod.id, query.page, query.limit);

    return c.json(versions, 200);
  });

  /**
   * GET /mods
   */
  app.openapi(listModsRoute, async (c) => {
    const db = createDb(c.env);
    const query: ListModsQuery = c.req.valid('query');

    const mods = await modsQueries.list(db, query);

    return c.json(mods, 200);
  });

  /**
   * GET /mods/{slug}
   */
  app.openapi(getModRoute, async (c) => {
    const db = createDb(c.env);
    const { slug }: SlugParam = c.req.valid('param');

    const mod: PublicMod | null = await modsQueries.findBySlug(db, slug);

    if (!mod) {
      return c.json({ error: 'Mod not found', code: 'MOD_NOT_FOUND' }, 404);
    }

    return c.json(mod, 200);
  });

  /**
   * POST /mods
   */
  app.openapi(createModRoute, async (c) => {
    const db = createDb(c.env);
    const { userId }: JwtPayload = c.get('jwtPayload');
    const body: CreateModRequest = c.req.valid('json');

    // Check if slug already exists
    const slugExists: boolean = await modsQueries.existsSlug(db, body.slug);

    if (slugExists) {
      return c.json({ error: 'Slug already exists', code: 'SLUG_EXISTS' }, 409);
    }

    // Create mod
    const mod: PrivateMod | null = await modsQueries.create(db, userId, body);

    if (!mod) {
      return c.json({ error: 'Failed to create mod', code: 'MOD_CREATE_FAILED' }, 500);
    }

    return c.json(mod, 201);
  });

  /**
   * PATCH /mods/{id}
   */
  app.openapi(updateModRoute, async (c) => {
    const db = createDb(c.env);
    const { userId }: JwtPayload = c.get('jwtPayload');
    const { id } = c.req.valid('param');
    const body: UpdateModRequest = c.req.valid('json');

    // Find mod
    const mod: PrivateMod | null = await modsQueries.findById(db, id);

    if (!mod) {
      return c.json({ error: 'Mod not found', code: 'MOD_NOT_FOUND' }, 404);
    }

    // Check ownership
    if (mod.owner?.id !== userId) {
      return c.json({ error: 'Not owner of mod', code: 'ACCESS_DENIED' }, 403);
    }

    // Check for slug conflict if slug is being updated
    if (body.slug && body.slug !== mod.slug) {
      const slugExists = await modsQueries.existsSlug(db, body.slug);

      if (slugExists) {
        return c.json({ error: 'Slug already exists', code: 'SLUG_EXISTS' }, 409);
      }
    }

    // Update mod
    await modsQueries.update(db, mod.id, body);

    // Fetch updated mod
    const updatedMod: PrivateMod | null = await modsQueries.findById(db, mod.id);

    if (!updatedMod) {
      return c.json({ error: 'Failed to fetch updated mod', code: 'MOD_FETCH_FAILED' }, 500);
    }

    return c.json(updatedMod, 200);
  });

  /**
   * DELETE /mods/{id}
   */
  app.openapi(deleteModRoute, async (c) => {
    const db = createDb(c.env);
    const { userId }: JwtPayload = c.get('jwtPayload');
    const { id } = c.req.valid('param');

    // Find mod
    const mod: PrivateMod | null = await modsQueries.findById(db, id);

    if (!mod) {
      return c.json({ error: 'Mod not found', code: 'MOD_NOT_FOUND' }, 404);
    }

    // Check ownership
    if (mod.owner?.id !== userId) {
      return c.json({ error: 'Not owner of mod', code: 'ACCESS_DENIED' }, 403);
    }

    // Delete mod (soft delete)
    await modsQueries.delete(db, mod.id);

    return c.json({ success: true, message: 'Mod deleted successfully' }, 200);
  });

  /**
   * GET /admin/mods/review-queue
   */
  app.openapi(listReviewQueueRoute, async (c) => {
    const db = createDb(c.env);
    const query: ReviewModsQuery = c.req.valid('query');

    const mods = await modsQueries.listForReview(db, query);

    return c.json(mods, 200);
  });

  /**
   * POST /admin/mods/{id}/review
   */
  app.openapi(reviewModRoute, async (c) => {
    const db = createDb(c.env);
    const { id } = c.req.valid('param');
    const { action, reason } = c.req.valid('json');

    // Verify mod exists
    const mod: PrivateMod | null = await modsQueries.findById(db, id);

    if (!mod) {
      return c.json({ error: 'Mod not found', code: 'MOD_NOT_FOUND' }, 404);
    }

    if (action === 'approve') {
      // Approve the mod
      await modsQueries.setApprovalStatus(db, id, true);

      return c.json({ success: true, message: 'Mod approved successfully' }, 200);
    } else {
      // Reject - set to not approved and change status to draft
      await modsQueries.setApprovalStatus(db, id, false, true);

      // TODO: Notify mod owner with rejection reason via email
      if (reason) {
        console.info(`[STUB] Mod ${id} rejected with reason: ${reason}`);
      }

      return c.json({ success: true, message: 'Mod rejected successfully' }, 200);
    }
  });
};
