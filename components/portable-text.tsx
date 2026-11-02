import {
  PortableText as BasePortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import Image from "next/image";

import { urlFor } from "@/lib/sanity/image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 leading-[1.75] text-muted">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-12 scroll-mt-28 text-2xl font-semibold tracking-tight text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-9 scroll-mt-28 text-lg font-semibold tracking-tight text-foreground">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-7 border-l-2 border-(--color-accent) pl-5 text-base italic text-muted">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 ml-5 list-disc space-y-2 text-muted marker:text-accent">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 ml-5 list-decimal space-y-2 text-muted marker:text-subtle">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-[1.75] pl-1">{children}</li>,
    number: ({ children }) => <li className="leading-[1.75] pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-[0.85em] text-foreground ring-hairline">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = (value?.href as string) ?? "#";
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const built = urlFor(value)?.width(1400).url();
      if (!built) return null;
      return (
        <figure className="my-9">
          <Image
            src={built}
            alt={(value?.alt as string) || ""}
            width={1400}
            height={900}
            sizes="(min-width: 1024px) 760px, 100vw"
            className="w-full rounded-xl ring-hairline"
          />
          {value?.caption ? (
            <figcaption className="mt-2.5 text-center text-xs text-subtle">
              {value.caption as string}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    codeBlock: ({ value }) => (
      <figure className="my-7 overflow-hidden rounded-xl bg-surface ring-hairline">
        {value?.filename ? (
          <figcaption className="border-b border-(--border) bg-surface-raised px-4 py-2 font-mono text-xs text-subtle">
            {value.filename as string}
          </figcaption>
        ) : null}
        <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
          <code className="font-mono">{value?.code as string}</code>
        </pre>
      </figure>
    ),
  },
};

export function PortableText({ value }: { value: PortableTextBlock[] }) {
  return <BasePortableText value={value} components={components} />;
}
