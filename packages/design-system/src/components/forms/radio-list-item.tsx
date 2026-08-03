import { RadioButton } from "@acetrader/design-system/components/forms/radio-button";
import { cn } from "@acetrader/design-system/lib/utils";
import type { Radio as RadioPrimitive } from "@base-ui/react/radio";
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
 * `disabled` is Figma's only axis here, and it dims the label as well as the
 * control, so the tone lives on the label rather than on `RadioButton`.
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
        "group/radio-item flex w-full items-start gap-2 text-base text-foreground has-data-disabled:text-disabled-foreground",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <RadioButton disabled={disabled} {...props} />
      {children}
    </label>
  );
}

export type { RadioListItemProps };
export { RadioListItem };
