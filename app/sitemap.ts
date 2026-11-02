import type { MetadataRoute } from "next";

import { getPostSlugs, getProjectSlugs } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

/**
 * `lastModified` is intentionally omitted: stamping every entry with the build
 * time would tell crawlers each page changed on every deploy. Add real
 * `_updatedAt` values from Sanity if you want accurate timestamps later.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, postSlugs] = await Promise.all([
    getProjectSlugs(),
    getPostSlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/projects"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.6 },
  ];

  return [
    ...staticRoutes,
    ...projectSlugs.map((slug) => ({
      url: absoluteUrl(`/projects/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...postSlugs.map((slug) => ({
      url: absoluteUrl(`/blog/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
