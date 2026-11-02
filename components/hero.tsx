import { ArrowRight, Download, MapPin } from "lucide-react";
import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { SocialLinks } from "@/components/social-links";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import type { Profile } from "@/lib/content/types";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="relative overflow-hidden">
      {/* Backdrop: hairline grid + accent glow, faded toward the fold. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid mask-fade-b absolute inset-0" />
        <div
          className="absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container-page py-20 sm:py-28 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
                  <MapPin className="size-3.5" />
                  {profile.location}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {profile.name}
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-3 font-mono text-sm uppercase tracking-[0.2em] text-accent">
                {profile.headline}
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
                {profile.heroStatement}
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <ButtonLink href="/projects" size="lg">
                  View my work
                  <ArrowRight className="size-4" />
                </ButtonLink>
                <ButtonAnchor
                  href={profile.resumeUrl}
                  download
                  variant="secondary"
                  size="lg"
                >
                  <Download className="size-4" />
                  Resume
                </ButtonAnchor>
              </div>
            </Reveal>

            <Reveal delay={0.28}>
              <SocialLinks
                socials={profile.socials}
                className="mt-8 -ml-2"
              />
            </Reveal>
          </div>

          {profile.avatar ? (
            <Reveal delay={0.12} className="order-first lg:order-last">
              <div className="relative mx-auto w-full max-w-[18rem] lg:max-w-none">
                {/* Soft accent wash behind the portrait */}
                <div className="absolute -inset-4 rounded-[2rem] bg-linear-to-br from-brand-500/25 to-transparent blur-2xl" />
                <div className="relative overflow-hidden rounded-[1.75rem] ring-hairline">
                  <Image
                    src={profile.avatar.url}
                    alt={profile.avatar.alt}
                    width={profile.avatar.width}
                    height={profile.avatar.height}
                    priority
                    placeholder={profile.avatar.lqip ? "blur" : "empty"}
                    blurDataURL={profile.avatar.lqip}
                    sizes="(min-width: 1024px) 420px, 288px"
                    className="aspect-square w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
