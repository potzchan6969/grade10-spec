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
export declare function SegmentedControl<Value extends string>({ value, onValueChange, options, ariaLabel, className, }: SegmentedControlProps<Value>): import("react").JSX.Element;
//# sourceMappingURL=SegmentedControl.d.ts.map