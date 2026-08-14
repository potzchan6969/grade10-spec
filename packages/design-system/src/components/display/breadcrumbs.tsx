import { cn } from "@grade10/design-system/lib/utils";
import { DotsThree } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

type BreadcrumbsProps = ComponentProps<"nav">;

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
 * One crumb. `current` is the only consumer-facing axis; hover and focus are
 * CSS pseudo-states, and `disabled` is the other boolean gate.
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
    "inline-flex items-center justify-center rounded-(--radius-sm) p-1 text-sm outline-none",
    current
      ? "font-medium text-foreground"
      : "font-normal text-muted-foreground hover:bg-accent hover:font-medium hover:text-foreground focus-visible:font-medium focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
    disabled && "pointer-events-none text-disabled-foreground",
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
        "inline-flex items-center justify-center text-sm text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <li data-slot="breadcrumb-ellipsis" className="inline-flex">
      <span
        className={cn(
          "inline-flex h-7 w-5 items-center justify-center text-muted-foreground",
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
