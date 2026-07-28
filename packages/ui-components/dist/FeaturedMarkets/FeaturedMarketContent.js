import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "../Button.js";
import { Stack } from "../Stack.js";
import { Surface } from "../Surface.js";
import { Text } from "../Text.js";
import { FeaturedMarketLineChart } from "./chart-runtime/FeaturedMarketLineChart.js";
import { FeaturedSourceTabs } from "./FeaturedMarketNavigation.js";
import { FeaturedMarketStatus } from "./FeaturedMarketStatus.js";
export function FeaturedMarketHeader({ header }) {
    return (_jsxs("header", { className: "at-market-header", children: [header.imageUrl ? (_jsx("img", { alt: header.imageAlt ?? "", src: header.imageUrl })) : header.imageFallback ? (_jsx("span", { className: "at-market-header__fallback", children: header.imageFallback })) : null, _jsxs(Stack, { gap: "xs", children: [_jsx(Text, { as: "h3", size: "lg", weight: "medium", children: header.title }), header.statusLabel ? (_jsx(Text, { size: "sm", tone: "secondary", children: header.statusLabel })) : null, header.periodLabel ? (_jsx(Text, { size: "xs", tone: "muted", children: header.periodLabel })) : null] }), header.action ? (_jsx(Button, { "aria-label": header.action.label, disabled: header.action.disabled, iconOnly: true, onClick: header.action.onAction, variant: "ghost", children: "\u2197" })) : null] }));
}
export function FeaturedMarketStats({ stats }) {
    return (_jsx("div", { className: "at-market-stats", children: stats.map((stat) => (_jsxs("div", { children: [_jsx(Text, { "data-tone": stat.tone ?? "primary", size: "base", weight: "medium", children: stat.value }), _jsx(Text, { size: "xs", tone: "secondary", children: stat.label })] }, stat.label))) }));
}
function OutcomeRow({ outcome, visibleSourceId, }) {
    const values = visibleSourceId
        ? outcome.values.filter((value) => value.sourceId === visibleSourceId)
        : outcome.values;
    return (_jsxs("div", { className: "at-market-outcome", children: [_jsx(Text, { weight: "medium", children: outcome.label }), _jsx("div", { className: "at-market-outcome__values", children: values.map((value) => (_jsx(Text, { "data-state": value.state ?? "active", "data-tone": value.tone ?? "primary", size: "sm", children: value.resolvedLabel ?? value.value }, value.sourceId))) })] }));
}
export function FeaturedMarketOutcomeList({ outcomes, visibleSourceId, }) {
    return (_jsx("div", { className: "at-market-outcomes", children: outcomes.map((outcome) => (_jsx(OutcomeRow, { outcome: outcome, visibleSourceId: visibleSourceId }, outcome.id))) }));
}
export function FeaturedMarketInsight({ insight }) {
    if (!insight)
        return null;
    return (_jsxs(Text, { as: "p", className: "at-market-insight", size: "sm", tone: "secondary", children: [_jsx("strong", { children: "Insight: " }), insight] }));
}
export function FeaturedMarketSummaryCard({ data, className, }) {
    return (_jsxs(Surface, { className: ["at-market-summary-card", className]
            .filter(Boolean)
            .join(" "), variant: "card", children: [_jsx(FeaturedMarketHeader, { header: data.header }), data.sourceSelection ? (_jsx(FeaturedSourceTabs, { ...data.sourceSelection })) : null, _jsx(FeaturedMarketStats, { stats: data.stats }), _jsx(FeaturedMarketOutcomeList, { outcomes: data.outcomes, visibleSourceId: data.sourceSelection?.value }), _jsx(FeaturedMarketInsight, { insight: data.insight }), data.primaryAction || data.secondaryAction ? (_jsxs("div", { className: "at-market-summary-card__actions", children: [data.primaryAction ? (_jsx(Button, { disabled: data.primaryAction.disabled, onClick: data.primaryAction.onAction, variant: "secondary", children: data.primaryAction.label })) : null, data.secondaryAction ? (_jsx(Button, { "aria-label": data.secondaryAction.label, disabled: data.secondaryAction.disabled, iconOnly: true, onClick: data.secondaryAction.onAction, variant: "ghost", children: "\u2197" })) : null] })) : null] }));
}
export function FeaturedMarketChartCard({ data, className, }) {
    return (_jsxs(Surface, { className: ["at-market-chart-card", className].filter(Boolean).join(" "), variant: "card", children: [_jsx(FeaturedMarketHeader, { header: data.summary.header }), _jsx(FeaturedMarketStats, { stats: data.summary.stats }), data.summary.sourceSelection ? (_jsx(FeaturedSourceTabs, { ...data.summary.sourceSelection })) : null, _jsx(FeaturedMarketLineChart, { state: data.chart }), _jsx(FeaturedMarketOutcomeList, { outcomes: data.summary.outcomes, visibleSourceId: data.summary.sourceSelection?.value }), _jsx(FeaturedMarketInsight, { insight: data.summary.insight })] }));
}
export function FeaturedMarketContent({ state, className, }) {
    if (state.status !== "ready")
        return _jsx(FeaturedMarketStatus, { className: className, state: state });
    return state.data.kind === "chart" ? (_jsx(FeaturedMarketChartCard, { className: className, data: state.data })) : (_jsx(FeaturedMarketSummaryCard, { className: className, data: state.data.summary }));
}
