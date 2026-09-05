import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { StepperInput } from "@grade10/design-system/components/forms/stepper-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { AsyncState } from "../shared/async";
import { AsyncMessage } from "../shared/async-message";
import type { RewardMenuItem } from "./types";

/** The words the menu says, whatever rewards are on it. */
type RewardMenuCopy = {
  /** Accessible name of the menu. */
  label: string;
  /** Names every redeem control. */
  redeem: string;
  /** The unit points are counted in — "pts". */
  points: string;
  /** Refuses a quantity sitting on the per-redemption bound. */
  atQuantityBound: string;
  /** Names a reward the balance cannot pay for. Omit it and the control just disables. */
  insufficient?: string;
  /** Standard-control names for the quantity stepper input, for a localizing consumer. */
  decreaseQuantity?: string;
  increaseQuantity?: string;
};

type RewardMenuProps = {
  copy: RewardMenuCopy;
  state: AsyncState<readonly RewardMenuItem[]>;
  /** Redeemable points, which affordability is judged against. */
  balance: number;
  /** Chosen quantity per per-unit reward id. A reward not named sits at one. */
  quantities?: Readonly<Record<string, number>>;
  onQuantityChange?: (rewardId: string, quantity: number) => void;
  onRedeem: (rewardId: string, quantity: number) => void;
  /** The reward whose redemption is in flight; its control shows busy. */
  busyRewardId?: string;
  className?: string;
};

type RewardRowProps = {
  copy: RewardMenuCopy;
  item: RewardMenuItem;
  balance: number;
  quantity: number;
  busy: boolean;
  onQuantityChange?: (rewardId: string, quantity: number) => void;
  onRedeem: (rewardId: string, quantity: number) => void;
};

function RewardRow({
  copy,
  item,
  balance,
  quantity,
  busy,
  onQuantityChange,
  onRedeem,
}: RewardRowProps) {
  const cost = item.pointCost * quantity;
  const affordable = cost <= balance;
  const atBound = item.maxQuantity != null && quantity >= item.maxQuantity;

  return (
    <VStack
      className="w-full"
      data-affordable={affordable}
      data-slot="reward-menu-item"
      gap="sm"
    >
      <HStack align="baseline" gap="md" justify="space-between">
        <VStack gap="xs">
          <Text weight="medium">{item.name}</Text>
          {item.validity ? (
            <Text data-slot="reward-menu-validity" size="sm" tone="secondary">
              {item.validity}
            </Text>
          ) : null}
          {item.collectionWindow ? (
            <Text
              data-slot="reward-menu-collection-window"
              size="sm"
              tone="secondary"
            >
              {item.collectionWindow}
            </Text>
          ) : null}
        </VStack>
        <Text className="shrink-0" weight="medium">
          {item.pointCost} {copy.points}
        </Text>
      </HStack>
      {item.maxQuantity != null ? (
        <VStack gap="xs">
          <StepperInput
            className="w-28"
            decrementLabel={copy.decreaseQuantity}
            incrementLabel={copy.increaseQuantity}
            max={item.maxQuantity}
            min={1}
            onValueChange={(value) => onQuantityChange?.(item.id, value)}
            value={quantity}
          />
          {atBound ? (
            <Text data-slot="reward-menu-bound" size="sm" tone="secondary">
              {copy.atQuantityBound}
            </Text>
          ) : null}
        </VStack>
      ) : null}
      <HStack align="center" gap="sm">
        <Button
          disabled={!affordable || busy}
          loading={busy}
          onClick={() => onRedeem(item.id, quantity)}
          size="sm"
          type="button"
          variant="outline"
        >
          {copy.redeem}
        </Button>
        {quantity > 1 ? (
          <Text data-slot="reward-menu-total" size="sm" tone="secondary">
            {cost} {copy.points}
          </Text>
        ) : null}
        {!affordable && copy.insufficient ? (
          <Text data-slot="reward-menu-insufficient" size="sm" tone="error">
            {copy.insufficient}
          </Text>
        ) : null}
      </HStack>
    </VStack>
  );
}

/**
 * The redemption menu. What a reward costs and how many a redemption may take
 * arrive as numbers; whether the member can afford it is judged here against
 * the supplied balance, so a story can reach every state without a programme
 * behind it. Redeeming is reported, never performed — the programme prices,
 * bounds, and refuses for real.
 */
function RewardMenu({
  copy,
  state,
  balance,
  quantities,
  onQuantityChange,
  onRedeem,
  busyRewardId,
  className,
}: RewardMenuProps) {
  return (
    <VStack className={className} data-slot="reward-menu" gap="sm">
      {state.status === "loading" ? (
        <VStack className="gap-3" data-slot="reward-menu-loading">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
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
          {state.data.map((item, index) => (
            <ListItem
              className="px-0 py-3"
              divider={index < state.data.length - 1}
              key={item.id}
            >
              <RewardRow
                balance={balance}
                busy={busyRewardId === item.id}
                copy={copy}
                item={item}
                onQuantityChange={onQuantityChange}
                onRedeem={onRedeem}
                quantity={
                  item.maxQuantity != null ? (quantities?.[item.id] ?? 1) : 1
                }
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
