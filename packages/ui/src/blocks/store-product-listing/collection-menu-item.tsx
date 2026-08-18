import { cn } from "@grade10/design-system/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type CollectionMenuItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  /** Figma's `state` axis. Marks the active collection. */
  active?: boolean;
};

/**
 * One row in `CollectionMenu`. Figma set `Product / CollectionMenuItem`
 * (`4357:515`) has `state` = Default | Active. Hover is CSS-only.
 *
 * Active draws a primary-tinted fill, a left indicator, and foreground text;
 * default uses secondary-foreground. The label is consumer-owned.
 */
function CollectionMenuItem({
  className,
  active = false,
  disabled = false,
  children,
  type = "button",
  ...props
}: CollectionMenuItemProps) {
  return (
    <button
      aria-current={active ? "true" : undefined}
      className={cn(
        "relative flex h-10 w-full shrink-0 items-center gap-2 rounded-(--radius-md) px-3 text-left text-sm font-medium outline-none transition-colors duration-200 ease-out focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:text-disabled-foreground motion-reduce:transition-none",
        active
          ? "text-foreground"
          : "text-secondary-foreground hover:bg-accent",
        className,
      )}
      data-slot="collection-menu-item"
      disabled={disabled}
      type={type}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] bg-primary/10 shadow-[inset_0_1px_0_0_var(--border)] transition-opacity duration-200 ease-out motion-reduce:transition-none",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 bg-primary transition-opacity duration-200 ease-out motion-reduce:transition-none",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <span className="relative min-w-0 flex-1 truncate">{children}</span>
    </button>
  );
}

export type { CollectionMenuItemProps };
export { CollectionMenuItem };
