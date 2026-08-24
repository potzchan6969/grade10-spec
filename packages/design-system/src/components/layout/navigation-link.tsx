import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@grade10/design-system/lib/utils";

type NavigationLinkProps = useRender.ComponentProps<"a"> & {
  /** Figma's `active` axis. Marks the current surface. */
  active?: boolean;
  /** Figma's `disabled` axis. `<a>` has no `disabled` attribute, so this
   * sets `aria-disabled` rather than a property the element does not have. */
  disabled?: boolean;
};

/**
 * Links for moving between the main areas of an app or site.
 *
 * One item in a `NavigationList`. Figma set `NavigationLink` (`4344:508`)
 * has three VARIANT properties: `active`, `disabled`, and `state`. Hover is
 * a CSS pseudo-state with no prop behind it.
 *
 * Label is `Base/foreground` on every rung — not `accent-foreground`, which
 * is the orange brand fill. Active and hover share `Custom/muted-hover`.
 * Disabled is the same colours at `Opacity/opacity-50` — node `4344:506`
 * binds no grey — so it is one opacity rule, not a `disabled-foreground`
 * swap. Every variant binds `Radius/radius-full`.
 */
function NavigationLink({
  className,
  active = false,
  disabled = false,
  render,
  ...props
}: NavigationLinkProps) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap text-foreground outline-none transition-colors hover:bg-muted-hover focus-visible:ring-3 focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:hover:bg-transparent",
          active && "bg-muted-hover",
          className,
        ),
        "aria-current": active ? "page" : undefined,
        "aria-disabled": disabled || undefined,
      },
      props,
    ),
    render,
    state: {
      slot: "navigation-link",
      active,
      disabled,
    },
  });
}

export type { NavigationLinkProps };
export { NavigationLink };
