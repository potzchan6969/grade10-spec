import { Card } from "@grade10/design-system/components/display/card";
import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { ClockCountdown } from "@phosphor-icons/react";
import type { AsyncState } from "../shared/async";
import { AsyncMessage } from "../shared/async-message";
import { RewardArt } from "./reward-art";
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
    <VStack className={className} data-slot="reward-menu" gap="sm">
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
              <RewardCard
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

function RewardCard({
  item,
  affordable,
  onSelect,
  pointCount,
  points,
}: {
  item: RewardMenuItem;
  affordable: boolean;
  onSelect: (rewardId: string) => void;
  pointCount: (points: number) => string;
  points: string;
}) {
  return (
    <Card className="border-border" padding={false}>
      <button
        className="flex w-full cursor-pointer items-center gap-4 p-4 text-left transition-colors hover:bg-background-subtle"
        data-affordable={affordable}
        data-slot="reward-menu-item"
        onClick={() => onSelect(item.id)}
        type="button"
      >
        <RewardArt className="size-16 shrink-0" reward={item} />
        <VStack className="min-w-0 flex-1" gap="xs">
          <VStack gap="none">
            <Text weight="medium">{item.name}</Text>
            {item.description ? (
              <Text
                className="line-clamp-2 text-secondary-foreground"
                size="sm"
              >
                {item.description}
              </Text>
            ) : null}
          </VStack>
          {item.deadline ? (
            <HStack data-slot="reward-menu-deadline" gap="xs" vAlign="center">
              <span className="shrink-0 text-accent-foreground">
                <ClockCountdown aria-hidden size={14} />
              </span>
              <Text
                className="text-accent-foreground"
                size="sm"
                weight="medium"
              >
                {item.deadline}
              </Text>
            </HStack>
          ) : null}
        </VStack>
        <VStack
          className="shrink-0 items-end justify-center text-right"
          data-slot="reward-menu-price"
          gap="none"
        >
          <Text className="font-semibold">{pointCount(item.pointCost)}</Text>
          <Text className="text-secondary-foreground" size="sm">
            {points}
          </Text>
        </VStack>
      </button>
    </Card>
  );
}

export type { RewardMenuCopy, RewardMenuProps };
export { RewardMenu };
