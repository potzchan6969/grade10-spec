import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type DetailRowProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * A label–value row for displaying one attribute in a compact details list.
 *
 * Figma component `Detail row` (`7035:268`). The label is left-aligned and
 * the value is right-aligned; long values can contain composed content such
 * as a certificate number with a verify link.
 */
function DetailRow({ label, children, className }: DetailRowProps) {
  return (
    <div
      className={cn(
        "flex w-full items-start justify-between gap-2 border-b border-border py-2",
        className,
      )}
      data-slot="detail-row"
    >
      <span
        className="text-sm leading-5 text-secondary-foreground whitespace-nowrap"
        data-slot="detail-row-label"
      >
        {label}
      </span>
      <span
        className="text-right text-sm leading-5 text-foreground"
        data-slot="detail-row-value"
      >
        {children}
      </span>
    </div>
  );
}

export type { DetailRowProps };
export { DetailRow };
