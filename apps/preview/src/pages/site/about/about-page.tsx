import { Badge } from "@grade10/design-system/components/display/badge";
import { Card } from "@grade10/design-system/components/display/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { cn } from "@grade10/design-system/lib/utils";
import { SiteHeader } from "@grade10/ui";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { Fragment, useLayoutEffect, useState } from "react";
import { AUCTION_SITE_HEADER } from "../../auction-lot-details-content";
import { AUCTION_FOOTER } from "../../store-content";
import { ABOUT_PAGE, type AboutSegment } from "./about-content";

// The same enter reveal the auction catalogue uses: a 400ms rise-and-focus
// that reduced-motion visitors skip entirely.
const REVEAL =
  "translate-y-3 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:filter-none motion-reduce:transition-none";
const REVEALED = "translate-y-0 opacity-100 filter-none";

// The Figma run marks in-sentence links Gibson Medium over
// `Base/accent-foreground` with a resting underline. The `Link` primitive is
// `inline-flex` and cannot wrap mid-sentence, so these stay plain anchors.
const INLINE_LINK =
  "font-medium text-accent-foreground underline decoration-from-font [text-underline-position:from-font]";

function Segments({ segments }: { segments: readonly AboutSegment[] }) {
  return (
    <>
      {segments.map((segment) =>
        segment.link ? (
          <a
            className={INLINE_LINK}
            href={segment.link.href}
            key={segment.text}
            rel={segment.link.external ? "noopener noreferrer" : undefined}
            target={segment.link.external ? "_blank" : undefined}
          >
            {segment.text}
          </a>
        ) : (
          <Fragment key={segment.text}>{segment.text}</Fragment>
        ),
      )}
    </>
  );
}

/**
 * The `/about` surface as the app assembles it: `SiteHeader`, the Figma
 * About frame composed from design-system tokens and `Card`, and `Footer`.
 * No nav item is current — About's entry is the footer's Company column.
 */
function AboutPage() {
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
  const [activeIndex, setActiveIndex] = useState(
    ABOUT_PAGE.marketIndexes.indexes[0],
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
        <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-8 sm:py-12">
          <section
            aria-labelledby="about-heading"
            className="flex flex-col gap-6 py-8 sm:grid sm:grid-cols-2 sm:items-start sm:gap-16 sm:py-20"
          >
            <h1
              className={cn(
                "font-semibold text-4xl leading-10 sm:text-7xl sm:leading-none",
                REVEAL,
                pageIsRevealed && REVEALED,
              )}
              id="about-heading"
            >
              {ABOUT_PAGE.heading}
            </h1>
            <p
              className={cn(
                "text-lg leading-7 sm:text-2xl sm:leading-8",
                REVEAL,
                pageIsRevealed && REVEALED,
              )}
              style={{
                transitionDelay: pageIsRevealed ? "60ms" : "0ms",
              }}
            >
              <Segments segments={ABOUT_PAGE.intro} />
            </p>
          </section>
          <div className="flex flex-col gap-8 py-8 sm:flex-row sm:gap-16 sm:py-20">
            {([ABOUT_PAGE.whatWeDo, ABOUT_PAGE.whereWeAreGoing] as const).map(
              (block, index) => (
                <section
                  aria-labelledby={`about-section-${index}`}
                  className={cn(
                    "flex flex-1 flex-col gap-2 sm:gap-4",
                    REVEAL,
                    pageIsRevealed && REVEALED,
                  )}
                  key={block.heading}
                  style={{
                    transitionDelay: pageIsRevealed
                      ? `${120 + index * 60}ms`
                      : "0ms",
                  }}
                >
                  <h2
                    className="font-semibold text-xl leading-7 sm:text-2xl sm:leading-8"
                    id={`about-section-${index}`}
                  >
                    {block.heading}
                  </h2>
                  <p className="text-base leading-6 sm:text-lg sm:leading-7">
                    <Segments segments={block.body} />
                  </p>
                </section>
              ),
            )}
          </div>
          <section
            aria-labelledby="market-indexes-heading"
            className={cn(
              "flex flex-col gap-2 py-8 sm:gap-4 sm:py-20",
              REVEAL,
              pageIsRevealed && REVEALED,
            )}
            style={{
              transitionDelay: pageIsRevealed ? "200ms" : "0ms",
            }}
          >
            <div className="flex flex-col gap-6 sm:grid sm:grid-cols-5 sm:gap-16">
              <div className="flex flex-col gap-2 sm:col-span-2 sm:gap-4">
                <p className="font-medium text-secondary-foreground text-sm leading-5 uppercase">
                  {ABOUT_PAGE.marketIndexes.label}
                </p>
                <h2
                  className="font-semibold text-xl leading-7 sm:text-2xl sm:leading-8"
                  id="market-indexes-heading"
                >
                  {ABOUT_PAGE.marketIndexes.heading}
                </h2>
                <p className="text-base leading-6 sm:text-lg sm:leading-7">
                  {ABOUT_PAGE.marketIndexes.body}
                </p>
                <div className="-mx-2 overflow-x-auto border-border border-b px-2 sm:hidden">
                  <Tabs
                    onValueChange={(name) => {
                      const next = ABOUT_PAGE.marketIndexes.indexes.find(
                        (index) => index.name === name,
                      );
                      if (next) setActiveIndex(next);
                    }}
                    value={activeIndex.name}
                  >
                    <TabsList
                      aria-label="Grade10 market indexes"
                      variant="list"
                    >
                      {ABOUT_PAGE.marketIndexes.indexes.map((index) => (
                        <TabsTrigger
                          aria-controls="market-indexes-panel"
                          key={index.name}
                          value={index.name}
                        >
                          {index.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
                {/* The design-system Tabs primitive is horizontal-only, so
                    the index picker is a hand-rolled vertical tablist with
                    the same roles and arrow-key model. */}
                <div
                  aria-label="Grade10 market indexes"
                  aria-orientation="vertical"
                  className="mt-4 hidden flex-col gap-1 sm:flex"
                  role="tablist"
                >
                  {ABOUT_PAGE.marketIndexes.indexes.map((index, order) => {
                    const selected = index.name === activeIndex.name;
                    return (
                      <button
                        aria-controls="market-indexes-panel"
                        aria-selected={selected}
                        className={cn(
                          "block w-full cursor-pointer rounded-xl px-3 py-2.5 text-left font-medium text-base leading-6 transition-colors duration-150 ease-out hover:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none",
                          selected
                            ? "bg-muted text-foreground"
                            : "text-secondary-foreground",
                        )}
                        id={`market-indexes-tab-${order}`}
                        key={index.name}
                        onClick={() => setActiveIndex(index)}
                        onKeyDown={(event) => {
                          if (
                            event.key !== "ArrowDown" &&
                            event.key !== "ArrowUp"
                          ) {
                            return;
                          }
                          event.preventDefault();
                          const next =
                            order +
                            (event.key === "ArrowDown" ? 1 : -1) +
                            ABOUT_PAGE.marketIndexes.indexes.length;
                          const target =
                            ABOUT_PAGE.marketIndexes.indexes[
                              next % ABOUT_PAGE.marketIndexes.indexes.length
                            ];
                          setActiveIndex(target);
                          document
                            .getElementById(
                              `market-indexes-tab-${ABOUT_PAGE.marketIndexes.indexes.indexOf(target)}`,
                            )
                            ?.focus();
                        }}
                        role="tab"
                        tabIndex={selected ? 0 : -1}
                        type="button"
                      >
                        {index.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div
                aria-labelledby={`market-indexes-tab-${ABOUT_PAGE.marketIndexes.indexes.indexOf(activeIndex)}`}
                className="sm:col-span-3"
                id="market-indexes-panel"
                role="tabpanel"
              >
                {/* All four previews stack in one grid cell so the panel's
                    height never changes — a 250ms opacity+blur crossfade
                    swaps them without reflowing the page. Hidden panels
                    drop out via aria-hidden, pointer-events and tabIndex
                    rather than visibility, so the a11y tree stays right
                    during the fade. */}
                <div className="grid">
                  {ABOUT_PAGE.marketIndexes.indexes.map((index) => {
                    const selected = index.name === activeIndex.name;
                    return (
                      <div
                        aria-hidden={!selected}
                        className={cn(
                          "col-start-1 row-start-1 transition-[opacity,filter] duration-250 ease-in-out motion-reduce:transition-none",
                          selected
                            ? "opacity-100 blur-none"
                            : "pointer-events-none opacity-0 blur-[2px]",
                        )}
                        key={index.name}
                      >
                        <a
                          aria-label={`Visit the ${index.name}`}
                          className="group block overflow-hidden rounded-2xl border border-border bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                          href={index.href}
                          rel="noopener noreferrer"
                          tabIndex={selected ? 0 : -1}
                          target="_blank"
                        >
                          <span className="relative block">
                            <img
                              alt={index.shotAlt}
                              className="aspect-[1346/1169] w-full object-cover object-top"
                              decoding="async"
                              height={1169}
                              loading="lazy"
                              src={index.shot}
                              width={1346}
                            />
                            <span className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-(--radius-full) bg-background/90 px-4 py-2 font-medium text-sm leading-5 shadow-sm backdrop-blur transition-opacity duration-200 group-focus-visible:opacity-100 motion-reduce:transition-none sm:opacity-0 sm:group-hover:opacity-100">
                              Visit index
                              <ArrowUpRight aria-hidden size={16} />
                            </span>
                          </span>
                        </a>
                        <p className="mt-4 text-secondary-foreground text-sm leading-5">
                          {index.description}
                          {index.beta ? (
                            <Badge
                              className="ml-2 align-middle"
                              size="sm"
                              variant="outline"
                            >
                              Beta
                            </Badge>
                          ) : null}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
          <section
            aria-labelledby="parent-company-heading"
            className={cn(
              "rounded-3xl border border-border bg-muted p-4 sm:p-12",
              REVEAL,
              pageIsRevealed && REVEALED,
            )}
            style={{
              transitionDelay: pageIsRevealed ? "240ms" : "0ms",
            }}
          >
            <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2 sm:gap-16">
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex flex-col gap-2 sm:gap-4">
                  <h2
                    className="font-medium text-secondary-foreground text-sm leading-5 uppercase"
                    id="parent-company-heading"
                  >
                    {ABOUT_PAGE.parentCompany.label}
                  </h2>
                  <img
                    alt={ABOUT_PAGE.parentCompany.logoAlt}
                    className="h-8 w-auto max-w-full self-start object-contain sm:h-12"
                    src={ABOUT_PAGE.parentCompany.logoSrc}
                  />
                </div>
                <p className="text-base leading-6 sm:text-lg sm:leading-7">
                  <Segments segments={ABOUT_PAGE.parentCompany.body} />
                </p>
              </div>
              {/* Figma insets the card's slot 16px horizontally on small
                  viewports and 24/8px on wide ones; `padding={false}` hands
                  the insets to the list. */}
              <Card padding={false}>
                <ul className="flex flex-col px-4 sm:px-6 sm:py-2">
                  {ABOUT_PAGE.milestones.map((milestone) => (
                    <li
                      className="flex flex-col gap-1 border-border border-b py-6 last:border-b-0 sm:flex-row sm:items-start sm:gap-6"
                      key={milestone.date}
                    >
                      <div className="sm:w-24 sm:shrink-0">
                        <p className="font-semibold text-base leading-6">
                          {milestone.date}
                        </p>
                        {milestone.status ? (
                          <p className="text-secondary-foreground text-xs leading-4">
                            {milestone.status}
                          </p>
                        ) : null}
                      </div>
                      <p className="flex-1 text-base leading-6">
                        <Segments segments={milestone.body} />
                      </p>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </section>
        </div>
      </main>
      <Footer {...AUCTION_FOOTER} />
    </div>
  );
}

export { AboutPage };
