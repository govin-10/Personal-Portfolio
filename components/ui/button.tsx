import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 ease-out-expo disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset]",
  secondary:
    "bg-surface text-foreground ring-hairline hover:bg-surface-raised hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-muted hover:text-foreground hover:bg-surface-raised",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

function classes(variant: Variant, size: Size, className?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

interface Common {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Common & ComponentProps<"button">) {
  return (
    <button className={classes(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

/** Internal navigation. `href` is validated by typedRoutes. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={classes(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

/** External links and file downloads. */
export function ButtonAnchor({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Common & ComponentProps<"a">) {
  return (
    <a className={classes(variant, size, className)} {...props}>
      {children}
    </a>
  );
}
