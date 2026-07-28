import { jsx as _jsx } from "react/jsx-runtime";
export function Text({ children, as: Tag = "span", size = "base", weight = "regular", tone = "primary", truncate = false, className, ...props }) {
    return (_jsx(Tag, { className: ["at-text", className].filter(Boolean).join(" "), "data-size": size, "data-tone": tone, "data-truncate": truncate || undefined, "data-weight": weight, ...props, children: children }));
}
