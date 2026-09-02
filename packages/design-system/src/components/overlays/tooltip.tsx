import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@grade10/design-system/lib/utils";

/** Arrow geometry — placement-axis height, overlap into the pill, and trigger gap. */
const TOOLTIP_ARROW_HEIGHT = 6;
const TOOLTIP_ARROW_WIDTH = 10;
const TOOLTIP_ARROW_OVERLAP = 2;
const TOOLTIP_ARROW_EXTENSION = TOOLTIP_ARROW_HEIGHT - TOOLTIP_ARROW_OVERLAP;

const tooltipArrowClassName =
  "pointer-events-none absolute block text-background-inverse data-[side=bottom]:-top-1 data-[side=bottom]:h-1.5 data-[side=bottom]:w-2.5 data-[side=inline-end]:-left-1 data-[side=inline-end]:h-2.5 data-[side=inline-end]:w-1.5 data-[side=inline-start]:-right-1 data-[side=inline-start]:h-2.5 data-[side=inline-start]:w-1.5 data-[side=left]:-right-1 data-[side=left]:h-2.5 data-[side=left]:w-1.5 data-[side=right]:-left-1 data-[side=right]:h-2.5 data-[side=right]:w-1.5 data-[side=top]:-bottom-1 data-[side=top]:h-1.5 data-[side=top]:w-2.5";

/** Rounded tip uses Q control 1.3px past the sharp vertex (1 viewBox unit ≈ 1px). */
const TOOLTIP_ARROW_DOWN = "M1 1.5H9L5.8 4.2Q5 5.5 4.2 4.2Z";
const TOOLTIP_ARROW_UP = "M1 4.5H9L5.8 1.8Q5 0.5 4.2 1.8Z";
const TOOLTIP_ARROW_RIGHT = "M1.5 1V9L4.2 5.8Q5.5 5 4.2 4.2Z";
const TOOLTIP_ARROW_LEFT = "M4.5 1V9L1.8 5.8Q0.5 5 1.8 4.2Z";

function TooltipArrowGraphic({
  side,
}: {
  side: TooltipPrimitive.Arrow.State["side"];
}) {
  if (side === "top") {
    return (
      <svg
        aria-hidden
        className="size-full"
        fill="currentColor"
        viewBox={`0 0 ${TOOLTIP_ARROW_WIDTH} ${TOOLTIP_ARROW_HEIGHT}`}
      >
        <title>Tooltip arrow</title>
        <path d={TOOLTIP_ARROW_DOWN} />
      </svg>
    );
  }

  if (side === "bottom") {
    return (
      <svg
        aria-hidden
        className="size-full"
        fill="currentColor"
        viewBox={`0 0 ${TOOLTIP_ARROW_WIDTH} ${TOOLTIP_ARROW_HEIGHT}`}
      >
        <title>Tooltip arrow</title>
        <path d={TOOLTIP_ARROW_UP} />
      </svg>
    );
  }

  if (side === "left" || side === "inline-start") {
    return (
      <svg
        aria-hidden
        className="size-full"
        fill="currentColor"
        viewBox={`0 0 ${TOOLTIP_ARROW_HEIGHT} ${TOOLTIP_ARROW_WIDTH}`}
      >
        <title>Tooltip arrow</title>
        <path d={TOOLTIP_ARROW_RIGHT} />
      </svg>
    );
  }

  if (side === "right" || side === "inline-end") {
    return (
      <svg
        aria-hidden
        className="size-full"
        fill="currentColor"
        viewBox={`0 0 ${TOOLTIP_ARROW_HEIGHT} ${TOOLTIP_ARROW_WIDTH}`}
      >
        <title>Tooltip arrow</title>
        <path d={TOOLTIP_ARROW_LEFT} />
      </svg>
    );
  }

  return null;
}

function resolvePositionerSideOffset(
  sideOffset: TooltipPrimitive.Positioner.Props["sideOffset"],
): TooltipPrimitive.Positioner.Props["sideOffset"] {
  if (typeof sideOffset === "function") {
    return (data) => {
      const offset = sideOffset(data);
      return typeof offset === "number"
        ? offset + TOOLTIP_ARROW_EXTENSION
        : offset;
    };
  }

  return (sideOffset ?? 0) + TOOLTIP_ARROW_EXTENSION;
}

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  );
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * A small, non-interactive text hint that appears on hover or keyboard focus
 * to describe an icon-only control or provide supplementary context.
 *
 * Position: top | right | bottom | left. Alignment: start | center | end
 * (relative to trigger). Use a Tooltip to label or hint at a control. For rich
 * or interactive floating content, use a Popover; for a list of actions, use a
 * Dropdown Menu.
 *
 * Plain text only — no rich markup, links, or interactive elements. Keep to
 * a single short sentence or label (≈80 chars max).
 *
 * Renders as a portal with a 4px offset from the trigger along the placement
 * axis (measured from the arrow tip). Enter/exit transition (fade + slight
 * translate from placement side); skipped when `prefers-reduced-motion` is
 * active.
 */
function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        arrowPadding={16}
        side={side}
        sideOffset={resolvePositionerSideOffset(sideOffset)}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "relative z-50 inline-flex w-fit max-w-xs overflow-visible origin-(--transform-origin) items-center gap-1.5 rounded-(--radius-2xl) bg-background-inverse px-3 py-1 text-xs text-primary-foreground has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:animate-none",
            className,
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow
            data-slot="tooltip-arrow"
            render={(props, state) => (
              <div
                {...props}
                className={cn(tooltipArrowClassName, props.className)}
              >
                <TooltipArrowGraphic side={state.side} />
              </div>
            )}
          />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
