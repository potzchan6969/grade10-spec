import { Card } from "@acetrader/design-system/components/display/card";
import { Text } from "@acetrader/design-system/components/display/text";
import { Button } from "@acetrader/design-system/components/forms/button";
import { Stack } from "@acetrader/design-system/components/layout/stack";
import { cn } from "../lib/utils.js";
import { FeaturedMarketLineChart } from "./chart-runtime/FeaturedMarketLineChart.js";
import { FeaturedSourceTabs } from "./FeaturedMarketNavigation.js";
import { FeaturedMarketStatus } from "./FeaturedMarketStatus.js";
import type {
  FeaturedAsyncState,
  FeaturedMarketOutcome,
  FeaturedMarketPresentation,
  FeaturedMarketSummaryData,
} from "./types.js";

/** The design system has no icon-only rung, so the square is applied here. */
const iconButton = "aspect-square px-0";

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
          className={cn("ml-auto", iconButton)}
          disabled={header.action.disabled}
          onClick={header.action.onAction}
          size="sm"
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
          <Text size="base" tone={stat.tone ?? "primary"} weight="medium">
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
            key={value.sourceId}
            size="sm"
            tone={value.tone ?? "primary"}
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
    <Card className={cn("at-market-summary-card", className)}>
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
              className="flex-1"
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
              className={iconButton}
              disabled={data.secondaryAction.disabled}
              onClick={data.secondaryAction.onAction}
              variant="ghost"
            >
              ↗
            </Button>
          ) : null}
        </div>
      ) : null}
    </Card>
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
    <Card className={cn("at-market-chart-card", className)}>
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
    </Card>
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
