import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "./lib/sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  // The Studio is served by Next.js, not the Sanity CLI dev server.
  studioHost: undefined,
  autoUpdates: true,
});
