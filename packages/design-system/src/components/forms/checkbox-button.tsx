import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "@grade10/design-system/lib/utils";
import { Check } from "@phosphor-icons/react";

/**
 * The control on its own. Use `CheckboxListInput` when it needs a label (and
 * optional count) beside it.
 *
 * Figma (`2176:4089`) draws a 16px `Size/size-4` `Radius/radius-sm` box on
 * `Base/input` for every variant — checked does not fill with primary, it
 * only reveals the check. `checked` and `isDisabled` are boolean gates, not
 * a cva axis.
 */
function CheckboxButton({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox-button"
      className={cn(
        "group/checkbox flex size-4 shrink-0 items-center justify-center rounded-(--radius-sm) border border-border bg-input text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:text-disabled-foreground",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-button-indicator"
        className="grid place-content-center text-current"
      >
        <Check aria-hidden size={12} weight="bold" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { CheckboxButton };
