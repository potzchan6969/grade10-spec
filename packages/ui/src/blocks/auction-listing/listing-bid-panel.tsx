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

/**
 * The words the panel says. What the lot currently costs, how long is left,
 * and what a collector can do about it are values and slots, not words.
 */
type ListingBidPanelCopy = {
  /** What the amount on show is: an opening bid, the current one, a result. */
  price: string;
  /** Names the viewer's own committed maximum. */
  maximum: string;
  /** What the time on show is: when bidding opens, or when it ends. */
  ends: string;
  /** Names the extended-bidding row. Omit it and the row is drawn from its
   * value alone. */
  extension?: string;
  /** Accessible name for the control that opens the extension's explanation. */
  extensionTooltip?: string;
};

type ListingBidPanelProps = {
  copy: ListingBidPanelCopy;
  title: ReactNode;
  kicker?: ReactNode;
  /** Highest-bidder / outbid / won banner. The consumer owns the content. */
  standing?: ReactNode;
  /** Watch control rendered in the top-right card action slot. */
  watchAction?: ReactNode;
  /** Whether the current viewer is watching this listing. */
  watching?: boolean;
  price: ReactNode;
  /** Viewer’s own committed maximum. Omit when the viewer has no commitment. */
  maximum?: ReactNode;
  /** Hint below the current bid when it clarifies what the amount means. */
  priceHint?: ReactNode;
  /** Post-auction buyer-fee note for bidders, shown in the action footer. */
  buyerFeeHint?: ReactNode;
  bidCount?: ReactNode;
  history?: ReactNode;
  remaining: ReactNode;
  deadline?: ReactNode;
  extensionValue?: ReactNode;
  extensionTooltip?: ReactNode;
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
  copy,
  price,
  maximum,
  priceHint,
  buyerFeeHint,
  bidCount,
  history,
  remaining,
  deadline,
  extensionValue,
  extensionTooltip,
  actions,
  className,
}: ListingBidPanelProps) {
  return (
    <Card
      className={cn("min-w-0 w-full overflow-hidden", className)}
      data-slot="listing-bid-panel"
      data-watching={watching == null ? undefined : watching}
    >
      <CardHeader className="pb-4">
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
        <VStack gap="lg">
          {standing}
          <div className="grid gap-3">
            <VStack
              className="rounded-xl border border-border/70 bg-muted/50 p-5 shadow-sm"
              gap="sm"
            >
              <Text
                className="uppercase tracking-wide"
                size="sm"
                tone="secondary"
              >
                {copy.price}
              </Text>
              <Text className="text-3xl sm:text-4xl" size="xl" weight="bold">
                {popInValue(price)}
              </Text>
              {priceHint ? (
                <Text size="sm" tone="secondary">
                  {priceHint}
                </Text>
              ) : null}
            </VStack>
            {maximum != null ? (
              <VStack
                className="rounded-xl border border-border/60 bg-background p-5"
                gap="sm"
              >
                <Text
                  className="uppercase tracking-wide"
                  size="sm"
                  tone="secondary"
                >
                  {copy.maximum}
                </Text>
                <Text className="text-2xl" size="xl" weight="bold">
                  {maximum}
                </Text>
              </VStack>
            ) : null}
          </div>
          {bidCount != null ? (
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-stretch gap-4">
              <VStack
                className="min-w-24 justify-center rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
                gap="xs"
              >
                <Text as="h3" size="xl" weight="bold">
                  {bidCount}
                </Text>
              </VStack>
              <VStack
                className="min-h-24 min-w-0 overflow-hidden rounded-xl border border-border/60 bg-muted/20 p-4"
                gap="xs"
              >
                {history}
              </VStack>
            </div>
          ) : history != null ? (
            history
          ) : null}
          <Separator />
          <VStack
            className="rounded-xl border border-border/60 bg-muted/20 p-4"
            gap="sm"
          >
            <HStack gap="md" hAlign="space-between" vAlign="end" wrap>
              <VStack gap="xs">
                <Text size="sm" tone="secondary">
                  {copy.ends}
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
            {copy.extension != null || extensionValue != null ? (
              <HStack className="w-full" gap="sm" hAlign="space-between" wrap>
                {copy.extension != null ? (
                  <HStack gap="xs" vAlign="center">
                    <Text size="sm">{copy.extension}</Text>
                    {extensionTooltip != null ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <IconButton
                                aria-label={
                                  copy.extensionTooltip ??
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
        <CardFooter className="items-stretch border-t bg-muted/20 p-5">
          <VStack className="w-full" gap="sm">
            {actions}
            {buyerFeeHint ? (
              <Text size="xs" tone="secondary">
                {buyerFeeHint}
              </Text>
            ) : null}
          </VStack>
        </CardFooter>
      ) : null}
    </Card>
  );
}

export type { ListingBidPanelCopy, ListingBidPanelProps };
export { ListingBidPanel };
