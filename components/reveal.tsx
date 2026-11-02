import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in seconds. Only applies to the non-scroll-driven fallback. */
  delay?: number;
  className?: string;
}

/**
 * Scroll reveal, done in CSS rather than JS.
 *
 * The base state is *visible*: if neither animation path applies, nothing is
 * ever hidden. Browsers with scroll-driven animations tie the fade to the
 * element entering the viewport; everywhere else it's a plain on-load fade.
 *
 * This replaced a motion/IntersectionObserver version that left content at
 * `opacity: 0` whenever the observer didn't fire. A blank page is a far worse
 * failure than a missing animation. It's also a server component now, which
 * keeps 17 client components out of the tree.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <div
      className={cn("reveal", className)}
      style={
        delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined
      }
    >
      {children}
    </div>
  );
}
