import { cn } from "@grade10/design-system/lib/utils";
import { useEffect, useRef, useState } from "react";
import { AsyncMessage } from "../shared/async-message";
import {
  DEFAULT_LOAD_MORE_SKELETON_COUNT,
  ProductList,
} from "./product-list";
import type { AsyncState, ProductSummary } from "./types";

const REVEAL_STAGGER_MS = 40;
const REVEAL_STAGGER_CAP = 8;

type ProductResultsPanelProps = {
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
  const shouldRevealRef = useRef(true);
  const [lastReadyCount, setLastReadyCount] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMorePendingRef = useRef(false);

  useEffect(() => {
    if (results.status === "loading") {
      shouldRevealRef.current = true;
      setRevealed(false);
      return;
    }

    if (results.status === "ready") {
      setLastReadyCount(results.data.length);
    }

    if (results.status !== "ready" || !shouldRevealRef.current) {
      return;
    }

    shouldRevealRef.current = false;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setRevealed(true);
      return;
    }

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealed(true));
    });

    return () => cancelAnimationFrame(frame);
  }, [results]);

  useEffect(() => {
    loadMorePendingRef.current = false;
  }, [results, hasMore]);

  useEffect(() => {
    if (
      !hasMore ||
      !onLoadMore ||
      loadingMore ||
      results.status !== "ready"
    ) {
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
          loadMorePendingRef.current ||
          loadingMore
        ) {
          return;
        }

        loadMorePendingRef.current = true;
        onLoadMore();
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, onLoadMore, results]);

  if (results.status === "empty" || results.status === "error") {
    return (
      <AsyncMessage
        action={results.action}
        className={className}
        message={results.message}
        slot={`results-${results.status}`}
      />
    );
  }

  const isLoading = results.status === "loading";

  return (
    <div
      aria-busy={isLoading || loadingMore || undefined}
      className={cn("relative w-full", className)}
      data-revealed={revealed || undefined}
      data-slot="product-results-panel"
    >
      <ProductList
        className="w-full"
        loadMoreSkeletonCount={loadMoreSkeletonCount}
        loading={isLoading}
        loadingMore={loadingMore}
        onProductAction={onProductAction}
        onProductClick={onProductClick}
        products={results.status === "ready" ? results.data : []}
        revealStaggerCap={REVEAL_STAGGER_CAP}
        revealStaggerMs={REVEAL_STAGGER_MS}
        revealed={!isLoading && revealed}
        skeletonCount={lastReadyCount > 0 ? lastReadyCount : undefined}
      />
      {hasMore && results.status === "ready" ? (
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

export type { ProductResultsPanelProps };
export { ProductResultsPanel };
