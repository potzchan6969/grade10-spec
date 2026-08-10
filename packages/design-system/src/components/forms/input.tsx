import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  LoaderCircleIcon,
} from "lucide-react";
import type { ReactNode } from "react";

/**
 * The bare control. It carries no box of its own — no border, no background,
 * no height — because `InputShell` owns all of that, the way Figma draws it:
 * one `Input` frame with the fill, stroke, radius and padding, and a text
 * layer inside it.
 */
function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      data-slot="input"
      className={cn(
        "w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-secondary-foreground disabled:pointer-events-none disabled:text-disabled-foreground",
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
// Focus wins the border on every status — agreed with design when the Figma
// grid was filled, so an error field still shows where the caret is.
const inputBoxVariants = cva(
  // Figma binds the corner to `Radius/radius-sm` (4px), which `rounded-sm`
  // cannot express: theme.preamble.css derives the scale from `--radius`, so it
  // compiles to calc(--radius * 0.6) = 4.8px. Bind the primitive directly, as
  // button.tsx and badge.tsx already do.
  "flex h-8 w-full items-center gap-2 rounded-(--radius-sm) border bg-input px-3 transition-colors focus-within:border-ring has-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      status: {
        default: "border-border",
        error: "border-destructive-ring",
        success: "border-success-ring",
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);

const messageVariants = cva("text-xs", {
  variants: {
    status: {
      default: "text-secondary-foreground",
      error: "text-destructive-foreground",
      success: "text-success-foreground",
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
    /** Rendered below the field, toned by `status`. Figma's `message`. */
    message?: ReactNode;
    /** Greys every tone and drops the border back to the resting one. */
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
  ...props
}: InputShellProps) {
  return (
    <div
      data-slot="input-shell"
      data-status={status}
      data-disabled={disabled || undefined}
      className={cn("group/input-shell flex w-full flex-col gap-2", className)}
      {...props}
    >
      {label ? (
        <label
          data-slot="input-label"
          htmlFor={htmlFor}
          className={cn(
            "text-sm text-secondary-foreground",
            disabled && "text-disabled-foreground",
          )}
        >
          {label}
        </label>
      ) : null}
      <div
        data-slot="input-box"
        className={cn(
          inputBoxVariants({ status: disabled ? "default" : status }),
          // Disabled overrides every tone, including the status icon, which is
          // why it is a class on the box rather than a prop on each part.
          disabled &&
            "text-disabled-foreground [&_svg]:text-disabled-foreground",
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
          className={cn(
            messageVariants({ status: disabled ? "default" : status }),
            disabled && "text-disabled-foreground",
          )}
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
 */
function InputStatusIcon({
  status = "default",
  loading = false,
}: {
  status?: InputStatus;
  loading?: boolean;
}) {
  if (loading) return <LoaderCircleIcon className="animate-spin" />;
  if (status === "error") return <CircleAlertIcon />;
  if (status === "success") return <CircleCheckIcon />;
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
