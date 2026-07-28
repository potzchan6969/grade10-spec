import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
type SurfaceSharedProps = {
    children: ReactNode;
    className?: string;
    variant?: "panel" | "card" | "ghost";
    radius?: "none" | "small" | "medium";
    selected?: boolean;
};
export type SurfaceProps = SurfaceSharedProps & HTMLAttributes<HTMLDivElement> & {
    as?: "div";
};
export type SurfaceButtonProps = SurfaceSharedProps & ButtonHTMLAttributes<HTMLButtonElement> & {
    as: "button";
};
export declare function Surface({ children, className, variant, radius, selected, as, ...props }: SurfaceProps | SurfaceButtonProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Surface.d.ts.map