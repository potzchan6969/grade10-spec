import { jsx as _jsx } from "react/jsx-runtime";
export function Skeleton({ shape = "block", className, ...props }) {
    return (_jsx("div", { "aria-busy": "true", "aria-label": "Loading", className: ["at-skeleton", className].filter(Boolean).join(" "), "data-shape": shape, role: "status", ...props }));
}
