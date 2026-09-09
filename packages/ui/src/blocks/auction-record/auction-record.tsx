import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { Gavel } from "@phosphor-icons/react";
import {
  REVEAL_HIDDEN_CLASS,
  REVEAL_REDUCED_MOTION_CLASS,
  REVEAL_TRANSITION_CLASS,
  REVEAL_VISIBLE_CLASS,
  revealStaggerDelayMs,
  useFirstPaintReveal,
} from "../shared/use-first-paint-reveal";
import { AuctionRecordRow } from "./auction-record-row";
import type { AuctionRecordProps, AuctionRecordRowProps } from "./types";

function RecordSection({
  heading,
  items,
  revealed,
  startIndex,
}: {
  heading: string;
  items: readonly AuctionRecordRowProps[];
  revealed: boolean;
  startIndex: number;
}) {
  return (
    <VStack className="w-full" gap="lg" hAlign="stretch">
      <HStack className="w-full" gap="sm" vAlign="center">
        <h2 className="text-xl leading-7 font-semibold text-foreground">
          {heading}
        </h2>
        <Badge size="sm" variant="default">
          {items.length}
        </Badge>
      </HStack>
      <VStack className="w-full" gap="md" hAlign="stretch">
        {items.map((item, index) => {
          const staggerIndex = startIndex + index;
          return (
            <div
              className={cn(
                REVEAL_HIDDEN_CLASS,
                REVEAL_TRANSITION_CLASS,
                REVEAL_REDUCED_MOTION_CLASS,
                revealed && REVEAL_VISIBLE_CLASS,
              )}
              key={item.id ?? item.href ?? item.title}
              style={{
                transitionDelay: revealStaggerDelayMs(staggerIndex, revealed),
              }}
            >
              <AuctionRecordRow {...item} />
            </div>
          );
        })}
      </VStack>
    </VStack>
  );
}

/**
 * My Auctions page body: breadcrumbs, title, Bidding / Watching sections.
 * Bidding leads — a lot holding the collector's money outranks one they are
 * only following. Same shell as Order History: hide a section with no rows;
 * if both are empty, show one page-level empty state. Site chrome stays
 * outside, and so does the `<Toast />` the application mounts at its root.
 */
function AuctionRecord({
  copy,
  breadcrumbs,
  watchingItems = [],
  biddingItems = [],
  onBrowseCatalogue,
  className,
}: AuctionRecordProps) {
  const revealed = useFirstPaintReveal();
  const hasWatching = watchingItems.length > 0;
  const hasBidding = biddingItems.length > 0;
  const isEmpty = !hasWatching && !hasBidding;

  return (
    <VStack
      className={cn(
        "w-full max-w-7xl gap-12 overflow-hidden px-8 pt-8 pb-16",
        className,
      )}
      data-revealed={revealed || undefined}
      data-slot="auction-record"
      hAlign="stretch"
    >
      {breadcrumbs}
      <h1 className="w-full text-3xl leading-9 font-bold text-foreground">
        {copy.title}
      </h1>
      {isEmpty ? (
        <div
          className={cn(
            "w-full scale-[0.97] opacity-0",
            "transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
            "motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none",
            revealed && "scale-100 opacity-100",
          )}
          data-slot="auction-record-empty"
        >
          <EmptyState
            actions={
              onBrowseCatalogue != null ? (
                <Button
                  size="md"
                  variant="secondary"
                  onClick={onBrowseCatalogue}
                >
                  {copy.browseCatalogue}
                </Button>
              ) : undefined
            }
            description={copy.emptyDescription}
            icon={<Gavel aria-hidden size={24} weight="regular" />}
            title={copy.emptyTitle}
          />
        </div>
      ) : (
        <>
          {hasBidding ? (
            <RecordSection
              heading={copy.biddingHeading}
              items={biddingItems}
              revealed={revealed}
              startIndex={0}
            />
          ) : null}
          {hasWatching ? (
            <RecordSection
              heading={copy.watchingHeading}
              items={watchingItems}
              revealed={revealed}
              startIndex={hasBidding ? biddingItems.length : 0}
            />
          ) : null}
        </>
      )}
    </VStack>
  );
}

export { AuctionRecord };
