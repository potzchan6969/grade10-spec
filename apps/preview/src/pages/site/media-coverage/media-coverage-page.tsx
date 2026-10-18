import { Card } from "@grade10/design-system/components/display/card";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { cn } from "@grade10/design-system/lib/utils";
import { SiteHeader } from "@grade10/ui";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useLayoutEffect, useState } from "react";
import { AUCTION_SITE_HEADER } from "../../auction-lot-details-content";
import { AUCTION_FOOTER } from "../../store-content";
import { MEDIA_COVERAGE_PAGE, type MediaItem } from "./media-coverage-content";

// The same enter reveal the About page uses: a 400ms rise-and-focus
// that reduced-motion visitors skip entirely.
const REVEAL =
  "translate-y-3 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:filter-none motion-reduce:transition-none";
const REVEALED = "translate-y-0 opacity-100 filter-none";

/**
 * One media card: the whole card is the external link. The frame's Card
 * instance is restyled past the published set — `radius-3xl`, `gap-6`
 * padding, `size-56` minimum height, `border-strong` on hover — so the
 * overrides live here until design settles the contract. Every card
 * holds one height: the publication truncates to one line and the title
 * clamps at four, so a longer CMS entry ends in an ellipsis rather than
 * a taller card.
 */
function MediaCard({ item }: { item: MediaItem }) {
  return (
    <a
      className="block h-full"
      href={item.href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Card
        className="h-full min-h-56 rounded-3xl transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-border-strong"
        padding={false}
      >
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex flex-1 flex-col gap-2">
            <p className="truncate font-medium text-secondary-foreground text-xs uppercase leading-4">
              {item.publication}
            </p>
            <p className="line-clamp-4 font-medium text-card-foreground text-lg leading-7">
              {item.title}
            </p>
          </div>
          <div className="flex items-center justify-between text-primary">
            <p className="font-medium text-accent-foreground text-sm leading-5">
              Read article
            </p>
            <ArrowUpRight aria-hidden size={14} />
          </div>
        </div>
      </Card>
    </a>
  );
}

/**
 * The `/media-coverage` surface as the app assembles it: `SiteHeader`,
 * the Figma Media Coverage frame — heading block over the four-column
 * card grid — and `Footer`. No nav item is current — the entry point is
 * still undecided.
 */
function MediaCoveragePage() {
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
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-4 py-10 sm:px-6 sm:py-20">
          <div
            className={cn(
              "flex max-w-[720px] flex-col gap-4",
              REVEAL,
              pageIsRevealed && REVEALED,
            )}
          >
            <p className="font-medium text-secondary-foreground text-sm uppercase leading-5">
              {MEDIA_COVERAGE_PAGE.eyebrow}
            </p>
            <h1 className="font-semibold text-4xl leading-10 sm:text-7xl sm:leading-none">
              {MEDIA_COVERAGE_PAGE.heading}
            </h1>
            <p className="text-lg leading-7 sm:text-xl sm:leading-7">
              {MEDIA_COVERAGE_PAGE.intro}
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
            {MEDIA_COVERAGE_PAGE.items.map((item) => (
              <li key={item.href}>
                <MediaCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer {...AUCTION_FOOTER} />
    </div>
  );
}

export { MediaCoveragePage };
