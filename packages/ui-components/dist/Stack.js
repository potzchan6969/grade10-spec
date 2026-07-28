import { jsx as _jsx } from "react/jsx-runtime";
export function Stack({ children, direction = "vertical", gap = "md", align, justify, wrap = false, style, ...props }) {
    return (_jsx("div", { className: "at-stack", "data-direction": direction, "data-gap": gap, style: {
            alignItems: align,
            flexWrap: wrap ? "wrap" : undefined,
            justifyContent: justify,
            ...style,
        }, ...props, children: children }));
}
