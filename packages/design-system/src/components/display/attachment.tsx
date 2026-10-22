import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const attachmentVariants = cva(
  "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-xl border border-border bg-card text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/50 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive-border data-[state=idle]:border-dashed",
  {
    variants: {
      size: {
        default: "gap-2 p-2 text-sm",
        sm: "gap-2 p-1.5 text-xs",
        xs: "gap-1.5 rounded-lg p-1 text-xs",
      },
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-24 flex-col has-data-[slot=attachment-content]:w-30",
      },
    },
  },
);

export type AttachmentState =
  | "idle"
  | "uploading"
  | "processing"
  | "error"
  | "done";

/**
 * One file or image attachment — media, name, metadata, actions, and an
 * upload `state` (`idle` | `uploading` | `processing` | `error` | `done`).
 * Registry `attachment` (base-nova), adapted: rows pulse while processing
 * (the registry `shimmer` utility is not generated) and actions ride on
 * `IconButton` — Button has no icon-only rung.
 */
function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: AttachmentState;
  }) {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(attachmentVariants({ size, orientation }), className)}
      {...props}
    />
  );
}

const attachmentMediaVariants = cva(
  "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-md group-data-[state=error]/attachment:border-destructive-border group-data-[state=error]/attachment:bg-destructive-muted group-data-[state=error]/attachment:text-destructive [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  },
);

/** Thumbnail well — an image preview (`variant="image"`) or a glyph. */
function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    />
  );
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
        className,
      )}
      {...props}
    />
  );
}

function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={cn(
        "block max-w-full min-w-0 truncate leading-5 font-medium group-data-[size=sm]/attachment:leading-4 group-data-[size=xs]/attachment:leading-4 group-data-[state=processing]/attachment:motion-safe:animate-pulse group-data-[state=uploading]/attachment:motion-safe:animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "block max-w-full min-w-0 truncate text-xs leading-4 text-secondary-foreground group-data-[state=error]/attachment:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "relative z-20 flex shrink-0 items-center justify-end gap-1 group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3",
        className,
      )}
      {...props}
    />
  );
}

/** Icon-only action (remove, retry…). Give it an accessible name. */
function AttachmentAction({
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="attachment-action"
      type={type}
      className={cn(
        "inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:size-3",
        className,
      )}
      {...props}
    />
  );
}

/** Full-card trigger that keeps the actions independently clickable. */
function AttachmentTrigger({
  className,
  render,
  type,
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? type : (type ?? "button"),
        className: cn("absolute inset-0 z-10 outline-none", className),
      },
      props,
    ),
    render,
    state: {
      slot: "attachment-trigger",
    },
  });
}

/** Horizontally scrollable, snapping row of attachments. Focusable so the scroll region is keyboard-reachable — give it an `aria-label`. */
function AttachmentGroup({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="attachment-group"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: axe requires keyboard access on scrollable regions (scrollable-region-focusable).
      tabIndex={0}
      className={cn(
        "flex min-w-0 snap-x snap-mandatory scroll-px-1 gap-3 overflow-x-auto overscroll-x-contain py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
        className,
      )}
      {...props}
    />
  );
}

export {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
};
