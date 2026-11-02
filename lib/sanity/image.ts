import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, isSanityConfigured, projectId } from "./env";

const builder = isSanityConfigured
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

/**
 * Build a Sanity CDN URL with explicit transforms. Most of the site hands
 * plain asset URLs to next/image and lets Next optimise them; use this when
 * you need Sanity-side cropping (hotspot-aware OG images, fixed aspect cards).
 */
export function urlFor(source: SanityImageSource) {
  if (!builder) return null;
  return builder.image(source).auto("format").fit("max");
}
