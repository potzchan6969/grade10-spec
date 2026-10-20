import { Badge } from "@grade10/design-system/components/display/badge";
import { Card } from "@grade10/design-system/components/display/card";
import {
  Tabs,
  TabsContent,
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
                  <p className="text-lg leading-7">
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
            <p className="font-medium text-secondary-foreground text-sm leading-5 uppercase">
              {ABOUT_PAGE.marketIndexes.label}
            </p>
            <h2
              className="font-semibold text-xl leading-7 sm:text-2xl sm:leading-8"
              id="market-indexes-heading"
            >
              {ABOUT_PAGE.marketIndexes.heading}
            </h2>
            <p className="max-w-prose text-lg leading-7">
              {ABOUT_PAGE.marketIndexes.body}
            </p>
            <Tabs
              className="mt-4 gap-6 sm:mt-6"
              defaultValue={ABOUT_PAGE.marketIndexes.indexes[0].name}
            >
              <div className="overflow-x-auto">
                <TabsList variant="pill">
                  {ABOUT_PAGE.marketIndexes.indexes.map((index, order) => (
                    <TabsTrigger key={index.name} value={index.name}>
                      <span className="text-secondary-foreground tabular-nums">
                        {String(order + 1).padStart(2, "0")}
                      </span>
                      {index.name}
                      {index.beta ? <Badge size="sm">Beta</Badge> : null}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {ABOUT_PAGE.marketIndexes.indexes.map((index) => (
                <TabsContent key={index.name} value={index.name}>
                  <a
                    aria-label={`Visit the ${index.name}`}
                    className="group block overflow-hidden rounded-2xl border border-border bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    href={index.href}
                    rel="noopener noreferrer"
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
                      <span className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-(--radius-full) bg-background/90 px-4 py-2 font-medium text-sm leading-5 opacity-0 shadow-sm backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                        Visit index
                        <ArrowUpRight aria-hidden size={16} />
                      </span>
                    </span>
                  </a>
                  <p className="mt-4 text-secondary-foreground text-sm leading-5">
                    {index.description}
                  </p>
                </TabsContent>
              ))}
            </Tabs>
          </section>
          <section
            aria-labelledby="parent-company-heading"
            className={cn(
              "rounded-3xl border border-border bg-muted p-6 sm:p-12",
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
                    className="h-8 w-auto self-start sm:h-12"
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
                      className="flex items-start gap-4 border-border border-b py-6 last:border-b-0 sm:gap-6"
                      key={milestone.date}
                    >
                      <div className="w-24 shrink-0">
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
