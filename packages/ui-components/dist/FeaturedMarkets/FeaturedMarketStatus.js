import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "../Button.js";
import { Skeleton } from "../Skeleton.js";
import { Stack } from "../Stack.js";
import { Text } from "../Text.js";
export function FeaturedMarketStatus({ state, label = "market data", className, }) {
    if (state.status === "loading") {
        return (_jsxs(Stack, { className: ["at-featured-status", className].filter(Boolean).join(" "), gap: "sm", children: [_jsx(Skeleton, { shape: "line" }), _jsx(Skeleton, { shape: "block" })] }));
    }
    if (state.status === "error") {
        return (_jsxs(Stack, { align: "center", className: ["at-featured-status", className].filter(Boolean).join(" "), gap: "sm", role: "alert", children: [_jsx(Text, { tone: "error", children: state.message }), state.onRetry ? (_jsx(Button, { onClick: state.onRetry, variant: "secondary", children: "Try again" })) : null] }));
    }
    return (_jsx(Stack, { align: "center", className: ["at-featured-status", className].filter(Boolean).join(" "), gap: "sm", children: _jsx(Text, { tone: "secondary", children: state.message ?? `No ${label} available.` }) }));
}
