import type { FeaturedAsyncState, FeaturedMarketOutcome, FeaturedMarketPresentation, FeaturedMarketSummaryData } from "./types.js";
export type FeaturedMarketHeaderProps = {
    header: FeaturedMarketSummaryData["header"];
};
export declare function FeaturedMarketHeader({ header }: FeaturedMarketHeaderProps): import("react").JSX.Element;
export type FeaturedMarketStatsProps = {
    stats: FeaturedMarketSummaryData["stats"];
};
export declare function FeaturedMarketStats({ stats }: FeaturedMarketStatsProps): import("react").JSX.Element;
export type FeaturedMarketOutcomeListProps<SourceId extends string> = {
    outcomes: readonly FeaturedMarketOutcome<SourceId>[];
    visibleSourceId?: SourceId;
};
export declare function FeaturedMarketOutcomeList<SourceId extends string>({ outcomes, visibleSourceId, }: FeaturedMarketOutcomeListProps<SourceId>): import("react").JSX.Element;
export declare function FeaturedMarketInsight({ insight }: {
    insight?: string;
}): import("react").JSX.Element | null;
export type FeaturedMarketSummaryCardProps<SourceId extends string> = {
    data: FeaturedMarketSummaryData<SourceId>;
    className?: string;
};
export declare function FeaturedMarketSummaryCard<SourceId extends string>({ data, className, }: FeaturedMarketSummaryCardProps<SourceId>): import("react").JSX.Element;
export type FeaturedMarketChartCardProps<SourceId extends string> = {
    data: Extract<FeaturedMarketPresentation<SourceId>, {
        kind: "chart";
    }>;
    className?: string;
};
export declare function FeaturedMarketChartCard<SourceId extends string>({ data, className, }: FeaturedMarketChartCardProps<SourceId>): import("react").JSX.Element;
export type FeaturedMarketContentProps<SourceId extends string> = {
    state: FeaturedAsyncState<FeaturedMarketPresentation<SourceId>>;
    className?: string;
};
export declare function FeaturedMarketContent<SourceId extends string>({ state, className, }: FeaturedMarketContentProps<SourceId>): import("react").JSX.Element;
//# sourceMappingURL=FeaturedMarketContent.d.ts.map