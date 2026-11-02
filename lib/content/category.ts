import type { Platform, ProjectCategory } from "./types";

/**
 * `platforms` is the single source of truth; category is always derived so the
 * two can never disagree. A project shipping an app *and* a web surface is
 * "both", and appears under either filter on /projects.
 *
 * Lives in its own module so the Sanity path (lib/content/index.ts) and the
 * local seed data (lib/content/local.ts) share one implementation.
 */
export function categoryFromPlatforms(
  platforms: Platform[] | undefined,
): ProjectCategory {
  const list = platforms ?? [];
  const hasMobile = list.includes("ios") || list.includes("android");
  const hasWeb = list.includes("web");

  if (hasMobile && hasWeb) return "both";
  if (hasWeb) return "web";
  return "mobile";
}
