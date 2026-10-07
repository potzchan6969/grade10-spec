import { cn } from "@grade10/design-system/lib/utils";
import { useEffect, useRef, useState } from "react";
import { AuctionLotCard } from "./auction-catalogue-card";
import {
  type CatalogueLot,
  COLLECTION_LOTS,
} from "./auction-catalogue-content";

/** First paint batch — two rows on the desktop 4-up grid. */
const PAGE_SIZE = 8;
/** One row of Boneyard cards while the next batch settles. */
const LOAD_MORE_SKELETON_COUNT = 4;
/** Matches the page enter / filter refetch beat. */
const LOAD_MORE_MS = 450;
const REVEAL_STAGGER_MS = 40;
const REVEAL_STAGGER_CAP = 8;
const SKELETON_FIXTURE_LOT = COLLECTION_LOTS[0];

/** One column below `sm`; column gap tracks page inset from `sm` up. */
const GRID_CLASS =
  "grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-12";

type AuctionCatalogueAllAuctionsGridProps = {
  lots: readonly CatalogueLot[];
  watched: ReadonlySet<string>;
  onToggle: (id: string) => void;
  /** Stagger reveal after page enter / filter settle. Default on. */
  revealed?: boolean;
  className?: string;
};

/**
 * Quiet All auctions lot grid with infinite scroll. Near the end of the
 * visible batch, loads the next page and appends Boneyard skeleton cards
 * until that batch arrives — same pattern as the store product listing.
 */
function AuctionCatalogueAllAuctionsGrid({
  lots,
  watched,
  onToggle,
  revealed = true,
  className,
}: AuctionCatalogueAllAuctionsGridProps) {
  const lotsKey = lots.map((lot) => lot.id).join("\0");
  const [gridState, setGridState] = useState(() => ({
    lotsKey,
    visibleCount: Math.min(PAGE_SIZE, lots.length),
    loadingMore: false,
  }));
  if (gridState.lotsKey !== lotsKey) {
    setGridState({
      lotsKey,
      visibleCount: Math.min(PAGE_SIZE, lots.length),
      loadingMore: false,
    });
  }
  const { loadingMore, visibleCount } = gridState;
  const sentinelRef = useRef<HTMLDivElement>(null);
  const requestedAtCountRef = useRef<number | null>(null);

  useEffect(() => {
    requestedAtCountRef.current = null;
  }, [lotsKey]);

  const visibleLots = lots.slice(0, visibleCount);
  const hasMore = visibleCount < lots.length;

  useEffect(() => {
    if (!loadingMore) return;
    const timer = window.setTimeout(() => {
      setGridState((current) => ({
        ...current,
        visibleCount: Math.min(current.visibleCount + PAGE_SIZE, lots.length),
        loadingMore: false,
      }));
    }, LOAD_MORE_MS);
    return () => window.clearTimeout(timer);
  }, [loadingMore, lots.length]);

  useEffect(() => {
    if (!hasMore || loadingMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (!entry.isIntersecting) {
          requestedAtCountRef.current = null;
          return;
        }
        if (requestedAtCountRef.current === visibleCount) return;
        requestedAtCountRef.current = visibleCount;
        setGridState((current) => ({ ...current, loadingMore: true }));
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, visibleCount]);

  return (
    <div className={cn("min-w-0", className)}>
      <ul
        aria-busy={loadingMore || undefined}
        aria-label={loadingMore ? "Loading more auctions" : undefined}
        className={GRID_CLASS}
        data-revealed={revealed || undefined}
      >
        {visibleLots.map((lot, index) => (
          <li
            className={cn(
              "translate-y-3 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:filter-none motion-reduce:transition-none",
              revealed && "translate-y-0 opacity-100 filter-none",
            )}
            key={lot.id}
            style={{
              transitionDelay: revealed
                ? `${Math.min(index, REVEAL_STAGGER_CAP) * REVEAL_STAGGER_MS}ms`
                : "0ms",
            }}
          >
            <AuctionLotCard
              heading
              lot={lot}
              onToggle={() => onToggle(lot.id)}
              watched={watched.has(lot.id)}
            />
          </li>
        ))}
        {loadingMore
          ? Array.from({ length: LOAD_MORE_SKELETON_COUNT }, (_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: placeholders have no identity beyond position.
              <li key={`auction-load-more-skeleton-${index}`}>
                <AuctionLotCard
                  heading
                  loading
                  lot={SKELETON_FIXTURE_LOT}
                  onToggle={() => {}}
                  watched={false}
                />
              </li>
            ))
          : null}
      </ul>
      {hasMore ? (
        <div
          aria-hidden="true"
          className="h-px w-full"
          data-slot="all-auctions-load-more-sentinel"
          ref={sentinelRef}
        />
      ) : null}
    </div>
  );
}

export { AuctionCatalogueAllAuctionsGrid, LOAD_MORE_SKELETON_COUNT, PAGE_SIZE };
