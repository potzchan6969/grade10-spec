"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@grade10/design-system/lib/utils";
import { X } from "@phosphor-icons/react";
import type { ComponentProps } from "react";

type ToastCloseProps = ComponentProps<typeof ButtonPrimitive>;

/**
 * Dismiss control for a toast. A 20px hit target with a 16px `X` glyph —
 * `Base/secondary-foreground` idle, `Base/foreground` on hover. Optional on
 * the toast (shown by default); carries an accessible name. Figma set
 * `Toast / Close` (`6332:3599`).
 */
function ToastClose({ className, ...props }: ToastCloseProps) {
  return (
    <ButtonPrimitive
      type="button"
      data-slot="toast-close"
      aria-label="Dismiss notification"
      className={cn(
        "inline-flex size-5 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-secondary-foreground transition-colors duration-150 ease-out outline-none hover:bg-transparent hover:text-foreground focus-visible:rounded-(--radius-full) focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      <X aria-hidden size={16} weight="bold" />
    </ButtonPrimitive>
  );
}

/** Glyph only — Sonner owns the button chrome around `icons.close`. */
function ToastCloseIcon() {
  return <X aria-hidden size={16} weight="bold" />;
}

export type { ToastCloseProps };
export { ToastClose, ToastCloseIcon };
