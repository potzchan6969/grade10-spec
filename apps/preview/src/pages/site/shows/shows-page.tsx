import { Footer } from "@grade10/design-system/components/layout/footer";
import { ShowsPageBody, SiteHeader } from "@grade10/ui";
import { AUCTION_SITE_HEADER } from "../../auction-lot-details-content";
import { AUCTION_FOOTER } from "../../store-content";
import { SHOWS_COPY, SHOWS_PAGE } from "./shows-content";

// Month names as written in `UpcomingShow.month`.
const SHOW_MONTHS: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

/** The card lists upcoming shows — an entry whose month has already run
 * out drops off rather than reads as next. An unparsed month stays so the
 * list never silently empties on a typo. */
function isUpcomingShow(show: { month: string; year: string }) {
  const month = SHOW_MONTHS[show.month];
  if (month === undefined) return true;
  const shown = new Date(Number(show.year), month);
  const now = new Date();
  return shown >= new Date(now.getFullYear(), now.getMonth());
}

/**
 * The `/shows` surface as the app assembles it: `SiteHeader`, the
 * `ShowsPageBody` block over the shows still upcoming, and `Footer`.
 */
function ShowsPage() {
  // The card lists current and upcoming shows only — when every entry
  // has run its month out, the block leaves the hero entirely.
  const content = {
    ...SHOWS_PAGE,
    hero: {
      ...SHOWS_PAGE.hero,
      upcomingShows: SHOWS_PAGE.hero.upcomingShows.filter(isUpcomingShow),
    },
  };

  return (
    <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <SiteHeader
        {...AUCTION_SITE_HEADER}
        navItems={AUCTION_SITE_HEADER.navItems.map((item) => ({
          ...item,
          current: item.href === "/shows",
        }))}
      />
      <main className="w-full flex-1">
        <ShowsPageBody content={content} copy={SHOWS_COPY} />
      </main>
      <Footer {...AUCTION_FOOTER} />
    </div>
  );
}

export { ShowsPage };
