import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type AuctionRecordSkeletonProps = {
  /** What is loading, in the consumer's words; the status's name. */
  label: string;
  /** The breadcrumb the page already knows; a placeholder line when omitted. */
  breadcrumbs?: ReactNode;
  /** The rows the read will fill; four when omitted. */
  rows?: number;
  className?: string;
};

/**
 * AuctionRecord's own layout, drawn while the record is read: breadcrumb,
 * title, then the rows the table will fill. One busy status carries the
 * label, so a reader hears one line rather than a status per placeholder.
 */
function AuctionRecordSkeleton({
  label,
  breadcrumbs,
  rows = 4,
  className,
}: AuctionRecordSkeletonProps) {
  return (
    <VStack
      aria-busy="true"
      aria-label={label}
      className={cn(
        "mx-auto w-full max-w-7xl gap-12 overflow-x-clip px-4 pt-8 pb-16 sm:px-8",
        className,
      )}
      data-slot="auction-record-skeleton"
      hAlign="stretch"
      role="status"
    >
      {breadcrumbs ?? (
        <Skeleton aria-hidden="true" className="h-5 w-48" shape="line" />
      )}
      <Skeleton aria-hidden="true" className="h-8 w-56" shape="line" />
      <VStack className="w-full" gap="md" hAlign="stretch">
        <Skeleton aria-hidden="true" className="h-5" shape="line" />
        {Array.from({ length: rows }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: placeholders are a fixed count, never reordered.
          <Skeleton key={index} aria-hidden="true" className="h-20" />
        ))}
      </VStack>
    </VStack>
  );
}

export type { AuctionRecordSkeletonProps };
export { AuctionRecordSkeleton };
