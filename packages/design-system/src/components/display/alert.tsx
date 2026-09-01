"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@grade10/design-system/lib/utils";
import { Bell, CheckCircle, Warning, X, XCircle } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, type ReactNode, useState } from "react";

const alertVariants = cva("flex w-full min-w-0 rounded-2xl border p-4", {
  variants: {
    layout: {
      block: "flex-col gap-2",
      inline: "flex-row items-center gap-1.5 overflow-clip",
    },
    status: {
      default: "border-border bg-background",
      error: "border-destructive-border bg-destructive-muted",
      warning: "border-warning-border bg-warning-muted",
      success: "border-success-border bg-success-muted",
    },
  },
  defaultVariants: {
    layout: "block",
    status: "default",
  },
});

const alertBodyGapVariants = cva(
  "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start",
  {
    variants: {
      status: {
        default: "gap-1.5",
        error: "gap-2",
        warning: "gap-2",
        success: "gap-2",
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);

const statusIcons = {
  default: Bell,
  error: XCircle,
  warning: Warning,
  success: CheckCircle,
} as const;

const statusIconColors = {
  default: "text-foreground",
  error: "text-destructive",
  warning: "text-warning",
  success: "text-success",
} as const;

type AlertProps = Omit<ComponentProps<"div">, "title"> &
  VariantProps<typeof alertVariants> & {
    /** Figma's `title` TEXT property. */
    title: ReactNode;
    /** Figma's `description` TEXT property. Block layout only — omit to hide. */
    description?: ReactNode;
    /**
     * Figma's `icon` INSTANCE_SWAP on `status=default` only. Status variants
     * draw their own icon; this replaces the default bell.
     */
    icon?: ReactNode;
    /**
     * Figma's `action` BOOLEAN — optional action row. Typically two `Button`
     * instances: outline (secondary) then primary, right-aligned, `size="sm"`.
     */
    actions?: ReactNode;
    /** Figma's `dismissable` BOOLEAN. */
    dismissible?: boolean;
    /** Called after the alert is dismissed and removed from the DOM. */
    onDismiss?: () => void;
  };

/**
 * Inline banner that communicates a status or event.
 *
 * Figma set `Alert` (`2176:3488`). Two layout rungs — `block` and `inline` —
 * combine with four severity levels (`default`, `error`, `warning`, `success`).
 * Each status carries a distinct icon and tinted shell: default is
 * `Base/background` with `Base/border`; the status variants bind `Custom/*-muted`
 * fills and matching borders. The shell rounds `Radius/radius-2xl` and pads
 * `Gap/gap-4`.
 *
 * **Block** stacks a body row and an optional action row at `Gap/gap-2`. The
 * body places a 20px icon in a 24px well, title at `text-base/medium`, and
 * description at `text-sm/normal` in `Base/secondary-foreground`.
 *
 * **Inline** flows icon, title, actions, and dismiss on one row at
 * `Gap/gap-1.5`, vertically centred. The icon well is 20px with a 16px glyph;
 * title is `text-sm/medium` only — description is not drawn. Good for slim
 * page-top banners once there is room.
 *
 * Status icons are decorative (`aria-hidden`); meaning is conveyed by colour
 * and text. The dismiss control is a 16px `X` in a 24px hit target with
 * `aria-label="Dismiss alert"`; click removes the alert from the DOM and calls
 * `onDismiss`. Actions are consumer-owned — Figma draws outline then primary
 * `Button` `sm` instances, right-aligned in block layout and trailing the
 * title in inline layout.
 */
function Alert({
  className,
  layout = "block",
  status = "default",
  title,
  description,
  icon,
  actions,
  dismissible = true,
  onDismiss,
  ...props
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  const resolvedLayout = layout ?? "block";
  const resolvedStatus = status ?? "default";
  const isInline = resolvedLayout === "inline";
  const StatusIcon = statusIcons[resolvedStatus];
  const iconColor = statusIconColors[resolvedStatus];
  const iconSize = isInline ? 16 : 20;
  const iconWellClass = isInline ? "size-5" : "size-6";
  const resolvedIcon =
    resolvedStatus === "default" && icon != null ? (
      icon
    ) : (
      <StatusIcon aria-hidden size={iconSize} weight="bold" />
    );

  function handleDismiss() {
    setDismissed(true);
    onDismiss?.();
  }

  const dismissControl = dismissible ? (
    <ButtonPrimitive
      type="button"
      data-slot="alert-dismiss"
      aria-label="Dismiss alert"
      className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-(--radius-full) text-secondary-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg]:shrink-0"
      onClick={handleDismiss}
    >
      <X aria-hidden size={16} weight="bold" />
    </ButtonPrimitive>
  ) : null;

  const iconWell = (
    <div
      data-slot="alert-icon"
      className={cn(
        "inline-flex shrink-0 items-center justify-center [&_svg]:shrink-0",
        iconWellClass,
        iconColor,
      )}
    >
      {resolvedIcon}
    </div>
  );

  return (
    <div
      data-slot="alert"
      data-layout={resolvedLayout}
      data-status={resolvedStatus}
      role="alert"
      className={cn(
        alertVariants({ layout: resolvedLayout, status: resolvedStatus }),
        className,
      )}
      {...props}
    >
      {isInline ? (
        <>
          {iconWell}
          <p
            data-slot="alert-title"
            className="min-w-0 flex-1 break-words text-sm leading-5 font-medium text-foreground"
          >
            {title}
          </p>
          {actions != null ? (
            <div
              data-slot="alert-actions"
              className="flex shrink-0 items-center gap-2"
            >
              {actions}
            </div>
          ) : null}
          {dismissControl}
        </>
      ) : (
        <>
          <div
            data-slot="alert-body"
            className={alertBodyGapVariants({ status: resolvedStatus })}
          >
            {iconWell}
            <div
              data-slot="alert-content"
              className="flex min-w-0 flex-col justify-center break-words"
            >
              <p
                data-slot="alert-title"
                className="text-base leading-6 font-medium text-foreground"
              >
                {title}
              </p>
              {description != null ? (
                <p
                  data-slot="alert-description"
                  className="text-sm leading-5 font-normal text-secondary-foreground"
                >
                  {description}
                </p>
              ) : null}
            </div>
            {dismissControl}
          </div>
          {actions != null ? (
            <div
              data-slot="alert-actions"
              className="flex w-full flex-wrap items-center justify-end gap-2"
            >
              {actions}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export type { AlertProps };
export { Alert, alertVariants };
