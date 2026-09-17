import type { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioButton } from "@grade10/design-system/components/forms/radio-button";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type RadioCardProps = RadioPrimitive.Root.Props & {
  /** Primary line — address nickname, plan name, etc. */
  title?: ReactNode;
  /** Secondary lines under the title. */
  description?: ReactNode;
  /** Freeform body beside the radio when `title` / `description` are not enough. */
  children?: ReactNode;
  /**
   * Trailing control outside the selectable label (e.g. remove). Clicks here do
   * not toggle the radio.
   */
  action?: ReactNode;
  /** Class applied to the card shell. */
  className?: string;
};

/**
 * A single-select option drawn as a bordered card with a radio control.
 *
 * Use inside a `RadioList` (or `RadioGroup`). The card chrome and selected
 * border are owned here; the radio value still reports through the group.
 *
 * **No Figma component set yet** — Storybook-first extraction from the Winner
 * Order Confirm delivery address picker. Publish a Radio Card set before adding
 * axes or a Code Connect template.
 *
 * Disabled dims the whole card (`Opacity/opacity-50`), matching `RadioListItem`.
 * Selected uses `Base/primary` on the border and a light primary tint fill
 * (`primary` at 5%). Hover on an enabled card strengthens the border and fills
 * `Base/background-subtle`; selected hover steps the tint to 10%.
 */
function RadioCard({
  className,
  title,
  description,
  children,
  action,
  disabled,
  ...props
}: RadioCardProps) {
  return (
    <div
      data-slot="radio-card"
      data-disabled={disabled || undefined}
      className={cn(
        "flex w-full items-start gap-2 rounded-xl border border-border bg-card px-3 pt-3 pb-4 text-foreground transition-colors",
        "has-[[data-slot=radio-button][data-checked]]:border-primary has-[[data-slot=radio-button][data-checked]]:bg-primary/5",
        disabled
          ? "opacity-50"
          : [
              "hover:border-border-strong hover:bg-background-subtle",
              "has-[[data-slot=radio-button][data-checked]]:hover:border-primary",
              "has-[[data-slot=radio-button][data-checked]]:hover:bg-primary/10",
            ],
        className,
      )}
    >
      {/* biome-ignore lint/a11y/noLabelWithoutControl: RadioButton renders the input this label wraps. */}
      <label
        data-slot="radio-card-label"
        className={cn(
          "flex min-w-0 flex-1 items-start gap-2 text-sm",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
        )}
      >
        <RadioButton
          {...props}
          disabled={disabled}
          className={disabled ? "disabled:opacity-100" : undefined}
        />
        <span
          data-slot="radio-card-content"
          className="flex min-w-0 flex-1 flex-col items-start gap-0.5"
        >
          {title != null ? (
            <span
              data-slot="radio-card-title"
              className="text-sm leading-6 font-medium text-foreground"
            >
              {title}
            </span>
          ) : null}
          {description != null ? (
            <span
              data-slot="radio-card-description"
              className="whitespace-pre-line text-sm text-secondary-foreground"
            >
              {description}
            </span>
          ) : null}
          {children}
        </span>
      </label>
      {action != null ? (
        <div
          data-slot="radio-card-action"
          className="flex h-6 shrink-0 items-center"
        >
          {action}
        </div>
      ) : null}
    </div>
  );
}

export type { RadioCardProps };
export { RadioCard };
