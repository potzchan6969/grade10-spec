import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps } from "react";

type NavigationListProps = ComponentProps<"nav">;

/**
 * The primary navigation row. Figma set `Navigation List` (`4343:16418`) is a
 * slot with no variant axes — it draws a centred `gap-1` row and nothing else.
 * Items are `NavigationLink`s the consumer supplies.
 */
function NavigationList({
  className,
  children,
  ...props
}: NavigationListProps) {
  return (
    <nav
      aria-label="Primary"
      data-slot="navigation-list"
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      {children}
    </nav>
  );
}

export type { NavigationListProps };
export { NavigationList };
