import { Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { SocialLinks } from "@/components/social-links";
import { SectionHeader } from "@/components/ui/section";
import { getProfile } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Govinda Timsina about React Native and frontend development work.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <div className="container-page py-16 sm:py-20">
      <div className="grid gap-14 lg:grid-cols-[1fr_20rem] lg:gap-20">
        <div>
          <SectionHeader
            eyebrow="Contact"
            title="Let's talk"
            description="Tell me a little about what you're building and I'll get back to you, usually within a day or two."
          />
          <div className="mt-10 max-w-xl">
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-6 lg:pt-4">
          {profile.availableForWork ? (
            <div className="rounded-2xl bg-surface p-6 ring-hairline">
              <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                Availability
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                I&apos;m open to new projects: contract or freelance
              </p>
            </div>
          ) : null}

          <div className="rounded-2xl bg-surface p-6 ring-hairline">
            <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
              Direct
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
                >
                  <Mail className="size-4 shrink-0" />
                  {profile.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-muted">
                <MapPin className="size-4 shrink-0" />
                {profile.location}
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-surface p-6 ring-hairline">
            <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
              Elsewhere
            </h2>
            <SocialLinks socials={profile.socials} className="mt-3 -ml-2" />
          </div>
        </aside>
      </div>
    </div>
  );
}
