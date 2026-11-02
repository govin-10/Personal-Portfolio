import type { PortableTextBlock } from "@portabletext/react";

/** A platform a project ships on. Drives the filter chips on /projects. */
export type Platform = "ios" | "android" | "web";

/**
 * Derived from `platforms`, never authored directly. A project that ships an
 * app *and* a web surface is "both", and shows up under either filter.
 */
export type ProjectCategory = "mobile" | "web" | "both";

export type ProjectStatus = "live" | "in-development" | "archived" | "concept";

export type LinkKind =
  | "appStore"
  | "playStore"
  | "live"
  | "github"
  | "video"
  | "other";

export interface ProjectLink {
  kind: LinkKind;
  label: string;
  url: string;
}

/**
 * A resolved image. When Sanity is connected these come from its CDN with a
 * `lqip` blur placeholder baked in; local seed images are plain /public paths.
 */
export interface ResolvedImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  /** base64 blur placeholder, when available */
  lqip?: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface Project {
  _id: string;
  slug: string;
  title: string;
  /** One-line hook shown on cards. */
  tagline: string;
  category: ProjectCategory;
  platforms: Platform[];
  status: ProjectStatus;
  /** e.g. "Lead React Native Developer" */
  role?: string;
  /** e.g. "2025" or "2024 - 2025" */
  period?: string;
  client?: string;
  stack: string[];
  featured: boolean;
  order: number;
  cover?: ResolvedImage;
  /** Device screenshots, rendered in phone frames. */
  screenshots: ResolvedImage[];
  /** Web captures, rendered in browser frames. */
  webScreenshots: ResolvedImage[];
  links: ProjectLink[];
  /** Short bullets rendered in the case-study sidebar. */
  highlights: string[];
  metrics: Metric[];
  /** Long-form case study. Null when nothing has been written yet. */
  body: PortableTextBlock[] | null;
}

export interface Post {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date string */
  publishedAt: string;
  tags: string[];
  /** Minutes, computed from the body when coming from Sanity. */
  readingTime: number;
  cover?: ResolvedImage;
  body: PortableTextBlock[] | null;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location?: string;
  summary?: string;
  highlights: string[];
}

export interface SocialLink {
  kind: "github" | "linkedin" | "twitter" | "instagram" | "facebook" | "email";
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  /** Short role label, e.g. "React Native Developer" */
  headline: string;
  /** Longer positioning line used in the hero. */
  heroStatement: string;
  location: string;
  email: string;
  availableForWork: boolean;
  shortBio: string;
  /** Paragraphs for the About page. */
  bio: string[];
  avatar?: ResolvedImage;
  resumeUrl: string;
  socials: SocialLink[];
  skills: SkillGroup[];
  experience: ExperienceItem[];
}
