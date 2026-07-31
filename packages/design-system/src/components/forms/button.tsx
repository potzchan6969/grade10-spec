import { cn } from "@acetrader/design-system/lib/utils";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircleIcon } from "lucide-react";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:text-disabled-foreground aria-invalid:border-destructive-border aria-invalid:ring-3 aria-invalid:ring-destructive-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      // Bound to the Figma Button set (86:3459). Every fill/text pair below is
      // the variable that set binds, not an opacity approximation of it: the
      // `*-muted` tokens carry their own base colour (destructive-muted is
      // red-500 at 10%, while `bg-destructive/10` would compute red-400 at 10%).
      // Disabled is a token pair, not `opacity-50` — Figma fills the solid
      // variants with `disabled` and drops only the text colour on the
      // borderless ones, which is why `disabled:bg-disabled` is per-variant.
      variant: {
        default:
          "bg-primary-muted text-primary-muted-foreground hover:bg-primary-muted-hover disabled:bg-disabled",
        outline:
          "border-border bg-background hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        secondary:
          "bg-muted text-muted-foreground hover:bg-muted-hover aria-expanded:bg-muted-hover disabled:bg-disabled",
        ghost:
          "hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        destructive:
          "bg-destructive-muted text-destructive-muted-foreground hover:bg-destructive-muted-hover disabled:bg-disabled",
      },
      // Three rungs, read from the "Buttons Size Reference" section (96:546).
      // Size is not a variant axis on the published Button set — the reference
      // varies it by switching the mode of the Sizing collection, whose
      // `height`/`padding-x`/`gap`/`rounded`/`size`/`leading` come back
      // unprefixed for that reason. The rung names follow the `rounded`
      // binding, which resolves to the rounded-lg/md/sm primitives (8/6/4px).
      //
      // Every text pair maps exactly onto a Tailwind default: 16/24 text-base,
      // 14/20 text-sm, 12/16 text-xs.
      //
      // No `has-data-[icon=…]` padding compensation at any rung: padding-x is
      // bound per size while a leading icon is shown, so the design has no
      // tighten-on-icon behaviour to reproduce.
      size: {
        sm: "h-6 gap-1 rounded-sm px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        md: "h-8 gap-2 rounded-md px-2 text-sm",
        lg: "h-12 gap-2 rounded-lg px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /**
     * Renders the Figma `Type=Loading` state: a leading spinner, and the button
     * made non-interactive. That variant binds the same `Custom/disabled` fill
     * and `Custom/disabled-foreground` text as every `State=Disabled` variant,
     * so loading deliberately reuses the disabled treatment rather than adding
     * a colour of its own — setting `disabled` is what produces the fill.
     *
     * Figma draws Loading only on the default type, so pairing it with another
     * variant falls back to that variant's disabled treatment, which is the
     * consistent extrapolation rather than a designed state.
     */
    loading?: boolean;
  };

function Button({
  className,
  variant = "default",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading ? (
        <LoaderCircleIcon
          aria-hidden="true"
          className="animate-spin"
          data-icon="inline-start"
        />
      ) : null}
      {children}
    </ButtonPrimitive>
  );
}

export type { ButtonProps };
export { Button, buttonVariants };
