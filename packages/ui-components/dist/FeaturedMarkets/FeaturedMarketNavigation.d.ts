import type { FeaturedAsset, FeaturedAsyncState, FeaturedDuration, FeaturedEventMarket, FeaturedMobileTab } from "./types.js";
export type FeaturedAssetTabsProps<AssetId extends string> = {
    assets: readonly FeaturedAsset<AssetId>[];
    selectedAssetId: AssetId;
    onAssetChange: (assetId: AssetId) => void;
    isFading?: boolean;
};
export declare function FeaturedAssetTabs<AssetId extends string>({ assets, selectedAssetId, onAssetChange, isFading, }: FeaturedAssetTabsProps<AssetId>): import("react").JSX.Element;
export type FeaturedDurationListProps<DurationId extends string> = {
    durations: readonly FeaturedDuration<DurationId>[];
    selectedDurationId?: DurationId;
    onDurationChange: (durationId: DurationId) => void;
};
export declare function FeaturedDurationList<DurationId extends string>({ durations, selectedDurationId, onDurationChange, }: FeaturedDurationListProps<DurationId>): import("react").JSX.Element;
export type FeaturedEventListProps<EventId extends string, SourceId extends string = string> = {
    events: FeaturedAsyncState<readonly FeaturedEventMarket<EventId, SourceId>[]>;
    selectedEventId?: EventId;
    onEventChange: (eventId: EventId) => void;
};
export declare function FeaturedEventList<EventId extends string, SourceId extends string>({ events, selectedEventId, onEventChange, }: FeaturedEventListProps<EventId, SourceId>): import("react").JSX.Element;
export type FeaturedMarketsSidebarProps<DurationId extends string, EventId extends string, SourceId extends string = string> = {
    durations: readonly FeaturedDuration<DurationId>[];
    selectedDurationId?: DurationId;
    onDurationChange: (durationId: DurationId) => void;
    events: FeaturedAsyncState<readonly FeaturedEventMarket<EventId, SourceId>[]>;
    selectedEventId?: EventId;
    onEventChange: (eventId: EventId) => void;
};
export declare function FeaturedMarketsSidebar<DurationId extends string, EventId extends string, SourceId extends string>({ durations, selectedDurationId, onDurationChange, events, selectedEventId, onEventChange, }: FeaturedMarketsSidebarProps<DurationId, EventId, SourceId>): import("react").JSX.Element;
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
export declare function FeaturedSourceTabs<SourceId extends string>({ value, sources, onValueChange, }: FeaturedSourceTabsProps<SourceId>): import("react").JSX.Element | null;
export type FeaturedMobileTabsProps = {
    value: FeaturedMobileTab;
    onValueChange: (tab: FeaturedMobileTab) => void;
};
export declare function FeaturedMobileTabs({ value, onValueChange, }: FeaturedMobileTabsProps): import("react").JSX.Element;
//# sourceMappingURL=FeaturedMarketNavigation.d.ts.map