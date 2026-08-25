import { cn } from "@grade10/design-system/lib/utils";
import { DotsThree } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

type BreadcrumbsProps = ComponentProps<"nav">;

/**
 * A trail of links showing the current page's location in a navigational hierarchy.
 * Figma `Breadcrumbs` (`4180:1293`).
 */
function Breadcrumbs({ className, children, ...props }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      data-slot="breadcrumbs"
      className={cn("flex flex-wrap items-center gap-1", className)}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-1">{children}</ol>
    </nav>
  );
}

type BreadcrumbItemProps = ComponentProps<"a"> & {
  /** Figma's `isCurrent` axis. Renders as the current page, not a link. */
  current?: boolean;
  disabled?: boolean;
  children?: ReactNode;
};

/**
 * One crumb's <li> wrapper.
 * Figma `BreadcrumbItem` (`4180:1290`). `current` is the only consumer-facing axis;
 * hover and focus are CSS pseudo-states, and `disabled` is the other boolean gate.
 */
function BreadcrumbItem({
  className,
  current = false,
  disabled = false,
  children,
  href,
  ...props
}: BreadcrumbItemProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-(--radius-sm) p-1 text-sm font-medium outline-none transition-colors",
    current
      ? "text-foreground"
      : "text-secondary-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
    disabled && "pointer-events-none opacity-50",
    className,
  );

  if (current) {
    return (
      <li data-slot="breadcrumb-item" className="inline-flex">
        <span aria-current="page" className={classes}>
          {children}
        </span>
      </li>
    );
  }

  return (
    <li data-slot="breadcrumb-item" className="inline-flex">
      <a
        aria-disabled={disabled || undefined}
        className={classes}
        href={disabled ? undefined : href}
        {...props}
      >
        {children}
      </a>
    </li>
  );
}

/**
 * The divider between crumbs. Decorative (`aria-hidden`); renders a chevron unless you pass `children`.
 * Figma `BreadcrumbSeparator` (`4180:1276`).
 */
function BreadcrumbSeparator({
  className,
  children = "/",
  ...props
}: ComponentProps<"li">) {
  return (
    <li
      aria-hidden
      data-slot="breadcrumb-separator"
      className={cn(
        "inline-flex items-center justify-center text-sm font-normal text-secondary-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </li>
  );
}

/**
 * A "…" placeholder for collapsed crumbs. Decorative, with an `sr-only` "More" label.
 * Figma `BreadcrumbEllipsis` (`4180:1291`).
 */
function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <li data-slot="breadcrumb-ellipsis" className="inline-flex">
      <span
        className={cn(
          "inline-flex h-7 w-5 items-center justify-center text-secondary-foreground",
          className,
        )}
        {...props}
      >
        <DotsThree aria-hidden size={20} weight="bold" />
        <span className="sr-only">More</span>
      </span>
    </li>
  );
}

export type { BreadcrumbItemProps, BreadcrumbsProps };
export { BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbSeparator, Breadcrumbs };
