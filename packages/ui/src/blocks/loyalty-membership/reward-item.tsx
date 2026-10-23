import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { ClockCountdown } from "@phosphor-icons/react";
import { RewardArt } from "./reward-art";
import type { RewardMenuItem } from "./types";

type RewardItemProps = {
  item: RewardMenuItem;
  /** Read off the balance the consumer supplies; never derived here. */
  affordable: boolean;
  /** A press reports the reward's id; it never redeems. */
  onSelect: (rewardId: string) => void;
  /** How a point count reads — "4,000". */
  pointCount: (points: number) => string;
  /** The unit points are counted in — "pts". */
  points: string;
  className?: string;
};

/** One reward card: the item's art or the coupon's gift tile, the name, the
 * description, the deadline where named, and the price in points. */
function RewardItem({
  item,
  affordable,
  onSelect,
  pointCount,
  points,
  className,
}: RewardItemProps) {
  return (
    <Card className={cn("w-full border-border", className)} padding={false}>
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
                size="xs"
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
                size="xs"
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

export type { RewardItemProps };
export { RewardItem };
