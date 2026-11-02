import { ArrowLeft, Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortableText } from "@/components/portable-text";
import { Badge } from "@/components/ui/badge";
import { getPost, getPostSlugs } from "@/lib/content";
import { formatDate } from "@/lib/utils";

/**
 * These pages are entirely slug-dependent, so there is no meaningful shell to
 * paint before the data resolves. Every published slug is prerendered via
 * `generateStaticParams`, so real navigations are instant from the prefetched
 * HTML; this only opts out of the dev-time instant-shell validation for slugs
 * published since the last build.
 */
export const instant = false;

/** Stand-in param used only when nothing is published yet. */
const PLACEHOLDER_SLUG = "__no-posts-yet__";

/**
 * Cache Components requires at least one param, so an empty collection (no
 * posts published yet) would otherwise fail the build. The placeholder is
 * resolved by `getPost` returning null, which calls `notFound()` below, and it
 * never reaches the sitemap because that reads the real slug list.
 */
export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  if (!slugs.length) return [{ slug: PLACEHOLDER_SLUG }];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: post.cover ? [{ url: post.cover.url }] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <article className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          All posts
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-subtle">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" />
              {post.readingTime} min read
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {post.excerpt}
            </p>
          ) : null}

          {post.tags.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : null}
        </header>

        {post.cover ? (
          <Image
            src={post.cover.url}
            alt={post.cover.alt}
            width={post.cover.width}
            height={post.cover.height}
            sizes="(min-width: 768px) 672px, 100vw"
            priority
            placeholder={post.cover.lqip ? "blur" : "empty"}
            blurDataURL={post.cover.lqip}
            className="mt-10 w-full rounded-2xl ring-hairline"
          />
        ) : null}

        <div className="mt-12">
          {post.body?.length ? (
            <PortableText value={post.body} />
          ) : (
            <p className="text-muted">This post is still being written.</p>
          )}
        </div>
      </div>
    </article>
  );
}
