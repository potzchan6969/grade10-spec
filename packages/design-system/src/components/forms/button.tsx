import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircleIcon } from "lucide-react";
import { isValidElement, type ReactNode } from "react";

// Figma draws every disabled variant as that variant's own fill and text at
// `Opacity/opacity-50` — node `86:3694` (primary), `86:3690` (secondary) and
// `86:3592` (ghost) each bind their normal colour pair plus `Opacity/opacity-50`
// and bind no grey. So disabled is one base rule, not a per-variant colour swap.
//
// Every size binds `Radius/radius-full` (999) — the set is pills, not the
// `radius-sm` / `radius-lg` rungs an earlier drawing used. Hover on
// ghost/outline/secondary/destructive is `Custom/muted-hover`; primary hover
// keeps `Base/primary` and adds the named inner glow. Secondary's fill is
// `Base/muted`, not `Base/secondary`.
//
// Press is a 1px translate (same language as Pagination). Color and that
// translate transition at 150ms ease-out — tens-of-times-a-day feedback, named
// properties, no `transition-all`. Reduced motion keeps the color change and
// drops the shift.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-(--radius-full) border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-150 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-[background-color,border-color,color,box-shadow,opacity] motion-reduce:active:translate-y-0 aria-invalid:border-destructive-border aria-invalid:ring-3 aria-invalid:ring-destructive-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:shadow-[inset_0_0_20px_rgb(255_255_255_/_30%)]",
        outline:
          "border-border text-foreground hover:bg-muted-hover aria-expanded:bg-muted-hover",
        secondary:
          "bg-muted text-muted-foreground hover:shadow-[inset_0_0_0_100vmax_var(--muted-hover)] aria-expanded:shadow-[inset_0_0_0_100vmax_var(--muted-hover)]",
        ghost:
          "text-muted-foreground hover:bg-muted-hover aria-expanded:bg-muted-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:shadow-[inset_0_0_0_100vmax_var(--muted-hover)]",
      },
      size: {
        sm: "h-8 gap-1 px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        md: "h-10 gap-2 px-4 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  },
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** Shows a leading spinner and disables the button. Replaces `leading` and suppresses `trailing`, matching Figma's Loading state. */
    loading?: boolean;
    /** Icon rendered before `children`. */
    leading?: ReactNode;
    /** Icon rendered after `children`. */
    trailing?: ReactNode;
  };

function ButtonLeading({
  loading,
  leading,
}: {
  loading: boolean;
  leading?: ReactNode;
}) {
  if (!leading && !loading) return null;
  if (!leading) {
    return <LoaderCircleIcon aria-hidden="true" className="animate-spin" />;
  }

  // Icon swap (`09-icon-swap`): leading and spinner share one grid cell so
  // loading does not shift the label. 250ms ease-in-out, 2px blur, 0.25 start
  // scale — the recipe values. Reduced motion snaps.
  return (
    <span
      className="inline-grid shrink-0 [&>[data-icon]]:col-start-1 [&>[data-icon]]:row-start-1 [&>[data-icon]]:inline-flex [&>[data-icon]]:transition-[opacity,filter,transform] [&>[data-icon]]:duration-250 [&>[data-icon]]:ease-in-out [&>[data-icon]]:will-change-[opacity,filter,transform] motion-reduce:[&>[data-icon]]:transition-none"
      data-state={loading ? "b" : "a"}
    >
      <span
        className={
          loading
            ? "scale-[0.25] opacity-0 blur-[2px]"
            : "scale-100 opacity-100"
        }
        data-icon="a"
      >
        {leading}
      </span>
      <span
        aria-hidden="true"
        className={
          loading
            ? "scale-100 opacity-100"
            : "scale-[0.25] opacity-0 blur-[2px]"
        }
        data-icon="b"
      >
        <LoaderCircleIcon className="animate-spin" />
      </span>
    </span>
  );
}

/**
 * Whether what `render` will produce is a real `<button>`.
 *
 * Base UI has to know: a non-button claiming to be one silently loses the
 * native semantics forms and screen readers depend on, and a real button
 * claiming not to be gets Base UI's keyboard emulation stacked on the
 * browser's own. A `render` element already says which it is, so reading it
 * beats asking every call site to remember — the answer is in the JSX either
 * way.
 *
 * `undefined` where it cannot be read: a render *function* is opaque, and no
 * `render` at all means the primitive renders its own button. Both leave
 * Base UI's default standing. A component element resolves to `false`,
 * because the common case is a router link wrapping an `<a>`; one that really
 * does render a button passes `nativeButton` itself.
 */
function rendersNativeButton(
  render: ButtonProps["render"],
): boolean | undefined {
  if (!isValidElement(render)) return undefined;
  return render.type === "button";
}

function Button({
  className,
  variant = "default",
  size = "lg",
  loading = false,
  leading,
  trailing,
  disabled,
  children,
  nativeButton,
  render,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      nativeButton={nativeButton ?? rendersNativeButton(render)}
      render={render}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      <ButtonLeading leading={leading} loading={loading} />
      {children}
      {loading ? null : trailing}
    </ButtonPrimitive>
  );
}

export type { ButtonProps };
export { Button, buttonVariants };
