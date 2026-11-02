import type { SkillGroup } from "@/lib/content/types";

/**
 * Continuously scrolling band of technologies. The list is duplicated so the
 * -50% keyframe loops seamlessly; the copy is hidden from screen readers.
 */
export function StackMarquee({ skills }: { skills: SkillGroup[] }) {
  const items = skills.flatMap((group) => group.items);
  if (items.length < 4) return null;

  return (
    <div className="border-y border-(--border) py-5">
      <div className="mask-fade-x overflow-hidden">
        <div className="animate-marquee flex w-max gap-10 hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center gap-10"
            >
              {items.map((item) => (
                <li
                  key={`${copy}-${item}`}
                  className="whitespace-nowrap font-mono text-sm text-subtle"
                >
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
