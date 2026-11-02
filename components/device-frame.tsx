import Image from "next/image";

import type { ResolvedImage } from "@/lib/content/types";
import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  image: ResolvedImage;
  className?: string;
  priority?: boolean;
  /** Rendered width in px; height follows the 9:19.5 phone aspect. */
  width?: number;
}

/**
 * CSS phone mockup. Screenshots are object-cover cropped to a 9:19.5 viewport
 * so a mix of device sizes still lines up in a row.
 */
export function PhoneFrame({
  image,
  className,
  priority = false,
  width = 280,
}: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-[2.25rem] bg-neutral-900 p-[3px] shadow-2xl ring-1 ring-black/10 dark:ring-white/10",
        className,
      )}
      style={{ width }}
    >
      <div className="relative overflow-hidden rounded-[2.1rem] bg-black">
        {/* Dynamic island */}
        <div className="absolute left-1/2 top-2 z-10 h-[18px] w-[34%] -translate-x-1/2 rounded-full bg-black" />
        <div className="relative aspect-[9/19.5] w-full">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes={`${width}px`}
            priority={priority}
            placeholder={image.lqip ? "blur" : "empty"}
            blurDataURL={image.lqip}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

/** Browser chrome mockup for web projects. */
export function BrowserFrame({
  image,
  className,
  priority = false,
}: {
  image: ResolvedImage;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-surface shadow-2xl ring-hairline",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-(--border) bg-surface-raised px-3 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400/70" />
        <span className="size-2.5 rounded-full bg-amber-400/70" />
        <span className="size-2.5 rounded-full bg-emerald-400/70" />
      </div>
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          priority={priority}
          placeholder={image.lqip ? "blur" : "empty"}
          blurDataURL={image.lqip}
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

/** Horizontally scrollable rail of phone screenshots. */
export function PhoneRail({ images }: { images: ResolvedImage[] }) {
  if (!images.length) return null;

  return (
    <div className="-mx-6 overflow-x-auto px-6 pb-4 lg:-mx-8 lg:px-8">
      <div className="flex gap-5">
        {images.map((image, index) => (
          <PhoneFrame
            key={image.url}
            image={image}
            priority={index === 0}
            width={252}
          />
        ))}
      </div>
    </div>
  );
}
