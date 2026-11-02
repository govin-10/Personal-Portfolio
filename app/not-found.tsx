import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="text-center">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          This page doesn&apos;t exist
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
          The link may be out of date, or the page may have moved.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground transition-all hover:brightness-110"
          >
            Back home
          </Link>
          <Link
            href="/projects"
            className="inline-flex h-11 items-center rounded-full px-5 text-sm font-medium text-muted ring-hairline transition-colors hover:text-foreground"
          >
            See projects
          </Link>
        </div>
      </div>
    </div>
  );
}
