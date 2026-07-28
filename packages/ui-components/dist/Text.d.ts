import type { HTMLAttributes, ReactNode } from "react";
export type TextProps = HTMLAttributes<HTMLElement> & {
    children: ReactNode;
    as?: "span" | "p" | "div" | "h2" | "h3";
    size?: "xs" | "sm" | "base" | "lg" | "xl";
    weight?: "regular" | "medium" | "bold";
    tone?: "primary" | "secondary" | "muted" | "success" | "error";
    truncate?: boolean;
};
export declare function Text({ children, as: Tag, size, weight, tone, truncate, className, ...props }: TextProps): import("react").JSX.Element;
//# sourceMappingURL=Text.d.ts.map