import { jsx as _jsx } from "react/jsx-runtime";
/**
 * A controlled, semantic button primitive. Visual styling belongs to the
 * consuming application's design system through the emitted data attribute.
 */
export function Button({ children, tone = "primary", type = "button", ...props }) {
    return (_jsx("button", { "data-tone": tone, type: type, ...props, children: children }));
}
