import { cn } from "@grade10/design-system/lib/utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Results grid with per-card Boneyard skeletons while `results` is loading and
 * a staggered blur-fade when ready tiles arrive. Replays on every
 * `loading → ready` transition, including the first paint. Load-more appends
 * only animate newly added tiles (quieter stagger), leaving settled tiles still.
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
  const [revealFromIndex, setRevealFromIndex] = useState(0);
  const [emptyRevealed, setEmptyRevealed] = useState(false);
  const [lastReadyCount, setLastReadyCount] = useState(0);
  const settledCountRef = useRef(0);
  const prevStatusRef = useRef(results.status);
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

  /* Layout before paint so appends don't flash as fully revealed for a frame. */
  useLayoutEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = status;

    if (status !== "ready") {
      setRevealed(false);
      if (status === "loading") {
        settledCountRef.current = 0;
        setRevealFromIndex(0);
      }
      return;
    }

    const count = readyCount ?? 0;
    const append =
      prevStatus === "ready" &&
      settledCountRef.current > 0 &&
      count > settledCountRef.current;

    setRevealFromIndex(append ? settledCountRef.current : 0);
    setRevealed(false);

    if (prefersReducedMotion()) {
      setRevealed(true);
      settledCountRef.current = count;
      return;
    }

    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        setRevealed(true);
        settledCountRef.current = count;
      });
    });

    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [status, readyCount]);

  useEffect(() => {
    if (status !== "empty") {
      setEmptyRevealed(false);
      return;
    }

    if (prefersReducedMotion()) {
      setEmptyRevealed(true);
      return;
    }

    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setEmptyRevealed(true));
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

  if (status === "empty") {
    return (
      <div
        className={cn(
          "translate-y-1 opacity-0",
          "transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
          "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
          emptyRevealed && "translate-y-0 opacity-100",
          className,
        )}
        data-revealed={emptyRevealed || undefined}
        data-slot="product-results-empty"
      >
        <AsyncMessage
          action={results.action}
          message={results.message}
          slot="results-empty"
        />
      </div>
    );
  }

  if (status === "error") {
    return (
      <AsyncMessage
        action={results.action}
        className={className}
        message={results.message}
        slot="results-error"
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
        revealFromIndex={revealFromIndex}
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
