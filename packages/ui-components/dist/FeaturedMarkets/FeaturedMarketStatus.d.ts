import type { FeaturedAsyncState } from "./types.js";
export type FeaturedMarketStatusProps<T> = {
    state: Exclude<FeaturedAsyncState<T>, {
        status: "ready";
    }>;
    label?: string;
    className?: string;
};
export declare function FeaturedMarketStatus<T>({ state, label, className, }: FeaturedMarketStatusProps<T>): import("react").JSX.Element;
//# sourceMappingURL=FeaturedMarketStatus.d.ts.map