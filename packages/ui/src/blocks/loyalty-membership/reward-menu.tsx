import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { AsyncState } from "../shared/async";
import { AsyncMessage } from "../shared/async-message";
import { RewardItem } from "./reward-item";
import type { RewardMenuItem } from "./types";

/** The words the menu says, whatever rewards are on it. */
type RewardMenuCopy = {
  /** Accessible name of the menu. */
  label: string;
  /** The unit points are counted in — "pts". */
  points: string;
  /** How a point count reads — "4,000". */
  pointCount: (points: number) => string;
};

type RewardMenuProps = {
  copy: RewardMenuCopy;
  state: AsyncState<readonly RewardMenuItem[]>;
  /** Redeemable points, which affordability is judged against. */
  balance: number;
  /** A press on a card reports the reward's id; it never redeems. */
  onSelect: (rewardId: string) => void;
  className?: string;
};

/**
 * The reward shop: one card per reward — the item's art or the coupon's gift
 * tile, the name, the description, the deadline where the reward names one,
 * and the price in points. A press reports the reward through `onSelect` and
 * performs no redemption; `RewardCheckout` confirms the cost and settles.
 * Whether the balance can pay is judged here against the supplied balance,
 * so a story can reach every state without a programme behind it.
 */
function RewardMenu({
  copy,
  state,
  balance,
  onSelect,
  className,
}: RewardMenuProps) {
  return (
    <VStack
      className={cn("w-full", className)}
      data-slot="reward-menu"
      gap="sm"
    >
      {state.status === "loading" ? (
        <VStack className="gap-3" data-slot="reward-menu-loading">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </VStack>
      ) : null}
      {state.status === "empty" || state.status === "error" ? (
        <AsyncMessage
          action={state.action}
          message={state.message}
          slot={`reward-menu-${state.status}`}
        />
      ) : null}
      {state.status === "ready" ? (
        <List aria-label={copy.label}>
          {state.data.map((item) => (
            <ListItem className="px-0 py-2" divider={false} key={item.id}>
              <RewardItem
                affordable={item.pointCost <= balance}
                item={item}
                onSelect={onSelect}
                pointCount={copy.pointCount}
                points={copy.points}
              />
            </ListItem>
          ))}
        </List>
      ) : null}
    </VStack>
  );
}

export type { RewardMenuCopy, RewardMenuProps };
export { RewardMenu };
