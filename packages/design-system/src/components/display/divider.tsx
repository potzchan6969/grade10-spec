import { Separator } from "@grade10/design-system/components/display/separator";
import { cn } from "@grade10/design-system/lib/utils";
import { cva } from "class-variance-authority";
import { type ReactNode, useId } from "react";

const dividerVariants = cva("flex items-center", {
  variants: {
    orientation: {
      horizontal: "w-full flex-row",
      vertical: "inline-flex h-full flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const dividerLineVariants = cva("grow bg-border", {
  variants: {
    orientation: {
      horizontal: "h-px",
      vertical: "w-px",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

type DividerProps = Omit<React.ComponentProps<"div">, "children"> & {
  orientation?: "horizontal" | "vertical";
  /** Centred on the line, with a line either side of it. */
  label?: ReactNode;
};

/**
 * A separator that can carry a centred label — the `or` between two halves of
 * a sign-in form.
 *
 * Without a label it *is* `Separator`, forwarded unchanged, because a bare rule
 * has one correct implementation and this is not a second one. A label needs a
 * line either side of it, which a single element cannot be, so that case
 * renders a flex row and marks the lines decorative — nesting real separators
 * inside a separator would announce three of them.
 *
 * A separator takes no accessible name from its content, so the label is wired
 * up with `aria-labelledby` rather than left to be read (WCAG 1.3.1). A
 * consumer's own `aria-label` or `aria-labelledby` wins.
 *
 * It has no `strong` weight and no full-bleed escape, both of which the Astryx
 * component this follows does offer: `--color-border-emphasized` has no
 * counterpart in `tokens.json`, and full bleed reads container padding from
 * CSS variables no layout in this repository sets. Either would be a prop that
 * type-checks and does nothing.
 */
function Divider({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  label,
  orientation = "horizontal",
  ...props
}: DividerProps) {
  const labelId = useId();

  if (label == null) {
    return (
      <Separator
        data-slot="divider"
        orientation={orientation}
        className={className}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...props}
      />
    );
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: <hr> is void, so it cannot hold a label and the two lines either side of it.
    // biome-ignore lint/a11y/useFocusableInteractive: a separator is focusable only as a splitter widget; this one is structural.
    <div
      data-slot="divider"
      // biome-ignore lint/a11y/useAriaPropsForRole: aria-valuenow is required of a focusable separator, which this is not.
      role="separator"
      aria-orientation={orientation}
      aria-label={ariaLabel}
      aria-labelledby={
        ariaLabelledBy ?? (ariaLabel == null ? labelId : undefined)
      }
      className={cn(dividerVariants({ orientation }), className)}
      {...props}
    >
      <div aria-hidden className={dividerLineVariants({ orientation })} />
      <span
        id={labelId}
        data-slot="divider-label"
        className={cn(
          // Figma's Login Dialog divider (`4666:1471`) binds
          // `Base/secondary-foreground`, not muted.
          "shrink-0 text-secondary-foreground text-sm",
          orientation === "horizontal" ? "px-3" : "py-3",
        )}
      >
        {label}
      </span>
      <div aria-hidden className={dividerLineVariants({ orientation })} />
    </div>
  );
}

export type { DividerProps };
export { Divider, dividerVariants };
