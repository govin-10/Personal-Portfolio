import { ArrowRight, Clock, Globe, Layers, Smartphone } from "lucide-react";
import Link from "next/link";

import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { StackMarquee } from "@/components/stack-marquee";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { getFeaturedProjects, getPosts, getProfile } from "@/lib/content";
import { formatDateShort } from "@/lib/utils";

const SERVICES = [
  {
    icon: Smartphone,
    title: "Mobile apps",
    body: "Cross-platform iOS and Android apps in React Native and Expo, built to feel native on both rather than a website in a shell.",
  },
  {
    icon: Globe,
    title: "Web apps",
    body: "Marketing sites, dashboards and web apps in React and Next.js. Fast, responsive, accessible, and good on real devices.",
  },
  {
    icon: Layers,
    title: "Ship & maintain",
    body: "Store submissions, signing, OTA updates, crash triage and performance work. The unglamorous half that keeps an app alive.",
  },
];

export default async function HomePage() {
  const [profile, featured, posts] = await Promise.all([
    getProfile(),
    getFeaturedProjects(3),
    getPosts(),
  ]);

  const latestPosts = posts.slice(0, 2);

  return (
    <>
      <Hero profile={profile} />

      <StackMarquee skills={profile.skills} />

      {/* ---------------------------------------------------------------- */}
      {/* Selected work                                                     */}
      {/* ---------------------------------------------------------------- */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Selected work"
            title="Things I've built"
            description="A few projects I'm happy to be judged on, across mobile and web."
          />
          <ButtonLink href="/projects" variant="secondary" size="sm">
            All projects
            <ArrowRight className="size-3.5" />
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, index) => (
            <Reveal key={project._id} delay={index * 0.08}>
              <ProjectCard project={project} priority={index === 0} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* What I do                                                         */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-(--border) bg-surface/40">
        <SectionHeader
          eyebrow="What I do"
          title="Mobile and web, end to end"
          description="I started on the web and moved into React Native, so I can own both ends of a product."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.08}>
              <div className="h-full rounded-2xl bg-surface p-7 ring-hairline">
                <span className="grid size-11 place-items-center rounded-xl bg-accent/10 text-accent">
                  <service.icon className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                  {service.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* About teaser                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-(--border)">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeader eyebrow="About" title="A little background" />
            <div className="mt-6 space-y-4">
              {profile.bio.slice(0, 2).map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
            <ButtonLink href="/about" variant="secondary" className="mt-8">
              More about me
              <ArrowRight className="size-4" />
            </ButtonLink>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="space-y-3">
              {profile.skills.map((group) => (
                <li
                  key={group.title}
                  className="rounded-xl bg-surface p-5 ring-hairline"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                    {group.title}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    {group.items.join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Writing                                                           */}
      {/* ---------------------------------------------------------------- */}
      {latestPosts.length ? (
        <Section className="border-t border-(--border) bg-surface/40">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow="Writing"
              title="Notes from the work"
              description="Occasional posts about React Native, performance and shipping to the stores."
            />
            <ButtonLink href="/blog" variant="secondary" size="sm">
              All posts
              <ArrowRight className="size-3.5" />
            </ButtonLink>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {latestPosts.map((post, index) => (
              <Reveal key={post._id} delay={index * 0.08}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl bg-surface p-7 ring-hairline transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-subtle">
                    <time dateTime={post.publishedAt}>
                      {formatDateShort(post.publishedAt)}
                    </time>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {post.readingTime} min
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent">
                    {post.title}
                  </h3>
                  {post.excerpt ? (
                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                  ) : null}
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Contact CTA                                                       */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-(--border)">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-surface px-7 py-16 text-center ring-hairline sm:px-16">
            <div
              className="pointer-events-none absolute inset-x-0 -top-24 h-64 opacity-70 blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Got an app that needs building?
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
                I&apos;m currently open to new work, whether that&apos;s an app
                or web product from scratch, rescuing one that stalled, or
                getting an existing build shipped.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/contact" size="lg">
                  Start a conversation
                  <ArrowRight className="size-4" />
                </ButtonLink>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex h-12 items-center rounded-full px-5 text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                  {profile.email}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
