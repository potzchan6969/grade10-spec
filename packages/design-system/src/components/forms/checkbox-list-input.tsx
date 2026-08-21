import type { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxButton } from "@grade10/design-system/components/forms/checkbox-button";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

const checkboxListInputVariants = cva(
  "group/checkbox-item flex w-full items-start gap-2 has-data-disabled:text-disabled-foreground",
  {
    variants: {
      size: {
        // Figma: default is a 16px control in a 24px hit (`Size/size-6`);
        // `sm` is the same 16px control in a 20px hit (`Size/size-5`).
        default: "text-base [&_[data-slot=checkbox-button-hit]]:size-6",
        sm: "text-sm [&_[data-slot=checkbox-button-hit]]:size-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type CheckboxListInputProps = CheckboxPrimitive.Root.Props &
  VariantProps<typeof checkboxListInputVariants> & {
    /** Text beside the control. */
    children?: ReactNode;
    /** Class applied to the wrapping label rather than the control. */
    className?: string;
    /**
     * Facet count, right-aligned. Omit it and the count is not rendered —
     * Figma's `showCount` boolean, expressed as the absence of a value.
     */
    count?: ReactNode;
  };

/**
 * A checkbox with its label and optional count. Wrapping both in a `<label>`
 * is what makes the text clickable — Figma draws the row but cannot express
 * the association.
 *
 * `disabled` dims the label and count as well as the control. `size` is the
 * only cva axis; checked is owned by the control.
 */
function CheckboxListInput({
  className,
  children,
  count,
  size = "default",
  disabled,
  ...props
}: CheckboxListInputProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: CheckboxButton renders the input this label wraps.
    <label
      data-slot="checkbox-list-input"
      data-disabled={disabled || undefined}
      className={cn(
        checkboxListInputVariants({ size }),
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <span
        data-slot="checkbox-button-hit"
        className="flex shrink-0 items-center justify-center"
      >
        <CheckboxButton disabled={disabled} {...props} />
      </span>
      <span className="min-w-0 flex-1 text-foreground">{children}</span>
      {count != null ? (
        <span
          data-slot="checkbox-list-input-count"
          className="shrink-0 text-secondary-foreground group-has-data-disabled/checkbox-item:text-disabled-foreground"
        >
          {count}
        </span>
      ) : null}
    </label>
  );
}

export type { CheckboxListInputProps };
export { CheckboxListInput, checkboxListInputVariants };
