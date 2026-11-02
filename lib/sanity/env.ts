/**
 * Sanity environment.
 *
 * Everything here is optional on purpose: when `projectId` is missing the
 * content layer falls back to local seed data, so the site builds and runs
 * from a fresh clone with no accounts configured.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";

/**
 * Pinned API date. Bumping this opts into newer Sanity API behaviour. Do it
 * deliberately, not automatically, so queries can't change under you.
 */
export const apiVersion = "2026-01-01";

/** Only needed to read unpublished drafts. */
export const readToken = process.env.SANITY_API_READ_TOKEN?.trim() || "";

/** True once a project id is present, i.e. the CMS is wired up. */
export const isSanityConfigured = projectId.length > 0;

export const studioTitle = "Portfolio Content";
