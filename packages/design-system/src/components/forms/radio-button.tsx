import { cn } from "@acetrader/design-system/lib/utils";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";

/**
 * The control on its own. Use it inside a `RadioGroup`, or reach for
 * `RadioListItem` when it needs a label beside it.
 *
 * Figma draws three nested boxes: a 24px hit area, a 16px ring, and an 8px dot
 * that appears only when selected. The ring is a real element rather than a
 * border on the root, because the root is the 24px target and the ring is not.
 */
function RadioButton({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-button"
      className={cn(
        "group/radio flex size-6 shrink-0 items-center justify-center rounded-full outline-none",
        className,
      )}
      {...props}
    >
      <span
        data-slot="radio-button-ring"
        // `Custom/field` was missing from tokens.json when this landed — the
        // Figma variable exists and the pull had not picked it up. Backfilled
        // there rather than substituted here, so the name matches the design.
        className="flex size-4 items-center justify-center rounded-full border border-border bg-field transition-colors group-focus-visible/radio:ring-3 group-focus-visible/radio:ring-ring/50 group-data-disabled/radio:bg-disabled"
      >
        <RadioPrimitive.Indicator
          data-slot="radio-button-indicator"
          className="size-2 rounded-full bg-foreground group-data-disabled/radio:bg-disabled-foreground"
        />
      </span>
    </RadioPrimitive.Root>
  );
}

export { RadioButton };
