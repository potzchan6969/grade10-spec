import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type StackProps = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode;
	direction?: "horizontal" | "vertical";
	gap?: "none" | "xs" | "sm" | "md" | "lg";
	align?: CSSProperties["alignItems"];
	justify?: CSSProperties["justifyContent"];
	wrap?: boolean;
};

export function Stack({
	children,
	direction = "vertical",
	gap = "md",
	align,
	justify,
	wrap = false,
	style,
	...props
}: StackProps) {
	return (
		<div
			className="at-stack"
			data-direction={direction}
			data-gap={gap}
			style={{
				alignItems: align,
				flexWrap: wrap ? "wrap" : undefined,
				justifyContent: justify,
				...style,
			}}
			{...props}
		>
			{children}
		</div>
	);
}
