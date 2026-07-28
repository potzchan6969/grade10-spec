import { jsx as _jsx } from "react/jsx-runtime";
export function SegmentedControl({ value, onValueChange, options, ariaLabel, className, }) {
    return (_jsx("div", { "aria-label": ariaLabel, className: ["at-segmented-control", className].filter(Boolean).join(" "), role: "tablist", children: options.map((option) => {
            const selected = option.value === value;
            return (_jsx("button", { "aria-label": option.ariaLabel, "aria-selected": selected, "data-selected": selected || undefined, disabled: option.disabled, onClick: () => onValueChange(option.value), role: "tab", type: "button", children: option.label }, option.value));
        }) }));
}
