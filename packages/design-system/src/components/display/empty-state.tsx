import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type EmptyStateProps = Omit<ComponentProps<"div">, "title"> & {
  /**
   * Figma's `isCompact` VARIANT. Compact shrinks padding, the icon well, the
   * glyph, the header gap, and the description type scale.
   */
  compact?: boolean;
  /**
   * Figma's `hasFrame=false` VARIANT. Frameless drops the dashed border,
   * subtle fill, and radius; padding and content scale stay with `compact`.
   */
  frameless?: boolean;
  /** Figma's `title` TEXT property. */
  title: ReactNode;
  /** Figma's `description` TEXT property. Omit to hide (Figma `hasDescription`). */
  description?: ReactNode;
  /** Figma's `icon` INSTANCE_SWAP. Omit to hide (Figma `hasIcon`). */
  icon?: ReactNode;
  /** Action row — typically `Button` instances. Omit to hide (Figma `hasActions`). */
  actions?: ReactNode;
};

/**
 * Empty state placeholder for no-data scenarios. Shows an icon, title,
 * description, and optional actions. Use isCompact for constrained areas.
 *
 * Figma set `Empty State` (`2571:46`). Two VARIANT axes: `isCompact` and
 * `hasFrame`. Compact shrinks padding (`p-6` → `p-4`), the icon well
 * (`size-12` → `size-10`), the glyph (24 → 20), the header gap (`gap-2` →
 * `gap-1`), and the description type scale (`text-sm` → `text-xs`). Title
 * stays `text-base/medium` in `Base/foreground` on every rung; description
 * is `Base/secondary-foreground`. With a frame (`hasFrame=true`, the
 * default), the shell fills `Base/background-subtle`, strokes `Base/border`
 * dashed, and rounds `Radius/radius-2xl`. Frameless drops that chrome and
 * keeps the same padding. Actions are consumer-owned — Figma draws two
 * `Button` `md` instances (secondary then primary).
 */
function EmptyState({
  className,
  compact = false,
  frameless = false,
  title,
  description,
  icon,
  actions,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      data-compact={compact || undefined}
      data-frameless={frameless || undefined}
      className={cn(
        "flex w-full flex-col items-center gap-4",
        frameless
          ? null
          : "rounded-2xl border border-dashed border-border bg-background-subtle",
        compact ? "p-4" : "p-6",
        className,
      )}
      {...props}
    >
      <div
        data-slot="empty-state-header"
        className={cn(
          "flex w-full flex-col items-center",
          compact ? "gap-1" : "gap-2",
        )}
      >
        {icon != null ? (
          <div
            data-slot="empty-state-icon"
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground [&_svg]:shrink-0",
              compact ? "size-10 [&_svg]:size-5" : "size-12 [&_svg]:size-6",
            )}
          >
            {icon}
          </div>
        ) : null}
        <p
          data-slot="empty-state-title"
          className="w-full text-center text-base leading-6 font-medium text-foreground"
        >
          {title}
        </p>
        {description != null ? (
          <p
            data-slot="empty-state-description"
            className={cn(
              "w-full text-center font-normal text-secondary-foreground",
              compact ? "text-xs leading-4" : "text-sm leading-5",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions != null ? (
        <div
          data-slot="empty-state-actions"
          className="flex w-full flex-wrap items-center justify-center gap-2"
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export type { EmptyStateProps };
export { EmptyState };
