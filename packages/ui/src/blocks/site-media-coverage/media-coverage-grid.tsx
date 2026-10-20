import { cn } from "@grade10/design-system/lib/utils";
import { useReducedMotion } from "motion/react";
import { useLayoutEffect, useState } from "react";
import { MediaCoverageCard } from "./media-coverage-card";
import type { MediaCoverageContent, MediaCoverageCopy } from "./types";

// The same enter reveal the About page uses: a 400ms rise-and-focus
// that reduced-motion visitors skip entirely.
const REVEAL =
  "translate-y-3 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:filter-none motion-reduce:transition-none";
const REVEALED = "translate-y-0 opacity-100 filter-none";

type MediaCoverageGridProps = {
  content: MediaCoverageContent;
  copy: MediaCoverageCopy;
};

/**
 * The Figma Media Coverage frame (`7204:11244`): the heading block over the
 * four-column grid of media cards.
 */
function MediaCoverageGrid({ content, copy }: MediaCoverageGridProps) {
  const reduceMotion = useReducedMotion();
  const [entered, setEntered] = useState(false);

  useLayoutEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  const pageIsRevealed = entered || Boolean(reduceMotion);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-4 py-10 sm:px-6 sm:py-20">
      <div
        className={cn(
          "flex max-w-[720px] flex-col gap-4",
          REVEAL,
          pageIsRevealed && REVEALED,
        )}
      >
        <p className="font-medium text-secondary-foreground text-sm uppercase leading-5">
          {content.eyebrow}
        </p>
        <h1 className="font-semibold text-4xl leading-10 sm:text-7xl sm:leading-none">
          {content.heading}
        </h1>
        <p className="text-lg leading-7 sm:text-xl sm:leading-7">
          {content.intro}
        </p>
      </div>
      <ul
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
          REVEAL,
          pageIsRevealed && REVEALED,
        )}
        style={{
          transitionDelay: pageIsRevealed ? "120ms" : "0ms",
        }}
      >
        {content.items.map((item) => (
          <li key={item.href}>
            <MediaCoverageCard copy={copy} item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export { MediaCoverageGrid, type MediaCoverageGridProps };
