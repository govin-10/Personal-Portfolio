"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * No `mounted` state here on purpose: the server can't know the resolved
 * theme, so instead of gating the icon behind an effect we render both and let
 * CSS pick one off the `.dark` class next-themes puts on <html>. That avoids
 * both the hydration mismatch and a cascading render.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle colour theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative grid size-9 place-items-center rounded-full text-muted ring-hairline transition-colors hover:bg-surface-raised hover:text-foreground"
    >
      <Moon className="size-4 dark:hidden" />
      <Sun className="hidden size-4 dark:block" />
    </button>
  );
}
