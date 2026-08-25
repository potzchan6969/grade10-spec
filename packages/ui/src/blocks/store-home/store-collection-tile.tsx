import { Center } from "@grade10/design-system/components/layout/center";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type StoreCollectionTileProps = {
  label: ReactNode;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  featured?: boolean;
  className?: string;
};

/**
 * One collection cell in the store home bento grid.
 *
 * Figma draws these as plain frames on the Store page (`4195:1051` and
 * siblings): a secondary fill, border, centred icon well, and label. The first
 * tile spans two columns and two rows; the rest are single cells.
 */
function StoreCollectionTile({
  label,
  icon,
  href,
  onClick,
  featured = false,
  className,
}: StoreCollectionTileProps) {
  const inner = (
    <VStack className="h-full" gap="md" hAlign="center" vAlign="center">
      <Center className="size-12 shrink-0 rounded-full bg-muted text-base text-secondary-foreground">
        {icon}
      </Center>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </VStack>
  );

  const tileClassName = cn(
    "rounded-xl border border-border bg-secondary p-4",
    // biome-ignore lint/plugin: bento cell heights are fixed in the Store page frame, not gap rungs
    featured ? "col-span-2 row-span-2 h-[244px]" : "col-span-1 h-[114px]",
    className,
  );

  if (href != null) {
    return (
      <a
        className={cn(tileClassName, "cursor-pointer no-underline")}
        data-featured={featured || undefined}
        data-slot="store-collection-tile"
        href={href}
      >
        {inner}
      </a>
    );
  }

  if (onClick != null) {
    return (
      <button
        className={cn(tileClassName, "cursor-pointer")}
        data-featured={featured || undefined}
        data-slot="store-collection-tile"
        onClick={onClick}
        type="button"
      >
        {inner}
      </button>
    );
  }

  return (
    <VStack
      className={tileClassName}
      data-featured={featured || undefined}
      data-slot="store-collection-tile"
      gap="none"
      hAlign="center"
      vAlign="center"
    >
      {inner}
    </VStack>
  );
}

export type { StoreCollectionTileProps };
export { StoreCollectionTile };
