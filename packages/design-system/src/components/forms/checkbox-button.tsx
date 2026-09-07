import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "@grade10/design-system/lib/utils";
import { Check } from "@phosphor-icons/react";

/**
 * The control on its own. Use `CheckboxListInput` when it needs a label (and
 * optional count) beside it.
 *
 * Figma (`2176:4089`) draws a 16px `Size/size-4` `Radius/radius-full` circle.
 * Checked fills `Base/primary` and shows a 12px Bold check in
 * `Base/primary-foreground`. Unchecked is `Base/background` with `Base/border`.
 * Disabled is the same drawing at `Opacity/opacity-50`.
 */
function CheckboxButton({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox-button"
      className={cn(
        "group/checkbox flex size-4 shrink-0 items-center justify-center rounded-(--radius-full) border border-border bg-background text-primary-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:border-primary data-checked:bg-primary disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50",
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
