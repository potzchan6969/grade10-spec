"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { cn } from "@grade10/design-system/lib/utils";
import { X } from "@phosphor-icons/react";
import { type ComponentProps, useEffect, useRef } from "react";

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
 * `DialogTitle` is the `<h2>` that `aria-labelledby` points at; English titles
 * use Title Case (see `DialogTitle`). Optional `DialogSubtext` sits under it
 * in the header. Body prose uses `DialogDescription` inside `DialogBody`. Put
 * the primary action last in `DialogFooter` so it receives default focus on
 * open and Enter submits; a destructive confirm uses
 * `Button variant="destructive"`. On narrow viewports the footer stacks
 * full-width with the primary action on top (`flex-col-reverse`).
 */
function Dialog({
  modal = true,
  ...props
}: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" modal={modal} {...props} />;
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

/**
 * Locks document scroll for the lifetime of the backdrop. Base UI's
 * `useScrollLock` already runs when `modal`, but Storybook and nested
 * overflow containers can still chain wheel events to the page behind —
 * pin `html`/`body` overflow while the overlay is mounted.
 */
function useDocumentScrollLock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };
    const scrollbarGap = window.innerWidth - html.clientWidth;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`;
    }

    return () => {
      html.style.overflow = previous.htmlOverflow;
      body.style.overflow = previous.bodyOverflow;
      body.style.paddingRight = previous.bodyPaddingRight;
    };
  }, []);
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  useDocumentScrollLock();

  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 overscroll-none bg-overlay backdrop-blur-[calc(var(--blur-xl)/2)] duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 motion-reduce:animate-none motion-reduce:duration-0",
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
          // Figma frame max is 640px; cap to the dynamic viewport so short
          // phones and keyboards don't clip header/footer outside the screen.
          "fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-h-[min(640px,calc(100dvh-2rem))] max-w-(--container-lg) -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-hidden rounded-(--radius-4xl) border border-border-subtle bg-popover p-4 text-sm text-popover-foreground shadow-[0_24px_32px_-12px_var(--shadow-color,rgb(118_118_118_/_20%))] outline-none backdrop-blur-xl duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:animate-none motion-reduce:duration-0 sm:gap-6 sm:p-6",
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
 * Title block. Place `DialogTitle` and optional `DialogSubtext` as children.
 * Title and close share a row (`items-center`); subtext sits under the title
 * with a 4px gap and does not run under the close control.
 *
 * Figma's Dialog Header (`2159:3156`) publishes title + close only; subtext is
 * a code composition slot. The title is `text-lg/semibold` (`Base/foreground`)
 * and the close control is `IconButton` outline/sm (the set's defaults) with
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
      className={cn(
        "grid w-full shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <DialogCloseIcon className="col-start-2 row-start-1" />
      ) : null}
    </div>
  );
}

/**
 * Scroll region between the pinned header and footer. For content taller than
 * the viewport, this owns the overflow — matching the Figma body slot.
 * Body copy defaults to primary `text-base` (16px). Overflowing content gets
 * shadcn's scroll-aware top/bottom fade.
 */
function DialogBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "scroll-fade flex min-h-0 w-full flex-1 flex-col gap-4 overflow-x-clip overflow-y-auto overscroll-contain text-base leading-6 font-normal text-foreground",
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
        "flex w-full shrink-0 flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end",
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

/**
 * Dialog heading. English titles use Title Case — not a sentence — with short
 * prepositions such as `to` lower when they are not the first word
 * (`Sign In to Add to Cart`). See English copy in
 * `docs/governance/ui-component-contracts.md`.
 */
function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "col-start-1 row-start-1 min-w-0 text-lg leading-7 font-semibold text-balance text-foreground sm:truncate",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Optional supporting line under `DialogTitle` in the header. Muted
 * `text-sm` (`Base/secondary-foreground`) — not body copy. Prefer this for a
 * short hint; put longer prose in `DialogBody` via `DialogDescription`.
 */
function DialogSubtext({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="dialog-subtext"
      className={cn(
        "col-start-1 row-start-2 text-sm leading-5 font-normal text-secondary-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Body prose for a dialog. Lives in `DialogBody` at primary `text-base`.
 * Wires `aria-describedby` through Base UI's Description primitive.
 */
function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-base leading-6 font-normal text-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
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
  DialogSubtext,
  DialogTitle,
  DialogTrigger,
};
