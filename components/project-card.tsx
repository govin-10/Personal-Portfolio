import { ArrowUpRight, Globe, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PROJECT_KIND, ProjectKindIcons } from "@/components/project-kind";
import { Badge, TechChip } from "@/components/ui/badge";
import type { Project } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/** Fallback artwork for projects that have no cover uploaded yet. */
function CoverFallback({ project }: { project: Project }) {
  const Icon = project.category === "web" ? Globe : Smartphone;
  return (
    <div className="relative grid h-full w-full place-items-center bg-linear-to-br from-brand-500/15 via-brand-600/10 to-transparent">
      <div className="bg-grid absolute inset-0 opacity-60" />
      <Icon className="relative size-10 text-accent/50" strokeWidth={1.25} />
    </div>
  );
}

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const statusLabel =
    project.status === "in-development"
      ? "In development"
      : project.status === "concept"
        ? "Concept"
        : project.status === "archived"
          ? "Archived"
          : null;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface ring-hairline transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-xl focus-visible:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-(--border)">
        {project.cover ? (
          <Image
            src={project.cover.url}
            alt={project.cover.alt}
            fill
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            placeholder={project.cover.lqip ? "blur" : "empty"}
            blurDataURL={project.cover.lqip}
            className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
          />
        ) : (
          <CoverFallback project={project} />
        )}

        <div className="absolute left-3 top-3 flex gap-2">
          <Badge
            tone="accent"
            className="bg-background/80 backdrop-blur-sm"
          >
            <ProjectKindIcons category={project.category} />
            {PROJECT_KIND[project.category].short}
          </Badge>
          {statusLabel ? (
            <Badge className="bg-background/80 backdrop-blur-sm">
              {statusLabel}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug tracking-tight">
            {project.title}
          </h3>
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-subtle transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {project.tagline}
        </p>

        {project.stack.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((tech) => (
              <TechChip key={tech}>{tech}</TechChip>
            ))}
            {project.stack.length > 4 ? (
              <span className="self-center font-mono text-[11px] text-subtle">
                +{project.stack.length - 4}
              </span>
            ) : null}
          </div>
        ) : null}

        {project.period ? (
          <p
            className={cn(
              "mt-4 font-mono text-[11px] uppercase tracking-wider text-subtle",
              "pt-4 border-t border-(--border)",
            )}
          >
            {project.period}
            {project.role ? ` · ${project.role}` : ""}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
