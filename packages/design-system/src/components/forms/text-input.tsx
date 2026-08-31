import {
  Input,
  InputShell,
  type InputStatus,
  InputStatusIcon,
} from "@grade10/design-system/components/forms/input";
import type { ReactNode } from "react";
import { useId } from "react";

type TextInputProps = React.ComponentProps<"input"> & {
  /** Rendered above the field. Omit it and no label renders — Figma's
   * `showLabel`, expressed as the absence of a value. */
  label?: ReactNode;
  /** Helper or validation text below the field. Figma's `message`. */
  message?: ReactNode;
  /** The field's tone. Told to the component, never derived by it. */
  status?: InputStatus;
  /** Puts a spinner in the trailing slot, replacing the status icon. */
  loading?: boolean;
  /** Uneditable text before the value — currency symbol, etc. */
  prefix?: ReactNode;
};

/**
 * A labelled text field with a status tone and an optional message.
 *
 * Figma models four axes on this set, of which one is a prop: `state` is a CSS
 * pseudo-state, `status=placeholder` is what an empty field looks like rather
 * than a choice, and `isDisabled` is the native attribute. `status` is the
 * only axis with a code counterpart. The message stays
 * `Base/secondary-foreground` on every status — error and success tone the
 * border and trailing icon only.
 */
function TextInput({
  className,
  id,
  label,
  message,
  status = "default",
  loading = false,
  disabled,
  prefix,
  ...props
}: TextInputProps) {
  // Presentation-only: the label and message have to reference the control,
  // and a consumer that supplies its own `id` keeps it.
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = message ? `${inputId}-message` : undefined;

  return (
    <InputShell
      className={className}
      status={status}
      label={label}
      message={message}
      disabled={disabled}
      htmlFor={inputId}
      messageId={messageId}
      leading={
        prefix ? (
          <span
            data-slot="input-prefix"
            className="shrink-0 text-sm text-secondary-foreground"
          >
            {prefix}
          </span>
        ) : undefined
      }
      trailing={<InputStatusIcon status={status} loading={loading} />}
    >
      <Input
        id={inputId}
        disabled={disabled}
        aria-invalid={status === "error" || undefined}
        aria-describedby={messageId}
        {...props}
      />
    </InputShell>
  );
}

export type { TextInputProps };
export { TextInput };
