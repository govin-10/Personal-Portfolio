import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 Cache Components: data is dynamic by default and we opt into
  // caching per-function with `use cache` (see lib/content/index.ts).
  cacheComponents: true,
  partialPrefetching: true,
  typedRoutes: true,
  images: {
    remotePatterns: [
      // Sanity's image CDN; every project screenshot is served from here.
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
