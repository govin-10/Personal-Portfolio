export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://govindatimsina.com.np"
).replace(/\/$/, "");

/**
 * `as const` keeps each href a literal type, which is what `typedRoutes`
 * needs to validate <Link href> at compile time.
 */
export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Writing" },
  { href: "/contact", label: "Contact" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
