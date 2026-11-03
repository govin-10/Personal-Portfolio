"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-(--border) bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight"
        >
          <Image
            src="/logo.png"
            alt=""
            width={133}
            height={133}
            // Black artwork on transparency: invert it so it reads on a dark background.
            className="size-8 rounded-lg dark:invert"
            priority
          />
          <span className="hidden sm:inline">Govinda Timsina</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-sm transition-colors",
                isActive(item.href)
                  ? "text-foreground"
                  : "text-muted hover:text-foreground",
              )}
            >
              {isActive(item.href) ? (
                <span className="absolute inset-0 rounded-full bg-surface-raised ring-hairline" />
              ) : null}
              <span className="relative">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink
            href="/contact"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Hire me
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-full text-muted ring-hairline transition-colors hover:text-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-(--border) bg-background md:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex flex-col py-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-xl px-3 py-3 text-base transition-colors",
                isActive(item.href)
                  ? "bg-surface-raised text-foreground"
                  : "text-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
