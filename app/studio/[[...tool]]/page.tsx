import type { Metadata, Viewport } from "next";
import { NextStudio } from "next-sanity/studio";
import { connection } from "next/server";
import { Suspense } from "react";

import { isSanityConfigured } from "@/lib/sanity/env";
import config from "@/sanity.config";

/**
 * These mirror next-sanity's own `metadata`/`viewport` exports, inlined so the
 * route doesn't depend on re-exports from a client module.
 */
export const metadata: Metadata = {
  title: "Content Studio",
  referrer: "same-origin",
  robots: "noindex",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Marks the route as request-time rendered.
 *
 * `[[...tool]]` is an optional catch-all, so its `params` are runtime data and
 * Cache Components can't prerender the fallback shell's metadata. Awaiting
 * `connection()` inside Suspense is the documented way to opt the route out of
 * prerendering, which is what we want regardless: the Studio is an
 * authenticated client-side app with nothing worth prerendering.
 */
async function RuntimeMarker() {
  await connection();
  return null;
}

export default function StudioPage() {
  return (
    <>
      <Suspense fallback={null}>
        <RuntimeMarker />
      </Suspense>
      {isSanityConfigured ? <NextStudio config={config} /> : <SetupNotice />}
    </>
  );
}

function SetupNotice() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background p-8">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Studio not configured</h1>
        <p className="text-sm leading-relaxed text-muted">
          Set{" "}
          <code className="font-mono text-foreground">
            NEXT_PUBLIC_SANITY_PROJECT_ID
          </code>{" "}
          in your environment to enable the content dashboard. Until then the
          site renders from{" "}
          <code className="font-mono text-foreground">lib/content/local.ts</code>
          .
        </p>
        <p className="text-xs text-subtle">
          See <code className="font-mono">README.md</code> for the setup steps.
        </p>
      </div>
    </div>
  );
}
