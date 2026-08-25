import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowRight } from "@phosphor-icons/react";
import type { ReactNode } from "react";

/** Words the section header renders the same on every home section. */
type StoreSectionHeaderCopy = {
  browseAll: string;
};

type StoreSectionHeaderProps = {
  copy: StoreSectionHeaderCopy;
  title: ReactNode;
  browseAllHref?: string;
  onBrowseAllClick?: () => void;
  className?: string;
};

/**
 * A home-section heading with an optional browse-all link.
 *
 * Figma draws this pattern on the Store page collections and product sections
 * (`4195:1048`, `4171:11876`): a bold title on the left and a secondary link
 * with a trailing arrow on the right.
 */
function StoreSectionHeader({
  copy,
  title,
  browseAllHref,
  onBrowseAllClick,
  className,
}: StoreSectionHeaderProps) {
  const showBrowseAll = browseAllHref != null || onBrowseAllClick != null;

  return (
    <HStack
      className={cn("w-full", className)}
      data-slot="store-section-header"
      hAlign="space-between"
      vAlign="center"
    >
      <h2 className="min-w-0 flex-1 text-3xl font-bold text-foreground">
        {title}
      </h2>
      {showBrowseAll ? (
        browseAllHref != null ? (
          <Link
            href={browseAllHref}
            trailing={<ArrowRight aria-hidden size={14} />}
            variant="secondary"
          >
            {copy.browseAll}
          </Link>
        ) : (
          <Link
            onClick={onBrowseAllClick}
            render={<button type="button" />}
            trailing={<ArrowRight aria-hidden size={14} />}
            variant="secondary"
          >
            {copy.browseAll}
          </Link>
        )
      ) : null}
    </HStack>
  );
}

export type { StoreSectionHeaderCopy, StoreSectionHeaderProps };
export { StoreSectionHeader };
