import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  tone?: "default" | "accent" | "success";
}

const TONES = {
  default: "text-muted ring-hairline",
  accent: "text-accent bg-accent/10",
  success: "text-emerald-700 bg-emerald-500/10 dark:text-emerald-400",
} as const;

export function Badge({ children, className, tone = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Monospace chip used for tech-stack lists. */
export function TechChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md bg-surface-raised px-2 py-1 font-mono text-[11px] tracking-tight text-muted ring-hairline">
      {children}
    </span>
  );
}
