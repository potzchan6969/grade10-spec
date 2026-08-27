import type { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioButton } from "@grade10/design-system/components/forms/radio-button";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type RadioListItemProps = RadioPrimitive.Root.Props & {
  /** Text beside the control. */
  children?: ReactNode;
  /** Class applied to the wrapping label rather than the control. */
  className?: string;
};

/**
 * A radio with its label. Wrapping both in a `<label>` is what makes the text
 * clickable — Figma draws the pair but cannot express the association.
 *
 * Figma (`2213:142`) has one axis: `isDisabled`. Disabled is
 * `Opacity/opacity-50` over the row; the label stays `Base/foreground` and
 * `text-base/normal`, with `Gap/gap-2` between the control and the text. The
 * nested radio still gets its disabled ring fill (`Base/background-subtle`).
 */
function RadioListItem({
  className,
  children,
  disabled,
  ...props
}: RadioListItemProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: RadioButton renders the input this label wraps.
    <label
      data-slot="radio-list-item"
      data-disabled={disabled || undefined}
      className={cn(
        "group/radio-item flex w-full items-start gap-2 text-base text-foreground",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
    >
      <RadioButton
        {...props}
        disabled={disabled}
        className={disabled ? "disabled:opacity-100" : undefined}
      />
      {children}
    </label>
  );
}

export type { RadioListItemProps };
export { RadioListItem };
