import { cn } from "@grade10/design-system/lib/utils";
import { useEffect, useRef, useState } from "react";
import { AsyncMessage } from "../shared/async-message";
import { ProductList } from "./product-list";
import type { AsyncState, ProductSummary } from "./types";

const REVEAL_STAGGER_MS = 40;
const REVEAL_STAGGER_CAP = 8;

type ProductResultsPanelProps = {
  results: AsyncState<readonly ProductSummary[]>;
  onProductClick?: (productId: string) => void;
  onProductAction?: (productId: string) => void;
  className?: string;
};

/**
 * Results grid with per-card Boneyard skeletons while `results` is loading and
 * a staggered blur-fade when ready tiles arrive. Replays on every
 * `loading → ready` transition, including the first paint.
 */
function ProductResultsPanel({
  results,
  onProductClick,
  onProductAction,
  className,
}: ProductResultsPanelProps) {
  const [revealed, setRevealed] = useState(false);
  const shouldRevealRef = useRef(true);
  const [lastReadyCount, setLastReadyCount] = useState(0);

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
      aria-busy={isLoading || undefined}
      className={cn("relative w-full", className)}
      data-revealed={revealed || undefined}
      data-slot="product-results-panel"
    >
      <ProductList
        className="w-full"
        loading={isLoading}
        onProductAction={onProductAction}
        onProductClick={onProductClick}
        products={results.status === "ready" ? results.data : []}
        revealStaggerCap={REVEAL_STAGGER_CAP}
        revealStaggerMs={REVEAL_STAGGER_MS}
        revealed={!isLoading && revealed}
        skeletonCount={lastReadyCount > 0 ? lastReadyCount : undefined}
      />
    </div>
  );
}

export type { ProductResultsPanelProps };
export { ProductResultsPanel };
