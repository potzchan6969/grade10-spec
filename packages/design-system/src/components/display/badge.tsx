import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Figma binds the badge corner to `Radius/radius-sm` (4px), which the
// `rounded-sm` utility cannot express — theme.preamble.css derives the scale
// proportionally from `--radius`, so it compiles to calc(--radius * 0.6). Bind
// the Foundation primitive directly, as button.tsx does for the same reason.
const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-(--radius-sm) border border-border py-0 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-secondary-foreground [a]:hover:bg-[color-mix(in_oklab,var(--secondary),white_5%)]",
        success: "bg-success text-success-foreground backdrop-blur-md",
        error: "bg-destructive text-destructive-foreground backdrop-blur-md",
        warning: "bg-warning text-warning-foreground backdrop-blur-md",
      },
      size: {
        default: "h-6 px-2",
        sm: "h-5 px-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
      size,
    },
  });
}

export { Badge, badgeVariants };
