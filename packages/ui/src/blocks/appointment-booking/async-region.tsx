import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ReactNode } from "react";
import type { AsyncState } from "../shared/async";
import { AsyncMessage } from "../shared/async-message";

const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f"] as const;

type AsyncRegionProps<T> = {
  state: AsyncState<T>;
  slot: string;
  skeletons?: number;
  children: (data: T) => ReactNode;
};

/** One region's async boundary: skeletons, the consumer's empty or error
 * message, or the body. Internal. */
function AsyncRegion<T>({
  state,
  slot,
  skeletons = 3,
  children,
}: AsyncRegionProps<T>) {
  if (state.status === "loading") {
    return (
      <VStack data-slot={`${slot}-loading`} gap="sm" hAlign="stretch">
        {SKELETON_KEYS.slice(0, skeletons).map((key) => (
          <Skeleton className="h-12 w-full" key={key} />
        ))}
      </VStack>
    );
  }
  if (state.status === "ready") {
    return <>{children(state.data)}</>;
  }
  return (
    <AsyncMessage
      action={state.action}
      message={state.message}
      slot={`${slot}-${state.status}`}
    />
  );
}

export { AsyncRegion };
