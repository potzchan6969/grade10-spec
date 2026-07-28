import { jsx as _jsx } from "react/jsx-runtime";
/**
 * A controlled, semantic button primitive. Visual styling belongs to the
 * consuming application's design system through the emitted data attribute.
 */
export function Button({ children, tone = "primary", variant = "primary", size = "medium", iconOnly = false, type = "button", ...props }) {
    return (_jsx("button", { className: "at-button", "data-icon-only": iconOnly || undefined, "data-size": size, "data-tone": tone, "data-variant": variant, type: type, ...props, children: children }));
}
