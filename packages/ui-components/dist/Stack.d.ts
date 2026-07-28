import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
export type StackProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    direction?: "horizontal" | "vertical";
    gap?: "none" | "xs" | "sm" | "md" | "lg";
    align?: CSSProperties["alignItems"];
    justify?: CSSProperties["justifyContent"];
    wrap?: boolean;
};
export declare function Stack({ children, direction, gap, align, justify, wrap, style, ...props }: StackProps): import("react").JSX.Element;
//# sourceMappingURL=Stack.d.ts.map