import type { ReactNode } from "react";

export type FeaturedAsyncState<T> =
	| { status: "loading" }
	| { status: "empty"; message?: string }
	| { status: "error"; message: string; onRetry?: () => void }
	| { status: "ready"; data: T };

export type FeaturedMarketSelection<
	AssetId extends string = string,
	DurationId extends string = string,
	EventId extends string = string,
> =
	| { kind: "duration"; assetId: AssetId; durationId: DurationId }
	| { kind: "event"; eventId: EventId };

export type FeaturedAsset<AssetId extends string = string> = {
	id: AssetId;
	label: string;
	odds?: { label: string; tone: "success" | "error" };
	disabled?: boolean;
};

export type FeaturedDuration<DurationId extends string = string> = {
	id: DurationId;
	label: string;
	disabled?: boolean;
};

export type FeaturedSource<SourceId extends string = string> = {
	id: SourceId;
	label: string;
	shortLabel?: string;
	disabled?: boolean;
};

export type FeaturedSourceSelection<SourceId extends string = string> = {
	value: SourceId;
	sources: readonly FeaturedSource<SourceId>[];
	onValueChange: (sourceId: SourceId) => void;
};

export type FeaturedMarketHeaderData = {
	title: string;
	imageUrl?: string;
	imageAlt?: string;
	imageFallback?: ReactNode;
	statusLabel?: string;
	periodLabel?: string;
	action?: { label: string; onAction: () => void; disabled?: boolean };
};

export type FeaturedMarketStat = {
	label: string;
	value: string;
	tone?: "primary" | "success" | "error" | "secondary";
};

export type FeaturedMarketOutcomeValue<SourceId extends string = string> = {
	sourceId: SourceId;
	value: string;
	state?: "active" | "evaluating" | "resolved" | "unavailable";
	resolvedLabel?: string;
	tone?: "success" | "error" | "secondary";
};

export type FeaturedMarketOutcome<SourceId extends string = string> = {
	id: string;
	label: string;
	values: readonly FeaturedMarketOutcomeValue<SourceId>[];
};

export type FeaturedMarketAction = {
	label: string;
	onAction: () => void;
	disabled?: boolean;
};

export type FeaturedMarketSummaryData<SourceId extends string = string> = {
	header: FeaturedMarketHeaderData;
	stats: readonly FeaturedMarketStat[];
	outcomes: readonly FeaturedMarketOutcome<SourceId>[];
	sourceSelection?: FeaturedSourceSelection<SourceId>;
	insight?: string;
	primaryAction?: FeaturedMarketAction;
	secondaryAction?: FeaturedMarketAction;
};

export type FeaturedChartPoint = {
	timestamp: number;
	value: number;
};

export type FeaturedMarketChartData = {
	ariaLabel: string;
	series: readonly FeaturedChartPoint[];
	referenceValue?: number;
	currentValue?: number;
	precision?: number;
	trend?: "up" | "down" | "neutral";
	height?: number;
};

export type FeaturedMarketPresentation<SourceId extends string = string> =
	| {
			kind: "chart";
			summary: FeaturedMarketSummaryData<SourceId>;
			chart: FeaturedAsyncState<FeaturedMarketChartData>;
	  }
	| { kind: "summary"; summary: FeaturedMarketSummaryData<SourceId> };

export type FeaturedDurationMarket<
	AssetId extends string = string,
	DurationId extends string = string,
	SourceId extends string = string,
> = {
	selection: { kind: "duration"; assetId: AssetId; durationId: DurationId };
	desktop: FeaturedAsyncState<FeaturedMarketPresentation<SourceId>>;
	mobile: FeaturedAsyncState<FeaturedMarketSummaryData<SourceId>>;
};

export type FeaturedEventMarket<
	EventId extends string = string,
	SourceId extends string = string,
> = {
	id: EventId;
	label: string;
	desktop: FeaturedAsyncState<FeaturedMarketPresentation<SourceId>>;
	mobile: FeaturedAsyncState<FeaturedMarketSummaryData<SourceId>>;
};

export type FeaturedMobileTab = "crypto" | "trending";

export type FeaturedMarketsProps<
	AssetId extends string = string,
	DurationId extends string = string,
	EventId extends string = string,
	SourceId extends string = string,
> = {
	assets: readonly FeaturedAsset<AssetId>[];
	durations: readonly FeaturedDuration<DurationId>[];
	durationMarkets: FeaturedAsyncState<
		readonly FeaturedDurationMarket<AssetId, DurationId, SourceId>[]
	>;
	events: FeaturedAsyncState<readonly FeaturedEventMarket<EventId, SourceId>[]>;
	selection: FeaturedMarketSelection<AssetId, DurationId, EventId>;
	onSelectionChange: (
		selection: FeaturedMarketSelection<AssetId, DurationId, EventId>,
	) => void;
	defaultAssetId: AssetId;
	defaultDurationId: DurationId;
	mobileTab: FeaturedMobileTab;
	onMobileTabChange: (tab: FeaturedMobileTab) => void;
	onBrowseAll?: () => void;
	className?: string;
};
