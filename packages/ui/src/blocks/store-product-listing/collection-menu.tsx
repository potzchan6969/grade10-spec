import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type CollectionMenuProps = {
  children: ReactNode;
  className?: string;
};

/**
 * The bordered collection list inside `FilterPanel`. Figma frame
 * `Product / CollectionsMenu` (`4348:17190`).
 */
function CollectionMenu({ children, className }: CollectionMenuProps) {
  return (
    <nav
      className={cn(
        "rounded-(--radius-md) border border-sidebar-border bg-sidebar p-2",
        className,
      )}
      data-slot="collection-menu"
    >
      <VStack gap="xs">{children}</VStack>
    </nav>
  );
}

export type { CollectionMenuProps };
export { CollectionMenu };
