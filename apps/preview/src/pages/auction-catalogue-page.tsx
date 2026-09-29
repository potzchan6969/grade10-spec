import { Footer } from "@grade10/design-system/components/layout/footer";
import { Toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import {
  FeaturedAuctionsBanner,
  type FeaturedAuctionsBannerCopy,
  type FeaturedAuctionsBannerSlide,
  SiteHeader,
} from "@grade10/ui";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AuctionCatalogueAllAuctionsGrid } from "./auction-catalogue-all-auctions";
import {
  AuctionCategoryButton,
  AuctionLotCard,
  FeaturedAuctions,
  FeaturedAuctionsPair,
} from "./auction-catalogue-card";
import {
  CATALOGUE_CANONICAL,
  CATALOGUE_DESCRIPTION,
  CATALOGUE_IMAGE,
  CATALOGUE_TITLE,
  type CatalogueLot,
  type CatalogueStatus,
  COLLECTION_LOTS,
  FEATURED_BANNER_FRONT_PAGE,
} from "./auction-catalogue-content";
import { AUCTION_SITE_HEADER } from "./auction-lot-details-content";
import { AUCTION_FOOTER } from "./store-content";

const FEATURED_CAP = 4;
/** Featured carousel holds at most three complete slides. */
const FEATURED_BANNER_CAP = 3;
/** Matches the Product List workbench filter refetch beat. */
const FILTER_LOAD_MS = 450;
const DEFAULT_SKELETON_COUNT = 6;
const SKELETON_FIXTURE_LOT = COLLECTION_LOTS[0];

const FEATURED_BANNER_COPY: FeaturedAuctionsBannerCopy = {
  active: "LIVE BIDDING",
  upcoming: "UPCOMING",
  ended: "ENDED",
  currentBid: "CURRENT BID",
  startingBid: "STARTING BID",
  finalBid: "FINAL BID",
  bidNow: "Bid Now",
  viewAuction: "View Auction",
  endsIn: "Ends in",
  opensIn: "Opens in",
  endedAt: "Ended",
  progress: "Featured lots",
  slide: "Show featured lot {position}: {title}",
  previous: "Previous featured lot",
  next: "Next featured lot",
};

function toFeaturedSlide(lot: CatalogueLot): FeaturedAuctionsBannerSlide {
  const status =
    lot.status === "Upcoming"
      ? "upcoming"
      : lot.status === "Ended"
        ? "ended"
        : "active";
  return {
    id: lot.id,
    title: lot.title,
    status,
    // Preview demo: bronze front page on the stage; lot photo as gallery
    // fallback if that asset fails to load.
    imageSrc: FEATURED_BANNER_FRONT_PAGE,
    imageAlt: lot.imageAlt,
    fallbackImageSrc: lot.imageSrc,
    href: lotAddress(lot),
    currentBidMinor: lot.currentBidMinor,
    currency: lot.currency,
    countdown:
      lot.status === "Ended"
        ? undefined
        : {
            kind: lot.status === "Upcoming" ? "opens" : "ends",
            atMs: Date.parse(
              lot.status === "Upcoming" ? lot.startsAt : lot.closesAt,
            ),
          },
  };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function rank(status: CatalogueStatus): number {
  if (status === "Active") return 0;
  if (status === "Upcoming") return 1;
  return 2;
}

function byCatalogueOrder(lots: readonly CatalogueLot[]): CatalogueLot[] {
  return [...lots].sort((a, b) => {
    const status = rank(a.status) - rank(b.status);
    if (status !== 0) return status;
    if (a.status === "Ended") return b.closesAt.localeCompare(a.closesAt);
    if (a.status === "Upcoming") return a.startsAt.localeCompare(b.startsAt);
    return a.closesAt.localeCompare(b.closesAt);
  });
}

function lotAddress(lot: CatalogueLot): string {
  return `https://grade10.com/auction/listings/${lot.slug}`;
}

type AuctionCataloguePageProps = {
  lots: readonly CatalogueLot[];
  /**
   * Featured band layout. `banner` is the live full-width carousel (muted copy
   * + front page image stage). `row` and `pair` are archived explorations.
   */
  featuredLayout?: "row" | "pair" | "banner";
  /** When false, the All Auctions block shows only the lot grid. */
  showCategories?: boolean;
};

function AuctionCataloguePage({
  lots,
  featuredLayout = "row",
  showCategories = true,
}: AuctionCataloguePageProps) {
  const ordered = useMemo(() => byCatalogueOrder(lots), [lots]);
  const live = ordered.filter((lot) => lot.status !== "Ended");
  const featuredCap =
    featuredLayout === "banner" ? FEATURED_BANNER_CAP : FEATURED_CAP;
  const featured = live.slice(0, featuredCap);
  const featuredSlides = useMemo(
    () =>
      ordered
        .filter((lot) => lot.status !== "Ended")
        .slice(0, featuredCap)
        .map(toFeaturedSlide),
    [ordered, featuredCap],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [watched, setWatched] = useState<ReadonlySet<string>>(new Set());
  /** First paint + filter refetch — Product List workbench recipe. */
  const [pageStatus, setPageStatus] = useState<"loading" | "ready">("loading");
  const [filterStatus, setFilterStatus] = useState<"ready" | "loading">(
    "ready",
  );
  const [pageRevealed, setPageRevealed] = useState(false);
  const [listRevealed, setListRevealed] = useState(false);
  const [skeletonCount, setSkeletonCount] = useState(DEFAULT_SKELETON_COUNT);
  const filterBootstrapped = useRef(false);

  const categories = useMemo(() => {
    const seen = new Map<
      string,
      { id: string; name: string; cover: CatalogueLot; lots: CatalogueLot[] }
    >();
    for (const lot of ordered) {
      if (lot.status === "Ended") continue;
      const current = seen.get(lot.categoryId);
      if (current) {
        current.lots.push(lot);
      } else {
        seen.set(lot.categoryId, {
          id: lot.categoryId,
          name: lot.category,
          cover: lot,
          lots: [lot],
        });
      }
    }
    return [...seen.values()];
  }, [ordered]);

  const listed = selectedId
    ? ordered.filter((lot) => lot.categoryId === selectedId)
    : ordered;

  // biome-ignore lint/correctness/useExhaustiveDependencies: the page's first load runs once, on mount.
  useEffect(() => {
    setPageStatus("loading");
    setPageRevealed(false);
    setListRevealed(false);
    setSkeletonCount(
      Math.max(
        ordered.filter((lot) => lot.status !== "Ended").length,
        DEFAULT_SKELETON_COUNT,
      ),
    );
    const timeout = window.setTimeout(() => {
      setPageStatus("ready");
    }, FILTER_LOAD_MS);
    return () => window.clearTimeout(timeout);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: a reload is keyed on the chosen category alone; the count is read at that moment.
  useEffect(() => {
    if (!filterBootstrapped.current) {
      filterBootstrapped.current = true;
      return;
    }

    setSkeletonCount(Math.max(listed.length, DEFAULT_SKELETON_COUNT));
    setFilterStatus("loading");
    setListRevealed(false);
    const timeout = window.setTimeout(() => {
      setFilterStatus("ready");
    }, FILTER_LOAD_MS);
    return () => window.clearTimeout(timeout);
  }, [selectedId]);

  useLayoutEffect(() => {
    if (pageStatus !== "ready") {
      setPageRevealed(false);
      setListRevealed(false);
      return;
    }

    if (prefersReducedMotion()) {
      setPageRevealed(true);
      setListRevealed(true);
      return;
    }

    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        setPageRevealed(true);
        setListRevealed(true);
      });
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [pageStatus]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: selectedId re-runs the reveal for each new category.
  useLayoutEffect(() => {
    if (filterStatus !== "ready" || pageStatus !== "ready") {
      if (filterStatus === "loading") setListRevealed(false);
      return;
    }

    if (!filterBootstrapped.current) return;

    if (prefersReducedMotion()) {
      setListRevealed(true);
      return;
    }

    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setListRevealed(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [filterStatus, pageStatus, selectedId]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = CATALOGUE_TITLE;

    const description = document.createElement("meta");
    description.name = "description";
    description.content = CATALOGUE_DESCRIPTION;
    description.dataset.auctionCatalogue = "";
    document.head.append(description);

    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = CATALOGUE_CANONICAL;
    canonical.dataset.auctionCatalogue = "";
    document.head.append(canonical);

    return () => {
      document.title = previousTitle;
      description.remove();
      canonical.remove();
    };
  }, []);

  const jsonLd =
    selectedId === null && ordered.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: ordered.map((lot, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Thing",
              name: lot.title,
              url: lotAddress(lot),
              image: CATALOGUE_IMAGE,
              description: `${lot.status}. Closes ${lot.closeLabel}. Current bid ${lot.bidLabel}.`,
            },
          })),
        }
      : null;

  function toggleWatch(id: string) {
    setWatched((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleCategory(id: string) {
    setSelectedId((current) => (current === id ? null : id));
  }

  const pageLoading = pageStatus === "loading";
  const listLoading = pageLoading || filterStatus === "loading";

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
      <Toast position="bottom-right" />
      {jsonLd ? (
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialised from the page's own lots, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type="application/ld+json"
        />
      ) : null}
      <SiteHeader {...AUCTION_SITE_HEADER} />
      <main className="w-full flex-1">
        <h1 className="sr-only">Auctions</h1>

        {featured.length > 0 ? (
          featuredLayout === "banner" ? (
            <FeaturedAuctionsBanner
              copy={FEATURED_BANNER_COPY}
              slides={featuredSlides}
            />
          ) : featuredLayout === "pair" ? (
            <FeaturedAuctionsPair
              lots={featured}
              onToggle={toggleWatch}
              watched={watched}
            />
          ) : (
            <FeaturedAuctions
              loading={pageLoading}
              lots={featured}
              onToggle={toggleWatch}
              revealed={pageRevealed}
              watched={watched}
            />
          )
        ) : null}

        <div className="w-full px-4 pt-16 pb-16 sm:px-8 lg:px-12">
          <section aria-labelledby="all-auctions" className="min-w-0">
            <h2
              className={cn(
                "text-2xl font-semibold text-foreground",
                "translate-y-3 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:filter-none motion-reduce:transition-none",
                pageRevealed && "translate-y-0 opacity-100 filter-none",
              )}
              id="all-auctions"
            >
              All Auctions
            </h2>
            {listed.length === 0 &&
            (!showCategories || categories.length === 0) &&
            !pageLoading ? (
              <p className="mt-8 max-w-prose text-base text-foreground">
                There are no auctions.
              </p>
            ) : (
              <div
                className={
                  showCategories && categories.length > 0
                    ? "mt-8 flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-12"
                    : "mt-8"
                }
              >
                {showCategories && categories.length > 0 ? (
                  <nav
                    aria-label="Categories"
                    className={cn(
                      "flex gap-2 overflow-x-auto overscroll-x-contain lg:grid lg:grid-cols-2 lg:gap-2 lg:overflow-visible lg:self-start",
                      "translate-y-3 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:filter-none motion-reduce:transition-none",
                      pageRevealed && "translate-y-0 opacity-100 filter-none",
                    )}
                    style={{
                      transitionDelay: pageRevealed ? "40ms" : "0ms",
                    }}
                  >
                    {categories.map((category) => (
                      <div
                        className="w-36 shrink-0 lg:w-auto lg:shrink"
                        key={category.id}
                      >
                        <AuctionCategoryButton
                          name={category.name}
                          onSelect={() => toggleCategory(category.id)}
                          selected={selectedId === category.id}
                        />
                      </div>
                    ))}
                  </nav>
                ) : null}
                {listLoading ? (
                  <ul
                    aria-busy="true"
                    aria-label="Loading auctions"
                    className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-12"
                  >
                    {Array.from({ length: skeletonCount }, (_, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: placeholders have no identity beyond position.
                      <li key={`auction-skeleton-${index}`}>
                        <AuctionLotCard
                          heading
                          loading
                          lot={SKELETON_FIXTURE_LOT}
                          onToggle={() => {}}
                          watched={false}
                        />
                      </li>
                    ))}
                  </ul>
                ) : listed.length === 0 ? (
                  <p className="max-w-prose text-base text-foreground">
                    There are no auctions in this category.
                  </p>
                ) : (
                  <AuctionCatalogueAllAuctionsGrid
                    lots={listed}
                    onToggle={toggleWatch}
                    revealed={listRevealed}
                    watched={watched}
                  />
                )}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer {...AUCTION_FOOTER} />
    </div>
  );
}

export { AuctionCataloguePage };
