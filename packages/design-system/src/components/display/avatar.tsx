"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "@grade10/design-system/lib/utils";
import type * as React from "react";

function Avatar({
  className,
  size = "lg",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      // The rung names are Figma's own (set `2159:3275`): xs/sm/md/lg/xl bind
      // Size/size-6, size-8, size-10, size-12 and size-16 — 24 / 32 / 40 / 48 / 64px.
      // `lg` is the 48px rung and the default, not the largest; the scale was
      // renamed one step down when `md` was added, so a `size="lg"` written
      // against the old names now renders 48px where it used to render 64.
      className={cn(
        "group/avatar relative flex size-12 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=md]:size-10 data-[size=sm]:size-8 data-[size=xl]:size-16 data-[size=xs]:size-6 dark:after:mix-blend-lighten",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className,
      )}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground [text-box-trim:trim-both] [text-box-edge:cap_alphabetic] group-data-[size=xs]/avatar:text-[10px] group-data-[size=sm]/avatar:text-xs",
        className,
      )}
      {...props}
    />
  );
}

/** One uppercase character for fallback avatars — the first letter of an email's
 * local part, or the first alphanumeric character of any label. */
function avatarInitial(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "?";

  const source = trimmed.includes("@")
    ? trimmed.slice(0, trimmed.indexOf("@"))
    : trimmed;
  const match = source.match(/[A-Za-z0-9]/);

  return match ? match[0].toUpperCase() : "?";
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
        // Figma draws no badge on Avatar, so these stay derived: roughly a
        // quarter of each rung, tracking the rungs above.
        "group-data-[size=xs]/avatar:size-2 group-data-[size=xs]/avatar:[&>svg]:hidden",
        "group-data-[size=sm]/avatar:size-2.5 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=md]/avatar:size-3 group-data-[size=md]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3.5 group-data-[size=lg]/avatar:[&>svg]:size-2.5",
        "group-data-[size=xl]/avatar:size-4 group-data-[size=xl]/avatar:[&>svg]:size-3",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=xs]/avatar-group:size-6 group-has-data-[size=md]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-8 group-has-data-[size=xl]/avatar-group:size-16 [&>svg]:size-5 group-has-data-[size=md]/avatar-group:[&>svg]:size-4 group-has-data-[size=sm]/avatar-group:[&>svg]:size-4 group-has-data-[size=xl]/avatar-group:[&>svg]:size-6",
        className,
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  avatarInitial,
};
