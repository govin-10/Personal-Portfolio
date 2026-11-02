import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The Studio is behind Sanity auth, but there's no reason to crawl it.
      disallow: ["/studio", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
