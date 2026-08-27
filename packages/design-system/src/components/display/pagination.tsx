import { cn } from "@grade10/design-system/lib/utils";
import { CaretLeft, CaretRight, DotsThree } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

type PaginationProps = ComponentProps<"nav">;

/**
 * Navigation for splitting long lists of content across multiple pages.
 * Figma `Pagination` (`4181:2010`) — a `Gap/gap-1` row of previous / page /
 * ellipsis / next controls.
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

// Square controls bind Size/size-10 (40) and Radius/radius-full (999) —
// PaginationLink `4181:1962`, Previous `4181:1984`. Idle resting is
// `Base/background` + `Base/border`; hover/pressed swap to
// `Base/background-subtle` + `Base/border-strong` (`4181:1964` / `4181:1966`).
// Pressed also dims the fill (`Opacity/opacity-80` in Figma); the border stays
// full-strength `border-strong` rather than inheriting that opacity, so the
// token still reads. Disabled is the resting colours at `Opacity/opacity-50`
// — the glyph stays `Base/foreground`, not a `disabled-foreground` swap
// (`4181:1968`, `4181:1993`). Active page fills `Base/primary` with
// `Base/primary-foreground` (`4181:1970`). Press keeps the 1px translate
// shared with Button.
const paginationControlClassName =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-(--radius-full) text-sm font-normal outline-none transition-[background-color,border-color,color,transform,opacity] duration-150 ease-out focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none";

const paginationIdleClassName =
  "cursor-pointer border border-border bg-background text-foreground hover:border-border-strong hover:bg-background-subtle active:border-border-strong active:bg-background-subtle/80 active:not-aria-[haspopup]:translate-y-px motion-reduce:transition-[background-color,border-color,color] motion-reduce:active:translate-y-0";

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
      ? "bg-primary text-primary-foreground"
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
