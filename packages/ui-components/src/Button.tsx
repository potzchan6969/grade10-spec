import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"children"
> & {
	/** The label or content displayed inside the button. */
	children: ReactNode;
	/** A stable presentation hook for consuming design systems. */
	tone?: "neutral" | "primary" | "danger";
};

/**
 * A controlled, semantic button primitive. Visual styling belongs to the
 * consuming application's design system through the emitted data attribute.
 */
export function Button({
	children,
	tone = "primary",
	type = "button",
	...props
}: ButtonProps) {
	return (
		<button data-tone={tone} type={type} {...props}>
			{children}
		</button>
	);
}
