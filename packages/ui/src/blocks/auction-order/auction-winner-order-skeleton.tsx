import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type AuctionWinnerOrderSkeletonProps = {
  /** What is loading, in the consumer's words; the status's name. */
  label: string;
  /** The breadcrumb the page already knows; a placeholder line when omitted. */
  breadcrumbs?: ReactNode;
  className?: string;
};

/**
 * AuctionWinnerOrder's own layout, drawn while the order is read: breadcrumb,
 * title, then the progress, note and lot cards beside the summary card. One
 * busy status carries the label, so a reader hears one line rather than a
 * status per placeholder.
 */
function AuctionWinnerOrderSkeleton({
  label,
  breadcrumbs,
  className,
}: AuctionWinnerOrderSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label={label}
      className={cn(
        "mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pt-6 pb-16 sm:gap-12 sm:px-8 sm:pt-8",
        className,
      )}
      data-slot="winner-order-skeleton"
      role="status"
    >
      {breadcrumbs ?? (
        <Skeleton aria-hidden="true" className="h-5 w-56" shape="line" />
      )}
      <Skeleton
        aria-hidden="true"
        className="h-9 w-72 max-w-full"
        shape="line"
      />
      <div className="grid w-full items-start gap-6 grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
        <VStack className="min-w-0 w-full" gap="lg" hAlign="stretch">
          <Skeleton aria-hidden="true" className="h-44" />
          <Skeleton aria-hidden="true" className="h-24" />
          <Skeleton aria-hidden="true" className="h-64" />
        </VStack>
        <Skeleton aria-hidden="true" className="h-96" />
      </div>
    </div>
  );
}

export type { AuctionWinnerOrderSkeletonProps };
export { AuctionWinnerOrderSkeleton };
