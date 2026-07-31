import { Badge } from "@acetrader/design-system/components/display/badge";
import { Skeleton } from "@acetrader/design-system/components/display/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@acetrader/design-system/components/display/tabs";
import { Text } from "@acetrader/design-system/components/display/text";
import { Stack } from "@acetrader/design-system/components/layout/stack";
import { FeaturedMarketStatus } from "./FeaturedMarketStatus.js";
import type {
  FeaturedAsset,
  FeaturedAsyncState,
  FeaturedDuration,
  FeaturedEventMarket,
  FeaturedMobileTab,
} from "./types.js";

/**
 * Badge has a destructive rung but no success rung, so the positive tone is
 * applied from the token pair rather than invented as a design-system variant.
 */
const oddsTone = {
  error: { variant: "destructive" as const, className: undefined },
  success: {
    variant: "secondary" as const,
    className: "bg-success text-success-foreground",
  },
};

export type FeaturedAssetTabsProps<AssetId extends string> = {
  assets: readonly FeaturedAsset<AssetId>[];
  selectedAssetId: AssetId;
  onAssetChange: (assetId: AssetId) => void;
  isFading?: boolean;
};

export function FeaturedAssetTabs<AssetId extends string>({
  assets,
  selectedAssetId,
  onAssetChange,
  isFading = false,
}: FeaturedAssetTabsProps<AssetId>) {
  return (
    <div
      className="at-featured-assets"
      data-fading={isFading || undefined}
      role="tablist"
      aria-label="Assets"
    >
      {assets.map((asset) => {
        const selected = asset.id === selectedAssetId;
        return (
          <button
            aria-selected={selected}
            data-selected={selected || undefined}
            disabled={asset.disabled}
            key={asset.id}
            onClick={() => onAssetChange(asset.id)}
            role="tab"
            type="button"
          >
            <span>{asset.label}</span>
            {asset.odds ? (
              <Badge
                className={oddsTone[asset.odds.tone].className}
                variant={oddsTone[asset.odds.tone].variant}
              >
                {asset.odds.label}
              </Badge>
            ) : (
              <Skeleton
                className="at-featured-assets__placeholder"
                shape="text"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export type FeaturedDurationListProps<DurationId extends string> = {
  durations: readonly FeaturedDuration<DurationId>[];
  selectedDurationId?: DurationId;
  onDurationChange: (durationId: DurationId) => void;
};

export function FeaturedDurationList<DurationId extends string>({
  durations,
  selectedDurationId,
  onDurationChange,
}: FeaturedDurationListProps<DurationId>) {
  return (
    <Stack className="at-featured-nav-list" gap="xs">
      {durations.map((duration) => (
        <button
          className="at-featured-nav-item"
          data-selected={duration.id === selectedDurationId || undefined}
          disabled={duration.disabled}
          key={duration.id}
          onClick={() => onDurationChange(duration.id)}
          type="button"
        >
          {duration.label}
        </button>
      ))}
    </Stack>
  );
}

export type FeaturedEventListProps<
  EventId extends string,
  SourceId extends string = string,
> = {
  events: FeaturedAsyncState<readonly FeaturedEventMarket<EventId, SourceId>[]>;
  selectedEventId?: EventId;
  onEventChange: (eventId: EventId) => void;
};

export function FeaturedEventList<
  EventId extends string,
  SourceId extends string,
>({
  events,
  selectedEventId,
  onEventChange,
}: FeaturedEventListProps<EventId, SourceId>) {
  if (events.status !== "ready")
    return <FeaturedMarketStatus label="trending markets" state={events} />;
  return (
    <Stack className="at-featured-nav-list" gap="xs">
      {events.data.map((event) => (
        <button
          className="at-featured-nav-item"
          data-selected={event.id === selectedEventId || undefined}
          key={event.id}
          onClick={() => onEventChange(event.id)}
          type="button"
        >
          <Text truncate>{event.label}</Text>
        </button>
      ))}
    </Stack>
  );
}

export type FeaturedMarketsSidebarProps<
  DurationId extends string,
  EventId extends string,
  SourceId extends string = string,
> = {
  durations: readonly FeaturedDuration<DurationId>[];
  selectedDurationId?: DurationId;
  onDurationChange: (durationId: DurationId) => void;
  events: FeaturedAsyncState<readonly FeaturedEventMarket<EventId, SourceId>[]>;
  selectedEventId?: EventId;
  onEventChange: (eventId: EventId) => void;
};

export function FeaturedMarketsSidebar<
  DurationId extends string,
  EventId extends string,
  SourceId extends string,
>({
  durations,
  selectedDurationId,
  onDurationChange,
  events,
  selectedEventId,
  onEventChange,
}: FeaturedMarketsSidebarProps<DurationId, EventId, SourceId>) {
  return (
    <aside
      className="at-featured-sidebar"
      aria-label="Featured market navigation"
    >
      <Stack gap="sm">
        <Text size="xs" tone="secondary" weight="bold">
          CRYPTO UP OR DOWN
        </Text>
        <FeaturedDurationList
          durations={durations}
          onDurationChange={onDurationChange}
          selectedDurationId={selectedDurationId}
        />
      </Stack>
      <Stack gap="sm">
        <Text size="xs" tone="secondary" weight="bold">
          TRENDING
        </Text>
        <FeaturedEventList
          events={events}
          onEventChange={onEventChange}
          selectedEventId={selectedEventId}
        />
      </Stack>
    </aside>
  );
}

export type FeaturedSourceTabsProps<SourceId extends string> = {
  value: SourceId;
  sources: readonly {
    id: SourceId;
    label: string;
    shortLabel?: string;
    disabled?: boolean;
  }[];
  onValueChange: (sourceId: SourceId) => void;
};

export function FeaturedSourceTabs<SourceId extends string>({
  value,
  sources,
  onValueChange,
}: FeaturedSourceTabsProps<SourceId>) {
  if (sources.length < 2) return null;
  return (
    <Tabs
      onValueChange={(next) => onValueChange(next as SourceId)}
      value={value}
    >
      <TabsList aria-label="Market source" className="w-full">
        {sources.map((source) => (
          <TabsTrigger
            disabled={source.disabled}
            key={source.id}
            value={source.id}
          >
            {source.shortLabel ?? source.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export type FeaturedMobileTabsProps = {
  value: FeaturedMobileTab;
  onValueChange: (tab: FeaturedMobileTab) => void;
};

export function FeaturedMobileTabs({
  value,
  onValueChange,
}: FeaturedMobileTabsProps) {
  return (
    <Tabs
      onValueChange={(next) => onValueChange(next as FeaturedMobileTab)}
      value={value}
    >
      <TabsList aria-label="Featured markets" className="w-full">
        <TabsTrigger value="crypto">Crypto Up or Down</TabsTrigger>
        <TabsTrigger value="trending">Trending</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
