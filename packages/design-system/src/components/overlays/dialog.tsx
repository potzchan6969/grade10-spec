"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { cn } from "@grade10/design-system/lib/utils";
import { X } from "@phosphor-icons/react";
import { type ComponentProps, useRef } from "react";

/**
 * A modal window that overlays the page for focused tasks and content.
 *
 * Use a dialog for a focused task or piece of content that should interrupt
 * the page – a form, a confirmation with detail.
 *
 * Open traps focus inside the popup. Escape and an outside click close it,
 * and focus returns to the trigger. Scroll and interaction with the rest of
 * the page are blocked while the dialog is open. Enter/exit motion is skipped
 * when the user prefers reduced motion.
 *
 * Base UI's popup already exposes `role="dialog"` and `aria-modal="true"`.
 * `DialogTitle` is the `<h2>` that `aria-labelledby` points at. Put the
 * primary action last in `DialogFooter` so it receives default focus on open
 * and Enter submits; a destructive confirm uses `Button variant="destructive"`.
 */
function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-overlay backdrop-blur-[calc(var(--blur-xl)/2)] duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 motion-reduce:animate-none motion-reduce:duration-0",
        className,
      )}
      {...props}
    />
  );
}

function DialogCloseIcon({ className }: { className?: string }) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      render={<IconButton aria-label="Close dialog" className={className} />}
    >
      <X aria-hidden />
    </DialogPrimitive.Close>
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = false,
  initialFocus,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) {
  const popupRef = useRef<HTMLDivElement>(null);

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          // max-h-[640px] is the Figma frame max, not a token.
          "fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-h-[640px] max-w-(--container-md) -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-hidden rounded-(--radius-4xl) border border-border-subtle bg-popover p-6 text-sm text-popover-foreground shadow-[0_24px_32px_-12px_var(--shadow-color,rgb(118_118_118_/_20%))] outline-none backdrop-blur-xl duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:animate-none motion-reduce:duration-0",
          className,
        )}
        initialFocus={
          initialFocus ??
          (() => {
            const primary = popupRef.current?.querySelector(
              '[data-slot="dialog-footer"] button:last-of-type',
            );
            return (primary as HTMLElement | undefined) ?? true;
          })
        }
        {...props}
        ref={popupRef}
      >
        {children}
        {showCloseButton ? (
          <DialogCloseIcon className="absolute top-6 right-6" />
        ) : null}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

/**
 * The title row of a dialog, with a close control on the trailing edge.
 *
 * Figma's Dialog Header (`2159:3156`) has no description — raise one with the
 * designer rather than leaving the set empty. Layout is `Gap/gap-2`, items
 * centered; the title is `text-lg/semibold` (`Base/foreground`) and the close
 * control is `IconButton` outline/sm (the set's defaults) with
 * `aria-label="Close dialog"`. It is last in the header tab order; default
 * focus on open still moves to the footer's last button so Enter confirms.
 */
function DialogHeader({
  className,
  showCloseButton = true,
  children,
  ...props
}: ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex w-full shrink-0 items-center gap-2", className)}
      {...props}
    >
      {children}
      {showCloseButton ? <DialogCloseIcon /> : null}
    </div>
  );
}

/**
 * Scroll region between the pinned header and footer. For content taller than
 * the viewport, this owns the overflow — matching the Figma body slot.
 * Overflowing content gets shadcn's scroll-aware top/bottom fade.
 */
function DialogBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "scroll-fade flex min-h-0 w-full flex-1 flex-col gap-4 overflow-x-clip overflow-y-auto",
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex w-full shrink-0 items-center justify-end gap-2",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" size="md" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "min-w-0 flex-1 truncate text-lg leading-7 font-semibold text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm leading-5 font-normal text-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
