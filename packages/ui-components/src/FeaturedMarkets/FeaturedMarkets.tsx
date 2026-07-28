import type { ReactNode } from "react";
import { Button } from "../Button.js";
import { Stack } from "../Stack.js";
import { Surface } from "../Surface.js";
import {
  FeaturedMarketContent,
  FeaturedMarketSummaryCard,
} from "./FeaturedMarketContent.js";
import {
  FeaturedAssetTabs,
  FeaturedMarketsSidebar,
  FeaturedMobileTabs,
} from "./FeaturedMarketNavigation.js";
import { FeaturedMarketStatus } from "./FeaturedMarketStatus.js";
import type {
  FeaturedAsyncState,
  FeaturedDurationMarket,
  FeaturedEventMarket,
  FeaturedMarketPresentation,
  FeaturedMarketSelection,
  FeaturedMarketSummaryData,
  FeaturedMarketsProps,
  FeaturedMobileTab,
} from "./types.js";

function selectedDurationState<
  AssetId extends string,
  DurationId extends string,
  SourceId extends string,
>(
  markets: FeaturedAsyncState<
    readonly FeaturedDurationMarket<AssetId, DurationId, SourceId>[]
  >,
  selection: Extract<
    FeaturedMarketSelection<AssetId, DurationId>,
    { kind: "duration" }
  >,
): FeaturedAsyncState<FeaturedMarketPresentation<SourceId>> {
  if (markets.status !== "ready") return markets;
  return (
    markets.data.find(
      (market) =>
        market.selection.assetId === selection.assetId &&
        market.selection.durationId === selection.durationId,
    )?.desktop ?? {
      message: "This duration market is not available.",
      status: "empty",
    }
  );
}

function selectedEventState<EventId extends string, SourceId extends string>(
  events: FeaturedAsyncState<readonly FeaturedEventMarket<EventId, SourceId>[]>,
  eventId: EventId,
): FeaturedAsyncState<FeaturedMarketPresentation<SourceId>> {
  if (events.status !== "ready") return events;
  return (
    events.data.find((event) => event.id === eventId)?.desktop ?? {
      message: "This trending market is not available.",
      status: "empty",
    }
  );
}

export type FeaturedMarketsPanelProps<
  DurationId extends string,
  EventId extends string,
  SourceId extends string,
> = {
  sidebar: ReactNode;
  selection: FeaturedMarketSelection<string, DurationId, EventId>;
  content: FeaturedAsyncState<FeaturedMarketPresentation<SourceId>>;
  assetTabs?: ReactNode;
  className?: string;
};

export function FeaturedMarketsPanel<
  DurationId extends string,
  EventId extends string,
  SourceId extends string,
>({
  sidebar,
  selection,
  content,
  assetTabs,
  className,
}: FeaturedMarketsPanelProps<DurationId, EventId, SourceId>) {
  return (
    <Surface
      className={["at-featured-panel", className].filter(Boolean).join(" ")}
      data-selection={selection.kind}
      variant="panel"
    >
      {sidebar}
      <main className="at-featured-panel__content">
        {selection.kind === "duration" ? assetTabs : null}
        <FeaturedMarketContent state={content} />
      </main>
    </Surface>
  );
}

export type FeaturedMarketsDesktopProps<
  AssetId extends string,
  DurationId extends string,
  EventId extends string,
  SourceId extends string,
> = Omit<
  FeaturedMarketsProps<AssetId, DurationId, EventId, SourceId>,
  "mobileTab" | "onMobileTabChange" | "onBrowseAll"
>;

export function FeaturedMarketsDesktop<
  AssetId extends string,
  DurationId extends string,
  EventId extends string,
  SourceId extends string,
>(props: FeaturedMarketsDesktopProps<AssetId, DurationId, EventId, SourceId>) {
  const durationSelection =
    props.selection.kind === "duration" ? props.selection : undefined;
  const eventSelection =
    props.selection.kind === "event" ? props.selection : undefined;
  const content = durationSelection
    ? selectedDurationState(props.durationMarkets, durationSelection)
    : selectedEventState(props.events, eventSelection?.eventId as EventId);
  const selectedAssetId = durationSelection?.assetId ?? props.defaultAssetId;
  const selectedDurationId = durationSelection?.durationId;

  return (
    <div className="at-featured-desktop">
      <FeaturedMarketsPanel
        assetTabs={
          <FeaturedAssetTabs
            assets={props.assets}
            onAssetChange={(assetId) =>
              props.onSelectionChange({
                assetId,
                durationId: selectedDurationId ?? props.defaultDurationId,
                kind: "duration",
              })
            }
            selectedAssetId={selectedAssetId}
          />
        }
        content={content}
        selection={props.selection}
        sidebar={
          <FeaturedMarketsSidebar
            durations={props.durations}
            events={props.events}
            onDurationChange={(durationId) =>
              props.onSelectionChange({
                assetId: selectedAssetId,
                durationId,
                kind: "duration",
              })
            }
            onEventChange={(eventId) =>
              props.onSelectionChange({ eventId, kind: "event" })
            }
            selectedDurationId={selectedDurationId}
            selectedEventId={eventSelection?.eventId}
          />
        }
      />
    </div>
  );
}

function mobileDurationCards<
  AssetId extends string,
  DurationId extends string,
  SourceId extends string,
>(
  state: FeaturedAsyncState<
    readonly FeaturedDurationMarket<AssetId, DurationId, SourceId>[]
  >,
  assetId: AssetId,
): FeaturedAsyncState<readonly FeaturedMarketSummaryData<SourceId>[]> {
  if (state.status !== "ready") return state;
  return {
    data: state.data
      .filter((market) => market.selection.assetId === assetId)
      .map((market) => market.mobile)
      .filter(
        (
          market,
        ): market is {
          status: "ready";
          data: FeaturedMarketSummaryData<SourceId>;
        } => market.status === "ready",
      )
      .map((market) => market.data),
    status: "ready",
  };
}

function mobileEventCards<EventId extends string, SourceId extends string>(
  state: FeaturedAsyncState<readonly FeaturedEventMarket<EventId, SourceId>[]>,
): FeaturedAsyncState<readonly FeaturedMarketSummaryData<SourceId>[]> {
  if (state.status !== "ready") return state;
  return {
    data: state.data
      .map((event) => event.mobile)
      .filter(
        (
          event,
        ): event is {
          status: "ready";
          data: FeaturedMarketSummaryData<SourceId>;
        } => event.status === "ready",
      )
      .map((event) => event.data),
    status: "ready",
  };
}

export type FeaturedMarketsMobileProps<
  AssetId extends string,
  DurationId extends string,
  EventId extends string,
  SourceId extends string,
> = Pick<
  FeaturedMarketsProps<AssetId, DurationId, EventId, SourceId>,
  | "assets"
  | "defaultAssetId"
  | "defaultDurationId"
  | "durationMarkets"
  | "events"
  | "mobileTab"
  | "onBrowseAll"
  | "onMobileTabChange"
  | "onSelectionChange"
  | "selection"
>;

export function FeaturedMarketsMobile<
  AssetId extends string,
  DurationId extends string,
  EventId extends string,
  SourceId extends string,
>(props: FeaturedMarketsMobileProps<AssetId, DurationId, EventId, SourceId>) {
  const assetId =
    props.selection.kind === "duration"
      ? props.selection.assetId
      : props.defaultAssetId;
  const durationCards = mobileDurationCards(props.durationMarkets, assetId);
  const eventCards = mobileEventCards(props.events);
  const cards = props.mobileTab === "crypto" ? durationCards : eventCards;

  return (
    <div className="at-featured-mobile">
      <FeaturedMobileTabs
        onValueChange={props.onMobileTabChange}
        value={props.mobileTab}
      />
      {props.mobileTab === "crypto" ? (
        <Surface className="at-featured-mobile__crypto" variant="panel">
          <FeaturedAssetTabs
            assets={props.assets}
            onAssetChange={(nextAssetId) =>
              props.onSelectionChange({
                assetId: nextAssetId,
                durationId: props.defaultDurationId,
                kind: "duration",
              })
            }
            selectedAssetId={assetId}
          />
          <MobileCards state={cards} />
        </Surface>
      ) : (
        <MobileCards state={cards} />
      )}
      {props.onBrowseAll ? (
        <Stack align="center" className="at-featured-mobile__browse" gap="sm">
          <Button onClick={props.onBrowseAll} variant="secondary">
            Browse All
          </Button>
        </Stack>
      ) : null}
    </div>
  );
}

function MobileCards<SourceId extends string>({
  state,
}: {
  state: FeaturedAsyncState<readonly FeaturedMarketSummaryData<SourceId>[]>;
}) {
  if (state.status !== "ready")
    return <FeaturedMarketStatus label="featured markets" state={state} />;
  if (state.data.length === 0)
    return (
      <FeaturedMarketStatus
        label="featured markets"
        state={{ message: "No featured markets right now.", status: "empty" }}
      />
    );
  return (
    <Stack className="at-featured-mobile__cards" gap="md">
      {state.data.map((card) => (
        <FeaturedMarketSummaryCard data={card} key={card.header.title} />
      ))}
    </Stack>
  );
}

export function FeaturedMarkets<
  AssetId extends string,
  DurationId extends string,
  EventId extends string,
  SourceId extends string,
>(props: FeaturedMarketsProps<AssetId, DurationId, EventId, SourceId>) {
  return (
    <section
      className={["at-featured-markets", props.className]
        .filter(Boolean)
        .join(" ")}
    >
      <FeaturedMarketsDesktop {...props} />
      <FeaturedMarketsMobile {...props} />
    </section>
  );
}

export type { FeaturedMobileTab };
