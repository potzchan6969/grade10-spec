// src/FeaturedMarkets/chart-runtime/FeaturedMarketLineChart.tsx
import { LineChart, ScatterChart } from "echarts/charts";
import {
  GridComponent,
  MarkLineComponent,
  TooltipComponent
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useRef } from "react";

// ../design-system/src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ../design-system/src/components/display/skeleton.tsx
import { cva } from "class-variance-authority";
import { jsx } from "react/jsx-runtime";
var skeletonVariants = cva("animate-pulse rounded-md bg-accent", {
  variants: {
    shape: {
      text: "h-4 w-18",
      line: "h-4 w-full",
      block: "h-40 w-full"
    }
  },
  defaultVariants: {
    shape: "block"
  }
});
function Skeleton({ className, shape = "block", ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "skeleton",
      "aria-busy": "true",
      "aria-label": "Loading",
      role: "status",
      className: cn(skeletonVariants({ shape }), className),
      ...props
    }
  );
}

// ../design-system/src/components/display/text.tsx
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx2 } from "react/jsx-runtime";
var textVariants = cva2("leading-snug", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl"
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      bold: "font-bold"
    },
    tone: {
      primary: "text-foreground",
      secondary: "text-muted-foreground",
      muted: "text-disabled-foreground",
      success: "text-success-foreground",
      error: "text-error-foreground"
    }
  },
  defaultVariants: {
    size: "base",
    weight: "regular",
    tone: "primary"
  }
});
function Text({
  as: Tag = "span",
  className,
  size = "base",
  weight = "regular",
  tone = "primary",
  truncate = false,
  ...props
}) {
  return /* @__PURE__ */ jsx2(
    Tag,
    {
      "data-slot": "text",
      "data-truncate": truncate || void 0,
      className: cn(
        textVariants({ size, weight, tone }),
        truncate && "block truncate",
        className
      ),
      ...props
    }
  );
}

// ../design-system/src/components/forms/button.tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva as cva3 } from "class-variance-authority";
import { LoaderCircleIcon } from "lucide-react";
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var buttonVariants = cva3(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:text-disabled-foreground aria-invalid:border-destructive-border aria-invalid:ring-3 aria-invalid:ring-destructive-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary-muted text-primary-muted-foreground hover:bg-primary-muted-hover disabled:bg-disabled",
        outline: "border-border bg-background hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        secondary: "bg-muted text-muted-foreground hover:bg-muted-hover aria-expanded:bg-muted-hover disabled:bg-disabled",
        ghost: "hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        destructive: "bg-destructive-muted text-destructive-muted-foreground hover:bg-destructive-muted-hover disabled:bg-disabled"
      },
      size: {
        xs: "h-6 gap-1 rounded-sm px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-2 rounded-md px-2 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-12 gap-2 rounded-lg px-4 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  leading,
  trailing,
  disabled,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    ButtonPrimitive,
    {
      "data-slot": "button",
      "data-loading": loading || void 0,
      "aria-busy": loading || void 0,
      disabled: disabled || loading,
      className: cn(buttonVariants({ variant, size, className })),
      ...props,
      children: [
        loading ? /* @__PURE__ */ jsx3(LoaderCircleIcon, { "aria-hidden": "true", className: "animate-spin" }) : leading,
        children,
        loading ? null : trailing
      ]
    }
  );
}

// ../design-system/src/components/layout/stack.tsx
import { cva as cva4 } from "class-variance-authority";
import { jsx as jsx4 } from "react/jsx-runtime";
var stackVariants = cva4("flex", {
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row"
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6"
    }
  },
  defaultVariants: {
    direction: "vertical",
    gap: "md"
  }
});
function Stack({
  className,
  direction = "vertical",
  gap = "md",
  align,
  justify,
  wrap = false,
  style,
  ...props
}) {
  return /* @__PURE__ */ jsx4(
    "div",
    {
      "data-slot": "stack",
      className: cn(stackVariants({ direction, gap }), className),
      style: {
        alignItems: align,
        flexWrap: wrap ? "wrap" : void 0,
        justifyContent: justify,
        ...style
      },
      ...props
    }
  );
}

// src/FeaturedMarkets/FeaturedMarketStatus.tsx
import { jsx as jsx5, jsxs as jsxs2 } from "react/jsx-runtime";
function FeaturedMarketStatus({
  state,
  label = "market data",
  className
}) {
  if (state.status === "loading") {
    return /* @__PURE__ */ jsxs2(
      Stack,
      {
        className: ["at-featured-status", className].filter(Boolean).join(" "),
        gap: "sm",
        children: [
          /* @__PURE__ */ jsx5(Skeleton, { shape: "line" }),
          /* @__PURE__ */ jsx5(Skeleton, { shape: "block" })
        ]
      }
    );
  }
  if (state.status === "error") {
    return /* @__PURE__ */ jsxs2(
      Stack,
      {
        align: "center",
        className: ["at-featured-status", className].filter(Boolean).join(" "),
        gap: "sm",
        role: "alert",
        children: [
          /* @__PURE__ */ jsx5(Text, { tone: "error", children: state.message }),
          state.onRetry ? /* @__PURE__ */ jsx5(Button, { onClick: state.onRetry, variant: "secondary", children: "Try again" }) : null
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx5(
    Stack,
    {
      align: "center",
      className: ["at-featured-status", className].filter(Boolean).join(" "),
      gap: "sm",
      children: /* @__PURE__ */ jsx5(Text, { tone: "secondary", children: state.message ?? `No ${label} available.` })
    }
  );
}

// src/FeaturedMarkets/chart-runtime/FeaturedMarketLineChart.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
echarts.use([
  CanvasRenderer,
  GridComponent,
  LineChart,
  MarkLineComponent,
  ScatterChart,
  TooltipComponent
]);
function FeaturedMarketLineChart({
  state,
  className
}) {
  const elementRef = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!elementRef.current || state.status !== "ready") return;
    const chart = echarts.init(elementRef.current, void 0, {
      renderer: "canvas"
    });
    chartRef.current = chart;
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(elementRef.current);
    return () => {
      observer.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, [state.status]);
  useEffect(() => {
    if (state.status !== "ready" || !chartRef.current) return;
    const {
      currentValue,
      precision = 2,
      referenceValue,
      series,
      trend = "neutral"
    } = state.data;
    const lineColor = trend === "up" ? "#4ade80" : trend === "down" ? "#fb7185" : "#a78bfa";
    const formatter = new Intl.NumberFormat(void 0, {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision
    });
    chartRef.current.setOption({
      animation: true,
      backgroundColor: "transparent",
      grid: { bottom: 28, left: 12, right: 12, top: 16 },
      tooltip: {
        axisPointer: { type: "line" },
        formatter: (params) => {
          const row = Array.isArray(params) ? params[0] : params;
          const value = typeof row === "object" && row !== null && "value" in row ? row.value[1] : 0;
          return formatter.format(value);
        },
        trigger: "axis"
      },
      xAxis: {
        axisLabel: {
          color: "#94a3b8",
          formatter: (value) => new Date(value).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        },
        axisLine: { lineStyle: { color: "#334155" } },
        type: "time"
      },
      yAxis: {
        axisLabel: {
          color: "#94a3b8",
          formatter: (value) => formatter.format(value)
        },
        splitLine: { lineStyle: { color: "#1e293b" } },
        type: "value"
      },
      series: [
        {
          data: series.map((point) => [point.timestamp, point.value]),
          id: "price",
          lineStyle: { color: lineColor, width: 2 },
          markLine: referenceValue === void 0 ? void 0 : {
            data: [
              {
                label: {
                  formatter: `Reference ${formatter.format(referenceValue)}`
                },
                yAxis: referenceValue
              }
            ],
            lineStyle: { color: "#fbbf24", type: "dashed" }
          },
          showSymbol: false,
          type: "line"
        },
        ...currentValue === void 0 ? [] : [
          {
            data: series.length ? [[series.at(-1)?.timestamp, currentValue]] : [],
            id: "current",
            itemStyle: { color: lineColor },
            symbol: "circle",
            symbolSize: 8,
            type: "scatter"
          }
        ]
      ]
    });
  }, [state]);
  if (state.status !== "ready")
    return /* @__PURE__ */ jsx6(
      FeaturedMarketStatus,
      {
        className,
        label: "chart data",
        state
      }
    );
  return /* @__PURE__ */ jsx6(
    "div",
    {
      "aria-label": state.data.ariaLabel,
      className: ["at-featured-chart", className].filter(Boolean).join(" "),
      role: "img",
      style: { height: state.data.height ?? 272 },
      children: /* @__PURE__ */ jsx6("div", { ref: elementRef })
    }
  );
}

// ../design-system/src/components/display/card.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
function Card({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx7(
    "div",
    {
      "data-slot": "card",
      "data-size": size,
      className: cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      ),
      ...props
    }
  );
}

// src/lib/utils.ts
import { clsx as clsx2 } from "clsx";
import { twMerge as twMerge2 } from "tailwind-merge";
function cn2(...inputs) {
  return twMerge2(clsx2(inputs));
}

// ../design-system/src/components/display/badge.tsx
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva as cva5 } from "class-variance-authority";
var badgeVariants = cva5(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant = "default",
  render,
  ...props
}) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps(
      {
        className: cn(badgeVariants({ variant }), className)
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant
    }
  });
}

// ../design-system/src/components/display/tabs.tsx
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva as cva6 } from "class-variance-authority";
import { jsx as jsx8 } from "react/jsx-runtime";
function Tabs({
  className,
  orientation = "horizontal",
  ...props
}) {
  return /* @__PURE__ */ jsx8(
    TabsPrimitive.Root,
    {
      "data-slot": "tabs",
      "data-orientation": orientation,
      className: cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      ),
      ...props
    }
  );
}
var tabsListVariants = cva6(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function TabsList({
  className,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx8(
    TabsPrimitive.List,
    {
      "data-slot": "tabs-list",
      "data-variant": variant,
      className: cn(tabsListVariants({ variant }), className),
      ...props
    }
  );
}
function TabsTrigger({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    TabsPrimitive.Tab,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        className
      ),
      ...props
    }
  );
}

// src/FeaturedMarkets/FeaturedMarketNavigation.tsx
import { jsx as jsx9, jsxs as jsxs3 } from "react/jsx-runtime";
var oddsTone = {
  error: { variant: "destructive", className: void 0 },
  success: {
    variant: "secondary",
    className: "bg-success text-success-foreground"
  }
};
function FeaturedAssetTabs({
  assets,
  selectedAssetId,
  onAssetChange,
  isFading = false
}) {
  return /* @__PURE__ */ jsx9(
    "div",
    {
      className: "at-featured-assets",
      "data-fading": isFading || void 0,
      role: "tablist",
      "aria-label": "Assets",
      children: assets.map((asset) => {
        const selected = asset.id === selectedAssetId;
        return /* @__PURE__ */ jsxs3(
          "button",
          {
            "aria-selected": selected,
            "data-selected": selected || void 0,
            disabled: asset.disabled,
            onClick: () => onAssetChange(asset.id),
            role: "tab",
            type: "button",
            children: [
              /* @__PURE__ */ jsx9("span", { children: asset.label }),
              asset.odds ? /* @__PURE__ */ jsx9(
                Badge,
                {
                  className: oddsTone[asset.odds.tone].className,
                  variant: oddsTone[asset.odds.tone].variant,
                  children: asset.odds.label
                }
              ) : /* @__PURE__ */ jsx9(
                Skeleton,
                {
                  className: "at-featured-assets__placeholder",
                  shape: "text"
                }
              )
            ]
          },
          asset.id
        );
      })
    }
  );
}
function FeaturedDurationList({
  durations,
  selectedDurationId,
  onDurationChange
}) {
  return /* @__PURE__ */ jsx9(Stack, { className: "at-featured-nav-list", gap: "xs", children: durations.map((duration) => /* @__PURE__ */ jsx9(
    "button",
    {
      className: "at-featured-nav-item",
      "data-selected": duration.id === selectedDurationId || void 0,
      disabled: duration.disabled,
      onClick: () => onDurationChange(duration.id),
      type: "button",
      children: duration.label
    },
    duration.id
  )) });
}
function FeaturedEventList({
  events,
  selectedEventId,
  onEventChange
}) {
  if (events.status !== "ready")
    return /* @__PURE__ */ jsx9(FeaturedMarketStatus, { label: "trending markets", state: events });
  return /* @__PURE__ */ jsx9(Stack, { className: "at-featured-nav-list", gap: "xs", children: events.data.map((event) => /* @__PURE__ */ jsx9(
    "button",
    {
      className: "at-featured-nav-item",
      "data-selected": event.id === selectedEventId || void 0,
      onClick: () => onEventChange(event.id),
      type: "button",
      children: /* @__PURE__ */ jsx9(Text, { truncate: true, children: event.label })
    },
    event.id
  )) });
}
function FeaturedMarketsSidebar({
  durations,
  selectedDurationId,
  onDurationChange,
  events,
  selectedEventId,
  onEventChange
}) {
  return /* @__PURE__ */ jsxs3(
    "aside",
    {
      className: "at-featured-sidebar",
      "aria-label": "Featured market navigation",
      children: [
        /* @__PURE__ */ jsxs3(Stack, { gap: "sm", children: [
          /* @__PURE__ */ jsx9(Text, { size: "xs", tone: "secondary", weight: "bold", children: "CRYPTO UP OR DOWN" }),
          /* @__PURE__ */ jsx9(
            FeaturedDurationList,
            {
              durations,
              onDurationChange,
              selectedDurationId
            }
          )
        ] }),
        /* @__PURE__ */ jsxs3(Stack, { gap: "sm", children: [
          /* @__PURE__ */ jsx9(Text, { size: "xs", tone: "secondary", weight: "bold", children: "TRENDING" }),
          /* @__PURE__ */ jsx9(
            FeaturedEventList,
            {
              events,
              onEventChange,
              selectedEventId
            }
          )
        ] })
      ]
    }
  );
}
function FeaturedSourceTabs({
  value,
  sources,
  onValueChange
}) {
  if (sources.length < 2) return null;
  return /* @__PURE__ */ jsx9(
    Tabs,
    {
      onValueChange: (next) => onValueChange(next),
      value,
      children: /* @__PURE__ */ jsx9(TabsList, { "aria-label": "Market source", className: "w-full", children: sources.map((source) => /* @__PURE__ */ jsx9(
        TabsTrigger,
        {
          disabled: source.disabled,
          value: source.id,
          children: source.shortLabel ?? source.label
        },
        source.id
      )) })
    }
  );
}
function FeaturedMobileTabs({
  value,
  onValueChange
}) {
  return /* @__PURE__ */ jsx9(
    Tabs,
    {
      onValueChange: (next) => onValueChange(next),
      value,
      children: /* @__PURE__ */ jsxs3(TabsList, { "aria-label": "Featured markets", className: "w-full", children: [
        /* @__PURE__ */ jsx9(TabsTrigger, { value: "crypto", children: "Crypto Up or Down" }),
        /* @__PURE__ */ jsx9(TabsTrigger, { value: "trending", children: "Trending" })
      ] })
    }
  );
}

// src/FeaturedMarkets/FeaturedMarketContent.tsx
import { jsx as jsx10, jsxs as jsxs4 } from "react/jsx-runtime";
var iconButton = "aspect-square px-0";
function FeaturedMarketHeader({ header }) {
  return /* @__PURE__ */ jsxs4("header", { className: "at-market-header", children: [
    header.imageUrl ? /* @__PURE__ */ jsx10("img", { alt: header.imageAlt ?? "", src: header.imageUrl }) : header.imageFallback ? /* @__PURE__ */ jsx10("span", { className: "at-market-header__fallback", children: header.imageFallback }) : null,
    /* @__PURE__ */ jsxs4(Stack, { gap: "xs", children: [
      /* @__PURE__ */ jsx10(Text, { as: "h3", size: "lg", weight: "medium", children: header.title }),
      header.statusLabel ? /* @__PURE__ */ jsx10(Text, { size: "sm", tone: "secondary", children: header.statusLabel }) : null,
      header.periodLabel ? /* @__PURE__ */ jsx10(Text, { size: "xs", tone: "muted", children: header.periodLabel }) : null
    ] }),
    header.action ? /* @__PURE__ */ jsx10(
      Button,
      {
        "aria-label": header.action.label,
        className: cn2("ml-auto", iconButton),
        disabled: header.action.disabled,
        onClick: header.action.onAction,
        size: "sm",
        variant: "ghost",
        children: "\u2197"
      }
    ) : null
  ] });
}
function FeaturedMarketStats({ stats }) {
  return /* @__PURE__ */ jsx10("div", { className: "at-market-stats", children: stats.map((stat) => /* @__PURE__ */ jsxs4("div", { children: [
    /* @__PURE__ */ jsx10(Text, { size: "base", tone: stat.tone ?? "primary", weight: "medium", children: stat.value }),
    /* @__PURE__ */ jsx10(Text, { size: "xs", tone: "secondary", children: stat.label })
  ] }, stat.label)) });
}
function OutcomeRow({
  outcome,
  visibleSourceId
}) {
  const values = visibleSourceId ? outcome.values.filter((value) => value.sourceId === visibleSourceId) : outcome.values;
  return /* @__PURE__ */ jsxs4("div", { className: "at-market-outcome", children: [
    /* @__PURE__ */ jsx10(Text, { weight: "medium", children: outcome.label }),
    /* @__PURE__ */ jsx10("div", { className: "at-market-outcome__values", children: values.map((value) => /* @__PURE__ */ jsx10(
      Text,
      {
        "data-state": value.state ?? "active",
        size: "sm",
        tone: value.tone ?? "primary",
        children: value.resolvedLabel ?? value.value
      },
      value.sourceId
    )) })
  ] });
}
function FeaturedMarketOutcomeList({
  outcomes,
  visibleSourceId
}) {
  return /* @__PURE__ */ jsx10("div", { className: "at-market-outcomes", children: outcomes.map((outcome) => /* @__PURE__ */ jsx10(
    OutcomeRow,
    {
      outcome,
      visibleSourceId
    },
    outcome.id
  )) });
}
function FeaturedMarketInsight({ insight }) {
  if (!insight) return null;
  return /* @__PURE__ */ jsxs4(Text, { as: "p", className: "at-market-insight", size: "sm", tone: "secondary", children: [
    /* @__PURE__ */ jsx10("strong", { children: "Insight: " }),
    insight
  ] });
}
function FeaturedMarketSummaryCard({
  data,
  className
}) {
  return /* @__PURE__ */ jsxs4(Card, { className: cn2("at-market-summary-card", className), children: [
    /* @__PURE__ */ jsx10(FeaturedMarketHeader, { header: data.header }),
    data.sourceSelection ? /* @__PURE__ */ jsx10(FeaturedSourceTabs, { ...data.sourceSelection }) : null,
    /* @__PURE__ */ jsx10(FeaturedMarketStats, { stats: data.stats }),
    /* @__PURE__ */ jsx10(
      FeaturedMarketOutcomeList,
      {
        outcomes: data.outcomes,
        visibleSourceId: data.sourceSelection?.value
      }
    ),
    /* @__PURE__ */ jsx10(FeaturedMarketInsight, { insight: data.insight }),
    data.primaryAction || data.secondaryAction ? /* @__PURE__ */ jsxs4("div", { className: "at-market-summary-card__actions", children: [
      data.primaryAction ? /* @__PURE__ */ jsx10(
        Button,
        {
          className: "flex-1",
          disabled: data.primaryAction.disabled,
          onClick: data.primaryAction.onAction,
          variant: "secondary",
          children: data.primaryAction.label
        }
      ) : null,
      data.secondaryAction ? /* @__PURE__ */ jsx10(
        Button,
        {
          "aria-label": data.secondaryAction.label,
          className: iconButton,
          disabled: data.secondaryAction.disabled,
          onClick: data.secondaryAction.onAction,
          variant: "ghost",
          children: "\u2197"
        }
      ) : null
    ] }) : null
  ] });
}
function FeaturedMarketChartCard({
  data,
  className
}) {
  return /* @__PURE__ */ jsxs4(Card, { className: cn2("at-market-chart-card", className), children: [
    /* @__PURE__ */ jsx10(FeaturedMarketHeader, { header: data.summary.header }),
    /* @__PURE__ */ jsx10(FeaturedMarketStats, { stats: data.summary.stats }),
    data.summary.sourceSelection ? /* @__PURE__ */ jsx10(FeaturedSourceTabs, { ...data.summary.sourceSelection }) : null,
    /* @__PURE__ */ jsx10(FeaturedMarketLineChart, { state: data.chart }),
    /* @__PURE__ */ jsx10(
      FeaturedMarketOutcomeList,
      {
        outcomes: data.summary.outcomes,
        visibleSourceId: data.summary.sourceSelection?.value
      }
    ),
    /* @__PURE__ */ jsx10(FeaturedMarketInsight, { insight: data.summary.insight })
  ] });
}
function FeaturedMarketContent({
  state,
  className
}) {
  if (state.status !== "ready")
    return /* @__PURE__ */ jsx10(FeaturedMarketStatus, { className, state });
  return state.data.kind === "chart" ? /* @__PURE__ */ jsx10(FeaturedMarketChartCard, { className, data: state.data }) : /* @__PURE__ */ jsx10(
    FeaturedMarketSummaryCard,
    {
      className,
      data: state.data.summary
    }
  );
}

// src/FeaturedMarkets/FeaturedMarkets.tsx
import { jsx as jsx11, jsxs as jsxs5 } from "react/jsx-runtime";
function selectedDurationState(markets, selection) {
  if (markets.status !== "ready") return markets;
  return markets.data.find(
    (market) => market.selection.assetId === selection.assetId && market.selection.durationId === selection.durationId
  )?.desktop ?? {
    message: "This duration market is not available.",
    status: "empty"
  };
}
function selectedEventState(events, eventId) {
  if (events.status !== "ready") return events;
  return events.data.find((event) => event.id === eventId)?.desktop ?? {
    message: "This trending market is not available.",
    status: "empty"
  };
}
function FeaturedMarketsPanel({
  sidebar,
  selection,
  content,
  assetTabs,
  className
}) {
  return /* @__PURE__ */ jsxs5(
    "div",
    {
      className: ["at-featured-panel", className].filter(Boolean).join(" "),
      "data-selection": selection.kind,
      children: [
        sidebar,
        /* @__PURE__ */ jsxs5("main", { className: "at-featured-panel__content", children: [
          selection.kind === "duration" ? assetTabs : null,
          /* @__PURE__ */ jsx11(FeaturedMarketContent, { state: content })
        ] })
      ]
    }
  );
}
function FeaturedMarketsDesktop(props) {
  const durationSelection = props.selection.kind === "duration" ? props.selection : void 0;
  const eventSelection = props.selection.kind === "event" ? props.selection : void 0;
  const content = durationSelection ? selectedDurationState(props.durationMarkets, durationSelection) : selectedEventState(props.events, eventSelection?.eventId);
  const selectedAssetId = durationSelection?.assetId ?? props.defaultAssetId;
  const selectedDurationId = durationSelection?.durationId;
  return /* @__PURE__ */ jsx11("div", { className: "at-featured-desktop", children: /* @__PURE__ */ jsx11(
    FeaturedMarketsPanel,
    {
      assetTabs: /* @__PURE__ */ jsx11(
        FeaturedAssetTabs,
        {
          assets: props.assets,
          onAssetChange: (assetId) => props.onSelectionChange({
            assetId,
            durationId: selectedDurationId ?? props.defaultDurationId,
            kind: "duration"
          }),
          selectedAssetId
        }
      ),
      content,
      selection: props.selection,
      sidebar: /* @__PURE__ */ jsx11(
        FeaturedMarketsSidebar,
        {
          durations: props.durations,
          events: props.events,
          onDurationChange: (durationId) => props.onSelectionChange({
            assetId: selectedAssetId,
            durationId,
            kind: "duration"
          }),
          onEventChange: (eventId) => props.onSelectionChange({ eventId, kind: "event" }),
          selectedDurationId,
          selectedEventId: eventSelection?.eventId
        }
      )
    }
  ) });
}
function mobileDurationCards(state, assetId) {
  if (state.status !== "ready") return state;
  return {
    data: state.data.filter((market) => market.selection.assetId === assetId).map((market) => market.mobile).filter(
      (market) => market.status === "ready"
    ).map((market) => market.data),
    status: "ready"
  };
}
function mobileEventCards(state) {
  if (state.status !== "ready") return state;
  return {
    data: state.data.map((event) => event.mobile).filter(
      (event) => event.status === "ready"
    ).map((event) => event.data),
    status: "ready"
  };
}
function FeaturedMarketsMobile(props) {
  const assetId = props.selection.kind === "duration" ? props.selection.assetId : props.defaultAssetId;
  const durationCards = mobileDurationCards(props.durationMarkets, assetId);
  const eventCards = mobileEventCards(props.events);
  const cards = props.mobileTab === "crypto" ? durationCards : eventCards;
  return /* @__PURE__ */ jsxs5("div", { className: "at-featured-mobile", children: [
    /* @__PURE__ */ jsx11(
      FeaturedMobileTabs,
      {
        onValueChange: props.onMobileTabChange,
        value: props.mobileTab
      }
    ),
    props.mobileTab === "crypto" ? /* @__PURE__ */ jsxs5("div", { className: "at-featured-mobile__crypto", children: [
      /* @__PURE__ */ jsx11(
        FeaturedAssetTabs,
        {
          assets: props.assets,
          onAssetChange: (nextAssetId) => props.onSelectionChange({
            assetId: nextAssetId,
            durationId: props.defaultDurationId,
            kind: "duration"
          }),
          selectedAssetId: assetId
        }
      ),
      /* @__PURE__ */ jsx11(MobileCards, { state: cards })
    ] }) : /* @__PURE__ */ jsx11(MobileCards, { state: cards }),
    props.onBrowseAll ? /* @__PURE__ */ jsx11(Stack, { align: "center", className: "at-featured-mobile__browse", gap: "sm", children: /* @__PURE__ */ jsx11(Button, { onClick: props.onBrowseAll, variant: "secondary", children: "Browse All" }) }) : null
  ] });
}
function MobileCards({
  state
}) {
  if (state.status !== "ready")
    return /* @__PURE__ */ jsx11(FeaturedMarketStatus, { label: "featured markets", state });
  if (state.data.length === 0)
    return /* @__PURE__ */ jsx11(
      FeaturedMarketStatus,
      {
        label: "featured markets",
        state: { message: "No featured markets right now.", status: "empty" }
      }
    );
  return /* @__PURE__ */ jsx11(Stack, { className: "at-featured-mobile__cards", gap: "md", children: state.data.map((card) => /* @__PURE__ */ jsx11(FeaturedMarketSummaryCard, { data: card }, card.header.title)) });
}
function FeaturedMarkets(props) {
  return /* @__PURE__ */ jsxs5(
    "section",
    {
      className: ["at-featured-markets", props.className].filter(Boolean).join(" "),
      children: [
        /* @__PURE__ */ jsx11(FeaturedMarketsDesktop, { ...props }),
        /* @__PURE__ */ jsx11(FeaturedMarketsMobile, { ...props })
      ]
    }
  );
}

// src/PaymentDialogs.tsx
import { useEffect as useEffect2, useId, useRef as useRef2 } from "react";
import { Fragment, jsx as jsx12, jsxs as jsxs6 } from "react/jsx-runtime";
function getFocusable(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute("aria-hidden"));
}
function PaymentDialog({
  open,
  onOpenChange,
  children,
  title,
  description,
  dismissible = true,
  footer,
  className
}) {
  const dialogRef = useRef2(null);
  const previousFocus = useRef2(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect2(() => {
    if (!open) return;
    previousFocus.current = document.activeElement;
    const timer = window.setTimeout(() => {
      getFocusable(dialogRef.current ?? document.body)[0]?.focus();
    }, 0);
    return () => {
      window.clearTimeout(timer);
      previousFocus.current?.focus();
    };
  }, [open]);
  if (!open) return null;
  return /* @__PURE__ */ jsxs6("div", { className: "at-payment-dialog-backdrop", children: [
    dismissible && /* @__PURE__ */ jsx12(
      "button",
      {
        "aria-label": "Close dialog",
        className: "at-payment-dialog-backdrop__dismiss",
        onClick: () => onOpenChange(false),
        type: "button"
      }
    ),
    /* @__PURE__ */ jsxs6(
      "div",
      {
        "aria-describedby": description ? descriptionId : void 0,
        "aria-labelledby": title ? titleId : void 0,
        "aria-modal": "true",
        className: ["at-payment-dialog", className].filter(Boolean).join(" "),
        onKeyDown: (event) => {
          if (event.key === "Escape" && dismissible) onOpenChange(false);
          if (event.key !== "Tab" || !dialogRef.current) return;
          const focusable = getFocusable(dialogRef.current);
          if (!focusable.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        },
        ref: dialogRef,
        role: "dialog",
        children: [
          (title || dismissible) && /* @__PURE__ */ jsxs6("header", { className: "at-payment-dialog__header", children: [
            title && /* @__PURE__ */ jsx12("h2", { id: titleId, children: title }),
            dismissible && /* @__PURE__ */ jsx12(
              "button",
              {
                "aria-label": "Close dialog",
                className: "at-payment-dialog__close",
                onClick: () => onOpenChange(false),
                type: "button",
                children: "\xD7"
              }
            )
          ] }),
          description && /* @__PURE__ */ jsx12("p", { className: "at-payment-dialog__description", id: descriptionId, children: description }),
          /* @__PURE__ */ jsx12("div", { className: "at-payment-dialog__body", children }),
          footer && /* @__PURE__ */ jsx12("footer", { className: "at-payment-dialog__footer", children: footer })
        ]
      }
    )
  ] });
}
function PaymentPriceSummary({ state }) {
  return /* @__PURE__ */ jsx12("section", { className: "at-payment-price-summary", "aria-live": "polite", children: state.status === "loading" ? /* @__PURE__ */ jsx12(Skeleton, { className: "at-payment-price-summary__skeleton", shape: "line" }) : /* @__PURE__ */ jsxs6(Fragment, { children: [
    /* @__PURE__ */ jsxs6("div", { className: "at-payment-price-summary__amount", children: [
      state.amount,
      " ",
      /* @__PURE__ */ jsx12("span", { children: state.currency }),
      state.cycleLabel && /* @__PURE__ */ jsx12("small", { children: state.cycleLabel })
    ] }),
    state.supportingText && /* @__PURE__ */ jsxs6("p", { children: [
      state.supportingText,
      state.tooltip && /* @__PURE__ */ jsx12(
        "span",
        {
          className: "at-payment-price-summary__tooltip",
          title: typeof state.tooltip === "string" ? state.tooltip : void 0,
          children: state.tooltip
        }
      )
    ] })
  ] }) });
}
function PaymentPromoCodeField({ state }) {
  if (state.status === "applied")
    return /* @__PURE__ */ jsxs6("div", { className: "at-payment-promo", "data-state": "applied", children: [
      /* @__PURE__ */ jsxs6("span", { children: [
        state.code,
        " applied"
      ] }),
      /* @__PURE__ */ jsx12("strong", { children: state.savingsLabel }),
      /* @__PURE__ */ jsx12(
        "button",
        {
          disabled: state.disabled,
          onClick: state.onRemove,
          type: "button",
          children: state.removeLabel ?? "Remove"
        }
      )
    ] });
  const invalid = Boolean(state.error);
  return /* @__PURE__ */ jsxs6("div", { className: "at-payment-promo", "data-state": "entry", children: [
    /* @__PURE__ */ jsxs6("div", { children: [
      /* @__PURE__ */ jsx12(
        "input",
        {
          "aria-invalid": invalid || void 0,
          "aria-label": "Promo code",
          disabled: state.disabled || state.applying,
          onChange: (event) => state.onValueChange(event.target.value),
          onKeyDown: (event) => {
            if (event.key === "Enter" && state.value.trim()) state.onApply();
          },
          placeholder: state.placeholder ?? "Promo code",
          value: state.value
        }
      ),
      /* @__PURE__ */ jsx12(
        Button,
        {
          disabled: state.disabled || !state.value.trim(),
          loading: state.applying,
          onClick: state.onApply,
          size: "sm",
          variant: "secondary",
          children: state.applying ? "Applying\u2026" : state.applyLabel ?? "Apply"
        }
      )
    ] }),
    state.error && /* @__PURE__ */ jsx12("p", { role: "alert", children: state.error })
  ] });
}
function PaymentDetailsList({ details }) {
  return /* @__PURE__ */ jsx12("dl", { className: "at-payment-details-list", children: details.map((detail) => /* @__PURE__ */ jsxs6(
    "div",
    {
      "data-tone": detail.tone ?? "default",
      children: [
        /* @__PURE__ */ jsx12("dt", { children: detail.label }),
        /* @__PURE__ */ jsxs6("dd", { children: [
          detail.loading ? /* @__PURE__ */ jsx12(Skeleton, { shape: "text" }) : /* @__PURE__ */ jsxs6(Fragment, { children: [
            detail.leadingVisual,
            detail.value
          ] }),
          detail.helpText && /* @__PURE__ */ jsx12("small", { children: detail.helpText })
        ] })
      ]
    },
    detail.id ?? String(detail.label)
  )) });
}
function PaymentTermsNotice({ children }) {
  return /* @__PURE__ */ jsx12("p", { className: "at-payment-terms", children });
}
function PaymentTimeline({ steps }) {
  return /* @__PURE__ */ jsx12("ol", { className: "at-payment-timeline", children: steps.map((step) => /* @__PURE__ */ jsxs6("li", { "data-status": step.status, children: [
    /* @__PURE__ */ jsx12("span", { "aria-hidden": "true", children: step.status === "complete" ? "\u2713" : step.status === "current" ? "\u2022" : "\u25CB" }),
    /* @__PURE__ */ jsxs6("div", { children: [
      /* @__PURE__ */ jsx12("strong", { children: step.label }),
      step.description && /* @__PURE__ */ jsx12("p", { children: step.description })
    ] })
  ] }, step.id)) });
}
function CryptoPaymentCheckoutDialog({
  tokens,
  selectedToken,
  onTokenChange,
  price,
  details,
  promo,
  primaryAction,
  termsNotice,
  ...dialog
}) {
  return /* @__PURE__ */ jsx12(
    PaymentDialog,
    {
      ...dialog,
      footer: /* @__PURE__ */ jsxs6("div", { className: "at-payment-footer-stack", children: [
        /* @__PURE__ */ jsx12(PaymentActionButton, { action: primaryAction }),
        termsNotice && /* @__PURE__ */ jsx12(PaymentTermsNotice, { children: termsNotice })
      ] }),
      children: /* @__PURE__ */ jsxs6("div", { className: "at-payment-checkout", children: [
        tokens && /* @__PURE__ */ jsx12(
          "div",
          {
            "aria-label": "Payment token",
            className: "at-payment-token-tabs",
            role: "tablist",
            children: tokens.map((token) => /* @__PURE__ */ jsxs6(
              "button",
              {
                "aria-label": token.ariaLabel,
                "aria-selected": token.id === selectedToken,
                disabled: token.disabled,
                onClick: () => onTokenChange?.(token.id),
                role: "tab",
                type: "button",
                children: [
                  token.icon,
                  token.label
                ]
              },
              token.id
            ))
          }
        ),
        /* @__PURE__ */ jsx12(PaymentPriceSummary, { state: price }),
        /* @__PURE__ */ jsx12(PaymentDetailsList, { details }),
        promo && /* @__PURE__ */ jsx12(PaymentPromoCodeField, { state: promo })
      ] })
    }
  );
}
function FiatPaymentCheckoutDialog({
  introduction,
  price,
  promo,
  primaryAction,
  termsNotice,
  ...dialog
}) {
  return /* @__PURE__ */ jsx12(
    PaymentDialog,
    {
      ...dialog,
      footer: /* @__PURE__ */ jsxs6("div", { className: "at-payment-footer-stack", children: [
        /* @__PURE__ */ jsx12(PaymentActionButton, { action: primaryAction }),
        termsNotice && /* @__PURE__ */ jsx12(PaymentTermsNotice, { children: termsNotice })
      ] }),
      children: /* @__PURE__ */ jsxs6("div", { className: "at-payment-checkout", children: [
        introduction && /* @__PURE__ */ jsx12("p", { className: "at-payment-checkout__introduction", children: introduction }),
        /* @__PURE__ */ jsx12(PaymentPriceSummary, { state: price }),
        promo && /* @__PURE__ */ jsx12(PaymentPromoCodeField, { state: promo })
      ] })
    }
  );
}
function PaymentActionButton({ action }) {
  return /* @__PURE__ */ jsx12(
    Button,
    {
      disabled: action.disabled,
      leading: action.leadingVisual,
      loading: action.loading,
      onClick: action.onAction,
      variant: action.variant === "secondary" ? "secondary" : "default",
      children: action.label
    }
  );
}
function CryptoPaymentConfirmationDialog({
  summary,
  steps,
  ...dialog
}) {
  return /* @__PURE__ */ jsx12(PaymentDialog, { ...dialog, children: /* @__PURE__ */ jsxs6("div", { className: "at-payment-confirmation", children: [
    /* @__PURE__ */ jsxs6("div", { className: "at-payment-confirmation__summary", children: [
      summary.icon,
      /* @__PURE__ */ jsx12("span", { children: summary.label }),
      /* @__PURE__ */ jsx12("strong", { children: summary.amount })
    ] }),
    /* @__PURE__ */ jsx12("p", { children: "Confirm in your wallet to continue:" }),
    /* @__PURE__ */ jsx12(PaymentTimeline, { steps })
  ] }) });
}
function PaymentProcessingDialog({
  message,
  progressLabel = "Processing",
  ...dialog
}) {
  return /* @__PURE__ */ jsx12(PaymentDialog, { ...dialog, dismissible: false, children: /* @__PURE__ */ jsxs6("div", { className: "at-payment-processing", children: [
    /* @__PURE__ */ jsx12("span", { "aria-hidden": "true", className: "at-payment-processing__spinner" }),
    /* @__PURE__ */ jsx12("h3", { children: progressLabel }),
    /* @__PURE__ */ jsx12("p", { children: message })
  ] }) });
}
function PaymentOutcomeDialog({
  outcome,
  message,
  transaction,
  primaryAction,
  secondaryAction,
  ...dialog
}) {
  return /* @__PURE__ */ jsx12(
    PaymentDialog,
    {
      ...dialog,
      footer: (primaryAction || secondaryAction) && /* @__PURE__ */ jsxs6("div", { className: "at-payment-action-row", children: [
        secondaryAction && /* @__PURE__ */ jsx12(
          PaymentActionButton,
          {
            action: { ...secondaryAction, variant: "secondary" }
          }
        ),
        primaryAction && /* @__PURE__ */ jsx12(PaymentActionButton, { action: primaryAction })
      ] }),
      children: /* @__PURE__ */ jsxs6("div", { className: "at-payment-outcome", "data-outcome": outcome, children: [
        /* @__PURE__ */ jsx12("span", { "aria-hidden": "true", children: outcome === "success" ? "\u2713" : "!" }),
        /* @__PURE__ */ jsx12("p", { children: message }),
        transaction && /* @__PURE__ */ jsx12("a", { href: transaction.href, rel: "noreferrer", target: "_blank", children: transaction.label })
      ] })
    }
  );
}
function PaymentPlanActivatedDialog({
  intro,
  steps,
  details,
  transaction,
  primaryAction,
  secondaryAction,
  ...dialog
}) {
  return /* @__PURE__ */ jsx12(
    PaymentDialog,
    {
      ...dialog,
      footer: /* @__PURE__ */ jsxs6("div", { className: "at-payment-action-row", children: [
        secondaryAction && /* @__PURE__ */ jsx12(
          PaymentActionButton,
          {
            action: { ...secondaryAction, variant: "secondary" }
          }
        ),
        /* @__PURE__ */ jsx12(PaymentActionButton, { action: primaryAction })
      ] }),
      children: /* @__PURE__ */ jsxs6("div", { className: "at-payment-activated", children: [
        intro && /* @__PURE__ */ jsx12("p", { children: intro }),
        /* @__PURE__ */ jsx12(PaymentTimeline, { steps }),
        /* @__PURE__ */ jsx12(PaymentDetailsList, { details }),
        transaction && /* @__PURE__ */ jsx12("a", { href: transaction.href, rel: "noreferrer", target: "_blank", children: transaction.label })
      ] })
    }
  );
}
export {
  CryptoPaymentCheckoutDialog,
  CryptoPaymentConfirmationDialog,
  FeaturedAssetTabs,
  FeaturedDurationList,
  FeaturedEventList,
  FeaturedMarketChartCard,
  FeaturedMarketContent,
  FeaturedMarketHeader,
  FeaturedMarketInsight,
  FeaturedMarketLineChart,
  FeaturedMarketOutcomeList,
  FeaturedMarketStats,
  FeaturedMarketStatus,
  FeaturedMarketSummaryCard,
  FeaturedMarkets,
  FeaturedMarketsDesktop,
  FeaturedMarketsMobile,
  FeaturedMarketsPanel,
  FeaturedMarketsSidebar,
  FeaturedMobileTabs,
  FeaturedSourceTabs,
  FiatPaymentCheckoutDialog,
  PaymentDetailsList,
  PaymentDialog,
  PaymentOutcomeDialog,
  PaymentPlanActivatedDialog,
  PaymentPriceSummary,
  PaymentProcessingDialog,
  PaymentPromoCodeField,
  PaymentTermsNotice,
  PaymentTimeline
};
//# sourceMappingURL=index.js.map
