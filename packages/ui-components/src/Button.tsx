import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"children"
> & {
	/** The label or content displayed inside the button. */
	children: ReactNode;
	/** A stable presentation hook for consuming design systems. */
	tone?: "neutral" | "primary" | "danger";
	/** Stakeland-compatible visual treatment. */
	variant?: "primary" | "secondary" | "ghost";
	/** Compact buttons are suitable for toolbar and card actions. */
	size?: "small" | "medium";
	/** Makes an icon-only action discoverable to styles and assistive tooling. */
	iconOnly?: boolean;
};

/**
 * A controlled, semantic button primitive. Visual styling belongs to the
 * consuming application's design system through the emitted data attribute.
 */
export function Button({
	children,
	tone = "primary",
	variant = "primary",
	size = "medium",
	iconOnly = false,
	type = "button",
	...props
}: ButtonProps) {
	return (
		<button
			className="at-button"
			data-icon-only={iconOnly || undefined}
			data-size={size}
			data-tone={tone}
			data-variant={variant}
			type={type}
			{...props}
		>
			{children}
		</button>
	);
}
