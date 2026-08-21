import { Separator } from "@grade10/design-system/components/display/separator";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { popInValue } from "./digit-pop-in";

/**
 * The words the panel says. What the lot currently costs, how long is left,
 * and what a collector can do about it are values and slots, not words.
 */
type ListingBidPanelCopy = {
  /** What the amount on show is: an opening bid, the current one, a result. */
  price: string;
  /** What the time on show is: when bidding opens, or when it ends. */
  ends: string;
  /** Names the extended-bidding row. Omit it and the row is drawn from its
   * value alone. */
  extension?: string;
  /** Accessible name for the control that opens the extension's explanation. */
};

type ListingBidPanelProps = {
  copy: ListingBidPanelCopy;
  title: ReactNode;
  kicker?: ReactNode;
  /** Highest-bidder / outbid / won banner. The consumer owns the content. */
  standing?: ReactNode;
  price: ReactNode;
  priceHint?: ReactNode;
  bidCount?: ReactNode;
  /** The bids so far, as the consumer composes them. Shown whenever it is
   * given — there is nothing to open. */
  history?: ReactNode;
  remaining: ReactNode;
  deadline?: ReactNode;
  extensionValue?: ReactNode;
  /** Place bid, watch, share — the consumer owns the controls. */
  actions: ReactNode;
  className?: string;
};

/**
 * Right column of a product page: title, current bid, time left, and actions.
 * Bid-history open/closed is presentation state.
 */
function ListingBidPanel({
  title,
  kicker,
  standing,
  copy,
  price,
  priceHint,
  bidCount,
  history,
  remaining,
  deadline,
  extensionValue,
  actions,
  className,
}: ListingBidPanelProps) {
  return (
    <VStack
      className={cn("min-w-0 w-full", className)}
      data-slot="listing-bid-panel"
      gap="md"
    >
      <VStack gap="sm">
        <Text as="h2" size="xl" weight="bold">
          {title}
        </Text>
        {kicker ? (
          <Text size="sm" tone="secondary">
            {kicker}
          </Text>
        ) : null}
      </VStack>
      {standing}
      <VStack gap="sm">
        <Text size="sm" tone="secondary">
          {copy.price}
        </Text>
        <Text size="xl" weight="bold">
          {popInValue(price)}
        </Text>
        {priceHint ? (
          <Text size="sm" tone="secondary">
            {priceHint}
          </Text>
        ) : null}
        {bidCount != null ? (
          <HStack gap="sm" vAlign="center" wrap>
            <Text size="sm" tone="secondary">
              {popInValue(bidCount)}
            </Text>
          </HStack>
        ) : null}
        {history}
      </VStack>
      <Separator />
      <VStack gap="sm">
        <Text size="sm" tone="secondary">
          {copy.ends}
        </Text>
        <Text size="xl" weight="bold">
          {remaining}
        </Text>
        {deadline ? (
          <Text size="sm" tone="secondary">
            {deadline}
          </Text>
        ) : null}
        {copy.extension != null || extensionValue != null ? (
          <HStack className="w-full" gap="sm" hAlign="space-between" wrap>
            {copy.extension != null ? (
              <Text size="sm">{copy.extension}</Text>
            ) : null}
            {extensionValue != null ? (
              <Text size="sm" weight="medium">
                {extensionValue}
              </Text>
            ) : null}
          </HStack>
        ) : null}
      </VStack>
      {actions}
    </VStack>
  );
}

export type { ListingBidPanelCopy, ListingBidPanelProps };
export { ListingBidPanel };
