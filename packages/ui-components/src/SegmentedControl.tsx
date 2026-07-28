import type { ReactNode } from "react";

export type SegmentedControlOption<Value extends string> = {
	value: Value;
	label: ReactNode;
	disabled?: boolean;
	ariaLabel?: string;
};

export type SegmentedControlProps<Value extends string> = {
	value: Value;
	onValueChange: (value: Value) => void;
	options: readonly SegmentedControlOption<Value>[];
	ariaLabel: string;
	className?: string;
};

export function SegmentedControl<Value extends string>({
	value,
	onValueChange,
	options,
	ariaLabel,
	className,
}: SegmentedControlProps<Value>) {
	return (
		<div
			aria-label={ariaLabel}
			className={["at-segmented-control", className].filter(Boolean).join(" ")}
			role="tablist"
		>
			{options.map((option) => {
				const selected = option.value === value;
				return (
					<button
						aria-label={option.ariaLabel}
						aria-selected={selected}
						data-selected={selected || undefined}
						disabled={option.disabled}
						key={option.value}
						onClick={() => onValueChange(option.value)}
						role="tab"
						type="button"
					>
						{option.label}
					</button>
				);
			})}
		</div>
	);
}
