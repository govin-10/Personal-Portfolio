import { cacheLife, cacheTag } from "next/cache";

import { isSanityConfigured } from "@/lib/sanity/env";
import { sanityClient } from "@/lib/sanity/client";

import { categoryFromPlatforms } from "./category";
import { POSTS, PROFILE, PROJECTS } from "./local";
import {
  POST_BY_SLUG_QUERY,
  POST_SLUGS_QUERY,
  POSTS_QUERY,
  PROFILE_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PROJECT_SLUGS_QUERY,
  PROJECTS_QUERY,
} from "./queries";
import type { Post, Profile, Project, ResolvedImage } from "./types";

export type * from "./types";
export { categoryFromPlatforms } from "./category";

/**
 * Cache tags. The Sanity webhook at /api/revalidate maps document types onto
 * these, so publishing a project purges only project-backed pages.
 */
export const CONTENT_TAGS = {
  projects: "content:projects",
  posts: "content:posts",
  profile: "content:profile",
} as const;

/** True when the site is rendering placeholder content from local.ts. */
export function isUsingSampleContent(): boolean {
  return !isSanityConfigured;
}

/* -------------------------------------------------------------------------- */
/* Normalisation                                                              */
/* -------------------------------------------------------------------------- */

type RawImage = Partial<ResolvedImage> | null | undefined;

/** Drops images whose asset failed to resolve, and fills sane defaults. */
function image(raw: RawImage, fallbackAlt: string): ResolvedImage | undefined {
  if (!raw?.url) return undefined;
  return {
    url: raw.url,
    alt: raw.alt?.trim() || fallbackAlt,
    width: raw.width ?? 1200,
    height: raw.height ?? 800,
    lqip: raw.lqip,
  };
}

function images(raw: RawImage[] | null | undefined, fallbackAlt: string) {
  return (raw ?? [])
    .map((entry, i) => image(entry, `${fallbackAlt} screenshot ${i + 1}`))
    .filter((entry): entry is ResolvedImage => Boolean(entry));
}

type RawProject = Omit<
  Project,
  "cover" | "screenshots" | "webScreenshots" | "category"
> & {
  cover?: RawImage;
  screenshots?: RawImage[];
  webScreenshots?: RawImage[];
};

function normalizeProject(raw: RawProject): Project {
  return {
    ...raw,
    category: categoryFromPlatforms(raw.platforms),
    cover: image(raw.cover, raw.title),
    screenshots: images(raw.screenshots, raw.title),
    webScreenshots: images(raw.webScreenshots, `${raw.title} web screenshot`),
    body: raw.body ?? null,
  };
}

type RawPost = Omit<Post, "cover" | "readingTime"> & {
  cover?: RawImage;
  charCount?: number;
};

/** ~200 wpm at ~5.5 characters per word. */
function readingTimeFromChars(chars: number | undefined): number {
  if (!chars) return 1;
  return Math.max(1, Math.round(chars / 1100));
}

function normalizePost(raw: RawPost): Post {
  return {
    ...raw,
    cover: image(raw.cover, raw.title),
    readingTime: readingTimeFromChars(raw.charCount),
    body: raw.body ?? null,
  };
}

/**
 * Prefers the Sanity value, but falls back per-field so a half-filled profile
 * document can't blank out the site.
 */
function pick<T>(value: T | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  if (Array.isArray(value) && value.length === 0) return fallback;
  return value;
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.projects);
  cacheLife("days");

  if (!sanityClient) return PROJECTS;

  try {
    const rows = await sanityClient.fetch<RawProject[]>(PROJECTS_QUERY);
    if (!rows?.length) return PROJECTS;
    return rows.map(normalizeProject);
  } catch (error) {
    console.error("[content] projects query failed; using local content", error);
    return PROJECTS;
  }
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((project) => project.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getProject(slug: string): Promise<Project | null> {
  "use cache";
  cacheTag(CONTENT_TAGS.projects);
  cacheLife("days");

  if (!sanityClient) {
    return PROJECTS.find((project) => project.slug === slug) ?? null;
  }

  try {
    const row = await sanityClient.fetch<RawProject | null>(
      PROJECT_BY_SLUG_QUERY,
      { slug },
    );
    if (!row) return null;
    return normalizeProject(row);
  } catch (error) {
    console.error(`[content] project "${slug}" query failed`, error);
    return PROJECTS.find((project) => project.slug === slug) ?? null;
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.projects);
  cacheLife("days");

  if (!sanityClient) return PROJECTS.map((project) => project.slug);

  try {
    const slugs = await sanityClient.fetch<string[]>(PROJECT_SLUGS_QUERY);
    return slugs?.length ? slugs : PROJECTS.map((project) => project.slug);
  } catch {
    return PROJECTS.map((project) => project.slug);
  }
}

/* -------------------------------------------------------------------------- */
/* Posts                                                                      */
/* -------------------------------------------------------------------------- */

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.posts);
  cacheLife("days");

  if (!sanityClient) return POSTS;

  try {
    const rows = await sanityClient.fetch<RawPost[]>(POSTS_QUERY);
    // An empty blog is a legitimate state, so don't fall back to samples here
    // once Sanity is actually connected.
    return (rows ?? []).map(normalizePost);
  } catch (error) {
    console.error("[content] posts query failed; using local content", error);
    return POSTS;
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheTag(CONTENT_TAGS.posts);
  cacheLife("days");

  if (!sanityClient) {
    return POSTS.find((post) => post.slug === slug) ?? null;
  }

  try {
    const row = await sanityClient.fetch<RawPost | null>(POST_BY_SLUG_QUERY, {
      slug,
    });
    return row ? normalizePost(row) : null;
  } catch (error) {
    console.error(`[content] post "${slug}" query failed`, error);
    return POSTS.find((post) => post.slug === slug) ?? null;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.posts);
  cacheLife("days");

  if (!sanityClient) return POSTS.map((post) => post.slug);

  try {
    const slugs = await sanityClient.fetch<string[]>(POST_SLUGS_QUERY);
    return slugs ?? [];
  } catch {
    return POSTS.map((post) => post.slug);
  }
}

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

type RawProfile = Partial<Omit<Profile, "avatar">> & { avatar?: RawImage };

export async function getProfile(): Promise<Profile> {
  "use cache";
  cacheTag(CONTENT_TAGS.profile);
  cacheLife("days");

  if (!sanityClient) return PROFILE;

  try {
    const row = await sanityClient.fetch<RawProfile | null>(PROFILE_QUERY);
    if (!row) return PROFILE;

    return {
      name: pick(row.name, PROFILE.name),
      headline: pick(row.headline, PROFILE.headline),
      heroStatement: pick(row.heroStatement, PROFILE.heroStatement),
      location: pick(row.location, PROFILE.location),
      email: pick(row.email, PROFILE.email),
      availableForWork: row.availableForWork ?? PROFILE.availableForWork,
      shortBio: pick(row.shortBio, PROFILE.shortBio),
      bio: pick(row.bio, PROFILE.bio),
      avatar: image(row.avatar, pick(row.name, PROFILE.name)) ?? PROFILE.avatar,
      resumeUrl: pick(row.resumeUrl, PROFILE.resumeUrl),
      socials: pick(row.socials, PROFILE.socials),
      skills: pick(row.skills, PROFILE.skills),
      experience: pick(row.experience, PROFILE.experience),
    };
  } catch (error) {
    console.error("[content] profile query failed; using local content", error);
    return PROFILE;
  }
}
