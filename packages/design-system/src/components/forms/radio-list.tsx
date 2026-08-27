import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type RadioListProps = RadioGroupPrimitive.Props & {
  /** Group heading. Omit it and the heading is not rendered — Figma's
   * `showLabel` boolean, expressed as the absence of a value. */
  label?: ReactNode;
};

/**
 * A labelled group of `RadioListItem`s. The group is what owns the selected
 * value; the items are stateless and report through it.
 *
 * Figma (`2213:392`): optional `label` is `text-sm/medium` in
 * `Base/secondary-foreground`; the list slot stacks items with `Gap/gap-2`.
 */
function RadioList({ className, label, children, ...props }: RadioListProps) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-list"
      className={cn("flex w-full flex-col justify-center gap-2", className)}
      {...props}
    >
      {label ? (
        <span
          data-slot="radio-list-label"
          className="w-full text-sm font-medium text-secondary-foreground"
        >
          {label}
        </span>
      ) : null}
      <div
        data-slot="radio-list-items"
        className="flex w-full flex-col items-start gap-2"
      >
        {children}
      </div>
    </RadioGroupPrimitive>
  );
}

export type { RadioListProps };
export { RadioList };
