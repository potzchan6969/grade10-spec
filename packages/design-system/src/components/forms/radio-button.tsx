import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { cn } from "@grade10/design-system/lib/utils";

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
        // `Base/input`, which is what `Checkbox Button` binds on every variant.
        // This was `bg-field` until `Custom/field` was deleted from the Semantic
        // collection; the Figma Radio still holds a binding to that deleted
        // variable, which is why the file renders correctly while the token no
        // longer exists. Same value either way — the point is the live name.
        className="flex size-4 items-center justify-center rounded-full border border-border bg-input transition-colors group-focus-visible/radio:ring-3 group-focus-visible/radio:ring-ring/50 group-data-disabled/radio:bg-disabled"
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
