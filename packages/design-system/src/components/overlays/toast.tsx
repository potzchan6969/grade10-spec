"use client";

import { cn } from "@grade10/design-system/lib/utils";
import {
  Bell,
  CheckCircle,
  CircleNotch,
  Info,
  Warning,
  XCircle,
} from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import type { CSSProperties, ReactNode } from "react";
import {
  type ExternalToast,
  Toaster as Sonner,
  type ToasterProps as SonnerToasterProps,
  toast as sonnerToast,
} from "sonner";
import { ToastCloseIcon } from "./toast-close";

type ToastProps = SonnerToasterProps;

type ToastMessage = (() => ReactNode) | ReactNode;

const defaultIcons = {
  success: (
    <span className="inline-flex text-success">
      <CheckCircle aria-hidden size={16} weight="fill" />
    </span>
  ),
  error: (
    <span className="inline-flex text-destructive">
      <XCircle aria-hidden size={16} weight="fill" />
    </span>
  ),
  warning: (
    <span className="inline-flex text-warning">
      <Warning aria-hidden size={16} weight="fill" />
    </span>
  ),
  info: (
    <span className="inline-flex text-info">
      <Info aria-hidden size={16} weight="fill" />
    </span>
  ),
  loading: (
    <span className="inline-flex animate-spin text-foreground">
      <CircleNotch aria-hidden size={16} weight="bold" />
    </span>
  ),
  close: <ToastCloseIcon />,
} as const;

const defaultToastIcon = (
  <span className="inline-flex text-secondary-foreground">
    <Bell aria-hidden size={16} weight="fill" />
  </span>
);

/** Figma `type=default` draws an optional Bell; pass `icon: null` to hide it. */
function withDefaultIcon(data?: ExternalToast): ExternalToast | undefined {
  if (data?.icon !== undefined) return data;
  return { ...data, icon: defaultToastIcon };
}

/**
 * A brief, non-modal notification that appears at the edge of the screen to
 * inform users of a process or action outcome. Stacks when multiple toasts are
 * active. Dismisses automatically or via user action.
 *
 * **Positioning** Rendered in a fixed overlay region. Supports top-left,
 * top-center, top-right, bottom-left, bottom-center, bottom-right (default).
 *
 * **Timeout** Auto-dismisses after 5 s by default. Can be configured to persist
 * until explicitly dismissed. Swipe-to-dismiss supported.
 *
 * Figma set `Toast` (`6332:3644`). Five `type` rungs — `default`, `success`,
 * `error`, `warning`, `info` — share one shell: `Base/popover` fill,
 * `Base/border-subtle` stroke, `Radius/radius-3xl`, `Gap/gap-4` padding,
 * `Gap/gap-2` gutters, and a 360px width. Status icons are fixed 16px
 * filled glyphs in a 20px well (`Status/*` colours); only `default` swaps or
 * hides its icon (Bell).
 * Title is `text-sm/medium` in `Base/foreground` (a `<p>`/`<div>`, not a
 * heading); description is `text-sm/normal` in `Base/secondary-foreground`.
 * The optional action is a nested secondary `Button` `sm` — hover/focus on it
 * pauses the auto-dismiss timer, and activating it dismisses the toast. Close
 * (`Toast / Close`, `6332:3599`) is a 20px hit target with a 16px `X`:
 * `Base/secondary-foreground` idle, `Base/foreground` on hover. Mount one
 * `<Toast />` at the app root; emit toasts with `toast()` / `toast.success()`
 * and the rest. ARIA: each toast is `role="status"` with `aria-live="polite"`
 * and does not steal focus. Enter/exit, stacking, and swipe honour reduced
 * motion.
 */
function Toast({
  theme: themeProp,
  toastOptions,
  icons,
  position = "bottom-right",
  duration = 5000,
  closeButton = true,
  className,
  style,
  ...props
}: ToastProps) {
  const { theme = "system" } = useTheme();
  const extra = toastOptions?.classNames;

  return (
    <Sonner
      theme={themeProp ?? (theme as ToastProps["theme"])}
      position={position}
      duration={duration}
      closeButton={closeButton}
      className={cn("toaster group", className)}
      icons={{ ...defaultIcons, ...icons }}
      style={
        {
          "--width": "360px",
          ...style,
        } as CSSProperties
      }
      toastOptions={{
        unstyled: true,
        duration,
        closeButton,
        closeButtonAriaLabel: "Dismiss notification",
        ...toastOptions,
        classNames: {
          ...extra,
          toast: cn(
            "group/toast pointer-events-auto relative grid w-[360px] grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2 overflow-clip rounded-(--radius-3xl) border border-border-subtle bg-popover p-4 text-popover-foreground shadow-[0_-4px_16px_0_var(--shadow-color,rgb(117_114_111_/_20%))]",
            extra?.toast,
          ),
          icon: cn(
            "col-start-1 row-start-1 inline-flex size-5 shrink-0 items-center justify-center [&_svg]:size-4",
            extra?.icon,
          ),
          content: cn(
            "col-start-2 row-start-1 flex min-w-0 flex-col",
            extra?.content,
          ),
          title: cn(
            "text-sm leading-5 font-medium break-words text-foreground",
            extra?.title,
          ),
          description: cn(
            "text-sm leading-5 font-normal break-words text-secondary-foreground",
            extra?.description,
          ),
          actionButton: cn(
            "col-start-2 row-start-2 mt-2 inline-flex h-8 w-fit shrink-0 cursor-pointer items-center justify-center rounded-(--radius-full) border border-transparent bg-muted px-3 text-xs font-medium text-foreground transition-[background-color,color] duration-150 ease-out outline-none hover:bg-background-subtle focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            extra?.actionButton,
          ),
          cancelButton: cn(
            "col-start-2 row-start-2 mt-2 inline-flex h-8 w-fit shrink-0 cursor-pointer items-center justify-center rounded-(--radius-full) border border-transparent bg-transparent px-3 text-xs font-medium text-foreground transition-colors duration-150 ease-out outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            extra?.cancelButton,
          ),
          closeButton: cn(
            "col-start-3 row-start-1 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-secondary-foreground transition-colors duration-150 ease-out outline-none hover:bg-transparent hover:text-foreground focus-visible:rounded-(--radius-full) focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-4",
            extra?.closeButton,
          ),
        },
      }}
      {...props}
    />
  );
}

const toast = Object.assign(
  (message: ToastMessage, data?: ExternalToast) =>
    sonnerToast(message, withDefaultIcon(data)),
  {
    success: sonnerToast.success,
    info: sonnerToast.info,
    warning: sonnerToast.warning,
    error: sonnerToast.error,
    message: (message: ToastMessage, data?: ExternalToast) =>
      sonnerToast.message(message, withDefaultIcon(data)),
    promise: sonnerToast.promise,
    dismiss: sonnerToast.dismiss,
    loading: sonnerToast.loading,
    custom: sonnerToast.custom,
    getHistory: sonnerToast.getHistory,
    getToasts: sonnerToast.getToasts,
  },
);

export type { ToastCloseProps } from "./toast-close";
export { ToastClose, ToastCloseIcon } from "./toast-close";
export type { ExternalToast, ToastProps };
/** @deprecated Use `Toast`. */
export { Toast, Toast as Toaster, toast };
