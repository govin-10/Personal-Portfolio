import { ArrowLeft, ExternalLink, Globe } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AppleIcon,
  GitHubIcon,
  GooglePlayIcon,
} from "@/components/brand-icons";
import { BrowserFrame, PhoneRail } from "@/components/device-frame";
import { PROJECT_KIND, ProjectKindIcons } from "@/components/project-kind";
import { PortableText } from "@/components/portable-text";
import { Badge, TechChip } from "@/components/ui/badge";
import { ButtonAnchor } from "@/components/ui/button";
import { getProject, getProjectSlugs } from "@/lib/content";
import type { LinkKind } from "@/lib/content/types";

/**
 * These pages are entirely slug-dependent, so there is no meaningful shell to
 * paint before the data resolves. Every published slug is prerendered via
 * `generateStaticParams`, so real navigations are instant from the prefetched
 * HTML; this only opts out of the dev-time instant-shell validation for slugs
 * published since the last build.
 */
export const instant = false;

/** Stand-in param used only when nothing is published yet. */
const PLACEHOLDER_SLUG = "__no-projects-yet__";

/**
 * Cache Components requires at least one param, so an empty collection would
 * otherwise fail the build. The placeholder resolves to `notFound()` below and
 * never reaches the sitemap, which reads the real slug list.
 */
export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  if (!slugs.length) return [{ slug: PLACEHOLDER_SLUG }];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.tagline,
      type: "article",
      images: project.cover ? [{ url: project.cover.url }] : undefined,
    },
  };
}

const LINK_ICONS: Record<LinkKind, React.ComponentType<{ className?: string }>> = {
  appStore: AppleIcon,
  playStore: GooglePlayIcon,
  live: Globe,
  github: GitHubIcon,
  video: ExternalLink,
  other: ExternalLink,
};

const STATUS_LABELS = {
  live: "Live",
  "in-development": "In development",
  archived: "Archived",
  concept: "Concept",
} as const;

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const { screenshots, webScreenshots } = project;
  const hasMedia = screenshots.length > 0 || webScreenshots.length > 0;

  const facts = [
    project.role && { label: "Role", value: project.role },
    project.client && { label: "Client", value: project.client },
    project.period && { label: "Period", value: project.period },
    { label: "Status", value: STATUS_LABELS[project.status] },
    project.platforms.length && {
      label: "Platforms",
      value: project.platforms
        .map((p) => (p === "ios" ? "iOS" : p === "android" ? "Android" : "Web"))
        .join(", "),
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article>
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}
      <header className="relative overflow-hidden border-b border-(--border)">
        <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0 -z-10" />
        <div className="container-page py-14 sm:py-20">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            All projects
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Badge tone="accent">
              <ProjectKindIcons category={project.category} />
              {PROJECT_KIND[project.category].long}
            </Badge>
            <Badge>{STATUS_LABELS[project.status]}</Badge>
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {project.tagline}
          </p>

          {project.links.length ? (
            <div className="mt-9 flex flex-wrap gap-3">
              {project.links.map((link, index) => {
                const Icon = LINK_ICONS[link.kind] ?? ExternalLink;
                return (
                  <ButtonAnchor
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant={index === 0 ? "primary" : "secondary"}
                  >
                    <Icon className="size-4" />
                    {link.label}
                  </ButtonAnchor>
                );
              })}
            </div>
          ) : null}
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Screenshots                                                        */}
      {/* ------------------------------------------------------------------ */}
      {hasMedia ? (
        <section className="border-b border-(--border) bg-surface/40 py-14">
          <div className="container-page space-y-12">
            {/* A project can be both an app and a website, so these render
                independently rather than as an either/or. */}
            {screenshots.length ? (
              <div>
                {webScreenshots.length ? (
                  <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.16em] text-accent">
                    The app
                  </h2>
                ) : null}
                <PhoneRail images={screenshots} />
              </div>
            ) : null}

            {webScreenshots.length ? (
              <div>
                {screenshots.length ? (
                  <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.16em] text-accent">
                    On the web
                  </h2>
                ) : null}
                <div className="space-y-8">
                  {webScreenshots.map((shot, index) => (
                    <BrowserFrame
                      key={shot.url}
                      image={shot}
                      priority={index === 0 && screenshots.length === 0}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Metrics                                                            */}
      {/* ------------------------------------------------------------------ */}
      {project.metrics.length ? (
        <section className="border-b border-(--border)">
          <div className="container-page grid gap-px py-10 sm:grid-cols-3">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="px-2 py-4 text-center">
                <p className="text-3xl font-semibold tracking-tight text-accent">
                  {metric.value}
                </p>
                <p className="mt-1.5 text-sm text-muted">{metric.label}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Body + sidebar                                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="container-page grid gap-14 py-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
        <div>
          {project.body?.length ? (
            <div className="max-w-2xl">
              <PortableText value={project.body} />
            </div>
          ) : (
            <div className="max-w-2xl space-y-5">
              {project.highlights.length ? (
                <>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Highlights
                  </h2>
                  <ul className="space-y-3">
                    {project.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex gap-3 leading-relaxed text-muted"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-muted">
                  A full write-up for this project is on the way.
                </p>
              )}
            </div>
          )}
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-surface p-6 ring-hairline">
            <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
              Project
            </h2>
            <dl className="mt-4 space-y-3.5">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs text-subtle">{fact.label}</dt>
                  <dd className="mt-0.5 text-sm font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {project.stack.length ? (
            <div className="rounded-2xl bg-surface p-6 ring-hairline">
              <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                Built with
              </h2>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <TechChip key={tech}>{tech}</TechChip>
                ))}
              </div>
            </div>
          ) : null}

          {/* When a case study exists, highlights move here instead. */}
          {project.body?.length && project.highlights.length ? (
            <div className="rounded-2xl bg-surface p-6 ring-hairline">
              <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                Highlights
              </h2>
              <ul className="mt-4 space-y-3">
                {project.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex gap-2.5 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
