import { Globe, Smartphone } from "lucide-react";

import type { ProjectCategory } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * Single source of truth for how a project's category is labelled, shared by
 * the card and the case-study header so the two can't drift apart.
 */
export const PROJECT_KIND: Record<
  ProjectCategory,
  { short: string; long: string }
> = {
  mobile: { short: "Mobile", long: "Mobile app" },
  web: { short: "Web", long: "Website" },
  both: { short: "Mobile & Web", long: "Mobile app & website" },
};

/** One icon per surface; two for projects that are both. */
export function ProjectKindIcons({
  category,
  className,
}: {
  category: ProjectCategory;
  className?: string;
}) {
  return (
    <>
      {category !== "web" ? (
        <Smartphone className={cn("size-3", className)} />
      ) : null}
      {category !== "mobile" ? (
        <Globe className={cn("size-3", className)} />
      ) : null}
    </>
  );
}
