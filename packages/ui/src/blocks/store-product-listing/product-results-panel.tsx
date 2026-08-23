import { cn } from "@grade10/design-system/lib/utils";
import { useEffect, useRef, useState } from "react";
import { AsyncMessage } from "../shared/async-message";
import type { ProductListCopy } from "./product-list";
import { DEFAULT_LOAD_MORE_SKELETON_COUNT, ProductList } from "./product-list";
import type { AsyncState, ProductSummary } from "./types";

/** What the panel's tiles say the same way. */
type ProductResultsPanelCopy = ProductListCopy;

const REVEAL_STAGGER_MS = 40;
const REVEAL_STAGGER_CAP = 8;

type ProductResultsPanelProps = {
  copy: ProductResultsPanelCopy;
  results: AsyncState<readonly ProductSummary[]>;
  onProductClick?: (productId: string) => void;
  onProductAction?: (productId: string) => void;
  /** When true, scrolling near the list end reports `onLoadMore`. */
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  /** Skeleton tile count while loading more; defaults to 10. */
  loadMoreSkeletonCount?: number;
  className?: string;
};

/**
 * Results grid with per-card Boneyard skeletons while `results` is loading and
 * a staggered blur-fade when ready tiles arrive. Replays on every
 * `loading → ready` transition, including the first paint.
 *
 * When `hasMore` is supplied, a sentinel near the list bottom reports
 * `onLoadMore` once per approach. While `loadingMore` is true, skeleton tiles
 * append below the resolved products.
 */
function ProductResultsPanel({
  copy,
  results,
  onProductClick,
  onProductAction,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
  loadMoreSkeletonCount = DEFAULT_LOAD_MORE_SKELETON_COUNT,
  className,
}: ProductResultsPanelProps) {
  const [revealed, setRevealed] = useState(false);
  const [lastReadyCount, setLastReadyCount] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const requestedAtCountRef = useRef<number | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  const status = results.status;
  const readyCount = status === "ready" ? results.data.length : null;

  useEffect(() => {
    if (readyCount !== null) {
      setLastReadyCount(readyCount);
    }
  }, [readyCount]);

  /* The entrance is keyed to the status alone. `results` is rebuilt on every
     render of the surface above, so an effect that watched it would cancel
     the frames this one is waiting on and leave the tiles at opacity 0. */
  useEffect(() => {
    if (status !== "ready") {
      setRevealed(false);
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setRevealed(true);
      return;
    }

    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setRevealed(true));
    });

    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [status]);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  /* One report per result set: what was asked for is remembered as the count
     the ask was made at, so a page that arrives — or a sentinel that comes
     back into view — is asked about again, and the same one never is. */
  useEffect(() => {
    if (!hasMore || loadingMore || status !== "ready") {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          !entry?.isIntersecting ||
          requestedAtCountRef.current === readyCount
        ) {
          return;
        }

        requestedAtCountRef.current = readyCount;
        onLoadMoreRef.current?.();
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, readyCount, status]);

  if (status === "empty" || status === "error") {
    return (
      <AsyncMessage
        action={results.action}
        className={className}
        message={results.message}
        slot={`results-${status}`}
      />
    );
  }

  const isLoading = status === "loading";

  return (
    <div
      aria-busy={isLoading || loadingMore || undefined}
      className={cn("relative w-full", className)}
      data-revealed={revealed || undefined}
      data-slot="product-results-panel"
    >
      <ProductList
        className="w-full"
        copy={copy}
        loadMoreSkeletonCount={loadMoreSkeletonCount}
        loading={isLoading}
        loadingMore={loadingMore}
        onProductAction={onProductAction}
        onProductClick={onProductClick}
        products={status === "ready" ? results.data : []}
        revealStaggerCap={REVEAL_STAGGER_CAP}
        revealStaggerMs={REVEAL_STAGGER_MS}
        revealed={!isLoading && revealed}
        skeletonCount={lastReadyCount > 0 ? lastReadyCount : undefined}
      />
      {hasMore && status === "ready" ? (
        <div
          aria-hidden
          className="h-px w-full"
          data-slot="product-results-load-sentinel"
          ref={sentinelRef}
        />
      ) : null}
    </div>
  );
}

export type { ProductResultsPanelCopy, ProductResultsPanelProps };
export { ProductResultsPanel };
