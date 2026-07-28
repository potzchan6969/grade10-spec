import { Badge } from "../Badge.js";
import { SegmentedControl } from "../SegmentedControl.js";
import { Skeleton } from "../Skeleton.js";
import { Stack } from "../Stack.js";
import { Surface } from "../Surface.js";
import { Text } from "../Text.js";
import { FeaturedMarketStatus } from "./FeaturedMarketStatus.js";
import type {
  FeaturedAsset,
  FeaturedAsyncState,
  FeaturedDuration,
  FeaturedEventMarket,
  FeaturedMobileTab,
} from "./types.js";

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
              <Badge tone={asset.odds.tone}>{asset.odds.label}</Badge>
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
        <Surface
          as="button"
          disabled={duration.disabled}
          key={duration.id}
          onClick={() => onDurationChange(duration.id)}
          selected={duration.id === selectedDurationId}
          variant="ghost"
        >
          {duration.label}
        </Surface>
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
        <Surface
          as="button"
          key={event.id}
          onClick={() => onEventChange(event.id)}
          selected={event.id === selectedEventId}
          variant="ghost"
        >
          <Text truncate>{event.label}</Text>
        </Surface>
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
    <SegmentedControl
      ariaLabel="Market source"
      onValueChange={onValueChange}
      options={sources.map((source) => ({
        disabled: source.disabled,
        label: source.shortLabel ?? source.label,
        value: source.id,
      }))}
      value={value}
    />
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
    <SegmentedControl
      ariaLabel="Featured markets"
      onValueChange={onValueChange}
      options={[
        { label: "Crypto Up or Down", value: "crypto" },
        { label: "Trending", value: "trending" },
      ]}
      value={value}
    />
  );
}
