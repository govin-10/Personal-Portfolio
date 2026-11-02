import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

/**
 * Shared read client. Returns null when Sanity isn't configured so callers
 * can fall back to local content instead of throwing at import time.
 *
 * `useCdn: true` is correct here because freshness is handled by the
 * revalidation webhook (app/api/revalidate/route.ts), not by polling.
 */
export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;
