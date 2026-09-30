import {
  Card,
  CardContent,
} from "@grade10/design-system/components/display/card";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { VStack } from "@grade10/design-system/components/layout/vstack";

type FactCardSkeletonCopy = {
  /** What is loading, in the consumer's words; the status's name. */
  label: string;
};

type FactCardSkeletonProps = {
  copy: FactCardSkeletonCopy;
  /** The cards the read will fill; one at least. */
  count: number;
  /** The `data-slot` the consumer finds the status by; the design system
   * stack's own `stack` when omitted. */
  slot?: string;
  className?: string;
};

/**
 * The cards a read will fill, drawn as placeholders while it runs: one busy
 * status named for what is loading, so a screen reader hears one line rather
 * than a status per placeholder. A count below one is the caller's mistake
 * and is refused by name, so a page never waits on an empty status.
 */
function FactCardSkeleton({
  copy,
  count,
  slot,
  className,
}: FactCardSkeletonProps) {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(
      `FactCardSkeleton: a count of ${count} draws no card; give one at least`,
    );
  }

  return (
    <VStack
      aria-busy="true"
      aria-label={copy.label}
      className={className}
      data-slot={slot ?? "stack"}
      gap="md"
      role="status"
    >
      {Array.from({ length: count }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: placeholders are a fixed count, never reordered.
        <Card key={index}>
          <CardContent>
            <VStack gap="sm">
              <Skeleton aria-hidden="true" className="w-1/3" shape="line" />
              <Skeleton aria-hidden="true" shape="line" />
              <Skeleton aria-hidden="true" className="w-1/2" shape="line" />
            </VStack>
          </CardContent>
        </Card>
      ))}
    </VStack>
  );
}

export type { FactCardSkeletonCopy, FactCardSkeletonProps };
export { FactCardSkeleton };
