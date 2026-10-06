import { Badge } from "@grade10/design-system/components/display/badge";
import { StatusIndicator } from "@grade10/design-system/components/display/status-indicator";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import {
  formatListingClosed,
  formatListingEnds,
  formatListingOpens,
  type ShippedLocale,
} from "../../lib/format-datetime";
import { formatMoney } from "../../lib/format-money";
import type { WatchButtonCopy } from "../auction-record/types";
import { WatchButton } from "../auction-record/watch-button";

/** Grade, featured, or ending-soon mark. The label is the consumer's. */
type AuctionCardBadge = {
  label: string;
  variant: "outline" | "brand" | "warning";
};

/**
 * When the lot's clock line is a close, an open, or a close that has passed.
 * The line is formatted once. It does not tick.
 */
type AuctionCardWhen = {
  kind: "ends" | "opens" | "closed";
  at: Date | number;
};

/** Words every catalogue tile says the same way. */
type AuctionCardCopy = {
  /** Accessible name for the open-lot pip. */
  live: string;
  /** Accessible name for the last-minutes pip. */
  endingSoon: string;
  watch: WatchButtonCopy;
};

type AuctionCardProps = {
  copy: AuctionCardCopy;
  /** Lot title, and the name a screen reader reads the photo and title as. */
  name: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Current or starting price in minor units. */
  currentBidMinor: number;
  /** ISO 4217 code. Stories use HKD, the listing default. */
  currency: string;
  /**
   * Price caption, already chosen: "Current bid" once bids exist, "Starting
   * bid" before they do. The tile does not decide which.
   */
  priceLabel: string;
  /** Display-ready count, such as "14 bids". Omit it and the line is absent. */
  bidCountLabel?: string;
  /** Static close, open, or closed line. Omit it and no clock is shown. */
  when?: AuctionCardWhen;
  locale?: ShippedLocale;
  timeZone: string;
  badges?: readonly AuctionCardBadge[];
  /**
   * Open-lot pip. `open` is the brand dot. `last-minutes` is the error dot.
   * Omit it on a lot that is not live.
   */
  live?: "open" | "last-minutes";
  /**
   * Closed or unsold. The photo drops to half opacity. The watch control is
   * omitted: a closed lot has nothing to watch.
   */
  closed?: boolean;
  watched?: boolean;
  /** A bid stands. Watching stays on and the control does not report press. */
  watchLocked?: boolean;
  watchPending?: boolean;
  /** Supply one to offer watch. Ignored when `closed`. */
  onWatchToggle?: () => void;
  /**
   * Fires from the photo and the title. The tile does not own a route.
   * Omitted, both are inert.
   */
  onClick?: () => void;
  className?: string;
};

function scheduleLabel(
  when: AuctionCardWhen | undefined,
  locale: ShippedLocale,
  timeZone: string,
): string | null {
  if (when == null) return null;
  const options = { locale, timeZone };
  switch (when.kind) {
    case "ends":
      return formatListingEnds(when.at, options);
    case "opens":
      return formatListingOpens(when.at, options);
    case "closed":
      return formatListingClosed(when.at, options);
  }
}

/**
 * Catalogue lot tile: the first photo, the title, the current price, and
 * watch. Grade, featured, and ending-soon marks are badges the consumer
 * supplies.
 *
 * The clock line is static (`formatListingEnds`, `formatListingOpens`,
 * `formatListingClosed`). The rolling countdown stays on the lot bid card.
 */
function AuctionCard({
  copy,
  name,
  imageSrc,
  imageAlt = "",
  currentBidMinor,
  currency,
  priceLabel,
  bidCountLabel,
  when,
  locale = "en",
  timeZone,
  badges = [],
  live,
  closed = false,
  watched = false,
  watchLocked = false,
  watchPending = false,
  onWatchToggle,
  onClick,
  className,
}: AuctionCardProps) {
  const showWatch = !closed && onWatchToggle != null;
  const timeLabel = scheduleLabel(when, locale, timeZone);
  const price = formatMoney(currentBidMinor, currency, { locale });

  const photoClassName = cn(
    "size-full rounded-(--radius-3xl) object-contain",
    closed && "opacity-50",
    !closed &&
      "transition-transform duration-200 ease-[ease] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/auction-card:scale-105",
  );

  const well = (
    <div
      className="absolute inset-0 isolate overflow-hidden rounded-(--radius-3xl) border border-border-subtle bg-gradient-to-b from-[var(--gray-50)] to-[var(--gray-100)]"
      data-slot="auction-card-image-well"
    >
      {imageSrc ? (
        <img
          alt={onClick ? "" : imageAlt}
          aria-hidden={onClick ? true : undefined}
          className={photoClassName}
          src={imageSrc}
        />
      ) : null}
    </div>
  );

  return (
    <VStack
      className={cn("group/auction-card w-full", className)}
      data-closed={closed || undefined}
      data-live={live}
      data-slot="auction-card"
      gap="none"
    >
      <div className="relative aspect-square w-full rounded-(--radius-3xl)">
        {onClick ? (
          <button
            aria-label={name}
            className="absolute inset-0 cursor-pointer overflow-hidden rounded-(--radius-3xl) border-0 bg-transparent p-0 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={onClick}
            type="button"
          >
            {well}
          </button>
        ) : (
          <div className="absolute inset-0 overflow-hidden rounded-(--radius-3xl)">
            {well}
          </div>
        )}
        {badges.length > 0 ? (
          <HStack
            className="pointer-events-none absolute top-3 left-3 z-10"
            gap="xs"
            wrap
          >
            {badges.map((badge) => (
              <Badge key={badge.label} size="sm" variant={badge.variant}>
                {badge.label}
              </Badge>
            ))}
          </HStack>
        ) : null}
        {live ? (
          <StatusIndicator
            aria-label={live === "last-minutes" ? copy.endingSoon : copy.live}
            className="absolute top-3 right-3 z-10"
            role="img"
            type="dot"
            variant={live === "last-minutes" ? "error" : "brand"}
          />
        ) : null}
      </div>

      <VStack className="min-w-0 gap-1 py-2" gap="none">
        {onClick ? (
          <button
            className="line-clamp-2 w-full cursor-pointer text-left text-base font-medium text-card-foreground underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={onClick}
            type="button"
          >
            {name}
          </button>
        ) : (
          <p className="line-clamp-2 text-base font-medium text-card-foreground">
            {name}
          </p>
        )}
        <Text size="sm" tone="secondary" weight="medium">
          {priceLabel}
        </Text>
        <p className="text-base font-normal text-card-foreground">{price}</p>
        {bidCountLabel != null ? (
          <Text size="xs" tone="secondary">
            {bidCountLabel}
          </Text>
        ) : null}
        {timeLabel != null ? (
          <Text size="xs" tone="secondary">
            {timeLabel}
          </Text>
        ) : null}
        {showWatch ? (
          <WatchButton
            className="self-start"
            copy={copy.watch}
            locked={watchLocked}
            onPress={onWatchToggle}
            pending={watchPending}
            watched={watched || watchLocked}
          />
        ) : null}
      </VStack>
    </VStack>
  );
}

export type {
  AuctionCardBadge,
  AuctionCardCopy,
  AuctionCardProps,
  AuctionCardWhen,
};
export { AuctionCard };
