import { Separator } from "@grade10/design-system/components/display/separator";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { useState } from "react";

type ListingBidPanelProps = {
  title: ReactNode;
  kicker?: ReactNode;
  /** Highest-bidder / outbid / won banner. The consumer owns the content. */
  standing?: ReactNode;
  priceLabel: ReactNode;
  price: ReactNode;
  priceHint?: ReactNode;
  bidCount?: ReactNode;
  showHistoryLabel?: ReactNode;
  hideHistoryLabel?: ReactNode;
  history?: ReactNode;
  endsLabel: ReactNode;
  remaining: ReactNode;
  deadline?: ReactNode;
  extensionLabel?: ReactNode;
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
  priceLabel,
  price,
  priceHint,
  bidCount,
  showHistoryLabel,
  hideHistoryLabel,
  history,
  endsLabel,
  remaining,
  deadline,
  extensionLabel,
  extensionValue,
  actions,
  className,
}: ListingBidPanelProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const canToggleHistory = history != null && showHistoryLabel != null;

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
          {priceLabel}
        </Text>
        <Text size="xl" weight="bold">
          {price}
        </Text>
        {priceHint ? (
          <Text size="sm" tone="secondary">
            {priceHint}
          </Text>
        ) : null}
        {bidCount != null || canToggleHistory ? (
          <HStack gap="sm" vAlign="center" wrap>
            {bidCount != null ? (
              <Text size="sm" tone="secondary">
                {bidCount}
              </Text>
            ) : null}
            {canToggleHistory ? (
              <Button
                onClick={() => setHistoryOpen((open) => !open)}
                size="sm"
                variant="ghost"
              >
                {historyOpen ? hideHistoryLabel : showHistoryLabel}
              </Button>
            ) : null}
          </HStack>
        ) : null}
        {historyOpen ? history : null}
      </VStack>
      <Separator />
      <VStack gap="sm">
        <Text size="sm" tone="secondary">
          {endsLabel}
        </Text>
        <Text size="xl" weight="bold">
          {remaining}
        </Text>
        {deadline ? (
          <Text size="sm" tone="secondary">
            {deadline}
          </Text>
        ) : null}
        {extensionLabel != null || extensionValue != null ? (
          <HStack className="w-full" gap="sm" hAlign="space-between" wrap>
            {extensionLabel != null ? (
              <Text size="sm">{extensionLabel}</Text>
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

export type { ListingBidPanelProps };
export { ListingBidPanel };
