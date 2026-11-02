import { ArrowUpRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";

import { SocialLinks } from "@/components/social-links";
import { getProfile } from "@/lib/content";
import { NAV_ITEMS } from "@/lib/site";

export async function SiteFooter() {
  // Cached so the copyright year is a prerenderable value rather than an
  // unstable `new Date()` read at render time.
  "use cache";
  cacheLife("days");

  const profile = await getProfile();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-(--border)">
      <div className="container-page py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <p className="text-lg font-semibold tracking-tight">
              {profile.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {profile.headline} based in {profile.location}. Currently building
              mobile apps and the web front-ends around them.
            </p>
            <SocialLinks socials={profile.socials} className="mt-5 -ml-2" />
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">
                Site
              </h2>
              <ul className="mt-4 space-y-2.5">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">
                Elsewhere
              </h2>
              <ul className="mt-4 space-y-2.5">
                {profile.socials
                  .filter((social) => social.kind !== "email")
                  .map((social) => (
                    <li key={social.url}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
                      >
                        {social.label}
                        <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                <li>
                  <a
                    href={profile.resumeUrl}
                    download
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    Resume (PDF)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-(--border) pt-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <p className="font-mono">Next.js · React · Sanity</p>
        </div>
      </div>
    </footer>
  );
}
