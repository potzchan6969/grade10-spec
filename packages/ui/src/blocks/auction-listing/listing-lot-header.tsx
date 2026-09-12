import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { WatchButtonCopy } from "../auction-record/types";
import { WatchButton } from "../auction-record/watch-button";

type ListingLotHeaderCopy = {
  auctionBreadcrumb: string;
  lotBreadcrumb: string;
  watch: string;
  watching: string;
  watchAriaLabel: string;
  unwatchAriaLabel: string;
  pending?: string;
  watchedToast?: WatchButtonCopy["watchedToast"];
  unwatchedToast?: WatchButtonCopy["unwatchedToast"];
};

type ListingLotHeaderProps = {
  copy: ListingLotHeaderCopy;
  title: string;
  auctionHref?: string;
  watched?: boolean;
  /** Bid stands — Watching disabled via `WatchButton` locked. */
  watchLocked?: boolean;
  watchPending?: boolean;
  onWatchToggle?: () => void;
  onWatchedToastAction?: () => void;
  onUnwatchedToastAction?: () => void;
};

/**
 * Lot page title row: breadcrumbs, title, and `WatchButton` when the
 * application supplies `onWatchToggle` (omit on closed lots — sold or
 * unsold). Pass `watchLocked` when the collector has bid on an open lot.
 */
function ListingLotHeader({
  copy,
  title,
  auctionHref = "#auction",
  watched = false,
  watchLocked = false,
  watchPending = false,
  onWatchToggle,
  onWatchedToastAction,
  onUnwatchedToastAction,
}: ListingLotHeaderProps) {
  const watchCopy: WatchButtonCopy = {
    watch: copy.watch,
    watching: copy.watching,
    watchAriaLabel: copy.watchAriaLabel,
    unwatchAriaLabel: copy.unwatchAriaLabel,
    pending: copy.pending,
    watchedToast: copy.watchedToast,
    unwatchedToast: copy.unwatchedToast,
  };

  return (
    <VStack className="w-full" data-slot="listing-lot-header" gap="md">
      <Breadcrumbs>
        <BreadcrumbItem href={auctionHref}>
          {copy.auctionBreadcrumb}
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>{copy.lotBreadcrumb}</BreadcrumbItem>
      </Breadcrumbs>
      <HStack
        className="w-full"
        gap="md"
        hAlign="space-between"
        vAlign="center"
      >
        <h1 className="min-w-0 text-3xl font-semibold leading-9 text-foreground">
          {title}
        </h1>
        {onWatchToggle ? (
          <WatchButton
            copy={watchCopy}
            locked={watchLocked}
            onPress={onWatchToggle}
            onUnwatchedToastAction={onUnwatchedToastAction}
            onWatchedToastAction={onWatchedToastAction}
            pending={watchPending}
            watched={watched || watchLocked}
          />
        ) : null}
      </HStack>
    </VStack>
  );
}

export type { ListingLotHeaderCopy, ListingLotHeaderProps };
export { ListingLotHeader };
