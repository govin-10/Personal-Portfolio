"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId, studioTitle } from "@/lib/sanity/env";
import { schemaTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";

/**
 * Studio config, mounted inside the Next.js app at /studio.
 * Also used by the `sanity` CLI for schema extraction and typegen.
 */
export default defineConfig({
  basePath: "/studio",
  title: studioTitle,
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // GROQ playground, handy for testing queries against real data.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    // The profile singleton shouldn't be duplicable or deletable.
    actions: (prev, { schemaType }) =>
      schemaType === "profile"
        ? prev.filter(
            ({ action }) =>
              action && !["duplicate", "delete", "unpublish"].includes(action),
          )
        : prev,
  },
});
