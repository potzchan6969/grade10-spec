import { Button } from "@grade10/design-system/components/forms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@grade10/design-system/components/overlays/dropdown-menu";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretDown } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useLayoutEffect, useState } from "react";
import { PressReleaseListItem } from "./press-release-list-item";
import type { PressReleaseListContent, PressReleaseListCopy } from "./types";

// The same enter reveal the About page uses: a 400ms rise-and-focus
// that reduced-motion visitors skip entirely.
const REVEAL =
  "translate-y-3 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:filter-none motion-reduce:transition-none";
const REVEALED = "translate-y-0 opacity-100 filter-none";

const ALL_TIME = "all";

type PressReleaseListProps = {
  content: PressReleaseListContent;
  copy: PressReleaseListCopy;
};

/**
 * The Figma Press frame (`7201:9699`): the heading block beside a year
 * filter over the releases grouped by year, newest first.
 */
function PressReleaseList({ content, copy }: PressReleaseListProps) {
  const reduceMotion = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [year, setYear] = useState(ALL_TIME);

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
  const groups = content.groups.filter(
    (group) => year === ALL_TIME || group.year === year,
  );

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-4 py-10 sm:px-6 sm:py-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div
          className={cn(
            "flex max-w-[720px] flex-col gap-4",
            REVEAL,
            pageIsRevealed && REVEALED,
          )}
        >
          <p className="font-medium text-secondary-foreground text-sm leading-5 uppercase">
            {content.eyebrow}
          </p>
          <h1 className="font-semibold text-4xl leading-10 sm:text-7xl sm:leading-none">
            {content.heading}
          </h1>
          <p className="text-lg leading-7 sm:text-xl sm:leading-7">
            {content.intro}
          </p>
        </div>
        <div
          className={cn(REVEAL, pageIsRevealed && REVEALED)}
          style={{
            transitionDelay: pageIsRevealed ? "60ms" : "0ms",
          }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  className="self-start"
                  trailing={<CaretDown />}
                  variant="secondary"
                >
                  {year === ALL_TIME ? content.allTime : year}
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                aria-label={copy.filterByYear}
                onValueChange={setYear}
                value={year}
              >
                <DropdownMenuRadioItem value={ALL_TIME}>
                  {content.allTime}
                </DropdownMenuRadioItem>
                {content.groups.map((group) => (
                  <DropdownMenuRadioItem key={group.year} value={group.year}>
                    {group.year}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col border-border border-t",
          REVEAL,
          pageIsRevealed && REVEALED,
        )}
        style={{
          transitionDelay: pageIsRevealed ? "120ms" : "0ms",
        }}
      >
        {groups.map((group) => (
          <section
            aria-labelledby={`press-year-${group.year}`}
            key={group.year}
          >
            <h2
              className="px-4 pt-8 pb-4 font-medium text-secondary-foreground text-sm leading-5"
              id={`press-year-${group.year}`}
            >
              {group.year}
            </h2>
            <ul>
              {group.items.map((item) => (
                <li key={item.href}>
                  <PressReleaseListItem item={item} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export { PressReleaseList, type PressReleaseListProps };
