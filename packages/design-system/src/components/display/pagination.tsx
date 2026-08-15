import { cn } from "@grade10/design-system/lib/utils";
import { CaretLeft, CaretRight, DotsThree } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

type PaginationProps = ComponentProps<"nav">;

function Pagination({ className, children, ...props }: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      data-slot="pagination"
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      {children}
    </nav>
  );
}

const paginationControlClassName =
  "inline-flex h-10 shrink-0 items-center justify-center rounded-(--radius-md) text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:text-disabled-foreground";

type PaginationLinkProps = ComponentProps<"button"> & {
  /** Figma's `isActive` axis. */
  isActive?: boolean;
};

function PaginationLink({
  className,
  isActive = false,
  children,
  ...props
}: PaginationLinkProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive || undefined}
      className={cn(
        paginationControlClassName,
        "size-10",
        isActive
          ? "bg-foreground text-primary-foreground"
          : "border border-border text-foreground hover:bg-accent active:bg-accent active:opacity-80",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type PaginationEllipsisProps = ComponentProps<"span"> & {
  /** Screen-reader name for the gap. Overridable so a localizing consumer is
   * not stuck with the English default. */
  label?: string;
};

function PaginationEllipsis({
  className,
  label = "More pages",
  ...props
}: PaginationEllipsisProps) {
  return (
    <span
      data-slot="pagination-ellipsis"
      className={cn(
        "inline-flex size-10 items-center justify-center text-foreground",
        className,
      )}
      {...props}
    >
      <DotsThree aria-hidden size={24} weight="bold" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

type PaginationPreviousProps = ComponentProps<"button"> & {
  children?: ReactNode;
};

function PaginationPrevious({
  className,
  children = "Prev",
  ...props
}: PaginationPreviousProps) {
  return (
    <button
      type="button"
      data-slot="pagination-previous"
      className={cn(
        paginationControlClassName,
        "gap-2 border border-border pr-3 pl-2 text-foreground hover:bg-accent active:bg-accent active:opacity-80",
        className,
      )}
      {...props}
    >
      <CaretLeft aria-hidden size={16} weight="bold" />
      {children}
    </button>
  );
}

type PaginationNextProps = ComponentProps<"button"> & {
  children?: ReactNode;
};

function PaginationNext({
  className,
  children = "Next",
  ...props
}: PaginationNextProps) {
  return (
    <button
      type="button"
      data-slot="pagination-next"
      className={cn(
        paginationControlClassName,
        "gap-2 border border-border pr-2 pl-3 text-foreground hover:bg-accent active:bg-accent active:opacity-80",
        className,
      )}
      {...props}
    >
      {children}
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
