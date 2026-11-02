import { isUsingSampleContent } from "@/lib/content";

/**
 * Development-only reminder that the site is rendering placeholder content
 * from lib/content/local.ts. Never shown in production builds.
 */
export function SampleContentNotice() {
  if (process.env.NODE_ENV === "production" || !isUsingSampleContent()) {
    return null;
  }

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-6 py-2.5 text-center text-xs text-amber-800 dark:text-amber-300">
      <strong className="font-semibold">Sample content.</strong> Sanity isn&apos;t
      connected yet, so projects and posts come from{" "}
      <code className="font-mono">lib/content/local.ts</code>. Set{" "}
      <code className="font-mono">NEXT_PUBLIC_SANITY_PROJECT_ID</code> to edit at{" "}
      <code className="font-mono">/studio</code>.
    </div>
  );
}
