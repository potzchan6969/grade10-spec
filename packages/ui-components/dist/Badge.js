import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Badge({ children, tone = "neutral", leading, className, ...props }) {
    return (_jsxs("span", { className: ["at-badge", className].filter(Boolean).join(" "), "data-tone": tone, ...props, children: [leading ? (_jsx("span", { "aria-hidden": "true", className: "at-badge__leading", children: leading })) : null, children] }));
}
