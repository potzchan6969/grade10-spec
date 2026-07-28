import type { FeaturedAsyncState, FeaturedMarketChartData } from "../types.js";
export type FeaturedMarketLineChartProps = {
    state: FeaturedAsyncState<FeaturedMarketChartData>;
    className?: string;
};
/**
 * The sole DOM-backed runtime in the package. It owns an ECharts instance but
 * receives every chart value through props; it never subscribes to data.
 */
export declare function FeaturedMarketLineChart({ state, className, }: FeaturedMarketLineChartProps): import("react").JSX.Element;
//# sourceMappingURL=FeaturedMarketLineChart.d.ts.map