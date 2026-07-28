import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from "../Badge.js";
import { SegmentedControl } from "../SegmentedControl.js";
import { Skeleton } from "../Skeleton.js";
import { Stack } from "../Stack.js";
import { Surface } from "../Surface.js";
import { Text } from "../Text.js";
import { FeaturedMarketStatus } from "./FeaturedMarketStatus.js";
export function FeaturedAssetTabs({ assets, selectedAssetId, onAssetChange, isFading = false, }) {
    return (_jsx("div", { className: "at-featured-assets", "data-fading": isFading || undefined, role: "tablist", "aria-label": "Assets", children: assets.map((asset) => {
            const selected = asset.id === selectedAssetId;
            return (_jsxs("button", { "aria-selected": selected, "data-selected": selected || undefined, disabled: asset.disabled, onClick: () => onAssetChange(asset.id), role: "tab", type: "button", children: [_jsx("span", { children: asset.label }), asset.odds ? (_jsx(Badge, { tone: asset.odds.tone, children: asset.odds.label })) : (_jsx(Skeleton, { className: "at-featured-assets__placeholder", shape: "text" }))] }, asset.id));
        }) }));
}
export function FeaturedDurationList({ durations, selectedDurationId, onDurationChange, }) {
    return (_jsx(Stack, { className: "at-featured-nav-list", gap: "xs", children: durations.map((duration) => (_jsx(Surface, { as: "button", disabled: duration.disabled, onClick: () => onDurationChange(duration.id), selected: duration.id === selectedDurationId, variant: "ghost", children: duration.label }, duration.id))) }));
}
export function FeaturedEventList({ events, selectedEventId, onEventChange, }) {
    if (events.status !== "ready")
        return _jsx(FeaturedMarketStatus, { label: "trending markets", state: events });
    return (_jsx(Stack, { className: "at-featured-nav-list", gap: "xs", children: events.data.map((event) => (_jsx(Surface, { as: "button", onClick: () => onEventChange(event.id), selected: event.id === selectedEventId, variant: "ghost", children: _jsx(Text, { truncate: true, children: event.label }) }, event.id))) }));
}
export function FeaturedMarketsSidebar({ durations, selectedDurationId, onDurationChange, events, selectedEventId, onEventChange, }) {
    return (_jsxs("aside", { className: "at-featured-sidebar", "aria-label": "Featured market navigation", children: [_jsxs(Stack, { gap: "sm", children: [_jsx(Text, { size: "xs", tone: "secondary", weight: "bold", children: "CRYPTO UP OR DOWN" }), _jsx(FeaturedDurationList, { durations: durations, onDurationChange: onDurationChange, selectedDurationId: selectedDurationId })] }), _jsxs(Stack, { gap: "sm", children: [_jsx(Text, { size: "xs", tone: "secondary", weight: "bold", children: "TRENDING" }), _jsx(FeaturedEventList, { events: events, onEventChange: onEventChange, selectedEventId: selectedEventId })] })] }));
}
export function FeaturedSourceTabs({ value, sources, onValueChange, }) {
    if (sources.length < 2)
        return null;
    return (_jsx(SegmentedControl, { ariaLabel: "Market source", onValueChange: onValueChange, options: sources.map((source) => ({
            disabled: source.disabled,
            label: source.shortLabel ?? source.label,
            value: source.id,
        })), value: value }));
}
export function FeaturedMobileTabs({ value, onValueChange, }) {
    return (_jsx(SegmentedControl, { ariaLabel: "Featured markets", onValueChange: onValueChange, options: [
            { label: "Crypto Up or Down", value: "crypto" },
            { label: "Trending", value: "trending" },
        ], value: value }));
}
