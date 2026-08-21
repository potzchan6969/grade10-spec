import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@grade10/design-system/components/display/card";
import { Separator } from "@grade10/design-system/components/display/separator";
import { Text } from "@grade10/design-system/components/display/text";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import { cn } from "@grade10/design-system/lib/utils";
import { Info } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { popInValue } from "./digit-pop-in";

import "./listing-bid-panel.css";

type ListingBidPanelProps = {
  title: ReactNode;
  kicker?: ReactNode;
  /** Highest-bidder / outbid / won banner. The consumer owns the content. */
  standing?: ReactNode;
  /** Watch control rendered in the top-right card action slot. */
  watchAction?: ReactNode;
  /** Whether the current viewer is watching this listing. */
  watching?: boolean;
  priceLabel: ReactNode;
  price: ReactNode;
  priceHint?: ReactNode;
  bidCount?: ReactNode;
  /** @deprecated Bid history is always visible when provided. */
  showHistoryLabel?: ReactNode;
  /** @deprecated Bid history is always visible when provided. */
  hideHistoryLabel?: ReactNode;
  history?: ReactNode;
  endsLabel: ReactNode;
  remaining: ReactNode;
  deadline?: ReactNode;
  extensionLabel?: ReactNode;
  extensionValue?: ReactNode;
  extensionTooltip?: ReactNode;
  extensionTooltipLabel?: string;
  /** Place bid, watch, share — the consumer owns the controls. */
  actions: ReactNode;
  className?: string;
};

/**
 * Right column of a product page: title, current bid, time left, and actions.
 * Bid history is rendered as a persistent recent-bids section.
 */
function ListingBidPanel({
  title,
  kicker,
  standing,
  watchAction,
  watching,
  priceLabel,
  price,
  priceHint,
  bidCount,
  history,
  endsLabel,
  remaining,
  deadline,
  extensionLabel,
  extensionValue,
  extensionTooltip,
  extensionTooltipLabel,
  actions,
  className,
}: ListingBidPanelProps) {
  return (
    <Card
      className={cn("min-w-0 w-full", className)}
      data-slot="listing-bid-panel"
      data-watching={watching == null ? undefined : watching}
    >
      <CardHeader>
        <Text as="h2" size="xl" weight="bold">
          {title}
        </Text>
        {kicker ? (
          <Text size="sm" tone="secondary">
            {kicker}
          </Text>
        ) : null}
        {watchAction ? <CardAction>{watchAction}</CardAction> : null}
      </CardHeader>
      <CardContent>
        <VStack gap="md">
          {standing}
          <VStack className="rounded-lg bg-muted/40 p-4" gap="sm">
            <VStack gap="xs">
              <Text size="sm" tone="secondary">
                {priceLabel}
              </Text>
              <Text size="xl" weight="bold">
                {popInValue(price)}
              </Text>
            </VStack>
            {priceHint ? (
              <Text size="sm" tone="secondary">
                {priceHint}
              </Text>
            ) : null}
          </VStack>
          {bidCount != null ? (
            <HStack className="w-full" gap="lg" vAlign="stretch">
              <VStack className="min-w-0 flex-1 p-4" gap="xs">
                <Text as="h3" size="lg" weight="bold">
                  {bidCount}
                </Text>
              </VStack>
              <VStack
                className="h-28 min-w-0 flex-1 overflow-hidden rounded-lg bg-muted/40 p-3"
                gap="xs"
              >
                {history}
              </VStack>
            </HStack>
          ) : history != null ? (
            history
          ) : null}
          <Separator />
          <VStack gap="sm">
            <HStack gap="md" hAlign="space-between" vAlign="end" wrap>
              <VStack gap="xs">
                <Text size="sm" tone="secondary">
                  {endsLabel}
                </Text>
                <Text size="xl" weight="bold">
                  {remaining}
                </Text>
              </VStack>
              {deadline ? (
                <Text className="text-right" size="sm" tone="secondary">
                  {deadline}
                </Text>
              ) : null}
            </HStack>
            {extensionLabel != null || extensionValue != null ? (
              <HStack className="w-full" gap="sm" hAlign="space-between" wrap>
                {extensionLabel != null ? (
                  <HStack gap="xs" vAlign="center">
                    <Text size="sm">{extensionLabel}</Text>
                    {extensionTooltip != null ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <IconButton
                                aria-label={
                                  extensionTooltipLabel ??
                                  "Extended bidding rules"
                                }
                                size="xs"
                                variant="ghost"
                              >
                                <Info aria-hidden="true" />
                              </IconButton>
                            }
                          />
                          <TooltipContent>{extensionTooltip}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : null}
                  </HStack>
                ) : null}
                {extensionValue != null ? (
                  <Text size="sm" weight="medium">
                    {extensionValue}
                  </Text>
                ) : null}
              </HStack>
            ) : null}
          </VStack>
        </VStack>
      </CardContent>
      {actions ? (
        <CardFooter className="items-stretch">
          <VStack className="w-full" gap="sm">
            {actions}
          </VStack>
        </CardFooter>
      ) : null}
    </Card>
  );
}

export type { ListingBidPanelProps };
export { ListingBidPanel };
