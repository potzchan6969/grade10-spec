import { cn } from "@grade10/design-system/lib/utils";
import { CaretLeft, CaretRight, DotsThree } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

type PaginationProps = ComponentProps<"nav">;

/**
 * Navigation for splitting long lists of content across multiple pages.
 * Figma `Pagination` (`4181:2010`).
 */
function Pagination({ className, children, ...props }: PaginationProps) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      {children}
    </nav>
  );
}

// Square controls bind Size/size-10 (40) and Radius/radius-md (6). Disabled is
// the variant's own colours at Opacity/opacity-50 *and* a
// Custom/disabled-foreground fill on the glyph — Figma draws both, so both
// land here. Pressed is the hover accent fill plus a 1px translate matching
// Button, with no opacity change.
const paginationControlClassName =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-(--radius-md) text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:text-disabled-foreground disabled:opacity-50 aria-disabled:pointer-events-none";

const paginationIdleClassName =
  "cursor-pointer border border-border text-foreground transition-[background-color,border-color,color,transform] duration-150 ease-out hover:bg-accent active:bg-accent active:not-aria-[haspopup]:translate-y-px motion-reduce:transition-[background-color,border-color,color] motion-reduce:active:translate-y-0";

type PaginationLinkProps = ComponentProps<"button"> & {
  /** Figma's `active` axis. The current page is a non-interactive
   * `aria-current="page"` span, not a button. */
  isActive?: boolean;
};

function PaginationLink({
  className,
  isActive = false,
  disabled = false,
  children,
  ...props
}: PaginationLinkProps) {
  const classes = cn(
    paginationControlClassName,
    isActive
      ? "bg-foreground text-primary-foreground"
      : paginationIdleClassName,
    className,
  );

  if (isActive) {
    return (
      <span
        aria-current="page"
        data-slot="pagination-link"
        data-active=""
        className={classes}
      >
        {children}
      </span>
    );
  }

  return (
    <button
      type="button"
      data-slot="pagination-link"
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}

type PaginationEllipsisProps = ComponentProps<"span"> & {
  /** @deprecated Figma marks the ellipsis `aria-hidden`. Kept so localizing
   * callers still type-check; it is not announced. */
  label?: string;
};

/**
 * A decorative ellipsis for the truncated gap, standing in for the pages
 * collapsed out of a long range. Figma `PaginationEllipsis` (`4181:1979`):
 * Size/size-7 × Size/size-10 (28×40) with a Size/size-5 (20) glyph.
 */
function PaginationEllipsis({
  className,
  label: _label,
  ...props
}: PaginationEllipsisProps) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "inline-flex h-10 w-7 items-center justify-center text-foreground",
        className,
      )}
      {...props}
    >
      <DotsThree aria-hidden size={20} weight="bold" />
    </span>
  );
}

type PaginationPreviousProps = ComponentProps<"button"> & {
  children?: ReactNode;
};

/**
 * Prev page control: disabled on the first page. Figma
 * `PaginationPrevious` (`4181:1996`) is an icon-only Size/size-10 control;
 * the accessible name is `aria-label`, or a string `children` value, or
 * "Previous page".
 */
function PaginationPrevious({
  className,
  children,
  disabled = false,
  "aria-label": ariaLabel,
  ...props
}: PaginationPreviousProps) {
  return (
    <button
      type="button"
      data-slot="pagination-previous"
      aria-label={
        ariaLabel ?? (typeof children === "string" ? children : "Previous page")
      }
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={cn(
        paginationControlClassName,
        paginationIdleClassName,
        className,
      )}
      {...props}
    >
      <CaretLeft aria-hidden size={16} weight="bold" />
    </button>
  );
}

type PaginationNextProps = ComponentProps<"button"> & {
  children?: ReactNode;
};

/**
 * Next page control: disabled on the last page. Figma `PaginationNext`
 * (`4181:2009`) is an icon-only Size/size-10 control; the accessible name is
 * `aria-label`, or a string `children` value, or "Next page".
 */
function PaginationNext({
  className,
  children,
  disabled = false,
  "aria-label": ariaLabel,
  ...props
}: PaginationNextProps) {
  return (
    <button
      type="button"
      data-slot="pagination-next"
      aria-label={
        ariaLabel ?? (typeof children === "string" ? children : "Next page")
      }
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={cn(
        paginationControlClassName,
        paginationIdleClassName,
        className,
      )}
      {...props}
    >
      <CaretRight aria-hidden size={16} weight="bold" />
    </button>
  );
}

export type {
  PaginationEllipsisProps,
  PaginationLinkProps,
  PaginationNextProps,
  PaginationPreviousProps,
  PaginationProps,
};
export {
  Pagination,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
