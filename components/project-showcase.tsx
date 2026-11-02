"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "mobile" | "web";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All work" },
  { value: "mobile", label: "Mobile apps" },
  { value: "web", label: "Websites" },
];

/**
 * A project whose category is "both" ships an app *and* a web surface, so it
 * belongs under either chip, hence the `!==` tests rather than equality.
 */
function matchesFilter(project: Project, filter: Filter): boolean {
  if (filter === "all") return true;
  if (filter === "mobile") return project.category !== "web";
  return project.category !== "mobile";
}

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const reduce = useReducedMotion();

  const counts = useMemo(
    () => ({
      all: projects.length,
      mobile: projects.filter((p) => matchesFilter(p, "mobile")).length,
      web: projects.filter((p) => matchesFilter(p, "web")).length,
    }),
    [projects],
  );

  const visible = useMemo(
    () => projects.filter((project) => matchesFilter(project, filter)),
    [projects, filter],
  );

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter projects"
        className="flex flex-wrap gap-2"
      >
        {FILTERS.map((option) => {
          const active = filter === option.value;
          const count = counts[option.value];
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={count === 0}
              onClick={() => setFilter(option.value)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40",
                active ? "text-accent-foreground" : "text-muted hover:text-foreground",
              )}
            >
              {active ? (
                <motion.span
                  layoutId="project-filter-pill"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={
                    reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }
                  }
                />
              ) : (
                <span className="absolute inset-0 rounded-full ring-hairline" />
              )}
              <span className="relative">
                {option.label}
                <span className="ml-1.5 opacity-60">{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
            <motion.div
              key={project._id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCard project={project} priority={index < 3} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visible.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted">
          Nothing here yet.
        </p>
      ) : null}
    </div>
  );
}
