import { Button } from "../Button.js";
import { Stack } from "../Stack.js";
import { Surface } from "../Surface.js";
import { Text } from "../Text.js";
import { FeaturedMarketLineChart } from "./chart-runtime/FeaturedMarketLineChart.js";
import { FeaturedSourceTabs } from "./FeaturedMarketNavigation.js";
import { FeaturedMarketStatus } from "./FeaturedMarketStatus.js";
import type {
	FeaturedAsyncState,
	FeaturedMarketOutcome,
	FeaturedMarketPresentation,
	FeaturedMarketSummaryData,
} from "./types.js";

export type FeaturedMarketHeaderProps = {
	header: FeaturedMarketSummaryData["header"];
};

export function FeaturedMarketHeader({ header }: FeaturedMarketHeaderProps) {
	return (
		<header className="at-market-header">
			{header.imageUrl ? (
				<img alt={header.imageAlt ?? ""} src={header.imageUrl} />
			) : header.imageFallback ? (
				<span className="at-market-header__fallback">
					{header.imageFallback}
				</span>
			) : null}
			<Stack gap="xs">
				<Text as="h3" size="lg" weight="medium">
					{header.title}
				</Text>
				{header.statusLabel ? (
					<Text size="sm" tone="secondary">
						{header.statusLabel}
					</Text>
				) : null}
				{header.periodLabel ? (
					<Text size="xs" tone="muted">
						{header.periodLabel}
					</Text>
				) : null}
			</Stack>
			{header.action ? (
				<Button
					aria-label={header.action.label}
					disabled={header.action.disabled}
					iconOnly
					onClick={header.action.onAction}
					variant="ghost"
				>
					↗
				</Button>
			) : null}
		</header>
	);
}

export type FeaturedMarketStatsProps = {
	stats: FeaturedMarketSummaryData["stats"];
};

export function FeaturedMarketStats({ stats }: FeaturedMarketStatsProps) {
	return (
		<div className="at-market-stats">
			{stats.map((stat) => (
				<div key={stat.label}>
					<Text data-tone={stat.tone ?? "primary"} size="base" weight="medium">
						{stat.value}
					</Text>
					<Text size="xs" tone="secondary">
						{stat.label}
					</Text>
				</div>
			))}
		</div>
	);
}

function OutcomeRow<SourceId extends string>({
	outcome,
	visibleSourceId,
}: {
	outcome: FeaturedMarketOutcome<SourceId>;
	visibleSourceId?: SourceId;
}) {
	const values = visibleSourceId
		? outcome.values.filter((value) => value.sourceId === visibleSourceId)
		: outcome.values;
	return (
		<div className="at-market-outcome">
			<Text weight="medium">{outcome.label}</Text>
			<div className="at-market-outcome__values">
				{values.map((value) => (
					<Text
						data-state={value.state ?? "active"}
						data-tone={value.tone ?? "primary"}
						key={value.sourceId}
						size="sm"
					>
						{value.resolvedLabel ?? value.value}
					</Text>
				))}
			</div>
		</div>
	);
}

export type FeaturedMarketOutcomeListProps<SourceId extends string> = {
	outcomes: readonly FeaturedMarketOutcome<SourceId>[];
	visibleSourceId?: SourceId;
};

export function FeaturedMarketOutcomeList<SourceId extends string>({
	outcomes,
	visibleSourceId,
}: FeaturedMarketOutcomeListProps<SourceId>) {
	return (
		<div className="at-market-outcomes">
			{outcomes.map((outcome) => (
				<OutcomeRow
					key={outcome.id}
					outcome={outcome}
					visibleSourceId={visibleSourceId}
				/>
			))}
		</div>
	);
}

export function FeaturedMarketInsight({ insight }: { insight?: string }) {
	if (!insight) return null;
	return (
		<Text as="p" className="at-market-insight" size="sm" tone="secondary">
			<strong>Insight: </strong>
			{insight}
		</Text>
	);
}

export type FeaturedMarketSummaryCardProps<SourceId extends string> = {
	data: FeaturedMarketSummaryData<SourceId>;
	className?: string;
};

export function FeaturedMarketSummaryCard<SourceId extends string>({
	data,
	className,
}: FeaturedMarketSummaryCardProps<SourceId>) {
	return (
		<Surface
			className={["at-market-summary-card", className]
				.filter(Boolean)
				.join(" ")}
			variant="card"
		>
			<FeaturedMarketHeader header={data.header} />
			{data.sourceSelection ? (
				<FeaturedSourceTabs {...data.sourceSelection} />
			) : null}
			<FeaturedMarketStats stats={data.stats} />
			<FeaturedMarketOutcomeList
				outcomes={data.outcomes}
				visibleSourceId={data.sourceSelection?.value}
			/>
			<FeaturedMarketInsight insight={data.insight} />
			{data.primaryAction || data.secondaryAction ? (
				<div className="at-market-summary-card__actions">
					{data.primaryAction ? (
						<Button
							disabled={data.primaryAction.disabled}
							onClick={data.primaryAction.onAction}
							variant="secondary"
						>
							{data.primaryAction.label}
						</Button>
					) : null}
					{data.secondaryAction ? (
						<Button
							aria-label={data.secondaryAction.label}
							disabled={data.secondaryAction.disabled}
							iconOnly
							onClick={data.secondaryAction.onAction}
							variant="ghost"
						>
							↗
						</Button>
					) : null}
				</div>
			) : null}
		</Surface>
	);
}

export type FeaturedMarketChartCardProps<SourceId extends string> = {
	data: Extract<FeaturedMarketPresentation<SourceId>, { kind: "chart" }>;
	className?: string;
};

export function FeaturedMarketChartCard<SourceId extends string>({
	data,
	className,
}: FeaturedMarketChartCardProps<SourceId>) {
	return (
		<Surface
			className={["at-market-chart-card", className].filter(Boolean).join(" ")}
			variant="card"
		>
			<FeaturedMarketHeader header={data.summary.header} />
			<FeaturedMarketStats stats={data.summary.stats} />
			{data.summary.sourceSelection ? (
				<FeaturedSourceTabs {...data.summary.sourceSelection} />
			) : null}
			<FeaturedMarketLineChart state={data.chart} />
			<FeaturedMarketOutcomeList
				outcomes={data.summary.outcomes}
				visibleSourceId={data.summary.sourceSelection?.value}
			/>
			<FeaturedMarketInsight insight={data.summary.insight} />
		</Surface>
	);
}

export type FeaturedMarketContentProps<SourceId extends string> = {
	state: FeaturedAsyncState<FeaturedMarketPresentation<SourceId>>;
	className?: string;
};

export function FeaturedMarketContent<SourceId extends string>({
	state,
	className,
}: FeaturedMarketContentProps<SourceId>) {
	if (state.status !== "ready")
		return <FeaturedMarketStatus className={className} state={state} />;
	return state.data.kind === "chart" ? (
		<FeaturedMarketChartCard className={className} data={state.data} />
	) : (
		<FeaturedMarketSummaryCard
			className={className}
			data={state.data.summary}
		/>
	);
}
