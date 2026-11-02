import { Download, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { SocialLinks } from "@/components/social-links";
import { TechChip } from "@/components/ui/badge";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section";
import { getProfile } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Govinda Timsina, a developer building cross-platform mobile apps with React Native and production web apps with React and Next.js.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <div className="container-page py-16 sm:py-20">
      {/* Intro */}
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <div>
          <SectionHeader eyebrow="About" title={`Hi, I'm ${profile.name}`} />
          <div className="mt-7 space-y-5">
            {profile.bio.map((paragraph) => (
              <p key={paragraph} className="leading-[1.75] text-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonAnchor href={profile.resumeUrl} download size="md">
              <Download className="size-4" />
              Download resume
            </ButtonAnchor>
            <ButtonLink href="/contact" variant="secondary">
              Get in touch
            </ButtonLink>
          </div>
        </div>

        <aside className="lg:pt-4">
          {profile.avatar ? (
            <div className="overflow-hidden rounded-2xl ring-hairline">
              <Image
                src={profile.avatar.url}
                alt={profile.avatar.alt}
                width={profile.avatar.width}
                height={profile.avatar.height}
                sizes="(min-width: 1024px) 360px, 100vw"
                priority
                placeholder={profile.avatar.lqip ? "blur" : "empty"}
                blurDataURL={profile.avatar.lqip}
                className="aspect-square w-full object-cover"
              />
            </div>
          ) : null}

          <div className="mt-6 space-y-3">
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="size-3.5" />
              {profile.location}
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="block text-sm text-muted transition-colors hover:text-foreground"
            >
              {profile.email}
            </a>
            <SocialLinks socials={profile.socials} className="-ml-2 pt-1" />
          </div>
        </aside>
      </div>

      {/* Skills */}
      <section className="mt-24">
        <SectionHeader eyebrow="Toolkit" title="What I work with" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {profile.skills.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.06}>
              <div className="h-full rounded-2xl bg-surface p-6 ring-hairline">
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                  {group.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <TechChip key={item}>{item}</TechChip>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Experience */}
      {profile.experience.length ? (
        <section className="mt-24">
          <SectionHeader eyebrow="Experience" title="Where I've worked" />
          <ol className="mt-10 space-y-px">
            {profile.experience.map((item, index) => (
              <Reveal key={`${item.company}-${item.period}`} delay={index * 0.06}>
                <li className="relative grid gap-4 border-t border-(--border) py-8 sm:grid-cols-[12rem_1fr] sm:gap-8">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-subtle">
                      {item.period}
                    </p>
                    {item.location ? (
                      <p className="mt-1 text-xs text-subtle">{item.location}</p>
                    ) : null}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {item.role}
                    </h3>
                    <p className="mt-0.5 text-sm text-accent">{item.company}</p>
                    {item.summary ? (
                      <p className="mt-3 leading-relaxed text-muted">
                        {item.summary}
                      </p>
                    ) : null}
                    {item.highlights.length ? (
                      <ul className="mt-4 space-y-2">
                        {item.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="flex gap-3 text-sm leading-relaxed text-muted"
                          >
                            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
