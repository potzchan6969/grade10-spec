import { Button } from "@grade10/design-system/components/forms/button";
import { Footer } from "@grade10/design-system/components/layout/footer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@grade10/design-system/components/overlays/dropdown-menu";
import { cn } from "@grade10/design-system/lib/utils";
import { SiteHeader } from "@grade10/ui";
import { ArrowRight, CaretDown } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useLayoutEffect, useState } from "react";
import { AUCTION_SITE_HEADER } from "../../auction-lot-details-content";
import { AUCTION_FOOTER } from "../../store-content";
import { PRESS_PAGE, type PressItem } from "./press-content";

// The same enter reveal the About page uses: a 400ms rise-and-focus
// that reduced-motion visitors skip entirely.
const REVEAL =
  "translate-y-3 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:filter-none motion-reduce:transition-none";
const REVEALED = "translate-y-0 opacity-100 filter-none";

const ALL_TIME = "all";

/** One press release: the whole row is the link to its article. */
function PressListItem({ item }: { item: PressItem }) {
  return (
    <a
      className="group flex flex-col gap-2 border-border border-b px-4 py-6 transition-colors hover:bg-muted sm:grid sm:grid-cols-[160px_minmax(0,1fr)_160px] sm:gap-x-8"
      href={item.href}
    >
      <span className="flex min-h-7 items-center font-medium text-secondary-foreground text-sm leading-5">
        {item.date}
      </span>
      <span className="font-medium text-xl leading-7">{item.title}</span>
      <span className="hidden h-7 min-w-7 items-center justify-center justify-self-end pr-3 group-hover:pr-0 sm:flex">
        <ArrowRight aria-hidden size={16} />
      </span>
    </a>
  );
}

/**
 * The `/press-releases` surface as the app assembles it: `SiteHeader`, the
 * Figma Press frame — heading block, a year filter over the releases
 * grouped newest first — and `Footer`. No nav item is current — the entry
 * point is still undecided.
 */
function PressPage() {
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
  const groups = PRESS_PAGE.groups.filter(
    (group) => year === ALL_TIME || group.year === year,
  );

  return (
    <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <SiteHeader
        {...AUCTION_SITE_HEADER}
        navItems={AUCTION_SITE_HEADER.navItems.map((item) => ({
          ...item,
          current: false,
        }))}
      />
      <main className="w-full flex-1">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-5 py-10 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div
              className={cn(
                "flex max-w-[720px] flex-col gap-4",
                REVEAL,
                pageIsRevealed && REVEALED,
              )}
            >
              <p className="font-medium text-secondary-foreground text-sm leading-5 uppercase">
                {PRESS_PAGE.eyebrow}
              </p>
              <h1 className="font-semibold text-4xl leading-10 sm:text-7xl sm:leading-none">
                {PRESS_PAGE.heading}
              </h1>
              <p className="text-lg leading-7 sm:text-xl sm:leading-7">
                {PRESS_PAGE.intro}
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
                      {year === ALL_TIME ? PRESS_PAGE.allTime : year}
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup
                    aria-label="Filter by year"
                    onValueChange={setYear}
                    value={year}
                  >
                    <DropdownMenuRadioItem value={ALL_TIME}>
                      {PRESS_PAGE.allTime}
                    </DropdownMenuRadioItem>
                    {PRESS_PAGE.groups.map((group) => (
                      <DropdownMenuRadioItem
                        key={group.year}
                        value={group.year}
                      >
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
                      <PressListItem item={item} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer {...AUCTION_FOOTER} />
    </div>
  );
}

export { PressPage };
