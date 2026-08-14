import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type CheckboxListProps = ComponentProps<"div"> & {
  /** Group heading. Omit it and the heading is not rendered — Figma's
   * `showLabel` boolean, expressed as the absence of a value. */
  label?: ReactNode;
};

/**
 * A labelled stack of `CheckboxListInput`s. Unlike `RadioList`, the group does
 * not own a selected value — each item is independent.
 */
function CheckboxList({
  className,
  label,
  children,
  ...props
}: CheckboxListProps) {
  return (
    <div
      data-slot="checkbox-list"
      className={cn("flex w-full flex-col justify-center gap-2", className)}
      {...props}
    >
      {label ? (
        <span
          data-slot="checkbox-list-label"
          className="w-full text-sm font-medium text-secondary-foreground"
        >
          {label}
        </span>
      ) : null}
      <div
        data-slot="checkbox-list-items"
        className="flex w-full flex-col items-start gap-2"
      >
        {children}
      </div>
    </div>
  );
}

export type { CheckboxListProps };
export { CheckboxList };
