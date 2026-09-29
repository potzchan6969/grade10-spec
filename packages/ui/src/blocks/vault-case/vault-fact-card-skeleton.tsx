import {
  Card,
  CardContent,
} from "@grade10/design-system/components/display/card";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { VStack } from "@grade10/design-system/components/layout/vstack";

type VaultFactCardSkeletonCopy = {
  /** What is loading, in the consumer's words; the status's name. */
  label: string;
};

type VaultFactCardSkeletonProps = {
  copy: VaultFactCardSkeletonCopy;
  /** The cards the read will fill; one at least. */
  count: number;
  className?: string;
};

/**
 * The cards a read will fill, drawn as placeholders while it runs: one busy
 * status named for what is loading, so a screen reader hears one line rather
 * than a status per placeholder. A count below one is the caller's mistake
 * and is refused by name, so a page never waits on an empty status.
 */
function VaultFactCardSkeleton({
  copy,
  count,
  className,
}: VaultFactCardSkeletonProps) {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(
      `VaultFactCardSkeleton: a count of ${count} draws no card; give one at least`,
    );
  }

  return (
    <VStack
      aria-busy="true"
      aria-label={copy.label}
      className={className}
      gap="md"
      role="status"
    >
      {Array.from({ length: count }, (_, slot) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: the key is the slot; placeholders are a fixed count, never reordered.
        <Card key={slot}>
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

export type { VaultFactCardSkeletonCopy, VaultFactCardSkeletonProps };
export { VaultFactCardSkeleton };
