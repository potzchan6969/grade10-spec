import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "../Button.js";
import { Stack } from "../Stack.js";
import { Surface } from "../Surface.js";
import { FeaturedMarketContent, FeaturedMarketSummaryCard, } from "./FeaturedMarketContent.js";
import { FeaturedAssetTabs, FeaturedMarketsSidebar, FeaturedMobileTabs, } from "./FeaturedMarketNavigation.js";
import { FeaturedMarketStatus } from "./FeaturedMarketStatus.js";
function selectedDurationState(markets, selection) {
    if (markets.status !== "ready")
        return markets;
    return (markets.data.find((market) => market.selection.assetId === selection.assetId &&
        market.selection.durationId === selection.durationId)?.desktop ?? {
        message: "This duration market is not available.",
        status: "empty",
    });
}
function selectedEventState(events, eventId) {
    if (events.status !== "ready")
        return events;
    return (events.data.find((event) => event.id === eventId)?.desktop ?? {
        message: "This trending market is not available.",
        status: "empty",
    });
}
export function FeaturedMarketsPanel({ sidebar, selection, content, assetTabs, className, }) {
    return (_jsxs(Surface, { className: ["at-featured-panel", className].filter(Boolean).join(" "), "data-selection": selection.kind, variant: "panel", children: [sidebar, _jsxs("main", { className: "at-featured-panel__content", children: [selection.kind === "duration" ? assetTabs : null, _jsx(FeaturedMarketContent, { state: content })] })] }));
}
export function FeaturedMarketsDesktop(props) {
    const durationSelection = props.selection.kind === "duration" ? props.selection : undefined;
    const eventSelection = props.selection.kind === "event" ? props.selection : undefined;
    const content = durationSelection
        ? selectedDurationState(props.durationMarkets, durationSelection)
        : selectedEventState(props.events, eventSelection?.eventId);
    const selectedAssetId = durationSelection?.assetId ?? props.defaultAssetId;
    const selectedDurationId = durationSelection?.durationId;
    return (_jsx("div", { className: "at-featured-desktop", children: _jsx(FeaturedMarketsPanel, { assetTabs: _jsx(FeaturedAssetTabs, { assets: props.assets, onAssetChange: (assetId) => props.onSelectionChange({
                    assetId,
                    durationId: selectedDurationId ?? props.defaultDurationId,
                    kind: "duration",
                }), selectedAssetId: selectedAssetId }), content: content, selection: props.selection, sidebar: _jsx(FeaturedMarketsSidebar, { durations: props.durations, events: props.events, onDurationChange: (durationId) => props.onSelectionChange({
                    assetId: selectedAssetId,
                    durationId,
                    kind: "duration",
                }), onEventChange: (eventId) => props.onSelectionChange({ eventId, kind: "event" }), selectedDurationId: selectedDurationId, selectedEventId: eventSelection?.eventId }) }) }));
}
function mobileDurationCards(state, assetId) {
    if (state.status !== "ready")
        return state;
    return {
        data: state.data
            .filter((market) => market.selection.assetId === assetId)
            .map((market) => market.mobile)
            .filter((market) => market.status === "ready")
            .map((market) => market.data),
        status: "ready",
    };
}
function mobileEventCards(state) {
    if (state.status !== "ready")
        return state;
    return {
        data: state.data
            .map((event) => event.mobile)
            .filter((event) => event.status === "ready")
            .map((event) => event.data),
        status: "ready",
    };
}
export function FeaturedMarketsMobile(props) {
    const assetId = props.selection.kind === "duration"
        ? props.selection.assetId
        : props.defaultAssetId;
    const durationCards = mobileDurationCards(props.durationMarkets, assetId);
    const eventCards = mobileEventCards(props.events);
    const cards = props.mobileTab === "crypto" ? durationCards : eventCards;
    return (_jsxs("div", { className: "at-featured-mobile", children: [_jsx(FeaturedMobileTabs, { onValueChange: props.onMobileTabChange, value: props.mobileTab }), props.mobileTab === "crypto" ? (_jsxs(Surface, { className: "at-featured-mobile__crypto", variant: "panel", children: [_jsx(FeaturedAssetTabs, { assets: props.assets, onAssetChange: (nextAssetId) => props.onSelectionChange({
                            assetId: nextAssetId,
                            durationId: props.defaultDurationId,
                            kind: "duration",
                        }), selectedAssetId: assetId }), _jsx(MobileCards, { state: cards })] })) : (_jsx(MobileCards, { state: cards })), props.onBrowseAll ? (_jsx(Stack, { align: "center", className: "at-featured-mobile__browse", gap: "sm", children: _jsx(Button, { onClick: props.onBrowseAll, variant: "secondary", children: "Browse All" }) })) : null] }));
}
function MobileCards({ state, }) {
    if (state.status !== "ready")
        return _jsx(FeaturedMarketStatus, { label: "featured markets", state: state });
    if (state.data.length === 0)
        return (_jsx(FeaturedMarketStatus, { label: "featured markets", state: { message: "No featured markets right now.", status: "empty" } }));
    return (_jsx(Stack, { className: "at-featured-mobile__cards", gap: "md", children: state.data.map((card) => (_jsx(FeaturedMarketSummaryCard, { data: card }, card.header.title))) }));
}
export function FeaturedMarkets(props) {
    return (_jsxs("section", { className: ["at-featured-markets", props.className]
            .filter(Boolean)
            .join(" "), children: [_jsx(FeaturedMarketsDesktop, { ...props }), _jsx(FeaturedMarketsMobile, { ...props })] }));
}
