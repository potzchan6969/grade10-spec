import { jsx as _jsx } from "react/jsx-runtime";
export function Surface({ children, className, variant = "panel", radius = "medium", selected = false, as = "div", ...props }) {
    const shared = {
        className: ["at-surface", className].filter(Boolean).join(" "),
        "data-radius": radius,
        "data-selected": selected || undefined,
        "data-variant": variant,
    };
    if (as === "button") {
        return (_jsx("button", { type: "button", ...shared, ...props, children: children }));
    }
    return (_jsx("div", { ...shared, ...props, children: children }));
}
