import type { ReactNode } from "react";
import type { FeaturedAsyncState, FeaturedMarketPresentation, FeaturedMarketSelection, FeaturedMarketsProps, FeaturedMobileTab } from "./types.js";
export type FeaturedMarketsPanelProps<DurationId extends string, EventId extends string, SourceId extends string> = {
    sidebar: ReactNode;
    selection: FeaturedMarketSelection<string, DurationId, EventId>;
    content: FeaturedAsyncState<FeaturedMarketPresentation<SourceId>>;
    assetTabs?: ReactNode;
    className?: string;
};
export declare function FeaturedMarketsPanel<DurationId extends string, EventId extends string, SourceId extends string>({ sidebar, selection, content, assetTabs, className, }: FeaturedMarketsPanelProps<DurationId, EventId, SourceId>): import("react").JSX.Element;
export type FeaturedMarketsDesktopProps<AssetId extends string, DurationId extends string, EventId extends string, SourceId extends string> = Omit<FeaturedMarketsProps<AssetId, DurationId, EventId, SourceId>, "mobileTab" | "onMobileTabChange" | "onBrowseAll">;
export declare function FeaturedMarketsDesktop<AssetId extends string, DurationId extends string, EventId extends string, SourceId extends string>(props: FeaturedMarketsDesktopProps<AssetId, DurationId, EventId, SourceId>): import("react").JSX.Element;
export type FeaturedMarketsMobileProps<AssetId extends string, DurationId extends string, EventId extends string, SourceId extends string> = Pick<FeaturedMarketsProps<AssetId, DurationId, EventId, SourceId>, "assets" | "defaultAssetId" | "defaultDurationId" | "durationMarkets" | "events" | "mobileTab" | "onBrowseAll" | "onMobileTabChange" | "onSelectionChange" | "selection">;
export declare function FeaturedMarketsMobile<AssetId extends string, DurationId extends string, EventId extends string, SourceId extends string>(props: FeaturedMarketsMobileProps<AssetId, DurationId, EventId, SourceId>): import("react").JSX.Element;
export declare function FeaturedMarkets<AssetId extends string, DurationId extends string, EventId extends string, SourceId extends string>(props: FeaturedMarketsProps<AssetId, DurationId, EventId, SourceId>): import("react").JSX.Element;
export type { FeaturedMobileTab };
//# sourceMappingURL=FeaturedMarkets.d.ts.map