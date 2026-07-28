import { jsx as _jsx } from "react/jsx-runtime";
import { LineChart, ScatterChart } from "echarts/charts";
import { GridComponent, MarkLineComponent, TooltipComponent, } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useRef } from "react";
import { FeaturedMarketStatus } from "../FeaturedMarketStatus.js";
echarts.use([
    CanvasRenderer,
    GridComponent,
    LineChart,
    MarkLineComponent,
    ScatterChart,
    TooltipComponent,
]);
/**
 * The sole DOM-backed runtime in the package. It owns an ECharts instance but
 * receives every chart value through props; it never subscribes to data.
 */
export function FeaturedMarketLineChart({ state, className, }) {
    const elementRef = useRef(null);
    const chartRef = useRef(null);
    useEffect(() => {
        if (!elementRef.current || state.status !== "ready")
            return;
        const chart = echarts.init(elementRef.current, undefined, {
            renderer: "canvas",
        });
        chartRef.current = chart;
        const observer = new ResizeObserver(() => chart.resize());
        observer.observe(elementRef.current);
        return () => {
            observer.disconnect();
            chart.dispose();
            chartRef.current = null;
        };
    }, [state.status]);
    useEffect(() => {
        if (state.status !== "ready" || !chartRef.current)
            return;
        const { currentValue, precision = 2, referenceValue, series, trend = "neutral", } = state.data;
        const lineColor = trend === "up" ? "#4ade80" : trend === "down" ? "#fb7185" : "#a78bfa";
        const formatter = new Intl.NumberFormat(undefined, {
            maximumFractionDigits: precision,
            minimumFractionDigits: precision,
        });
        chartRef.current.setOption({
            animation: true,
            backgroundColor: "transparent",
            grid: { bottom: 28, left: 12, right: 12, top: 16 },
            tooltip: {
                axisPointer: { type: "line" },
                formatter: (params) => {
                    const row = Array.isArray(params) ? params[0] : params;
                    const value = typeof row === "object" && row !== null && "value" in row
                        ? row.value[1]
                        : 0;
                    return formatter.format(value);
                },
                trigger: "axis",
            },
            xAxis: {
                axisLabel: {
                    color: "#94a3b8",
                    formatter: (value) => new Date(value).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
                axisLine: { lineStyle: { color: "#334155" } },
                type: "time",
            },
            yAxis: {
                axisLabel: {
                    color: "#94a3b8",
                    formatter: (value) => formatter.format(value),
                },
                splitLine: { lineStyle: { color: "#1e293b" } },
                type: "value",
            },
            series: [
                {
                    data: series.map((point) => [point.timestamp, point.value]),
                    id: "price",
                    lineStyle: { color: lineColor, width: 2 },
                    markLine: referenceValue === undefined
                        ? undefined
                        : {
                            data: [
                                {
                                    label: {
                                        formatter: `Reference ${formatter.format(referenceValue)}`,
                                    },
                                    yAxis: referenceValue,
                                },
                            ],
                            lineStyle: { color: "#fbbf24", type: "dashed" },
                        },
                    showSymbol: false,
                    type: "line",
                },
                ...(currentValue === undefined
                    ? []
                    : [
                        {
                            data: series.length
                                ? [[series.at(-1)?.timestamp, currentValue]]
                                : [],
                            id: "current",
                            itemStyle: { color: lineColor },
                            symbol: "circle",
                            symbolSize: 8,
                            type: "scatter",
                        },
                    ]),
            ],
        });
    }, [state]);
    if (state.status !== "ready")
        return (_jsx(FeaturedMarketStatus, { className: className, label: "chart data", state: state }));
    return (_jsx("div", { "aria-label": state.data.ariaLabel, className: ["at-featured-chart", className].filter(Boolean).join(" "), role: "img", style: { height: state.data.height ?? 272 }, children: _jsx("div", { ref: elementRef }) }));
}
