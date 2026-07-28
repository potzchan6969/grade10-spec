import type { HTMLAttributes, ReactNode } from "react";
export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    children: ReactNode;
    tone?: "neutral" | "success" | "error";
    leading?: ReactNode;
};
export declare function Badge({ children, tone, leading, className, ...props }: BadgeProps): import("react").JSX.Element;
//# sourceMappingURL=Badge.d.ts.map