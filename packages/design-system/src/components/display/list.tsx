import { cn } from "@grade10/design-system/lib/utils";
import type * as React from "react";

/**
 * A stack of `ListItem`s. Figma models it as a bare slot with no axes, so the
 * container carries no options of its own.
 */
function List({ className, children, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="list"
      className={cn("flex w-full flex-col items-start", className)}
      {...props}
    >
      {children}
    </ul>
  );
}

type ListItemProps = React.ComponentProps<"li"> & {
  /** Secondary line under the label. Omit it and the line is not rendered —
   * Figma's `showDescription` boolean, expressed as the absence of a value. */
  description?: React.ReactNode;
  /** Hairline along the bottom edge. Figma turns it off on the last item. */
  divider?: boolean;
};

function ListItem({
  className,
  children,
  description,
  divider = true,
  ...props
}: ListItemProps) {
  return (
    <li
      data-slot="list-item"
      className={cn(
        "flex w-full flex-col items-start gap-1 p-2 text-sm text-foreground",
        // Figma draws the divider as a bottom hairline on the item rather than
        // as a separator between items, which is why the last item switches it
        // off instead of the list dropping the final one.
        divider && "border-b border-border",
        className,
      )}
      {...props}
    >
      {children}
      {description ? (
        <span
          data-slot="list-item-description"
          className="w-full text-xs text-secondary-foreground"
        >
          {description}
        </span>
      ) : null}
    </li>
  );
}

export type { ListItemProps };
export { List, ListItem };
