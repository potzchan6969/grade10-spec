import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { cn } from "@grade10/design-system/lib/utils";

/**
 * The control on its own. Use it inside a `RadioGroup`, or reach for
 * `RadioListItem` when it needs a label beside it.
 *
 * Figma (`2213:130`) draws three nested boxes: a 24px `Size/size-6` hit area, a
 * 16px `Size/size-4` ring, and an 8px `Size/size-2` dot that appears only when
 * selected. The ring is a real element rather than a border on the root, because
 * the root is the hit target and the ring is not. Enabled ring is `Base/input`
 * with `Base/border`; selected fill is `Base/primary`. Disabled swaps the ring
 * to `Base/background-subtle` and dims the control at `Opacity/opacity-50`
 * (same rule as `CheckboxButton`). `RadioListItem` owns that opacity when the
 * control sits beside a label, and resets this one so the row dims once.
 */
function RadioButton({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-button"
      className={cn(
        "group/radio flex size-6 shrink-0 items-center justify-center rounded-full outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span
        data-slot="radio-button-ring"
        className="flex size-4 items-center justify-center rounded-full border border-border bg-input transition-colors group-focus-visible/radio:ring-3 group-focus-visible/radio:ring-ring/50 group-data-disabled/radio:bg-background-subtle"
      >
        <RadioPrimitive.Indicator
          data-slot="radio-button-indicator"
          className="size-2 rounded-full bg-primary"
        />
      </span>
    </RadioPrimitive.Root>
  );
}

export { RadioButton };
