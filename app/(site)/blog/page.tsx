import { Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section";
import { getPosts } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on React Native, mobile performance, and shipping apps to the App Store and Google Play.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container-page py-16 sm:py-20">
      <SectionHeader
        eyebrow="Writing"
        title="Notes from the work"
        description="Things I've run into building and shipping apps, written down mostly so I remember them."
      />

      {posts.length ? (
        <ul className="mt-14 space-y-px">
          {posts.map((post, index) => (
            <Reveal key={post._id} delay={Math.min(index, 5) * 0.05}>
              <li className="border-t border-(--border)">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid gap-3 py-8 transition-colors sm:grid-cols-[10rem_1fr] sm:gap-8"
                >
                  <div className="font-mono text-xs uppercase tracking-wider text-subtle">
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                    <p className="mt-1.5 inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {post.readingTime} min read
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">
                      {post.title}
                    </h2>
                    {post.excerpt ? (
                      <p className="mt-2.5 max-w-2xl leading-relaxed text-muted">
                        {post.excerpt}
                      </p>
                    ) : null}
                    {post.tags.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      ) : (
        <p className="mt-14 text-muted">
          No posts yet. The first one is in progress.
        </p>
      )}
    </div>
  );
}
