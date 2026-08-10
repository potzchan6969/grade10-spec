import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

// Figma models Link as its own component set (`96:341`), a peer of Button
// rather than a variant of it: no fill, no height, no padding, a resting
// underline, regular weight, and its own tonal axis. `variant` is the axis
// Button already spends on fills, which is why this cannot be a Button rung.
const linkVariants = cva(
  "group/link inline-flex w-fit items-center justify-center gap-1 font-normal underline decoration-solid decoration-from-font transition-colors outline-none [text-underline-position:from-font] focus-visible:rounded-(--radius-sm) focus-visible:ring-3 focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:text-disabled-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "text-foreground",
        secondary: "text-secondary-foreground",
        error: "text-destructive-foreground",
      },
      // The rungs are Figma's Sizing collection: 16/24, 14/20 and 12/16, each
      // with an icon matching its type size.
      size: {
        default: "text-base [&_svg:not([class*='size-'])]:size-4",
        sm: "text-sm [&_svg:not([class*='size-'])]:size-3.5",
        xs: "text-xs [&_svg:not([class*='size-'])]:size-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type LinkProps = useRender.ComponentProps<"a"> &
  VariantProps<typeof linkVariants> & {
    /** Renders the disabled tone and blocks pointer events. `<a>` has no
     * `disabled` attribute, so this sets `aria-disabled` rather than a
     * property the element does not have. */
    disabled?: boolean;
    /** Icon rendered after `children`. */
    trailing?: ReactNode;
  };

function Link({
  className,
  variant = "default",
  size = "default",
  disabled = false,
  trailing,
  children,
  render,
  ...props
}: LinkProps) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(linkVariants({ variant, size }), className),
        "aria-disabled": disabled || undefined,
        children: (
          <>
            {children}
            {trailing}
          </>
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "link",
      variant,
      size,
      disabled,
    },
  });
}

export type { LinkProps };
export { Link, linkVariants };
