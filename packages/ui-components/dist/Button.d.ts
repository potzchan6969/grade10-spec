import type { ButtonHTMLAttributes, ReactNode } from "react";
export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    /** The label or content displayed inside the button. */
    children: ReactNode;
    /** A stable presentation hook for consuming design systems. */
    tone?: "neutral" | "primary" | "danger";
};
/**
 * A controlled, semantic button primitive. Visual styling belongs to the
 * consuming application's design system through the emitted data attribute.
 */
export declare function Button({ children, tone, type, ...props }: ButtonProps): import("react").JSX.Element;
//# sourceMappingURL=Button.d.ts.map