import { Mail } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/brand-icons";
import type { SocialLink } from "@/lib/content/types";
import { cn } from "@/lib/utils";

const ICONS: Record<SocialLink["kind"], ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  twitter: XIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  email: Mail,
};

export function SocialLinks({
  socials,
  className,
  size = "md",
}: {
  socials: SocialLink[];
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <ul className={cn("flex items-center gap-1.5", className)}>
      {socials.map((social) => {
        const Icon = ICONS[social.kind] ?? Mail;
        const isMail = social.kind === "email";
        return (
          <li key={social.url}>
            <a
              href={social.url}
              target={isMail ? undefined : "_blank"}
              rel={isMail ? undefined : "noopener noreferrer"}
              aria-label={social.label}
              title={social.label}
              className={cn(
                "grid place-items-center rounded-full text-muted transition-colors hover:bg-surface-raised hover:text-foreground",
                size === "md" ? "size-9" : "size-8",
              )}
            >
              <Icon className={size === "md" ? "size-4" : "size-3.5"} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
