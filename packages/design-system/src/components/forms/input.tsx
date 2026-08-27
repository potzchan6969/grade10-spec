import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@grade10/design-system/lib/utils";
import { CheckCircle, CircleNotch, WarningCircle } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

/**
 * The bare control. It carries no box of its own — no border, no background,
 * no height — because `InputShell` owns all of that, the way Figma draws it:
 * one `Input` frame with the fill, stroke, radius and padding, and a text
 * layer inside it.
 *
 * Placeholder copy is `Base/muted-foreground` (Text Input placeholder
 * `2132:2714`, Search Input `2132:2783`). Disabled keeps `Base/foreground` —
 * the shell's `opacity-50` and fill swap carry the disabled look.
 */
function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      data-slot="input"
      className={cn(
        "w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

// `status` is the only axis the three input components share, and the only one
// with a code counterpart at all: Figma's `state` is a pseudo-state, its
// `placeholder` is an empty value rather than a choice, and `isDisabled` and
// `isLoading` are boolean gates.
//
// Focus keeps the status stroke and adds a matching 1px ring (Text Input
// `2132:2715`, Stepper `4623:395`) — error/success stay destructive/success,
// they do not flip to the default ring. Ring is inset so overflow-hidden
// ancestors (drawer, height reveals) cannot clip it.
//
// Disabled (Text `2132:2710`, Number `2176:4274`, Search `2132:2789`) is
// `Opacity/opacity-50` on the whole field plus a fill swap on the box to
// `Base/background-subtle` — not a `disabled-foreground` colour swap. Value,
// label, and message keep their resting tokens underneath the opacity.
const inputBoxVariants = cva(
  // Search Input (`2132:2782`) and Text Input (`2132:2715`) both bind
  // `Size/size-10`, `Radius/radius-full`, `Gap/gap-4` padding and `Gap/gap-2`
  // between the magnifier/value. Bind `radius-full` on the token, as Button
  // already does — `rounded-full` is a different number.
  "flex h-10 w-full items-center gap-2 rounded-(--radius-full) border bg-input px-4 transition-[color,box-shadow,border-color,background-color,opacity] focus-within:ring-1 focus-within:ring-inset has-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      status: {
        default:
          "border-border focus-within:border-ring focus-within:ring-ring",
        error:
          "border-destructive-ring focus-within:border-destructive-ring focus-within:ring-destructive-ring",
        success:
          "border-success-ring focus-within:border-success-ring focus-within:ring-success-ring",
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);

// Figma's message layer binds `Base/secondary-foreground` on every status —
// error and success tone the border and trailing icon only (Text Input
// `2132:2712` / `2132:2873`, Stepper `4623:345`).
const messageVariants = cva("text-xs text-secondary-foreground", {
  variants: {
    status: {
      default: "",
      error: "",
      success: "",
    },
  },
  defaultVariants: {
    status: "default",
  },
});

type InputStatus = NonNullable<VariantProps<typeof inputBoxVariants>["status"]>;

type InputShellProps = React.ComponentProps<"div"> &
  VariantProps<typeof inputBoxVariants> & {
    /** Rendered above the field. Its presence is Figma's `showLabel`. */
    label?: ReactNode;
    /** Rendered below the field. Figma's `message` — always secondary tone. */
    message?: ReactNode;
    /** Greys the field via opacity and swaps the box fill to background-subtle. */
    disabled?: boolean;
    /** Before the control — the search magnifier. */
    leading?: ReactNode;
    /** After the control — status icon, clear button or spinner. */
    trailing?: ReactNode;
    /** Ties the label to the control. */
    htmlFor?: string;
    /** Ties the message to the control, for `aria-describedby`. */
    messageId?: string;
    /** The control. */
    children?: ReactNode;
    /** Extra classes on the field box. */
    boxClassName?: string;
  };

/**
 * The label / field box / message stack every input in the design shares.
 *
 * Exported because the three components in this package compose it, and
 * because a product building a field the design has not drawn yet is better
 * served composing this than reimplementing the box.
 *
 * It holds no product state: `status`, `message` and `disabled` are told to it.
 */
function InputShell({
  className,
  status = "default",
  label,
  message,
  disabled,
  leading,
  trailing,
  htmlFor,
  messageId,
  children,
  boxClassName,
  ...props
}: InputShellProps) {
  return (
    <div
      data-slot="input-shell"
      data-status={status}
      data-disabled={disabled || undefined}
      className={cn(
        "group/input-shell flex w-full flex-col gap-2",
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {label ? (
        <label
          data-slot="input-label"
          htmlFor={htmlFor}
          className="text-sm font-medium text-secondary-foreground"
        >
          {label}
        </label>
      ) : null}
      <div
        data-slot="input-box"
        className={cn(
          inputBoxVariants({ status: disabled ? "default" : status }),
          disabled && "bg-background-subtle",
          boxClassName,
        )}
      >
        {leading}
        {children}
        {trailing}
      </div>
      {message ? (
        <span
          data-slot="input-message"
          id={messageId}
          className={messageVariants({
            status: disabled ? "default" : status,
          })}
        >
          {message}
        </span>
      ) : null}
    </div>
  );
}

/**
 * The trailing glyph for a status, and the rule that the spinner replaces it.
 *
 * One slot holds one icon: while loading, the status is being revalidated
 * rather than gone, so the spinner takes the slot and the message keeps its
 * tone. Agreed with design when the Figma grid was filled.
 *
 * Glyphs match Text Input (`2132:2715`): Phosphor WarningCircle / CheckCircle /
 * CircleNotch, toned with Status/destructive and Status/success. Regular
 * weight overrides the package IconProvider bold default — Figma draws thin
 * strokes on these status glyphs. Disabled does not recolour them; the shell's
 * opacity does.
 */
function InputStatusIcon({
  status = "default",
  loading = false,
}: {
  status?: InputStatus;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <span className="animate-spin text-secondary-foreground">
        <CircleNotch aria-hidden size={16} weight="regular" />
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="text-destructive">
        <WarningCircle aria-hidden size={16} weight="regular" />
      </span>
    );
  }
  if (status === "success") {
    return (
      <span className="text-success">
        <CheckCircle aria-hidden size={16} weight="regular" />
      </span>
    );
  }
  return null;
}

export type { InputShellProps, InputStatus };
export {
  Input,
  InputShell,
  InputStatusIcon,
  inputBoxVariants,
  messageVariants,
};
